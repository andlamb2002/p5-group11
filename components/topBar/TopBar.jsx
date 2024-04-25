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
  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    const formData = new FormData();
    formData.append("uploadedphoto", file);
  
    axios.post("/photos/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => { 
      this.props.setTopName('Photo uploaded successfully.');
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
            <Typography variant="h5" component="div" color="inherit">
              Version: {this.state.app_info.__v}
            </Typography>
          )}

          <Typography>
            {userIsLoggedIn && (
              <>
              <input
                type="file"
                accept="image/*"
                ref={this.fileInputRef}
                onChange={this.handleFileChange}
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

export default TopBar;
