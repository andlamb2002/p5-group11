import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserPhotos from './components/userPhotos/userPhotos';
import UserList from './components/userList/userList';
import LoginRegister from './components/loginRegister/loginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topname: '',
      userIsLoggedIn: false
    };
  }
  
setTopName = (name) => {
  this.setState({ topname: name });
};

setUserLoggedIn = (isLoggedIn) => {
  this.setState({ userIsLoggedIn: isLoggedIn });
};

render() {
  const {userIsLoggedIn} = this.state;
  return (
    <BrowserRouter>
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TopBar topName={this.state.topname} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={2}>
            <Paper className="main-grid-item">
              <UserList setTopName={this.setTopName} />
            </Paper>
          </Grid>
          <Grid item sm={10}>

              <Switch>
                <Route exact path="/" render={() => (
                    userIsLoggedIn ? <div>Logged In</div> : <Redirect to="/login-register" />
                )} />
                <Route path="/users/:userId" render={(props) => (
                    userIsLoggedIn ? <UserDetail {...props} /> : <Redirect to="/login-register" />
                )} />
                <Route path="/photos/:userId" render={(props) => (
                    userIsLoggedIn ? <UserPhotos {...props} /> : <Redirect to="/login-register" />
                )} />
                <Route path="/login-register" render={() => (
                    userIsLoggedIn ? <Redirect to="/" /> : <LoginRegister setUserLoggedIn={this.setUserLoggedIn} />
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
