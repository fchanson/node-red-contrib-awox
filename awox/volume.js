
module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');

	function Volume(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.bulb_ip = n.bulb_ip;
		this.bulb_volume = n.bulb_volume;
		this.method = n.method;
		var node = this;

		
		node.on("input", function(msg) {
			if (msg && msg.payload) {
				node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
				if (awox.isValidIp(node.bulb_ip)) {
					node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
						node.bulb_volume = msg.payload.bulb_volume || node.bulb_volume;

						if (awox.isNumeric(node.bulb_volume)) {
							var v = Number(node.bulb_volume);
							if (v >= 0 && v <= 100) {
								awox.setVolume(node, msg, node.bulb_volume);
							} else {
								node.error('Invalid volume range');
								msg.payload.error = 'Invalid volume range (0-100)';
								node.send(msg);
								node.status({
									fill : "red",
									shape : "dot",
									text : 'Invalid volume range'
								});
							}

						} else {
							node.error('Invalid volume format');
							msg.payload.error = 'Invalid volume format';
							node.send(msg);
							node.status({
								fill : "red",
								shape : "dot",
								text : 'Invalid volume format'
							});
						}
					} else {
						awox.getVolume(node, msg);
					}

				} else {
					node.error('Invalid bulb IP adress');
					msg.payload.error = 'Invalid bulb IP adress';
					node.send(msg);
					node.status({
						fill : "red",
						shape : "ring",
						text : 'Invalid bulb IP adress'
					});
				}

			}
		});

		node.on("close", function() {
			node.status({});
		});
	}
	RED.nodes.registerType("volume", Volume);

};
