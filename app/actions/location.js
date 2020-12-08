/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import firestore from '@react-native-firebase/firestore';

import { LocationTypes } from '../action_types';
import Device from 'app/utils/device';

const PLACE_ITEM_HEIGHT = 50;
const FIRST_TIME_LOAD_LOCATIONS = 20; //  Math.round(Device.screen.height / PLACE_ITEM_HEIGHT);
const LOAD_MORE_LOCATIONS = 20;

export const addLocation = (location) => {
    return (dispatch) => {
        const country = location.address.split(', ').pop();

        const locationsRef = firestore().collection('locations');

        locationsRef.
            doc(location.id).
            set({
                name: location.name,
                address: location.address,
                lng: location.lng,
                lat: location.lat,
                country: country || '', // default country
                id: location.id,
            }).then(() => {
                dispatch({
                    type: LocationTypes.LOCATION_ADD,
                });
            });
    };
};

// fetch all locations of an userId
// export const fetchLocations = (uid, page, perPage, lastLocation) => {
//     const locationData = [];
//     const arrUserLocation = [];

//     return async (dispatch) => {
//         try {
//             dispatch({
//                 type: LocationTypes.LOCATIONS_FETCH,
//                 page,
//             });

//             const userLocationRef = firestore().collection('user_location');

//             let isEnd = false;
//             let locationIdSnapshot = null;
//             if (lastLocation && page > 0) {
//                 // console.log('this has last location');
//                 locationIdSnapshot = await userLocationRef.
//                     where('userId', '==', uid).
//                     orderBy('updateAt', 'desc').
//                     startAfter(lastLocation.updateAt).
//                     limit(perPage).
//                     get();
//             } else {
//                 // console.log('this doesnt have last location');
//                 locationIdSnapshot = await userLocationRef.
//                     where('userId', '==', uid).
//                     orderBy('updateAt', 'desc').
//                     limit(perPage).
//                     get();
//             }

//             if (locationIdSnapshot.docs.length === 0) {
//                 isEnd = true;
//                 fetchLocationsSuccess(dispatch, arrUserLocation, page, isEnd);
//                 return;
//             }

//             locationIdSnapshot.forEach((doc) => {
//                 arrUserLocation.push(doc.data());
//             });

//             const locationsRef = firestore().collection('locations');

//             var promises = arrUserLocation.map((item) => {
//                 return locationsRef.
//                     doc(item.locationId).
//                     get();
//             });

//             await Promise.all(promises).then((snapshots) => {
//                 // console.log('location data: ', snapshots.data());
//                 snapshots.forEach((snapshot) => {
//                     if (snapshot.data()) {
//                         locationData.push(snapshot.data());
//                     }
//                 });
//             });

//             // console.log('arr userlocation: ', arrUserLocation);
//             // console.log('location data: ', locationData);

//             // arrUserLocation.forEach((item) => {
//             //     locationData.forEach((location, index) => {
//             //         if (item.locationId === location.id) {
//             //             locationData[index].lastImage = item.lastImage;
//             //             locationData[index].updateAt = item.updateAt;
//             //         }
//             //     });
//             // });
//             arrUserLocation.forEach((item, index) => {
//                 locationData.forEach((location) => {
//                     if (location && item.locationId === location.id) {
//                         arrUserLocation[index].details = location;
//                     }
//                 });
//             });

//             arrUserLocation.forEach((item, index) => {
//                 if (!item.details) {
//                     arrUserLocation.splice(index, 1);
//                 }
//             });

//             fetchLocationsSuccess(dispatch, arrUserLocation, page, isEnd);
//         } catch (err) {
//             // console.warn(err);
//             fetchLocationsFail(dispatch);
//         }

//         // console.warn(locationData);
//     };
// };

export const fetchLocationsStory = (userId, limit = FIRST_TIME_LOAD_LOCATIONS) => {
    const data = [];

    return async (dispatch) => {
        try {
            dispatch({
                type: 'FETCH_LOCATIONS_STORY',
            });
            const locationstoryRef = firestore().
                collection('user_location').
                where('userId', '==', userId).
                orderBy('updateAt', 'desc').
                limit(limit);

            const snapshot = await locationstoryRef.get();
            snapshot.forEach((doc) => {
                data.push(doc.data());
            });

            const nextLocationsStory = {};
            data.forEach((item) => {
                nextLocationsStory[item.locationId] = item;
            });

            dispatch({
                type: 'FETCH_LOCATIONS_STORY_SUCCESS',
                data: nextLocationsStory,
            });
        } catch (error) {
            // console.log(err);
            dispatch({
                type: 'FETCH_LOCATIONS_STORY_FAILED',
                error,
            });
        }
    };
};

export const loadMoreLocations = (userId, limit = LOAD_MORE_LOCATIONS) => {
    // console.log('abcd');
    return async (dispatch, getState) => {
        dispatch({
            type: 'LOAD_MORE_LOCATIONS',
        });
        const data = [];
        try {
            const state = getState();
            const locations = Object.values(state.locationStory);
            const lastVisible = locations[locations.length - 1].updateAt;

            const locationstoryRef = firestore().
                collection('user_location').
                where('userId', '==', userId).
                orderBy('updateAt', 'desc').
                limit(limit);

            const snapshot = await locationstoryRef.startAfter(lastVisible).get();
            if (snapshot.size === 0) {
                dispatch({
                    type: 'FINISH_LOAD_MORE_LOCATIONS',
                });
            } else {
                snapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                dispatch({
                    type: 'LOAD_MORE_LOCATIONS_SUCCESS',
                    data,
                });
                if (snapshot.size < limit) {
                    dispatch({
                        type: 'FINISH_LOAD_MORE_LOCATIONS',
                    });
                }
            }
        } catch (error) {
            dispatch({
                type: 'LOAD_MORE_LOCATIONS_FAILED',
                error,
            });
        }
    };
};

export const resetLocations = () => {
    return (dispatch) => {
        dispatch({
            type: LocationTypes.LOCATIONS_RESET,
        });
    };
};

export const fetchLocation = (locationId) => {
    return async (dispatch) => {
        dispatch({
            type: LocationTypes.LOCATION_FETCH,
        });
        try {
            const locationsRef = firestore().collection('locations');

            const snapshot = await locationsRef.
                doc(locationId).
                get();

            dispatch({
                type: LocationTypes.LOCATION_FETCH_SUCCESS,
                data: snapshot.data(),
            });
        } catch (error) {
            dispatch({
                type: LocationTypes.LOCATION_FETCH_FAIL,
                error,
            });
        }
    };
};

