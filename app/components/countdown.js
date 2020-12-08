/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AppState,
} from 'react-native';
import _ from 'lodash';
import {sprintf} from 'sprintf-js';
import AppText from './app_text';

const DEFAULT_DIGIT_STYLE = {backgroundColor: '#FAB913'};
const DEFAULT_DIGIT_TXT_STYLE = {color: '#000'};
const DEFAULT_TIME_LABEL_STYLE = {color: '#000'};
const DEFAULT_SEPARATOR_STYLE = {color: '#000'};
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
    d: 'Days',
    h: 'Hours',
    m: 'Minutes',
    s: 'Seconds',
};

class CountDown extends React.PureComponent {
  static propTypes = {
      id: PropTypes.string,
      timeLabelStyle: PropTypes.object,
      style: PropTypes.object,
      timeToShow: PropTypes.array,
      showSeparator: PropTypes.bool,
      size: PropTypes.number,
      until: PropTypes.number,
      onChange: PropTypes.func,
      onPress: PropTypes.func,
      onFinish: PropTypes.func,
      running: PropTypes.bool,
  };

  state = {
      until: Math.max(this.props.until, 0),
      lastUntil: null,
      wentBackgroundAt: null,
  };

  constructor(props) {
      super(props);
      this.timer = setInterval(this.updateTimer, 1000);
  }

  componentDidMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
      clearInterval(this.timer);
      AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
      if (this.props.until !== prevProps.until || this.props.id !== prevProps.id) {
          this.setState({
              lastUntil: this.state.until,
              until: Math.max(this.props.until, 0),
          });
      }
  }

  handleAppStateChange = (currentAppState) => {
      const {until, wentBackgroundAt} = this.state;
      if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
          const diff = (Date.now() - wentBackgroundAt) / 1000.0;
          this.setState({
              lastUntil: until,
              until: Math.max(0, until - diff),
          });
      }
      if (currentAppState === 'background') {
          this.setState({wentBackgroundAt: Date.now()});
      }
  }

  getTimeLeft = () => {
      const {until} = this.state;
      const {nextCountdown} = this.props;
      if (until === 0) {
          nextCountdown();
      }
      return {
          seconds: until % 60,
          minutes: parseInt(until / 60, 10) % 60,
          hours: parseInt(until / (60 * 60), 10) % 24,
          days: parseInt(until / (60 * 60 * 24), 10),
      };
  };

  updateTimer = () => {
      // Don't fetch these values here, because their value might be changed
      // in another thread
      // const {lastUntil, until} = this.state;
      // console.warn('a:', this.state);

      // if (this.state.lastUntil === this.state.until || !this.props.running) {
      //   return;
      // }
      if (this.state.until === 1 || (this.state.until === 0 && this.state.lastUntil !== 1)) {
          if (this.props.onFinish) {
              this.props.onFinish();
          }
          if (this.props.onChange) {
              this.props.onChange(this.state.until);
          }
      }

      if (this.state.until === 0) {
          this.setState({lastUntil: 0, until: 0});
      } else {
          if (this.props.onChange) {
              this.props.onChange(this.state.until);
          }
          this.setState({
              lastUntil: this.state.until,
              until: Math.max(0, this.state.until - 1),
          });
      }
  };

  renderDigit = (d) => {
      //   console.warn('d: ', d);

      // const {digitStyle, size} = this.props;
      return (
          <View
              style={
                  styles.digitCont

              // digitStyle,
              // {width: size * 2.3, height: size * 2.6},
              }
          >
              <AppText
                  fontText={'SF-Pro-Display-Regular'}
                  style={styles.digitTxt}
                  value={d}
              />

          </View>
      );
  };

  renderLabel = (label) => {
      const {timeLabelStyle, size} = this.props;
      if (label) {
          return (
              <Text
                  style={[
                      styles.timeTxt,
                      {fontSize: size / 1.8},
                      timeLabelStyle,
                  ]}
              >
                  {label}
              </Text>
          );
      }
  };

  renderDoubleDigits = (label, digits) => {
      return (
          <View style={styles.doubleDigitCont}>
              <View style={styles.timeInnerCont}>
                  {this.renderDigit(digits)}
              </View>
              {this.renderLabel(label)}
          </View>
      );
  };

  renderSeparator = () => {
      return (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.digitTxt}>
                  <AppText fontText={'SF-Pro-Display-Regular'}>
                      {':'}
                  </AppText>
              </Text>
          </View>
      );
  };

  renderCountDown = () => {
      const {timeToShow, timeLabels, showSeparator} = this.props;
      const {until} = this.state;
      const {days, hours, minutes, seconds} = this.getTimeLeft();
      const newTime = sprintf('%02d:%02d:%02d:%02d', days, hours, minutes, seconds).split(':');

      // console.warn(newTime);

      const Component = this.props.onPress ? TouchableOpacity : View;

      // console.warn('newTime: ', newTime);

      return (
          <Component
              style={styles.timeCont}
              onPress={this.props.onPress}
          >
              {timeToShow.includes('D') ? this.renderDoubleDigits(timeLabels.d, newTime[0]) : null}
              {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') ? this.renderSeparator() : null}
              {timeToShow.includes('H') ? this.renderDoubleDigits(timeLabels.h, newTime[1]) : null}
              {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') ? this.renderSeparator() : null}
              {timeToShow.includes('M') ? this.renderDoubleDigits(timeLabels.m, newTime[2]) : null}
              {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') ? this.renderSeparator() : null}
              {timeToShow.includes('S') ? this.renderDoubleDigits(timeLabels.s, newTime[3]) : null}
          </Component>
      );
  };

  render() {
      return (
          <View style={this.props.style}>
              {this.renderCountDown()}
          </View>
      );
  }
}

CountDown.defaultProps = {
    digitStyle: DEFAULT_DIGIT_STYLE,
    digitTxtStyle: DEFAULT_DIGIT_TXT_STYLE,
    timeLabelStyle: DEFAULT_TIME_LABEL_STYLE,
    timeLabels: DEFAULT_TIME_LABELS,
    separatorStyle: DEFAULT_SEPARATOR_STYLE,
    timeToShow: DEFAULT_TIME_TO_SHOW,
    showSeparator: false,
    until: 0,
    size: 15,
    running: true,
};

const styles = StyleSheet.create({
    timeCont: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timeTxt: {
        color: 'white',
        marginVertical: 2,
        backgroundColor: 'transparent',
    },
    timeInnerCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    digitCont: {
        borderRadius: 5,
        marginHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doubleDigitCont: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    digitTxt: {
        color: '#FF9500',
        fontSize: 42,

        // fontWeight: 'bold',

    // fontVariant: ['tabular-nums']
    },
    separatorTxt: {
        backgroundColor: 'transparent',

    // fontWeight: 'bold',
    },
});

export default CountDown;
export {CountDown};
