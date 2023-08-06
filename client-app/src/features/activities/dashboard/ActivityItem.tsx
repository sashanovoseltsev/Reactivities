import React, { FC } from "react";
import { Activity } from "../../../app/models/activity";
import { Button, Item, Label } from "semantic-ui-react";

type Props = {
  activity: Activity, 
  selectActivity: (id: string) => void,
  deleteActivity: (id: string) => void
}

const ActivityItem: FC<Props> = ({activity, selectActivity, deleteActivity}) => (
  <Item key={activity.id}>
    <Item.Content>
      <Item.Header as='a'>{activity.title}</Item.Header>
      <Item.Meta>{activity.date}</Item.Meta>
      <Item.Description>
        <div>{activity.description}</div>
        <div>{activity.city}, {activity.venue}</div>
      </Item.Description>
      <Item.Extra>
        <Button onClick={() => selectActivity(activity.id)} floated="right" content='View' color='blue' />
        <Button onClick={() => deleteActivity(activity.id)} floated="right" content='Delete' color='red' />
        <Label basic content={activity.category} />
      </Item.Extra>
    </Item.Content>
  </Item>
)

export default ActivityItem;