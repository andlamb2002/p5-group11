import React from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';
import axios from 'axios';
import { MdDelete } from "react-icons/md";


class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

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

   handleDelete(id){
    const confirm = window.confirm ('would you like to delete?');
     if (confirm) {
      axios.delete('http://localhost:3000/users/'+id)
      .then(res => {
        // navigate('/');
        window.location='/users'
      }).catch(error => console.log(error));
     }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    const url = `/user/${userId}`;
    /*
    fetchModel(url) // Use the FetchModel function
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      }); */
    
      axios.get(url) 
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
        <Paper elevation={3} className="user-detail-container">
            <Typography variant="h4" component="h1" gutterBottom>
                User Profile
            </Typography>
            {user ? (
                <Box className="user-content">
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
                      variant="contained"
                      color="primary"> 
                      User photos
                    </Button>

                    <button onClick={e => this.handleDelete(user._id) } className='deletebtn'><MdDelete /></button>

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