/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

/* eslint-disable camelcase */
/* eslint-disable no-console */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DeviceInfo from 'react-native-device-info';

import {UserTypes} from '../action_types';
import {addLocation} from './location';
import {handleImage} from '../utils/handle_image';
import {getUserInfo} from 'app/selectors/user';
import ImageResizer from 'react-native-image-resizer';

const PROFILE_WIDTH = 200;
const PROFILE_HEIGHT = 200;
const MAX_QUALITY = 100;

export const login = (data) => {
    return {
        type: UserTypes.LOGIN_SUCCESS,
        data,
    };
};

export const loginAnonymously = async () => {
    let data = {};
    await auth().signInAnonymously()
        .then(async (result) => {
            data = result;
        })
        .catch((error) => {
            console.log(error);
        });
    return data;
};

export const logout = () => {
    const {currentUser} = auth();

    return async (dispatch) => {
        const usersRef = firestore().
            collection('users').
            doc(currentUser.uid);

        const snapshot = await usersRef.get();
        if (snapshot.exists) {
            const deviceId = await getDeviceId();
            const devices = snapshot.data().devices;
            if (devices && devices[deviceId]) {
                delete devices[deviceId];
                await usersRef.update({devices});
            }
        }
        dispatch({
            type: UserTypes.LOGOUT_SUCCESS,
        });
    };
};

// export const completeLogin = (data) => {
//     return async (dispatch) => {
//         const promises = [];
//         if (data.additionalUserInfo.isNewUser) {
//             promises.push(dispatch(createUser(data)));
//         } else {
//             promises.push(dispatch(fetchUser(data.user.uid)));
//         }
//         return Promise.all(promises);
//     };
// };

export const createUser = (data) => {
    return async (dispatch) => {
        const userId = data.user.uid;
        if (data.user.isAnonymous) {
            await firestore().collection('users').doc(userId).set({
                info: {
                    id: userId,
                }
            });
            dispatch({
                type: UserTypes.LOGIN_ANONYMOUSLY_SUCCESS,
                data: {
                    id: userId,
                },
            });
            return null;
        }
        const {profile, providerId} = data.additionalUserInfo;

        const {name, family_name, given_name, locale, email, email_verified, picture, first_name, last_name, phone} = profile;
        const user = {
            info: {
                id: userId,
                name,
                providerId,
                email,
                email_verified,
                locale,
                first_name: family_name,
                last_name: given_name,
                picture,
                phone,
            },
        };
        if (providerId === 'facebook.com') {
            user.info.first_name = first_name;
            user.info.last_name = last_name;
            user.info.picture = picture.data.url;
            user.info.phone = data.user.phoneNumber;
            user.info.fbID = profile.id;
        }

        // delete property undefined of user
        Object.keys(user.info).forEach((key) => {
            if (user.info[key] === undefined || user.info[key] === null) {
                delete user.info[key];
            }
        });

        try {
            await firestore().collection('users').doc(userId).set(user);
            dispatch({
                type: UserTypes.CREATE_USER_SUCCESS,
                data: user.info,
            });
            return {
                data: user,
            };
        } catch (error) {
            dispatch({
                type: UserTypes.CREATE_USER_FAILED,
                error,
            });
            return {error};
        }
    };
};

export const fetchUser = (uid) => {
    return async (dispatch) => {
        const usersRef = firestore().collection('users');

        try {
            const snapshot = await usersRef.doc(uid).get();
            if (snapshot) {
                dispatch({
                    type: UserTypes.FETCH_USER_SUCCESS,
                    data: snapshot.data(),
                });

                return {data: snapshot.data()};
            }
        } catch (error) {
            dispatch({
                type: UserTypes.FETCH_USER_FAILED,
                error,
            });
            return {error};
        }
    };
};

export const updateUserLocation = (location) => {
    const {currentUser} = auth();

    return async (dispatch) => {
        try {
            const usersRef = firestore().collection('users').doc(currentUser.uid);
            await usersRef.update({
                location,
            });
            dispatch({
                type: UserTypes.UPDATE_USER_LOCATION_SUCCESS,
                location,
            });
        } catch (error) {
            dispatch({
                type: UserTypes.UPDATE_USER_LOCATION_FAILED,
                error,
            });
        }
    };
};

export const updateLastSignatureFont = (signature, font) => {
    const {currentUser} = auth();

    return async (dispatch) => {
        try {
            const usersRef = firestore().collection('users').doc(currentUser.uid);
            await usersRef.update({
                signature: {
                    signature,
                    font,
                },
            });
            dispatch({
                type: UserTypes.UPDATE_USER_SIGNATURE_SUCCESS,
                signature,
                font,
            });
        } catch (error) {
            dispatch({
                type: UserTypes.UPDATE_USER_SIGNATURE_FAILED,
                error,
            });
        }
    };
};

