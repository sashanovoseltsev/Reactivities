import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

const ActivityDetails = () => {

  const { activityStore } = useStore();
  const { selectedActivity, openForm, cancelSelectedActivity } = activityStore;
  const activity = selectedActivity!;

  return (<Card fluid>
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
          <Button onClick={() => openForm(activity.id)} basic color='blue' content="Edit" />
          <Button onClick={cancelSelectedActivity} basic color='grey' content="Cancel" />
        </Button.Group>
      </Card.Content>
    </Card>);
}

export default observer(ActivityDetails);