export default class Parser {
    constructor() {
        if (this instanceof Parser) {
            throw Error("A static class cannot be instantiated.");
        }
    }

    static parseWeatherData(data) {
        return {
            city: data.location.name,
            region: data.location.region,
            country: data.location.country,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            temperature: data.current.temp_c,
            feelsLike: data.current.feelslike_c,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            windDirection: data.current.wind_dir,
            lastUpdated: data.current.last_updated
        };
    }

    static parseForecastData(data) {
        return data.forecast.forecastday.map((day) => {
            return {
                date: day.date,
                condition: day.day.condition.text,
                icon: day.day.condition.icon,
                maxTemp: day.day.maxtemp_c,
                minTemp: day.day.mintemp_c,
                avgTemp: day.day.avgtemp_c,
                humidity: day.day.avghumidity,
                wind: day.day.maxwind_kph,
                windDirection: day.day.maxwind_dir
            };
        });
    }

    static parseAutoSuggestions(data) {
        if (!data || !data.length) {
            return [];
        }
        return data.map((suggestion) => suggestion.name);
    }
}