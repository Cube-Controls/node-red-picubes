module.exports = function(RED) {
    var pic = require('node-picubes');
	var time = require('time');
	portInUse = 0;
    
    function CTANode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
		this.name = config.name;
        this.slave = config.slave;
        this.regaddr = config.regaddr;
		this.scale = config.scale;
		this.scan = config.scan;
		this.interval_id = null;
		var node = this;
		var value = 0;
		var lasttime = time.time() - 2 * parseInt(node.scan);
		var writeflag = 0;
		var writevalue = 0;
		
		function write_cta()
		{
			pic.writeCTA(parseInt(node.slave),parseInt(node.regaddr),writevalue,function(err)
			{	
				if (err) node.log(err);
				
				portInUse = 0;
			});
		}
		
		
		function read_cta()
		{
			pic.readCTA(parseInt(node.slave),parseInt(node.regaddr),function(err,data)
			{
				if (err) node.log(err);
				
				portInUse = 0;
				if (data != null) 
				{
					value = data;
					// read CTA
				
					// conversion
					if (node.scale != 1) value = parseFloat(node.scale) * value;
							
					value = value.toFixed(1);
						    
					node.status({fill:"green",shape:"dot",text: value.toString()});
						
					var msg = {topic:node.name, payload:Number(value)};
					
					node.send(msg);
							
					msg = null;
				}
			}); 
			// remember time from last read
			lasttime = time.time();	
		}

		// Set interval
		this.interval_id = setInterval(function()
							{
							    if (time.time() < (lasttime + parseInt(node.scan))) return;
							    if (portInUse == 1) return;
								portInUse = 1;
								if (writeflag==1)
								{
								   write_cta();
								   writeflag = 0
								} else read_cta(); // read UI modul
							},300);
		                     
		this.on('input', function(msg) 
						{
							// setup write flag 
							writeflag = 1;
							writevalue = msg.payload*(1/node.scale);
						});
	
	}
    
    RED.nodes.registerType("CTA",CTANode);
	
	CTANode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
}