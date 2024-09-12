            // Ensuring watchlistArray loads properly

document.addEventListener('DOMContentLoaded', () => {
    const savedWatchlist = localStorage.getItem("watchlist");
    watchlistArray = savedWatchlist ? JSON.parse(savedWatchlist) : [];
    fetchSelectedMovies(); // Fetch and display movies
});

                         // DOM Elements

const mainContainerWatchlist = document.getElementById("main-container-watchlist");
const myWatchlist = document.getElementById("my-watchlist");
const backToSearch = document.getElementById("back-to-search");
const addIcon = document.getElementById("add-icon");
const resetWatchlist = document.getElementById("reset-watchlist");

                    // Reset watchlist event listener

resetWatchlist.addEventListener("click", function () {
    console.log("Clicked");
    localStorage.clear();
    location.reload();
})

            // Retrieving watchlistArray from Local Storage

    let watchlistArray = JSON.parse(localStorage.getItem("watchlist")) || [];
    console.log(watchlistArray);

    fetchSelectedMovies();

    // Function for retrieve and render selected movies from Local Storage

    function fetchSelectedMovies() {
        console.log(watchlistArray);
        if (watchlistArray.length > 0) {
            mainContainerWatchlist.innerHTML = ''; // Clear previous results
            let renderedSelectedMovies = ''; // To store the HTML content

            // Track the number of completed fetch requests
            let completedFetches = 0;

            // Loop through each movie to get detailed info
            watchlistArray.forEach(movieID => {
                fetch(`https://www.omdbapi.com/?apikey=48c5c3ad&i=${movieID}`)
                .then(response => response.json())
                .then(details => {
                    renderedSelectedMovies += `
                    <div class="movieWatchlist" data-id="${details.imdbID}">
                        <img src="${details.Poster}" class="rendered-img"/>
                        <div class="film-details">
                            <div class="title-ratings">
                                <h2>${details.Title}</h2>
                                <img src="/Img/star-icon.svg"><span>${details.imdbRating}</span>
                            </div>
                            <div class="runtime-genre-watchlist">
                                <h4>${details.Runtime}</h4>
                                <h4>${details.Genre}</h4>
                                <img src="/Img/remove-icon.svg" class="remove-btn"><span>Remove</span>
                            </div>
                            <div class="plot-text">
                                <p>${details.Plot}</p>
                            </div>
                        </div>
                    </div>
                    `;

                    // Increment completed fetches counter
                    completedFetches++;

                    // Once all fetches are complete, update the main container
                    if (completedFetches === watchlistArray.length) {
                        mainContainerWatchlist.innerHTML = renderedSelectedMovies;
                    }
                })
                .catch(error => console.error('Error fetching details:', error));
            });
        } else {
            mainContainerWatchlist.innerHTML =`
                    <p>No movies in your watch list ...</p>
                    <div id="back-to-search">
                        <img src="/Img/add-icon.svg" id="add-icon">
                        <a href="/index.html">Let's add some movies</a>
                    </div>
            `;
        }
    }

            // Event delegation to handle remove button clicks

    mainContainerWatchlist.addEventListener("click", function (e) {
        if (e.target.tagName === 'IMG' && e.target.nextElementSibling.textContent === 'Remove') {
            const movieDiv = e.target.closest('.movieWatchlist');
            if (movieDiv) {
                const movieID = movieDiv.dataset.id; // Get the movie ID from the data attribute

                // Remove the movie ID from the array
                watchlistArray = watchlistArray.filter(id => id !== movieID);

                // Update localStorage
                localStorage.setItem("watchlist", JSON.stringify(watchlistArray));

                // Re-render the watchlist
                fetchSelectedMovies();
            }
        }
    });






















 