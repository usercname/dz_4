import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './WeatherWidget.scss';

const DEFAULT_CITY = 'Тюмень';
const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function CitySuggestionsModal({ cities, onSelect, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="city-modal-overlay" onClick={onClose}>
      <div className="city-modal" onClick={(e) => e.stopPropagation()}>
        <button className="city-modal__close" onClick={onClose} aria-label="Закрыть">×</button>
        <h3>Выберите город</h3>
        <ul className="city-modal__list">
          {cities.map((city, idx) => (
            <li 
              key={`${city.lat}-${city.lon}-${idx}`}
              className="city-modal__item"
              onClick={() => onSelect(city)}
            >
              <span className="city-modal__name">{city.name}</span>
              <span className="city-modal__region">
                {city.state ? `${city.state}, ` : ''}{city.country}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}

function WeatherWidget({ onClose }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [error, setError] = useState({ geocode: null, weather: null });
  const [failedCities, setFailedCities] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
        { signal: abortControllerRef.current?.signal }
      );
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name
      });
      setError(prev => ({ ...prev, weather: null }));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(prev => ({ ...prev, weather: 'Не удалось получить данные' }));
      }
    }
  }, []);

  const fetchGeocode = useCallback(async (cityName, limit = 5) => {
    try {
      const response = await fetch(
        `${GEO_API}?q=${encodeURIComponent(cityName)}&limit=${limit}&lang=ru&appid=${API_KEY}`,
        { signal: abortControllerRef.current?.signal }
      );
      if (!response.ok) throw new Error('Geocode fetch failed');
      return await response.json();
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(prev => ({ ...prev, geocode: cityName }));
        setFailedCities(prev => new Set(prev).add(cityName));
      }
      return [];
    }
  }, []);

  const loadWeatherForCity = useCallback(async (cityData) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError({ geocode: null, weather: null });
    
    await fetchWeather(cityData.lat, cityData.lon);
    setCity(cityData.name); // Подставляем название города в инпут
    setLoading(false);
  }, [fetchWeather]);

  useEffect(() => {
    const initWeather = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            await fetchWeather(pos.coords.latitude, pos.coords.longitude);
            setLoading(false);
          },
          async () => {
            const cities = await fetchGeocode(DEFAULT_CITY, 1);
            if (cities.length > 0) await loadWeatherForCity(cities[0]);
            else setLoading(false);
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        const cities = await fetchGeocode(DEFAULT_CITY, 1);
        if (cities.length > 0) await loadWeatherForCity(cities[0]);
        else setLoading(false);
      }
    };
    initWeather();
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, [fetchWeather, fetchGeocode, loadWeatherForCity]);

  const handleGetWeatherClick = async () => {
    if (!city.trim() || isSearchingCities) return;

    // Отменяем предыдущие запросы
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setIsSearchingCities(true);
    setError({ geocode: null, weather: null });

    const cities = await fetchGeocode(city, 5);
    setIsSearchingCities(false);

    if (cities.length > 0) {
      setSuggestions(cities);
      setShowSuggestions(true);
    } else {
      setError(prev => ({ ...prev, geocode: city }));
      setFailedCities(prev => new Set(prev).add(city));
    }
  };

  const handleCityChange = (e) => {
    const newValue = e.target.value;
    setCity(newValue);
    if (error.geocode && failedCities.has(newValue)) {
      setError(prev => ({ ...prev, geocode: null }));
    }
  };

  const handleSelectCity = async (cityData) => {
    setShowSuggestions(false);
    await loadWeatherForCity(cityData);
  };

  return (
    <div className="weather-widget">
      <button className="weather-widget__close" onClick={onClose} aria-label="Закрыть виджет">
      ×
    </button>
      
      {loading && !weather ? (
        <div className="weather-widget__skeleton">
          <div className="skeleton-line skeleton-line--wide"></div>
          <div className="skeleton-line skeleton-line--narrow"></div>
          <div className="skeleton-line skeleton-line--medium"></div>
        </div>
      ) : (
        <div className="weather-widget__content">
          {weather ? (
            <div className="weather-widget__data">
              {weather.icon && (
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="weather-widget__icon" />
              )}
              <div className="weather-widget__temp">{weather.temp}°C</div>
              <div className="weather-widget__desc">{weather.description}</div>
              <div className="weather-widget__city">{weather.city}</div>
            </div>
          ) : (
            <div className="weather-widget__empty"><p>no info about weather</p></div>
          )}
          
          <div className="weather-widget__input-group">
            <input
              type="text"
              className="weather-widget__input"
              placeholder="input city name"
              value={city}
              onChange={handleCityChange}
              disabled={loading || isSearchingCities}
            />
            <button 
              className="weather-widget__btn"
              onClick={handleGetWeatherClick}
              disabled={loading || !city.trim() || isSearchingCities}
            >
              {isSearchingCities ? 'search...' : 'get weather'}
            </button>
          </div>
          
          {error.geocode && <p className="weather-widget__error weather-widget__error--geocode">can't find city {error.geocode}</p>}
          {error.weather && <p className="weather-widget__error weather-widget__error--weather">{error.weather}</p>}
        </div>
      )}

      {showSuggestions && (
        <CitySuggestionsModal cities={suggestions} onSelect={handleSelectCity} onClose={() => setShowSuggestions(false)} />
      )}
    </div>
  );
}

export default WeatherWidget;