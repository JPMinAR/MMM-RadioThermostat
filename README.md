# Magic Mirror Module: 3M RadioThermostat

This modules for the [Magic Mirror²](https://github.com/MichMich/MagicMirror) will show a card with the current status of the an RadioThermostat branded WiFi controled thermostats, namely those produced by 3M. This module also publishes the ```INDOOR_TEMPERATURE``` notification for use in other modules.

## The Module

The module is my first and I've focused on keeping it clean and to a simple task. Welcome to feedback or translations. (Note that I use translation to set which Font Awesome icon to represent Mode.)

## How?
### Manual install

1. Clone this repository in your `modules` folder, and install dependencies:
  ```bash
  cd ~/MagicMirror/modules # adapt directory if you are using a different one
  git clone https://github.com/JPMinAR/MMM-RadioThermostat.git
  cd MMM-RadioThermostat
  npm install
  ```
2. You need to assign your Radio Thermostat to either a static IP address or local domain name, URL is required in the config.
3. Add the module to your `config/config.js` file, example given.
  ```js
  {
    module: 'MMM-RadioThermostat',
    position: 'bottom_center', // If not included module will not display but will still publish INDOOR_TEMPERATURE for other modules
    config: {
      url: "", //Required static IP or Local Domain Name
      showTitle: true, //Option (default: false) Shows Title/Header for Module
    }
  },
  ```
