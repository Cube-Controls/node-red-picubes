module.exports = function(RED) {
    var pic = require('node-picubes');
    
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
		this.on('input', function(msg) 
                         {
                           
                            val = parseInt(msg.payload);
							switch (parseInt(node.uotype))
							{
							    case 0 :
								  if (val==1) this.status({fill:"green",shape:"dot",text:"1"});
							      else        this.status({fill:"grey",shape:"dot",text:"0"});
								  typeval = 0;
								break;
								case 1 : 
								  this.status({fill:"green",shape:"dot",text: val.toString()+" %"});
								  typeval = 1;
								break;
								case 2 : 
								  this.status({fill:"green",shape:"dot",text: val.toString()+" %"});
								  typeval = parseInt(node.pwm);
								break;
							}
							
							var msg = {topic:node.name,payload:Number(val)};
							this.send(msg);
							
                            pic.writeUO(parseInt(node.module),parseInt(node.output),typeval,val,function(err)
                            {
                                if (err) node.error(err);
                            });
            
                         });
    }
    
    RED.nodes.registerType("writeUO",writeUONode);
}