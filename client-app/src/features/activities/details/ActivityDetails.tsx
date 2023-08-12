import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import { Button, Card, Grid, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

const ActivityDetails = () => {

  const { activityStore } = useStore();
  const { loadActivity, loadingInitial } = activityStore;
  const [activity, setActivity] = useState<Activity | undefined>(undefined);

  const {id} = useParams();

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity));

    // empty dependency for component initialization purposes
    // eslint-disable-next-line
  }, [])

  if (loadingInitial || !activity) return <LoadingComponent />

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat activity={activity}/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
        </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDetails);


{/* <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{(new Date(activity.date).toDateString())}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content="Edit" />
          <Button as={Link} to={'/activities'} basic color='grey' content="Cancel" />
        </Button.Group>
      </Card.Content>
    </Card> */}