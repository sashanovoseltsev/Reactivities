import React, { FC, SyntheticEvent, useState } from "react";
import { Activity } from "../../../app/models/activity";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

type Props = {
  activity: Activity
}

const ActivityItem: FC<Props> = ({activity}) => {
  
  const { activityStore: {loading, deleteActivity} } = useStore();
  const [target, setTarget] = useState('');

  const handleDelete = (id: string, e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span style={{marginRight: '1rem'}}>
          <Icon name='clock' />{(new Date(activity.date).toDateString())}
        </span>
        <span>
          <Icon name='marker' />{activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        Attendees go here
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button 
          as={Link}
          to={`/activities/${activity.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
)}

export default observer(ActivityItem);



{/* <Item key={activity.id}>
<Item.Content>
  <Item.Header as='a'>{activity.title}</Item.Header>
  <Item.Meta>{(new Date(activity.date).toDateString())}</Item.Meta>
  <Item.Description>
    <div>{activity.description}</div>
    <div>{activity.city}, {activity.venue}</div>
  </Item.Description>
  <Item.Extra>
    <Button as={Link} to={`/activities/${activity.id}`}
      floated="right" 
      content='View' 
      color='blue' />
    <Button loading={loading && target === activity.id} 
      onClick={(e) => handleDelete(activity.id, e)} 
      name={activity.id} 
      floated="right" 
      content='Delete' 
      color='red' />
    <Label basic content={activity.category} />
  </Item.Extra>
</Item.Content>
</Item> */}