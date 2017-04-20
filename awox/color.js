

module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');
    
    function SetColor(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.bulb_ip = n.bulb_ip;
        this.bulb_red = n.bulb_red;
        this.bulb_green = n.bulb_green;
        this.bulb_blue = n.bulb_blue;
		this.method = n.method;
        var node = this;
                
        node.on("input", function(msg) {
            if (msg && msg.payload) { 
            	node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
            	
            	node.bulb_red = msg.payload.hasOwnProperty('bulb_red') ? msg.payload.bulb_red : node.bulb_red;
            	node.bulb_green = msg.payload.hasOwnProperty('bulb_green') ? msg.payload.bulb_green : node.bulb_green;
            	node.bulb_blue = msg.payload.hasOwnProperty('bulb_blue') ? msg.payload.bulb_blue : node.bulb_blue;
            	
            	if(awox.isValidIp(node.bulb_ip)) {
            		node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
	            		if(awox.validRGB(node.bulb_red, node.bulb_green, node.bulb_blue)) {
	            			awox.setColor(node, msg, node.bulb_red,node.bulb_green,node.bulb_blue);
	            		} else {
	                		node.error('Invalid RGB values');
	                        msg.payload.error = 'Invalid RGB values';
	                        node.send(msg);
	                        node.status({fill:"red",shape:"ring",text:'Invalid RGB values'});
	            		}
					} else {
						awox.getColor(node,msg);
					}
            	} else {
            		node.error('Invalid bulb IP adress');
                    msg.payload.error = 'Invalid bulb IP adress';
                    node.send(msg);
                    node.status({fill:"red",shape:"ring",text:'Invalid bulb IP adress'});
            	}
            }
        });

        node.on("close",function() {
            node.status({});
        });
    }
    RED.nodes.registerType("color",SetColor);

}
