import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then(response => {
      console.log(response);
      setData(response.data);
    })
  }, [])

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
      <List>
          {data.map((activity: any) => <List.Item key={activity.id}>{activity.title}</List.Item>)}
      </List>
    </div>
  );
}

export default App;
