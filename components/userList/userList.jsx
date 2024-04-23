import React from 'react';
import { Divider, List, ListItem, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'base-Backdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `,
);


class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                userList: [],
                isCommentModalOpen: false,
                selectedUserForComments: null
            };
    }

    async componentDidMount() {
        const url = '/user/list';

      const usersResponse = await axios.get(url);
        const usersList = usersResponse.data;
        this.setState({ userList: usersList});
    }

    handleCommentsClick = (user) => {
      console.log('comment click', user);
      this.setState({selectedUserForComments: user});
      this.setState({isCommentModalOpen:true});
    };

    handleCloseCommentsModal = () => {
      this.setState({isCommentModalOpen:false});
    };

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

                     <IconButton className="greenphotos" 
                     style={{backgroundColor: 'green', color: 'white', borderRadius: '100%', width: '40px', height: '40px'}}
                      
                      >
                        {user.photosCount}
                     </IconButton>
                      

                     <IconButton className="comments-btn" 
                     style={{backgroundColor: 'red', color: 'white', borderRadius: '100%', width: '40px', height: '40px'}}
                     onClick={() => {
                      this.handleCommentsClick(user); 
                  }}
                      >
                        {user.commentsCount}
                     </IconButton>
                      

                   </ListItem>
                   <Divider />
                 </div>
               ))}
             </List>
                      <Modal
                        aria-labelledby="unstyled-modal-title"
                        aria-describedby="unstyled-modal-description"
                        open={this.state.isCommentModalOpen}
                        onClose={this.handleCloseCommentsModal}
                        slots={{ backdrop: StyledBackdrop }}
                      >
                        <ModalContent sx={{ width: 400 }}>
                          <h2 id="unstyled-modal-title" className="modal-title">
                            Comments
                          </h2>
                            {
                              <ul id="unstyled-modal-description" className="modal-description">{this.state.selectedUserForComments?.commentedPhotos.map((photo, index) => <li key={photo._id+index}>{photo?.comments?.comment}</li>)}</ul>
                              }
                        </ModalContent>
                      </Modal>        
             
           </div>
           <div style={{ width: '70%' }}>
             {this.props.children}
           </div>
         </div>
        );
    }

}



export default UserList;
