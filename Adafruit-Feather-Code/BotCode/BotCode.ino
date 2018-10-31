#include <Arduino.h>
#include <Adafruit_BLE.h>
#include <Adafruit_BluefruitLE_SPI.h>

#include "BluefruitConfig.h"

#include <Adafruit_MotorShield.h>

#include <Wire.h>

Adafruit_MotorShield AFMS = Adafruit_MotorShield();

Adafruit_DCMotor *L_MOTOR = AFMS.getMotor(4);
Adafruit_DCMotor *R_MOTOR = AFMS.getMotor(2);

String BROADCAST_NAME = "TankBot";

String BROADCAST_CMD = String("AT+GAPDEVNAME=" + BROADCAST_NAME);

Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

// function prototypes over in packetparser.cpp
uint8_t readPacket(Adafruit_BLE *ble, uint16_t timeout);
float parsefloat(uint8_t *buffer);
void printHex(const uint8_t * data, const uint32_t numBytes);

// the packet buffer
extern uint8_t packetbuffer[];

char buf[60];


/**************************************************************************/
/*!
    @brief  Sets up the HW and the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/
void setup(void) {
  Serial.begin(9600);

  AFMS.begin();  // create with the default frequency 1.6KHz

  // turn on motors
  L_MOTOR->setSpeed(0);
  L_MOTOR->run(RELEASE);

  R_MOTOR->setSpeed(0);
  R_MOTOR->run(RELEASE);

  Serial.begin(115200);
  Serial.println(F("Adafruit Bluefruit Robot Controller Example"));
  Serial.println(F("-----------------------------------------"));

  /* Initialize the module */
  BLEsetup();

}

void loop(void)
{
  uint8_t len = readPacket(&ble, BLE_READPACKET_TIMEOUT);

  readController();
}

long calculatedSpeed(float spd) {
  if (spd == 29){
    spd = 10;
  }
  return (spd / 10) * 255;
}

bool isMoving = false;
unsigned long lastPress = 0;

bool readController() {

  uint8_t maxspeed;

  if (packetbuffer[0]) {

    int leftDirection = packetbuffer[0] - 48;
    int leftSpeed = packetbuffer[1] - 48;
    int rightDirection = packetbuffer[2] - 48;
    int rightSpeed = packetbuffer[3] - 48;

    if (leftDirection != 40){
        leftSpeed = calculatedSpeed(leftSpeed);
        if (leftSpeed == 0) {
          L_MOTOR->run(RELEASE);
        }
        else {
          L_MOTOR->setSpeed(leftSpeed);
          if (leftDirection == 0) {
            L_MOTOR->run(FORWARD);
          }
          else {
            L_MOTOR->run(BACKWARD);
          }
        }
    }

    if(rightDirection != 40){
        rightSpeed = calculatedSpeed(rightSpeed);
        if (rightSpeed == 0) {
          R_MOTOR->run(RELEASE);
        }
        else {
          R_MOTOR->setSpeed(rightSpeed);
          if (rightDirection == 0) {
            R_MOTOR->run(FORWARD);
          }
          else {
            R_MOTOR->run(BACKWARD);
          }
        }
    }
   
  }
}

void BLEsetup() {
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  /* Perform a factory reset to make sure everything is in a known state */
  Serial.println(F("Performing a factory reset: "));
  if (! ble.factoryReset() ) {
    error(F("Couldn't factory reset"));
  }

  //Convert the name change command to a char array
  BROADCAST_CMD.toCharArray(buf, 60);

  //Change the broadcast device name here!
  if (ble.sendCommandCheckOK(buf)) {
    Serial.println("name changed");
  }
  delay(250);

  //reset to take effect
  if (ble.sendCommandCheckOK("ATZ")) {
    Serial.println("resetting");
  }
  delay(250);

  //Confirm name change
  ble.sendCommandCheckOK("AT+GAPDEVNAME");

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  Serial.println(F("Please use Adafruit Bluefruit LE app to connect in Controller mode"));
  Serial.println(F("Then activate/use the sensors, color picker, game controller, etc!"));
  Serial.println();

  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  while (! ble.isConnected()) {
    delay(500);
  }

  Serial.println(F("*****************"));

  // Set Bluefruit to DATA mode
  Serial.println( F("Switching to DATA mode!") );
  ble.setMode(BLUEFRUIT_MODE_DATA);

  Serial.println(F("*****************"));
}
