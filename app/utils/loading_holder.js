/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
export default class LoadingHolder {
    static loading;
    static setLoading(loading) {
        this.loading = loading;
    }

    static start(blur, viewRef) {
        this.loading.start(blur, viewRef);
    }
    static stop() {
        this.loading.stop();
    }
}