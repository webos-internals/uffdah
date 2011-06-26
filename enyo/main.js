enyo.kind({
	name: 'Uffdah.Main',
	kind: enyo.VFlexBox,
	
	components: [
		
		{name: 'killTailMessages', kind: 'PalmService', service: 'palm://org.webosinternals.uffdah/', method: 'killTailMessages'},
		
		{kind: 'AppMenu', components: [
			//{kind: 'EditMenu'},
			{caption: 'Test', onclick: 'menuTest'},
			{caption: 'Clear Log File', onclick: 'menuClear'},
			{caption: 'Preferences', onclick: 'menuPrefs'},
		]},
		
		{name: 'prefs', kind: 'uffdah.Preferences'},
		{name: 'stats', kind: 'uffdah.Stats'},
		
		{kind: 'SlidingPane', flex: 1, wideWidth: 800, components: [
		
			{name: 'main', kind: 'enyo.SlidingView', width: '320px', components: [
			
				{kind: wi.Header, random: [
					//{weight: 30, tagline: 'Always Watching The Log'},
					{weight: 20, tagline: 'Sleep All Night, Work All Day'},
					{weight: 20, tagline: 'Enyo-Face'},
					{weight: 10, tagline: 'I\'m OK'},
					{weight: 5,  tagline: '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R3Q2EUA52WJ7A">Donated</a> To WebOS Internals Lately?'},
					//{weight: 1,  tagline: 'Is A Logger... Get it?'}
				]},
				
				{className: 'main-list', components: [
					{name: 'filterItem', kind: 'uffdah.FilterPopup', className: 'main-item'},
					{name: 'getItem',  kind: 'uffdah.MainItem', className: 'main-item', label: 'Retrieve Log',        icon: 'get',  onclick: 'popGet'},
					{name: 'tailItem', kind: 'uffdah.MainItem', className: 'main-item', label: 'Follow Log',          icon: 'tail',  onclick: 'popTail'},
					{name: 'wormItem', kind: 'uffdah.MainItem', className: 'main-item', label: 'Resource Monitor',    icon: 'worm', disabled: true},
					{name: 'busItem',  kind: 'uffdah.MainItem', className: 'main-item', label: 'Service Bus Monitor', icon: 'bus',  disabled: true},
				]},
				
				//{kind: 'Button', caption: 'test', onclick: 'test'},
				
			]},
			
		]},
	],
	
	initComponents: function() {
	    this.inherited(arguments);
		this.$.slidingPane.createComponent(this.getBlankPanel(), {owner: this});
	},
	rendered: function() {
	    this.inherited(arguments);
		this.$.killTailMessages.call();
	},
	
	getBlankPanel: function() {
		var r = Math.floor(Math.random() * 5);
		switch (r) {
			case 0: var stat = formatSize(this.$.stats.getStat('getTotalSize')) + ' of log data retrieved'; break;
			case 1: var stat = this.$.stats.getStat('appsUsed').length + ' app' + (this.$.stats.getStat('appsUsed').length == 1 ? '' : 's') + ' logged'; break;
			case 2: var stat = this.$.stats.getStat('logsViewed') + ' log' + (this.$.stats.getStat('logsViewed') == 1 ? '' : 's') + ' viewed'; break;
			case 3: var stat = this.$.stats.getStat('logsFollowed') + ' log' + (this.$.stats.getStat('logsFollowed') == 1 ? '' : 's') + ' followed'; break;
			case 4: var stat = this.$.stats.getStat('linesFollowed') + ' line' + (this.$.stats.getStat('linesFollowed') == 1 ? '' : 's') + ' watched'; break;
			default: var stat = ''; break;
		}
		return {name: 'blank', kind: 'enyo.SlidingView', flex: 1, peekWidth: 320, className: 'blank-slider', dragAnywhere: false, components: [
			{kind: enyo.VFlexBox, align: 'center', pack: 'center', width: '100%', height: '100%', components: [
				{content: stat, className: 'centered'}
			]},
		]};
	},
	
	popGet: function() {
		this.destroyBlank();
		if (this.$.secondary) this.$.secondary.destroy();
		this.$.slidingPane.createComponent({name: 'secondary', kind: 'enyo.SlidingView', flex: 1, peekWidth: 66, components: [
			{name: 'getLog', kind: 'uffdah.GetLog', className: 'log', panelNum: this.panelNum, onClose: 'destroySecondary',
				filter: this.$.filterItem.filter, custom: this.$.filterItem.custom}
		]}, {owner: this});
		this.$.slidingPane.render();
	},
	popTail: function() {
		this.destroyBlank();
		if (this.$.secondary) this.$.secondary.destroy();
		this.$.slidingPane.createComponent({name: 'secondary', kind: 'enyo.SlidingView', flex: 1, peekWidth: 66, components: [
			{name: 'tailLog', kind: 'uffdah.TailLog', className: 'log', panelNum: this.panelNum, onClose: 'destroySecondary',
				filter: this.$.filterItem.filter, custom: this.$.filterItem.custom}
		]}, {owner: this});
		this.$.slidingPane.render();
	},
	
	destroyBlank: function() {
		if (this.$.blank) this.$.blank.destroy();
	},
	destroySecondary: function(inSender) {
		if (this.$.secondary) this.$.secondary.destroy();
		this.$.slidingPane.createComponent(this.getBlankPanel(), {owner: this});
		this.$.main.select();
		this.$.slidingPane.render();
	},
	getSlidingParent: function(e) {
		while (e.kind != 'enyo.SlidingView') {
			e = e.parent;
		}
		return e;
	},
	
	test: function() {
		
	},
	
	getResponse: function(inSender, inResponse) {
		this.log(inSender);
		this.log(inResponse);
	},
	
	menuTest: function() {
		this.log('LOG TEST');
		this.warn('WARN TEST');
		this.error('ERROR TEST');
	},
	menuPrefs: function() {
		this.$.prefs.pop();
	},
	menuClear: function() {
		this.$.clearMessages.call();
	},
	clearMessagesResponse: function(inSender, inResponse) {
		this.log(inSender);
		this.log(inResponse);
	},
	
});
