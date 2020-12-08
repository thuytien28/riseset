/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import firestore from '@react-native-firebase/firestore';

export const locationsRef = firestore().collection('locations');

export const userLocationRef = firestore().collection('user_location');

export const storiesRef = firestore().collection('stories');

export const usersRef = firestore().collection('users');