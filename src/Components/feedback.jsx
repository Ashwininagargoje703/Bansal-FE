import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";
import { backendUrl } from "../http";
import {
  Alert,
  Box,
  Button,
  Container,
  Rating,
  Snackbar,
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
  const [editedReviewData, setEditedReviewData] = useState([]);
  const emaill = localStorage.getItem("email");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  const handleSnackbarClose = () => {
    setShowAlert(false);
  };

  const fetchReviewData = () => {
    const token = localStorage.getItem("token");

    fetch(`${backendUrl}/review/get-review/${emaill}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReviewData(data?.review ? [data.review] : []);
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

      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        fetchReviewData();
        setSubmitted(true);
        setEditMode(false);
        setReviewData([responseData]);
        setAlertSeverity("success");
        if (editMode) {
          console.log("review edited");
          setAlertMessage("Review Edited!");
        } else {
          setAlertMessage("Review Added!");
        }
      } else if (response.status === 409) {
        setAlertSeverity("error");
        setAlertMessage("Already reviewed!");
        throw new Error("Already reviewed");
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed!");
        throw new Error("Failed to submit feedback");
      }
      setShowAlert(true);
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
    setName(reviewData[0]?.name || "");
    setEmail(reviewData[0]?.email || "");
    setRating(reviewData[0]?.ratings || 0);
    setComment(reviewData[0]?.message || "");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Bansal Feedback
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
      {showAlert && (
        <Snackbar
          open={showAlert}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Feedback;
