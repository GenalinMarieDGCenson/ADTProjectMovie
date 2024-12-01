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
  const [videokey, setVideoKey] = useState({});
  const [selectedvideo, setSelectedVideo] = useState({});
  const urlRef = useRef();
  const nameRef = useRef();
  const siteRef = useRef();
  const videoTypeRef = useRef();
  const { movieId } = useParams();

  // Fetch all videos for the movie
  const getAll = useCallback(
    (movieId) => {
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
          console.error('Error fetching Videos:', error.response.data);
        });
    },
    [auth.accessToken]
  );

  // Extract YouTube video ID from a URL
  const getYouTubeVideoID = (url) => {
    if (!url || typeof url !== 'string') {
      console.error('Invalid URL:', url);
      setVideoKey('');
      return null;
    }

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

  // Validate form fields
  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current?.value.trim()) {
      fieldRef.current.style.border = '2px solid red';
      setTimeout(() => {
        fieldRef.current.style.border = '1px solid #ccc';
      }, 2000);
      console.error(`${fieldName} cannot be empty.`);
      return false;
    }
    return true;
  };

  // Import videos from external API
  const importDataVideo = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer <API_KEY>', // Replace with your API key
        },
      })
      .then((response) => {
        setSavePhotosImp(response.data.results);
        alert(`Imported ${response.data.results.length} videos successfully.`);
        setTimeout(() => getAll(movieId), 2000);
      })
      .catch((error) => console.error('Error importing videos:', error));
  };

  // Save imported videos to database
  const setSavePhotosImp = async (videoImportData) => {
    await Promise.all(
      videoImportData.map(async (data) => {
        const videoData = {
          userId: auth.user.userId,
          movieId,
          url: `https://www.youtube.com/embed/${data.key}`,
          videoKey: data.key,
          name: data.name,
          site: data.site,
          videoType: data.type,
          official: data.official,
        };
        try {
          await axios.post('/admin/videos', videoData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
        } catch (error) {
          console.error('Error importing video:', error);
        }
      })
    );
  };

  // Save new video
  const handleSave = async () => {
    const isUrlValid = validateField(urlRef, 'YouTube Link');
    const isNameValid = validateField(nameRef, 'Video Name');
    const isSiteValid = validateField(siteRef, 'Site');
    const isVideoTypeValid = validateField(videoTypeRef, 'Video Type');

    if (!isUrlValid || !isNameValid || !isSiteValid || !isVideoTypeValid) return;

    const videoData = {
      userId: auth.user.userId,
      movieId,
      url: `https://www.youtube.com/embed/${videokey}`,
      videoKey: videokey,
      name: selectedvideo.name,
      site: selectedvideo.site,
      videoType: selectedvideo.videoType,
      official: selectedvideo.official,
    };

    try {
      await axios.post('/admin/videos', videoData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Video added successfully.');
      getAll(movieId);
      handleClear();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  // Delete a video
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/videos/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        alert('Video deleted successfully.');
        getAll(movieId);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  // Clear form fields
  const handleClear = useCallback(() => {
    setSelectedVideo({});
    setVideoId(undefined);
    setVideoKey('');
    setVideoURL('');
    if (urlRef.current) urlRef.current.value = '';
  }, []);

  // Fetch video by ID for editing
  const fetchVideoById = async (id) => {
    try {
      const response = await axios.get(`/videos/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setSelectedVideo(response.data);
      setVideoId(response.data.id);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  // Update video details
  const handleUpdate = async (id) => {
    if (!window.confirm('Are you sure you want to update this video?')) return;

    const updatedData = {
      url: `https://www.youtube.com/embed/${videokey}`,
      videoKey: videokey,
      name: selectedvideo.name,
      site: selectedvideo.site,
      videoType: selectedvideo.videoType,
      official: selectedvideo.official,
    };

    try {
      await axios.patch(`/videos/${id}`, updatedData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Video updated successfully.');
      getAll(movieId);
      handleClear();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  // Fetch videos on component load
  useEffect(() => {
    getAll(movieId);
  }, [movieId, getAll]);

  return (
    <div className="video-box">
      {/* Video List */}
      {/* Video Form */}
      {/* ...UI code remains unchanged for brevity */}
    </div>
  );
}

export default VideoForm;
