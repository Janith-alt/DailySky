package com.weathercompanion.widgets

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

/**
 * Background WorkManager worker for updating Android home-screen widgets periodically.
 * Executes within Android battery & background execution limits.
 */
class WidgetUpdateWorker(
    private val context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val prefs = context.getSharedPreferences("WeatherWidgetData", Context.MODE_PRIVATE)
            val lat = prefs.getFloat("last_lat", 35.6895f)
            val lon = prefs.getFloat("last_lon", 139.6917f)

            val url = URL("https://api.open-meteo.com/v1/forecast?latitude=$lat&longitude=$lon&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto")
            val conn = url.openConnection() as HttpURLConnection
            conn.connectTimeout = 10000
            conn.readTimeout = 10000

            val stream = conn.inputStream.bufferedReader().use { it.readText() }
            val root = JSONObject(stream)
            val current = root.getJSONObject("current")
            val daily = root.getJSONObject("daily")

            val temp = "${Math.round(current.getDouble("temperature_2m"))}°"
            val high = "${Math.round(daily.getJSONArray("temperature_2m_max").getDouble(0))}°"
            val low = "${Math.round(daily.getJSONArray("temperature_2m_min").getDouble(0))}°"
            val locName = prefs.getString("last_city_name", "Current Location") ?: "Current Location"

            // Save updated values
            val smallObj = JSONObject().apply {
                put("locationName", locName)
                put("temperature", temp)
                put("condition", "Updated")
                put("updatedAt", "Updated just now")
            }

            val medObj = JSONObject().apply {
                put("locationName", locName)
                put("temperature", temp)
                put("highLow", "H: $high  L: $low")
                put("condition", "Updated")
                put("aqiValue", prefs.getInt("last_aqi", 42))
                put("aqiCategory", "Good")
                put("updatedAt", "Updated just now")
            }

            prefs.edit()
                .putString("small_widget_data", smallObj.toString())
                .putString("medium_widget_data", medObj.toString())
                .apply()

            // Notify Widget Manager to refresh
            val manager = AppWidgetManager.getInstance(context)
            val smallIds = manager.getAppWidgetIds(ComponentName(context, WeatherWidgetSmallProvider::class.java))
            val medIds = manager.getAppWidgetIds(ComponentName(context, WeatherWidgetMediumProvider::class.java))
            val largeIds = manager.getAppWidgetIds(ComponentName(context, WeatherWidgetLargeProvider::class.java))

            for (id in smallIds) WeatherWidgetSmallProvider.updateSmallWidget(context, manager, id)
            for (id in medIds) WeatherWidgetMediumProvider.updateMediumWidget(context, manager, id)
            for (id in largeIds) WeatherWidgetLargeProvider.updateLargeWidget(context, manager, id)

            Result.success()
        } catch (e: Exception) {
            e.printStackTrace()
            Result.retry()
        }
    }
}
