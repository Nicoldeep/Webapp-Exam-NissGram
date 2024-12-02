import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout.css";
import "../../styles/createPost.css";
import { createPost } from "./../../api/operations";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [text, setText] = useState<string>(""); // For tekstinnhold
  const [image, setImage] = useState<File | null>(null); // For bildefil
  const [preview, setPreview] = useState<string | null>(""); // For bilde-forhåndsvisning
  const [error, setError] = useState<string | null>(null); // For feilmeldinger
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For lasting
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For suksessmelding

  // Håndter bildevalg og forhåndsvisning
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // Maksimal størrelse: 5 MB
        setError("Image size must be less than 5MB.");
        return;
      }

      setImage(file); // Lagre fil
      setError(null); // Nullstill feilmelding

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Sett forhåndsvisning
      };
      reader.readAsDataURL(file);
    }
  };

  // Håndter skjema-validering
  const validateInputs = () => {
    if (!text.trim() && !image) {
      setError("You must provide either text or an image.");
      return false;
    }

    if (text.length > 500) {
      setError("Text must not exceed 500 characters.");
      return false;
    }

    setError(null); // Nullstill feilmelding hvis alt er OK
    return true;
  };

  // Håndter skjema-innsending
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccessMessage(null);

  if (!validateInputs()) return;

  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("Text", text.trim());
  if (image) {
      formData.append("uploadImage", image);
  }

  try {
      console.log("[DEBUG] Sending data to backend:", {
          text: text.trim(),
          image,
      });

      // Bruker createPost fra operations
      const response = await createPost(formData);

      if (response.error) {
          throw new Error(response.error);
      }

      console.log("[DEBUG] Post created successfully:", response);

      // Nullstill skjema ved suksess
      setText("");
      setImage(null);
      setPreview(null);
      setSuccessMessage("Post created successfully!");
      // Naviger til hjemmesiden etter 2 sekunder
      
      navigate("/");
  } catch (err: any) {
      console.error("[ERROR] Failed to create post:", err.message || err);
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

      {/* Suksessmelding */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      {/* Feilmelding */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {/* Venstre kolonne: Forhåndsvisning av bilde */}
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

        {/* Høyre kolonne: Skjemafelt */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Tekstområde */}
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

            {/* Knapper */}
            <div className="form-group d-flex justify-content-between align-items-center">
              {/* Opplastingsknapp */}
              <button
                type="button"
                className="btn btn-primary btn-lg btn-post"
                onClick={() =>
                  document.getElementById("uploadImage")?.click()
                }
              >
                Upload Image
              </button>
              <input
                type="file"
                id="uploadImage"
                name="uploadImage"
                className="file-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* Innsendingsknapp */}
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
