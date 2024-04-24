import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import axios from 'axios';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      photos: [],
      user: null,
      loading: true,
      favorite_ids: [],
    };
    console.log('UserPhotos constructor');
  }

  componentDidMount() {
    console.log('UserPhotos componentDidMount');
    this.fetchUserPhotos();
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
    console.log('UserPhotos fetchUserPhotos');
    
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
      console.log('userListResponse, userResponse, photosResponse',userListResponse, userResponse, photosResponse)

      this.setState({
        userList: userListResponse.data,
        user: userResponse.data,
        photos: photosResponse.data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }

    axios
      .get(`/getFavorites`)
        .then((response) => {
          console.log("Received Favorites:", response.data);

          let favorite_ids = response.data.map((photo) => photo._id);
          this.setState({ favorite_ids });
          })
          .catch((err) => {
          console.error("Error fetching favorites:", err.response || err.message);
          // Handle error and update state accordingly
          this.setState({ loading: false });
        });

  }
  handleAddComment = async (event, photoId) => {
    event.preventDefault();
    const commentText = event.target.elements.commentText.value;
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

  render() {
    const { userList, photos, user, loading } = this.state;
    console.log('user photos render',photos);

    return (
        <div>
          <Typography variant="h4">Photos</Typography>

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
                    <CardContent>
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
