/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
export default class UploadingHolder {
    static uploading;
    static setUploading(uploading) {
        this.uploading = uploading;
    }

    static start(loaded, total) {
        this.uploading.start(loaded, total);
    }
    static stop() {
        this.uploading.stop();
    }
}