import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./PhotoForm.css";

function PhotoForm({ movieId, auth }) {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const [photoId, setPhotoId] = useState(null);
  const urlRef = useRef();
  const descriptionRef = useRef();

  // Fetch photos for a movie
  const fetchPhotos = useCallback(() => {
    axios
      .get(`/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      .then((response) => setPhotos(response.data.photos))
      .catch((error) => console.error("Error fetching photos:", error));
  }, [movieId, auth.accessToken]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Save a new photo
  const savePhoto = () => {
    if (!urlRef.current.value || !descriptionRef.current.value) {
      alert("URL and Description are required!");
      return;
    }

    const newPhoto = {
      url: urlRef.current.value,
      description: descriptionRef.current.value,
      movieId,
    };

    axios
      .post(`/admin/photos`, newPhoto, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      .then(() => {
        alert("Photo added successfully!");
        fetchPhotos();
        clearForm();
      })
      .catch((error) => console.error("Error adding photo:", error));
  };

  // Update an existing photo
  const updatePhoto = () => {
    if (!photoId) return;

    const updatedPhoto = {
      ...selectedPhoto,
      url: urlRef.current.value,
      description: descriptionRef.current.value,
    };

    axios
      .patch(`/photos/${photoId}`, updatedPhoto, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      .then(() => {
        alert("Photo updated successfully!");
        fetchPhotos();
        clearForm();
      })
      .catch((error) => console.error("Error updating photo:", error));
  };

  // Delete a photo
  const deletePhoto = (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    axios
      .delete(`/photos/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      .then(() => {
        alert("Photo deleted successfully!");
        fetchPhotos();
      })
      .catch((error) => console.error("Error deleting photo:", error));
  };

  // Import photos from TMDB
  const importPhotos = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
        headers: {
          Authorization: `Bearer <YOUR_TMDB_API_KEY>`,
        },
      })
      .then((response) => {
        const importedPhotos = response.data.backdrops.map((img) => ({
          url: `https://image.tmdb.org/t/p/w500${img.file_path}`,
          description: "Imported from TMDB",
          movieId,
        }));

        // Bulk save imported photos
        axios
          .post(`/admin/photos/bulk`, { photos: importedPhotos }, {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          })
          .then(() => {
            alert("Photos imported successfully!");
            fetchPhotos();
          })
          .catch((error) => console.error("Error importing photos:", error));
      })
      .catch((error) => console.error("Error fetching TMDB photos:", error));
  };

  const clearForm = () => {
    setSelectedPhoto({});
    setPhotoId(null);
    urlRef.current.value = "";
    descriptionRef.current.value = "";
  };

  return (
    <div className="photo-form-container">
      <div className="photo-list">
        {photos.length ? (
          photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img src={photo.url} alt={photo.description} />
              <p>{photo.description}</p>
              <div className="photo-actions">
                <button onClick={() => { setSelectedPhoto(photo); setPhotoId(photo.id); }}>Edit</button>
                <button onClick={() => deletePhoto(photo.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No photos available.</p>
        )}
      </div>
      <div className="photo-form">
        <input
          ref={urlRef}
          type="text"
          placeholder="Photo URL"
          defaultValue={selectedPhoto.url || ""}
        />
        <textarea
          ref={descriptionRef}
          placeholder="Description"
          defaultValue={selectedPhoto.description || ""}
        />
        <div className="form-actions">
          {photoId ? (
            <button onClick={updatePhoto}>Update</button>
          ) : (
            <button onClick={savePhoto}>Save</button>
          )}
          <button onClick={clearForm}>Clear</button>
          <button onClick={importPhotos}>Import Photos</button>
        </div>
      </div>
    </div>
  );
}

export default PhotoForm;
