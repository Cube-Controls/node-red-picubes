module.exports = function(RED) {
    
    function mathNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
        this.name = config.name;
		this.math = config.math;
		this.topicY0 = config.topicY0;
		this.topicY1 = config.topicY1;
		this.topicY2 = config.topicY2;
		this.topicY3 = config.topicY3;
		this.number = config.number;
		var node = this;
		
		var inputs = [0,0,0,0];
		
		var output = 0;
		
		var i;
		
		function exec_add()
		{

		   switch (parseInt(node.number))
		   {
				case 2:
					output = inputs[0] + inputs[1];
				break;				
				case 3:
					output = inputs[0] + inputs[1] + inputs[2];
				break;	
				case 4:
					output = inputs[0] + inputs[1] + inputs[2] + inputs[3];
				break;
			}
		}
		
		function exec_sub()
		{
		   switch (parseInt(node.number))
		   {
				case 2:
					output = inputs[0] - inputs[1];
				break;				
				case 3:
					output = inputs[0] - inputs[1] - inputs[2];
				break;	
				case 4:
					output = inputs[0] - inputs[1] - inputs[2] - inputs[3];
				break;
			}
		}
		
		function exec_div()
		{
		   switch (parseInt(node.number))
		   {
				case 2:
					output = inputs[0] / inputs[1];
				break;				
				case 3:
					output = inputs[0] / inputs[1] / inputs[2];
				break;	
				case 4:
					output = inputs[0] / inputs[1] / inputs[2] / inputs[3];
				break;
			}
		}
		
		function exec_mul()
		{
		   switch (parseInt(node.number))
		   {
				case 2:
					output = inputs[0] * inputs[1];
				break;				
				case 3:
					output = inputs[0] * inputs[1] * inputs[2];
				break;	
				case 4:
					output = inputs[0] * inputs[1] * inputs[2] * inputs[3];
				break;
			}
		}	

		function exec_max()
		{
		   output = inputs[0];
		   for (i=1;i<parseInt(node.number);i++)
		   {
		      if (inputs[i] > output) output = inputs[i];
		   }
		}
		
		function exec_min()
		{
		   output = inputs[0];
		   for (i=1;i<parseInt(node.number);i++)
		   {
		      if (inputs[i] < output) output = inputs[i];
		   }
		}		

		function exec_avg()
		{
		   output = inputs[0];
		   for (i=1;i<parseInt(node.number);i++)
		   {
		      output = output + inputs[i];
		   }
		   
		   output = output / parseInt(node.number);
		}
		
		this.on('input', function(msg) 
						{
							// setup write flag 
							var value = msg.payload;
							var topic = msg.topic;
							
							
							if (topic==this.topicY0) inputs[0] = value; else
							if (topic==this.topicY1) inputs[1] = value; else
							if (topic==this.topicY2) inputs[2] = value; else
							if (topic==this.topicY3) inputs[3] = value; 
							
							if (this.math == "Add") exec_add(); else
							if (this.math == "Sub") exec_sub(); else
							if (this.math == "Div") exec_div(); else
							if (this.math == "Mul") exec_mul(); else
							if (this.math == "Max") exec_max(); else
							if (this.math == "Min") exec_min(); else
							if (this.math == "Avg") exec_avg(); 
							
							this.status({fill:"green",shape:"dot",text: output.toString()});
							var msg = {topic:node.name, payload:Number(output)};
							this.send(msg);
						});
	
	}
    
    RED.nodes.registerType("math",mathNode);
	
}