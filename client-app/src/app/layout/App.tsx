import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';

import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App: FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:7007/api/activities')
      .then(response => {
        setActivities(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error.toJSON());
        setError(error.message + ' ' + error.config?.url);
      })
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

  const handleCreateOrEdit = (activity: Activity) => {
    setActivities([...activities.filter(x => x.id !== activity.id), activity]);
    setSelectedActivity(activity);
    handleFormClose();
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '60px'}}>
        {
          error !== ''
          ? <span>{error}</span>
          : <ActivityDashboard 
              activities={activities} 
              selectedActivity={selectedActivity}
              selectActivity={handleSelectActivity}
              cancelSelectActivity={handleCancelSelectActivity}
              editMode={editMode}
              openForm={handleFormOpen}
              closeForm={handleFormClose}
              createOrEdit={handleCreateOrEdit}
              deleteActivity={handleDeleteActivity}
            />
        }
      </Container>
    </>
  );
}

export default App;
