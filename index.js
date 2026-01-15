const initApp = function () {
  const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector(".search-btn");
  const notFound = document.querySelector(".not-found");
  const searchCity = document.querySelector(".search-city");
  const weatherInfo = document.querySelector(".weather-info");

  const apikey = "581c43b6f8409983ad90e5757b890265";

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

  async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
  }

  async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    if (weatherData.cod != 200) {
      showDisplySection(notFound);
      return;
    }

    showDisplySection(weatherInfo);
    console.log(weatherData);
  }

  function showDisplySection(section) {
    [weatherInfo, searchCity, notFound].forEach(section => section.style.display = "none");

    //notFound.style.display = "flex";
    section.style.display = "flex";
};

}

initApp();
