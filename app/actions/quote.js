/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import _ from 'lodash';

import { QuoteType, UserTypes } from '../action_types';

export const fetchQuoteIfNecessary = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: QuoteType.QUOTE_FETCH,
        });

        try {
            let newQuoteTimes;
            const state = getState();
            const currentQuote = state.currentQuote;
            let needFetchNewQuote = false;
            let systemsQuotesData;
            const userQuote = await getUserQuoteOfUsers();

            const systemsQuotesRef = firestore().
                collection('systems').
                doc('quotes');

            if (!currentQuote || !currentQuote.quote || !currentQuote.quote.content) {
                needFetchNewQuote = true;
            } else {
                const lastQueryTime = currentQuote.lastQueryTime || 0;
                systemsQuotesData = await systemsQuotesRef.get();
                newQuoteTimes = systemsQuotesData.data().newQuoteTimes;

                let nextQuoteTime = 0;
                newQuoteTimes.forEach((qt) => {
                    // if found next quote time -> don't find anymore
                    if (nextQuoteTime > 0) {
                        return;
                    }

                    const now = new Date();
                    now.setHours(qt, 0, 0, 0, 0);
                    if (now.getTime() > lastQueryTime) {
                        nextQuoteTime = now.getTime();
                    }
                });

                if (userQuote) {
                    needFetchNewQuote = nextQuoteTime > 0 &&
                    new Date().getTime() > nextQuoteTime &&
                    new Date().getTime() > new Date(userQuote.pushedQuoteNumIn).getTime();
                }
            }

            if (!needFetchNewQuote) {
                // dispatch newQuoteTimes to update if it was changed on server
                dispatch({
                    type: QuoteType.QUOTE_FETCH_SUCCESS,
                    data: {
                        newQuoteTimes,
                    },
                });
                return;
            }

            // Fetch new quote
            if (!systemsQuotesData) {
                systemsQuotesData = await systemsQuotesRef.get();
            }

            // For the first time
            if (!newQuoteTimes) {
                newQuoteTimes = systemsQuotesData.data().newQuoteTimes;
            }

            const quoteLanguage = systemsQuotesData.data().availableLanguages.indexOf(state.device.info.locale) < 0 ? 'en' : state.device.info.locale;

            // const maxQuoteNumber = await systemsQuotesRef.
            //     collection('total').
            //     doc(quoteLanguage).
            //     get();

            let quote = '';
            const totalQuoteNumber = systemsQuotesData.data()['total_' + quoteLanguage];

            const randNum = Math.ceil(Math.random() * totalQuoteNumber);
            if (userQuote) {
                quote = await fetchNewQuote(quoteLanguage, userQuote.quoteNum);
            } else {
                quote = await fetchNewQuote(quoteLanguage, randNum);
            }

            // const quote = await fetchNewQuote(quoteLanguage, userQuote.quoteNum);

            // const quotesRef = firestore().
            //     collection('quotes_' + quoteLanguage).
            //     where('quoteNumber', '==', userQuote.quoteNum);

            // where('quoteNumber', '==', randNum);

            // const snapshot = await quotesRef.get();
            if (quote) {
                dispatch({
                    type: QuoteType.QUOTE_FETCH_SUCCESS,
                    data: {
                        quote,
                        newQuoteTimes,
                        lastQueryTime: new Date().getTime(),
                    },
                });
            }

            updateQuoteTimeUTC(state, newQuoteTimes, dispatch);
        } catch (err) {
            dispatch({
                type: QuoteType.QUOTE_FETCH_FAIL,
                data: err,
            });
        }
    };
};

const getUserQuoteOfUsers = async () => {
    try {
        const {currentUser} = auth();

        const usersRef = firestore().
            collection('users').
            doc(currentUser.uid);

        const userData = await usersRef.get();
        if (userData.exists) {
            return userData.data().userQuote;
        }
        return null;
    } catch (error) {
        console.log(error);
    }
};

const updateQuoteTimeUTC = (state, newQuoteTimes, dispatch) => {
    const usersData = state.user;
    const timeZoneOffset = state.device.info.timeZoneOffset;
    const userId = state.user.info.id;
    const tmpArr = [];

    if (newQuoteTimes) {
        newQuoteTimes.forEach((item) => {
            if (item < timeZoneOffset) {
                tmpArr.push(((24 + item) - timeZoneOffset));
            } else if (item - timeZoneOffset >= 24) {
                tmpArr.push((item - timeZoneOffset - 24));
            } else {
                tmpArr.push(item - timeZoneOffset);
            }
        });

        if (!usersData.quoteTimeUTC || (usersData.quoteTimeUTC && !_.isEqual(usersData.quoteTimeUTC, tmpArr))) {
            const usersRef = firestore().
                collection('users').
                doc(userId);

            usersRef.update({
                pushQuoteTimeIn: tmpArr,
            }).
                then(() => {
                    // console.log('Update successfully');
                    dispatch({
                        type: UserTypes.FETCH_QUOTE_TIME_UTC_SUCCESS,
                        data: tmpArr,
                    });
                }).
                catch((error) => {
                    dispatch({
                        type: UserTypes.FETCH_QUOTE_TIME_UTC_FAIL,
                        error,
                    });
                });
        }
    }
};

export const fetchQuoteByPressNoti = (quote, timePushedNoti) => {
    return async (dispatch) => {
        const {currentUser} = auth();
        const usersRef = firestore().
            collection('users').
            doc(currentUser.uid);

        const userData = await usersRef.get();
        let quoteData;

        // if user clicks into a noti in the pass, fetch the newest noti from firestore
        if (timePushedNoti < userData.data().userQuote.pushedQuoteNumIn) {
            const locale = userData.data().info.locale || 'en';
            // console.log('Locale: ', locale);
            const quoteNum = userData.data().userQuote.quoteNum;
            // console.log('Quote num: ', quoteNum);
            quoteData = await fetchNewQuote(locale, quoteNum);
            // console.log(quoteData);
        } else {
            quoteData = quote;
        }

        const systemsQuotesRef = firestore().
            collection('systems').
            doc('quotes');

        const systemsQuotesData = await systemsQuotesRef.get();
        const newQuoteTimes = systemsQuotesData.data().newQuoteTimes;
        const data = {
            quote: quoteData,
            newQuoteTimes,
            lastQueryTime: new Date().getTime(),
        };

        dispatch({
            type: QuoteType.QUOTE_FETCH_BY_PRESS_NOTI_SUCCESS,
            data,
        });
    };
};

const fetchNewQuote = async (locale, quoteNum) => {
    try {
        const quotesRef = firestore().
            collection(`quotes_${locale}`).
            where('quoteNumber', '==', quoteNum);

        const snapshot = await quotesRef.get();
        return snapshot.docs[0].data();
    } catch (error) {
        console.log(error);
    }
};