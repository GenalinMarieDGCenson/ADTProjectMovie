import React, { useEffect, useContext, useCallback, useState } from 'react';
import { AuthContext } from '../../../utils/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';
import CastCards from '../../../components/castCards/CastCards';
import VideoCards from '../../../components/videoCards/VideoCards';
import PhotoCards from '../../../components/photoCards/PhotoCards';

function Movie() {
  const { auth, movie, setMovie } = useContext(AuthContext);
  const navigate = useNavigate();
  const { movieId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const [currentCap, setCurrentCap] = useState('');

  const fetchMovie = useCallback(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
        .then(response => setMovie(response.data))
        .catch(() => navigate('/home'));
    }
  }, [movieId, auth.accessToken, setMovie, navigate]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  const openModalImage = (photoUrl, photoCap) => {
    setCurrentImg(photoUrl);
    setCurrentCap(photoCap);
    setModalOpen(true);
  };

  const closeModalImage = () => {
    setModalOpen(false);
    setCurrentImg('');
    setCurrentCap('');
  };

  if (!movie) return null;

  const { casts = [], videos = [], photos = [], title, overview, backdropPath, posterPath } = movie;

  return (
    <div className="container-movie-card">
      {/* Movie Info Section */}
      <div
        className="Movie-Tab-Info"
        style={{
          backgroundImage: `url(${backdropPath || posterPath || ''})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
        }}
      >
        <div className="background-overlay"></div>
        <div className="banner">
          <img className="View-Movie-Poster" src={posterPath} alt="Movie Poster" />
        </div>
        <div className="info-movie-flex">
          <h1>{title}</h1>
          <hr />
          <h3 className="overview-h3">{overview}</h3>
        </div>
      </div>

      {/* Cast Section */}
      <Section
        title="Cast & Crew"
        list={casts}
        emptyMessage="No cast here? I think they are on vacation... 🏝️🍹"
        renderItem={cast => <CastCards key={cast.id} cast={cast} />}
      />

      {/* Videos Section */}
      <Section
        title="Videos"
        list={videos}
        emptyMessage="No videos yet. We are filming at the moment. 📽️▶️"
        renderItem={video => <VideoCards key={video.id} video={video} />}
      />

      {/* Photos Modal */}
      {modalOpen && (
        <div className="modal" onClick={closeModalImage}>
          <span className="close-web-btn" onClick={closeModalImage}>&times;</span>
          <img className="modal-container-content" src={currentImg} alt={currentCap} />
          <div className="caption-photo">{currentCap}</div>
        </div>
      )}

      {/* Photos Section */}
      <Section
        title="Photos"
        list={photos}
        emptyMessage="No photos yet. Taking some now! 📷🖼️"
        renderItem={photo => (
          <PhotoCards
            key={photo.id}
            photo={photo}
            onClick={() => openModalImage(photo.url, photo.description)}
          />
        )}
      />
    </div>
  );
}

// Reusable Section Component
function Section({ title, list, emptyMessage, renderItem }) {
  return (
    <div className="Slider-Color">
      <h1 className="Tab-Viewer-h1">{title}</h1>
      {list.length ? (
        <div className="Slide-Viewer">
          {list.map(item => renderItem(item))}
        </div>
      ) : (
        <p className="not-found-message">{emptyMessage}</p>
      )}
    </div>
  );
}

export default Movie;
