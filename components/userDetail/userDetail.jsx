import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import './userDetail.css';
import { fetchModel } from '../../lib/fetchModelData'; 

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true
        };
    }

    componentDidMount() {
        this.fetchUserDetail();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.fetchUserDetail();
        }
    }

    fetchUserDetail() {
        const userId = this.props.match.params.userId;
        const url = `http://localhost:3000/user/${userId}`; 
        fetchModel(url)
            .then(response => {
                this.setState({
                    user: response.data,
                    loading: false
                });
            })
            .catch(error => {
                console.error('Error fetching user detail:', error);
            });
    }

    render() {
        const { user, loading } = this.state;

        return (
            <Paper elevation={3} className="user-detail-container">
                <Typography variant="h4" component="h1" gutterBottom>
                    User Profile
                </Typography>
                {loading ? (
                    <Typography variant="body1">
                        Loading user details...
                    </Typography>
                ) : (
                    <Box className="user-content">
                        <Box className="user-photo-box">
                            <img
                                src={user.image}
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
                    </Box>
                )}
            </Paper>
        );
    }
}

export default UserDetail;
