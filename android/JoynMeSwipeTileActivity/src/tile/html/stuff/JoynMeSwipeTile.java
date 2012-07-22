package tile.html.stuff;

import org.apache.cordova.DroidGap;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class JoynMeSwipeTile extends DroidGap { // DroidGap
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}