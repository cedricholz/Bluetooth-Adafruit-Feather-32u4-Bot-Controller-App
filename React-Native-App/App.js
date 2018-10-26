/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import JoystickComponent from "./src/components/JoystickComponent";
import {arrowImages} from "./src/constants";
import LandscapeView from 'react-native-landscape-view';

export default class App extends React.Component {

    setRightDrivingState = (newState) => {
        this.setState({
            rightDrivingState: newState,
        })
    };
    setLeftDrivingState = (newState) => {
        this.setState({
            leftDrivingState: newState,
        })
    };

    getArrowDirection = (leftDrivingState, rightDrivingState) =>{

        if (leftDrivingState === 'D'){

            if(rightDrivingState === 'D'){
                return 'up';
            }

            else if(rightDrivingState === 'N'){
                return 'right';
            }

            else if(rightDrivingState === 'R'){
                return 'doubleRight'
            }

        }

        else if(leftDrivingState === 'N'){

            if(rightDrivingState === 'D'){
                return 'left';
            }

            else if(rightDrivingState === 'N'){
                return 'defaultImage';
            }

            else if(rightDrivingState === 'R'){
                return 'right';
            }

        }

        else if(leftDrivingState === 'R'){

            if(rightDrivingState === 'D'){
                return 'doubleLeft';
            }

            else if(rightDrivingState === 'N'){
                return 'left';
            }

            else if(rightDrivingState === 'R'){
                return 'down';
            }

        }

        return 'defaultImage';

    };

    constructor(props) {
        super(props);
        this.state = {rightDrivingState: 'N', leftDrivingState: 'N'}
    }

    componentDidMount(){

    }


    render() {
        const {leftDrivingState, rightDrivingState} = this.state;

        let arrowDirection = this.getArrowDirection(leftDrivingState, rightDrivingState);

        // arrowDirection = 'up';

        return (
            <View>
                {/*<View style={styles.rightModeContainer}>*/}
                    {/*<Text style={styles.modeText}> {rightDrivingState} </Text>*/}
                {/*</View>*/}
                {/*<View style={styles.leftModeContainer}>*/}
                    {/*<Text style={styles.modeText}> {leftDrivingState} </Text>*/}
                {/*</View>*/}

                {arrowDirection !== '' && <View style={styles.arrowImage}>
                    {arrowImages[arrowDirection]}
                </View>}

                <JoystickComponent
                    rightDrivingState={rightDrivingState}
                    setRightDrivingState={this.setRightDrivingState}
                    leftDrivingState={leftDrivingState}
                    setLeftDrivingState={this.setLeftDrivingState}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rightModeContainer: {
        position: 'absolute',
        right: 10,
    },
    leftModeContainer: {
        position: 'absolute',
        left: 10,
    },

    arrowImage: {
        position: 'absolute',
        top: 290,
        left: 300,
        right: 0,
        bottom: 0,
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    modeText: {
        fontSize: 50,
        color: '#3A5199',
    }

});
