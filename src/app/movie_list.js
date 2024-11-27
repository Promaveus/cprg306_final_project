"use client";
import Movie from "./movie";

export default function MovieList({ArrayOfMovies}){

  return (
    <>
    <ul className="flex flex-wrap"> 
      {ArrayOfMovies.map((movie) => {

        return (
          <li key={movie.id}>
            <Movie 
              id={movie.id} 
              poster_path={movie.poster_path} 
              title={movie.title} 
              release_date={movie.release_date} 
              vote_average={movie.vote_average} 
              overview={movie.overview} 
            />
          </li>
        );
      })}
    </ul>
    </>
  );
}