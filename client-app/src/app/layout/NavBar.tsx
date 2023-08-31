import { Button, Container, Dropdown, Image, Menu } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";

const NavBar = () => {
  const { userStore: { user, logout, isLoggedIn} } = useStore();
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to='/' header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to='/activities' name='Activities' />
        <Menu.Item as={NavLink} to='/errors' name='Errors' />
        <Menu.Item>
          <Button as={NavLink} to='/createActivity' positive content='Create Activity' />
        </Menu.Item>
        { isLoggedIn && 
          <Menu.Item position="right">
            <Image avatar src={user?.image || "/assets/user.png"} spaced="right" />
            <Dropdown pointing="top left" text={user?.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} icon='user' text='My Profile' />
                <Dropdown.Item as={Link} to="/" icon='power' text='Logout' onClick={logout}/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item> 
        }
      </Container>
    </Menu>);
  }

export default observer(NavBar);