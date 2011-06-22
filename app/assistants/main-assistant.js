function MainAssistant() {
    // subtitle random list
    this.randomSub = 
	[
	 {weight: 30, text: $L('The Open Source Solution')},
//	 {weight: 15, text: $L('Do It Before It Is Too Late')},
	 {weight: 6, text: $L("<a href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HLSTYY3RCKVY2\">Donated</a> To WebOS Internals Lately?")},
	 {weight:  2, text: $L('Random Taglines Are Awesome')},
//	 {weight:  2, text: $L('We Know Palm Loves Save/Restore')},
	 {weight:  2, text: $L('Now With More Cowbell')}
	 ];

    // setup list model
    this.mainModel = {items:[]};

    // setup menu
    this.menuModel =
    {
	visible: true,
	items:
	[
    {
	label: $L("Preferences"),
	command: 'do-prefs'
    },

			{
				label: $L("Manage Storage"),
				command: 'do-feeds'
			},

    {
	label: $L("Help"),
	command: 'do-help'
    },

	 ]
    };
}

MainAssistant.prototype.setup = function() {
	
    // set theme because this can be the first scene pushed
    this.controller.document.body.className = prefs.get().theme;
	
	
    this.controller.get('main-title').innerHTML = $L('Uffdah');
    this.controller.get('version').innerHTML = $L('v0.0.0');
    this.controller.get('subTitle').innerHTML = $L('Get at your Stuff');	

    // get elements
    this.overlay = this.controller.get('overlay'); this.overlay.hide();
    this.controller.setupWidget('spinner', {spinnerSize: 'large'}, {spinning: false});
    this.spinner = this.controller.get('spinner');
    this.spinner.style.top = parseInt((this.controller.window.innerHeight - 128) / 2) + "px";
    this.spinner.style.left = parseInt((this.controller.window.innerWidth - 128) / 2) + "px";
    
    this.versionElement =  this.controller.get('version');
    this.subTitleElement = this.controller.get('subTitle');
    this.listElement =     this.controller.get('mainList');

    // handlers
    this.listTapHandler =		this.listTap.bindAsEventListener(this);
	
    this.versionElement.innerHTML = "v" + Mojo.Controller.appInfo.version;
    this.subTitleElement.innerHTML = this.getRandomSubTitle();

    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
    this.mainModel.items.push({
	    name:     $L('Scene1'),
		style:    'enabled',
		scene:    'save',
		//pkgCount: appDB.appsAvailable.length
		});
  /*  this.mainModel.items.push({
	    name:     $L('Restore Application Data'),
		style:    'disabled',
		scene:    'restore',
		pkgCount: appDB.appsSaved.length
		});
    this.mainModel.items.push({
	    name:     $L('Supported Applications'),
		style:    'disabled',
		scene:    'list',
		pkgCount: appDB.appsWithScripts.length
		});
    this.mainModel.items.push({
	    name:     $L('Installed Applications'),
		style:    'disabled',
		scene:    'installed',
		pkgCount: appDB.appsInstalled.length
		});*/
    
    // setup widget
    this.controller.setupWidget('mainList', { itemTemplate: "main/rowTemplate", swipeToDelete: false, reorderable: false }, this.mainModel);
    this.controller.listen(this.listElement, Mojo.Event.listTap, this.listTapHandler);

    // Load the application database
    appDB.reload = true;
};

MainAssistant.prototype.listTap = function(event)
{
    if (event.item.scene === false || event.item.style == 'disabled') {
	// no scene or its disabled, so we won't do anything
    }
    else {
	// push the scene
	this.controller.stageController.pushScene(event.item.scene, event.item);
    }
};

MainAssistant.prototype.updateList = function(final)
{
    this.mainModel.items[0].style = 'showCount';
    this.mainModel.items[0].pkgCount = appDB.appsAvailable.length;
    this.mainModel.items[1].style = 'showCount';
    this.mainModel.items[1].pkgCount = appDB.appsSaved.length;
    this.mainModel.items[2].style = 'showCount';
    this.mainModel.items[2].pkgCount = appDB.appsWithScripts.length;
    this.mainModel.items[3].style = 'showCount';
    this.mainModel.items[3].pkgCount = appDB.appsInstalled.length;
    this.listElement.mojo.noticeUpdatedItems(0, this.mainModel.items);

    if (final) {
	this.spinner.mojo.stop();
	this.overlay.hide();
    }
};
    
MainAssistant.prototype.getRandomSubTitle = function()
{
	// loop to get total weight value
	var weight = 0;
	for (var r = 0; r < this.randomSub.length; r++)
	{
		weight += this.randomSub[r].weight;
	}
	
	// random weighted value
	var rand = Math.floor(Math.random() * weight);
	//alert('rand: ' + rand + ' of ' + weight);
	
	// loop through to find the random title
	for (var r = 0; r < this.randomSub.length; r++)
	{
		if (rand <= this.randomSub[r].weight)
		{
			return this.randomSub[r].text;
		}
		else
		{
			rand -= this.randomSub[r].weight;
		}
	}
	
	// if no random title was found (for whatever reason, wtf?) return first and best subtitle
	return this.randomSub[0].text;
}

MainAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-prefs':
				this.controller.stageController.pushScene('preferences');
				break;
	
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
			case 'do-feeds':
				this.controller.stageController.pushScene('configs');
				break;


		}
	}
}

MainAssistant.prototype.activate = function(event) {
    if (appDB.reload) {
	for (var i = 0; i = this.mainModel.items.length; i++) {
	    this.mainModel.items[i].style = 'disabled';
	    this.mainModel.items[i].pkgCount = 0;
	}
	this.listElement.mojo.noticeUpdatedItems(0, this.mainModel.items);
	/*var appController = Mojo.Controller.getAppController();
	appController.showBanner({ messageText: $L("Loading archive data ...") }, {}, "initApps");
	this.overlay.show();
	this.spinner.mojo.start();
	appDB.initApps(this.updateList.bind(this));*/
    }
};

MainAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
    this.controller.stopListening(this.listElement, Mojo.Event.listTap, this.listTapHandler);
};
