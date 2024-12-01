import axios from 'axios';
import { useCallback, useEffect, useState, useContext, useRef } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../utils/context/AuthContext';
import './Form.css';

const Form = () => {
    const [query, setQuery] = useState('');
    const [searchedMovieList, setSearchedMovieList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(undefined);
    const [notFound, setNotFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageBtn, setPageBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Error state
    const [tab, setTab] = useState(JSON.parse(localStorage.getItem('tab')) || 'cast');
    const navigate = useNavigate();
    const { movieId, id } = useParams();
    const { auth, setMovieInfo } = useContext(AuthContext);
    const selectorRef = useRef();

    // Function to update the selected tab and save it to local storage
    const updateTabStyle = (newTab) => {
        setTab(newTab);
        localStorage.setItem('tab', JSON.stringify(newTab));
    };

    useEffect(() => {
        const castTab = document.querySelector('.cast-tab');
        const videoTab = document.querySelector('.video-tab');
        const photoTab = document.querySelector('.photo-tab');

        [castTab, videoTab, photoTab].forEach((tab) => {
            if (tab) tab.style.backgroundColor = '';
        });

        const currentTab = document.querySelector(`.${tab}-tab`);
        if (currentTab) currentTab.style.backgroundColor = 'gray';
    }, [tab]);

    // Debounced movie search
    const handleSearch = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer <YOUR_TMDB_API_KEY>`, // Replace with your API Key
                    },
                }
            );

            if (response.data.results.length === 0) {
                setNotFound(true);
                setSearchedMovieList([]);
                setTotalPages(0);
                setPageBtn(false);
            } else {
                setSearchedMovieList(response.data.results);
                setTotalPages(response.data.total_pages);
                setNotFound(false);
                setPageBtn(true);
            }
        } catch (err) {
            setError('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const handleSave = async () => {
        if (!selectedMovie) {
            alert('Please search and select a movie.');
            return;
        }

        try {
            const data = {
                tmdbId: selectedMovie.id,
                title: selectedMovie.title,
                overview: selectedMovie.overview,
                popularity: selectedMovie.popularity,
                releaseDate: selectedMovie.release_date,
                voteAverage: selectedMovie.vote_average,
                backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
                posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
                isFeatured: selectedMovie.isFeatured,
            };

            if (movieId) {
                await axios.patch(`/movies/${movieId}`, data, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                });
                alert('Movie updated successfully.');
            } else {
                if (!selectorRef.current.value.trim()) {
                    selectorRef.current.style.border = '2px solid red';
                    setTimeout(() => (selectorRef.current.style.border = '1px solid #ccc'), 2000);
                    return;
                }

                await axios.post('/movies', data, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                });
                alert('Movie saved successfully.');
            }

            navigate('/main/movies');
        } catch (err) {
            setError('Error saving movie. Please try again later.');
        }
    };

    // Fetch movie details if editing an existing movie
    useEffect(() => {
        if (movieId) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`/movies/${movieId}`);
                    setMovieInfo(response.data);
                    setSelectedMovie({
                        id: response.data.tmdbId,
                        title: response.data.title,
                        overview: response.data.overview,
                        popularity: response.data.popularity,
                        backdrop_path: response.data.backdropPath,
                        poster_path: response.data.posterPath,
                        release_date: response.data.releaseDate,
                        vote_average: response.data.voteAverage,
                        isFeatured: response.data.isFeatured,
                    });
                } catch (err) {
                    setError('Error fetching movie details. Please try again later.');
                }
            };

            fetchMovie();
        }
    }, [movieId, setMovieInfo]);

    return (
        <div className="form-box">
            <div className="title-text">{movieId ? 'Edit' : 'Add'} Movie</div>

            {error && <p className="text-center text-danger">{error}</p>}

            {!movieId && (
                <>
                    <div className="search-container">
                        <label>Search Movie:</label>
                        <div className="search-with-btn">
                            <input
                                type="text"
                                className="search-bar"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setNotFound(false);
                                    setSearchedMovieList([]);
                                    setSelectedMovie(undefined);
                                    setCurrentPage(1);
                                    setPageBtn(false);
                                }}
                                placeholder="Enter Movie Title"
                            />
                            <button className="btn-search btn-primary" onClick={() => handleSearch(1)}>
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="searched-movie">
                        {notFound ? (
                            <p className="text-warning">Movie not found</p>
                        ) : isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            searchedMovieList.map((movie) => (
                                <p
                                    key={movie.id}
                                    className="list-movie"
                                    onClick={() => setSelectedMovie(movie)}
                                >
                                    {movie.original_title}
                                </p>
                            ))
                        )}
                    </div>
                </>
            )}

            <div className="movie-box">
                {/* Movie Poster */}
                <img
                    src={
                        selectedMovie?.poster_path
                            ? `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`
                            : require('./../../../../utils/images/cinematography-symbols-black-background.jpg')
                    }
                    alt={selectedMovie?.title || 'Fallback Cinematography Symbol'}
                />
            </div>

            {/* Tabs */}
            {movieId && (
                <nav>
                    <ul className="tabs">
                        {['cast', 'video', 'photo'].map((tabType) => (
                            <li
                                key={tabType}
                                className={`${tabType}-tab`}
                                onClick={() => {
                                    updateTabStyle(tabType);
                                    navigate(`/main/movies/form/${id}/${tabType}/${movieId}`);
                                }}
                            >
                                {tabType.charAt(0).toUpperCase() + tabType.slice(1)}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <Outlet />
        </div>
    );
};

export default Form;
