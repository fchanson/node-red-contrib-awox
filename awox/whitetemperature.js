
module.exports = function(RED) {
	var awox = require('./AwoxRequest.js');

	function Temperature(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.bulb_ip = n.bulb_ip;
		this.bulb_temperature = n.bulb_temperature;
		this.method = n.method;
		var node = this;

		
		node.on("input", function(msg) {
			if (msg && msg.payload) {
				node.bulb_ip = msg.payload.bulb_ip || node.bulb_ip;
				if (awox.isValidIp(node.bulb_ip)) {
					node.method = msg.payload.method || node.method;

					if (node.method === 'set') {
						node.bulb_temperature = msg.payload.bulb_temperature || node.bulb_temperature;

						if (awox.isNumeric(node.bulb_temperature)) {
							var v = Number(node.bulb_temperature);
							if (v >= 0 && v <= 100) {
								awox.setTemperature(node, msg, node.bulb_temperature);
							} else {
								node.error('Invalid temperature range');
								msg.payload.error = 'Invalid temperature range (0-100)';
								node.send(msg);
								node.status({
									fill : "red",
									shape : "dot",
									text : 'Invalid temperature range'
								});
							}

						} else {
							node.error('Invalid temperature format');
							msg.payload.error = 'Invalid temperature format';
							node.send(msg);
							node.status({
								fill : "red",
								shape : "dot",
								text : 'Invalid temperature format'
							});
						}
					} else {
						awox.getTemperature(node, msg);
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
	RED.nodes.registerType("temperature", Temperature);

};
