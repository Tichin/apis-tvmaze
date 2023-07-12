"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
// base url https://api.tvmaze.com/ DONE
const BASE_URL = 'https://api.tvmaze.com';
const SEARCH_ENDPOINT = '/search/shows';
// naming convention -DONE
const ALT_IMG= 'https://tinyurl.com/tv-missing';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  // get the response from API using axios
  // URL should not be green(a class)
  let response = await axios.get(`${BASE_URL}${SEARCH_ENDPOINT}`, { params: { q: term } });
// console.log('response.data ',response.data)
  let shows = response.data.map(show => {//need more descriptive name like showAndScore

    let imageURL;
    // if there is no image url provided, we display a default image.
    if (!show.show.image) {//moved this from Display function
      imageURL = ALT_IMG;
    } else {
      imageURL = show.show.image.original;
    }

    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: imageURL
    };
  });
  return shows;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();
  // put the logic in getShowsByTerm
  for (let show of shows) {

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  $("#searchForm-term").val('');
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});

$showsList.on("click", async function handleEpisodeList(evt) {
console.log(evt.target.parentElement.parentElement.parentElement.dataset)
});




//http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes.
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
