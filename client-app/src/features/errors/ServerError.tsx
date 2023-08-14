import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite";

const ServerError = () => {
  const { commonStore: {serverError} } = useStore();

  return (
    <Container>
      <Header as='h1' content='Server Error'/>
      <Header as='h5' color='red' style={{textTransform: 'uppercase'}} content={serverError?.message} />
      {serverError?.details && 
        <Segment>
          <Header color='teal' content='Stack trace' />
          <span>{serverError.details}</span>
        </Segment>
      }
    </Container>
  )
}

export default observer(ServerError);