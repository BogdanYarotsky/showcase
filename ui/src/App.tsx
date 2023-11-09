import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { WeatherApi, WeatherForecast } from './gen/api';
import { Configuration } from './gen';

function App() {
  const [count, setCount] = useState(0);
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Assuming 'getWeatherForecast' returns a Promise
        const response = await new WeatherApi(new Configuration({ basePath: "http://localhost:5121" })).getWeatherForecast();
        setWeatherData(response.data); // Assuming response contains a 'data' field with the forecast
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Now we're sure it's an Error and has a message property
        } else {
          // Handle cases where it's not an Error object
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []); // The empty array means this effect runs once on mount

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {/* Displaying fetched weather data */}
        {loading && <p>Loading weather data...</p>}
        {error && <p>Error fetching weather data: {error}</p>}
        {weatherData && (
          <div>
            <h2>Weather Forecast</h2>
            {weatherData.map(wd => <p>{`${wd.date} ${wd.summary} ${wd.temperatureC}`}</p>)}
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
