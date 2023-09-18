import { Field, FieldProps, Form, Formik } from "formik";
import { Loader } from "semantic-ui-react";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";

const ActivityChatForm = () => {

  const { commentStore } = useStore();

  return (
    <Formik
      onSubmit={(values, { resetForm }) =>
        commentStore.addComment(values).then(() => resetForm())}
      initialValues={{ body: '' }}
      validationSchema={Yup.object({
        body: Yup.string().required()
      })}
    >
      {({ isSubmitting, isValid, handleSubmit }) => (
        <Form className='ui form' style={{ marginTop: '20px' }}>
          <Field name='body'>
            {(props: FieldProps) => (
              <div style={{ position: 'relative' }}>
                <Loader active={isSubmitting} />
                <textarea
                  placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line)"
                  rows={2}
                  {...props.field}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.shiftKey) {
                      return;
                    }
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      isValid && handleSubmit();
                    }
                  }}
                />
              </div>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  )
}

export default ActivityChatForm;