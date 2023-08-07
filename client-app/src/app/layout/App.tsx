import { FC, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';

import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { v4 } from 'uuid';

const App: FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    agent.Activities.list().then(response => { 
      setActivities(response);
      setLoading(false);
    });
    // axios.get<Activity[]>('http://localhost:7007/api/activities')
    //   .then(response => {
    //     setActivities(response.data);
    //   })
    //   .catch((error: AxiosError) => {
    //     console.log(error.toJSON());
    //     setError(error.message + ' ' + error.config?.url);
    //   })
  }, []);

  const handleSelectActivity = (id: string) => {
    if (!editMode)
      setSelectedActivity(activities.find(x => x.id === id))
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    if (!editMode) {
      id ? handleSelectActivity(id) : handleCancelSelectActivity();
      setEditMode(true);
    }
  }

  const handleFormClose = () => setEditMode(false);

  const handleCreateOrEdit = async (activity: Activity) => {
    setSubmitting(true);
    if (activity.id) {
      setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      await agent.Activities.update(activity);
    } else {
      activity.id = v4();
      setActivities([...activities, activity]);
      await agent.Activities.create(activity);
    }

    setSelectedActivity(activity);
    handleFormClose();
    setSubmitting(false);
  }

  const handleDeleteActivity = async (id: string) => {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(x => x.id !== id)]);
    setSubmitting(false);
  }

  if (loading) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '60px'}}>
        {
          <ActivityDashboard 
            activities={activities} 
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            editMode={editMode}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
            createOrEdit={handleCreateOrEdit}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
          />
        }
      </Container>
    </>
  );
}

export default App;
