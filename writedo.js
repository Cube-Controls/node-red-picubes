module.exports = function(RED) {
    var pic = require('node-picubes');
    
    function writeDONode(config) {
        RED.nodes.createNode(this,config);
        this.prefix = config.prefix;
		this.name = config.name;
        this.module = config.module;
        this.output = config.output;
        var node = this;
        var val = 0;
        this.on('input', function(msg) 
                         {
                           
                            if (msg.payload == '0') val = 0;
                            else                    val = 1;
							if (val==1) this.status({fill:"green",shape:"dot",text:"1"});
							else        this.status({fill:"grey",shape:"dot",text:"0"});
							
							var msg = {topic:node.name,payload:Number(val)};
							this.send(msg);
                            
							pic.writeDO(parseInt(node.module),parseInt(node.output),val,function(err)
                            {
                                if (err) node.error(err);
                            });
            
                         });
    }
    
    RED.nodes.registerType("writeDO",writeDONode);
}