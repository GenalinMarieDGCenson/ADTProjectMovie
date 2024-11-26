import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Cast-Form.css';
import { useParams } from 'react-router-dom';

function CastForm() {
  const { auth } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [cast, setCast] = useState([]);
  const [castId, setCastId] = useState(undefined);
  const [selectedCast, setSelectedCast] = useState({});
  const searchRef = useRef();
  const nameRef = useRef();
  const characterNameRef = useRef();
  const urlRef = useRef();
  const { movieId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchCasts = useCallback(async () => {
    try {
      const response = await axios.get(`/movies/${movieId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setCast(response.data.casts);
    } catch (error) {
      console.error('Error fetching casts:', error.message);
    }
  }, [movieId, auth.accessToken]);

  useEffect(() => {
    fetchCasts();
  }, [fetchCasts]);

  
  const handleSearchPerson = useCallback(async () => {
    if (!query.trim()) {
      searchRef.current.style.border = '2px solid red';
      setTimeout(() => (searchRef.current.style.border = '1px solid #ccc'), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US`,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer YOUR_API_KEY', 
          },
        }
      );
      const results = response.data.results;
      if (results.length > 0) {
        setSelectedCast(results[0]);
      } else {
        alert('No results found!');
        setSelectedCast({});
      }
    } catch (error) {
      console.error('Search error:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  
  const handleSave = async () => {
    if (!characterNameRef.current.value.trim()) {
      characterNameRef.current.style.border = '2px solid red';
      setTimeout(() => (characterNameRef.current.style.border = '1px solid #ccc'), 2000);
      return;
    }

    const data = {
      userId: auth.user.userId,
      movieId,
      name: selectedCast.name,
      url: `https://image.tmdb.org/t/p/original/${selectedCast.profile_path}`,
      characterName: characterNameRef.current.value,
    };

    try {
      await axios.post('/admin/casts', data, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Added successfully!');
      setSelectedCast({});
      fetchCasts();
    } catch (error) {
      console.error('Save error:', error.message);
    }
  };

  
  const handleUpdate = async () => {
    if (!selectedCast?.id) {
      alert('No cast selected to update.');
      return;
    }

    const data = {
      id: selectedCast.id,
      userId: auth.user.userId,
      name: selectedCast.name,
      url: selectedCast.url,
      characterName: selectedCast.characterName,
    };

    try {
      await axios.patch(`/casts/${selectedCast.id}`, data, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Updated successfully!');
      setSelectedCast({});
      fetchCasts();
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cast?')) return;

    try {
      await axios.delete(`/admin/casts/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Deleted successfully!');
      fetchCasts();
    } catch (error) {
      console.error('Delete error:', error.message);
    }
  };

  
  const clearInputs = () => {
    setQuery('');
    setSelectedCast({});
    setCastId(undefined);
  };

  return (
    <div className="cast-box">
      {/* Cast List */}
      <div className="cast-list">
        {cast.length > 0 ? (
          <div className="cast-cards">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                <img src={actor.url} alt={actor.name} className="cast-image" />
                <div className="cast-info">
                  <h4>{actor.name}</h4>
                  <p>{actor.characterName}</p>
                </div>
                <div className="cast-actions">
                  <button onClick={() => handleDelete(actor.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button onClick={() => setSelectedCast(actor)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No cast found.</p>
        )}
      </div>

      {/* Cast Form */}
      <div className="cast-form">
        <input
          type="text"
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cast"
        />
        <button onClick={handleSearchPerson} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        {selectedCast && (
          <div className="selected-cast">
            <img
              src={
                selectedCast.profile_path
                  ? `https://image.tmdb.org/t/p/original/${selectedCast.profile_path}`
                  : 'placeholder.jpg'
              }
              alt={selectedCast.name}
            />
            <input
              type="text"
              ref={characterNameRef}
              placeholder="Character Name"
              value={selectedCast.characterName || ''}
              onChange={(e) => setSelectedCast({ ...selectedCast, characterName: e.target.value })}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={clearInputs}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CastForm;
