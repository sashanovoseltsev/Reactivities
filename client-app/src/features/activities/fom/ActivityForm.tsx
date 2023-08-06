import React, { ChangeEvent, FC, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { isEqual } from 'lodash';

type Props = {
  activity: Activity | undefined,
  closeForm: () => void,
  createOrEdit: (activity: Activity) => void
}

const ActivityForm: FC<Props> = ({createOrEdit, activity: selectedActivity, closeForm}) => {
  
  console.log('form render');
  const initialState = selectedActivity ?? new Activity()

  const [activity, setActivity] = useState(initialState);
  const [formEdited, setFormEdited] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const {name, value} = event.target;
    const updatedActivity = {...activity, [name]: value};
    setActivity(updatedActivity);
    setFormEdited(!isEqual(initialState, updatedActivity));
  }

  const handleSubmit = () => {
    createOrEdit(activity);
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
        <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange} />
        <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange} />
        <Form.Input placeholder='Date' name='date' value={activity.date} onChange={handleInputChange} />
        <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
        <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />
        <Button disabled={!formEdited} floated='right' positive type='submit' content='Submit' />
        <Button onClick={() => closeForm()} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
)}

export default ActivityForm;