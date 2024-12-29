![nuxt-true-validate](https://i.postimg.cc/rptcY1mx/nuxt-true-validate.png)
# Nuxt True Validate

[![npm version](https://img.shields.io/npm/v/nuxt-true-validate.svg)](https://www.npmjs.com/package/nuxt-true-validate) [![npm downloads](https://img.shields.io/npm/dt/nuxt-true-validate.svg)](https://www.npmjs.com/package/nuxt-true-validate)

`nuxt-true-validate` is a validation package specifically designed for Nuxt 3 applications. It provides a comprehensive set of rules to validate form fields and manage form states efficiently.

## Installation

To install the package in your Nuxt 3 project, run the following command:

```bash
npm install nuxt-true-validate
```

or

```bash
yarn add nuxt-true-validate
```

## Adding to Nuxt

To integrate `nuxt-true-validate` into your Nuxt project, include it in your `nuxt.config.ts` as follows:

```javascript
export default defineNuxtConfig({
  ...
  modules: [
    'nuxt-true-validate',
    // other modules
  ],
  ...
})
```

## Changing Language

To set the language to an existing option, use:

```javascript
export default defineNuxtConfig({
  ...
  trueValidate: {
    lang: 'en' // Options: 'fa', 'ar', 'tr'
  },
  ...
})
```

For a custom language, do the following:

```javascript
import customLanguage from 'path/to/language';

export default defineNuxtConfig({
  ...
  trueValidate: {
    lang: customLanguage
  },
  ...
})
```

## Usage

### Form Validation

```html
<template>
  ...
  <input type="text" v-model="myForm.field1.data" />
  <p v-if="myForm.field1.isDirty">Field1 has changed!</p>
  <p v-if="!myForm.field1.isValid && myForm.field1.error.length">Error: {{ myForm.field1.error }}</p>
  ...
  <input type="file" v-model="myForm.field2.data" @click="handleFile" />
  <p v-if="myForm.field2.isDirty">Field2 has changed!</p>
  <p v-if="!myForm.field2.isValid && myForm.field2.error.length">Error: {{ myForm.field2.error }}</p>
  ...
</template>

<script setup>
const myForm = TrueForm({
  field1: {
    default: String | Boolean | Array | Null | Number (required),
    name: String,
    rules: String | Array (required),
    each: Boolean
  },
  field2: {
    default: File | Null (required),
    name: String,
    rules: String | Array (required),
    each: Boolean
  },
});

const handleFile = (event) => {
  myForm.field2.set(event.target.files);
}
</script>
```

### Single Field Validation

```html
<template>
  ...
  <input type="text" v-model="field1.data" />
  <p v-if="field1.isDirty">Field1 has changed!</p>
  <p v-if="!field1.isValid && field1.error.length">Error: {{ field1.error }}</p>
  ...
  <input type="file" v-model="field2.data" @click="handleFile" />
  <p v-if="field2.isDirty">Field2 has changed!</p>
  <p v-if="!field2.isValid && field2.error.length">Error: {{ field2.error }}</p>
  ...
</template>

<script setup>
const field1 = TrueField({
  default: String | Boolean | Array | Null | Number (required),
  name: String (required),
  rules: String | Array (required),
  each: Boolean
});

const field2 = TrueField({
  default: File | Null (required),
  name: String (required),
  rules: String | Array (required),
  each: Boolean
});

const handleFile = (event) => {
  field2.set(event.target.files);
}
</script>
```

### Rules Format

The rules for validation can be specified as follows:

```javascript
...
rules: "required|min:3|_same:password|exists:one,two,three",
...
```

Or as an array:

```javascript
...
rules: [
  'required',
  'min:3',
  '_same:password',
  'exists:one,two,three',
  (value, otherProps) => {
    return {
      status: value === 'test',
      message: 'The :attribute: must be test.'
    };
  },
  otherCustomRuleMethod
],
...
```

In the array format, you can add new rule functions. Note that `otherProps` is only available in `TrueForm()`.

### Validating Array Inputs

The `each` property allows you to validate each child of an input array (e.g., for multiple file uploads).

## Available Rules

### `unload`

If the input value is empty, validation for that field will stop.

### `required`

Ensures that the field is not empty.

### `email`

Validates that the input is a valid email address.

### `min:<number>`

Checks that the length of the input is at least a specified number.

### `max:<number>`

Ensures that the length of the input does not exceed a specified number.

### `url`

Validates that the input is a valid URL.

### `integer`

Validates that the input value is an integer.

### `phone`

Validates that the input is a valid phone number.

### `length:<number>`

Checks that the length of the input is exactly a specified number.

### `starts:<str>`

Validates that the input value starts with the specified string.

### `ends:<str>`

Validates that the input value ends with the specified string.

### `exists:<...args>`

Validates that the input value exists in the provided list of arguments.

### `not_exists:<...args>`

Validates that the input value does not exist in the provided list of arguments.

### `file`

Validates that the input value is a file.

### `image`

Validates that the input value is an image file.

### `extensions:<...args>`

Validates that the input file's extension matches one of the specified extensions.

### `mimes:<...args>`

Validates that the input file's MIME type matches one of the specified MIME types.


### `size:<operator, ...args>`

Validates the size of the input file based on the specified operator and arguments.
- `operator`: The comparison operator (e.g., `=`, `!=`, `>`, `>=`, `<`, `<=`, `between`).
- `...args`: Size (the `between` operator requires **two** arguments, while others require **one** argument).

### `type:<type>`

Validates that the type of input matches the expected type.

### `is_true`

Validates that the input value is truthy.

### `is_false`

Validates that the input value is falsy.

### `regex:<regex>`

Validates that the input value matches the specified regular expression.

### Dependent Rules (available in TrueForm)

#### `_same:<sameWith>`

Validates that the input value is the same as the value of another property specified by `sameWith`. The `sameWith` parameter must correspond to another field key.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please feel free to create a pull request. We continually update and add more features!

## License

This project is licensed under the MIT License.
