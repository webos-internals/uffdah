enyo.kind({
	name: 'uffdah.LogItem',
	kind: enyo.Item,
	layoutKind: 'HFlexLayout',
	
	components: [
        {name: 'type', className: 'type'},
        {name: 'app', className: 'app'},
        {flex: 1, name: 'message', className: 'message'},
	],
	
	update: function(msg) {
		this.setClassName('enyo-item logItem ' + msg.rowClass);
		this.$.type.setContent(msg.type);
		this.$.app.setContent(msg.app);
		this.$.message.setContent(msg.message);
	},
	
});
