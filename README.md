# DailySky — Real-Time Weather & Air Quality

A professionally designed, minimal, and modern real-time weather and air quality application for Android built with React Native, TypeScript, Expo, and native Android AppWidgets.

---

## 1. Design Philosophy

Designed to counter the generic "AI slop" aesthetic (no neon gradients, glowing borders, purple/blue gradient overload, or unnecessary glassmorphism).

- **Editorial Aesthetic**: Warm off-white surfaces, natural green accents, muted warning indicators, and deep charcoal in dark mode.
- **Restrained Typography**: Clean sans-serif hierarchy with large, elegant, low-weight temperature readouts.
- **Flat & Tactile**: Flat surfaces, subtle 1px divider lines, and small corner radiuses (6–12px).
- **Consistent Iconography**: Simple, standardized meteorological glyphs.

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#F7F7F2` (Warm off-white) | `#171A18` (Deep charcoal) | Base scaffold |
| **Surface** | `#FFFFFF` | `#1F2420` | Flat cards & containers |
| **Primary Text** | `#202321` (Almost black) | `#ECEFEA` (Soft off-white) | High-contrast readings |
| **Secondary Text**| `#666C64` (Muted grey) | `#A0A79E` | Labels & metadata |
| **Accent** | `#5E7D61` (Natural green) | `#7D9F80` (Sage green) | Primary actions & safe AQI |
| **Warning** | `#D97736` (Muted orange) | `#E28A4B` | Weather advisories & poor AQI |
| **Critical** | `#C84B4B` (Soft red) | `#D96161` | Severe weather & emergency AQI |

---

## 2. Real-Time API Integrations

The app connects directly to live global meteorological and environmental APIs without requiring hardcoded API keys:

1. **Weather Feed** (`https://api.open-meteo.com/v1/forecast`):
   - Current temperature, apparent ("feels-like") temperature, humidity, dew point.
   - Wind speed and 16-point cardinal compass direction ($0^\circ-360^\circ$).
   - Mean sea level pressure ($hPa$ / $inHg$), cloud coverage, precipitation amount.
   - Horizontally scrollable hourly forecast for the next 24–36 hours.
   - 7-day forecast with daily high/low temperature span bars and precipitation probabilities.
   - Solar ephemeris: astronomical sunrise and sunset timestamps.

2. **Air Quality Feed** (`https://air-quality-api.open-meteo.com/v1/air-quality`):
   - Real-time US Air Quality Index ($0-500$ scale) and European AQI.
   - Comprehensive chemical pollutant breakdown:
     * **$PM_{2.5}$**: Fine inhalable particulate matter ($\mu g/m^3$).
     * **$PM_{10}$**: Coarse airborne particulate matter ($\mu g/m^3$).
     * **$O_3$**: Ground-level ozone ($\mu g/m^3$).
     * **$NO_2$**: Nitrogen dioxide combustion emissions ($\mu g/m^3$).
     * **$CO$**: Carbon monoxide ($\mu g/m^3$).
     * **$SO_2$**: Sulphur dioxide ($\mu g/m^3$).
   - Category classifications: **Good**, **Moderate**, **Poor**, **Very Poor**, and **Severe**.
   - Contextual health recommendations for general population, sensitive groups, outdoor sports, and indoor ventilation.

3. **Geocoding & Location Feed** (`https://geocoding-api.open-meteo.com/v1/search`):
   - Global city search with real-time debounced queries.
   - GPS-based location detection using `expo-location`.

---

## 3. Native Android Home-Screen Widgets

The app includes full native Android AppWidget implementations located in `android/app/src/main/java/com/weathercompanion/app/widgets/`:

- **Small Widget (2×2)**:
  - Current temperature, weather icon, active location name, weather condition, and last update timestamp.
  - Deep-links directly to the overview screen (`weatherapp://home`).
- **Medium Widget (4×2)**:
  - Current temperature, today's high & low, weather condition, and live AQI badge.
  - Deep-links to atmospheric details (`weatherapp://airquality`).
