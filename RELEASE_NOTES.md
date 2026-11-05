# DailySky v1.0.0 — Official Initial Release

We are excited to introduce **DailySky v1.0.0**, a thoughtfully crafted, real-time meteorological and air quality companion for Android. 

Built from the ground up to counter the generic "AI slop" aesthetic, DailySky delivers an editorial, human-designed experience with restrained typography, flat surfaces, natural color palettes, and zero neon gradient clutter.

---

## What's New in Version 1.0.0

### 🌤️ Live Weather & Atmospheric Details
- **Real-Time Meteorological Data**: Live temperature, apparent ("feels-like") temperature, relative humidity, calculated dew point (Magnus formula), barometric pressure, visibility, cloud cover, and UV index.
- **24-Hour Forecast Strip**: Horizontally scrollable hourly strip with condition icons, temperature, and precipitation probability.
- **7-Day Outlook**: Daily forecasts with high/low temperature span bars showing relative weekly variations.
- **24-Hour Trend Chart**: Clean, minimal SVG chart plotting temperature curves and rain probability bars.
- **Solar Ephemeris**: Astronomical sunrise and sunset timestamps with day progression.

### 🍃 Comprehensive Air Quality Index (AQI)
- **Visual AQI Gauge**: US AQI (0–500) and European AQI with a clean scale pointer and category indicators (**Good**, **Moderate**, **Poor**, **Very Poor**, **Severe**).
- **Chemical Pollutant Breakdown**: Detailed metrics for **$PM_{2.5}$**, **$PM_{10}$**, **Ozone ($O_3$)**, **Nitrogen Dioxide ($NO_2$)**, **Carbon Monoxide ($CO$)**, and **Sulphur Dioxide ($SO_2$)**.
- **Actionable Health Recommendations**: Context-aware guidance for the general public, sensitive individuals (asthma/cardiac), outdoor athletics, and indoor ventilation.

### 📱 Native Android Home-Screen Widgets
- **Small Widget (2×2)**: Compact readout of current temperature, weather icon, active location, and last update time.
- **Medium Widget (4×2)**: Today's high/low, condition description, and live color-coded AQI badge.
- **Large Widget (4×4)**: Comprehensive weather dashboard with a 4-hour forecast strip and AQI status.
- **Native Android Tech**: Built with native Kotlin `AppWidgetProvider`, XML RemoteViews, and battery-optimized Android `WorkManager` background updates.
- **In-App Widget Simulator**: Live interactive preview in Settings allowing you to test widgets in Light and Dark themes.

### ⚡ Severe Weather Push Notifications
- Timely notifications for **Heavy Rain**, **Thunderstorms & Lightning**, **High Winds** ($>45\text{ km/h}$), **Heatwaves**, **Sub-Zero Cold**, and **Hazardous Air Quality** ($AQI \ge 151$).
- High-priority Android notification channel (`weather_alerts`).
- Fully customizable alert preferences and an in-app "Test Alert" button.

### 📍 Global Locations & Offline Reliability
- **GPS Location Detection**: Privacy-respecting coordinate detection with reverse geocoding.
- **Worldwide City Search**: Instant debounced search powered by the Open-Meteo Geocoding API.
- **Multiple Saved Cities**: Effortlessly switch between favorite cities.
- **Offline Caching**: Automatically caches forecast payloads via `AsyncStorage` and displays a timestamped offline banner when disconnected.
- **Unit Customization**: Switch between Celsius (°C) / Fahrenheit (°F), km/h / mph, and hPa / inHg.

---

## 🎨 Visual Identity

- **Light Mode Palette**: Warm off-white (`#F7F7F2`), almost-black primary text (`#202321`), muted slate grey (`#666C64`), natural green accent (`#5E7D61`).
- **Dark Mode Palette**: Deep charcoal (`#171A18`) with surface cards (`#1F2420`).
- **Adaptive Icon**: Beautiful sky-blue icon with sun and cloud, optimized for Android's adaptive icon safe zone and Android 13+ Material You themed icons.

---

## Technical Specifications

- **Framework**: React Native / Expo SDK 58 (TypeScript)
- **Native Module**: Android Jetpack WorkManager & AppWidgetProvider
- **API Services**: Open-Meteo Weather, Air Quality & Geocoding APIs (no API key required)
- **Minimum Android Version**: Android 8.0 (API level 26)
- **Target Android Version**: Android 15 (API level 35)
