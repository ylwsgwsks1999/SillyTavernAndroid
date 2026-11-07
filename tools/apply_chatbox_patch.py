#!/usr/bin/env python3
"""Apply the Chatbox mobile shell to the ST-Manager Android WebView host."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
java_path = root / "app/src/main/java/com/sillytavern/app/InstanceActivity.java"
gradle_path = root / "app/build.gradle"

java = java_path.read_text(encoding="utf-8")
gradle = gradle_path.read_text(encoding="utf-8")

marker = "// CHATBOX_MOBILE_PATCH_V1"
if marker not in java:
    old = "                view.evaluateJavascript(DownloadBridge.INJECT_JS, null);"
    if old not in java:
        raise SystemExit("Cannot locate WebView onPageFinished injection point; source was not changed.")
    java = java.replace(old, old + "\n                injectChatboxUi(view);", 1)

    if "import java.io.ByteArrayOutputStream;" not in java:
        java = java.replace("import java.io.File;\n", "import java.io.File;\nimport java.io.ByteArrayOutputStream;\n", 1)
    if "import org.json.JSONObject;" not in java:
        java = java.replace("import java.util.regex.Pattern;\n", "import java.util.regex.Pattern;\nimport org.json.JSONObject;\n", 1)

    helper = r'''
    // CHATBOX_MOBILE_PATCH_V1
    private void injectChatboxUi(WebView view) {
        try {
            String css = readChatboxAsset("tcm/chatbox-mobile.css");
            String js = readChatboxAsset("tcm/chatbox-mobile.js");
            String script = "(function(){"
                    + "var s=document.getElementById('tcm-chatbox-style');"
                    + "if(!s){s=document.createElement('style');s.id='tcm-chatbox-style';document.head.appendChild(s);}"
                    + "s.textContent=" + JSONObject.quote(css) + ";"
                    + js
                    + "})();";
            view.evaluateJavascript(script, null);
        } catch (Exception e) {
            android.util.Log.e("ChatboxMobile", "Unable to inject Chatbox UI", e);
        }
    }

    private String readChatboxAsset(String path) throws Exception {
        try (InputStream in = getAssets().open(path);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = in.read(buffer)) != -1) {
                out.write(buffer, 0, count);
            }
            return out.toString("UTF-8");
        }
    }
'''
    anchor = "    private void buildLayout() {"
    if anchor not in java:
        raise SystemExit("Cannot locate buildLayout() insertion point; source was not changed.")
    java = java.replace(anchor, helper + "\n" + anchor, 1)
    java_path.write_text(java, encoding="utf-8")

if "applicationIdSuffix '.chatbox'" not in gradle:
    # Insert the debug build type specifically inside android.buildTypes.
    # Do not match signingConfigs.release, which is a different block.
    build_types_anchor = "    buildTypes {\n        release {"
    if build_types_anchor not in gradle:
        raise SystemExit("Cannot locate android.buildTypes.release; Gradle file was not changed.")
    debug_block = """    buildTypes {
        debug {
            applicationIdSuffix '.chatbox'
            versionNameSuffix '-chatbox'
        }
        release {"""
    gradle = gradle.replace(build_types_anchor, debug_block, 1)
    gradle_path.write_text(gradle, encoding="utf-8")

print("Chatbox mobile patch applied.")
