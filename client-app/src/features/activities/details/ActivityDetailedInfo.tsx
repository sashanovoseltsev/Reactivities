import { FC } from "react";
import { Activity } from "../../../app/models/activity";
import { Grid, Icon, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";


interface Props {
  activity: Activity
}

const ActivityDetailedInfo: FC<Props> = ({activity}) => {
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
            <p>{activity.date}</p>
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