import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import loginRegister from './components/loginRegister/loginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topname: '',
    };
  }
  
setTopName = (name) => {
  this.setState({ topname: name });
};

render() {  
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
                {/* <Route
                  exact
                  path="/"
                  render={() => (
                    <Typography variant="body1">
                    </Typography>
                  )}
                /> */}
                <Route path="/users/:userId" component={UserDetail} />
                <Route path="/photos/:userId" component={UserPhotos} />
                <Route path="/users" component={UserList} />
                <Route path="/" component={loginRegister} />
              </Switch>
            
          </Grid>
        </Grid>
      </div>
    </BrowserRouter>
  );
}
}

ReactDOM.render(<PhotoShare />, document.getElementById('photoshareapp'));
