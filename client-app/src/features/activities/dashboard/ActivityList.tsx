import React, { FC } from "react";
import { Activity } from "../../../app/models/activity";
import { Segment, Item } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";

type Props = {
  activities: Activity[],
  selectActivity: (id: string) => void,
  deleteActivity: (id: string) => void,
  submitting: boolean
}

const ActivityList: FC<Props> = ({activities, submitting, selectActivity, deleteActivity}) => (
  
  <Segment>
    <Item.Group divided>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} submitting={submitting} activity={activity} selectActivity={selectActivity} deleteActivity={deleteActivity}/>
      ))}
    </Item.Group>
  </Segment>
)

export default ActivityList;