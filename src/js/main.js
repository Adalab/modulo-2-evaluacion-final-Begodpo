/* eslint-disable quotes */
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
      paintSeries();
    });
}
searchBtn.addEventListener("click", handleClickBtn);

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

  for (const addToFavorites of addToFavoritesList) {
    addToFavorites.addEventListener("click", handleClickToFavorites);
  }
}

// Añadir a favoritos cuando se haga click

function handleClickToFavorites(event) {
  const selectedFavoriteSerie = parseInt(event.currentTarget.dataset.id);

  const selectedSerieData = series.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );
  const favoriteSerieData = favoriteSeries.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );
  console.log({ favoriteSerieData });

  if (favoriteSerieData === undefined) {
    favoriteSeries.push(selectedSerieData);
    event.currentTarget.classList.add("changedColour");
  } else {
    favoriteSeries = favoriteSeries.filter(
      (row) => row.mal_id !== selectedFavoriteSerie
    );
    event.currentTarget.classList.remove("changedColour");
  }

  setFavoriteSerieInLocalStorage();

  paintFavoriteList();
}

// Pintar la lista de favoritos

function paintFavoriteList() {
  favoritesListSection.innerHTML = "";

  for (const favItem of favoriteSeries) {
    getFavItem(favItem);
  }
  const allRemoveBtns = document.querySelectorAll(".js-removeSerie");

  for (const removeBtn of allRemoveBtns) {
    // allRemoveBtns es un array, por eso tengo que hacer un bucle for
    removeBtn.addEventListener("click", handleClickRemoveBtn);
  }
  setFavoriteSerieInLocalStorage();
}

function getFavItem(favItem) {
  favoritesListSection.innerHTML += `
    <li class="favList js-list" data-id="${favItem.mal_id}">
    <img src="${favItem.image_url}" alt="${favItem.title}" />
    <h3 class="favSeriesTitle">${favItem.title}</h3>
    <div class="cross js-removeSerie" data-id="${favItem.mal_id}"><p class="cross__text">x</p></div>
    </li>    
    `;
}

// Quitar de favoritos al hacer click en el botoncito

function handleClickRemoveBtn(event) {
  const selectedFavoriteSerie = parseInt(event.currentTarget.dataset.id);

  const favoriteSerieData = favoriteSeries.find(
    (row) => row.mal_id === selectedFavoriteSerie
  );

  if (favoriteSerieData.mal_id === selectedFavoriteSerie) {
    favoriteSeries = favoriteSeries.filter(
      (row) => row.mal_id !== selectedFavoriteSerie
    );
  }
  setFavoriteSerieInLocalStorage();
  paintFavoriteList();
}

// LocalStorage en Favoritos

function setFavoriteSerieInLocalStorage() {
  localStorage.setItem("serie-fav", JSON.stringify(favoriteSeries));
}

function getSerieFromLocalStorage() {
  const savedSerieContent = localStorage.getItem("serie-fav");
  if (savedSerieContent === null) {
    favoriteSeries = [];
  } else {
    favoriteSeries = JSON.parse(savedSerieContent);
  }

  paintFavoriteList();
}

getSerieFromLocalStorage();
