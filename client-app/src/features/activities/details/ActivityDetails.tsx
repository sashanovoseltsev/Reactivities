import React, {FC} from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Card, Image } from 'semantic-ui-react';

type Props = {
  activity: Activity,
  cancelSelectActivity: () => void,
  openForm: (id: string) => void
}

const ActivityDetails: FC<Props> = ({activity, cancelSelectActivity, openForm}) => (
  <Card fluid>
    <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
    <Card.Content>
      <Card.Header>{activity.title}</Card.Header>
      <Card.Meta>
        <span>{activity.date}</span>
      </Card.Meta>
      <Card.Description>
        {activity.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button.Group widths='2'>
        <Button onClick={() => openForm(activity.id)} basic color='blue' content="Edit" />
        <Button onClick={cancelSelectActivity} basic color='grey' content="Cancel" />
      </Button.Group>
    </Card.Content>
  </Card>
)

export default ActivityDetails;