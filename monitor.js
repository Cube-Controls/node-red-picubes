module.exports = function(RED) {
    
    function monitorNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
		this.name = config.name;
		var node = this;
		

		this.on('input', function(msg) 
						{
							// setup write flag 
							var value = msg.payload;
							
							var msg = {topic:node.name,payload:Number(value)};
							this.status({fill:"green",shape:"dot",text: value.toString()});
							this.send(msg);
						});
	
	}
    
    RED.nodes.registerType("monitor",monitorNode);
	
}