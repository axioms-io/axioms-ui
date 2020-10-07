# passwordless-link



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute            | Description                                                                                                                                                                     | Type      | Default                |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------- |
| `btnCssClass`               | `btn-css-class`      | Button css class. List of available classes: Size: `btn-sm`, `btn-md`, `btn-lg`.  Color: `btn-primary`, `btn-secondary`, `btn-success`, `btn-info`, `btn-outline-primary`, etc. | `string`  | `'btn-md btn-success'` |
| `channel`                   | `channel`            | Channel to deliver link 'email' or 'sms'                                                                                                                                        | `string`  | `'email'`              |
| `clientId` _(required)_     | `client-id`          | Axioms client id                                                                                                                                                                | `string`  | `undefined`            |
| `emailLabel`                | `email-label`        | Email field label                                                                                                                                                               | `string`  | `''`                   |
| `emailPlaceholder`          | `email-placeholder`  | Email field placeholder                                                                                                                                                         | `string`  | `"Your email address"` |
| `inputCssClass`             | `input-css-class`    | Input css classes. List of available classes: Size: `form-control-sm`, `form-control-md`, `form-control-lg`                                                                     | `string`  | `'form-control-md'`    |
| `isPopup`                   | `is-popup`           | Is custom element used in a pop-up?                                                                                                                                             | `boolean` | `false`                |
| `phoneLabel`                | `phone-label`        | Phone field label                                                                                                                                                               | `string`  | `''`                   |
| `phonePlaceholder`          | `phone-placeholder`  | Phone field placeholder                                                                                                                                                         | `string`  | `"Your mobile number"` |
| `startButtonLabel`          | `start-button-label` | Start button label                                                                                                                                                              | `string`  | `'Log In'`             |
| `tenantDomain` _(required)_ | `tenant-domain`      | Axioms tenant domain i.e. auth.example.com                                                                                                                                      | `string`  | `undefined`            |


## Events

| Event           | Description                                  | Type                   |
| --------------- | -------------------------------------------- | ---------------------- |
| `authCompleted` | Emits an event when authentication completed | `CustomEvent<boolean>` |


## Methods

### `getAccessToken() => Promise<string | null>`

Get access token

#### Returns

Type: `Promise<string>`



### `getIdToken() => Promise<string | null>`

Get id token

#### Returns

Type: `Promise<string>`



### `getIdTokenPayload() => Promise<any>`

Get id token payload

#### Returns

Type: `Promise<any>`



### `isAuthenticated() => Promise<boolean>`

Check if user is authenticated or not

#### Returns

Type: `Promise<boolean>`



### `logout() => Promise<void>`

Logout user by clearing session

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
