import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard = () => {
  const { activityStore: { loadActivities, initialLoading, activityRegistry } } = useStore();

  useEffect(() => {
    if (activityRegistry.size === 0) loadActivities();
  }, [loadActivities, activityRegistry]);

  if (initialLoading) return <LoadingComponent content='Loading activities...' />

  return (<Grid>
    <Grid.Column width='10'>
      <ActivityList />
    </Grid.Column>
    <Grid.Column width='6'>
      <ActivityFilters />
    </Grid.Column>
  </Grid>);
}

export default observer(ActivityDashboard);