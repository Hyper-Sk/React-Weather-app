import React, { use, useEffect, useState } from "react";
import "./App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const API_KEY = process.env.API_KEY;

import bgDark from "./assets/dark-sky.jpg";
import blueSky from './assets/blue-sky.jpg'
import greenSky from './assets/green-sky.jpg'

// weather icons
import sun from "./assets/weather-icons/sun.png";
import fog from "./assets/weather-icons/fog.png";
import air from "./assets/weather-icons/air.png";
import cloud from "./assets/weather-icons/cloud.png";
import rain from "./assets/weather-icons/rain.png";
import snow from "./assets/weather-icons/snow.png";

import cloudSun from "./assets/weather-icons/cloud-sun.png";
import cloudAir from "./assets/weather-icons/cloud-air.png";
import sunAir from "./assets/weather-icons/sun-air.png";
import sunCloudAir from "./assets/weather-icons/sun-cloud-air.png";
import sunCloudWaterAir from "./assets/weather-icons/sun-cloud-water-air.png";
import lightRain from "./assets/weather-icons/light-rain.png";
import sunHeavyRain from "./assets/weather-icons/sun-heavy-rain.png";
import sunLightRain from "./assets/weather-icons/sun-light-rain.png";
import thunderRain from "./assets/weather-icons/thunder-rain.png";
import snowHeavy from "./assets/weather-icons/snow-heavy.png";
import sunShower from "./assets/weather-icons/sun-shower.png";
import shower from "./assets/weather-icons/shower.png";
import rainbow from "./assets/weather-icons/rainbow.png";
import celcius from "./assets/weather-icons/celcius.png";

