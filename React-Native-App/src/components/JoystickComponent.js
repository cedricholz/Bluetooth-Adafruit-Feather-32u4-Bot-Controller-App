import React from 'React';
import { TouchEventDemuxer, JoystickDemuxed } from 'joystick-component-lib';
import {Platform, StyleSheet, Text, View} from 'react-native';

const componentArray = [JoystickDemuxed, JoystickDemuxed];
let DoubleJoystick = TouchEventDemuxer(componentArray);


export default class JoystickComponent extends React.Component {

    leftStickChangedHandler = (xProp, yProp) => {

        const {leftDrivingState, setLeftDrivingState} = this.props;
        console.log(`First joystick: ${xProp}, ${yProp} State ${leftDrivingState}`);

        if (leftDrivingState === 'N'){
            // Reverse
            if (xProp === 1){
                setLeftDrivingState('D')
            }

            // Drive
            else if (xProp === -1){
                setLeftDrivingState('R')
            }
        }
        else{
            if (xProp !==  -1 && xProp !== 1){
                setLeftDrivingState('N')
            }
        }

    };


    rightStickChangedHandler = (xProp, yProp) => {
        const {rightDrivingState, setRightDrivingState} = this.props;

        console.log(`Second joystick: ${xProp}, ${yProp} State ${rightDrivingState}`);

        if (rightDrivingState === 'N'){
            // Reverse
            if (xProp === 1){
                setRightDrivingState('D')
            }

            // Drive
            else if (xProp === -1){
                setRightDrivingState('R')
            }
        }
        else{
            if (xProp !==  -1 && xProp !== 1){
                setRightDrivingState('N')
            }
        }

    };


    render() {

        return (
            <DoubleJoystick
                childrenProps={[
                    {
                        neutralPointX: 150,
                        neutralPointY: 110,
                        length: 70,
                        shape: 'horizontal',
                        isSticky: true,
                        onJoystickMove: this.leftStickChangedHandler,
                        draggableStyle: styles.draggableStyle,
                        backgroundStyle: styles.backgroundStyle,
                    },
                    {
                        neutralPointX: 150,
                        neutralPointY: 550,
                        length: 70,
                        shape: 'horizontal',
                        isSticky: true,
                        onJoystickMove: this.rightStickChangedHandler,
                        draggableStyle: styles.draggableStyle,
                        backgroundStyle: styles.backgroundStyle,
                    },
                ]}
            />
        );
    }
}

// const borderColor = '#3A5199';
const borderColor = '#D5D6D2';
const ballColor = '#2F2E33';

const styles = StyleSheet.create({
    draggableStyle: {
        height: 55,
        width: 55,
        backgroundColor: ballColor,
    },
    backgroundStyle: {
        backgroundColor: '#FFFFFF',
        borderColor: borderColor,
        borderWidth: 3,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    circularBackgroundStyle: {
        backgroundColor: '#FFFFFF',
        borderColor: borderColor,
        borderWidth: 3,
    },
});
