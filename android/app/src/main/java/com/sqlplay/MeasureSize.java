package com.sqlplay;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.util.Log;
import android.graphics.Typeface;
import android.graphics.Paint;

public class MeasureSize extends ReactContextBaseJavaModule {
   MeasureSize(ReactApplicationContext context) {
       super(context);
   }
    @Override
    public String getName() {
        return "MeasureSizeModule";
    }

    private float getWidthOfString(String string, String fontFamily, float fontSize) {
        Paint paint = new Paint();
        paint.setTypeface(Typeface.create(fontFamily, Typeface.NORMAL));
        paint.setTextSize(fontSize);
        return paint.measureText(string);
    }

    @ReactMethod
    public void measureSize(String text, Integer size, Promise promise) {
        Log.d("MeasureSize", "text" + text
                + " and location: " + size);
        // Perform some operation to get the result
        float width = getWidthOfString(text, "Arial", size);
        // Resolve the promise with the result
        promise.resolve(width);
    }
}
