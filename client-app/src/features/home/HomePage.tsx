import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

const HomePage = () => {
  const { userStore: {isLoggedIn, user}, modalStore } = useStore();
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image size='massive' src='/assets/logo.png' style={{marginBottom: '1.2rem'}} />
          Reactivities
        </Header>
        {isLoggedIn 
          ? (<>
              <Header as='h2' inverted content={`Welcome to Reactivites, ${user?.displayName}`} />
              <Button as={Link} to='/activities' size='huge' inverted>
                Go to activities
              </Button>
            </>)
          : (
            <>
              <Button as={Link} onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                Login
              </Button>
              <Button as={Link} onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                Register
              </Button>
            </>
          )
        }
      </Container>
    </Segment>
  )
}

export default observer(HomePage);