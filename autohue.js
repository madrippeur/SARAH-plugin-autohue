exports.action = function(data, callback, config, SARAH){
	//if (typeof(config.modules.hue)=="undefined") {callback({'tts':'Erreur. Le pluguine "Autohue" nécessite l\'installation du pluguine hue!'});return;}
	
	//var adresse='http://'+config.sarahip+':'+config.sarahport+'/sarah/';
	//console.log(adresse);
	
	
	if ( typeof data.action !== 'undefined'){
		if ( data.action == 'actif' ){
			var path = require('fs');
			if (path.existsSync("./plugins/autohue/actif.txt")) {
				return callback({'tts': 'Eclairage automatique déjà activé'});
			} else {
				var fs = require('fs');
				fs.writeFile("./plugins/autohue/actif.txt", "actif", function(err) {});
				return callback({'tts': 'Eclairage automatique activé'});
			}
		}
		if ( data.action == 'inactif' ){
			var path = require('path');
			if (path.existsSync("./plugins/autohue/actif.txt")) {
				var path = require('fs');
				path.unlinkSync('./plugins/autohue/actif.txt');
				return callback({'tts':'Eclairage automatique désactivé'});
			} else {
				return callback({'tts':'Eclairage automatique déjà désactivé'});
			}
		}
	}

	if (( typeof data.on !== 'undefined') &&( typeof data.light !== 'undefined') &&( typeof data.time !== 'undefined')) {
		var path = require('path');
		if (path.existsSync("./plugins/autohue/actif.txt")) {
			console.log('on : '+data.on);
			console.log('light : '+data.light);
			console.log('time : '+data.time);
	
			console.log('Allumage');
			data.time = data.time*1000;
			console.log('time recalculé : '+data.time);

			var url = "http://127.0.0.1:8080/sarah/hue?on=" + data.on + "&light=" + data.light;
			var request = require('request');
			request({ 'uri' : url , method: "POST"}, function (err, response, body){
				if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échouée"});
				return;
			}});
	
			setTimeout(function() {
				console.log('extinction');
				var url = 'http://127.0.0.1:8080/sarah/hue?on=false&light=' + data.light;
				var request = require('request');
				request({ 'uri' : url , method: "POST"}, function (err, response, body){
					if (err || response.statusCode != 200) {
					callback({'tts': "L'action a échouée"});
					return;
				}});
			}, data.time);
		}
	callback({});
	}
	callback({});
}