import React from 'react';
import {
  Typography
} from '@mui/material';
import './userPhotos.css';
import { Link } from 'react-router-dom';


/**
 * Define UserPhotos, a React componment of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    const userId = this.props.match.params.userId;
    const photos = window.models.photoOfUserModel(userId); 
    const user = window.models.userModel(userId);

    console.log("User Details:");
        console.log("User ID:", user._id);
        console.log("First Name:", user.first_name);
        console.log("Last Name:", user.last_name);
        console.log("Location:", user.location);
        console.log("Description:", user.description);

    photos.forEach(photo => {
        console.log("Photo Details:");
        console.log("Photo ID:", photo._id);
        console.log("Date/Time:", photo.date_time);
        console.log("File Name:", photo.file_name);
        console.log("User ID:", photo.user_id);

        if (photo.comments && photo.comments.length > 0) {
            console.log("Comments:");
            photo.comments.forEach(comment => {
                console.log("  Comment ID:", comment._id);
                console.log("  Date/Time:", comment.date_time);
                console.log("  Comment:", comment.comment);
                console.log("  User:", comment.user.first_name, comment.user.last_name);
                console.log("  User Location:", comment.user.location);
                console.log("  User Description:", comment.user.description);
            });
        } else {
            console.log("No comments for this photo.");
        }
    });

    return (

      <div>
        {photos.map(photo => (
          <div key={photo._id}>
            
            <img src={`/images/${photo.file_name}`}/>

            {photo.comments && photo.comments.length > 0 ? (
              <div>
                <h3>Comment Section</h3>
                {photo.comments.map(comment => (
                  <div key={comment._id} className="comment">
                    
                    <p>
                      <Link to={`/users/${comment.user._id}`}>
                      {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      &#160;&#40;{comment.date_time}&#41;: {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments for this photo.</p>
            )}
          </div>
        ))}
      </div>
      
      // <Typography variant="body1">
      // This should be the UserPhotos view of the PhotoShare app. Since
      // it is invoked from React Router the params from the route will be
      // in property match. So this should show details of user:
      // {this.props.match.params.userId}. You can fetch the model for the user from
      // window.models.photoOfUserModel(userId):
      //   <Typography variant="caption">
      //     {JSON.stringify(window.models.photoOfUserModel(this.props.match.params.userId))}
      //   </Typography>
      // </Typography>
        
    );
  }
}

export default UserPhotos;
