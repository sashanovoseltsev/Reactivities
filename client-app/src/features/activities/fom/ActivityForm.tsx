import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { isEqual } from 'lodash';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 } from 'uuid';

const ActivityForm = () => {
  const { activityStore: { loadingInitial, loadActivity, loading, createActivity, updateActivity } } = useStore();

  const [initialState, setInitialState] = useState({ 
    id: '',
    title: 'Music',
    date: '2023-09-30T18:44:10.773008',
    description: 'Test Music Event',
    category: 'music',
    city: 'London',
    venue: 'Pub #1'
  });

  const [activity, setActivity] = useState<Activity | undefined>(undefined);
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadActivity(id).then(activity => {
        setActivity(activity);
        setInitialState(activity!);
      });
    } 
    else {
      setActivity(initialState);
    }
    // empty dependency for component initialization purposes
    // eslint-disable-next-line
  }, [])

  if (loadingInitial || !activity) return <LoadingComponent />

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const {name, value} = event.target;
    setActivity({...activity, [name]: value });
  }

  const handleSubmit = () => {
    if (!activity.id) {
      activity.id = v4();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  console.log('initialState', initialState);
  console.log('activity', activity);
  console.log('are equal: ', isEqual(initialState, activity));

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
        <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange} />
        <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange} />
        <Form.Input placeholder='Date' name='date' value={activity.date} onChange={handleInputChange} />
        <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
        <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />
        <Button loading={loading} disabled={isEqual(initialState, activity)} floated='right' positive type='submit' content='Submit' />
        <Button as={Link} to={`/activities/${activity.id}`} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
)}

export default observer(ActivityForm);