export const updateUser = (timeSunrise, timeSunset, isRemindSunrise, isRemindSunset) => {
    // console.warn('sunrise: ', isRemindSunrise);
    // console.warn('sunset: ', isRemindSunset);

    const {currentUser} = auth();
    return (dispatch) => {
        const usersRef = firestore().collection('users');

        usersRef.
            doc(currentUser.uid).
            get().
            then((snapshot) => {
                const data = snapshot.data();
                data.settings = {
                    remind: {
                        isRemindSunrise,
                        isRemindSunset,
                        timeSunrise,
                        timeSunset,
                    },
                };
                usersRef.
                    doc(currentUser.uid).
                    update({
                        settings: {
                            remind: {
                                isRemindSunrise,
                                isRemindSunset,
                                timeSunrise,
                                timeSunset,
                            },
                        },
                    });

                dispatch({
                    type: UserTypes.UPDATE_USER_SUCCESS,
                    data,
                });
            });
    };
};

export const getMe = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const userId = state.user.info.id;

        const promises = [
            dispatch(fetchUser(userId)),

            // get data
        ];
        return Promise.all(promises);
    };
};

export const updateProfile = (name, avatar) => {
    const {currentUser} = auth();

    return async (dispatch, getState) => {
        const usersRef = firestore().collection('users');
        const state = getState();
        const userPicture = getUserInfo(state).picture;

        if (userPicture === avatar) {
            dispatch({
                type: UserTypes.UPDATE_PROFILE,
            });
            await usersRef.
                doc(currentUser.uid).
                update({
                    'info.name': name,
                });
            dispatch({
                type: UserTypes.UPDATE_PROFILE_SUCCESS,
                data: {
                    name,
                },
            });
        } else {
            const resizedImg = await ImageResizer.createResizedImage(avatar, PROFILE_WIDTH, PROFILE_HEIGHT, 'JPEG', MAX_QUALITY);
            const fileName = handleImage(resizedImg.uri);
            const storageRef = storage().ref(`avatar/${fileName}`);
            const task = storageRef.putFile(avatar, {
                cacheControl: 'no-store', // disable caching
            });
            task.on('state_changed', {
                next(taskSnapshot) {
                    if (taskSnapshot.state === 'running') {
                        dispatch({
                            type: UserTypes.UPDATE_PROFILE,
                        });
                    }
                },
                error() {
                    dispatch({
                        type: UserTypes.UPDATE_PROFILE_FAILURE,
                    });
                },
                complete() {
                    storageRef.
                        getDownloadURL().
                        then((picture) => {
                            usersRef.
                                doc(currentUser.uid).
                                update({
                                    'info.name': name,
                                    'info.picture': picture,
                                });
                            dispatch({
                                type: UserTypes.UPDATE_PROFILE_SUCCESS,
                                data: {
                                    name,
                                    picture,
                                },
                            });
                        }).
                        catch(() => {
                            dispatch({
                                type: UserTypes.UPDATE_PROFILE_FAILURE,
                            });
                        });
                },
            });
        }
    };
};

export const updateFcmToken = () => {
    const {currentUser} = auth();

    return async (dispatch, getState) => {
        try {
            const state = getState();

            // console.log(state);

            const deviceFcmToken = state.device.fcmToken;
            const usersRef = firestore().collection('users').doc(currentUser.uid);

            const snapshot = await usersRef.get();
            if (snapshot.exists) {
                const deviceId = await getDeviceId();
                await usersRef.set({
                    devices: {
                        [deviceId]: {
                            fcmToken: deviceFcmToken,
                        },
                    },
                }, {merge: true});
                dispatch({
                    type: UserTypes.UPDATE_USER_FCM_TOKEN_SUCCESS,
                });
            }
        } catch (error) {
            dispatch({
                type: UserTypes.UPDATE_USER_FCM_TOKEN_FAILED,
                error,
            });
        }
    };
};

export const getDeviceId = async () => {
    const deviceName = await DeviceInfo.getModel();
    const deviceId = await DeviceInfo.getUniqueId();
    let device = '';
    if (deviceName && deviceId) {
        device = deviceName + ' ' + deviceId;
        device = device.replace(/ /g, '');
    } else if (deviceId) {
        device = deviceId;
        device = device.replace(/ /g, '');
    }
    return device;
};

export const updateUserLocale = () => {
    const {currentUser} = auth();

    return async (dispatch, getState) => {
        try {
            const state = getState();

            const deviceLocale = state.device.info.locale;
            const usersRef = firestore().collection('users').doc(currentUser.uid);

            const snapshot = await usersRef.get();
            if (snapshot.exists) {
                const userLocale = snapshot.data().info.locale || '';
                if (userLocale !== deviceLocale) {
                    await usersRef.update({
                        'info.locale': deviceLocale,
                    });
                    dispatch({
                        type: UserTypes.UPDATE_USER_LOCALE_SUCCESS,
                    });
                }
            }
        } catch (error) {
            dispatch({
                type: UserTypes.UPDATE_USER_LOCALE_FAIL,
                error,
            });
        }
    };
};