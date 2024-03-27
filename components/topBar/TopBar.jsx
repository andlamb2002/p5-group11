import React from 'react';
import { Button, AppBar, Toolbar, Typography} from '@mui/material';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      app_info: null,
    };
  }

  componentDidMount() {
    this.handleAppInfoChange();
  }

  
  handleAppInfoChange() {
    axios.get('/test/info')
    .then((response) => {
      this.setState({
        app_info: response.data,
      });
    })
    .catch((error) => {
      console.error('Error fetching app info:', error);
    });
  }

  handleLogout = () => {
    axios.post("/admin/logout", {})
    .then(() => {
      this.props.changeLoggedIn(false);
      this.props.setTopName('Please Login');
    })
    .catch(err => console.log(err.response));
  };
  

  render() {
    const toolbarStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
    };

    

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar style={toolbarStyle}>
          <Typography variant="h5" color="white">
            Group 11
          </Typography>

          
          <Typography variant="h6" color="white">
            {this.props.topName}
          </Typography>


          {this.state.app_info && (
            <Typography variant="h5" component="div" color="inherit">
              Version: {this.state.app_info.__v}
            </Typography>
          )}

          <Typography>
            <Button onClick={this.handleLogout} varient="contained" style={{backgroundColor: "#ccb4a4", marginRight: 10}}>
              Log Out
            </Button>
          </Typography>
          

        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
