/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/

import React from 'react';
import {View, StyleSheet} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

import {getMe} from 'app/actions/user';

class AuthLoading extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        isLogin: PropTypes.bool,
        navigation: PropTypes.object,
    };
    componentDidMount() {
        this.animation.play();
    }

    bootstrapAsync = async () => {
        const {isLogin, navigation, actions} = this.props;

        let screen = 'Login';
        if (isLogin) {
            await actions.getMe();
            screen = 'AppMain';
        }

        navigation.navigate(screen);
    };

    render() {
        const hour = new Date().getHours();
        let riseset = '';
        if (hour >= 5 && hour < 12) {
            riseset = 'sunrise';
        } else if (hour >= 12 && hour < 17) {
            riseset = 'afternoon';
        } else {
            riseset = 'sunset';
        }

        let source = require('assets/animation/sunset.json');
        if (riseset === 'sunrise') {
            source = require('assets/animation/sunrise.json');
        } else if (riseset === 'afternoon') {
            source = require('assets/animation/afternoon.json');
        }

        const Content = (
            <LottieView
                ref={(animation) => {
                    this.animation = animation;
                }}
                loop={false}
                source={source}
                onAnimationFinish={this.bootstrapAsync}
            />
        );

        return (
            <View style={styles.container}>
                {Content}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLogin: state.user.isLogin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            getMe,
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthLoading);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});
