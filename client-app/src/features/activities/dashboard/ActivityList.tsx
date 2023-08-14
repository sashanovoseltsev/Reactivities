import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityList = () => {

  const { activityStore: { activitiesGroupedByDate } } = useStore();

  return (
    <>
      {Object.entries(activitiesGroupedByDate).map(group => {
        const [date, activities] = group;
        return (
          <Fragment key={date}>
            <Header sub color='teal'>{date}</Header>
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

export default observer(ActivityList);