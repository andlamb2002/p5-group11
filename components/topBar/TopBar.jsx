import React from 'react';
import { Button, AppBar, Toolbar, Typography} from '@mui/material';
import './TopBar.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      app_info: null,
      id: null
    };
    this.fileInputRef = React.createRef(); 
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
    axios.post('/admin/logout')
        .then(() => { 
            this.props.setUserLoggedIn(false);
            this.props.setTopName('Please Login');
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
  };

  handleAddPhoto = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  // eslint-disable-next-line class-methods-use-this
  handleFileChange = (event, userId) => {
    console.log('id', this.state, userId);
    const file = event.target.files[0];
    file.userId = userId;
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    const formData = new FormData();
    formData.append("uploadedphoto", file);
    formData.append("userId", userId);
    axios.post("/photos/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(response => {
      this.props.addNewPhoto(response.data);  
    })
    .catch(error => {
      console.error("Error uploading photo:", error);
    });
  };

  render() {
    const toolbarStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
    };
    console.log('props', this.props.location.pathname.split('/')[2]);
    const userId = this.props.location.pathname.split('/')[2];
    const { userIsLoggedIn } = this.props;

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
            <Typography variant="h5" component="div" sx={{ flexGrow: 0 }} color="inherit">Version: 3.0</Typography>
          )}

          <Typography>
            {userIsLoggedIn && (
              <>
              <input
                type="file"
                accept="image/*"
                ref={this.fileInputRef}
                //onChange={this.handleFileChange}
                onChange={(e) =>this.handleFileChange(e,userId)}
                style={{ display: "none" }}
              />
              <Button onClick={this.handleAddPhoto} variant="contained" style={{ backgroundColor: "#3f51b5", marginRight: 10 }}>
                Add Photo
              </Button>

              <Button onClick={this.handleLogout} variant="contained" style={{ backgroundColor: "#3f51b5", marginRight: 10 }}>
                Logout
              </Button>
              </>
              
            )}
          </Typography>
          

        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
