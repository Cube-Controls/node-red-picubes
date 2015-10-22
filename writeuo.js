module.exports = function(RED) {
    var pic = require('node-picubes');
	
	I2CInUse = 0;
	
    function writeUONode(config) {
        RED.nodes.createNode(this,config);
        this.prefix = config.prefix;
		this.name = config.name;
        this.module = config.module;
        this.output = config.output;
		this.uotype = config.uotype;
		this.pwm = config.pwm;
        var node = this;
        var val = 0;
		var typeval = 0;
		var writeflag = 0;
		
		// Set interval
		this.interval_id = setInterval(function()
							{
							    if ((writeflag == 0) || (I2CInUse == 1)) return;
								I2CInUse = 1;
								// set write flag
							    writeflag = 0;
								switch (parseInt(node.uotype))
								{
									case 0 :
										if (val==1) node.status({fill:"green",shape:"dot",text:"1"});
										else        node.status({fill:"grey",shape:"dot",text:"0"});
										typeval = 0;
									break;
									case 1 : 
										node.status({fill:"green",shape:"dot",text: val.toString()+" %"});
										typeval = 1;
									break;
									case 2 : 
										node.status({fill:"green",shape:"dot",text: val.toString()+" %"});
										typeval = parseInt(node.pwm);
									break;
								}
								pic.writeUO(parseInt(node.module),parseInt(node.output),typeval,val,function(err)
								{
									if (err) node.error(err);

									var msg = {topic:node.name,payload:Number(val)};
									node.send(msg);
									
									I2CInUse = 0;
								});
							},100);
		
		
		this.on('input', function(msg) 
                         {
                            val = parseInt(msg.payload);
							// set write flag
							writeflag = 1;
                         });
    }
    
    RED.nodes.registerType("writeUO",writeUONode);
	
	writeUONode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
}