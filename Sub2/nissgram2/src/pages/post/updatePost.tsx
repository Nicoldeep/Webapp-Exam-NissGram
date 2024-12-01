import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Ny tilstand for suksessmelding

  const BASE_URL = 'http://localhost:5024';

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/PostAPI/details/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }

        const data = await response.json();
        console.log('Fetched post details:', data);

        const fullImageUrl = data.imgUrl?.startsWith('/images/')
          ? `${BASE_URL}${data.imgUrl}`
          : data.imgUrl || null;

        setPostDetails({
          text: data.text || '',
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
    if (!postDetails.text.trim() && !newImage) {
      alert('You must provide either a text or an image to update the post.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('text', postDetails.text);
      if (newImage) {
        formData.append('newImage', newImage);
      }

      console.log('Sending data to backend:', {
        text: postDetails.text,
        image: newImage,
      });

      const response = await fetch(`${BASE_URL}/api/PostAPI/update/${postId}`, {
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
        imageUrl: `${BASE_URL}${updatedPost.imgUrl}`,
      });

      setImagePreview(`${BASE_URL}${updatedPost.imgUrl}?t=${Date.now()}`);
      setSuccessMessage('Post updated successfully!'); // Sett suksessmelding

      // Naviger til hjemmesiden etter 2 sekunder
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating post:', err.message || err);
      alert('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <p>Loading post data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h2>Update your post!</h2>
      </div>

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
                className="btn btn-primary"
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
                type="button"
                className="btn btn-success"
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
