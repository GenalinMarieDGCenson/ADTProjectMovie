import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import './Photo-Form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PhotoForm() {
  const { auth } = useContext(AuthContext);
  const [photoId, setPhotoId] = useState(null);
  const urlRef = useRef();
  const descriptionRef = useRef();
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const { movieId } = useParams();

  const fetchPhotos = useCallback(() => {
    axios
      .get(`/movies/${movieId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => setPhotos(response.data.photos))
      .catch((error) => console.error("Error fetching photos:", error.response?.data));
  }, [movieId, auth.accessToken]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current.value.trim()) {
      fieldRef.current.style.border = '2px solid red';
      setTimeout(() => (fieldRef.current.style.border = '1px solid #ccc'), 2000);
      console.error(`${fieldName} cannot be empty.`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateField(urlRef, 'URL') || !validateField(descriptionRef, 'Description')) return;

    const data = {
      userId: auth.user.userId,
      movieId,
      url: selectedPhoto.url,
      description: selectedPhoto.description,
    };

    try {
      await axios.post('/admin/photos', data, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert('Photo added successfully!');
      setSelectedPhoto({});
      fetchPhotos();
    } catch (error) {
      console.error("Error saving photo:", error.response?.data || error.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      axios
        .delete(`/photos/${id}`, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        })
        .then(() => {
          alert('Photo deleted successfully!');
          fetchPhotos();
        })
        .catch((error) => console.error("Error deleting photo:", error.response?.data));
    }
  };

  const fetchPhotoDetails = (id) => {
    axios
      .get(`/photos/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        setSelectedPhoto(response.data);
        setPhotoId(response.data.id);
      })
      .catch((error) => console.error("Error fetching photo details:", error.response?.data));
  };

  const handleUpdate = async () => {
    if (!validateField(urlRef, 'URL') || !validateField(descriptionRef, 'Description')) return;

    if (window.confirm('Are you sure you want to update this photo?')) {
      const data = {
        userId: auth.user.userId,
        movieId: selectedPhoto.movieId,
        url: selectedPhoto.url,
        description: selectedPhoto.description,
      };

      try {
        await axios.patch(`/photos/${photoId}`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        alert('Photo updated successfully!');
        setSelectedPhoto({});
        setPhotoId(null);
        fetchPhotos();
      } catch (error) {
        console.error("Error updating photo:", error.response?.data);
      }
    }
  };

  return (
    <div className="photo-box">
      <div className="Photo-View-Box">
        {photos.length > 0 ? (
          <div className="card-display-photo">
            {photos.map((photo) => (
              <div key={photo.id} className="card-photo">
                <div className="buttons-group">
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => fetchPhotoDetails(photo.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="image-style"
                />
                <div className="container-photo">
                  <p>{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-photo">
            <h3>No Photos Found</h3>
          </div>
        )}
      </div>

      <div className="Photo-Search-Box">
        <div className="parent-container">
          <div className="photo-container-center">
            <div className="photo-image-container">
              <img
                alt="Selected"
                src={selectedPhoto.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                className="photo-img"
              />
            </div>
          </div>
          <div className="photo-info-text">
            <div className="input-group">
              <label>URL Image:</label>
              <input
                className="photo-url"
                value={selectedPhoto.url || ''}
                onChange={(e) =>
                  setSelectedPhoto({ ...selectedPhoto, url: e.target.value })
                }
                ref={urlRef}
              />
            </div>
            <div className="input-group">
              <label>Description:</label>
              <textarea
                className="photo-description"
                value={selectedPhoto.description || ''}
                onChange={(e) =>
                  setSelectedPhoto({ ...selectedPhoto, description: e.target.value })
                }
                ref={descriptionRef}
              />
            </div>
          </div>
          <div className="save-edit-back-btn">
            {photoId ? (
              <button type="button" className="edit-save-btn" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button type="button" className="edit-save-btn" onClick={handleSave}>
                Save
              </button>
            )}
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setSelectedPhoto({});
                setPhotoId(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoForm;
