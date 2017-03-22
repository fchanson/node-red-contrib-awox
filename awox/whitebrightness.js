
module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');

	function Brightness(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.bulb_ip = n.bulb_ip;
		this.bulb_brightness = n.bulb_brightness;
		this.method = n.method;
		var node = this;

		
		node.on("input", function(msg) {
			if (msg && msg.payload) {
				node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
				if (awox.isValidIp(node.bulb_ip)) {
					node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
						node.bulb_brightness = msg.payload.hasOwnProperty('bulb_brightness') ? msg.payload.bulb_brightness : node.bulb_brightness;

						if (awox.isNumeric(node.bulb_brightness)) {
							var v = Number(node.bulb_brightness);
							if (v >= 0 && v <= 100) {
								awox.setBrightness(node, msg, node.bulb_brightness);
							} else {
								node.error('Invalid brightness range');
								msg.payload.error = 'Invalid brightness range (0-100)';
								node.send(msg);
								node.status({
									fill : "red",
									shape : "dot",
									text : 'Invalid brightness range'
								});
							}

						} else {
							node.error('Invalid brightness format');
							msg.payload.error = 'Invalid brightness format';
							node.send(msg);
							node.status({
								fill : "red",
								shape : "dot",
								text : 'Invalid brightness format'
							});
						}
					} else {
						awox.getBrightness(node, msg);
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
	RED.nodes.registerType("brightness", Brightness);

};
