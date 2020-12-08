/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';

import {
    Svg,
    Path,
} from 'react-native-svg';

class Fog extends React.PureComponent {
    render() {
        return (
            <Svg
                version='1.1'
                id='Layer_1'
                xmlns='http://www.w3.org/2000/svg'

                // xmlns:xlink='http://www.w3.org/1999/xlink'
                x='0px'
                y='0px'
                width='100px'
                height='100px'
                viewBox='0 0 100 100'
                enable-background='new 0 0 100 100'

                // xml:space='preserve'
            >
                <Path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M69.998,65.641H30.003c-1.104,0-2-0.896-2-2c0-1.105,0.896-2,2-2h39.995
           c1.104,0,2,0.895,2,2C71.998,64.744,71.103,65.641,69.998,65.641z M69.998,57.641H30.003c-1.104,0-2-0.895-2-2c0-1.104,0.896-2,2-2
           h39.995c1.104,0,2,0.896,2,2C71.998,56.746,71.103,57.641,69.998,57.641z M59.999,45.643c-1.601,0-3.083,0.48-4.333,1.291
           c-1.232-5.317-5.974-9.291-11.665-9.291c-6.626,0-11.998,5.373-11.998,12h-4c0-8.835,7.163-15.999,15.998-15.999
           c6.004,0,11.229,3.312,13.965,8.204c0.664-0.113,1.337-0.205,2.033-0.205c5.222,0,9.652,3.342,11.301,8h-4.381
           C65.535,47.253,62.958,45.643,59.999,45.643z M30.003,69.639h39.995c1.104,0,2,0.896,2,2c0,1.105-0.896,2-2,2H30.003
           c-1.104,0-2-0.895-2-2C28.003,70.535,28.898,69.639,30.003,69.639z'
                />

            </Svg>
        );
    }
}

export default Fog;