const App = () => {
  const [city, setCity] = useState("Hyderabad");
  const [input, setInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState({});
  const [date, setDate] = useState("");
  const [condition, setCondition] = useState({});
  const [foreCast,setForeCast] = useState({})
  const [todayForeCast, setTodayForeCast] = useState([]);
  const [weatherText, setWeatherText] = useState("");
  const [weatherImage, setWeatherImage] = useState("");
  const [astro, setAstro] = useState({})
  const [isCelcius, setIsCelcius] = useState(true)
  const [isLoading,setIsLoading ] = useState(false)

  // console.log(astro);
  const getCurrentLocation = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;

    try {
      const res = await fetch(URL);
      const data = await res.json();
      if (res) {
        setWeather(data.current);
        setLocation(data.location);
        setCondition(data.current.condition);
        let dateStr = data.current.last_updated.slice(0, 10);
        dateStr = formatDate(dateStr);
        setDate(dateStr);
        setWeatherText(data.current.condition.text);
        getForeCast(data.location.name);
      }
    } catch (error) {
      // window.location.reload();
    }
  };

  const getWeatherFromMyLoc = async () => {
    navigator.geolocation.getCurrentPosition(getCurrentLocation, () =>
      getWeather(city)
    );
  };

  const getForeCast = async (inputCity) => {
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${inputCity}`;
    // console.log(inputCity)
    try {
      const res = await fetch(URL);
      const data = await res.json();
      if (res) {
        // console.log(data)
        let dateStr = data.current.last_updated.slice(0, 10);
        dateStr = formatDate(dateStr);
        setWeather(data.current)
        setLocation(data.location)
        setDate(dateStr)
        setCondition(data.current.condition)
        setWeatherText(data.current.condition.text);
        setTodayForeCast(data.forecast.forecastday[0].hour);
        setAstro(data.forecast.forecastday[0].astro)
        setForeCast(data)
      }
    } catch (error) {
      window.location.reload();
    }
  };

  const convertTo12Hour = (time24) => {
    // Expects input in "HH:MM" format
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return "Invalid time";
    }
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minuteStr.padStart(2, "0")} ${period}`;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const fullDate = `${day} ${month} ${year}`;
    return fullDate;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(input);
    setShowSearch(false);
    setInput("");
  };

  const getWeatherImage = () => {
    let image;
    let text = weatherText.trim().toLowerCase();
    if (text === "sunny") {
      setWeatherImage(sun);
    } else if (text === "partly cloudy") {
      setWeatherImage(cloudSun);
    } else if (text === "overcast") {
      setWeatherImage(sunCloudAir);
    } else if (text === "moderate rain at times") {
      setWeatherImage(lightRain);
    } else if (text === "moderate or heavy rain with thunder") {
      setWeatherImage(thunderRain);
    } else if (text === "patchy rain and thunder") {
      setWeatherImage(thunderRain);
    } else if (text === "heavy rain at times") {
      setWeatherImage(thunderRain);
    } else if (text === "rain") {
      setWeatherImage(rain);
    } else if (text === "heavy rain") {
      setWeatherImage(thunderRain);
    } else if (text === "patchy rain nearby") {
      setWeatherImage(sunLightRain);
    } else if (text === "cloudy") {
      setWeatherImage(cloud);
    } else if (text === "mist") {
      setWeatherImage(cloudAir);
    } else if (text === "light drizzle") {
      setWeatherImage(cloudAir);
    } else if (text === "light rain") {
      setWeatherImage(lightRain);
    } else if (text === "shower") {
      setWeatherImage(shower);
    } else if (text === "light rain shower") {
      setWeatherImage(sunShower);
    } else if (text === "moderate rain") {
      setWeatherImage(lightRain);
    } else if (text === "clear") {
      setWeatherImage(sunAir);
    } else if (text === "fog") {
      setWeatherImage(fog);
    } else if (text === "snow") {
      setWeatherImage(snow);
    } else if (text === "moderate snow") {
      setWeatherImage(snow);
    } else if (text === "light snow") {
      setWeatherImage(snow);
    } else if (text === "light sleet") {
      setWeatherImage(snowHeavy);
    } else {
      setWeatherImage(cloudSun);
    }
  };

  useEffect(() => {
    getForeCast(city)
  }, [city]);
  
  useEffect(() => {
    getWeatherImage();
  }, [weatherText]);

  console.log(foreCast)

  return (
    <main className="app" style={{ backgroundImage: `url(${blueSky})` }}>
      <div className="weather">
        {weather ? (
          <div className="weather-content">
            <div className="temperature-area">
              <h2 className="city">
                {location && location.name}, {location.country}
              </h2>
              <h4 className="date">{date}</h4>
              {weatherImage && <img src={weatherImage} />}
              <h1 className="temp">
                {isCelcius ? Math.floor(weather.temp_c) : Math.floor(weather.temp_f)}
                <span>  {isCelcius ? " °C" :" °F"}</span>
              </h1>
              <h3 className="type">{condition && condition.text}</h3>
              <p className="details">
                Feels like {isCelcius ? Math.floor(weather.feelslike_c) : Math.floor(weather.feelslike_f)}
                {isCelcius ? " °C" :" °F"}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail">
                <i className="uil uil-wind"></i>
                <p>{weather.wind_kph} Km/h</p>
                <h4>Wind</h4>
              </div>
              <div className="detail">
                <i className="uil uil-water"></i>
                <p>{weather.humidity} Km/h</p>
                <h4>Humidiy</h4>
              </div>
              <div className="detail">
                <i className="uil uil-clouds"></i>
                <p>{weather.cloud}%</p>
                <h4>Cloud</h4>
              </div>
              <div className="detail">
                <i className="uil uil-desert"></i>
                <p>{weather.uv}%</p>
                <h4>UV</h4>
              </div>
              <div className="detail">
                <i className="uil uil-sign-alt"></i>
                <p>{weather.wind_dir}</p>
                <h4>Wind Dir...</h4>
              </div>
              <div className="detail">
                <i className="uil uil-eye"></i>
                <p>{100 - weather.vis_km}% km</p>
                <h4>Visibility</h4>
              </div>
              <div className="detail">
              <i className="uil uil-mountains-sun"></i>
                <p>{astro.sunrise} </p>
                <h4>Sunrise</h4>
              </div>
              <div className="detail">
              <i className="uil uil-sunset"></i>
                <p>{astro.sunset}</p>
                <h4>Sunset</h4>
              </div>
              <div className="detail">
                <i className="uil uil-lamp"></i>
                <p>{astro.moon_illumination}%</p>
                <h4>Moon Illumi...</h4>
              </div>
              
            </div>

            <div className="forecast">
              <h2>Forecast {location && location.name} Today</h2>
              <div className="forecast-list">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={10}
                  // navigation={true}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {todayForeCast.map((item, i) => {
                    let time = convertTo12Hour(item.time.slice(-5));
                    let itemCondition = item.condition.text
                      .trim()
                      .toLowerCase();
                    let icon;
                    if (itemCondition === "sunny") {
                      icon = sun;
                    } else if (itemCondition === "partly cloudy") {
                      icon = cloudSun;
                    } else if (itemCondition === "overcast") {
                      icon = sunCloudAir;
                    } else if (itemCondition === "moderate rain at times") {
                      icon = lightRain;
                    } else if (itemCondition === "heavy rain at times") {
                      icon = thunderRain;
                    } else if (itemCondition === "rain") {
                      icon = lightRain;
                    } else if (itemCondition === "heavy rain") {
                      icon = thunderRain;
                    } else if (itemCondition === "patchy rain nearby") {
                      icon = sunLightRain;
                    } else if (itemCondition === "cloudy") {
                      icon = cloud;
                    } else if (itemCondition === "mist") {
                      icon = cloudAir;
                    } else if (itemCondition === "light drizzle") {
                      icon = cloudAir;
                    } else if (itemCondition === "light rain") {
                      icon = lightRain;
                    } else if (itemCondition === "shower") {
                      icon = shower;
                    } else if (itemCondition === "light rain shower") {
                      icon = sunShower;
                    } else if (itemCondition === "moderate rain") {
                      icon = lightRain;
                    } else if (itemCondition === "clear") {
                      icon = sunAir;
                    } else if (itemCondition === "fog") {
                      icon = fog;
                    } else if (itemCondition === "snow") {
                      icon = snow;
                    } else if (itemCondition === "moderate snow") {
                      icon = snow;
                    } else if (itemCondition === "light snow") {
                      icon = snow;
                    } else if (itemCondition === "light sleet") {
                      icon = snowHeavy;
                    } else if (
                      itemCondition === "moderate or heavy rain with thunder"
                    ) {
                      icon = snowHeavy;
                    } else if (itemCondition === "patchy rain and thunder") {
                      icon = snowHeavy;
                    } else {
                      icon = cloudSun;
                    }

                    return (
                      <SwiperSlide key={i}>
                        <div className="day">
                          <h2>{time}</h2>
                          <img src={icon} />
                          <h3>{isCelcius? Math.floor(item.temp_c) : Math.floor(item.temp_f)}</h3>
                          <h4>{item.condition.text}</h4>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>

            <div className="search-icon" onClick={() => setShowSearch(true)}>
              <i className="uil uil-search-alt"></i>
            </div>

            <div className="navigate-icon" onClick={()=> setIsCelcius(prev => !prev)}>
              {isCelcius ?  <i className="uil uil-fahrenheit"></i> : <i className="uil uil-celsius"></i>}
            </div>
          </div>
        ) : (
          <div className="wrong-page"> Wrong City Entered</div>
        )}
      </div>

      {showSearch && (
        <div className="search">
          <form className="search-content" onSubmit={handleSubmit}>
            <p>Search city or country:</p>
            <div className="form-field">
              <input
                type="text"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">
                <i className="uil uil-search-alt"></i>
              </button>
            </div>

            <div className="close" onClick={() => setShowSearch(false)}>
              <i className="uil uil-multiply"></i>
            </div>
          </form>
        </div>
      )}

      <footer className="footer">
        <p>
          Powered by{" "}
          <a
            href="https://www.linkedin.com/in/shaik-sohail-ba49351b3"
            target="_blank"
          >
            Shaik Sohail
          </a>
        </p>
      </footer>
    </main>
  );
};

export default App;
