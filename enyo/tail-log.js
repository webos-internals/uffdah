enyo.kind({
	name: 'uffdah.TailLog',
	kind: enyo.VFlexBox,
	height: '100%',
	
	published: {
		filter: '',
		custom: ''
	},
	events: {
		onClose: ''
	},
	
	components: [
		
		{name: 'stats', kind: 'uffdah.Stats'},
		
		{name: 'tailMessages', kind: 'PalmService', subscribe: true, service: 'palm://org.webosinternals.uffdah/', method: 'tailMessages', onResponse: 'tailMessagesResponse'},
		{name: 'killTailMessages', kind: 'PalmService', service: 'palm://org.webosinternals.uffdah/', method: 'killTailMessages', onResponse: 'killTailMessagesResponse'},
		
		{name: 'tag', className: 'tag'},
		
		{name: 'h1', kind: 'Header', className: 'header', components: [
				{kind: 'GrabButton'},
				{name: 'title', className: 'title', content: 'Retrieve Log', flex: 1},
				{kind: 'Button', caption: 'O', style: 'margin: -10px 5px;', onclick: 'pop'},
				{kind: 'Button', caption: 'X', className: 'enyo-button-negative', onclick: 'close'},
		]},
		
		{name: 'data', kind: 'wi.FlyweightAwesomeList', data: [], height: '100%', bottomUp: true, onSetupRow: 'setupRow', components: [
			{name: 'logItem', kind: 'uffdah.LogItem'}
	    ]},
	],
	
	rendered: function() {
	    this.inherited(arguments);
		this.$.stats.addStat('logsFollowed', 1);
		if (this.filter == 'every') {
		} else if (this.filter == 'allapps') {
		} else if (this.filter == 'custom') {
		} else {
			this.$.stats.addStat('appsUsed', this.filter);
		}
		this.$.title.setContent('Follow Log');
		if (this.owner && this.owner.$.getItem) {
			var oo = this.owner.$.tailItem.getOffset();
			this.$.tag.applyStyle('top', oo.top + 'px');
			this.$.tag.show();
		} else {
			this.$.tag.hide();
		}
		this.$.tailMessages.call();
	},
	
	setupRow: function(inSender, inMessage, inIndex) {
		if (this.filter == 'allapps' || this.filter == 'every' || this.filter == 'custom') inMessage.rowClass += ' showapp';
		this.$.logItem.update(inMessage);
	},
	
	tailMessagesResponse: function(s, payload) {
		if (payload && payload.returnValue) {
			if (payload.stage == 'status' && payload.status != '') {
				var line = parser.parse(payload.status, this.filter, this.custom);
				if (line && line.length > 0) {
					this.$.stats.addStat('linesFollowed', 1);
					this.$.data.data.unshift(line[0]);
					this.$.data.refresh();
				}
			}
		} else {
			this.stop();
		}
	},
	
	stop: function() {
		this.$.tailMessages.cancel();
		this.$.killTailMessages.call();
	},
	
	close: function() {
		this.stop();
		this.doClose(this);
	},
	
	pop: function() {
		stop();
		this.$.killTailMessages.call();
	},

	
});

