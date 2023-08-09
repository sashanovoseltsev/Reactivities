import React from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../fom/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { selectedActivity, editMode } = activityStore;

  return (<Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <div style={{position: 'sticky', top: '60px'}}>
          { selectedActivity && !editMode && <ActivityDetails /> }
          { editMode && <ActivityForm /> }
        </div>
      </Grid.Column>
    </Grid>);
}

export default observer(ActivityDashboard);