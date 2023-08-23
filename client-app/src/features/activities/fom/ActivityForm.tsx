import { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import ActivityFormValues from '../../../app/models/activityFormValues';

const ActivityForm = () => {
  const { activityStore: { loadActivity, loading, createActivity, updateActivity } } = useStore();

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required.'),
    description: Yup.string().required(),
    category: Yup.string().required(),
    //date: Yup.string().required('Date is required').nullable(), - NOTE: date validation doesn't work now with react-date-picker
    city: Yup.string().required(),
    venue: Yup.string().required()
  })

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadActivity(id).then(a => setActivity(ActivityFormValues.FromActivity(a!)));
    }
    // empty dependency for component initialization purposes
    // eslint-disable-next-line
  }, [])

  if (loading) return <LoadingComponent />

  const handleFormSubmit = (activity: ActivityFormValues) => {
    if (!activity.id) {
      activity.id = v4();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik 
        validationSchema={validationSchema}
        enableReinitialize initialValues={activity} onSubmit={(values) => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit}>
            <MyTextInput placeholder='Title' name='title' />
            <MyTextArea rows={3} placeholder='Description' name='description' />
            <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
            <MyDateInput 
              placeholderText='Date' 
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Locations Details' sub color='teal' />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Venue' name='venue' />
            <Button 
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading} floated='right' positive type='submit' content='Submit' />
            <Button as={Link} to={`/activities/${activity.id}`} floated='right' type='button' content='Cancel' />
          </Form>
        )}
      </Formik>
    </Segment>
)}

export default observer(ActivityForm);