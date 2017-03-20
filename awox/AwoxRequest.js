var http = require("follow-redirects").http;
var isIp = require('is-ip');


var isValidIp = function(ip) {
	return isIp(ip);
};

var isNumeric = function(num) {
	return !isNaN(num) && isFinite(n);
};	

var validRGB  = function(r,g,b) {
	if(isNumeric(r) && isNumeric(g) && isNumeric(b)) {
		if( Number(r)>=0 && Number(r)<=255 && Number(g)>=0 && Number(g)<=255 && Number(b)>=0 && Number(b)<=255) {
			return true;
		} else {
			return false;
		}
	}
	return false;
};
	
var getVolume = function(node, msg) {
	get(node, msg, '/Mixer/Capability/Volume.json', 'system_mixer.level', 'bulb_volume', function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};	

var setVolume = function(node, msg, volume) {
	post(node, msg, '/Mixer/Capability/Volume.json',"{\"level\" : " + volume+ "}", function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var say = function(node, msg, text) {
	post(node, msg, '/Player/Say.json',"{\"msg\" : \"" + text+ "\"}", function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var play = function(node, msg, play) {
	post(node, msg, '/Player/PlayURI.json',"{\"uri\":\""+play+"\"}", function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var getBrightness = function(node, msg) {
	get(node, msg, '/Light/Capability/WhiteBrightness.json', 'brightness', 'bulb_brightness', function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};	

var setBrightness = function(node, msg, brightness) {
	post(node, msg, '/Light/Capability/WhiteBrightness.json',"brightness="+brightness, function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var getTemperature = function(node, msg) {
	get(node, msg, '/Light/Capability/WhiteTemperature.json', 'temperature', 'bulb_temperature', function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};	

var setTemperature = function(node, msg, temperature) {
	post(node, msg, '/Light/Capability/WhiteTemperature.json',"temperature="+temperature, function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var getSwitchOnOff = function(node, msg) {
	get(node, msg, '/Light/Capability/SwitchPower.json', 'state', 'bulb_state', function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});

};	

var setSwitchOnOff = function(node, msg, state) {
	post(node, msg, '/Light/Capability/SwitchPower.json',"state="+state, function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

var getMute = function(node, msg) {
	get(node, msg, '/Mixer/Capability/Mute.json', 'system_mixer.mute', 'bulb_mute', function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};	

var setMute = function(node, msg, mute) {
	get(node, msg, '/Mixer/Capability/Mute.json', 'system_mixer.mute', 'bulb_mute', function(msg,status) {
		
		if(String(msg.payload.bulb_mute) !== mute) {
			post(node, msg, '/Mixer/Capability/Mute/Switch.json',"mute", function(msg,status) {
				msg.payload.bulb_mute = !msg.payload.bulb_mute;
				node.send(msg);
			    node.status(status);
			});
		} else {
			node.send(msg);
		    node.status(status);
		}

	});
	
	

};

var getColor = function(node, msg) {
	get(node, msg, '/Light/Capability/ColorLight/Rgb.json', ['rgbcolor.red','rgbcolor.green','rgbcolor.blue'], ['bulb_red','bulb_green','bulb_blue'], function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};	

var setColor = function(node, msg, red, green, blue) {
	post(node, msg, '/Light/Capability/ColorLight/Rgb.json', "red="+red+"&green="+green+"&blue="+blue, function(msg,status) {
		
		node.send(msg);
	    node.status(status);
	});
};

getValue = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); 
    s = s.replace(/^\./, '');           
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};



exports.isValidIp = isValidIp;
exports.isNumeric = isNumeric;	
exports.getVolume = getVolume;
exports.setVolume = setVolume;
exports.setSwitchOnOff = setSwitchOnOff;
exports.getSwitchOnOff = getSwitchOnOff;
exports.getColor = getColor;
exports.setColor = setColor;
exports.validRGB = validRGB;
exports.setBrightness = setBrightness;
exports.getBrightness = getBrightness;
exports.setTemperature = setTemperature;
exports.getTemperature = getTemperature;
exports.setMute = setMute;
exports.getMute = getMute;
exports.say = say;
exports.play = play;

post = function (node, msg, path, value, cb) {

	var options = {
		    host: node.bulb_ip,
		    port: 34000,
		    path: path,
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		        'Content-Length': Buffer.byteLength(value)
		    }
		};
	
		var req = http.request(options, function(res) {
			var response = '';
            res.on('data',function(chunk) {
            	response += chunk;
            });
            res.on('end',function() {
            	var r = {};
            	try {
            		r = JSON.parse(response);
            	} catch(e) { 
            		
            	}

            	if(r.status==='passed') {
                	msg.payload.status = "success";                    		
            	} else {
            		msg.payload.status = "failed";
            	}

            	cb(msg,{});

            });
            
            
		});
		

		
        req.setTimeout(120000, function() {
            setTimeout(function() {
            	cb({},{fill:"red",shape:"ring",text:"common.notification.errors.no-response"});

            },10);
            req.abort();
        });

        req.on('error',function(err) {
            node.error(err,msg);
            msg.payload.error = err.toString();
            msg.payload.status = "failed";
            
            cb(msg,{fill:"red",shape:"ring",text:err.code});

        });
        
        req.write(value);
        req.end();
		
		
		
};

get = function (node, msg, path, responsePath, responseKey, cb) {

	var options = {
		    host: node.bulb_ip,
		    port: 34000,
		    path: path,
		    method: 'GET',
		    headers: {
		        'Content-Type': 'application/json'
		    }
		};
	
		var req = http.request(options, function(res) {
			var response = '';
            res.on('data',function(chunk) {
            	response += chunk;
            });
            res.on('end',function() {
            	var r = {};
            	try {
            		r = JSON.parse(response);
            	} catch(e) { 

            	}
            	if(r.status==='passed') {
                	msg.payload.status = "success";

                	if(Array.isArray(responsePath) && responsePath.length>0) {
                		for(var i=0;i<responsePath.length;i++) {
                			msg.payload[responseKey[i]] = getValue(r,responsePath[i]);
                		}
                	} else {
                		msg.payload[responseKey] = getValue(r,responsePath);	
                	}
                	                    		
            	} else {
            		msg.payload = {'status':"failed"}; 
            	}

            	cb(msg,{});

            });
            
            
		});
		
        req.setTimeout(120000, function() {
            setTimeout(function() {
            	cb({},{fill:"red",shape:"ring",text:"common.notification.errors.no-response"});

            },10);
            req.abort();
        });

        req.on('error',function(err) {
        	 node.error(err,msg);
             msg.payload.error = err.toString();
             msg.payload.status = "failed";
             
             cb(msg,{fill:"red",shape:"ring",text:err.code});

        });
        
        req.end();
		
		
		
};
