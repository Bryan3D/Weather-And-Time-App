import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import { weatherIcons } from "./weatherIcons"; // Weather icons mapping

// Helper to safely render strings
const safeString = (value) => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string" && value.trim() === "") return "N/A";
  if (typeof value === "object") return "N/A"; // avoid [object Object]
  return String(value);
};

// Each city's weather/time box
const TimeBox = ({ city, time, weather, imageSource }) => (
  <View style={styles.timebox}>
    {/* Weather image above city name */}
    {imageSource && <Image source={imageSource} style={styles.weatherImage} />}
    <Text style={styles.header}>{safeString(city)}</Text>
    <Text style={styles.time}>{safeString(time)}</Text>
    <Text style={styles.weather}>{`Temp: ${safeString(weather)}°F`}</Text>
  </View>
);

// Get formatted time for a city
const getTime = (timeZone) => {
  return new Date().toLocaleString("en-US", {
    timeZone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
};

// Fetch weather from OpenWeather
const getWeather = async (city) => {
  try {
    const apiKey = "105179e2ff6654aeb72f470eca7ba2d8";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      console.error(`API Error for ${city}:`, data.message);
      return { temp: "Error", condition: "Default" };
    }

    const condition = data.weather?.[0]?.main || "Default";
    return { temp: Math.round(data.main.temp), condition };
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    return { temp: "Network Error", condition: "Default" };
  }
};

const TimeZoneStatus = () => {
  const [times, setTimes] = useState({});
  const [weatherData, setWeatherData] = useState({});

  const cities = {
    SanJuan: "America/Puerto_Rico",
    Paris: "Europe/Paris",
    Tokyo: "Asia/Tokyo",
    Sydney: "Australia/Sydney",
    Moscow: "Europe/Moscow",
  };

  // Update times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      Object.entries(cities).forEach(([city, zone]) => {
        newTimes[city] = getTime(zone);
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather once on mount
  useEffect(() => {
    const fetchWeatherData = async () => {
      const results = {};
      for (const city of Object.keys(cities)) {
        results[city] = await getWeather(city);
      }
      setWeatherData(results);
    };

    fetchWeatherData();
  }, []);

  const getTempIcon = (temp) => {
    if (typeof temp !== "number") return tempIcons.Default;

    if (temp >= 85) return weatherIcons.Sunny;
    if (temp >= 89) return weatherIcons.Hottie;
    if (temp >= 70) return weatherIcons.Windy;
    if (temp >= 50) return weatherIcons.Cloudy;
    if (temp >= 32) return weatherIcons.Rainy;
    return weatherIcons.Snowy;
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.pikbest.com/ai/illus_our/20230420/f4d6ce36c70263f84bfe070047470020.jpg!bwr800",
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Text style={styles.heading}>Around the World : Time & Weather</Text>
      <View style={styles.container}>
        {Object.keys(cities).map((city) => {
          const weatherInfo = weatherData[city] || {
            temp: "N/A",
            condition: "Default",
          };
          const imageSource =
            typeof weatherInfo.temp === "number"
              ? getTempIcon(weatherInfo.temp)
              : weatherIcons.Default;

          return (
            <TimeBox
              key={city}
              city={city}
              time={times[city]}
              weather={weatherInfo.temp}
              imageSource={imageSource}
            />
          );
        })}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F5C542",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
    marginTop: 40,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  timebox: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(37, 118, 142, 0.6)",
    borderWidth: 4,
    borderColor: "#f5c542",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    padding: 10,
  },
  weatherImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  time: {
    fontSize: 16,
    color: "#eee",
  },
  weather: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 5,
  },
});

export default TimeZoneStatus;
