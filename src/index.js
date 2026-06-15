import './styles.css';
import { format, addDays } from 'date-fns';

async function data(city) {
  try {
    const date = format(new Date(), 'yyyy-MM-dd');
    const futureDates = format(addDays(new Date(), 7), 'yyyy-MM-dd');
    const unitGroup = document.querySelector('#toggle');
    const unitGroupValue = unitGroup.value;

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}/${futureDates}?unitGroup=${unitGroupValue}&key=9KLRB3T67YH7JUWCGZ7G2VLVB`,
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function clearForcast() {
  const forcastDivs = document.querySelectorAll('.forcast-days');
  forcastDivs.forEach((div) => {
    div.remove();
  });
}

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', () => {
  const cityName = document.querySelector('#city-input');
  const city = cityName.value;
  data(city)
    .then((promise) => {
      console.log(promise);
      displayTodayWeather(promise);
      clearForcast();
      displaySevenDaysForcast(promise);
      addImageTag(promise);
      cityName.setCustomValidity('');
      cityName.reportValidity();
    })
    .catch((err) => {
      console.log(err);
      cityName.setCustomValidity('Please check the city name');
      cityName.reportValidity();
    });
});

function displayTodayWeather(data) {
  const todayWeatherDiv = document.querySelector('#today-temp');
  const todayDescriptionDiv = document.querySelector('#today-description');
  const minMaxDiv = document.querySelector('#min-max');
  const feelsLikeDiv = document.querySelector('#feels-like');

  const cityUpperCase = data.resolvedAddress.toUpperCase();
  todayWeatherDiv.textContent = `${cityUpperCase}   ${data.days[0].temp}`;
  todayDescriptionDiv.textContent = data.days[0].description;
  minMaxDiv.textContent = `Min: ${data.days[0].tempmin} | Max: ${data.days[0].tempmax}`;
  feelsLikeDiv.textContent = `Feels like: ${data.days[0].feelslike}`;
}

function displaySevenDaysForcast(data) {
  for (let i = 1; i < 8; i++) {
    const forcastDiv = document.createElement('div');
    forcastDiv.classList.add('forcast-days');
    forcastDiv.classList.add('weather-divs');
    const tempDiv = document.createElement('p');
    tempDiv.textContent = `Min: ${data.days[i].tempmin} | Max: ${data.days[i].tempmax}`;
    const descriptionDiv = document.createElement('p');
    descriptionDiv.textContent = data.days[i].description;
    forcastDiv.appendChild(tempDiv);
    forcastDiv.appendChild(descriptionDiv);
    document.querySelector('#weather-result').appendChild(forcastDiv);
  }
}

const unitGroup = document.querySelector('#toggle');
unitGroup.addEventListener('change', () => {
  searchBtn.click();
});

//adding svg

function addImageTag(data) {
  const weatherDisplayDivs = document.querySelectorAll('.weather-divs');

  weatherDisplayDivs.forEach((div, index) => {
    const imgTag = document.createElement('img');
    imgTag.height = 64;
    imgTag.width = 64;

    getModule(data.days[index].icon).then((image) => {
      imgTag.src = image;
      div.appendChild(imgTag);
    });
  });
}

async function getModule(icon) {
  const module = await import(`./icons/fill/${icon}.svg`);
  return module.default;
}
