from flask import Flask, render_template, make_response
import RPi.GPIO as GPIO
from gpiozero import LED, Button
import os
app = Flask(__name__)

# based upon http://mattrichardson.com/Raspberry-Pi-Flask/


# BOARD is documented as better but results in
# ValueError: A different mode has already been set!
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()

inputButtons = []
outputButtons = []

def pinValue(pinNumber):
   try:
      if pinNumber in outputButtons:
         outputButtons.remove(pinNumber)
      if not pinNumber in inputButtons:
         GPIO.setup(pinNumber, GPIO.IN)
         inputButtons.append(pinNumber)
      return GPIO.input(pinNumber)
   except Exception as e:
         print(str(e))
         return "ERROR: Reading pin " + str(pinNumber) + ". " + str(e) + "."
  
def turnOnOrOffPin(pinNumber, value):
   try:
      GPIO.setup(pinNumber, GPIO.OUT)
      if value == '1' or value == 'true' or value == 'on':
         # Set the pin high:
         GPIO.output(pinNumber, GPIO.HIGH)
         # Save the status message to be passed into the template:
         return "Turned pin " + str(pinNumber) + " on."
      elif value == '0' or value == 'false' or value == 'off':
         GPIO.output(pinNumber, GPIO.LOW)
         return "Turned pin " + str(pinNumber) + " off."
      elif value == '-1' or value == 'toggle':
         # Read the pin and set it to whatever it isn't (that is, toggle it):
         GPIO.output(pinNumber, not GPIO.input(pinNumber))
         return "Toggled pin " + str(pinNumber) + ". It is now " + ("on" if GPIO.input(pinNumber) else "off") + "."
      else:
         return "Raspberry Pi pin values can only be 1 (on), 0 (off), or -1 (toggle). Not " + str(value)
   except Exception as e:
         print(str(e))
         return "ERROR: Writing pin " + str(pinNumber) + ". " + str(e) + "."

@app.route('/')
def haome_page():
    return app.send_static_file("index.html")

@app.route('/<path:path>')
def hello(path):
    return app.send_static_file(path)

@app.route('/uui/')
def static_uui_index_file():
    return app.send_static_file("uui/index.html")

@app.route('/ai/')
def static_ai_index_file():
    return app.send_static_file("ai/index.html")
       
@app.route("/readPin/<pin>")
def readPin(pin):
   try:
      # Convert the pin from the URL into an integer:
      pinNumber = int(pin)
      state = str(pinValue(pinNumber))
   except Exception as e:
      print(e)
      state = "There was an error reading pin " + pin + ". " + str(e)
   response = make_response(state)
   response.headers.add('Access-Control-Allow-Origin', '*')
   return response

@app.route("/writePin/<pin>/<action>")
def writePin(pin, action):
    message = turnOnOrOffPin(int(pin), action)
    response = make_response(message)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
   app.run(host='0.0.0.0', port=80, threaded=True)
           
