package com.sqlplay

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import android.graphics.Typeface;
import android.graphics.Paint;

class MeasureSize(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MeasureSize"

     private fun getWidthOfString(text: String, fontFamily: String, fontSize: Float ): Float {
        val paint = Paint()
        paint.setTypeface(Typeface.create(fontFamily, Typeface.NORMAL))
        paint.textSize = fontSize
        return paint.measureText(text)
    }

    @ReactMethod
    fun measureSize(text: String, font: String, fontSize: Float, promise: Promise) {
        try {
            val width = getWidthOfString(text, font, fontSize);
            promise.resolve(width);
        } catch (e: Exception) {
            promise.reject(e);
        }
    }}
