import "./style.css";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import UI from "./modules/ui";
import Parser from "./modules/parser";
import API from "./modules/api";

library.add(fas, far, fab);
dom.watch();

UI.initUI();

(async () => {
    const weatherData = await API.getWeather("London");
    const forecastData = await API.getForecast("London");

    if (weatherData) {
        const parsedData = Parser.parseWeatherData(weatherData);
        UI.renderWeather(parsedData);
    } else {
        console.log("Failed to fetch weather data.");
    }

    if (forecastData) {
        const parsedForecast = Parser.parseForecastData(forecastData);
        UI.renderForecast(parsedForecast);
    } else {
        console.log("Failed to fetch forecast data.");
    }
})();
