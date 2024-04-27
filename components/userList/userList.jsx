import React from 'react';
import { Divider, List, ListItem, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';
import axios from 'axios';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
        };
    }

    async componentDidMount() {
        try {
            const url = '/user/list';
            const usersResponse = await axios.get(url);
            this.setState({ userList: usersResponse.data });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }

    handleUserClick = (user) => {
        this.props.setTopName(`User Details of ${user.first_name} ${user.last_name}`);
    };

    render() {
        const { userList } = this.state;

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
                                        top: '0'
                                    }}
                                >
                                    {user.photosCount}
                                </IconButton>

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
                                            top: '0'
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
