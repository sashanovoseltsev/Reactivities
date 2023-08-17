import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  options: any;
  label?: string;
}

const MySelectInput = (props: Props) => {
  const [field, meta, helpers] = useField(props.name);
  
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select 
        placeholder={props.placeholder}
        options={props.options}
        value={field.value || null}
        onBlur={() => helpers.setTouched(true)}
        onChange={(_, data) => helpers.setValue(data.value)}
        clearable
      />
      {meta.touched && !!meta.error 
        ? (<Label style={{marginTop: '5px'}}  basic color='red' content={meta.error} />)
        : null }
    </Form.Field>
  )
}

export default MySelectInput;