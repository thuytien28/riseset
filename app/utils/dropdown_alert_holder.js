/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
export default class DropdownAlertHolder {
    static dropdownAlert;
    static setDropdownAlert(dropdownAlert) {
        this.dropdownAlert = dropdownAlert;
    }

    static start(type, content) {
        this.dropdownAlert.alertWithType(type, content);
    }
}