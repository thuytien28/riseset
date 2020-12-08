/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import RNFetchBlobFS from 'rn-fetch-blob/fs';
import keyMirror from '../utils/key_mirror';

const deviceTypes = keyMirror({
    CONNECTION_CHANGED: null,
});

export default {
    ...deviceTypes,
    DOCUMENTS_PATH: `${RNFetchBlobFS.dirs.CacheDir}/Documents`,
    IMAGES_PATH: `${RNFetchBlobFS.dirs.CacheDir}/Images`,
    VIDEOS_PATH: `${RNFetchBlobFS.dirs.CacheDir}/Videos`,
};
