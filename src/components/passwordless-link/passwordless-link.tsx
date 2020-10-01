import { Component, Prop, State, h, Host, Event, EventEmitter, Method, Watch } from '@stencil/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { validateEmail } from '../../common/validate';
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
  @Prop() emailLabel: string = '';
  @Prop() emailPlaceholder: string = "Your email address"
  @Prop() phoneLabel: string = '';
  @Prop() phonePlaceholder: string = "Your mobile number"

  @State() token: string | null = null;
  @State() startEndpoint: string;
  @State() tokenEndpoint: string;
  @State() tokenVerifyEndpoint: string;
  @State() tokenIntrospectEndpoint: string;
  @State() value: any;
  @State() timer: string;
  @State() accessToken: string;
  @State() idToken: string;
  @State() refreshToken: string;
  @State() loading: boolean = false;
  @State() pollingInterval = 15;
  @State() pollingAttempts = 0;
  @State() statusMsg: string = '';
  @State() idTokenPayload: any;
  @State() idTokenValid: boolean = false;
  @State() idTokenExp: any;
  @State() requestLogout: boolean = false;
  @State() isFormValid: boolean = false;
  @State() phoneHelp: string = '';

  @Event() authCompleted: EventEmitter<boolean>;

  componentWillLoad() {
    this.startEndpoint = `https://${this.tenantDomain}/api/passwordless/start`;
    this.tokenEndpoint = `https://${this.tenantDomain}/oauth2/token`;
    this.tokenIntrospectEndpoint = `https://${this.tenantDomain}/oauth2/token/introspect`;
    this.tokenVerifyEndpoint = `https://${this.tenantDomain}/oauth2/token/verify`;
    this.sessionSync()
  }

  sessionSync() {
    if (!sessionStorage.length && localStorage.hasOwnProperty('isLoggedIn') && JSON.parse(localStorage.getItem('isLoggedIn'))) {
      // Ask other tabs for session storage
      console.log('No session')
      localStorage.setItem('getSessionStorage', JSON.stringify(Date.now()));
    };
    window.addEventListener('storage', function (event) {
      console.log('Event is ', event.key);
      if (localStorage.hasOwnProperty('isLoggedIn') && !JSON.parse(localStorage.getItem('isLoggedIn'))) {
        // sessionStorage is filled -> clear it
        sessionStorage.clear();
        window.location.reload();
      } else if (event.key == 'getSessionStorage') {
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');
      } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
        // sessionStorage is empty -> fill it
        var data = JSON.parse(event.newValue), value: any;
        for (var key in data) {
          sessionStorage.setItem(key, data[key]);
        }
        window.location.reload();
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault()
    var data = {
      'client_id': this.clientId,
      'method': 'link',
      'channel': this.channel
    }
    this.channel === 'sms' ? data['phone'] = this.value : data['email'] = this.value;
    try {
      this.loading = true;
      this.statusMsg = '';
      let response = await fetch(this.startEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw await response.json();
      let json = await response.json();
      this.token = json.token;
      this.statusMsg = json.msg;
      'polling_interval' in json ? this.pollingInterval = json.polling_interval : 15;
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval * 1000));
      await this.handleTokenRequest()
    } catch (err) {
      console.log(err);
      if (err.hasOwnProperty('non_field_errors') || err.phone || err.email) {
        this.statusMsg = err.non_field_errors[0]
      }
      this.loading = false;
    }
  }

  async handleTokenRequest() {
    var data = {
      'grant_type': 'urn:axioms:params:oauth:passwordless:link',
      'client_id': this.clientId,
      'token': this.token
    }
    this.channel === 'sms' ? data['phone'] = this.value : data['email'] = this.value;
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
        // Add case for timeout or resend
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

  @Watch('value')
  checkInput() {
    if (this.channel == 'email') {
      this.isFormValid = validateEmail(this.value)
    }
    if (this.channel == 'sms') {
      var phoneUtil = PhoneNumberUtil.getInstance();
      try {
        this.isFormValid = phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(this.value));
      } catch (e) {
        this.isFormValid = false;
      }
      console.log(this.isFormValid);
      this.isFormValid ? this.phoneHelp = '' : this.phoneHelp = 'Mobile number in international format - a plus sign (+) followed by the country code and local mobile number.';
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
    await localStorage.setItem('isLoggedIn', JSON.stringify(false));
    await this.sessionSync();
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
      if (Math.floor(Date.now() / 1000) < this.get_session('id_exp', true) && this.get_session('is_valid_id_token', true) == true) {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
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
            {this.channel === 'sms'
              ? <slot name='phone-input'>
                <div>
                  <label htmlFor="phone">{this.phoneLabel}</label>
                  <input id="phone" name="phone" type="tel" pattern="[+]{1}[0-9]{11,14}" placeholder={this.phonePlaceholder} value={this.value} onInput={(e) => this.handleChange(e)}></input>
                  <small id="email" class="help-text">{this.phoneHelp}</small>
                </div>
              </slot>
              : <slot name='email-input'>
                <div>
                  <label htmlFor="email">{this.emailLabel}</label>
                  <input id="email" name="email" type="email" placeholder={this.emailPlaceholder} value={this.value} onInput={(e) => this.handleChange(e)}></input>
                </div>
              </slot>
            }
            <slot name='button'>
              <button type="submit" class="button button-outline" value="Submit" disabled={this.loading || !this.isFormValid}>{this.buttonLabel}</button>
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

