import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia, Button, 
  IconButton,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      photos: [],
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchUserPhotos();
    console.log('Type of fetchUserList:', typeof this.props.fetchUserList);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUserPhotos();
    }

    else if (this.state.user && (!prevState.user || prevState.user._id !== this.state.user._id)) {
      const topNameValue = `Photos of ${this.state.user.first_name} ${this.state.user.last_name}`;
      this.props.setTopName(topNameValue);
    }
  }
  
  // eslint-disable-next-line class-methods-use-this
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  async fetchUserPhotos() {
    const userId = this.props.match.params.userId;
    const userListUrl = '/user/list';
    const userUrl = `/user/${userId}`;
    const photosUrl = `/photosOfUser/${userId}`;
  
    try {
      const [userListResponse, userResponse, photosResponse] = await Promise.all([
        axios.get(userListUrl),
        axios.get(userUrl),
        axios.get(photosUrl)
      ]);
  
      const enhancedPhotos = photosResponse.data.map(photo => ({
        ...photo,
        likes: photo.likes || []
      }));
  
      const sortedPhotos = enhancedPhotos.sort((a, b) => {
        const likeDifference = b.likes.length - a.likes.length;
        if (likeDifference !== 0) {
          return likeDifference; 
        }
        return new Date(b.date_time) - new Date(a.date_time);
      });
  
      this.setState({
        userList: userListResponse.data,
        user: userResponse.data,
        photos: sortedPhotos,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user photos:', error);
      this.setState({ loading: false });
    }
  }  
  
  handleAddComment = async (event, photoId) => {
    event.preventDefault();
    const commentText = event.target.elements.commentText.value.trim(); 
    if (!commentText) {
      console.error("Comment text cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`/commentsOfPhoto/${photoId}`, { comment: commentText });
      const updatedPhoto = response.data;

      this.setState(state => {
        const photos = state.photos.map(photo => {
          if (photo._id === photoId) {
            this.props.fetchUserList(); 
            return updatedPhoto;
          }
          return photo;
        });
        return { photos };
      });

      event.target.elements.commentText.value = ''; 
    } catch (error) {
      console.error("Error adding comment:", error);
    }
};

  addNewPhoto = (newPhoto) => {
    if (this.props.loggedInUserId === this.props.match.params.userId) {
      this.setState(prevState => ({
        photos: [...prevState.photos, newPhoto]
      }));
    }
    this.props.fetchUserList(); 
  };

  deletePhoto = async (photoId) => {
    try {
      const response = await axios.delete(`/photos/${photoId}`);
      if (response.status === 200) {
        this.setState(prevState => ({
          photos: prevState.photos.filter(photo => photo._id !== photoId),
        }));
        this.props.fetchUserList(); 
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  handleLike = async (photoId, action) => {
    try {
      const url = `/photos/${photoId}/${action}`; 
      const response = await axios.post(url);
      const updatedPhoto = response.data;
  
      this.setState(prevState => {
        const updatedPhotos = prevState.photos.map(photo => {
          if (photo._id === photoId) {
            return updatedPhoto;
          }
          return photo;
        });
        return { photos: updatedPhotos };
      });
    } catch (error) {
      console.error('Error updating like status:', error);
      console.error('Detailed error:', error.response.data);  
    }
  };

  handleDeleteComment = async (photoId, commentId) => {
    try {
      console.log(photoId,commentId);
      await axios.delete(`/photos/${photoId}/comments/${commentId}`);
      this.setState(state => {
        const photos = state.photos.map(photo => {
          if (photo._id === photoId) {
            const filteredComments = photo.comments.filter(comment => comment._id !== commentId);
            this.props.fetchUserList(); 
            return { ...photo, comments: filteredComments };
          }
          return photo;
        });
        return { photos };
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  render() {
    const { userList, photos, user, loading } = this.state;

    return (
      <div>
          <Typography variant="h4">Photos</Typography>
          <br /><br />
          {user && (
          <Link to={`/users/${user._id}`}>
            <Button variant="contained" component="a" >
              User Detail
            </Button>
          </Link>
          )}
          <br />
          {loading ? (
              <Typography variant="body1">Loading photos...</Typography>
          ) : (
              photos.map(photo => (
                  <Card key={photo._id} style={{ marginBottom: '20px' }}>
                      <Typography variant="body1">
                          Name: {user.first_name} {user.last_name}<br />
                          Uploaded: {this.formatDate(photo.date_time)}<br />
                      </Typography>
                      <CardMedia
                          component="img"
                          height="100%"
                          image={`/images/${photo.file_name}`}
                          alt={`Photo of ${user.first_name} ${user.last_name}`}
                          style={{objectFit: 'cover', width: '50%', height: '50%'}}
                      />
                      <Box display="flex" alignItems="center">
                      <IconButton onClick={() => this.handleLike(photo._id, photo.likes?.includes(this.props.loggedInUserId) ? 'unlike' : 'like')} style={{ marginRight: 8 }}>
                        {photo.likes?.includes(this.props.loggedInUserId) ? (
                          <FavoriteIcon style={{ color: 'red' }} className="heart-icon"/>
                        ) : (
                          <FavoriteBorderIcon className="heart-icon"/>
                        )}
                      </IconButton>
                      <Typography variant="subtitle1" component="span">{photo.likes?.length || 0}</Typography>

                      </Box>
                      <CardContent>
                          {this.props.loggedInUserId === this.props.match.params.userId && (
                            <IconButton
                              onClick={() => this.deletePhoto(photo._id)}
                              style={{ float: 'right' }}
                              aria-label="Delete photo"
                            >
                            <DeleteIcon />
                            </IconButton>
                          )}
                      <Typography variant="h6" gutterBottom>
                              Comments:
                      </Typography>
                          {photo.comments && photo.comments.length > 0 ? (
                              photo.comments.map((comment) => {
                                  const commentedUser = userList.find((cUser) => cUser._id === comment.user_id);
                                  return commentedUser ? (
                                      <div key={comment._id} style={{ marginBottom: '10px' }}>
                                          <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                              {commentedUser.first_name} {commentedUser.last_name}
                                          </Typography>
                                          <Typography variant="body2" style={{ color: 'text.secondary' }}>
                                              ({this.formatDate(comment.date_time)}):
                                          </Typography>
                                          <Typography variant="body1" style={{ marginTop: '4px' }}>
                                              {comment.comment}
                                          </Typography>
                                          {comment.user_id === this.props.loggedInUserId && (
                                            <IconButton onClick={() => this.handleDeleteComment(photo._id, comment._id)}
                                                  aria-label="Delete comment">
                                                  <DeleteIcon />
                                            </IconButton>
                                          )}
                                      </div>
                                  ) : null;
                              })
                          ) : (
                              <Typography variant="body1">No comments for this photo.</Typography>
                          )}
                          <div style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
                              <form onSubmit={(event) => this.handleAddComment(event, photo._id)}>
                                  <input
                                      type="text"
                                      placeholder="Add a comment..."
                                      name="commentText"
                                      style={{
                                          width: '100%',
                                          padding: '8px',
                                          marginBottom: '8px',
                                          borderRadius: '4px',
                                          border: '1px solid #e0e0e0',
                                      }}
                                  />
                                  <button
                                      type="submit"
                                      style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          borderRadius: '4px',
                                          backgroundColor: '#3f51b5',
                                          color: 'white',
                                          cursor: 'pointer',
                                      }}
                                  >
                                      Submit
                                  </button>
                              </form>
                          </div>
                      </CardContent>
                  </Card>
              ))
          )}
      </div>
    );
  }
}

export default UserPhotos;