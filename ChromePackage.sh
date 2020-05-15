#!/bin/bash
rm releases/butWhyMod_chrome.zip
zip -r releases/butWhyMod_chrome.zip background.js content_scripts/ icons manifest.json options/ popup/
