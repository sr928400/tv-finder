const showSelect = document.getElementById("show-select");

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

async function loadPopularShows() {
  const url = "https://api.themoviedb.org/3/tv/popular";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    fillDropdown(data.results);
  } catch (error) {
    console.error(error);
  }
}

loadPopularShows();
