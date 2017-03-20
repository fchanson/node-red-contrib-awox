

module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');
    
    function Mute(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.bulb_ip = n.bulb_ip;
		this.bulb_mute = n.bulb_mute;
		this.method = n.method;
        var node = this;
        
        node.on("input", function(msg) {
            if (msg && msg.payload) {
				node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
				node.bulb_mute = msg.payload.bulb_mute || node.bulb_mute;
				
				if (awox.isValidIp(node.bulb_ip)) {
					node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
						
	            		
	            		if(node.bulb_mute === 'off' || node.bulb_mute === '0' || node.bulb_mute === 0 || node.bulb_mute === false) {
	            			awox.setMute(node, msg, "false");	
	            		} else if(node.bulb_mute === 'on' || node.bulb_mute === '1' || node.bulb_mute === 1 || node.bulb_mute === true) {
	            			awox.setMute(node, msg, "true");
	            		} else {
	            			node.error('Invalid mute format');
							msg.payload.error = 'Invalid mute format';
							node.send(msg);
							node.status({
								fill : "red",
								shape : "dot",
								text : 'Invalid mute format'
							});
	            		}
					} else {
						awox.getMute(node, msg);
					}          			
            	} else {
            		node.error('Invalid bulb IP adress');
                    msg.payload = 'Invalid bulb IP adress';
                    node.send(msg);
                    node.status({fill:"red",shape:"ring",text:'Invalid bulb IP adress'});
            	}
            }
        });

        node.on("close",function() {
            node.status({});
        });
    }
    RED.nodes.registerType("mute",Mute);

}
