import React from 'React';
import {JoystickDemuxed, TouchEventDemuxer} from 'joystick-component-lib';
import {StyleSheet} from 'react-native';

const componentArray = [JoystickDemuxed, JoystickDemuxed];
let DoubleJoystick = TouchEventDemuxer(componentArray);


export default class JoystickComponent extends React.Component {

    leftStickChangedHandler = (xProp, yProp) => {

        const { leftDrivingState, leftDrivingSpeed } = this.props;
        // console.log(`First joystick: ${xProp}, ${yProp} State ${leftDrivingState}`);

        this.stickChangedHandler(xProp, yProp, leftDrivingState, leftDrivingSpeed, 'L')

    };

    stickChangedHandler = (xProp, yProp, drivingState, drivingSpeed, leftOrRight) =>{

        const {setDrivingState, setDrivingSpeed} = this.props;

        let s = xProp.toString();

        let newDrivingSpeed = '0';

        let negativeModifier = 0;

        if (s.charAt(0) === '-') {
            negativeModifier = 1
        }

        if (s.charAt(negativeModifier) === '1') {
            newDrivingSpeed = 'M';
        }

        else if (s === '0'){
            newDrivingSpeed = '0';
        }

        else{
            newDrivingSpeed = s.charAt(negativeModifier + 2);
        }

        let positiveNegative = 'P';
        if (s.charAt(0) === '-'){
            positiveNegative = 'N';
        }

        if (newDrivingSpeed !== drivingSpeed) {
            setDrivingSpeed(newDrivingSpeed, positiveNegative, leftOrRight);
        }

        if (drivingState === 'N') {
            // Reverse
            if (xProp === 1) {
                setDrivingState('D', leftOrRight)
            }

            // Drive
            else if (xProp === -1) {
                setDrivingState('R', leftOrRight)
            }
        }
        else {
            if (xProp !== -1 && xProp !== 1) {
                setDrivingState('N', leftOrRight)
            }
        }
    };


    rightStickChangedHandler = (xProp, yProp) => {
        const {rightDrivingState, rightDrivingSpeed} = this.props;

        // console.log(`Second joystick: ${xProp}, ${yProp} State ${rightDrivingState}`);

        this.stickChangedHandler(xProp, yProp, rightDrivingState, rightDrivingSpeed, 'R')

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
