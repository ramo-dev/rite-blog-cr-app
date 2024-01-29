import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { overlayStyles, popupStyles, closeStyles, contentStyles, activePopupStyles } from "./styles"; // Import your styles file

const Create = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('User');
  const [lastId, setLastId] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
  const history = useHistory();
  const url = 'http://127.0.0.1:5000/api/blogs';

  // Fetch the last id from the server
  useEffect(() => {
    fetchLastId();
  }, []);

  const fetchLastId = () => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const maxId = Math.max(...data.blogs.map(blog => blog.id));
        setLastId(maxId);
      })
      .catch(error => {
        console.error('Error fetching last id:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    const newId = lastId + 1; // Increment the last fetched id
    const blog = { id: newId, title, body, author };
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    })
    .then(() => {
      setIsPending(false);
      setShowModal(true); // Show the modal after creating the blog
    })
    .catch(error => {
      console.error('Error adding new blog:', error);
      setIsPending(false);
    });
  };

  const closeModalAndRedirect = () => {
    setShowModal(false);
    history.push('/'); // Redirect to "/"
  };

  return (
    <div className="create">
      <h2>Add a new Blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog Title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label>Blog Body:</label>
        <textarea
          required
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <label>Blog Author:</label>
        <select
          required
          value={author}
          onChange={e => setAuthor(e.target.value)}
        >
          <option value="shakespear">shakespear</option>
          <option value="Persona">Persona</option>
          <option value="User">User</option>
          <option value="rome">rome</option>
        </select>
        {!isPending ? (
          <input type="submit" value="Add Blog" />
        ) : (
          <button disabled>Loading...</button>
        )}
      </form>
      {/* Modal */}
      {showModal && (
        <div style={overlayStyles}>
          <div className="popup" style={{ ...popupStyles, ...activePopupStyles }}>
            <a className="close" style={closeStyles} onClick={closeModalAndRedirect}>x</a>
            <div className="content" style={contentStyles}>
              Blog Created Successfully.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
