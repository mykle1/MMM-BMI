/* Magic Mirror
 * Module: MMM-BMI
 * Get your Body Mass Index
 * By Mykle1
 * MIT Licensed
 */

const NodeHelper = require('node_helper');
const request = require('request');
var calcBmi = require('bmi-calc');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },
    
 
    getBMI: function(url) {
        
        var self = this;
        
        // 154 lbs, 72 in, imperial
//        console.log( calcBmi(154, 72, true) )
        // { value: 20.88, name: 'Normal' }
        var result = calcBmi(this.config.weight, this.config.height, this.config.imperialUnits);
        self.sendSocketNotification("BMI_RESULT", result);  
   

},
    

    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
          this.config = payload;
      } else if (notification === 'GET_BMI') {
            this.getBMI(payload);
        }
    },
});
