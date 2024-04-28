import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Avatar } from '@mui/material';

const userComments = ({ setTopName }) => {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/user/${userId}/comments`);

        const userDetails = await axios.get(`/user/${userId}`);
        setTopName(`Comments of ${userDetails.data.first_name} ${userDetails.data.last_name}`);

        const photoDetails = await Promise.all(
          data.map(comment => axios.get(`/photo/${comment.photoId}`)
              .then(res => res.data)
              .catch(err => {
                console.error(`Failed to fetch photo details for photo ID ${comment.photoId}:`, err);
                return null; 
              })
          )
        );

        const commentsWithPhotoUser = data.map((comment, index) => ({
          ...comment,
          photoUser: photoDetails[index] ? photoDetails[index].user_id : 'unknown'  
        }));

        setComments(commentsWithPhotoUser);
        setError("");
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError("No comments.");
      }
    };

    fetchComments();
  }, [userId, setTopName]);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>User Comments</Typography>
      <br />
      {error ? (
        <Typography>{error}</Typography>
      ) : (
        comments.map((comment, index) => (
          <div key={index} style={{ marginBottom: "20px", marginTop: "20px" }}>
            <Link to={`/photos/${comment.photoUser}`}>
              <Avatar
                src={`/images/${comment.fileName}`}
                alt={`Thumbnail of ${comment.fileName}`}
              />
            </Link>
            <Link to={`/photos/${comment.photoUser}`} style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'Roboto', marginBottom: "20px" }}>
              <div style={{ marginTop: "20px", padding: "20px", background: "#ededed", borderRadius: "10%", width: "60%" }}>
                <Typography variant="body2" style={{ color: 'grey' }}>Date: {new Date(comment.dateTime).toLocaleString()}</Typography>
                <br />
                <Typography variant="body1">{comment.commentText}</Typography>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default userComments;
