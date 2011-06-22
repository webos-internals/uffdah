// get the cookies
var prefs = new preferenceCookie();
var vers =  new versionCookie();

// stage names
var mainStageName = 'saverestore-main';
var dashStageName = 'saverestore-dash';

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params)
{
    var mainStageController = this.controller.getStageController(mainStageName);
	
    try {
	if (!params) {
	    if (mainStageController) {
		mainStageController.popScenesTo('main');
		mainStageController.activate();
	    }
	    else {
		this.controller.createStageWithCallback({name: mainStageName, lightweight: true},
							this.launchFirstScene.bind(this));
	    }
	} else {
	    if (params.action === "autoSave") {
			if(params.autoSave === "startup") {
				var dash = Mojo.Controller.getAppController().getStageProxy(dashStageName);
				if (dash) {
					dash.activate();
				}
			} else if(params.autoSave === "complete" || params.autoSave === "scheduled") {
				return false;
			} else {
				this.executeAutoSave();				
			}
	    }
	}
    }
    catch (e) {
	Mojo.Log.logException(e, "AppAssistant#handleLaunch");
    }
};

AppAssistant.prototype.executeAutoSave = function() {

    var p = prefs.get(true);
    if (p.autoSave && (p.autoSaveFrequency > 0)) {
	this.scheduleAutoSave();
    }
	
	Mojo.Controller.getAppController().createStageWithCallback(
		{name: dashStageName, lightweight: true},
	    function(stageController){
    		stageController.pushScene('autosave');
		},
		'dashboard');
};

AppAssistant.prototype.cancelAutoSave = function() {
	
    new Mojo.Service.Request("palm://com.palm.power/timeout", {
	    method: "clear",
	    parameters: {
		"key": "org.webosinternals.saverestore.autoSave",
		"uri": "palm://com.palm.applicationManager/launch",
	    },
	    onSuccess:function() { Mojo.Log.info("autoSave cancelled"); }
	});
};

AppAssistant.prototype.scheduleAutoSave = function() {
  
    var p = prefs.get(true);
  
    if (!p.autoSave) return;
  
    try {
	var when = new Date();
	var t = new Date(p.autoSaveTime);
	when.setHours(t.getHours());
	when.setMinutes(t.getMinutes());
	when.setSeconds(0);
	
	// if frequency = 1 and when > now, schedule auto save for later today
	// otherwise, add frequency to current date
	if (when < new Date() || p.autoSaveFrequency > 1) {
		when.setDate(when.getDate() + parseInt(p.autoSaveFrequency));
	}
    
	    var at = (when.getUTCMonth()+1)+"/"+when.getUTCDate()+"/"+when.getUTCFullYear()+" "+when.getUTCHours()+":"+when.getUTCMinutes()+":00";

	new Mojo.Service.Request("palm://com.palm.power/timeout", {
		method: "set",
		    parameters: {
		    "wakeup": true,
			"key": "org.webosinternals.saverestore.autoSave",
			"uri": "palm://com.palm.applicationManager/launch",
			"params": '{"id":"' + Mojo.appInfo.id + '","params":{"action":"autoSave"}}',
			"at": at
			},
		    onSuccess:function() {
				var pad = function(n) { return (n<10) ? "0"+n : n; }
				var shortDate = pad(when.getDate()) + "/" + pad(when.getMonth()+1) + "/" + when.getFullYear() + " " + pad(when.getHours()) + ":" + pad(when.getMinutes());
				Mojo.Controller.getAppController().showBanner($L("Next Auto-Save: ") + shortDate, {action:"autoSave",autoSave:"scheduled"}, "autoSave"); 
			},
		    onFailure: function(e) { Mojo.Log.error("alarm failed %j",e); }
	});
    } catch(e) {
	Mojo.Log.logException(e, "AppAssistant#scheduleAutoSave");
    }
}

AppAssistant.prototype.launchFirstScene = function(controller)
{
    vers.init();
    if (vers.showStartupScene()) {
	controller.pushScene('startup');
    }
    else {
	controller.pushScene('main');
    }
};

AppAssistant.prototype.cleanup = function() {
};
