function PreferencesAssistant()
{
    // setup default preferences in the preferenceCookie.js model
    this.cookie = new preferenceCookie();
    this.prefs = this.cookie.get();
	
    // for secret group
    this.secretString = '';
    this.secretAnswer = 'iknowwhatimdoing';
	
    this.autoSavePropertyChangeHandler = this.onAutoSaveChange.bind(this);
	
    // setup menu
    this.menuModel =
	{
	    visible: true,
	    items:
	    [
    {
	label: $L("Help"),
	command: 'do-help'
    }
	     ]
	}
	
    if (this.prefs.autoSave === undefined) {
	this.prefs.autoSave = false;
	this.prefs.autoSaveTime = new Date();
	// rounding to nearest 15 minute interval
	this.prefs.autoSaveTime.setMinutes(Math.round(this.prefs.autoSaveTime.getMinutes()*4/60)*15);
	this.prefs.autoSaveFrequency = 1;
    } else {
	// have to parse date because time picker expects a date object
	// will be converted back to string on cookie.put
	this.prefs.autoSaveTime = new Date(this.prefs.autoSaveTime);
    }
};

PreferencesAssistant.prototype.setup = function()
{
    this.controller.get('preferences-title').innerHTML = $L('Preferences');
    this.controller.get('preferences-global').innerHTML = $L('Global');
    this.controller.get('secret-stuff').innerHTML = $L('Secret Stuff');
    this.controller.get('secret-options').innerHTML = $L('This version has no secret options.');


    try {
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
		
	// set this scene's default transition
	this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
		
	// Global Group
	this.controller.setupWidget
	    (
	     'theme',
	     {
		 label: $L('Theme'),
		     choices:
		 [
		  {label:$L('Palm Default'),	value:'palm-default'},
		  {label:$L('Palm Dark'),		value:'palm-dark'}
		  ],
		     modelProperty: 'theme'
		     },
	     this.prefs
	     );
		
	this.controller.listen('theme', Mojo.Event.propertyChange, this.themeChanged.bindAsEventListener(this));
		
	// Secret Group
	this.keyPressHandler = this.keyPress.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressHandler);
		
	// hide secret group
	this.controller.get('secretPreferences').style.display = 'none';
		
	this.controller.setupWidget("autoSave", {"label":$L("Auto Save"),"modelProperty":"autoSave"}, this.prefs);
	this.controller.setupWidget("autoSaveDrawer", {"unstyled":true}, {open:(this.prefs.autoSave === true)});
	this.controller.setupWidget("autoSaveTime", {"label":$L("At"),"modelProperty":"autoSaveTime"}, this.prefs);
	this.controller.setupWidget("autoSaveFrequency", {"label":$L("Every N Days"),"modelProperty":"autoSaveFrequency","min":0,"max":30}, this.prefs);
		
    }
    catch (e) {
	Mojo.Log.logException(e, 'preferences#setup');
    }

};

PreferencesAssistant.prototype.onAutoSaveChange = function(e) {
    this.controller.get("autoSaveDrawer").mojo.setOpenState(e.value);
};

PreferencesAssistant.prototype.themeChanged = function(event)
{
    // set the theme right away with the body class
    this.controller.document.body.className = event.value;
    this.cookie.put(this.prefs);
};

PreferencesAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command) {
	switch (event.command) {
	case 'do-help':
	this.controller.stageController.pushScene('help');
	break;
	}
    }
};

PreferencesAssistant.prototype.keyPress = function(event)
{
    this.secretString += String.fromCharCode(event.originalEvent.charCode);
	
    if (event.originalEvent.charCode == 8) {
	this.secretString = '';
    }
	
    if (this.secretString.length == this.secretAnswer.length) {
	if (this.secretString === this.secretAnswer) {
	    this.controller.get('secretPreferences').style.display = '';
	    this.controller.getSceneScroller().mojo.revealElement(this.controller.get('secretPreferences'));
	    this.secretString = '';
	}
    }
    else if (this.secretString.length > this.secretAnswer.length) {
	this.secretString = '';
    }
};

PreferencesAssistant.prototype.alertMessage = function(title, message)
{
    this.controller.showAlertDialog({
	    onChoose: function(value) {},
	    allowHTMLMessage: true,
	    title: title,
	    message: message,
	    choices:[{label:$L('Ok'), value:""}]
	});
};

PreferencesAssistant.prototype.activate = function(event) {
    this.controller.listen(this.controller.get("autoSave"), Mojo.Event.propertyChange, this.autoSavePropertyChangeHandler);
};

PreferencesAssistant.prototype.deactivate = function(event)
{
    this.controller.stopListening(this.controller.get("autoSave"), Mojo.Event.propertyChange, this.autoSavePropertyChangeHandler);
    // reload global storage of preferences when we get rid of this stage
    var tmp = prefs.get(true);
    this.prefs.autoSaveTime = this.prefs.autoSaveTime.toLocaleString();
    this.cookie.put(this.prefs);
	
    // schedule or cancel auto save timer based on autoSave preference
    Mojo.Controller.getAppController().assistant[(this.prefs.autoSave) ? "scheduleAutoSave" : "cancelAutoSave"]();
};

PreferencesAssistant.prototype.cleanup = function(event) {};
