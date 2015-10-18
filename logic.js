module.exports = function(RED) {
    
    function logicNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
        this.name = config.name;
		this.operator = config.operator;
		this.topicX = config.topicX;
		this.topicY0 = config.topicY0;
		this.topicY1 = config.topicY1;
		this.topicY2 = config.topicY2;
		this.topicY3 = config.topicY3;
		this.number = config.number;
		var node = this;
		
		var inputs = [0,0,0,0,0];
		
		var output = 0;
		
		function exec_or()
		{

		   switch (parseInt(node.number))
		   {
				case 1:
					output = inputs[1];
				break;
				case 2:
					output = inputs[1] || inputs[2];
				break;				
				case 3:
					output = inputs[1] || inputs[2] || inputs[3];
				break;	
				case 4:
					output = inputs[1] || inputs[2] || inputs[3] || inputs[4];
				break;
			}
		}
		
		function exec_and()
		{
		   switch (parseInt(node.number))
		   {
				case 1:
					output = inputs[1];
				break;
				case 2:
					output = inputs[1] && inputs[2];
				break;				
				case 3:
					output = inputs[1] && inputs[2] && inputs[3];
				break;	
				case 4:
					output = inputs[1] && inputs[2] && inputs[3] && inputs[4];
				break;
			}
		}
		
		function exec_not()
		{
		    if (inputs[0] == 0) output = 1;
			else 				output = 0;
		}
		
		function exec_xor()
		{
		   var temp;
		   
		   switch (parseInt(node.number))
		   {
				case 1:
					output = inputs[1];
				break;
				case 2:
	                temp  = inputs[1] + inputs[2];
					if ((temp == 0) || (temp == 2)) output = 0;
					else   		   					output = 1;
				break;				
				case 3:
					temp  = inputs[1] + inputs[2] + inputs[3];
					if ((temp == 0) || (temp == 3)) output = 0;
					else   		   					output = 1;
				break;	
				case 4:
					temp  = inputs[1] + inputs[2] + inputs[3] + inputs[4];
					if ((temp == 0) || (temp == 4)) output = 0;
					else   		   					output = 1;
				break;
			}
		}
		
		function exec_mux()
		{
		   switch (parseInt(inputs[0]))
		   {
				case 0:
					output = inputs[1];
				break;
				case 1:
					output = inputs[2];
				break;				
				case 2:
					output = inputs[3];
				break;	
				case 3:
					output = inputs[4];
				break;
			}
		}

		this.on('input', function(msg) 
						{
							// setup write flag 
							var value = msg.payload;
							var topic = msg.topic;
							
							if (topic==this.topicX)  inputs[0] = value; else
							if (topic==this.topicY0) inputs[1] = value; else
							if (topic==this.topicY1) inputs[2] = value; else
							if (topic==this.topicY2) inputs[3] = value; else
							if (topic==this.topicY3) inputs[4] = value; 
						
							if (this.operator == "Or") exec_or(); else
							if (this.operator == "And") exec_and(); else
							if (this.operator == "Not") exec_not(); else
							if (this.operator == "Xor") exec_xor(); else
							if (this.operator == "Mux") exec_mux(); 
							
							this.status({fill:"green",shape:"dot",text: output.toString()});
							var msg = {topic:node.name, payload:Number(output)};
							this.send(msg);
						});
	
	}
    
    RED.nodes.registerType("logic",logicNode);
	
}