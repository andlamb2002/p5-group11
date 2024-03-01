import React from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';


class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

/*
  componentDidMount() {
    this.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId || !this.state.user) {
      this.fetchUserDetails();
    }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Define the URL to fetch the user data
    const url = `/user/${userId}`;

    fetchModel(url) // Use the FetchModel function
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        {user ? (
          <div>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button
                  component={Link}
                  to={`/photos/${user._id}`}
                  variant="contained"
                  color="primary"
                >
                  User Photos
                </Button>
              </Grid>
            </Grid>

            <div
              className="user-detail-box"
              style={{
                marginTop: '16px',
                border: '1px solid #e74c3c',
                padding: '8px',
                borderRadius: '5px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)',
                transition: 'box-shadow 0.3s',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '1em' }}>First Name</p>
              <p style={{ fontSize: '0.9em', color: '#333' }}>{user.first_name}</p>
            </div>

            <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Last Name
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.last_name}
            </p>
            </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Location
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.location}
            </p>
          </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Description
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.description}
            </p>
          </div>
          <div className="user-detail-box" style={{ border: '1px solid #e74c3c', padding: '8px', borderRadius: '5px', marginTop: '10px', backgroundColor: '#f5f5f5', boxShadow: '0 0 10px rgba(231, 76, 60, 0.7)', transition: 'box-shadow 0.3s' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em' }}>
              Occupation
            </p>
            <p style={{ fontSize: '0.9em', color: '#333' }}>
              {user.occupation}
            </p>
          </div>
          </div>
        ) : (
          <Typography variant="body1" className="user-detail-box loading-text">
            Loading user details...
          </Typography>
        )}
      </div>
    );
  } */


  componentDidMount() {
    this.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId || !this.state.user) {
      this.fetchUserDetails();
    }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Define the URL to fetch the user data
    const url = `/user/${userId}`;

    fetchModel(url) // Use the FetchModel function
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }







  render() {
    //const userId = this.props.match.params.userId;
    //const { user } = this.state;
    const userId = this.props.match.params.userId;
    const user = window.models.userModel(userId);
    const pik = window.models.photoOfUserModel(userId);
    console.log(user);

    return (
        <Paper elevation={3} className="user-detail-container">
            <Typography variant="h4" component="h1" gutterBottom>
                User Profile
            </Typography>
            {user ? (
                <Box className="user-content">
                    <Box className="user-photo-box">
                        <img
                            src={`/images/${pik[0].file_name}`}
                            alt={user.name}
                            className="user-photo"
                        />
                    </Box>
                    <Box className="user-info-box">
                        <Typography variant="body1">
                            Id: {user._id}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {user.first_name + " " + user.last_name}
                        </Typography>
                        <Typography variant="body1">
                            Location: {user.location}
                        </Typography>
                        <Typography variant="body1">
                            Occupation: {user.occupation}
                        </Typography>
                        <Typography variant="body1">
                            Description: {user.description}
                        </Typography>

                    </Box>
                    <Button
                      component={Link}
                      to={`/photos/${user._id}`}
                      varient="contained"
                      color="primary"> 
                      User Photos
                    </Button>
                </Box>
            ) : (
                <Typography variant="body1">
                    Loading user details...
                </Typography>
            )}
        </Paper>
    );

}


}

export default UserDetail;
