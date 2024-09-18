import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoCheckboxSharp, IoCloseSharp } from 'react-icons/io5';

const WeatherChecker = () => {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [favorable, setFavorable] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const apiKey = 'f0caaa12ef574fb9b3f15604241107';

  const fetchWeatherByLocation = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
      );
      const data = response.data;
      setWeatherData(data);
      evaluateWeather(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (city.trim() === '') {
      setError('Please input a city name.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      const data = response.data;
      setWeatherData(data);
      evaluateWeather(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.teleport.org/api/cities/?search=${query}`);
      const cities = response.data._embedded['city:search-results'];
      setCitySuggestions(cities.map(city => city.matching_full_name));
    } catch (error) {
      setError('Error fetching city suggestions.');
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherByLocation(lat, lon);
    }
  }, [lat, lon]);

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            setError('Location access denied. Please enter a city name.');
          }
        }
      );
    }
  };

  const handleCityInputChange = (e) => {
    const query = e.target.value;
    setCity(query);
    fetchCitySuggestions(query);
  };

  const handleCitySelect = (city) => {
    setCity(city);
    setCitySuggestions([]);
    fetchWeatherByCity();
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={city}
          onChange={handleCityInputChange}
          placeholder="Enter city name"
        />
        {citySuggestions.length > 0 && (
          <ul>
            {citySuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleCitySelect(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button onClick={fetchWeatherByCity}>Check Weather</button>
        <button onClick={handleLocationClick}>Use My Location</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>{weatherData.location.name}</h2>
          <p>{weatherData.current.condition.text}</p>
          <p>{weatherData.current.temp_c}°C</p>
        </div>
      )}
      {favorable !== null && (
        <div>
          {favorable ? (
            <IoCheckboxSharp color="green" size={40} />
          ) : (
            <IoCloseSharp color="red" size={40} />
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherChecker;

