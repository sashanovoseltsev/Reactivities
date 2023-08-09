import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { isEqual } from 'lodash';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

const ActivityForm = () => {
  
  const { activityStore: { selectedActivity, loading, createActivity, updateActivity , closeForm} } = useStore();
  const initialState = selectedActivity ?? new Activity()

  const [activity, setActivity] = useState(initialState);
  const [formEdited, setFormEdited] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const {name, value} = event.target;
    const updatedActivity = {...activity, [name]: value };
    setActivity(updatedActivity);
    setFormEdited(!isEqual(initialState, updatedActivity));
  }

  const handleSubmit = () => {
    activity.id ? updateActivity(activity) : createActivity(activity);
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
        <Button loading={loading} disabled={!formEdited} floated='right' positive type='submit' content='Submit' />
        <Button onClick={() => closeForm()} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
)}

export default observer(ActivityForm);