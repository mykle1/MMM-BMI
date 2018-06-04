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
        herName: "",
        herWeight: "",                    // lbs and inches or kg and m
        herHeight: "",                    // lbs and inches or kg and m
        useHeader: true,                 // true if you want a header      
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
        this.Hers = {};
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
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
        
        var BMI = this.BMI;
        var Hers = this.Hers;
        
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
        
        
        // spacer
        var spacer = document.createElement("div");
        spacer.classList.add("small", "bright", "spacer");
	    spacer.innerHTML = "~ ~ ~";
		wrapper.appendChild(spacer);
        
        
		// herCalc
        var herCalc = document.createElement("div");
        herCalc.classList.add("small", "bright", "herCalc");
	    herCalc.innerHTML = this.config.herName + "'s BMI is " + (Hers.value).toFixed(2);
		wrapper.appendChild(herCalc);
        
        
        // herDiagnosis
        var herDiagnosis = document.createElement("div");
        herDiagnosis.classList.add("small", "bright", "herDiagnosis");
	    herDiagnosis.innerHTML = this.config.herName + "'s body is " + Hers.name;
		wrapper.appendChild(herDiagnosis);
            
        
        return wrapper;
		
    },
	

    processBMI: function(data) {
        this.BMI = data;
        console.log(this.BMI);
        this.loaded = true;
    },
    
    
    processHers: function(data) {
        this.Hers = data;
        console.log(this.Hers);
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
        
        if (notification === "HERS_RESULT") {
            this.processHers(payload);
            this.updateDom(this.config.fadeSpeed);
        }
        
        
        this.updateDom(this.config.initialLoadDelay);
    },
});