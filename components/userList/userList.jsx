import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
}
from '@mui/material';
import './userList.css';
import { fetchModel } from '../../lib/fetchModelData';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                users: undefined,
                user_id: undefined
            };
    }

    componentDidMount() {
        this.handleUserListChange();
    }

    componentDidUpdate() {
        const new_user_id = this.props.match?.params.userId;
        const current_user_id = this.state.user_id;
        if (current_user_id  !== new_user_id){
            this.handleUserChange(new_user_id);
        }
    }

    handleUserChange(user_id){
        this.setState({
            user_id: user_id
        });
    }

    handleUserListChange() {
        const url = 'http://localhost:3000/user/list'; 
        fetchModel(url)
            .then(response => {
                this.setState({
                    users: response.data 
                });
            })
            .catch(error => {
                console.error('Error fetching user list:', error);
            });
    }

    render() {
        return this.state.users ? (
            <div>
                <List component="nav">
                    {
                        this.state.users.map(user => (
                            <ListItemButton selected={this.state.user_id === user._id}
                                key={user._id}
                                divider={true}
                                component="a" href={"#/users/" + user._id}>
                                <ListItemText primary={user.first_name + " " + user.last_name} />
                            </ListItemButton>
                        ))
                    }
                </List>
            </div>
        ) : (
                <div />
            );
    }
}

export default UserList;
