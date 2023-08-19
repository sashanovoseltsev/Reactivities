import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError";

const RegisterForm = () => {
  const { userStore } = useStore();
  return (
    <Formik initialValues={{displayName: '', userName: '', email: '', password: '', error: null}}
            validationSchema={Yup.object({
              displayName: Yup.string().required(),
              userName: Yup.string().required(),
              password: Yup.string().required(),
              email: Yup.string().required(),
            })}
            onSubmit={(values, {setErrors}) => userStore
              .register(values)
              .catch(error => setErrors({error}))}>
      {({handleSubmit, errors, isSubmitting, isValid, dirty}) => (
        <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
          <Header as='h2' content='Sign Up to Reactivities' color='teal' textAlign="center" />
          <MyTextInput name="email" placeholder="Email" />
          <MyTextInput name="userName" placeholder="User Name" />
          <MyTextInput name="displayName" placeholder="Display Name" />
          <MyTextInput name="password" placeholder="Password" type="password" />
          <ErrorMessage name='error' 
            render={() => (<ValidationError errors={errors.error} />)}
          />
          <Button loading={isSubmitting} 
            disabled={!isValid || !dirty || isSubmitting}
            type="submit" 
            positive fluid 
            content="Login"/>
        </Form>
      )}
    </Formik>
  )
}

export default observer(RegisterForm);