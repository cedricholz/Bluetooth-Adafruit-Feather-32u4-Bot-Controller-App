import {Image} from "react-native";
import React from "react";

export const arrowImages = {};

const height = 110;
const width = 110;

const onDot = (<Image style={{height: 40, width: 40}}
                      source={require(`./assets/onDot.png`)}
/>);

const offDot = (<Image style={{height: 40, width: 40}}
                       source={require(`./assets/offDot.png`)}
/>);

const left = (<Image style={{height: height, width: width}}
                     source={require(`./assets/left.png`)}
/>);

const doubleLeft = (<Image style={{height: height, width: width}}
                           source={require(`./assets/doubleLeft.png`)}
/>);

const up = (<Image style={{height: height, width: width}}
                   source={require(`./assets/up.png`)}
/>);

const right = (<Image style={{height: height, width: width}}
                      source={require(`./assets/right.png`)}
/>);
const doubleRight = (<Image style={{height: height, width: width}}
                            source={require(`./assets/doubleRight.png`)}
/>);

const down = (<Image style={{height: height, width: width}}
                     source={require(`./assets/down.png`)}
/>);


const defaultImage = (<Image style={{height: 80, width: 80}}
                             source={require(`./assets/default.png`)}
/>);


arrowImages['onDot'] = onDot;
arrowImages['offDot'] = offDot;
arrowImages['left'] = left;
arrowImages['doubleLeft'] = doubleLeft;
arrowImages['right'] = right;
arrowImages['doubleRight'] = doubleRight;
arrowImages['up'] = up;
arrowImages['down'] = down;
arrowImages['defaultImage'] = defaultImage;

