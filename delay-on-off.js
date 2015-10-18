module.exports = function(RED) {

	var time = require('time');
    
    function delayonoffNode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
		this.delayon = config.delayon;
		this.delayoff = config.delayoff;
		this.interval_id = null;
		
		var node = this;
		
		var value = 0;
		var sendflag = 0;
		var lastinput = -1;
		var output_time = time.time();
				
		// Set interval
		this.interval_id = setInterval(function()
						   {
						        if ((time.time() > output_time) && (sendflag == 1))
								{
								  sendflag = 0;
								  var msg = {payload:Number(value)};
								  node.status({fill:"green",shape:"dot",text: value.toString()});
								  node.send(msg);
								}  
							},1000);
		
		this.on('input', function(msg) 
						{
							// setup write flag 
							value = parseInt(msg.payload);
							
							// if last input is -1 send to output without delay
							if (lastinput == -1)
							{
								lastinput = value;
								sendflag = 1;
							} else
							if ((lastinput == 0) && (value == 1))
							{
								output_time = time.time() + parseInt(node.delayon);
								lastinput = value;
								sendflag = 1;
							} else
							if ((lastinput == 1) && (value == 0))
							{
								output_time = time.time() + parseInt(node.delayoff);
								lastinput = value;
								sendflag = 1;
							}
						});
	
	}
    
    RED.nodes.registerType("delay-on-off",delayonoffNode);
	
	delayonoffNode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
	
}