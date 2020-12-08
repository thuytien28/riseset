/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <GoogleMaps/GoogleMaps.h>
@import Firebase;
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <RNCPushNotificationIOS.h>
#import "Orientation.h"

// @import UserNotifications;

// @interface AppDelegate () <UNUserNotificationCenterDelegate>
// @end

@import FBAudienceNetwork;

@implementation AppDelegate

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
//    [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
  }
  
  [GMSServices provideAPIKey:@"AIzaSyDh8TZyBPaCxhMqcthBlQ1MuJGf0lnMFi8"];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"RisesetJournal"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // // [START set_messaging_delegate]
  // [FIRMessaging messaging].delegate = self;
  // // [END set_messaging_delegate]
  
  // // Register for remote notifications. This shows a permission dialog on first run, to
  // // show the dialog at a more appropriate time move this registration accordingly.
  // // [START register_for_notifications]
  // if ([UNUserNotificationCenter class] != nil) {
  //   // iOS 10 or later
  //   // For iOS 10 display notification (sent via APNS)
  //   [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  //   UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
  //   UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  //   [[UNUserNotificationCenter currentNotificationCenter]
  //    requestAuthorizationWithOptions:authOptions
  //    completionHandler:^(BOOL granted, NSError * _Nullable error) {
  //     // ...
  //   }];
  // } else {
  //   // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
  //   UIUserNotificationType allNotificationTypes =
  //   (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
  //   UIUserNotificationSettings *settings =
  //   [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
  //   [application registerUserNotificationSettings:settings];
  // }
  
  // [application registerForRemoteNotifications];
  // // [END register_for_notifications]
  
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
  return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options] || [RNGoogleSignin application:application openURL:url options:options];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
