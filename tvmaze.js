"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
// base url https://api.tvmaze.com/ DONE
const BASE_URL = 'https://api.tvmaze.com';
const SEARCH_ENDPOINT = '/search/shows';
// naming convention -DONE
const ALT_IMG = 'https://tinyurl.com/tv-missing';


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
  let shows = response.data.map(showAndScore => {//need more descriptive name like showAndScore

    let imageURL;
    // if there is no image url provided, we display a default image.
    if (!showAndScore.show.image) {//moved this from Display function
      imageURL = ALT_IMG;
    } else {
      imageURL = showAndScore.show.image.original;
    }

    return {
      id: showAndScore.show.id,
      name: showAndScore.show.name,
      summary: showAndScore.show.summary,
      image: imageURL
    };
  });
  return shows;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 *
 *
 * */

function displayShows(shows) {
  $showsList.empty();

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



//**************EPISODES */

/** function to retrieve episodes and display  */
async function getEpisodesAndDisplay(showId) {
  let episodes = await getEpisodesOfShow(showId);
  displayEpisodes(episodes);
}


/** event handler to retrive the show id  when clicking the Episodes Button */ //TODO move to bottom
$showsList.on("click", async function handleEpisodeList(evt) {
  // console.log(evt.target.parentElement.parentElement.parentElement.dataset.showId);
  let showId = evt.target.parentElement.parentElement.parentElement.dataset.showId;// check jquery closest()
  getEpisodesAndDisplay(showId);

});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {

  let response = await axios(`${BASE_URL}/shows/${id}/episodes`);


  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));


  return episodes;

}

/** Write a clear docstring for this function... */
/**
 *
 *
 *
 */



/** this function populates an unordered list of all episodes for the selected show */
/** the  episode area is enabled and displays the list of episodes */ //inputs , outputs, examples

function displayEpisodes(episodes) {
  $('#episodesList').empty();
  if (episodes.length !== 0) {
    $episodesArea.show();

    for (let episode of episodes) {
      let { name, season, number } = episode;
      if (!name) {
        name = '';
      }
      $('#episodesList')
        .append($('<li>')
        .text(`${name} season ${season}, number ${number}`));
    }
  }

}

// add other functions that will be useful / match our structure & design
