/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    Keyboard,
} from 'react-native';

import PropTypes from 'prop-types';

import Note from './note';
import HeaderRight from 'app/components/common/header_right';
import AppText from 'app/components/app_text';
import {loadInterstitialAd} from 'app/firebase/admob';
import RatingRequestor from 'app/components/app_store_review';
import LoadingHolder from 'app/utils/loading_holder';
import UploadingHolder from 'app/utils/uploading_holder';
import InterstitialFbAds from 'app/firebase/facebookads/interstitialAds';
import ModalLogin from 'app/components/modal_login';

class YourStory extends React.PureComponent {
    static navigationOptions = ({screenProps, navigation}) => {
        const {intl} = screenProps;
        const {params} = navigation.state;

        // const title = intl.formatMessage({id: 'screenHeader.title.yourStory', defaultMessage: 'Note'});
        const headerTitle = (
            <AppText
                fontText={'SF-Pro-Display-Medium'}
                style={{fontSize: 17, fontWeight: '500'}}
                value={intl.formatMessage({id: 'screenHeader.title.yourStory', defaultMessage: 'Note'})}
            />
        );
        const headerRight = (
            <HeaderRight
                id='done'
                defaultMessage='Done'
                onPress={params && params.onRight}
                loading={true}
            />

        );
        return {

            // title,
            headerTitle,
            headerRight,
        };
    }

    constructor(props) {
        super(props);
        const {params} = props.navigation.state;
        this.state = {
            note: (params && params.isUpdateNote) ? params.story.note : '',
            modalVisible: false,
        };
    }

    componentDidMount() {
        const {navigation, user} = this.props;
        const {params} = navigation.state;

        // set Done or update function
        navigation.setParams({
            onRight: (params && params.isUpdateNote) ? this.onUpdateNote : this.onPost,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.newStory.uploading !== this.props.newStory.uploading &&
            this.props.newStory.uploading === false
        ) {
            UploadingHolder.stop();
            this.props.navigation.popToTop();
            this.props.navigation.goBack(null);

            // rating app
            this.handleStoreReviewDisplay();
        }
        if (prevProps.editStory.loading !== this.props.editStory.loading &&
            this.props.editStory.loading === false
        ) {
            LoadingHolder.stop();
            this.props.navigation.goBack();
        }
    }

    setModalVisible(visible) {
        const {user} = this.props;
        this.setState({modalVisible: visible}, () => {
            // if (!visible && user.isLogin) {
            this.postStory();

            // }
        });
    }

    afterReviewDisplay = (showed, uAction) => {
        if (!showed) {
            // ADMOD
            // loadInterstitialAd();
            return (
                <InterstitialFbAds/>
            );
        }
    }

    handleStoreReviewDisplay = async () => {
        const {intl} = this.props.screenProps;
        const RatingTracker = new RatingRequestor(intl);
        await RatingTracker.handlePositiveEvent(this.afterReviewDisplay);
    }

    postStory = () => {
        const {note} = this.state;
        const {actions, navigation, user} = this.props;
        const {
            isRiseSet,
            time,
            signature,
            signatureFont,
            imageTaken,
            location,
            effectName,
        } = navigation.state.params;

        const story = {
            uid: user.info.id,
            isRiseSet,
            time,
            signature: signature ? signature.trim() : '',
            signatureFont,
            note: note ? note.trim() : '',
            images: imageTaken,
            location,
        };

        if (effectName) {
            story.effectName = effectName;
        }
        actions.completeAddStory(story);
    }

    onPost = async () => {
        Keyboard.dismiss();
        const {user} = this.props;
        if (!user.isLogin) {
            this.setState({
                modalVisible: true,
            });
        } else {
            this.postStory();
        }

    }

    onUpdateNote = () => {
        Keyboard.dismiss();
        const {actions, navigation} = this.props;
        let note = this.state.note;
        const {id} = navigation.state.params.story;
        if (note) {
            note = note.trim();
        }
        actions.updateStory(id, note);
    }

    onChangeNote = (text) => {
        this.setState({
            note: text,
        });
    }

    renderLoading = () => {
        const {uploading, bytesTransferred, totalBytes} = this.props.newStory;
        const {loading: updating} = this.props.editStory;

        if (uploading) {
            UploadingHolder.start(bytesTransferred, totalBytes);
        } else if (updating) {
            LoadingHolder.start();
        }
    }

    render() {
        const {screenProps, navigation} = this.props;
        const {note} = this.state;
        const {intl} = screenProps;

        return (
            <SafeAreaView style={styles.container}>
                <Note
                    note={note}
                    onChangeNote={this.onChangeNote.bind(this)}
                    value={this.state.note}
                    intl={intl}
                />
                {this.renderLoading()}
                <ModalLogin
                    intl={screenProps.intl}
                    navigation={navigation}
                    modalVisible={this.state.modalVisible}
                    setModalVisible={(visible) => this.setModalVisible(visible)}
                />
            </SafeAreaView>
        );
    }
}

YourStory.propTypes = {
    actions: PropTypes.object,
    navigation: PropTypes.object,
    user: PropTypes.object,
    newStory: PropTypes.object,
    screenProps: PropTypes.object,
    editStory: PropTypes.object,
};

export default YourStory;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});
