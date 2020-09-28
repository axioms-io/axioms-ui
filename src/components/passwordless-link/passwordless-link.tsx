import { Component, Prop, State, h, Host, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'passwordless-link',
  styleUrl: 'passwordless-link.css',
  shadow: true,
})

export class PasswordlessLink {
  @Prop() tenantDomain!: string;
  @Prop() clientId!: string;
  @Prop() channel: string = 'email';
  @Prop() isPopup: boolean = false;
  @Prop() buttonLabel: string = 'Log In';

  @State() token: string;
  @State() startEndpoint: string;
  @State() tokenEndpoint: string;
  @State() tokenVerifyEndpoint: string;
  @State() tokenIntrospectEndpoint: string;
  @State() value: string;
  @State() timer: string;
  @State() accessToken: string;
  @State() idToken: string;
  @State() refreshToken: string;
  @State() loading: boolean = false;
  @State() pollingInterval = 15;
  @State() statusMsg: string = '';
  @State() idTokenPayload: any;
  @State() idTokenValid: boolean = false;
  @State() idTokenExp: any;

  @Event() authCompleted: EventEmitter<boolean>;

  componentWillLoad() {
    this.startEndpoint = `https://${this.tenantDomain}/api/passwordless/start`;
    this.tokenEndpoint = `https://${this.tenantDomain}/oauth2/token`;
    this.tokenIntrospectEndpoint = `https://${this.tenantDomain}/oauth2/token/introspect`;
    this.tokenVerifyEndpoint = `https://${this.tenantDomain}/oauth2/token/verify`;
  }

  async handleSubmit(e) {
    e.preventDefault()
    var data = {
      'client_id': this.clientId,
      'method': 'link',
      'channel': this.channel
    }
    this.channel === 'phone' ? data['phone'] = this.value : data['email'] = this.value;
    try {
      this.loading = true;
      let response = await fetch(this.startEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      this.token = json.token;
      this.statusMsg = json.msg;
      'polling_interval' in json ? this.pollingInterval = json.polling_interval : 15;
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval * 1000));
      await this.handleTokenRequest()
    } catch (err) {
      console.log(err);
      this.loading = false;
    }
  }

  async handleTokenRequest() {
    var data = {
      'grant_type': 'urn:axioms:params:oauth:passwordless:link',
      'client_id': this.clientId,
      'token': this.token
    }
    this.channel === 'phone' ? data['phone'] = this.value : data['email'] = this.value;
    try {
      this.loading = true;
      const searchParams = Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&');
      let response = await fetch(this.tokenEndpoint, {
        method: 'POST',
        body: searchParams,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (!response.ok) throw await response.json();
      let json = await response.json();
      'access_token' in json ? this.accessToken = json.access_token : '';
      'id_token' in json ? this.idToken = json.id_token : '';
      'refresh_token' in json ? this.refreshToken = json.refresh_token : '';
      await this.validateIdToken();
      await this.authCompletedHandler(true);
      this.statusMsg = '';
      this.loading = false;
    } catch (err) {
      console.log(err);
      switch (err.error) {
        case 'verification_pending':
          console.log('verification_pending')
          this.statusMsg = err.error_description;
          await new Promise(resolve => setTimeout(resolve, this.pollingInterval * 1000));
          await this.handleTokenRequest()
          break;
        default:
          this.statusMsg = err.error_description;
          this.loading = false;
          break;
      }
    }
  }

  @Method()
  async isAuthenticated() {
    try {
      if (await Math.floor(Date.now() / 1000) < this.get_session('id_exp', true) && this.get_session('is_valid_id_token', true) == true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  @Method()
  async getIdTokenPayload() {
    let payload = await this.get_session('id_payload', true)
    return payload
  }

  @Method()
  async logout() {
    await sessionStorage.clear();
    await this.authCompletedHandler(false);
  }

  async validateIdToken() {
    var data = {
      'token': this.idToken
    }
    try {
      let response = await fetch(this.tokenVerifyEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      if ('payload' in json) {
        this.idTokenPayload = json.payload;
        this.idTokenExp = json.payload.exp;
        this.set_session('id_payload', this.idTokenPayload, true);
        this.set_session('id_exp', this.idTokenExp)
      }
      if ('valid' in json) {
        this.idTokenValid = json.valid
        this.set_session('is_valid_id_token', json.valid)
      }

    } catch (err) {
      console.log(err);
      this.idTokenPayload = null;
      this.idTokenValid = false;
    }
  }

  authCompletedHandler(status: boolean) {
    this.authCompleted.emit(status);
  }

  set_session(suffix: string, value: any, stringify: boolean = false) {
    stringify ? sessionStorage.setItem(`_axioms.auth.${suffix}`, JSON.stringify(value)) :
      sessionStorage.setItem(`_axioms.auth.${suffix}`, value)
  }

  get_session(suffix: string, parse: boolean = false) {
    return parse ? JSON.parse(sessionStorage.getItem(`_axioms.auth.${suffix}`)) :
      sessionStorage.getItem(`_axioms.auth.${suffix}`)
  }

  handleChange(event) {
    this.value = event.target.value;
  }

  render() {
    return (
      <Host>
        {this.loading
          ? <div class="loader"></div>
          : <form onSubmit={(e) => this.handleSubmit(e)}>
            {this.channel === 'phone'
              ? <slot name='phone-input'>
                <div><input id="phone" name="phone" type="text" placeholder="Your Phone Number" value={this.value} onInput={(e) => this.handleChange(e)}></input></div>
              </slot>
              : <slot name='email-input'>
                <div><input id="email" name="email" type="email" placeholder="Your Email Address" value={this.value} onInput={(e) => this.handleChange(e)}></input></div>
              </slot>
            }
            <slot name='button'>
              <button type="submit" class="button button-primary" value="Submit" disabled={this.loading}>{this.buttonLabel}</button>
            </slot>
          </form>
        }
        <div class="status">
          <p>{this.statusMsg}</p>
        </div>
      </Host>
    );
  }

}

