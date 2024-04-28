import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';
import axios from 'axios';

// Import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserPhotos from './components/userPhotos/userPhotos';
import UserList from './components/userList/userList';
import LoginRegister from './components/loginRegister/loginRegister';
import UserComments from './components/userComments/userComments';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topName: 'Please Login',
      userIsLoggedIn: false,
      loggedInUserId: null,
      userList: [],
    };
    this.userPhotosRef = React.createRef();
  }

  fetchUserList = async () => {
    try {
      const response = await axios.get('/user/list');
      this.setState({ userList: response.data });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  setTopName = (name) => {
    this.setState({ topName: name });
  };

  setUserLoggedIn = async (isLoggedIn, userId) => {
    this.setState({ userIsLoggedIn: isLoggedIn, loggedInUserId: userId }, () => {
      if (isLoggedIn) {
        this.fetchUserList();
      }
    });
  };

  handlePhotoAddedFallback = () => {
    this.fetchUserList();
  };

  render() {
    const { userIsLoggedIn, loggedInUserId, userList, topName } = this.state;
    return (
      <BrowserRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                topName={topName}
                setTopName={this.setTopName}
                setUserLoggedIn={this.setUserLoggedIn}
                userIsLoggedIn={userIsLoggedIn}
                addNewPhoto={this.userPhotosRef.current ? this.userPhotosRef.current.addNewPhoto : this.handlePhotoAddedFallback}
                fetchUserList={this.fetchUserList}
              />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {userIsLoggedIn && (
                  <UserList setTopName={this.setTopName} userList={userList} />
                )}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Switch>
                <Route exact path="/photo-share.html" render={() => (
                    userIsLoggedIn ? <div></div> : <Redirect to="/login-register" />
                )} />
                <Route path="/users/:userId" render={(props) => (
                  userIsLoggedIn ? 
                  <UserDetail {...props} loggedInUserId={loggedInUserId} setTopName={this.setTopName} /> : 
                  <Redirect to="/login-register" />
                )} />
                <Route path="/photos/:userId" render={(props) => (
                    userIsLoggedIn ? 
                    <UserPhotos {...props} loggedInUserId={loggedInUserId} setTopName={this.setTopName} fetchUserList={this.fetchUserList} ref={this.userPhotosRef}/> : 
                    <Redirect to="/login-register" />
                )} />
                <Route path="/comments/:userId" render={(props) => (
                  userIsLoggedIn ? 
                  <UserComments {...props} setTopName={this.setTopName} /> : 
                  <Redirect to="/login-register" />
                )} />
                <Route path="/login-register" render={() => (
                    userIsLoggedIn ? <Redirect to="/photo-share.html" /> : <LoginRegister setUserLoggedIn={this.setUserLoggedIn} setTopName={this.setTopName} />
                )} />
              </Switch>
            </Grid>
          </Grid>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById('photoshareapp'));