- **Large Widget (4×4)**:
  - Current temperature, feels-like temperature, high/low range, AQI status, and horizontal 4-hour forecast strip with rain probabilities.
- **Background Refresh**:
  - Registered with Android's WorkManager (`WidgetUpdateWorker.kt`) for scheduled 30-minute background updates adhering to Android battery restrictions.
- **In-App Widget Companion**:
  - The Settings screen includes an interactive 1:1 simulator to preview all 3 widget sizes in both Light and Dark themes.

---

## 4. Severe Weather Push Notifications

Configured with native Android notification channels (`weather_alerts`):

- **Monitored Hazards**:
  - Heavy rainfall & localized flooding ($> 6\text{ mm/h}$ or $> 80\%$ probability).
  - Thunderstorms and lightning strikes (WMO codes 95, 96, 99).
  - High wind warnings ($> 45\text{ km/h}$).
  - Extreme heatwaves ($> 35^\circ\text{C} / 95^\circ\text{F}$).
  - Sub-zero cold advisories ($< -10^\circ\text{C}$).
  - Hazardous air quality ($AQI \ge 151$).
- **Customization**:
  - Users can toggle specific alert categories in the Preferences screen.
  - A "Test Alert" button verifies push notification delivery on the device.

---

## 5. Offline Caching & Local Storage

- Local storage managed with `@react-native-async-storage/async-storage`.
- Forecast payloads and air quality readings are saved locally per coordinate.
- When an active network is unavailable, the application gracefully presents cached data with a timestamped offline indicator.

---

## 6. Project Architecture

```
weather-companion/
├── App.tsx                             # Main orchestrator & state manager
├── app.json                            # Expo & Android configuration
├── android/                            # Native Android Gradle project
│   └── app/src/main/
│       ├── AndroidManifest.xml         # Permissions, intents & widget receivers
│       ├── java/com/weathercompanion/app/
│       │   ├── MainActivity.kt
│       │   └── widgets/
│       │       ├── WeatherWidgetSmallProvider.kt
│       │       ├── WeatherWidgetMediumProvider.kt
│       │       ├── WeatherWidgetLargeProvider.kt
│       │       └── WidgetUpdateWorker.kt
│       └── res/
│           ├── layout/                 # Native RemoteViews layouts
│           ├── xml/                    # AppWidgetProvider metadata
│           └── drawable/               # Light & dark widget background shapes
└── src/
    ├── constants/
    │   ├── theme.ts                    # Warm off-white / charcoal palettes
    │   ├── weatherCodes.ts             # WMO code mapping & icons
    │   └── aqiStandards.ts             # AQI scale thresholds & guidelines
    ├── services/
    │   ├── api.ts                      # Open-Meteo Weather, AQI & Geocoding
    │   ├── locationService.ts          # GPS detection & reverse geocode
    │   ├── notificationService.ts      # Severe alert engine & channels
    │   ├── storageService.ts           # Offline caching & preferences
    │   └── widgetService.ts            # Android widget data sync
    ├── utils/
    │   ├── weatherCalculations.ts      # Unit conversions, dew point, UV scale
    │   ├── aqiCalculations.ts          # Pollutant breakdown & health advice
    │   └── dateFormatting.ts           # Relative time & timestamps
    ├── components/
    │   ├── common/                     # Header, TabBar, WeatherIcon, Divider
    │   ├── home/                       # Hero, HourlyStrip, DailyList, AqiPreview
    │   ├── airQuality/                 # AqiGauge, PollutantCard, HealthAdvice
    │   ├── weatherDetails/             # AtmosphericGrid, HourlyTempChart
    │   ├── locations/                  # CitySearchModal
    │   └── widgets/                    # WidgetSimulator
    └── screens/
        ├── HomeScreen.tsx
        ├── AirQualityScreen.tsx
        ├── WeatherDetailsScreen.tsx
        ├── LocationsScreen.tsx
        └── SettingsScreen.tsx
```

---

