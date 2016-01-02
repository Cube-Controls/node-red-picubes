module.exports = function(RED) {
    var pic = require('node-picubes');
	var time = require('time');
	
	I2CInUse = 0;
    
    function readUINode(config) {
        RED.nodes.createNode(this,config);
        
		this.prefix = config.prefix;
        this.module = config.module;
        this.input = config.input;
		this.uitype = config.uitype;
		this.scan = config.scan;
		this.unit = config.unit;
		this.interval_id = null;
		var node = this;
		var value = 0;
		var lasttime = time.time() - 2 * parseInt(node.scan);
			

		// Set interval
		this.interval_id = setInterval(function()
							{
								if (time.time() < (lasttime + parseInt(node.scan))) return;
							    if (I2CInUse == 1) return;
								I2CInUse = 1;
							    // read UI module 
								pic.readUI(parseInt(node.module),parseInt(node.input),parseInt(node.uitype),function(err,data)
								{
									if (err) node.log(err);
						  
									if (data != null) 
									{
										value = data;
										// emit on input
										node.emit("input",{});
									}	
									I2CInUse = 0;
								}); 
							    // remember time from last read
			                    lasttime = time.time();	
							},100);
		                     
		this.on('input', function(msg) 
						{
							// conversion
							if ((node.uitype == 3) && (node.unit == 1)) value = (value/100)*1.8+32; else
							if (node.uitype == 2 ) value = value / 10; else
							if (node.uitype == 3 ) value = value / 100; 
						    
							switch (parseInt(node.uitype))
							{
								case 0:
									this.status({fill:"green",shape:"dot",text: value.toString()+' Ohms'});
								break;	
								case 1:
								    if (value==1) this.status({fill:"green",shape:"dot",text:"1"});
							        else         this.status({fill:"grey",shape:"dot",text:"0"});								
								break;
								case 2:
									this.status({fill:"green",shape:"dot",text: value.toString()+' %'});
								break;
								case 3:
								    if (node.unit==0) this.status({fill:"green",shape:"dot",text: value.toString()+ ' C'+ String.fromCharCode(176)});
							        else              this.status({fill:"green",shape:"dot",text: value.toString()+ ' F'+ String.fromCharCode(176)});								
								break;
								case 4:
									this.status({fill:"green",shape:"dot",text: value.toString()});
								break;								
								
							}
								
							var msg = {topic:node.name, payload:Number(value)};
							this.send(msg);
								
							msg = null;
						});
	
	}
    
    RED.nodes.registerType("readUI",readUINode);
	
	readUINode.prototype.close = function(){
		if (this.interval_id != null) 
		{
			clearInterval(this.interval_id);
		}
	}
}