"use strict";

const textInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const resetBtn = document.querySelector(".js-resetBtn");
const seriesListSection = document.querySelector(".js-results");

// get data from Api

let series = [];

function handleClickBtn(event) {
  event.preventDefault();
  fetch(`https://api.jikan.moe/v3/search/anime?q=${textInput.value}`)
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
  htmlCode += `<li>
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
}

searchBtn.addEventListener("click", handleClickBtn);
