import React, { FC } from "react";
import { Activity } from "../../../app/models/activity";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

type Props = {
  activity: Activity
}

const ActivityItem: FC<Props> = ({activity}) => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && 
          <Label color='red' content='Cancelled' attached="top" style={{textAlign: 'center'}}/>
        }
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src={activity.host.image || '/assets/user.png'} />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by <Link to={`/profiles/${activity.host.userName}`}>{activity.host.displayName}</Link></Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {!activity.isHost && activity.isGoing && (
                <Item.Description>
                  <Label basic color='green'>
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span style={{marginRight: '1rem'}}>
          <Icon name='clock' />{activity.dateTimeFormatted}
        </span>
        <span>
          <Icon name='marker' />{activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button 
          as={Link}
          to={`/activities/${activity.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
)}

export default observer(ActivityItem);