import { observer } from "mobx-react-lite";
import { Header, Segment, Comment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ActivityChatForm from "./ActivityChatForm";


const ActivityDetailedChat = () => {
    const { activityStore: { selectedActivity }, commentStore } = useStore();

    useEffect(() => {
        if (selectedActivity) {
            commentStore.createHubConnection(selectedActivity.id);
        }
        return () => {
            commentStore.cleacComments();
        }
    }, [selectedActivity, commentStore])

    if (!selectedActivity) return null;

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <ActivityChatForm />
                <Comment.Group>
                    {commentStore.comments.map(c => (
                        <Comment key={c.id}>
                            <Comment.Avatar src={c.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`profiles/${c.userName}`}>{c.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{c.dateTimeFormatted}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{c.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>
    )
}

export default observer(ActivityDetailedChat);