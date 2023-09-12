import { Form, Formik } from "formik"
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";
import * as Yup from 'yup';
import { useStore } from "../../app/stores/store";
import UserProfile from "../../app/models/userProfile";

interface Props {
  onSubmitCallback: () => void
}

const ProfileAboutForm = ({ onSubmitCallback }: Props) => {
  const { userProfileStore: { userProfile, loadingProfile, updateProfile } } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required('Display Name is a required field.')
  })

  if (!userProfile) return null;

  const handleFormSubmit = async (values: UserProfile) => {
    await updateProfile(values);
    onSubmitCallback();
  }

  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize initialValues={userProfile} onSubmit={handleFormSubmit}
    >
      {({ handleSubmit, isValid, isSubmitting, dirty }) => (
        <Form className='ui form' onSubmit={handleSubmit}>
          <MyTextInput placeholder='Display Name' name='displayName' />
          <MyTextArea rows={3} placeholder='Bio' name='bio' />
          <Button
            disabled={!dirty || !isValid}
            loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
        </Form>
      )}
    </Formik>
  )
}

export default ProfileAboutForm;