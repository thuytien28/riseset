/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import uuidv4 from 'uuid/v4';

export const handleImage = (image) => {
    const ext = image.split('.').pop(); // Extract image extension
    const filename = `${uuidv4()}.${ext}`; // Generate unique name

    return filename;
};