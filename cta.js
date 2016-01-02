module.exports = function(RED) {
    var pic = require('node-picubes');
	var myCTAJobList = new Array();
	
	function CTAServer()
	{
	    var node, slave, regaddr, scale, name, value;
		
		function read_cta()
		{
			pic.readCTA(parseInt(slave),parseInt(node.regaddr),function(err,data)
			{
				if (err) node.log(err);
				
				if (data != null) 
				{
				    // read data
					var value = parseInt(data);
					// convert to signed
					if (value > 32768) value = value - 65536;
					// read CTA
							
				
					// conversion
					if (scale != 1) value = parseFloat(scale) * value;
							
					value = value.toFixed(1);
						    
					node.status({fill:"green",shape:"dot",text: value.toString()});
						
					var msg = {topic:node.name, payload:Number(value)};
					
					node.send(msg);
							
					msg = null;
				} else 
				{
					node.status({fill:"red",shape:"dot",text: "nan"});
				}
				
				setTimeout(CTAServer, 500);
			}); 
		}// End read_cta
		
		function write_cta()
		{
			pic.writeCTA(parseInt(slave),parseInt(regaddr),value*(1/scale),function(err)
			{	
				if (err) node.log(err);
				
				
				setTimeout(CTAServer, 500);
			
			});
		}// End write_cta
		
		// check if array list is not empty
		if (myCTAJobList.length != 0)
		{
			var jobCTA = myCTAJobList.shift();
			
			slave = jobCTA.slaveAddr;
			node = jobCTA.nodeObj;
			regaddr = jobCTA.regAddr;
			scale = jobCTA.scale;
			name = jobCTA.name;
			value = jobCTA.value;
			
			if (jobCTA.jobType == "read") read_cta(); else
				if (jobCTA.jobType == "write") write_cta(); else setTimeout(CTAServer, 500);
		} else setTimeout(CTAServer, 500);
	}
	
	// schedule the first invocation:
	setTimeout(CTAServer, 1000);
	
    
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
		

		// Set interval
		this.interval_id = setInterval(function()
							{
							    // create job
							    var ctaJob = { jobType:"read", slaveAddr:node.slave , regAddr:node.regaddr, scale:node.scale, nodeObj:node, name:node.name, value:0 };
								// push job to array
								myCTAJobList.push(ctaJob);
									
							},this.scan*1000);
		                     
		this.on('input', function(msg) 
						{
							// create job
							var ctaJob = { jobType:"write", slaveAddr:node.slave , regAddr:node.regaddr, scale:node.scale, nodeObj:node, name:node.name, value:msg.payload };
							// push job to array
							myCTAJobList.push(ctaJob);
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