import React from "react";
import { Segment, Item } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityList = () => {

  const { activityStore: { activitiesByDate } } = useStore();

  return (<Segment>
    <Item.Group divided>
      {activitiesByDate.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </Item.Group>
  </Segment>);
}

export default observer(ActivityList);