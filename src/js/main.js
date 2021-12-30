"use strict";

const textInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const seriesListSection = document.querySelector(".js-results");
const favoritesListSection = document.querySelector(".js-favorites");

let series = [];
let favoriteSeries = [];

function handleClickBtn(event) {
  event.preventDefault();
  fetch(`https://api.jikan.moe/v3/search/anime?q=${textInput.value}&limit=8`)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      console.log(series);
      paintSeries();
    });
}

// paint series

function getSeriesHtml(serie) {
  let htmlCode = "";
  htmlCode += `<li class="resultsListElem js-list" data-id="${serie.mal_id}">
    <img src="${serie.image_url}" alt="${serie.title}" />
    <h3>${serie.title}</h3>
    </li>`;

  return htmlCode;
}

function paintSeries() {
  let seriesCode = "";

  for (const serie of series) {
    seriesCode += getSeriesHtml(serie);

    if (serie.image_url === null) {
      seriesListSection.innerHTML += `<li>
      <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=${serie.type}" alt="${serie.title}" />
      <h3>${serie.title}</h3>
      </li>`;
    } else {
      seriesListSection.innerHTML = seriesCode;
    }
  }

  const addToFavoritesList = document.querySelectorAll(".js-list");
  console.log(addToFavoritesList);

  for (const addToFavorites of addToFavoritesList) {
    addToFavorites.addEventListener("click", handleClickToFavorites);
  }
}

function handleClickToFavorites(event) {
  /* 
  console.dir(event.currentTarget);
  console.dir(event.currentTarget.dataset.id);
*/
  const selectedFavoriteSerie = parseInt(event.currentTarget.dataset.id);

  console.log(`Añadiendo a favoritos ${selectedFavoriteSerie}`);

  console.table(series);

  const selectedSerieData = series.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );
  console.log(selectedSerieData);

  favoriteSeries.push(selectedSerieData);

  paintFavoriteList();
}

function paintFavoriteList() {
  favoritesListSection.innerHTML = "";

  for (const favItem of favoriteSeries) {
    getFavItem(favItem);
  }
}

function getFavItem(favItem) {
  favoritesListSection.innerHTML += `
    <li class="favList js-list" data-id="${favItem.mal_id}">
    <img src="${favItem.image_url}" alt="${favItem.title}" />
    <h3 class="favSeriesTitle">${favItem.title}</h3>
    </li>
    `;
}

searchBtn.addEventListener("click", handleClickBtn);
