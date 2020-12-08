/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import { StoryTypes } from 'app/action_types';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';
import firestore from '@react-native-firebase/firestore';

import uuidv4 from 'uuid/v4';

import { addLocation } from './location';
import { handleImage } from 'app/utils/handle_image';
import { updateLastSignatureFont } from 'app/actions/user';

export const STORIES_LIMIT_DEFAULT = 5;

export const addStory = (story) => {
    const date = new Date().getTime();
    const handleImages = [];

    return (dispatch) => {
        story.images.forEach((image) => {
            const filename = handleImage(image);
            const storageRef = storage().ref(`stories/${filename}`);
            const task = storageRef.putFile(image, {
                cacheControl: 'no-store', // disable caching
            });

            task.on('state_changed', {

                // uploading
                next(taskSnapshot) {
                    if (taskSnapshot.state === 'running') {
                        dispatch({
                            type: StoryTypes.UPLOADING,
                            bytesTransferred: taskSnapshot.bytesTransferred,
                            totalBytes: taskSnapshot.totalBytes,
                        });
                    }
                },
                error() {
                    dispatch({
                        type: StoryTypes.UPLOADING_FAIL,
                    });
                },

                // success
                async complete() {
                    try {
                        const storyId = uuidv4();

                        // get storage image url
                        const imgUrl = await storageRef.getDownloadURL();
                        handleImages.push({
                            filename,
                            url: imgUrl,
                            effect: story.effectName ? story.effectName : '',
                        });

                        const newStory = {
                            id: storyId,
                            isRiseSet: story.isRiseSet,
                            photoTakenTime: story.time,
                            note: story.note,
                            userId: story.uid,
                            images: handleImages,
                            storyCreateAt: date,
                            signature: story.signature,
                            signatureFont: story.signatureFont,
                            address: story.location.address,
                            locationId: story.location.id,
                            locationName: story.location.name,
                        };

                        if (story.effectName) {
                            newStory.effects = [story.effectName]; // after that multi images
                        }

                        const storiesRef = firestore().collection('stories');

                        // const userLocationRef = firestore().collection('user_location');

                        // add stories collection
                        await storiesRef.doc(storyId).set(newStory);

                        // add user location collection
                        const userLocations = {
                            userId: story.uid,
                            locationId: story.location.id,
                            lastImage: handleImages[0].url,
                            updateAt: story.time, // TODO: checkin time
                            location: {
                                ...story.location,
                            },
                        };
                        // await userLocationRef.
                        //     doc(`${story.uid}-${story.location.id}`).
                        //     set(userLocations);
                        if (story.effectName) {
                            await analytics().logEvent(story.effectName, {
                                name: story.effectName,
                            });
                        }

                        dispatch({
                            type: StoryTypes.UPLOADING_SUCCESS,
                        });

                        // get story just uploaded
                        dispatch({
                            type: StoryTypes.GET_JUST_UPLOADED_STORY_SUCCESS,
                            data: newStory,
                        });
                        dispatch({
                            type: StoryTypes.UPDATE_LOCATIONS_JUST_UPLOADED_STORY_SUCCESS,
                            data: userLocations,
                        });

                        // update last signature font
                        if (story.signature) {
                            dispatch(updateLastSignatureFont(story.signature, story.signatureFont));
                        }
                    } catch (error) {
                        dispatch({
                            type: StoryTypes.UPLOADING_FAIL,
                        });
                    }
                },
            });
        });
    };
};

export const completeAddStory = (story) => {
    return async (dispatch) => {
        const promises = [];

        promises.push(dispatch(addStory(story)));
        promises.push(dispatch(addLocation(story.location)));

        if (promises.length > 0) {
            Promise.all(promises);
        }
    };
};

