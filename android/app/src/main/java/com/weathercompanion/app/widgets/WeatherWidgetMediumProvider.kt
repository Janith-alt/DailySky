package com.weathercompanion.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.weathercompanion.app.R
import org.json.JSONObject

/**
 * Medium Native Android Widget
 * Displays: Current Temperature, Today's High and Low, Weather Condition, AQI Value, Location
 */
class WeatherWidgetMediumProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateMediumWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateMediumWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_medium)
            val prefs = context.getSharedPreferences("WeatherWidgetData", Context.MODE_PRIVATE)
            val jsonString = prefs.getString("medium_widget_data", null)

            var location = "Tokyo"
            var temp = "18°"
            var highLow = "H: 22°  L: 14°"
            var condition = "Partly Cloudy"
            var aqi = "AQI 38 · Good"
            var updatedAt = "Updated recently"

            if (jsonString != null) {
                try {
                    val json = JSONObject(jsonString)
                    location = json.optString("locationName", location)
                    temp = json.optString("temperature", temp)
                    highLow = json.optString("highLow", highLow)
                    condition = json.optString("condition", condition)
                    val aqiVal = json.optInt("aqiValue", 38)
                    val aqiCat = json.optString("aqiCategory", "Good")
                    aqi = "AQI $aqiVal · $aqiCat"
                    updatedAt = json.optString("updatedAt", updatedAt)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            views.setTextViewText(R.id.widget_med_location, location)
            views.setTextViewText(R.id.widget_med_temp, temp)
            views.setTextViewText(R.id.widget_med_highlow, highLow)
            views.setTextViewText(R.id.widget_med_condition, condition)
            views.setTextViewText(R.id.widget_med_aqi, aqi)
            views.setTextViewText(R.id.widget_med_updated, updatedAt)

            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("weatherapp://airquality")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                1,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_med_container, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
