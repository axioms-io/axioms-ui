# passwordless-link



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute           | Description | Type      | Default                |
| --------------------------- | ------------------- | ----------- | --------- | ---------------------- |
| `btnCssClass`               | `btn-css-class`     |             | `string`  | `'btn-md btn-success'` |
| `buttonLabel`               | `button-label`      |             | `string`  | `'Log In'`             |
| `channel`                   | `channel`           |             | `string`  | `'email'`              |
| `clientId` _(required)_     | `client-id`         |             | `string`  | `undefined`            |
| `emailLabel`                | `email-label`       |             | `string`  | `''`                   |
| `emailPlaceholder`          | `email-placeholder` |             | `string`  | `"Your email address"` |
| `inputCssClass`             | `input-css-class`   |             | `string`  | `'form-control-md'`    |
| `isPopup`                   | `is-popup`          |             | `boolean` | `false`                |
| `phoneLabel`                | `phone-label`       |             | `string`  | `''`                   |
| `phonePlaceholder`          | `phone-placeholder` |             | `string`  | `"Your mobile number"` |
| `tenantDomain` _(required)_ | `tenant-domain`     |             | `string`  | `undefined`            |


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