export const fetchStoriesByLocationId = (locationId, uid, limit = STORIES_LIMIT_DEFAULT) => {
    const data = [];

    return async (dispatch) => {
        try {
            dispatch({
                type: StoryTypes.STORIES_FETCH_BY_LOCATION,
            });

            const storiesRef = firestore().
                collection('stories').
                where('locationId', '==', locationId).
                where('userId', '==', uid).
                orderBy('photoTakenTime', 'desc').
                limit(limit);

            const storiesSnapshot = await storiesRef.
                get();

            storiesSnapshot.forEach((doc) => {
                doc.data().id = doc.id;
                data.push(doc.data());
            });

            fetchStoryByLocationSuccess(dispatch, data);
        } catch (err) {
            // console.log(err);
            fetchStoryByLocationFail(dispatch);
        }
    };
};

export const loadMoreLocationStories = (locationId, uid, limit = STORIES_LIMIT_DEFAULT) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'LOAD_MORE_LOCATION_STORIES',
        });
        const data = [];

        const storiesRef = firestore().
            collection('stories').
            where('locationId', '==', locationId).
            where('userId', '==', uid).
            orderBy('photoTakenTime', 'desc').
            limit(limit);

        const state = getState();

        const stories = Object.values(state.stories.fetchByLocation);
        const lastVisible = stories.length > 0 ? stories[stories.length - 1].photoTakenTime : 0;
        storiesRef.
            startAfter(lastVisible).
            get().
            then((snapshot) => {
                snapshot.forEach((doc) => {
                    doc.data().id = doc.id;
                    data.push(doc.data());
                });
                fetchStoryByLocationSuccess(dispatch, data);
            }).catch((error) => {
                console.log('error', error);
                fetchStoryByLocationFail(dispatch);
            });
    };
};

const fetchStoryByLocationSuccess = (dispatch, stories) => {
    dispatch({
        type: StoryTypes.STORIES_FETCH_BY_LOCATION_SUCCESS,
        data: stories,
    });
};

const fetchStoryByLocationFail = (dispatch) => {
    dispatch({
        type: StoryTypes.STORIES_FETCH_BY_LOCATION_FAIL,
    });
};

export const resetStoryFetchByLocation = () => {
    return (dispatch) => {
        dispatch({
            type: StoryTypes.STORIES_FETCH_BY_LOCATION_RESET,
        });
    };
};

export const fetchStoriesByUserId = (uid, limit = STORIES_LIMIT_DEFAULT) => {
    return (dispatch) => {
        dispatch({
            type: StoryTypes.STORIES_FETCH_BY_USER,
        });
        const data = [];

        const storiesRef = firestore().collection('stories').where('userId', '==', uid).
            orderBy('photoTakenTime', 'desc').limit(limit);

        storiesRef.
            get().
            then((snapshot) => {
                snapshot.forEach((doc) => {
                    doc.data().id = doc.id;
                    data.push(doc.data());
                });

                fetchStoryByUserSuccess(dispatch, data);
            }).catch((error) => {
                fetchStoryByUserFail(dispatch, error);
            });
    };
};

export const loadMoreUserStories = (uid, limit = STORIES_LIMIT_DEFAULT) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'LOAD_MORE_USER_STORIES',
        });
        const data = [];

        const storiesRef = firestore().collection('stories').where('userId', '==', uid).
            orderBy('photoTakenTime', 'desc').limit(limit);

        const state = getState();

        const stories = Object.values(state.stories.fetchAll);
        const lastVisible = stories.length > 0 ? stories[stories.length - 1].photoTakenTime : 0;
        storiesRef.
            startAfter(lastVisible).
            get().
            then((snapshot) => {
                snapshot.forEach((doc) => {
                    doc.data().id = doc.id;
                    data.push(doc.data());
                });
                fetchStoryByUserSuccess(dispatch, data);
            }).catch((error) => {
                // console.log('error', error);
                fetchStoryByUserFail(dispatch);
            });
    };
};

const fetchStoryByUserSuccess = (dispatch, stories) => {
    dispatch({
        type: StoryTypes.STORIES_FETCH_BY_USER_SUCCESS,
        data: stories,
    });
};

const fetchStoryByUserFail = (dispatch, error) => {
    dispatch({
        type: StoryTypes.STORIES_FETCH_BY_USER_FAIL,
        error,
    });
};

