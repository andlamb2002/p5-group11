import React from 'react';
<<<<<<< HEAD
//import { Divider, List, ListItemButton, ListItemText,}from '@mui/material';
import { Divider, List, ListItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';
=======
import {
  List,
  ListItemButton,
  ListItemText,
}
from '@mui/material';
>>>>>>> 6bf617a3678574720b87dc251fe118423c8f072b
import './userList.css';
import { fetchModel } from '../../lib/fetchModelData';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                userList: [],
                /*users: undefined,
                user_id: undefined*/ 
            };
    }

    componentDidMount() {
        const url = '/user/list';

        fetchModel(url).then((response) => {
            this.setState({ userList: response.data });
        })
        .catch((error) => {
            console.error('Error fetching user List:', error);
        });
    }

    handleUserClick = (user) => {
        this.props.setTopName(`User Details of ${user.first_name} ${user.last_name}`);
    };

    render() {
        const { userList } = this.state;
        
        return (
         <div >
           <div>
             <List component="nav">
               {userList.map((user) => (
                 <div key={user._id}>
                   <ListItem>
                     <Button
                     onClick={() => {
                       this.handleUserClick(user); 
                   }}
                       component={Link}
                       to={`/users/${user._id}`}
                       className="ButtonStyle" 
                     >
                       {`${user.first_name} ${user.last_name}`}
                     </Button>
                   </ListItem>
                   <Divider />
                 </div>
               ))}
             </List>
           </div>
           <div style={{ width: '70%' }}>
             {this.props.children}
           </div>
         </div>
        );
    }

/*
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
<<<<<<< HEAD
      return this.state.users ?(
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
          <div/>
      );
    } */
=======
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
>>>>>>> 6bf617a3678574720b87dc251fe118423c8f072b
}

export default UserList;
