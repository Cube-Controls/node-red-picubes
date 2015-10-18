module.exports = function(RED) {
    
    function compareNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
        this.name = config.name;
		this.operator = config.operator;
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
					
							switch (this.operator)
							{
								case "GT":
									if (inputs[1] > inputs[2]) output = 1;
									else 					   output = 0;
							    break;		
								case "GTE":
									if (inputs[1] >= inputs[2]) output = 1;
									else 					    output = 0;
							    break;
								case "EQU":
									if (inputs[1] == inputs[2]) output = 1;
									else 					    output = 0;
							    break;
								case "BTW":
									if ((inputs[0] >= inputs[1]) && (inputs[0] <= inputs[2])) output = 1;
									else 					    							  output = 0;
							    break;
								case "NEQ":
									if (inputs[1] != inputs[2]) output = 1;
									else 					    output = 0;
							    break;
								case "LT":
									if (inputs[1] < inputs[2]) output = 1;
									else 			           output = 0;
							    break;
								case "LTE":
									if (inputs[1] <= inputs[2]) output = 1;
									else 			            output = 0;
							    break;
							}
							this.status({fill:"green",shape:"dot",text: output.toString()});
							var msg = {topic:node.name, payload:Number(output)};
							this.send(msg);
						});
	
	}
    
    RED.nodes.registerType("compare",compareNode);
	
}