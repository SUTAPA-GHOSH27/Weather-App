import React, { useState} from "react";
import axios from "axios";
import "./App.css";
import { WiSunrise, WiSunset } from "react-icons/wi";

function App() {
  const [data, setData] = useState({});
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const API_KEY = "66099b5fa3cf9a1597aa494e5caa52f5";

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      if (!location.trim()) {
        setError("Please enter a location.");
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`;

      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setError("");
          fetchHourlyForecast(response.data.coord.lat, response.data.coord.lon);
        })
        .catch((error) => {
          setData({});
          setError("Location doesn't exist or network issue.");
          console.error("Error fetching the weather data:", error);
        });

      setLocation("");
    }
  };

  const fetchHourlyForecast = (lat, lon) => {
    console.log("Fetching forecast for lat:", lat, "lon:", lon);
  
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

  
    axios
      .get(forecastUrl)
      .then((response) => {
        console.log("Hourly Forecast API Response:", response.data);
        if (response.data.list) {
          setForecast(response.data.list.slice(0, 5)); 
        } else {
          setForecast([]); 
        }
      })
      .catch((error) => {
        console.error("Error fetching hourly forecast:", error);
        setForecast([]); 
      });
  };
  

  const convertToCelsius = (fahrenheit) => (((fahrenheit - 32) * 5) / 9).toFixed(2);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const weatherIconMapping = {
    "200": "11d",
    "201": "11d",
    "202": "11d",
    "210": "11d",
    "211": "11d",
    "212": "11d",
    "221": "11d",
    "230": "11d",
    "231": "11d",
    "232": "11d",
    "300": "09d",
    "301": "09d",
    "302": "09d",
    "310": "09d",
    "311": "09d",
    "312": "09d",
    "313": "09d",
    "314": "09d",
    "321": "09d",
    "500": "10d",
    "501": "10d",
    "502": "10d",
    "503": "10d",
    "504": "10d",
    "511": "13d",
    "520": "09d",
    "521": "09d",
    "522": "09d",
    "531": "09d",
    "600": "13d",
    "601": "13d",
    "602": "13d",
    "611": "13d",
    "612": "13d",
    "613": "13d",
    "615": "13d",
    "616": "13d",
    "620": "13d",
    "621": "13d",
    "622": "13d",
    "701": "50d",
    "711": "50d",
    "721": "50d",
    "731": "50d",
    "741": "50d",
    "751": "50d",
    "761": "50d",
    "762": "50d",
    "771": "50d",
    "781": "50d",
    "800": "01d",
    "801": "02d",
    "802": "03d",
    "803": "04d",
    "804": "04d"
  };

  const getWeatherIconUrl = (weatherCode) => {
    const icon = weatherIconMapping[weatherCode];
    if (icon) {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    return null

};

  return (
    <div className="App">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyUp={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{convertToCelsius(data.main.temp)}°C</h1> : null}
            {data.weather ? <img src={getWeatherIconUrl(data.weather[0].id)} alt="weather icon" id='mainicon' /> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.sys && (
          <div className="weather-details">
            <div className="sun-card">
              <div className="sunrise">
                <WiSunrise size={50} color="#FFA500" />
                <p>Sunrise: {formatTime(data.sys.sunrise)}</p>
              </div>
              <div className="sunset">
                <WiSunset size={50} color="#FF4500" />
                <p>Sunset: {formatTime(data.sys.sunset)}</p>
              </div>
            </div>

            <div className="forecast-card">
              <h3>Hourly Forecast</h3>
              {forecast.length > 0 ? (
                forecast.map((hour, index) => (
                  <div key={index} className="forecast-item">
                    <p>{formatTime(hour.dt)}</p>
                    <p>{convertToCelsius(hour.main.temp)}°C</p>
                    <img 
                      src={getWeatherIconUrl(hour.weather[0].id)}
                      alt="weather icon"
                      id="picon"
                    />
                    <p>{hour.weather[0].main}</p>
                  </div>
                ))
              ) : (
                <p>No forecast available</p>
              )}
            </div>

          </div>
        )}

        <div className="bottom">
          <div className="feels">
            {data.main ? <p className="bold">{convertToCelsius(data.main.feels_like)}°C</p> : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
            {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
            {data.wind ? <p className="bold">{data.wind.speed} MPH</p> : null}
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
