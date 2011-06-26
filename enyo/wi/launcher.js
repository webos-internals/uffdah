enyo.kind({
	name: 'wi.Launcher',
	kind: enyo.Control,
	
	events: {
		onClose: ''
	},
	
	components: [
	
		{
			kind:					'ApplicationEvents',
			onWindowParamsChange:	'windowParamsChanged',
			onApplicationRelaunch:	'applicationRelaunched',
			onWindowActivated:		'windowActivated',
			onWindowDeactivated:	'windowDeactivated',
		},
		
		{name: 'client', kind: enyo.Control},
		
	],
	
	windowParamsChanged: function(inSender, inEvent) {
		this.log('-- windowParamsChanged');
		var p = inEvent.params;
		p = p ? enyo.json.stringify(p) : "no windowParams";
		this.log(window.name, p);
	},
	
	applicationRelaunched: function(inSender, inEvent) {
		this.log('-- applicationRelaunched');
		
	},
	
	windowActivated: function(inSender, inEvent) {
		this.log('-- windowActivated');
		
	},
	windowDeactivated: function(inSender, inEvent) {
		this.log('-- windowDeactivated');
		
	},
	
	
	pop: function() {
		//enyo.windows.openWindow("get-log.html", "", {wasLaunchedBy: window.name});
	},
	
});
