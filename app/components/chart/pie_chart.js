/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {Svg} from 'react-native-svg';

class ChartPie extends React.PureComponent {
    render() {
        return (
            <Svg/>
        );
    }
}

export default ChartPie;

const data = [
    {

        name: '',
        population: 80,
        color: '#E53D01',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },

    {

        name: '',
        population: 20,
        color: '#FFF',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    },
];

const chartConfig = {
    backgroundColor: 'pink',
    backgroundGradientFrom: 'pink',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
};

