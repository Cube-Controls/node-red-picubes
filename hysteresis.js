module.exports = function(RED) {
    
    function hysteresisNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
		this.name = config.name;
		this.topicX = config.topicX;
		this.topicY0 = config.topicY0;
		this.topicY1 = config.topicY1;
		
		var node = this;
		
		var inputs = [0,0,0];
		var output = 0;
		

		this.on('input', function(msg) 
						{
							// setup write flag 
							var value = msg.payload;
							var topic = msg.topic;
							
							if (topic==this.topicX)  inputs[0] = value; else
							if (topic==this.topicY0) inputs[1] = value; else
							if (topic==this.topicY1) inputs[2] = value;
							
							// first case
							if (inputs[1] > inputs[2])
							{
							   if (inputs[0] <= inputs[2]) output = 0; 
							   if (inputs[0] >= inputs[1]) output = 1;
							} else   
							// seconds case
							if (inputs[1] < inputs[2])
							{
							   if (inputs[0] >= inputs[2]) output = 0;
							   if (inputs[0] <= inputs[1]) output = 1;
							}

							var msg = {topic:node.name,payload:Number(output)};
							this.status({fill:"green",shape:"dot",text: output.toString()});
							this.send(msg);
						});
	
	}
    
    RED.nodes.registerType("hysteresis",hysteresisNode);
	
}