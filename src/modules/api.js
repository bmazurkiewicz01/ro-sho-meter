const API_KEY = '0f1ee7a67a4947bc86e185950240605';

export default class API {
    constructor() {
        if (this instanceof API) {
            throw Error("A static class cannot be instantiated.");
        }
    }

    static async getWeather(city) {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather", error);
            return null;
        }
    }

    static async getAutoSuggestions(query) {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching auto suggestions", error);
            return null;
        }
    }

    static async getForecast(city) {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching forecast", error);
            return null;
        }
    }
}
