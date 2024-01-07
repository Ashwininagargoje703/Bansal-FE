import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";
import { backendUrl } from "../http";
import {
  Box,
  Button,
  Container,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [editedReviewData, setEditedReviewData] = useState([]); // New state for edited review data
  const emaill = localStorage.getItem("email");

  const fetchReviewData = () => {
    fetch(`${backendUrl}/review/get-review/${emaill}`)
      .then((response) => response.json())
      .then((data) => {
        setReviewData(data?.review ? [data.review] : []);
        // console.log("fetch data", data?.review);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchReviewData();
  }, [emaill]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ratings: rating,
      message: comment,
      name: name,
      email: email,
    };

    try {
      let url = `${backendUrl}/review/add-review`;
      if (editMode) {
        url = `${backendUrl}/review/edit-review`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        fetchReviewData();
        setSubmitted(true);
        setEditMode(false);
        setReviewData([responseData]); // Update reviewData with the new/updated feedback
      } else if (response.status === 409) {
        throw new Error("Already reviewed");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
    setSubmitted(false);
    setName(reviewData[0]?.name || ""); // Use editedReviewData[0] to access the first item in the array
    setEmail(reviewData[0]?.email || "");
    setRating(reviewData[0]?.ratings || 0);
    setComment(reviewData[0]?.message || "");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Feedback
      </Typography>

      {(editMode || reviewData.length === 0) && (
        <form onSubmit={handleSubmit}>
          <TextField
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Box mb={3}>
            <Typography>Rating:</Typography>
            <Rating
              name="size-large"
              size="large"
              value={rating}
              onChange={(event, newValue) => handleRatingChange(newValue)}
              precision={3}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Box>
          <TextField
            id="comment"
            label="Comment"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: 80,
              backgroundColor: "black",
              textTransform: "none",
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </form>
      )}

      {!editMode && reviewData.length > 0 && (
        <div>
          <h2>Review Data</h2>
          {reviewData.map((review, index) => (
            <div key={index}>
              <p>Email: {review.email}</p>
              <p>Ratings: {review.ratings}</p>
              <p>Review: {review.message}</p>
              {/* Add more fields as needed */}
            </div>
          ))}
          <Button
            variant="contained"
            onClick={handleEdit}
            sx={{
              width: 140,
              backgroundColor: "black",
              textTransform: "none",
            }}
          >
            Edit Feedback
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Feedback;
