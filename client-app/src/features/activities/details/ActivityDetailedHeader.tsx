import { observer } from "mobx-react-lite";
import { Button, Header, Image, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
  filter: 'brightness(30%)'
}

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
}

const ActivityDetailedHeader = () => {

  const { 
    activityStore: {
      loading, 
      updateAttendance, 
      cancelActivity, 
      selectedActivity
    }
  } = useStore();

  if (!selectedActivity) return null;

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{padding: '0'}}>
        {selectedActivity.isCancelled && 
          <Label ribbon color='red' content='Cancelled'
           style={{position: 'absolute', left: '-10px', top: '20px', zIndex: 1000}}/>
        }
        <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} fluid style={activityImageStyle}/>
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header 
                  size='huge'
                  content={selectedActivity.title}
                  style={{color: 'white'}}
                />
                <p>{selectedActivity.dateTimeFormatted}</p>
                <p>
                  Hosted by <strong><Link to={`/profiles/${selectedActivity.host.userName}`}>{selectedActivity.host.displayName}</Link></strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {selectedActivity.isHost ? (
          <>
            <Button 
              basic
              color={selectedActivity.isCancelled ? 'green' : 'red'}
              floated="left"
              content={selectedActivity.isCancelled ? 'Re-activate activity' : 'Cancel activity'}
              loading={loading}
              onClick={cancelActivity}
            />
            <Button as={Link} 
              to={`/manage/${selectedActivity.id}`} 
              color='orange' 
              floated='right'
              disabled={selectedActivity.isCancelled}>
                Manage Event
            </Button>
          </>
        ) : selectedActivity.isGoing ? (
          <Button loading={loading} onClick={updateAttendance}>
            Cancel attendance</Button>
        ) : (
          <Button loading={loading} 
            disabled={selectedActivity.isCancelled}
            onClick={updateAttendance} 
            color='teal'
            style={{marginRight: '1rem'}}>
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  )
}

export default observer(ActivityDetailedHeader);