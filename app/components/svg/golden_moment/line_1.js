/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, Dimensions} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {moderateScale} from '../../../utils/scaling';

const deviceWidth = Dimensions.get('window').width;
const lineWidth = (deviceWidth - 32).toString();
const lineHeight = ((deviceWidth - 32) * 84) / 335;

class Line1 extends React.PureComponent {
    render() {
        return (
            <View style={{position: 'absolute', marginLeft: 18}}>
                <Svg
                    width={lineWidth}
                    height={lineHeight}
                    viewBox='0 0 335 84'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <Path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M167.144 1.05367L167.139 0.00139299C133.769 0.120109 100.969 7.82482 71.7599 22.4057C42.5512 36.9866 17.8734 57.9747 0 83.4364L0.983488 84C18.7522 58.6874 43.2855 37.8222 72.3232 23.3268C101.361 8.83127 133.969 1.17169 167.144 1.05367Z'
                        fill='#FC7901'
                    />
                </Svg>
            </View>
        );
    }
}

export default Line1;
