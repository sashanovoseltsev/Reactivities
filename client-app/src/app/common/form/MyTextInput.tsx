import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  label?: string;
}

const MyTextInput = (props: Props) => {
  const [field, meta] = useField(props.name);
  
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props} />
      {meta.touched && !!meta.error 
        ? (<Label style={{marginTop: '5px'}}  basic color='red' content={meta.error} />)
        : null }
    </Form.Field>
  )
}

export default MyTextInput;