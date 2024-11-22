import { Outlet } from 'react-router-dom';

const Movie = () => {
  return (
    <>
      <h1>Movie</h1>
      <hr />
      <Outlet />
    </>
  );
};

export default Movie;