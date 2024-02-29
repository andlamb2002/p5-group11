import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import './userDetail.css';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const userId = this.props.match.params.userId;
        const user = window.models.userModel(userId);
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
                                src={user.image}
                                alt={user.name}
                                className="user-photo"
                            />
                        </Box>
                        <Box className="user-info-box">
                            <Typography variant="h5" component="h2">
                                {user.name}
                            </Typography>
                            <Typography variant="body1">
                                Location: {user.location}
                            </Typography>
                            <Typography variant="body1">
                                Occupation: {user.occupation}
                            </Typography>
                        </Box>
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
