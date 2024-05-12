import API from "./api";
import Parser from "./parser";

export default class UI {
    constructor() {
        if (this instanceof UI) {
            throw Error("A static class cannot be instantiated.");
        }
    }

    static #renderAutoSuggestions(suggestions) {
        const suggestionsDatalist = document.getElementById("locations");
        suggestionsDatalist.innerHTML = "";
        suggestions.forEach((suggestion) => {
            const option = document.createElement("option");
            option.value = suggestion;
            suggestionsDatalist.appendChild(option);
        });
    }

    static #initButtonEvents() {
        const searchButton = document.getElementById("submit-location-btn");
        searchButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const city = document.getElementById("location-input").value;
            const weatherData = await API.getWeather(city);
            if (weatherData) {
                const parsedData = Parser.parseWeatherData(weatherData);
                UI.renderWeather(parsedData);
            } else {
                console.log("Failed to fetch weather data.");
            }

            const forecastData = await API.getForecast(city);
            if (forecastData) {
                const parsedForecast = Parser.parseForecastData(forecastData);
                UI.renderForecast(parsedForecast);
            } else {
                console.log("Failed to fetch forecast data.");
            }
        });

        const locationInput = document.getElementById("location-input");
        locationInput.addEventListener("input", async () => {
            const query = locationInput.value;
            if (!query) {
                return;
            }
            const autoSuggestions = await API.getAutoSuggestions(query);
            if (autoSuggestions) {
                const suggestions = Parser.parseAutoSuggestions(autoSuggestions);
                UI.#renderAutoSuggestions(suggestions);
            } else {
                console.log("Failed to fetch auto suggestions.");
            }
        });
    }

    static initUI() {
        UI.#initButtonEvents();
    }

    static renderWeather(data) {
        const weatherContainer = document.querySelector(".weather-container");
        const mainWeatherCard = document.createElement("div");

        mainWeatherCard.classList.add("main__weather__card");
        mainWeatherCard.innerHTML = `
            <div class="weather__location">
                <h1 class="weather__city"><i class="fa-solid fa-location-dot"></i> ${data.city}, ${data.country}</h1>
            </div>
            <div class="weather__condition">
                <div class="weather__temperature">
                    <img class="weather__icon" src="${data.icon}" alt="${data.condition}">
                    <p class="weather__temp">${data.temperature}°C</p>
                </div>
                <p class="weather__text">${data.condition}</p>
            </div>
            <div class="weather__feelslike">
                <p><i class="fa-solid fa-temperature-three-quarters"></i> Feels like ${data.feelsLike}°C</p>
            </div>
            <div class="weather__details">
                <p class="weather__humidity"><i class="fa-solid fa-water"></i> Humidity: ${data.humidity}%</p>
                <p class="weather__wind"><i class="fa-solid fa-wind"></i> Wind: ${data.wind} km/h</p>
                <p class="weather__updated"><i class="fa-solid fa-pen-clip"></i> Last updated: ${data.lastUpdated}</p>
            </div>
        `;

        weatherContainer.innerHTML = "";
        weatherContainer.appendChild(mainWeatherCard);
    }

    static renderForecast(data) {
        const weatherContainer = document.querySelector(".weather-container");

        const forecastTitle = document.createElement("h2");
        forecastTitle.classList.add("forecast__title");
        forecastTitle.innerHTML = `<i class="fa-solid fa-calendar"></i> 7-Day Forecast`;
        weatherContainer.appendChild(forecastTitle);

        const forecastContainer = document.createElement("div");
        forecastContainer.classList.add("forecast__container");
        weatherContainer.appendChild(forecastContainer);

        data.forEach((day) => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast__card");
            forecastCard.innerHTML = `
                <p class="forecast__date">${day.date}</p>
                <div class="forecast__condition">
                    <img class="forecast__icon" src="${day.icon}" alt="${day.condition}">
                    <p class="forecast__text">${day.condition}</p>
                </div>
                <div class="forecast__temperature">
                    <p class="forecast__temp"><i class="fa-solid fa-temperature-full"></i> Max: ${day.maxTemp}°C</p>
                    <p class="forecast__temp"><i class="fa-solid fa-temperature-empty"></i> Min: ${day.minTemp}°C</p>
                </div>
                <div class="forecast__details">
                    <p class="forecast__humidity"><i class="fa-solid fa-water"></i> Humidity: ${day.humidity}%</p>
                    <p class="forecast__wind"><i class="fa-solid fa-wind"></i> Wind: ${day.wind} km/h</p>
                </div>
            `;
            forecastContainer.appendChild(forecastCard);
        });
    }
}
