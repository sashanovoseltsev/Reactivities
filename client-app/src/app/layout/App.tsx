import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import { useEffect } from 'react';
import ModalContainer from '../common/modals/ModalContainer';

const App = () => {

  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.jwtToken) {
      userStore.getCurrentUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [userStore, commonStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>

  return (
    <>
      <ModalContainer />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === '/' 
        ?  <HomePage />
        :
          <>
            <NavBar />
            <Container style={{marginTop: '60px'}}>
              <Outlet />
            </Container>
          </>}
    </>
  );
}

export default observer(App);
