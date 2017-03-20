

module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');
    
    function PlayAudio(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.bulb_ip = n.bulb_ip;
        this.bulb_uri = n.bulb_uri;
        var node = this;
        
        
        node.on("input", function(msg) {
            if (msg&& msg.payload) {
            	node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
            	node.bulb_uri = msg.payload.bulb_uri || node.bulb_uri;
            	if(awox.isValidIp(node.bulb_ip)) {
            		awox.play(node, msg, node.bulb_uri);
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
    RED.nodes.registerType("playaudio",PlayAudio);

}
