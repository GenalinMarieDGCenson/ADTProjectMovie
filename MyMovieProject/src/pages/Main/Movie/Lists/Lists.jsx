import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../../../utils/context/AuthContext";
import axios from "axios";
import "./Lists.css";

const Lists = () => {
  const navigate = useNavigate();
  const { lists, setListDataMovie, auth } = useContext(AuthContext);

  // Fetch movies
  const getMovies = useCallback(() => {
    axios
      .get("/movies")
      .then((response) => setListDataMovie(response.data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, [setListDataMovie]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  // Delete movie
  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this movie along with its casts, photos, and videos?"
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then(() => {
          // Update the list locally
          const updatedLists = lists.filter((movie) => movie.id !== id);
          setListDataMovie(updatedLists);
        })
        .catch((err) => console.error("Error deleting movie:", err));
    }
  };

  return (
    <div className="bg-custom">
      <div className="top-context">
        <h2>List of Movies</h2>
        <button
          type="button"
          className="btn-top btn-primary"
          onClick={() => navigate("/main/movies/form")}
        >
          Create New
        </button>
      </div>
      <div className="table-responsive mt-3">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Title</th>
              <th>TMDB ID</th>
              <th>Popularity</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <strong>No movies found or created.</strong>
                </td>
              </tr>
            ) : (
              lists.map((movie, index) => (
                <tr key={movie.id}>
                  <td>{index + 1}</td>
                  <td>{movie.id}</td>
                  <td>{movie.title}</td>
                  <td>{movie.tmdbId}</td>
                  <td>{movie.popularity}</td>
                  <td>{movie.releaseDate}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        navigate(
                          `/main/movies/form/${movie.id}/cast-and-crews/${movie.tmdbId}`
                        )
                      }
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
