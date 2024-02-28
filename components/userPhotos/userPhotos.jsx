import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

class UserPhotos extends React.Component {
  render() {
    const userId = this.props.match.params.userId;
    const photos = window.models.photoOfUserModel(userId);
    const user = window.models.userModel(userId);

    return (
      <div>
        <Typography variant="h4">Photos</Typography>
        
        {photos.map(photo => (
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
        ))}
      </div>
    );
  }
}

export default UserPhotos;
