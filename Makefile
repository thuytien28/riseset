.PHONY: pre-run clean cleancache
.PHONY: start stop
.PHONY: run run-ios run-android

.PHONY: test help

POD := $(shell which pod 2> /dev/null)
OS := $(shell sh -c 'uname -s 2>/dev/null')

node_modules: package.json
	@if ! [ $(shell which yarn 2> /dev/null) ]; then \
		echo "yarn is not installed https://yarnpkg.com"; \
		exit 1; \
	fi

	@echo Getting Javascript dependencies
	@yarn install

.podinstall:
ifeq ($(OS), Darwin)
ifdef POD
	@echo Getting Cocoapods dependencies;
	@cd ios && pod install;
else
	@echo "Cocoapods is not installed https://cocoapods.org/"
	@exit 1
endif
endif
	@touch $@

pre-run: | node_modules .podinstall

clean: ## Cleans dependencies, previous builds and temp files
	@echo Cleaning started

	@rm -rf node_modules
	@rm -f .podinstall
	@rm -rf ios/build
	@rm -rf ios/Pods
	@rm -rf android/app/build

	@echo Cleanup finished

cleancache: ## Cleans the npm packaging cache
	@echo Cleaning cache started - Use Ctrl+c to exit when you see \'Loading dependency graph, done\'
	@watchman watch-del-all
	@rm -rf ${TMPDIR}/react-*
	@rm -rf ${TMPDIR}/metro-bundler-cache-*
	@npm cache verify
	@yarn cache clean
	@yarn install --pure-lockfile
	@yarn start --reset-cache

post-install:
	@./node_modules/.bin/jetify

start: | pre-run ## Starts the React Native packager server
	$(call start_packager)

stop: ## Stops the React Native packager server
	$(call stop_packager)

check-device-ios:
	@if ! [ $(shell which xcodebuild) ]; then \
		echo "xcode is not installed"; \
		exit 1; \
	fi
	@if ! [ $(shell which watchman) ]; then \
		echo "watchman is not installed"; \
		exit 1; \
	fi

check-device-android:
	@if ! [ $(ANDROID_HOME) ]; then \
		echo "ANDROID_HOME is not set"; \
		exit 1; \
	fi
	@if ! [ $(shell which adb 2> /dev/null) ]; then \
		echo "adb is not installed"; \
		exit 1; \
	fi

	@echo "Connect your Android device or open the emulator"
	@adb wait-for-device

	@if ! [ $(shell which watchman 2> /dev/null) ]; then \
		echo "watchman is not installed"; \
		exit 1; \
	fi

prepare-android-build:
	@rm -rf ./node_modules/react-native/local-cli/templates/HelloWorld
	@rm -rf ./node_modules/react-native-linear-gradient/Examples/
	@rm -rf ./node_modules/react-native-orientation/demo/

run: run-ios ## alias for run-ios

run-ios: | check-device-ios pre-run ## Runs the app on an iOS simulator
	@if [ $(shell ps -ef | grep -i "cli.js start" | grep -civ grep) -eq 0 ]; then \
		echo Starting React Native packager server; \
		yarn start & echo Running iOS app in development; \
		if [ ! -z "${SIMULATOR}" ]; then \
			react-native run-ios --simulator="${SIMULATOR}"; \
		else \
			react-native run-ios; \
		fi; \
		wait; \
	else \
		echo Running iOS app in development; \
		if [ ! -z "${SIMULATOR}" ]; then \
			react-native run-ios --simulator="${SIMULATOR}"; \
		else \
			react-native run-ios; \
		fi; \
	fi

run-android: | check-device-android pre-run prepare-android-build ## Runs the app on an Android emulator or dev device
	@if [ $(shell ps -ef | grep -i "cli.js start" | grep -civ grep) -eq 0 ]; then \
        echo Starting React Native packager server; \
    	yarn start & echo Running Android app in development; \
    	if [ ! -z ${VARIANT} ]; then \
    		react-native run-android --variant=${VARIANT} --appId=${APPID}; \
    	else \
    		react-native run-android --appId=${APPID}; \
    	fi; \
    	wait; \
    else \
    	echo Running Android app in development; \
        if [ ! -z ${VARIANT} ]; then \
			react-native run-android --variant=${VARIANT} --appId=${APPID}; \
		else \
			react-native run-android --appId=${APPID}; \
		fi; \
    fi

## Help documentation https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

define start_packager
	@if [ $(shell ps -ef | grep -i "cli.js start" | grep -civ grep) -eq 0 ]; then \
		echo Starting React Native packager server; \
		yarn start & echo; \
	else \
		echo React Native packager server already running; \
	fi
endef

define stop_packager
	@echo Stopping React Native packager server
	@if [ $(shell ps -ef | grep -i "cli.js start" | grep -civ grep) -eq 1 ]; then \
		ps -ef | grep -i "cli.js start" | grep -iv grep | awk '{print $$2}' | xargs kill -9; \
		echo React Native packager server stopped; \
	else \
		echo No React Native packager server running; \
	fi
endef