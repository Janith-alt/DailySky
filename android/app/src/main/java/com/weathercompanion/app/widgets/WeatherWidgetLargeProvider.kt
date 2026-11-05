package com.weathercompanion.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.weathercompanion.app.R
import org.json.JSONArray
import org.json.JSONObject

/**
 * Large Native Android Widget
 * Displays: Current Weather, Hourly Forecast (4 hours), AQI, Today's High & Low, Location, Last Updated
 */
class WeatherWidgetLargeProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateLargeWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateLargeWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_large)
            val prefs = context.getSharedPreferences("WeatherWidgetData", Context.MODE_PRIVATE)
            val jsonString = prefs.getString("large_widget_data", null)

            var location = "Tokyo"
            var temp = "18°"
            var feelsLike = "Feels like 17°"
            var highLow = "H: 22°  L: 14°"
            var condition = "Partly Cloudy"
            var aqi = "AQI 38 · Good"
            var updatedAt = "Updated recently"

            if (jsonString != null) {
                try {
                    val json = JSONObject(jsonString)
                    location = json.optString("locationName", location)
                    temp = json.optString("temperature", temp)
                    feelsLike = json.optString("feelsLike", feelsLike)
                    highLow = json.optString("highLow", highLow)
                    condition = json.optString("condition", condition)
                    val aqiVal = json.optInt("aqiValue", 38)
                    val aqiCat = json.optString("aqiCategory", "Good")
                    aqi = "AQI $aqiVal · $aqiCat"
                    updatedAt = json.optString("updatedAt", updatedAt)

                    val hourlyArr: JSONArray? = json.optJSONArray("hourly")
                    if (hourlyArr != null) {
                        val hourSlots = listOf(
                            Triple(R.id.hour_time_1, R.id.hour_temp_1, R.id.hour_rain_1),
                            Triple(R.id.hour_time_2, R.id.hour_temp_2, R.id.hour_rain_2),
                            Triple(R.id.hour_time_3, R.id.hour_temp_3, R.id.hour_rain_3),
                            Triple(R.id.hour_time_4, R.id.hour_temp_4, R.id.hour_rain_4)
                        )
                        for (i in 0 until minOf(hourlyArr.length(), hourSlots.size)) {
                            val hObj = hourlyArr.getJSONObject(i)
                            val (timeId, tempId, rainId) = hourSlots[i]
                            views.setTextViewText(timeId, hObj.optString("time", "--"))
                            views.setTextViewText(tempId, hObj.optString("temp", "--"))
                            val rain = hObj.optInt("rainProb", 0)
                            views.setTextViewText(rainId, if (rain > 0) "$rain%" else "")
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            views.setTextViewText(R.id.widget_large_location, location)
            views.setTextViewText(R.id.widget_large_temp, temp)
            views.setTextViewText(R.id.widget_large_feels, feelsLike)
            views.setTextViewText(R.id.widget_large_highlow, highLow)
            views.setTextViewText(R.id.widget_large_condition, condition)
            views.setTextViewText(R.id.widget_large_aqi, aqi)
            views.setTextViewText(R.id.widget_large_updated, updatedAt)

            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("weatherapp://home")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                2,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_large_container, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
