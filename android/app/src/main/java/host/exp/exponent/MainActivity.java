package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import host.exp.exponent.generated.DetachBuildConstants;
import host.exp.exponent.experience.DetachActivity;

import com.zmxv.RNSound.RNSoundPackage;

public class MainActivity extends DetachActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState){
    mReactInstanceManager = ReactInstanceManager.builder()
      .setApplication(getApplication())
      .addPackage(new MainReactPackage())
      .addPackage(new RNSoundPackage()); // <-- New
  }

  @Override
  public String publishedUrl() {
    return "exp://exp.host/@ricardo_allende/myexpense";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<String> sdkVersions() {
    return new ArrayList<>(Arrays.asList("28.0.0"));
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }
}
