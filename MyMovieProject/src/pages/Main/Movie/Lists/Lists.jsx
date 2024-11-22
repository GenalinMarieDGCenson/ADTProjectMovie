import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Lists.css'; 

const Lists = () => {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);

    const getMovies = () => {
        // Get the movies from the API or database
        axios.get('/movies').then((response) => {
            setLists(response.data);
        });
    };

    useEffect(() => {
        getMovies();
    }, []);

    const handleDelete = (id) => {
        const isConfirm = window.confirm(
            'Are you sure that you want to delete this data?'
        );
        if (isConfirm) {
            axios
                .delete(`/movies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(() => {
                    // Update list by modifying the movie list array
                    const tempLists = [...lists];
                    const index = lists.findIndex((movie) => movie.id === id);
                    if (index !== undefined || index !== -1) {
                        tempLists.splice(index, 1);
                        setLists(tempLists);
                    }

                    // Alternatively, update list by requesting again from the API
                    // getMovies();
                });
        }
    };

    return (
        <div className="bg-custom text-light">
            <div className="d-flex justify-content-between">
                <h2>List of Movies</h2>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        navigate('/main/movies/form');
                    }}
                >
                    Create new
                </button>
            </div>
            <div className="table-responsive mt-3 rounded">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Popularity</th>
                            <th>Release Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lists.map((movie, index) => (
                            <tr key={movie.id}>
                                <td>{index + 1}</td>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.popularity}</td>
                                <td>{movie.releaseDate}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            navigate('/main/movies/form/' + movie.id);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() => handleDelete(movie.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Lists;
