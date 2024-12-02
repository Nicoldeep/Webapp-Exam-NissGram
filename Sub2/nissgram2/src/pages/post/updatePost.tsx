import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../styles/layout.css";
import "../../styles/createPost.css";
import config from './../../apiConfig';
import { getPostDetails } from './../../api/operations';

const UpdatePost: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  const [postDetails, setPostDetails] = useState({
    text: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For valideringsfeil
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For suksessmelding

  useEffect(() => {
    const fetchPostDetails = async () => {
        try {
            const response = await getPostDetails(Number(postId)); // Bruker getPostDetails fra operations

            if (response.error) {
                throw new Error(response.error); // Håndterer feil fra API-kallet
            }

            console.log('Fetched post details:', response);

            const fullImageUrl = response.imgUrl?.startsWith('/images/')
                ? `${config.BACKEND_URL}${response.imgUrl}`
                : response.imgUrl || null;

            setPostDetails({
                text: response.text || '',
                imageUrl: fullImageUrl || '',
            });

            setImagePreview(fullImageUrl);
        } catch (err: any) {
            console.error('Error fetching post details:', err.message || err);
            setError(err.message || 'Failed to load post data.');
        } finally {
            setLoading(false);
        }
    };

    if (postId) {
        fetchPostDetails();
    }
}, [postId]);

  const handleInputChange = (value: string) => {
    setPostDetails((prevDetails) => ({
      ...prevDetails,
      text: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Inputvalidering uten dialogboks
    if (!postDetails.text.trim() && (newImage == null && imagePreview == null)) {
      setError("You must provide either text or an image to update the post.");
      return;
    }
    setError(null); // Nullstill feil hvis valideringen består
  
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append('text', postDetails.text);
  
      if (newImage) {
        // Hvis et nytt bilde er valgt, legg til det i formData
        formData.append('newImage', newImage);
      } else if (postDetails.imageUrl) {
        // Hvis det eksisterende bildet ikke er endret, legg til URL-en
        formData.append('ImgUrl', postDetails.imageUrl);
      }
  
      console.log('Sending data to backend:', {
        text: postDetails.text,
        image: newImage || postDetails.imageUrl,
      });
  
      const response = await fetch(`${config.BACKEND_URL}/api/PostAPI/update/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update post.');
      }
  
      const updatedPost = await response.json();
      console.log('Backend returned updated post details:', updatedPost);
  
      setPostDetails({
        text: updatedPost.text,
        imageUrl: `${config.BACKEND_URL}${updatedPost.imgUrl}`,
      });
  
      setImagePreview(`${config.BACKEND_URL}${updatedPost.imgUrl}?t=${Date.now()}`);
      setSuccessMessage('Post updated successfully!'); // Sett suksessmelding
      
      // Naviger til hjemmesiden etter 2 sekunder
        navigate('/');
    } catch (err: any) {
      console.error('Error updating post:', err.message || err);
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  if (loading) return <p>Loading post data...</p>;

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h2>Update your post!</h2>
      </div>

      {/* Feilmelding */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Suksessmelding */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      <div className="row">
        <div className="col-md-6 d-flex justify-content-center">
          <div id="imagePreview" className="border">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <span className="text-muted">Image preview will appear here</span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="hidden" value={postId} />

            <div className="form-group">
              <label htmlFor="textArea" className="font-weight-bold">
                Content
              </label>
              <textarea
                className="form-control"
                id="textArea"
                rows={6}
                placeholder="Write something..."
                value={postDetails.text}
                onChange={(e) => handleInputChange(e.target.value)}
              ></textarea>
            </div>
            <br />

            <div className="form-group d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => document.getElementById('uploadImage')?.click()}
              >
                Upload Image
              </button>
              <input
                type="file"
                id="uploadImage"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />

              <button
                type="submit"
                className="btn btn-success btn btn-primary btn-lg"
                onClick={handleSave}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
