import {Image, View} from "react-native";
import React from "react";

import base64 from 'react-native-base64'

export const arrowImages = {};

const height = 110;
const width= 110;

const onDot = (<Image  style={{height:40, width:40}}
                     source={require(`./assets/onDot.png`)}
/>);

const offDot = (<Image  style={{height:40, width:40}}
                     source={require(`./assets/offDot.png`)}
/>);

const left = (<Image  style={{height:height, width:width}}
                      source={require(`./assets/left.png`)}
/>);

const doubleLeft = (<Image  style={{height:height, width:width}}
                            source={require(`./assets/doubleLeft.png`)}
/>);

const up = (<Image  style={{height:height, width:width}}
                    source={require(`./assets/up.png`)}
/>);

const right = (<Image  style={{height:height, width:width}}
                       source={require(`./assets/right.png`)}
/>);
const doubleRight = (<Image  style={{height:height, width:width}}
                             source={require(`./assets/doubleRight.png`)}
/>);

const down = (<Image  style={{height:height, width:width}}
                      source={require(`./assets/down.png`)}
/>);



const defaultImage = (<Image  style={{height:80, width:80}}
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


// LeftOrRight + PositiveNegative + Speed
// Negative is 0, Positive is 1
// M is 10, for maximum
export const base64Values = {};
const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'M'];

for (let leftRight of ['L', 'R']){
    for(let negPos of [0, 1]){
        for (let n of nums){
            base64Values[leftRight + negPos + n] = base64.encode(leftRight + negPos + n)
        }
    }

    base64Values['L00'] = base64.encode('L00');
    base64Values['R00'] = base64.encode('R00');
}


