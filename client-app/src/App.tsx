import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { Header, List } from 'semantic-ui-react';

const App: FC = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    axios.get('http://localhost:7007/api/activities')
      .then(response => {
        console.log(response);
        setActivities(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error.toJSON());
        setError(error.message + ' ' + error.config?.url);
      })
  }, []);


  let res: any;
  if (activities.length > 0) {
    res = activities.map((activity: any) => (
      activity.title
    ));
  }

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivites' />
      {
      error !== ''
      ? <span>{error}</span>
      : <List>
          {activities.map((activity: any) => (
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
        </List>
      }
    </div>
  );
}

export default App;
