import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "../../styles/layout.css";
import "../../styles/createPost.css";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [text, setText] = useState<string>(""); // For text content
  const [image, setImage] = useState<File | null>(null); // Endrer typen til File | null
  const [preview, setPreview] = useState<string | null>(""); // For image preview
  const [error, setError] = useState<string | null>(null); // For error messages
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success message

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Setter `image` som en fil
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Forhåndsviser bildet
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!text && !image) {
      setError("You must provide either text or an image.");
      return;
    }

    setIsSubmitting(true);

    // Opprett FormData for å sende tekst og bilde
    const formData = new FormData();
    formData.append("Text", text); // Må samsvare med backend-feltet "Text"
    if (image) {
      formData.append("uploadImage", image); // Må samsvare med backend-feltet "uploadImage"
    }

    try {
      const response = await fetch("http://localhost:5024/api/PostAPI/create", {
        method: "POST",
        body: formData,
        credentials: "include", // Inkluderer autentiseringstokenet
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to create post.");
      }

      // Rydd opp skjema ved suksess
      setText("");
      setImage(null);
      setPreview(null);
      setSuccessMessage('Post created successfully!'); // Sett suksessmelding

      // Naviger til hjemmesiden etter 2 sekunder
      setTimeout(() => {
        navigate('/');
      }, 1500);
        
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h2>Share something!</h2>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      <div className="row">
        {/* Left Column: Image Preview */}
        <div className="col-md-6 d-flex justify-content-center">
          <div id="imagePreview" className="border">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span className="text-muted">Image preview will appear here</span>
            )}
          </div>
        </div>

        {/* Right Column: Form Elements */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Validation Summary */}
            {error && <div className="text-danger mb-3">{error}</div>}

            {/* Text Area */}
            <div className="form-group mb-3">
              <textarea
                className="form-control form-control-lg"
                id="textArea"
                rows={6}
                placeholder="Write something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons Section */}
            <div className="form-group d-flex justify-content-between align-items-center">
              {/* Upload Image Button */}
              <button
                type="button"
                className="btn btn-primary btn-lg btn-post"
                onClick={() =>
                  document.getElementById("uploadImage")?.click()
                }
              >
                Upload Image
              </button>
              {/* Hidden File Input */}
              <input
                type="file"
                id="uploadImage"
                name="uploadImage"
                className="file-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-post"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
