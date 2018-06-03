/* Magic Mirror
 * Module: MMM-BMI
 * Get your Body Mass Index Calculator
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMI", {

    // Module config defaults.
    defaults: {
        name: "Mykle",                    // Your name
		imperialUnits: true,		      // true or (false = metric)
        weight: "",                       // lbs and inches or kg and m
        height: "",                       // lbs and inches or kg and m
        useHeader: false,                 // true if you want a header      
        header: "Body Mass Index Calc",   // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-BMI.css"];
    },


    start: function() {
        Log.info("Starting module: " + this.name);

        this.sendSocketNotification("CONFIG", this.config);
        
        //  Set locale.
        this.BMI = {};
        this.scheduleUpdate();
    },

    getDom: function() {
		

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Are you obese?";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
        
        var BMI = this.BMI;
        
		// calc
        var calc = document.createElement("div");
        calc.classList.add("small", "bright", "calc");
	    calc.innerHTML = this.config.name + "'s BMI is " + (BMI.value).toFixed(2);
		wrapper.appendChild(calc);
        
        
        // diagnosis
        var diagnosis = document.createElement("div");
        diagnosis.classList.add("small", "bright", "diagnosis");
	    diagnosis.innerHTML = this.config.name + "'s body is " + BMI.name;
		wrapper.appendChild(diagnosis);
            
        
        return wrapper;
		
    },
	

    processBMI: function(data) {
        this.BMI = data;
        console.log(this.BMI);
        this.loaded = true;
    },
    

    scheduleUpdate: function() {
        setInterval(() => {
            this.getBMI();
        }, this.config.updateInterval);
        this.getBMI(this.config.initialLoadDelay);
    },

    getBMI: function() {
        this.sendSocketNotification('GET_BMI');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "BMI_RESULT") {
            this.processBMI(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});