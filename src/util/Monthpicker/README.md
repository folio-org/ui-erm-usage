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
`backendDateStandard` | string | format for saving year and month. | 'YYYY-MM' | false
`dateFormat` | string | format for saving year and month. | Intl.DateTimeFormat(intl.locale, { year: 'numeric', month: '2-digit' }) | false
`isRequired` | bool | if true, TextField (containing year and month) will be required | false | false
`textLabel` | string | visible field label | "" | false


## Monthpicker example

```
<Monthpicker
  backendDateFormat="YYYY-MM"
  dateFormat="MM/YYYY"
  textLabel="Label Monthpicker"
  isRequired={true}
/>
```


## Redux-form/Final Form usage

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
