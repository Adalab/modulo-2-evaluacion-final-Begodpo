"use strict";

const textInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const seriesListSection = document.querySelector(".js-results");
const favoritesListSection = document.querySelector(".js-favorites");

// Variables globales

let series = [];
let favoriteSeries = [];

// Buscar en el Api al hacer clik en el botón de buscar

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

// Pintar series

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

  // Añadir a favoritos

  const addToFavoritesList = document.querySelectorAll(".js-list");
  console.log(addToFavoritesList);

  for (const addToFavorites of addToFavoritesList) {
    addToFavorites.addEventListener("click", handleClickToFavorites);
  }
}

// Añadir a favoritos cuando se haga click

function handleClickToFavorites(event) {
  const selectedFavoriteSerie = parseInt(event.currentTarget.dataset.id);

  console.log(`Añadiendo a favoritos ${selectedFavoriteSerie}`);
  console.log(series);
  console.log(favoriteSeries);

  const selectedSerieData = series.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );
  const favoriteSerieData = favoriteSeries.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );
  console.log({ favoriteSerieData });

  if (favoriteSerieData === undefined) {
    // La serie seleccionada no está en la lista de favoritos
    // La añadimos con el push que teníamos debajo
    favoriteSeries.push(selectedSerieData); // Ahora si pincho en la misma serie, como la ha encontrado ya no la añade
  } else {
    // La serie seleccionada sí está en la lista de favoritos
    // La quitamos del listado
    favoriteSeries.splice(selectedSerieData);
  }

  paintFavoriteList();

  event.currentTarget.classList.toggle("changedColour");
}

// Pintar la lista de favoritos

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
    <div class="cross"><p class="cross__text">x</p></div>
    </li>    
    `;
}

searchBtn.addEventListener("click", handleClickBtn);
