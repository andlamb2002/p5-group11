import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar } from '@mui/material';

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
      <h1>User Comments</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <Link to={`/photos/${userId}`}>
              <Avatar
                src={`/images/${comment.fileName}`}
                alt={`Thumbnail of ${comment.fileName}`}
                
              />
            </Link>


            <div style={{ marginTop: "10px" }}>
              <p>{comment.commentText}</p>
              <p>Date: {new Date(comment.dateTime).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default userComments;
