/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Dimensions} from 'react-native';
import {Svg, Ellipse, LinearGradient, Defs, Stop} from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

class BackgroundHeader extends React.PureComponent {
    render() {
        return (
            <View>
                <Svg
                    width={SCREEN_WIDTH}
                    height='131'
                    viewBox='0 0 375 131'
                    fill='none'
                    xmlns='http://www.w3.org/2000/Svg'
                >
                    <Ellipse
                        cx='150.5'
                        cy='-12.5'
                        rx='237.5'
                        ry='143.5'
                        fill='#e8531e'
                    />
                    <Defs>
                        <LinearGradient
                            id='paint0_linear'
                            x1='-4.5'
                            y1='-58.5'
                            x2='163.221'
                            y2='505.89'
                            gradientUnits='userSpaceOnUse'
                        >
                            <Stop Stop-color='#FC7901'/>
                            <Stop
                                offset='1'
                                Stop-color='#B00E00'
                            />
                        </LinearGradient>
                    </Defs>
                </Svg>

            </View>
        );
    }
}

export default BackgroundHeader;
