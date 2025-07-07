# Monthpicker
## Usage

```js
import { Monthpicker } from '@folio/ui-erm-usage/util/Monthpicker';

<Monthpicker />

// or pass as component inside a Field:
<Field component={Monthpicker} />
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`backendDateFormat` | string | format for saving year and month. | 'yyyy-MM' | false
`dateFormat` | string | format for display year and month. | Intl.DateTimeFormat(intl.locale, { year: 'numeric', month: '2-digit' }) | false
`isRequired` | bool | if true, TextField (containing year and month) will be required | false | false
`textLabel` | string | visible field label | "" | false
`input` | object | Form state provided by Redux Form or Final Form's `<Field>` component for accessing the current value `input.value` and update it `input.onChange(newValue)` | 
```
{
  name: '',
  value: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
}
```
| true
`meta` | object | Validation state provided by Redux Form or Final Form's `<Field>` to show the error message after interaction with the field | 
```
{
  touched: false,
  error: undefined,
}
```
| true


## Monthpicker example using Redux-form/Final Form

```
<Field
  backendDateFormat="YYYY-MM"
  component={Monthpicker}
  dateFormat="MM/YYYY"
  name="fieldName"
  textLabel="Label Monthpicker"
  isRequired={true}
/>
```
