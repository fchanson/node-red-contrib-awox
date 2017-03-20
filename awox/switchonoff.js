

module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');
    
    function SwitchOnOff(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.bulb_ip = n.bulb_ip;
        this.bulb_state = n.bulb_state;
        this.method = n.method;
        var node = this;

        node.on("input", function(msg) {
            if (msg && msg.payload) { 
            	node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
            	node.bulb_state = msg.payload.bulb_state || node.bulb_state;
            	if(awox.isValidIp(node.bulb_ip)) {
            		node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
            		
	            		if(node.bulb_state === 'off' || node.bulb_state === '0' || node.bulb_state === 0 || node.bulb_state === false) {
	            			awox.setSwitchOnOff(node, msg, "false");	
	            		} else if(node.bulb_state === 'on' || node.bulb_state === '1' || node.bulb_state === 1 || node.bulb_state === true) {
	            			awox.setSwitchOnOff(node, msg, "true");
	            		} else {
	            			node.error('Invalid state format');
							msg.payload.error = 'Invalid state format';
							node.send(msg);
							node.status({
								fill : "red",
								shape : "dot",
								text : 'Invalid state format'
							});
	            		}
					} else {
						awox.getSwitchOnOff(node, msg);
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
    RED.nodes.registerType("switchonoff",SwitchOnOff);

}
