/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Dimensions} from 'react-native';
import {Svg, Circle} from 'react-native-svg';
import {moderateScale} from '../../../utils/scaling';

const deviceWidth = Dimensions.get('window').width;

class Line1 extends React.PureComponent {
    render() {
        return (
            <View style={{position: 'absolute', marginLeft: deviceWidth / 2, top: -17 / 2}}>
                <Svg
                    width='17'
                    height='17'
                    viewBox='0 0 17 17'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <Circle
                        cx='8.5'
                        cy='8.5'
                        r='8.5'
                        fill='#FC7901'
                    />
                </Svg>
            </View>
        );
    }
}

export default Line1;
