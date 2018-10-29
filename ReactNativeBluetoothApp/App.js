/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View, Button} from 'react-native';
import {BleManager} from "react-native-ble-plx";
import {arrowImages} from "./src/constants";
import JoystickComponent from "./src/components/JoystickComponent";
import {getArrowDirection} from "./src/utils";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

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

    writeData = () => {
        const {deviceInfo} = this.state;
        this.manager.writeCharacteristicWithoutResponseForDevice(
            deviceInfo.deviceID,
            deviceInfo.serviceUUID,
            deviceInfo.uuid,
            'QQ==')
            .then((data) => {
                console.log("WROTE THE DATA", data.value)
            })
    }

    constructor(props) {
        super(props);
        this.manager = new BleManager();
        this.state = {deviceInfo: {}, rightDrivingState: 'N', leftDrivingState: 'N'}
    }

    async componentWillMount() {
        await requestLocationPermission();
    }


    componentDidMount() {


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
                        console.log("GOT THE TANK BOT");

                        this.manager.stopDeviceScan();

                        device.connect()
                            .then((device) => {
                                return device.discoverAllServicesAndCharacteristics();
                            })
                            .then((device) => {
                                device.services()
                                    .then((services) => {
                                        let service_idx = 2;
                                        // console.log("SERVICEESS", services[0])
                                        console.log("GOT THE SERVICES")
                                        return device.characteristicsForService(services[4].uuid)
                                    })
                                    .then((characteristics) => {

                                        console.log("GOT THE CHARACTERISTICS")

                                        for (let i in characteristics) {

                                            if (characteristics[i].isWritableWithoutResponse === true) {

                                                console.log("THERESHEBLOWS")

                                                this.setState({deviceInfo: characteristics[i]})

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
        const {deviceInfo, leftDrivingState, rightDrivingState} = this.state;

        const connecting = Object.keys(deviceInfo).length === 0;

        let arrowDirection = getArrowDirection(leftDrivingState, rightDrivingState);

        return (
            <View>
                {arrowDirection !== '' && <View style={styles.arrowImage}>
                    {arrowImages[arrowDirection]}
                </View>}

                <JoystickComponent
                    rightDrivingState={rightDrivingState}
                    setRightDrivingState={this.setRightDrivingState}
                    leftDrivingState={leftDrivingState}
                    setLeftDrivingState={this.setLeftDrivingState}
                />
                {!connecting && <Button title={'Send'} onPress={() => this.writeData()}/>}
            </View>

    )
        ;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    arrowImage: {
        position: 'absolute',
        top: 290,
        left: 300,
        right: 0,
        bottom: 0,
    },
});
