'use strict';

/* Magic Mirror
 * Module: MMM-RadioThermostat
 *
 * By Jason 'JP' McCrory,
 * MIT Licensed.
 * 
 */

Module.register("MMM-RadioThermostat", {

	jsonData: null,
	indoorTemp: null,

	// Default module config.
	defaults: {
		url: "",
		size: 0,
		//tryFormatDate: false,
		updateInterval: 15000,
		debug: false,
		showAlerts: true,
		showTitle: false,
		title: 'Indoor Temperature',
		loadingText: 'Getting Indoor Temperature...',
        postText: '',
        showFontAwesomeIcons: true
	},

    getStyles: function () {
		return ["font-awesome.css"];
    },
    
	start: function () {
		this.config.url = "http://" + this.config.url + "/tstat";
		this.loaded = false;
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification("MMM-RadioThermostat_GET_JSON", this.config.url);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-RadioThermostat_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				//var JSONObject = JSON.parse(this.jsonData);
				this.indoorTemp = this.jsonData["temp"];
				this.sendNotification('INDOOR_TEMPERATURE', this.indoorTemp);
				this.loaded = true;
				if (this.config.debug) {
					this.updateDom();
				  }
				//this.updateDom(500);
			}
		}

		if (notification === 'ERROR' && this.config.showAlerts){
			this.sendNotification('SHOW_ALERT', payload);
		}
	},

    getTranslations: function() {
        return {
            en: "translations/en.json"
        };
    },

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement('div');
        wrapper.className = "xsmall";
        
		if (this.config.debug) {
	
		  if (!this.loaded) {
			wrapper.innerHTML = this.config.loadingText;
			return wrapper;
		  }
	
          var table = document.createElement("table");
          var tbody = document.createElement("tbody");
          let processThese = ["temp", "tmode", "fmode", "t_heat", "t_cool"];
          let translateThese = ["tmode", "fmode"];
          for (var key in this.jsonData) {
            if (processThese.includes(key)) {
                var row = document.createElement("tr");
                //Create Table Data Elements
                var descriptionCell = document.createElement("td");
                var valueCell = document.createElement("td");
                //Create Description
                var descriptionText = document.createTextNode(this.translate(key));
                descriptionCell.appendChild(descriptionText);
                row.appendChild(descriptionCell);
                //Create Values
                if (translateThese.includes(key)) {
                    if (this.config.showFontAwesomeIcons) {
                        valueCell.classList.add("fa", this.translate(key + "-icon=" + this.jsonData[key]));
                    }
                    else {
                        var valueText = document.createTextNode(this.translate(key + "=" + this.jsonData[key]));
                        valueCell.appendChild(valueText);
                    }
                }
                else
                {
                    var valueText = document.createTextNode(this.jsonData[key]);
                    valueCell.appendChild(valueText);
                }
                row.appendChild(valueCell);
                tbody.appendChild(row);
            }
          }
          
          table.appendChild(tbody);
          wrapper.appendChild(table);
          //var titleDiv = document.createElement('div');
		  //titleDiv.innerHTML = this.config.title;
		  //wrapper.appendChild(titleDiv);
	
		  //var tempDiv = document.createElement('div');
		  //tempDiv.innerHTML = this.indoorTemp;
		  //wrapper.appendChild(tempDiv);
	
		}
	
		return wrapper;
    },
    
    getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		for (var key in jsonObject) {
			var cell = document.createElement("td");
			
			var valueToDisplay = "";
			if (key === "icon") {
				cell.classList.add("fa", jsonObject[key]);
			}
			else if (this.config.tryFormatDate) {
				valueToDisplay = this.getFormattedValue(jsonObject[key]);
			}
			else {
				if ( this.config.keepColumns.length == 0 || this.config.keepColumns.indexOf(key) >= 0 ){
					valueToDisplay = jsonObject[key];
				}
			}

			var cellText = document.createTextNode(valueToDisplay);

			if ( this.config.size > 0 && this.config.size < 9 ){
				var h = document.createElement("H" + this.config.size );
				h.appendChild(cellText)
				cell.appendChild(h);
			}
			else
			{
				cell.appendChild(cellText);
			}

			row.appendChild(cell);
		}
        return row;
    }

});
