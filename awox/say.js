

module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');
    
    function Say(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.bulb_ip = n.bulb_ip;
        this.bulb_tts = n.bulb_tts;
        var node = this;
        
        node.on("input", function(msg) {
            if (msg && msg.payload) {
            	node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
            	node.bulb_tts = msg.payload.bulb_tts || node.bulb_tts;
            	if(awox.isValidIp(node.bulb_ip)) {
            		if(node.bulb_tts.length>0) {
            			awox.say(node, msg, node.bulb_tts);            			
            		} else {
                		node.error('Text missing');
                        msg.payload = 'Text missing';
                        node.send(msg);
                        node.status({fill:"red",shape:"ring",text:'Text missing'});
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
    RED.nodes.registerType("say",Say);

}
