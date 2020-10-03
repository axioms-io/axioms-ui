# passwordless-code



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute               | Description | Type      | Default                     |
| --------------------------- | ----------------------- | ----------- | --------- | --------------------------- |
| `btnCssClass`               | `btn-css-class`         |             | `string`  | `'btn-md btn-success'`      |
| `channel`                   | `channel`               |             | `string`  | `'email'`                   |
| `clientId` _(required)_     | `client-id`             |             | `string`  | `undefined`                 |
| `emailLabel`                | `email-label`           |             | `string`  | `''`                        |
| `emailPlaceholder`          | `email-placeholder`     |             | `string`  | `'Your email address'`      |
| `inputCssClass`             | `input-css-class`       |             | `string`  | `'form-control-md'`         |
| `isPopup`                   | `is-popup`              |             | `boolean` | `false`                     |
| `otpCodeButtonLabel`        | `otp-code-button-label` |             | `string`  | `'Verify and login'`        |
| `otpCodeLabel`              | `otp-code-label`        |             | `string`  | `''`                        |
| `otpCodePlaceholder`        | `otp-code-placeholder`  |             | `string`  | `'Enter verification code'` |
| `otpLength`                 | `otp-length`            |             | `number`  | `8`                         |
| `phoneLabel`                | `phone-label`           |             | `string`  | `''`                        |
| `phonePlaceholder`          | `phone-placeholder`     |             | `string`  | `'Your mobile number'`      |
| `startButtonLabel`          | `start-button-label`    |             | `string`  | `'Log In'`                  |
| `tenantDomain` _(required)_ | `tenant-domain`         |             | `string`  | `undefined`                 |


## Events

| Event           | Description | Type                   |
| --------------- | ----------- | ---------------------- |
| `authCompleted` |             | `CustomEvent<boolean>` |


## Methods

### `getIdTokenPayload() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `isAuthenticated() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `logout() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
