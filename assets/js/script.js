// Event listener for form submit
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get city name from input
  const city = document.querySelector("input[name='city']").value;

  // Fetch current weather conditions from API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=82da3406fbcff7c320c48f938d26ecd8&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      // Display current weather conditions
      document.querySelector("#city-name").innerHTML = data.name;
      document.querySelector("#date").innerHTML = ` (${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })}) `
      document.querySelector(
        "#icon"
      ).innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">`;
      document.querySelector("#temperature").innerHTML = `Temperature: ${data.main.temp} F`;
      document.querySelector(
        "#wind-speed"
      ).innerHTML = `Wind: ${data.wind.speed} MPH`;
      document.querySelector("#humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
      
      
      

      // Get city name from input
      const city = document.querySelector("input[name='city']").value;

      // Fetch latitude and longitude of the city
      fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=82da3406fbcff7c320c48f938d26ecd8`
      )
        .then((response) => response.json())
        .then((data) => {
          const lat = data[0].lat;
          const lon = data[0].lon;

          // Fetch 5-day forecast using coordinates
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=82da3406fbcff7c320c48f938d26ecd8&units=imperial`
          )
            .then((response) => response.json())
            .then((data) => {

            // Show the "5 Day Forecast" heading
            document.querySelector("#five-day-forecast").style.display="block"
            // Get the forecast cards
            const forecastCards = document.querySelectorAll(".forecast-card-container")

            // Adss the class "forecast-card" to each forecast card
            forecastCards.forEach((card) => {
              card.classList.add("forecast-card")
            })

              // Display 5-day forecast
              for (let i = 0; i < data.list.length; i += 8) {
                let day = i / 8 + 1;
                document.querySelector(`#day-${day}-date`).innerHTML = new Date(
                  data.list[i].dt * 1000
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                });
                document.querySelector(
                  `#day-${day}-icon`
                ).innerHTML = `<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`;
                document.querySelector(
                  `#day-${day}-temperature`
                ).innerHTML = `Temp: ${data.list[i].main.temp} F`;
                document.querySelector(
                  `#day-${day}-wind-speed`
                ).innerHTML = `Wind: ${data.list[i].wind.speed} MPH`;
                document.querySelector(
                  `#day-${day}-humidity`
                ).innerHTML = `Humidity: ${data.list[i].main.humidity}%`;
              }
            });
        });
    });

  // Add city to search history and store in local storage
  let searchHistory;
  if (localStorage.getItem("searchHistory")) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  } else {
    searchHistory = [];
  }
  if (!searchHistory.includes(city)) {
    // Add city to search history
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // Display search history
  const historyList = document.querySelector("#search-history");
  historyList.innerHTML = "";
  searchHistory.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = item;
    listItem.addEventListener("click", function () {
      // When a city in the search history is clicked, perform search again
      document.querySelector("input[name='city']").value = this.innerHTML;
      document.querySelector("form").dispatchEvent(new Event("submit"));
    });
    historyList.appendChild(listItem);
  });
});
