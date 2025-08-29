import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const safeString = (value) => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string" && value.trim() === "") return "N/A";
  if (typeof value === "object") return "N/A"; // avoid [object Object]
  return String(value);
};

const TimeBox = ({ city, time, weather }) => (
  <View style={styles.timebox}>
    <Helmet>
      <title>Time & Weather Around the World</title>
      <meta name="description" content="Displays current time and weather in various cities around the world." />
      <meta name="keywords" content="time, weather, world clock, global weather, cities, timezone" />
    </Helmet>
    <Text style={styles.header}>{safeString(city)}</Text>
    <Text style={styles.time}>{safeString(time)}</Text>
    <Text style={styles.weather}>{`Temp: ${safeString(weather)}`}</Text>
  </View>
);

const getTime = (timeZone) => {
  return new Date().toLocaleString("en-US", {
    timeZone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
};

const getWeather = async (city) => {
  try {
    const apiKey = "105179e2ff6654aeb72f470eca7ba2d8";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(`Weather data for ${city}:`, data); // Debug

    if (data.cod !== 200) {
      console.error(`API Error for ${city}:`, data.message);
      return "Error";
    }

    return data.main ? Math.round(data.main.temp) : "N/A";
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    return "Network Error";
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

  // Update times
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

  // Fetch weather
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
        {Object.keys(cities).map((city) => (
          <TimeBox
            key={city}
            city={city}
            time={times[city]}
            weather={weatherData[city]}
          />
        ))}
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
    fontSize: 50,
    fontWeight: "bold",
    color: "#F5C542",
    fontFamily: "Avenir-Black",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 40,
    marginTop: 30,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  timebox: {
    width: 150*2,
    height: 150*2,
    borderRadius: 300,
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
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textTransform: "uppercase",
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
