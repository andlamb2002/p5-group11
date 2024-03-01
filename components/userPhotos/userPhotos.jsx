import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { fetchModel } from '../../lib/fetchModelData';
import TopBar from '../topBar/TopBar';

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  fetchUserPhotos() {
    const userId = this.props.match.params.userId;
    const userUrl = `http://localhost:3000/user/${userId}`;
    const photosUrl = `http://localhost:3000/photosOfUser/${userId}`;

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
  }

  render() {
    const { photos, user, loading } = this.state;
    const topNameValue = user ? `User Photos for ${user.first_name} ${user.last_name}` : '';

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
                Uploaded: {photo.date_time}<br />
              </Typography>
              <CardMedia
                component="img"
                height="100%"
                image={`/images/${photo.file_name}`}
                alt={`Photo ${photo._id}`}
                style={{objectFit: 'cover', width: '50%', height: '50%', background:  '#F7FF41'}}
              />
              <CardContent>
                {photo.comments && photo.comments.length > 0 ? (
                  <div>
                    <Typography variant="h5">Comments:</Typography>
                    {photo.comments.map(comment => (
                      <div key={comment._id}>
                        <Typography variant="body1">
                          <Link to={`/users/${comment.user._id}`}>
                            {comment.user.first_name} {comment.user.last_name}
                          </Link> &#160;
                          ( {comment.date_time} ): &#160; 
                          {comment.comment}
                          <br />
                        </Typography>
                      </div>
                    ))}
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
