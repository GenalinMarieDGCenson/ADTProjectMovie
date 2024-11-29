import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Video-Form.css';

function VideoForm() {
  const { auth } = useContext(AuthContext);
  const [videoId, setVideoId] = useState(undefined);
  const [videoURL, setVideoURL] = useState('');
  const [videos, setVideos] = useState([]);
  const [videoKey, setVideoKey] = useState('');
  const [selectedVideo, setSelectedVideo] = useState({});
  const urlRef = useRef();
  const nameRef = useRef();
  const siteRef = useRef();
  const videoTypeRef = useRef();
  const { movieId } = useParams();

  const fetchVideos = useCallback(() => {
    axios
      .get(`/movies/${movieId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        setVideos(response.data.videos);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error.response?.data || error.message);
      });
  }, [auth.accessToken, movieId]);

  const extractYouTubeVideoID = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([\w-]+))/i;
    const match = url.match(regex);
    if (match && match[1]) {
      setVideoKey(match[1]);
      return match[1];
    } else {
      setVideoKey('');
      return null;
    }
  };

  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current?.value.trim()) {
      fieldRef.current.style.border = '2px solid red';
      setTimeout(() => (fieldRef.current.style.border = '1px solid #ccc'), 2000);
      console.log(`${fieldName} cannot be empty.`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateAllFields()) return;

    const data = {
      userId: auth.user.id,
      movieId,
      url: `https://www.youtube.com/embed/${videoKey}`,
      videoKey,
      ...selectedVideo,
    };

    try {
      await axios.post('/admin/videos', data, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert('Video added successfully');
      clearFields();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error.response?.data || error.message);
      alert('Error saving video');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(`/videos/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error.response?.data || error.message);
    }
  };

  const validateAllFields = () => {
    const isURLValid = validateField(urlRef, 'YouTube Link');
    if (isURLValid && !extractYouTubeVideoID(urlRef.current.value)) {
      alert('Invalid YouTube link.');
      return false;
    }
    const isNameValid = validateField(nameRef, 'Name');
    const isSiteValid = validateField(siteRef, 'Site');
    const isVideoTypeValid = validateField(videoTypeRef, 'Video Type');
    return isURLValid && isNameValid && isSiteValid && isVideoTypeValid;
  };

  const handleClear = useCallback(() => {
    setSelectedVideo({});
    setVideoId(undefined);
    setVideoKey('');
    setVideoURL('');
    if (urlRef.current) urlRef.current.value = '';
  }, []);

  const handleUpdate = async (id) => {
    if (!validateAllFields()) return;

    const data = {
      ...selectedVideo,
      url: `https://www.youtube.com/embed/${videoKey || selectedVideo.videoKey}`,
    };

    try {
      await axios.patch(`/videos/${id}`, data, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      alert('Video updated successfully');
      handleClear();
      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error.response?.data || error.message);
    }
  };

  const handleEdit = (id) => {
    axios
      .get(`/videos/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        setSelectedVideo(response.data);
        setVideoId(response.data.id);
      })
      .catch((error) => {
        console.error('Error fetching video details:', error.response?.data || error.message);
      });
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div className="video-box">
      {/* Video List */}
      <div className="Video-View-Box">
        {videos.length > 0 ? (
          <div className="card-display-videos">
            {videos.map((video) => (
              <div key={video.id} className="card-video">
                <div className="buttons-group">
                  <button className="delete-button" onClick={() => handleDelete(video.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button className="edit-button" onClick={() => handleEdit(video.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
                <iframe
                  className="video-style"
                  src={`https://www.youtube.com/embed/${video.videoKey}`}
                  title={video.name}
                  allowFullScreen
                ></iframe>
                <p>{video.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <h3>No Videos Found</h3>
        )}
      </div>

      {/* Video Form */}
      <div className="Video-Search-Box">
        <div>
          <iframe
            title="Video Preview"
            className="video-frame"
            src={
              videoKey
                ? `https://www.youtube.com/embed/${videoKey}`
                : selectedVideo.url || 'https://www.youtube.com/embed/invalid'
            }
          ></iframe>
          <div className="input-group">
            <label>Video URL</label>
            <input
              type="url"
              ref={urlRef}
              value={videoURL}
              onChange={(e) => {
                setVideoURL(e.target.value);
                extractYouTubeVideoID(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              ref={nameRef}
              value={selectedVideo.name || ''}
              onChange={(e) => setSelectedVideo({ ...selectedVideo, name: e.target.value })}
            />
          </div>
          <button onClick={!videoId ? handleSave : () => handleUpdate(videoId)}>
            {!videoId ? 'Save' : 'Update'}
          </button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default VideoForm;
