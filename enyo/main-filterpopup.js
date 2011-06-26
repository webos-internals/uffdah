enyo.kind({
	name: 'uffdah.FilterPopup',
	kind: 'Item',
	layoutKind: 'HFlexLayout',
	align: 'center',
	tapHighlight: true,
	
	filter: 'allapps',
	custom: '',
	
	components: [
	
		{name: 'listApps', kind: 'PalmService', service: 'palm://org.webosinternals.uffdah/', method: 'listApps', onResponse: 'listAppsResponse'},
		
		{name: 'popup', kind: enyo.Popup, className: 'filter-popup', height: '100%', width: '320px',
			scrim: true, scrimClassName: 'filter-popup-scrim', showHideMode: 'transition', openClassName: 'open',
			onBeforeOpen: 'popupBeforeOpen', onOpen: 'popupOpen', onClose: 'popupClosed', components: [
			
			{className: 'top-bottom-fade'}, {className: 'noblank-fade'},
	    	{kind: 'FadeScroller', flex: 1, height: '100%', autoVertical: true, components: [
			
				{kind: 'Item', className: 'enyo-first', components: [
					{name: 'customInput', kind: 'Input', hint: 'Custom', selectAllOnFocus: true, onkeypress: 'keyCustom'},
				]},
				{kind: 'Item', content: 'Everything', className: 'enyo-last', tapHighlight: true, onclick: 'clickEverything'},
				{kind: 'Divider', caption: 'Applications'},
				{kind: 'Item', content: 'All Applications', className: 'enyo-first', tapHighlight: true, onclick: 'clickAllApps'},
				{name: 'apps'},
				
			]},
		]},
		
		{name: 'icon', className: 'icon'},
		{name: 'text', flex: 1},
		{name: 'arrow', className: 'enyo-listselector-arrow arrow'}
	],
	
	rendered: function() {
		if (this.filter == 'every') {
			this.$.text.setContent('Everything');
			this.$.icon.setClassName('icon filter');
		} else if (this.filter == 'allapps') {
			this.$.text.setContent('All Applications');
			this.$.icon.setClassName('icon app');
		}
		this.$.listApps.call();
	},
	
	doClick: function() {
		this.$.popup.removeClass('nopeek');
		if (this.owner.$.slidingPane.getViewIndex() == 0) {
			this.$.popup.addClass('nopeek');
		}
		this.$.popup.openAroundControl(this, true, "left");
		this.$.popup.applyStyle('overflow', 'visible');
	},
	popupClose: function() {
		this.$.popup.close();
	},
	
	popupBeforeOpen: function() {
	},
	popupOpen: function() {
		this.$.text.setContent('What to Look for:');
		this.$.icon.setClassName('icon filter');
		this.$.popup.removeClass('noblank');
		if (!this.owner.$.blank) this.$.popup.addClass('noblank');
		if (this.$.apps.children.length == 0) {
			this.renderApps();
		}
	},
	popupClosed: function() {
		if (this.filter == 'every') {
			this.$.text.setContent('Everything');
			this.$.icon.setClassName('icon filter');
		} else if (this.filter == 'allapps') {
			this.$.text.setContent('All Applications');
			this.$.icon.setClassName('icon app');
		} else if (this.filter == 'custom') {
			this.$.text.setContent(this.custom);
			this.$.icon.setClassName('icon filter');
		} else {
			if (this.apps) {
				for (var a = 0; a < this.apps.length; a++) {
					if (this.apps[a].id == this.filter) {
						this.$.text.setContent(this.apps[a].title);
						this.$.icon.setClassName('icon app');
					}
				}
			}
		}
	},
	
	
	keyCustom: function(inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.filter = 'custom';
			this.custom = this.$.customInput.getValue();
			this.popupClose();
		}
	},
	clickEverything: function() {
		this.filter = 'every';
		this.custom = '';
		this.popupClose();
	},
	clickAllApps: function() {
		this.filter = 'allapps';
		this.custom = '';
		this.popupClose();
	},
	clickApp: function(inSender) {
		this.filter = this.apps[inSender.index].id;
		this.custom = '';
		this.popupClose();
	},
	
	renderApps: function() {
		if (this.apps) {
			//this.log(this.apps);
			for (var a = 0; a < this.apps.length; a++) {
				if (this.apps[a].removable == true) {
					this.$.apps.createComponent({kind: 'Item', content: this.apps[a].title, index: a,
						className: (a == this.apps.length-1 ? 'enyo-last' : 'enyo'), tapHighlight: true, onclick: 'clickApp'}, {owner: this});
				}
			}
		}
		this.$.apps.render();
	},
	
	listAppsResponse: function(s, payload) {
		if (payload.apps && payload.apps.length > 0) {
			this.apps = payload.apps;
		}
		if (this.$.popup.isOpen) {
			this.renderApps();
		}
	},
	
});
