import React, { FC, SyntheticEvent, useState } from "react";
import { Activity } from "../../../app/models/activity";
import { Button, Item, Label } from "semantic-ui-react";
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
  <Item key={activity.id}>
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
  </Item>
)}

export default observer(ActivityItem);