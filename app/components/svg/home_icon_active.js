/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';

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

class HomeIcon extends React.PureComponent {
    render() {
        return (
            <Svg
                width='37'
                height='38'
                viewBox='0 0 37 38'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <Rect
                    x='8'
                    y='36.5'
                    width='20'
                    height='1.5'
                    rx='0.75'
                    fill='url(#paint0_linear)'
                />
                <Path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M19.9384 5.15143C18.9892 4.36036 17.6103 4.36036 16.661 5.15143L7.47917 12.8029C6.89556 13.2893 6.55813 14.0097 6.55813 14.7694V30.3171C6.55813 30.8089 6.95675 31.2075 7.44848 31.2075H12.4567C12.9485 31.2075 13.3471 30.8089 13.3471 30.3171V23.2221C13.3471 21.8698 14.4433 20.7736 15.7956 20.7736H20.8038C22.1561 20.7736 23.2523 21.8698 23.2523 23.2221V30.3171C23.2523 30.8089 23.651 31.2075 24.1427 31.2075H29.1509C29.6427 31.2075 30.0413 30.8089 30.0413 30.3171V14.7694C30.0413 14.0097 29.7039 13.2893 29.1203 12.8029L19.9384 5.15143ZM15.6635 3.95444C17.1906 2.68185 19.4088 2.68185 20.9359 3.95444L30.1177 11.606C31.0566 12.3883 31.5994 13.5473 31.5994 14.7694V30.3171C31.5994 31.6694 30.5032 32.7656 29.1509 32.7656H24.1427C22.7904 32.7656 21.6942 31.6694 21.6942 30.3171V23.2221C21.6942 22.7304 21.2956 22.3317 20.8038 22.3317H15.7956C15.3039 22.3317 14.9052 22.7304 14.9052 23.2221V30.3171C14.9052 31.6694 13.809 32.7656 12.4567 32.7656H7.44848C6.09622 32.7656 5 31.6694 5 30.3171V14.7694C5 13.5473 5.54283 12.3883 6.48169 11.606L15.6635 3.95444Z'
                    fill='url(#paint1_linear)'
                />
                <Defs>
                    <LinearGradient
                        id='paint0_linear'
                        x1='-6.82646'
                        y1='36.5457'
                        x2='-6.70781'
                        y2='39.5331'
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
                        x1='-14.7188'
                        y1='3.90591'
                        x2='11.3217'
                        y2='47.8517'
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
        );
    }
}

export default HomeIcon;
