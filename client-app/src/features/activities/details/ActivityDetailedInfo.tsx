import { Grid, Icon, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

const ActivityDetailedInfo = () => {
  const { activityStore } = useStore();
  const activity = activityStore.selectedActivity;

  if (!activity) return null;
  
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='info'/>
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{activity.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='calendar'/>
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{activity.dateFormatted}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='marker'/>
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{activity.venue}, {activity.city}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  )
}

export default observer(ActivityDetailedInfo);