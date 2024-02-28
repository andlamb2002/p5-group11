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
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Profile
                </Typography>
                {user ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <img
                            src={user.image }
                            alt={user.name}
                            style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
                        />
                        <Typography variant="h5" component="h2">
                            {user.name}
                        </Typography>
                        <Typography variant="body1">
                            Email: {user.email}
                        </Typography>
                        <Typography variant="body1">
                            Location: {user.location}
                        </Typography>
                        <Typography variant="body1">
                            Occupation: {user.occupation }
                        </Typography>
                        <Typography variant="body1">
                            Description: {user.description }
                        </Typography>
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
