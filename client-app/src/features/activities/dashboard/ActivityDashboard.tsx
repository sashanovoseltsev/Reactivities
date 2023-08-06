import React, { FC } from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../fom/ActivityForm";

type Props = {
  activities: Activity[],
  selectedActivity: Activity | undefined,
  selectActivity: (id: string) => void,
  cancelSelectActivity: () => void,
  editMode: boolean,
  openForm: (id: string) => void,
  closeForm: () => void,
  createOrEdit: (activity: Activity) => void,
  deleteActivity: (id: string) => void
}

const ActivityDashboard: FC<Props> = ({activities, 
  selectedActivity, 
  selectActivity, 
  cancelSelectActivity,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity
}) => (
  <Grid>
    <Grid.Column width='10'>
      <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity}/>
    </Grid.Column>
    <Grid.Column width='6'>
      <div style={{position: 'sticky', top: '60px'}}>
        {selectedActivity && !editMode &&
          <ActivityDetails activity={selectedActivity} 
                            cancelSelectActivity={cancelSelectActivity}
                            openForm={openForm}
        />}
        {editMode && 
          <ActivityForm createOrEdit={createOrEdit} closeForm={closeForm} activity={selectedActivity}/>
        }
      </div>
    </Grid.Column>
  </Grid>
);

export default ActivityDashboard;