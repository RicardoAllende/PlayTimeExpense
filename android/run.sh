#!/bin/bash

./gradlew ${1:-installDevDebug} --stacktrace && adb shell am start -n io.market.nativebase.craftman.myexpense/host.exp.exponent.MainActivity
