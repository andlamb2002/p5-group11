import React from 'react';
import { Divider, List, ListItem, Button } from '@mui/material';
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

    componentDidMount() {
        this.getUsers()
    }

    getUsers(){
      const url = '/user/list';
    
      axios.get(url)
          .then((response) => {
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

}

export default UserList;