export const countStoriesAndImagesByUser = (uid) => {
    return async (dispatch) => {
        const data = {
            stories: 0,
            images: 0,
            places: 0,
        };

        const promises = [];
        promises.push(countStoriesAndImages(uid));
        promises.push(countLocations(uid));

        if (promises.length > 0) {
            const [stories, places] = await Promise.all(promises);
            data.places = places.data;
            data.stories = stories.data.stories;
            data.images = stories.data.images;
        }

        dispatch({
            type: StoryTypes.COUNT_STORIES_AND_IMAGES_BY_USER,
            data,
        });
    };
};

const countStoriesAndImages = async (uid) => {
    const storiesRef = firestore().collection('stories');
    try {
        const snapshot = await storiesRef.where('userId', '==', uid).get();
        const stories = snapshot.docs.length;
        let images = 0;
        snapshot.forEach((doc) => {
            images += doc.data().images.length;
        });

        return {
            data: {
                stories,
                images,
            },
        };
    } catch (error) {
        return {
            error,
        };
    }
};

const countLocations = async (uid) => {
    const userLocationRef = firestore().collection('user_location');
    try {
        const snapshot = await userLocationRef.where('userId', '==', uid).get();
        return { data: snapshot.docs.length };
    } catch (error) {
        return {
            error,
        };
    }
};

export const updateStory = (storyId, note) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: StoryTypes.UPDATE_STORY,
            });
            const storyRef = firestore().collection('stories').doc(storyId);
            await storyRef.update({
                note,
            });

            // get data after update
            const storySnapshot = await storyRef.get();

            dispatch({
                type: StoryTypes.UPDATE_STORY_SUCCESS,
                data: storySnapshot.data(),
            });
        } catch (error) {
            // console.log('error', error);
            dispatch({
                type: StoryTypes.UPDATE_STORY_FAILED,
                error,
            });
        }
    };
};

export const deleteStory = (storyId, locationId, userId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const story = state.stories.fetchAll[storyId] || state.stories.fetchByLocation[storyId];
            const image = story.images[0].filename;
            dispatch({
                type: StoryTypes.DELETE_STORY,
                storyId,
            });

            // delete document
            const storyRef = firestore().collection('stories').doc(storyId);
            await storyRef.delete();

            if (story) {
                const storyImageRef = storage().ref(`stories/${image}`);
                await storyImageRef.delete();
            }

            dispatch({
                type: StoryTypes.DELETE_STORY_SUCCESS,
                deletedStoryId: storyId,
            });
            dispatch(replaceLastImage(locationId, userId));
            dispatch(countStoriesAndImagesByUser(userId));
        } catch (error) {
            // console.log('error', error);
            dispatch({
                type: StoryTypes.DELETE_STORY_FAILED,
                error,
            });
        }
    };
};

// replace last image when delete story
export const replaceLastImage = (locationId, userId) => {
    return async (dispatch) => {
        try {
            const storiesRef = firestore().
                collection('stories').
                where('userId', '==', userId).
                where('locationId', '==', locationId).
                orderBy('photoTakenTime', 'desc').limit(1);

            const storySnapshot = await storiesRef.get();
            if (storySnapshot.docs.length > 0) {
                const replaceStory = storySnapshot.docs[0].data();

                // get last image to replace user location
                const lastImage = replaceStory.images[0].url;
                const userLocationRef = firestore().collection('user_location').doc(`${userId}-${locationId}`);
                await userLocationRef.update({
                    lastImage,
                });
                dispatch({
                    type: 'REPLACE_LAST_IMAGE',
                    locationId,
                    lastImage,
                });
            } else {
                // if no current user stories in above location then delete user location with id user-location
                const userLocationRef = firestore().collection('user_location').doc(`${userId}-${locationId}`);
                await userLocationRef.delete();
                dispatch({
                    type: 'DELETE_USER_LOCATION',
                    locationId,
                });
            }
        } catch (error) {
            dispatch({
                type: 'REPLACE_LAST_IMAGE_FAILED',
                error,
            });
        }
    };
};