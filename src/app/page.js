"use client";
import { useState, useEffect } from "react";
import MovieList from "./movie_list";

export default function Page() {
  const [ArrayOfMovies, setMovieArray] = useState([]);
  const [name, setName] = useState("");
  const [searchbar, setSearchBar] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // List of genres
  const genreList = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
  ];

  // Fetch and load categories
  useEffect(() => {
    LoadCategories();
  }, []);

  // Fetch and update movies based on search input
  useEffect(() => {
    if (name) {
      UpdateMovieArray();
    } else {
      setMovieArray([]); // Empty array if no search
    }
  }, [name]);

  // Load movies by genre
  async function LoadCategories() {
    setLoading(true);
    const categoryMovies = await Promise.all(
      genreList.map(async (genre) => {
        const movies = await fetchCategoryArray(genre.id);
        return { genre: genre.name, movies, currentIndex: 0 };
      })
    );
    setCategories(categoryMovies);
    setLoading(false);
  }

  // Update movies based on search
  async function UpdateMovieArray() {
    setLoading(true);
    const NewMovieArray = await fetchMovieArray(name);
    setMovieArray(NewMovieArray);
    setLoading(false);
  }

  // Fetch movies by genre ID
  async function fetchCategoryArray(genreId) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&api_key=208da7c33ace1751ef168f02022029e4`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  // Fetch movies by search term
  async function fetchMovieArray(moviename) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${moviename}&api_key=208da7c33ace1751ef168f02022029e4`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  // Search form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    //Clears the array or sets it with movies that match search string
    if (searchbar.trim() === "") {
      setMovieArray([]); 
      setName(""); 
    } else {
      setName(searchbar); // Set search term
    }
  };

  // Update search term as user types
  const handleNameChange = (event) => {
    setSearchBar(event.target.value); 
  };

  // Scroll navigation to display movies in batches of 4
  const handleNext = (index) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, catIndex) =>
        catIndex === index
          ? {
              ...category,
              currentIndex:
                category.currentIndex + 1 >= Math.ceil(category.movies.length / 4)
                  ? category.currentIndex
                  : category.currentIndex + 1,
            }
          : category
      )
    );
  };

  const handlePrev = (index) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, catIndex) =>
        catIndex === index && category.currentIndex > 0
          ? { ...category, currentIndex: category.currentIndex - 1 }
          : category
      )
    );
  };

  return (
    <main className="flex flex-col h-auto bg-black text-white" 
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-photo/movie-background-collage_23-2149876005.jpg?semt=ais_hybrid")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} >
      <div className="flex bg-zinc-900 h-16 items-center">
        <div className="bg-black ml-32 rounded-md">
          <p className="pl-4 pr-4 pt-1 pb-1 text-2xl font-cambridge text-cyan-500">
            Mav's Movies
          </p>
        </div>
        
        {/* Form that displays search bar  */}
        <form className="flex flex-grow" onSubmit={handleSubmit}>
          <input
            className="border-2 text-black rounded-md bg-white h-10 m-6 flex-grow"
            type="text"
            name="searchbar"
            placeholder="Search Movie Title"
            value={searchbar}
            onChange={handleNameChange}
          />
          <button className="mr-10" type="submit"></button>
        </form>
      </div>

      <div className="flex flex-col">
        {/* Show search results if available */}
        {name ? (
          <div className="m-6">
            <h2 className="text-2xl mb-4 ml-4">Search Results</h2>
            {loading ? (
              <p className="text-white text-center">Loading...</p>
            ) : (
              <div className="flex overflow-x-auto space-x-4 p-4">
                <MovieList ArrayOfMovies={ArrayOfMovies} />
              </div>
            )}
          </div>
        ) : (
          // Show genre-based movie scrollers if no search term
          <div className="m-6">
            {loading ? (
              <p className="text-white text-center">Loading genres...</p>
            ) : (
              categories.map((category, index) => (
                <div key={index} className="m-6 p-4 bg-black rounded-lg text-cyan-400">
                  <h2 className="text-4xl mb-4 ml-4 text-center font-bold">{category.genre}</h2>
                  <div className="flex overflow-x-auto space-x-4 p-4 justify-center">
                    {/* Display only 4 movies per genre based on currentIndex */}
                    {category.movies
                      .slice(category.currentIndex * 4, (category.currentIndex + 1) * 4)
                      .map((movie, movieIndex) => (
                        <div key={movieIndex} className="w-60 relative group">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-auto rounded-md"
                          />
                          {/* Movie Description on Hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-75 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center p-2 text-sm">
                            <p>{movie.overview}</p>
                          </div>
                          <p className="text-center text-sm mt-2">{movie.title}</p>
                        </div>
                      ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handlePrev(index)}
                      disabled={category.currentIndex === 0}
                      className="bg-cyan-500 text-white px-4 py-2 rounded"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => handleNext(index)}
                      disabled={category.currentIndex + 1 >= Math.ceil(category.movies.length / 4)}
                      className="bg-cyan-500 text-white px-4 py-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
