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
 * Small Native Android Widget
 * Displays: Current Temperature, Weather Icon, Location Name, Weather Condition, Last Update
 */
class WeatherWidgetSmallProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateSmallWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateSmallWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_small)
            val prefs = context.getSharedPreferences("WeatherWidgetData", Context.MODE_PRIVATE)
            val jsonString = prefs.getString("small_widget_data", null)

            var location = "Tokyo"
            var temp = "18°"
            var condition = "Clear Sky"
            var updatedAt = "Updated recently"

            if (jsonString != null) {
                try {
                    val json = JSONObject(jsonString)
                    location = json.optString("locationName", location)
                    temp = json.optString("temperature", temp)
                    condition = json.optString("condition", condition)
                    updatedAt = json.optString("updatedAt", updatedAt)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            views.setTextViewText(R.id.widget_small_location, location)
            views.setTextViewText(R.id.widget_small_temp, temp)
            views.setTextViewText(R.id.widget_small_condition, condition)
            views.setTextViewText(R.id.widget_small_updated, updatedAt)

            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("weatherapp://home")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_small_container, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
