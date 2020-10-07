# Axioms UI ![NPM](https://img.shields.io/npm/v/@axioms/axioms-ui?style=flat-square)
Use Axioms web components to quickly add authentication in your static web sites and single page applications (SPA). To use these web components you will need an [Axioms](https://axioms.io) account and tenant. If you don't have an Axioms account you can [create one for free](https://axioms.io).

Currently we support following web components,

- `passwordless-code`: [Passwordless using Link](https://github.com/axioms-io/axioms-ui/tree/master/src/components/passwordless-link) authenticates users using one-time code sent via SMS/Email
- `passwordless-link`: [Passwordless using Link](https://github.com/axioms-io/axioms-ui/tree/master/src/components/passwordless-link) authenticates users using magic link sent via SMS/Email

To send code or link via SMS, you will need to setup your SMS provider. Currently we support Twilio, and Amazon SNS.


# Install

## As Script Tag
Add following script tags in HTML header,

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@axioms/axioms-ui@0.0.3/dist/axioms-ui/axioms-ui.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@axioms/axioms-ui@0.0.3/dist/axioms-ui/axioms-ui.js"></script>
```

## As NPM Package
Install NPM package,

```bash
npm i @axioms/axioms-ui
```

# Use
An example of how to use the web component with html,

```html
<passwordless-code channel="sms" tenant-domain="axioms.example.com" client-id="SWmAwjdKxGK3cDTBnCoBiFbDpbQKX6nW_JQUv5xgXma1Ta8WXFm88NvPr4tNQTvI" start-button-label="Get started now"  />
```

```html
<passwordless-link channel="email" tenant-domain="axioms.example.com" client-id="SWmAwjdKxGK3cDTBnCoBiFbDpbQKX6nW_JQUv5xgXma1Ta8WXFm88NvPr4tNQTvI" start-button-label="Get started now"  />
```

Additionally you can hide or show content based on authentication.

```html
<div style="display: none;" id="auth-content ">
    <p id="logged-in ">You are logged in.</p>
    <p id="logged-in-status "></p>
    <button class='btn' onclick="logout()">Logout now</button>
</div>
<script>
    var hasAuth = false;
    var idTokenPayload;

    document.addEventListener("DOMContentLoaded", checkAuth);

    async function checkAuth() {
        await customElements.whenDefined('passwordless-code');

        const passwordLinkElement = document.querySelector('passwordless-code');
        const authContentElement = document.getElementById("auth-content ");

        if (passwordLinkElement) {
            hasAuth = await passwordLinkElement.isAuthenticated();
            idTokenPayload = await passwordLinkElement.getIdTokenPayload();
            if (hasAuth) {
                authContentElement.style.display = "block ";
                var expires_at = new Date(idTokenPayload.exp * 1000).toLocaleString("en-US")
                var paragraph = document.getElementById("logged-in-status ");
                var status = document.createTextNode(
                    `Your username is ${idTokenPayload.preferred_username} and you session expires at ${expires_at}.`);
                paragraph.appendChild(status)
            } else {
                authContentElement.style.display = "none ";
            }
        }
    }
    const passwordLinkElement = document.querySelector('passwordless-code');
    passwordLinkElement.addEventListener('authCompleted', event => updateContent(event));

    function updateContent(event) {
        location.reload()
    }

    async function logout() {
        const passwordLinkElement = document.querySelector('passwordless-code');
        idTokenPayload = await passwordLinkElement.logout();
    }
</script>
```

# Styling
Set value for css variables to style web components according to your requirements.

```html
<style>
    @import url('https://fonts.googleapis.com/css2?family=Sen&display=swap');
    :root {
        --app-primary-color: #ff5136;
        --app-secondary-color: #6c757d;
        --app-text-color: #000;
        --app-font-family: 'Sen', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }
</style>
```

# Component Documentation
List of available props, events, and methods for each component.

- [Passwordless using Link](https://github.com/axioms-io/axioms-ui/tree/master/src/components/passwordless-link)
- [Passwordless using Code](https://github.com/axioms-io/axioms-ui/tree/master/src/components/passwordless-code)