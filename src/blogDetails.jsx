import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { overlayStyles, popupStyles, contentStyles, activePopupStyles } from './styles';

const BlogDetails = () => {
  const blogsUrl = 'http://127.0.0.1:5000/api/blogs';
  const { id } = useParams();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
  const [blog, setBlog] = useState(null); // State variable for blog data

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${blogsUrl}/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id, blogsUrl]);

  const handleClick = () => {
    // Show modal confirmation dialog
    setShowModal(true);
  };

  const handleDelete = () => {
    fetch(`${blogsUrl}/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      history.push('/');
    })
    .catch(error => {
      console.error('Error deleting blog:', error);
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-details">
      {/* Modal */}
      {showModal && (
        <div style={overlayStyles}>
          <div className="popup" style={{ ...popupStyles, ...activePopupStyles }}>
            <div className="content" style={contentStyles}>
              Are you sure you want to delete this blog?<br></br>
              <button onClick={handleDelete} style={{marginTop:'30px', marginLeft:'20%', marginRight:'30px'}}>Yes, Delete</button>
              <button onClick={closeModal} style={{
                background: '#5200D0'
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Render blog content */}
      <article>
        <h2>{blog.title}</h2>
        <p>Written by <span>{blog.author}</span></p>
        <div>{blog.body}</div>
        <button onClick={handleClick}>Delete</button>
      </article>
    </div>
  );
};

export default BlogDetails;
