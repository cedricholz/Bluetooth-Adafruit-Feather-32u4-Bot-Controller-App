/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import {BleManager} from "react-native-ble-plx";
import {arrowImages, base64Values} from "./src/constants";
import JoystickComponent from "./src/components/JoystickComponent";
import {getArrowDirection} from "./src/utils";
import base64 from 'react-native-base64'

type Props = {};

export async function requestLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                'title': 'BlueTooth Controller',
                'message': 'Location permissions are required to access BlueTooth capabilities.'
            }
        );
    } catch (err) {
        console.warn(err)
    }
}


export default class App extends Component<Props> {


    setDrivingState = (newState, leftOrRight) => {
        if (leftOrRight === 'L') {
            this.setState({
                leftDrivingState: newState,
            })
        }
        else {
            this.setState({
                rightDrivingState: newState,
            })
        }
    };

    setDrivingSpeed = (newSpeed, positiveNegative, leftOrRight) => {
        if (leftOrRight === 'L') {

            this.leftDrivingspeed = newSpeed;

        }

        else {
            this.rightDrivingSpeed = newSpeed;
        }

        this.writeData(newSpeed, positiveNegative, leftOrRight)
    };


    writeData = (newSpeed, positiveNegative, leftOrRight) => {

        const {connected} = this.state;

        if (connected) {

            let command = '';

            if (newSpeed === '0') {
                command = '00';
            }
            else if (positiveNegative === 'P') {
                command = '1' + newSpeed;
            }

            else {
                command = '0' + newSpeed;
            }

            if (leftOrRight === 'L') {
                this.leftCommand = command;
            }
            else {
                this.rightCommand = command;
            }


        }
    };


    constructor(props) {
        super(props);
        this.manager = new BleManager();

        this.leftDrivingspeed = '0';
        this.rightDrivingSpeed = '0';

        this.leftCommand = '';
        this.rightCommand = '';


        this.state = {
            deviceInfo: {},
            rightDrivingState: 'N',
            leftDrivingState: 'N',
            connected: false,
        }
    }

    async componentWillMount() {
        await requestLocationPermission();
    }

    componentWillUnmount() {
        const {intervalId} = this.state;
        clearInterval(intervalId);
    }

    timer = () => {
        const {deviceInfo} = this.state;

        let fullCommand = '';
        if (this.leftCommand) {
            if (this.rightCommand) {
                fullCommand = this.leftCommand + this.rightCommand;
            }
            else {
                fullCommand = this.leftCommand + 'XX'
            }
        }
        else if (this.rightCommand) {
            fullCommand = 'XX' + this.rightCommand;
        }

        if (fullCommand) {

            const base64Command = base64.encode(fullCommand);

            console.log(base64Command);

            this.manager.writeCharacteristicWithoutResponseForDevice(
                deviceInfo.deviceID,
                deviceInfo.serviceUUID,
                deviceInfo.uuid,
                base64Command)
                .then((data) => {
                    console.log("Data Sent Successfully", data.value);
                })
                .catch((error) => {
                    console.log("ERROR", error);
                });

            this.leftCommand = '';
            this.rightCommand = ''
        }


    };

    componentDidMount() {

        this.intervalId = setInterval(this.timer.bind(this), 500);

        this.manager.onStateChange(newState => {
            if (newState !== "PoweredOn") return;
            console.log("Started scanning...");
            this.manager.startDeviceScan(
                null,
                {
                    allowDuplicates: true
                },
                (error, device) => {
                    if (error) {
                        console.log("SCAN ERROR", error);
                        return;
                    }
                    console.log("Device: " + device.name);
                    if (device.name === 'TankBot') {
                        this.manager.stopDeviceScan();

                        device.connect()
                            .then((device) => {
                                return device.discoverAllServicesAndCharacteristics();
                            })
                            .then((device) => {
                                device.services()
                                    .then((services) => {
                                        return device.characteristicsForService(services[4].uuid)
                                    })
                                    .then((characteristics) => {

                                        for (let i in characteristics) {

                                            if (characteristics[i].isWritableWithoutResponse === true) {

                                                console.log("CONNECTED")

                                                this.setState({deviceInfo: characteristics[i], connected: true})

                                            }
                                        }
                                    })
                            })
                            .catch((error) => {
                                // Handle errors
                                console.log("Error", error)
                            });
                    }
                }
            );
        }, true);
    }

    render() {
        const {
            deviceInfo,
            leftDrivingState,
            rightDrivingState,
            connected
        } = this.state;

        // const connecting = Object.keys(deviceInfo).length === 0;

        let arrowDirection = getArrowDirection(leftDrivingState, rightDrivingState);

        return (
            <View>
                {<View style={styles.dot}>
                    {!connected ? arrowImages['offDot'] : arrowImages['onDot']}
                </View>}

                {arrowDirection !== '' && <View style={styles.arrowImage}>
                    {arrowImages[arrowDirection]}
                </View>}

                <JoystickComponent
                    leftDrivingState={leftDrivingState}
                    rightDrivingState={rightDrivingState}
                    setDrivingState={this.setDrivingState}

                    leftDrivingSpeed={this.leftDrivingspeed}
                    rightDrivingSpeed={this.rightDrivingSpeed}
                    setDrivingSpeed={this.setDrivingSpeed}
                />
                {/*{!connecting && <Button title={'Send'} onPress={() => this.writeData()}/>}*/}
            </View>

        )
            ;
    }
}


const styles = StyleSheet.create({
    dot: {
        position: 'absolute',
        right: 10,
        top: 10
    },

    arrowImage: {
        position: 'absolute',
        top: 290,
        left: 300,
        right: 0,
        bottom: 0,
    },
});
