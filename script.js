const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

const requestOptions = {
    method:"GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`
    }
};

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = type;
}

function fillDropdown(shows) {
    showSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "Select a show";
    placeholder.value = "";
    showSelect.appendChild(placeholder);

    for (const show of shows) {
        const option = document.createElement("option");
        option.textContent = show.name;
        option.value = show.id;
        showSelect.appendChild(option);
    }
}

function displayDetails(show) {
  showDetails.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = show.name;
  showDetails.appendChild(heading);

  if (show.poster_path) {
    const poster = document.createElement("img");
    poster.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    poster.alt = `${show.name} poster`;
    showDetails.appendChild(poster);
  } else {
    const noPoster = document.createElement("p");
    noPoster.textContent = "No poster available";
    showDetails.appendChild(noPoster);
  }

  const overview = document.createElement("p");
  overview.textContent = show.overview;
  showDetails.appendChild(overview);

  const genres = document.createElement("p");

  let genreNames = [];

  for (const genre of show.genres) {
    genreNames.push(genre.name);
  }

  genres.textContent = `Genres: ${genreNames.join(", ")}`;
  showDetails.appendChild(genres);

  const seasons = document.createElement("p");
  seasons.textContent = `Seasons: ${show.number_of_seasons}`;
  showDetails.appendChild(seasons);

  const episodes = document.createElement("p");
  episodes.textContent = `Episodes: ${show.number_of_episodes}`;
  showDetails.appendChild(episodes);

  const status = document.createElement("p");
  status.textContent = `Status: ${show.status}`;
  showDetails.appendChild(status);
}

async function loadPopularShows() {
  const url = "https://api.themoviedb.org/3/tv/popular";

  try {
    showMessage("Loading popular shows...", "loading");

    const res = await fetch(url, requestOptions);

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("TMDB rejected the API token.");
        }

        throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    showMessage("");
    fillDropdown(data.results);
  } catch (error) {
    console.error(error);
    showMessage(error.message, "error");
  }
}

async function loadShowDetails(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}`;

  try {
    showMessage("Loading show details...", "loading");

    const res = await fetch(url, requestOptions);

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("TMDB rejected the API token.");
        }

        throw new Error(`Request failed with status ${res.status}`);
    }

    const show = await res.json();
    showMessage("");
    displayDetails(show);
  } catch (error) {
    console.error(error);
    showMessage(error.message, "error");
  }
}

showSelect.addEventListener("change", function () {
  const id = showSelect.value;

  if (id === "") {
    return;
  }

  loadShowDetails(id);
});

loadPopularShows();
