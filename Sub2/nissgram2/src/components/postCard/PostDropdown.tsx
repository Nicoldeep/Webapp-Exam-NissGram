import React from "react";
import { useNavigate } from "react-router-dom";

interface PostDropdownProps {
  postId: number;
  onDelete: () => void;
  onEdit: () => void;

}

const PostDropdown: React.FC<PostDropdownProps> = ({ onDelete, postId }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    // Naviger til UpdatePost-siden med postId
    navigate(`/updatePost/${postId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `http://localhost:5024/api/PostAPI/delete/${postId}`,
          {
            method: "DELETE",
            credentials: "include", // Send cookies eller annen autentisering
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the post.");
        }

        alert("Post deleted successfully!");
        onDelete(); // Kaller `onDelete` for å oppdatere UI etter sletting
        window.location.reload(); // Oppdaterer siden for å reflektere endringene
      } catch (error: any) {
        console.error("Error deleting post:", error.message || error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  return (
    <div className="dropdown" style={{ position: "absolute", right: 20, top: 10 }}>
      <button
        className="btn btn-link p-0"
        type="button"
        id={`dropdownMenuButton-${postId}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ color: "black" }}
      >
        {/* Burger Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-three-dots"
          viewBox="0 0 16 16"
        >
          <path d="M3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby={`dropdownMenuButton-${postId}`}
      >
        <li>
          <button className="dropdown-item" onClick={handleEdit}>
            Edit
          </button>
        </li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleDelete}>
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PostDropdown;
