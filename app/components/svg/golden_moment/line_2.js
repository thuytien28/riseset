/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {Dimensions} from 'react-native';

import {Svg, Path} from 'react-native-svg';

const deviceWidth = Dimensions.get('window').width;
const lineWidth = deviceWidth - 32;
const lineHeight = ((deviceWidth - 32) * 84) / 335;

class Line2 extends React.PureComponent {
    render() {
        return (
            <Svg
                width={lineWidth}
                height={lineHeight}
                viewBox='0 0 335 84'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <Path
                    d='M334.021 82.8152L335 82.2446C317.29 57.4492 293.099 36.9856 264.575 22.6514V23.8566C292.686 38.0925 316.532 58.3292 334.021 82.8152Z'
                    fill='#C4C4C4'
                />
                <Path
                    d='M262.71 21.7264C233.375 7.35377 200.509 -0.117323 167.139 0.00139299C133.769 0.120109 100.969 7.82482 71.7599 22.4057C42.5512 36.9866 17.8734 57.9747 0 83.4364L0.983488 84C18.7522 58.6874 43.2855 37.8222 72.3232 23.3268C101.361 8.83127 133.969 1.17169 167.144 1.05367C200.318 0.935648 232.992 8.36299 262.155 22.6514C262.965 23.0482 263.772 23.45 264.575 23.8566V22.6514C263.955 22.3402 263.334 22.0318 262.71 21.7264Z'
                    fill='#C4C4C4'
                />
            </Svg>

        );
    }
}

export default Line2;
