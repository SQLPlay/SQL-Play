package com.sql_playground;

import android.content.res.Configuration;
import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;


public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
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
    //
    public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
        ReactRootView reactRootView = new ReactRootView(getContext());
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
        return reactRootView;
      }

      @Override
      protected void loadApp(String appKey) {
        RNBootSplash.init(getPlainActivity());
        super.loadApp(appKey);
      }
    }
}

