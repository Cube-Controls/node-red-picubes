module.exports = function(RED) {
    var pic = require('node-picubes');
	
	I2CInUse = 0;
    
    function writeDONode(config) {
        RED.nodes.createNode(this,config);
        this.prefix = config.prefix;
		this.name = config.name;
        this.module = config.module;
        this.output = config.output;
        var node = this;
        var val = 0;
		var writeflag = 0;
		
    	// Set interval
		this.interval_id = setInterval(function()
							{
							    if ((writeflag == 0) || (I2CInUse == 1)) return;
								I2CInUse = 1;
								// set write flag
							    writeflag = 0;
								pic.writeDO(parseInt(node.module),parseInt(node.output),val,function(err)
								{
									if (err) node.error(err);
									I2CInUse = 0;
									if (val==1) node.status({fill:"green",shape:"dot",text:"1"});
									else        node.status({fill:"grey",shape:"dot",text:"0"});
							
									var msg = {topic:node.name,payload:Number(val)};
									node.send(msg);
								});
							},100);
				
        this.on('input', function(msg) 
                         {
                           
                            if (msg.payload == '0') val = 0;
                            else                    val = 1;
							// set write flag
							writeflag = 1;
                         });
    }
    
    RED.nodes.registerType("writeDO",writeDONode);
	
	writeDONode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
}