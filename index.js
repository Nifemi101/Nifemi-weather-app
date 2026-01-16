const initApp = function () {
  const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector(".search-btn");
  const notFound = document.querySelector(".not-found");
  const searchCity = document.querySelector(".search-city");
  const weatherInfo = document.querySelector(".weather-info");
  const countryName = document.querySelector(".country-name");
  const temprature = document.querySelector(".temperature");
  const weatherCondition = document.querySelector(".weather-condition");
  const humidityData = document.querySelector(".humidity-value-data");
  const windData = document.querySelector(".wind-value-data");
  const weatherImage = document.querySelector(".weather-img");
  const currentDate = document.querySelector(".current-date");
  const forcastItemContainer = document.querySelector(
    ".forcast-item-containers"
  );

  const apikey = "581c43b6f8409983ad90e5757b890265";

  //Added event listeners
  searchButton.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
      updateWeatherInfo(cityInput.value);
      cityInput.value = "";
      cityInput.blur();
    }
  });

  cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
      updateWeatherInfo(cityInput.value);
      cityInput.value = "";
      cityInput.blur();
    }
  });
  // Fetch Api data
  async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
  }

  function getWeatherIcon(id) {
    if (id <= 232) return "thunderstorm.svg";
    if (id <= 321) return "drizzle.svg";
    if (id <= 531) return "rain.svg";
    if (id <= 622) return "snow.svg";
    if (id <= 781) return "atmosphere.svg";
    if (id <= 800) return "clear.svg";
    else return "clouds.svg";
  }

  function getCurrentDate() {
    const currentDate = new Date();
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
    };
    return currentDate.toLocaleDateString("en-GB", options);
  }

  async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    if (weatherData.cod != 200) {
      showDisplySection(notFound);
      return;
    }

    const {
      name: county,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed },
    } = weatherData;

    countryName.textContent = county;
    temprature.textContent = temp.toFixed(1) + "°C";
    weatherCondition.textContent = main;
    humidityData.textContent = humidity + "%";
    windData.textContent = speed.toFixed(1) + " M/s";
    weatherImage.src = `assets/${getWeatherIcon(id)}`;
    currentDate.textContent = getCurrentDate();

    await updateForecastInfo(city);

    showDisplySection(weatherInfo);
  }

  async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];
    forcastItemContainer.innerHTML = "";
    forecastData.list.forEach((forecastWeather) => {
      if (
        forecastWeather.dt_txt.includes(timeTaken) &&
        !forecastWeather.dt_txt.includes(todayDate)
      )
        updateForecastItems(forecastWeather);
    });
  }

  function updateForecastItems(weatherData) {
    const {
      dt_txt: date,
      weather: [{ id }],
      main: { temp },
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOptions = { day: "2-digit", month: "short" };
    const datResult = dateTaken.toLocaleDateString("en-US", dateOptions);
    const forecastItem = `
    <div class="forcast-items">
            <h5 class="forcast-date regular-text">${datResult}</h5>
            <img src="assets/${getWeatherIcon(id)}" class="forcast-img" />
            <h5 class="forcast-temp">${temp.toFixed(1)}&#176;C</h5>
          </div>
    `;

    forcastItemContainer.insertAdjacentHTML("beforeend", forecastItem);
  }

  function showDisplySection(section) {
    [weatherInfo, searchCity, notFound].forEach(
      (section) => (section.style.display = "none")
    );

    section.style.display = "flex";
  }
};

initApp();
//Note to self: remove the console logs later
