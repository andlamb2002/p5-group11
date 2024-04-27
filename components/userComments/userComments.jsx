import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Avatar } from '@mui/material';

const userComments = () => {
  const { userId } = useParams();
  const [comments, setComments] = React.useState([]);
  const [error, setError] = React.useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/user/${userId}/comments`);
        setComments(response.data);
        setError("");
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError("Failed to load comments. Please try again later.");
      }
    };

    fetchComments();
  }, [userId]);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>User Comments</Typography>
      <br />
      {error ? (
        <p>{error}</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} style={{ marginBottom: "20px" , marginTop: "20px"}}>
            <Link to={`/photos/${userId}`}>
              <Avatar
                src={`/images/${comment.fileName}`}
                alt={`Thumbnail of ${comment.fileName}`}
                
              />
            </Link>

            <Link to={`/photos/${userId}`} style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'Roboto', marginBottom: "20px" }}>
              <div style={{ marginTop: "20px" , padding: "20px", border: "black", background: "#ededed", borderRadius: "10%", width: "60%"}}>
                <p style={{ color: 'grey'}} >Date: {new Date(comment.dateTime).toLocaleString()}</p>
                <br />
                <p style={{ color: 'black' }} >{comment.commentText}</p>
              </div>
            </Link>

          </div>
        ))
      )}
    </div>
  );
};

export default userComments;
