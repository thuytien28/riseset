
/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

export function debounce(func: (...args: any) => mixed, wait: number, immediate: boolean, cb: () => mixed) {
    let timeout;
    return function fx(...args: Array<any>) {
        const runLater = () => {
            timeout = null;
            if (!immediate) {
                // Reflect.apply(func, this, args);
                func.apply(this, args);
                if (cb) {
                    cb();
                }
            }
        };
        const callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(runLater, wait);
        if (callNow) {
            // Reflect.apply(func, this, args);
            func.apply(this, args);
            if (cb) {
                cb();
            }
        }
    };
}
