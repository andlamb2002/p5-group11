import React from 'react';
import { Divider, List, ListItem, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';

class UserList extends React.Component {

    handleUserClick = (user) => {
        this.props.setTopName(`User Details of ${user.first_name} ${user.last_name}`);
    };

    render() {
        const { userList } = this.props; 

        return (
            <div>
                <List component="nav">
                    {userList.map(user => (
                        <div key={user._id}>
                            <ListItem>
                                <Button
                                    onClick={() => this.handleUserClick(user)}
                                    component={Link}
                                    to={`/users/${user._id}`}
                                    className="ButtonStyle"
                                >
                                    {`${user.first_name} ${user.last_name}`}
                                </Button>

                                <Link to={`/photos/${user._id}`} style={{ textDecoration: 'none' }}>
                                    <IconButton
                                        className="greenphotos"
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            borderRadius: '100%',
                                            width: '40px',
                                            height: '40px',
                                            position: 'absolute',
                                            right: '50px',
                                            bottom: '0'
                                        }}
                                    >
                                        {user.photosCount}
                                    </IconButton>
                                </Link>

                                <Link to={`/comments/${user._id}`} style={{ textDecoration: 'none' }}>
                                    <IconButton
                                        className="comments-btn"
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '100%',
                                            width: '40px',
                                            height: '40px',
                                            position: 'absolute',
                                            right: '0',
                                            bottom: '0'
                                        }}
                                    >
                                        {user.commentsCount}
                                    </IconButton>
                                </Link>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </div>
        );
    }
}

export default UserList;
