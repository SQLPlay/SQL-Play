package com.sql_playground;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.content.res.Configuration;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {jkr1433

        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SQL_PlayGround";
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        getReactInstanceManager().onConfigurationChanged(this, newConfig);
    }
}

