module.exports = function(RED) {
    
    function constantNode(config) {
        RED.nodes.createNode(this,config);
        
		this.name = config.name;
        this.value = config.value;
		this.repeat = config.repeat;
		var node = this;
		
		var output = 0;
		
		function setOutput()
		{
			output = node.value;
							  
			node.status({fill:"green",shape:"dot",text: output.toString()});
			var msg = {topic:node.name, payload:Number(output)};
			node.send(msg);		
		}

		// Set interval
		this.interval_id = setInterval(setOutput,this.repeat*1000);
		
		//start function once on start		
		setTimeout( setOutput,100);		
    }
    
    RED.nodes.registerType("constant",constantNode);
	
	constantNode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
}