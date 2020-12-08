/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {
    Svg,
    Path,
    G,
    Rect,
    Defs,
    Stop,
    LinearGradient,
    ClipPath,
} from 'react-native-svg';

class GMIconActive extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Svg
                    width='38'
                    height='38'
                    viewBox='0 0 38 38'
                    fill='none'
                    xmlns='http://www.w3.org/2000/Svg'
                >
                    <Path
                        d='M34.4669 19.6559H28.0434C27.7616 14.6661 23.4882 10.8495 18.4984 11.1313C13.9022 11.3908 10.2333 15.0597 9.97377 19.6559H3.55132C3.25695 19.6559 3.01829 19.8946 3.01829 20.189C3.01829 20.4833 3.25695 20.722 3.55132 20.722H34.4669C34.7613 20.722 34.9999 20.4833 34.9999 20.189C34.9999 19.8946 34.7613 19.6559 34.4669 19.6559ZM11.0398 19.6559C11.322 15.4605 14.8042 12.1997 19.0091 12.1936C23.2136 12.2003 26.6952 15.4609 26.9773 19.6559H11.0398Z'
                        fill='url(#paint0_linear)'
                    />
                    <Path
                        d='M27.5376 21.7881H9.94766C9.65329 21.7881 9.41463 22.0267 9.41463 22.3211C9.41463 22.6155 9.65329 22.8541 9.94766 22.8541H27.5376C27.8319 22.8541 28.0706 22.6155 28.0706 22.3211C28.0706 22.0267 27.8319 21.7881 27.5376 21.7881Z'
                        fill='url(#paint1_linear)'
                    />
                    <Path
                        d='M25.9385 23.9202H11.5467C11.2524 23.9202 11.0137 24.1589 11.0137 24.4532C11.0137 24.7476 11.2524 24.9863 11.5467 24.9863H25.9385C26.2329 24.9863 26.4715 24.7476 26.4715 24.4532C26.4715 24.1589 26.2329 23.9202 25.9385 23.9202Z'
                        fill='url(#paint2_linear)'
                    />
                    <Path
                        d='M24.3394 26.0523H13.1458C12.8515 26.0523 12.6128 26.291 12.6128 26.5853C12.6128 26.8797 12.8515 27.1184 13.1458 27.1184H24.3394C24.6338 27.1184 24.8724 26.8797 24.8724 26.5853C24.8724 26.291 24.6338 26.0523 24.3394 26.0523Z'
                        fill='url(#paint3_linear)'
                    />
                    <Path
                        d='M22.2073 28.1844H15.2779C14.9836 28.1844 14.7449 28.4231 14.7449 28.7174C14.7449 29.0118 14.9836 29.2505 15.2779 29.2505H22.2073C22.5017 29.2505 22.7403 29.0118 22.7403 28.7174C22.7403 28.4231 22.5017 28.1844 22.2073 28.1844Z'
                        fill='url(#paint4_linear)'
                    />
                    <Path
                        d='M8.8816 18.0569H3.55132C3.25695 18.0569 3.01829 18.2956 3.01829 18.5899C3.01829 18.8843 3.25695 19.1229 3.55132 19.1229H8.8816C9.17596 19.1229 9.41463 18.8843 9.41463 18.5899C9.41463 18.2956 9.17596 18.0569 8.8816 18.0569Z'
                        fill='url(#paint5_linear)'
                    />
                    <Path
                        d='M9.63324 14.3715C9.62131 14.3666 9.60919 14.3622 9.59693 14.3582L3.73362 12.2261C3.46084 12.1153 3.14995 12.2467 3.03928 12.5195C2.92855 12.7923 3.05994 13.1032 3.33272 13.2139C3.34464 13.2187 3.35677 13.2231 3.36903 13.2271L9.23234 15.3592C9.50511 15.47 9.816 15.3386 9.92667 15.0658C10.0374 14.793 9.90602 14.4821 9.63324 14.3715Z'
                        fill='url(#paint6_linear)'
                    />
                    <Path
                        d='M15.2348 8.78545L13.6357 5.05426C13.5158 4.78534 13.2007 4.66455 12.9318 4.78441C12.6684 4.90188 12.5461 5.20757 12.656 5.47428L14.2551 9.20548C14.3391 9.40143 14.5317 9.52849 14.7449 9.52849C14.8171 9.52882 14.8887 9.5141 14.9549 9.48532C15.2254 9.36932 15.3507 9.05603 15.2348 8.78545Z'
                        fill='url(#paint7_linear)'
                    />
                    <Path
                        d='M24.5495 4.77427C24.2789 4.65834 23.9656 4.7836 23.8496 5.05411L22.2505 8.78531C22.1346 9.05582 22.2598 9.36917 22.5303 9.48517C22.5966 9.51396 22.6681 9.52861 22.7404 9.52835C22.9536 9.52835 23.1462 9.40129 23.2302 9.20533L24.8293 5.47414C24.9452 5.20363 24.82 4.89027 24.5495 4.77427Z'
                        fill='url(#paint8_linear)'
                    />
                    <Path
                        d='M34.9344 11.4053C34.7934 11.1469 34.4695 11.0517 34.2111 11.1926L28.3478 14.3908C28.0893 14.5317 27.994 14.8555 28.1349 15.1139C28.2284 15.2854 28.4083 15.3921 28.6036 15.3918C28.6926 15.3919 28.7803 15.3695 28.8584 15.3268L34.7217 12.1286C34.9802 11.9877 35.0754 11.6638 34.9344 11.4053Z'
                        fill='url(#paint9_linear)'
                    />
                    <Path
                        d='M12.4567 11.2836L7.12639 5.95333C6.91464 5.74878 6.57723 5.75465 6.37268 5.96639C6.1732 6.17294 6.1732 6.50042 6.37268 6.70703L11.703 12.0373C11.9147 12.2418 12.2522 12.2359 12.4567 12.0242C12.6562 11.8176 12.6562 11.4902 12.4567 11.2836Z'
                        fill='url(#paint10_linear)'
                    />
                    <Path
                        d='M19.0091 1C18.7148 1 18.4761 1.23866 18.4761 1.53303V8.4624C18.4761 8.75676 18.7148 8.99543 19.0091 8.99543C19.3035 8.99543 19.5422 8.75676 19.5422 8.4624V1.53303C19.5422 1.23866 19.3035 1 19.0091 1Z'
                        fill='url(#paint11_linear)'
                    />
                    <Path
                        d='M31.6457 5.95347C31.4375 5.74539 31.1001 5.74539 30.892 5.95347L25.5617 11.2838C25.3499 11.4883 25.3441 11.8257 25.5486 12.0375C25.7532 12.2492 26.0906 12.2551 26.3023 12.0505C26.3068 12.0463 26.3111 12.0419 26.3154 12.0375L31.6457 6.70718C31.8538 6.49903 31.8538 6.16162 31.6457 5.95347Z'
                        fill='url(#paint12_linear)'
                    />
                    <Path
                        d='M34.4669 18.0569H29.1367C28.8423 18.0569 28.6036 18.2956 28.6036 18.5899C28.6036 18.8843 28.8423 19.1229 29.1367 19.1229H34.4669C34.7613 19.1229 34.9999 18.8843 34.9999 18.5899C34.9999 18.2956 34.7613 18.0569 34.4669 18.0569Z'
                        fill='url(#paint13_linear)'
                    />
                    <Rect
                        x='8.99998'
                        y='35.1252'
                        width='20'
                        height='1.5'
                        rx='0.75'
                        fill='url(#paint14_linear)'
                    />
                    <Defs>
                        <LinearGradient
                            id='paint0_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint1_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint2_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint3_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint4_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint5_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint6_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint7_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint8_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint9_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint10_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint11_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint12_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint13_linear'
                            x1='-20.7223'
                            y1='1.8598'
                            x2='0.897414'
                            y2='48.1068'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                        <LinearGradient
                            id='paint14_linear'
                            x1='-5.82647'
                            y1='35.1709'
                            x2='-5.70782'
                            y2='38.1584'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop stopColor='#FC7901'/>
                            <Stop
                                offset='1'
                                stopColor='#B00E00'
                            />
                        </LinearGradient>
                    </Defs>
                </Svg>
            </View>
        );
    }
}

export default GMIconActive;

const styles = StyleSheet.create({
    container: {},
});
