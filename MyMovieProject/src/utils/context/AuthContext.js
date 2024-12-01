import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  // Movie and List states
  const [movie, setMovie] = useState(null);
  const [lists, setLists] = useState([]);

  // Update authentication data and save to localStorage
  const setAuthData = (data) => {
    const { accessToken, user } = data;

    setAuth({ accessToken, user });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    if (user?.role === 'admin') {
      localStorage.setItem('tab', JSON.stringify('cast'));
    }
  };

  // Update selected movie
  const setMovieInfo = (movieInfo) => {
    if (movieInfo && movieInfo.id !== movie?.id) {
      setMovie(movieInfo);
    }
  };

  // Update movie list
  const setListDataMovie = (listData) => {
    setLists(listData);
  };

  // Clear authentication data and localStorage
  const clearAuthData = () => {
    setAuth({ accessToken: null, user: null });
    setMovie(null);
    setLists([]);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tab');
  };

  // Placeholder for fetching movie data if necessary
  useEffect(() => {
    if (!movie && auth.accessToken) {
      // Add logic to fetch movie data if needed
    }
  }, [auth, movie]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuthData,
        clearAuthData,
        movie,
        setMovieInfo,
        lists,
        setListDataMovie,
        setLists,
        setMovie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
