import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import axios from 'axios';
import TopBar from '../topBar/TopBar';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      photos: [],
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchUserPhotos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUserPhotos();
    }
  }

  static formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  async fetchUserPhotos() {
    const userId = this.props.match.params.userId;
    const userListUrl = '/user/list';
    const userUrl = `/user/${userId}`;
    const photosUrl = `/photosOfUser/${userId}`;

    /*
    Promise.all([fetchModel(userUrl), fetchModel(photosUrl)])
      .then(([userResponse, photosResponse]) => {
        this.setState({
          user: userResponse.data,
          photos: photosResponse.data,
          loading: false
        });
      })
      .catch(error => {
        console.error('Error fetching user photos:', error);
      });
      */

    try {
      const [userListResponse, userResponse, photosResponse] = await Promise.all([
        axios.get(userListUrl),
        axios.get(userUrl),
        axios.get(photosUrl)
      ]);

      this.setState({
        userList: userListResponse.data,
        user: userResponse.data,
        photos: photosResponse.data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }
  }

  render() {
    const { userList, photos, user, loading } = this.state;
    const topNameValue = user ? `Photos of ${user.first_name} ${user.last_name}` : '';

    return (
        <div>
          <TopBar topName={topNameValue}/>
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
                      {photo.comments && photo.comments.length > 0 ? (
                          <div>
                            <Typography variant="h5">Comments:</Typography>
                            {photo.comments.map(comment => {
                              const commentedUser = userList.find(cUser => cUser._id === comment.user_id);
                              if (commentedUser) {
                                return (
                                    <div key={comment._id}>
                                      <Typography variant="body1">
                                        <Link to={`/users/${comment.user_id}`}>
                                          {commentedUser.first_name} {commentedUser.last_name}
                                        </Link>
                                        ( {this.formatDate(comment.date_time)} ):
                                        {comment.comment}
                                        <br />
                                      </Typography>
                                    </div>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                      ) : (
                          <Typography variant="body1">No comments for this photo.</Typography>
                      )}
                    </CardContent>
                  </Card>
              ))
          )}
        </div>
    );
  }
}

export default UserPhotos;
