function parser() {
	
}

// DATE						2010-08-16T09:22:55.327301Z
parser.LogDateRegExp =		new RegExp(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(.*)$/);

// (every)
parser.LogRegExpEvery =		new RegExp(/^([^\s]*) \[(.*)\] (?:[^\s]*) ([^\.]*).([^\s]*) ([^:]*): (.*)$/);
// (mojo.log)				2010-08-15T01:47:25.448852Z [175956] palm-webos-device user.notice LunaSysMgr: {LunaSysMgrJS}: org.webosinternals.uffdah: Info: start, palmInitFramework346:2520
parser.LogRegExpApp =		new RegExp(/^([^\s]*) \[(.*)\] (?:[^\s]*) user.([^\s]*) LunaSysMgr: {LunaSysMgrJS}: ([^:]*): ([^:]*): (.*)$/);

parser.parseEvery = function(msg) {
	var l = false;

	var match = parser.LogRegExpEvery.exec(msg);
	if (match) {
		var d = parser.parseDate(match[1]);
		l = {
			app: match[5],
			id: match[5],
			date: (d ? d.month + '/' + d.day + ' ' + d.hour + ':' + d.min + ':' + d.sec : '?'),
			type: match[3] + '.' + match[4],
			rowClass: match[4],
			message: match[6].replace(/^{(.*)}: /, ''), //formatForHtml
			raw: msg,
			copy: (d ? '[' + d.year + '-' + d.month + '-' + d.day + ' ' + d.hour + ':' + d.min + ':' + d.sec + '] ' : '') +
				'(' + match[5] + ') ' + match[3] + '.' + match[4] + ': ' + match[6].replace(/^{(.*)}: /, '')
		};
	}
	
	return l;
}
parser.parseApp = function(msg) {
	var l = false;
	
	var match = parser.LogRegExpApp.exec(msg);
	if (match) {
		var d = parser.parseDate(match[1]);
		l = {
			app: match[4], //replace with title
			id: match[4],
			date: (d ? d.month + '/' + d.day + ' ' + d.hour + ':' + d.min + ':' + d.sec : '?'),
			type: match[5],
			rowClass: match[3],
			message: match[6].replace(/, file:\/\/\/(.*)/, ''), //formatForHtml
			raw: msg,
			copy: (d ? '[' + d.year + '-' + d.month + '-' + d.day + ' ' + d.hour + ':' + d.min + ':' + d.sec + '] ' : '') +
				'(' + match[4] + ') ' + match[5] + ': ' + match[6].replace(/, file:\/\/\/(.*)/, '')
		};
	}
	
	return l;
}

parser.parse = function(data, filter, custom) {
	var r = [];
	if (data){
		var ary = data.split("\n");
		if (ary.length > 0) {
			for (var a = 0; a < ary.length; a++) {
				var add = false;
				if (filter == 'every') {
					var msg = parser.parseEvery(ary[a]);
					add = true;
				} else if (filter == 'custom') {
					var msg = parser.parseEvery(ary[a]);
					if (msg && msg.raw.indexOf(custom) > -1) add = true;
				} else {
					var msg = parser.parseApp(ary[a]);
					if ((filter == 'allapps') ||
						(msg.id && filter.toLowerCase() == msg.id.toLowerCase()))
						add = true;
				}
				if (add && msg) r.unshift(msg); // unshift instead of pop so its in reverse order
			}
		}
	}
	return r;
}
parser.parseDate = function(string) {
	var da = parser.LogDateRegExp(string);
	if (da) {
		var dobj = {
			year:  da[1],
			month: da[2],
			day:   da[3],
			hour:  da[4],
			min:   da[5],
			sec:   da[6]
		};
		return dobj;
	}
	return false;
}
