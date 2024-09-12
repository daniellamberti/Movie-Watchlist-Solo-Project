            // Ensuring HTML content loads first

document.addEventListener('DOMContentLoaded', () => {

                // Main watchlist Array

let watchlistArray = [];

                    // DOM Elements

const searchBtn = document.getElementById("search-btn");
const movieTitle = document.getElementById("movie-title");
const containerP = document.getElementById("container-p");
const movieInput = document.getElementById("movie-title");
const movieIcon = document.getElementById("movie-icon");
const renderedMovies = document.getElementById("rendered-movies");
const resetSearchResults = document.getElementById("reset-search-results");

        // Calling function to render movies from LocalStorage

renderMoviesFromLS();

                    // Event Listeners

                // Event listener for search button

searchBtn.addEventListener("click", () => {
    if (movieInput.value.trim() === '') {
        movieInput.placeholder = 'Please enter a movie title.';
        return;
    } else {
        fetchData();
        movieTitle.value = "";
        movieIcon.style.visibility = "hidden";
        containerP.style.display = "none";
    }
});

            // Event listener for reset search button

resetSearchResults.addEventListener("click", function () {
    location.reload();
})

                // Clear placeholder on focus

movieTitle.addEventListener("focus", () => {
    movieTitle.placeholder = "";
});

                // Restore placeholder on blur

movieInput.addEventListener("blur", () => {
    movieInput.placeholder = "Search for movies...";
});

    // Event listener for adding movie to watchlist

// Event listener for adding a movie to the watchlist
renderedMovies.addEventListener("click", function (e) {
    // Ensure that the clicked element is the IMG that represents adding to the watchlist
    if (e.target.tagName === 'IMG' && e.target.nextElementSibling && e.target.nextElementSibling.textContent === 'Watchlist') {
        // Find the closest movie div
        const movieDiv = e.target.closest('.movie');
        
        if (!movieDiv) return; // Ensure a movie div exists

        // Get the imdbID from the dataset attribute
        const imdbID = movieDiv.dataset.id;

        // Check if the movie is already in the watchlist
        if (watchlistArray.includes(imdbID)) {
            alert('This movie is already in your watchlist.');
        } else {
            // Add the imdbID to the watchlist array
            watchlistArray.push(imdbID);
            console.log(watchlistArray);

            // Add movie to watchlist and store in localStorage
            localStorage.setItem("watchlist", JSON.stringify(watchlistArray));

            e.target.nextElementSibling.textContent = 'Movie added to watchlist';
            e.target.nextElementSibling.classList.toggle("remove-movie");
            e.target.src = ""; // Optionally remove the image after adding

            // Get the movie title for the alert
            const movieTitle = movieDiv.querySelector('h2').textContent;
            alert(`${movieTitle} has been added to your watchlist!`);
        }
    }
});

                            // FUNCTIONS:

                    // Main fetch data function

function fetchData() {
    fetch(`https://www.omdbapi.com/?apikey=48c5c3ad&s=${movieInput.value}`)
    .then(response => response.json())
    .then(data => {
        if (!data.Search) {
            movieInput.placeholder = 'Your search is not in our database. Please enter another movie title.';
            return;
        } else if (data.Search) {
            renderedMovies.innerHTML = ''; // Clear previous results
            // Loop through each movie to get detailed info
            data.Search.forEach(movie => {
                fetch(`https://www.omdbapi.com/?apikey=48c5c3ad&i=${movie.imdbID}`)
                .then(response => response.json())
                .then(details => {
                    renderedMovies.innerHTML += `
                    <div class="movie" data-id="${details.imdbID}">
                        <img src="${details.Poster}" class="rendered-img"/>
                        <div class="film-details">
                            <div class="title-ratings">
                                <h2>${details.Title}</h2>
                                <img src="/Img/star-icon.svg"><span>${details.imdbRating}</span>
                                </div>
                                <div class="runtime-genre-watchlist">
                                <h4>${details.Runtime}</h4>
                                <h4>${details.Genre}</h4>
                                <img src="/Img/add-icon.svg"><span class="watchlist-span">Watchlist</span>
                            </div>
                            <div class="plot-text">
                                <p>${details.Plot}</p>
                            </div>
                        </div>
                    </div>
                    `;
                })
                .catch(error => console.error('Error fetching details:', error));
            });
        } else {
            renderedMovies.innerHTML = ` 
                        <img  id="movie-icon" src="/Img/movie-icon.svg">
                        <p id="container-p">Start Exploring</p>
                        `;
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}

                // Rendering movies stored in Local Storage

function renderMoviesFromLS() {
    if (watchlistArray.length > 0) { // Check if the array is not empty
        renderedMovies.innerHTML = ''; // Clear previous results
        // Loop through each movie in the watchlistArray
        watchlistArray.forEach(movieID => {
            fetch(`https://www.omdbapi.com/?apikey=48c5c3ad&i=${movieID}`)
            .then(response => response.json())
            .then(details => {
                renderedMovies.innerHTML += `
                <div class="movie">
                    <img src="${details.Poster}" class="rendered-img"/>
                    <div class="film-details">
                        <div class="title-ratings">
                            <h2>${details.Title}</h2>
                            <img src="/Img/star-icon.svg"><span>${details.imdbRating}</span>
                            </div>
                            <div class="runtime-genre-watchlist">
                            <h4>${details.Runtime}</h4>
                            <h4>${details.Genre}</h4>
                            <img src="/Img/add-icon.svg"><span>Watchlist</span>
                        </div>
                        <div class="plot-text">
                            <p>${details.Plot}</p>
                        </div>
                    </div>
                </div>
                `;
            })
            .catch(error => console.error('Error fetching details:', error));
        });
    } else {
        renderedMovies.innerHTML = ` 
                        <img  id="movie-icon" src="/Img/movie-icon.svg">
                        <p id="container-p">Start Exploring</p>
                        `;
    }
}

});
