/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import {Platform} from 'react-native';
import 'intl';
import 'date-time-format-timezone';

if (Platform.OS === 'android') {
    require('intl');
    require('date-time-format-timezone');
    require('intl/locale-data/jsonp/en');
    require('intl/locale-data/jsonp/vi');
}

import {addLocaleData} from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';

import en from 'assets/i18n/en.json';
import vi from 'assets/i18n/vi.json';

const TRANSLATIONS = {en};

export const DEFAULT_LOCALE = 'en';

addLocaleData(enLocaleData);

export const languages = {
    vi: {
        value: 'vi',
        name: 'Việt Nam',
        url: vi,
    },
    en: {
        value: 'en',
        name: 'English',
        url: en,
    },
};

function loadTranslation(locale) {
    try {
        let localeData;
        switch (locale) {
        case 'vi':
            TRANSLATIONS[locale] = require('assets/i18n/vi.json');
            localeData = require('react-intl/locale-data/vi');
            break;
        case 'en':
            TRANSLATIONS[locale] = require('assets/i18n/en.json');
            localeData = require('react-intl/locale-data/en');
            break;
        }

        if (localeData) {
            addLocaleData(localeData);
        }
    } catch (e) {
        console.error('NO Translation found', e); //eslint-disable-line no-console
    }
}

export function getTranslations(locale) {
    if (!TRANSLATIONS[locale]) {
        loadTranslation(locale);
    }
    return TRANSLATIONS[locale] || TRANSLATIONS[DEFAULT_LOCALE];
}

export function getLocalizedMessage(locale, id) {
    const translations = getTranslations(locale);

    return translations[id] || TRANSLATIONS[DEFAULT_LOCALE][id];
}
