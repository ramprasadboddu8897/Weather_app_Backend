import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const API_KEY=process.env.API_KEY || '46bacfbd5a1be673252149fb3bf92ab7';

app.use(bodyParser.json());

// Weather API endpoint (e.g., OpenWeatherMap)
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';


// POST endpoint for getting weather information
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = {};

    // Fetch weather data for each city asynchronously
    await Promise.all(
      cities.map(async (city) => {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            q: city,
            appid: API_KEY,
            units: 'metric', // Use Celsius
          },
        });

        if (response.data.main && response.data.main.temp) {
          weatherData[city] = `${response.data.main.temp}°C`;
        } else {
          weatherData[city] = 'N/A';
        }
      })
    );

    res.json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
