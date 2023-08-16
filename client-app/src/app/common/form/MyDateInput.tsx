import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

// Partial<> here because onChange is a required property and we don't to obtain it from props,
// but instead take it from formik helpers
const MyDateInput = (props: Partial<ReactDatePickerProps>) => {
  const [field, meta, helpers] = useField(props.name!);
  
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker 
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={value => helpers.setValue(value)}          
      />
      {meta.touched && !!meta.error 
        ? (<Label basic color='red' content={meta.error} />)
        : null }
    </Form.Field>
  )
}

export default MyDateInput;