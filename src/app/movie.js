"use client";


export default function Movie({ poster_path, title, release_date, vote_average, overview,}) {

    return(
    <div className=" rounded-md m-2 w-80 h-96">
        <div className="flex ">
            <img className="rounded-xl mr-2" src={`https://image.tmdb.org/t/p/w185${poster_path}`}/>
            <div className="flex  justify-center flex-col">
                    <p className="font-bold text-white">{title}</p>
                    <p className="mt-3 mb-3 text-white">{release_date}</p>
                    <p className="text-white">Rating:{vote_average}</p>
            </div>
        </div>
        <p className="text-white">{overview.substring(0, 150)}{overview.length > 100 ? '...' : ''}</p>
    </div>
    );
}