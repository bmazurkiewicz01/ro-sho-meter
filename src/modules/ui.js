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
        weatherContainer.innerHTML = `
            <div class="weather__location">
                <h1 class="weather__city">${data.city}</h1>
                <p class="weather__region">${data.country}</p>
            </div>
            <div class="weather__condition">
                <img class="weather__icon" src="${data.icon}" alt="${data.condition}">
                <p class="weather__text">${data.condition}</p>
            </div>
            <div class="weather__temperature">
                <p class="weather__temp">${data.temperature}°C</p>
                <p class="weather__feels-like">Feels like ${data.feelsLike}°C</p>
            </div>
            <div class="weather__details">
                <p class="weather__humidity">Humidity: ${data.humidity}%</p>
                <p class="weather__wind">Wind: ${data.wind} km/h ${data.windDirection}</p>
                <p class="weather__updated">Last updated: ${data.lastUpdated}</p>
            </div>
        `;
    }

    static renderForecast(data) {
        const forecastContainer = document.querySelector(".weather-container");
        data.forEach((day) => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast__card");
            forecastCard.innerHTML = `
                <p class="forecast__date">${day.date}</p>
                <div class="forecast__condition">
                    <img class="forecast__icon" src="${day.icon}" alt="${day.condition}">
                    <p class="forecast__
                    text">${day.condition}</p>
                </div>
                <div class="forecast__temperature">
                    <p class="forecast__
                    temp">${day.maxTemp}°C</p>
                    <p class="forecast__
                    temp">${day.minTemp}°C</p>
                </div>
                <div class="forecast__details">
                    <p class="forecast__
                    humidity">Humidity: ${day.humidity}%</p>
                    <p class="forecast__
                    wind">Wind: ${day.wind} km/h ${day.windDirection}</p>
                </div>
            `;
            forecastContainer.appendChild(forecastCard);
        });
    }
}
