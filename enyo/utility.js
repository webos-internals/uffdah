formatSize = function(size) {
	var toReturn = size + $L(" B");
	var formatSize = size;
	if (formatSize > 1024) {
		formatSize = (Math.round((formatSize / 1024) * 100) / 100);
		toReturn = formatSize + $L(" KB");
	}
	if (formatSize > 1024) {
		formatSize = (Math.round((formatSize / 1024) * 100) / 100);
		toReturn = formatSize + $L(" MB");
	}
	if (formatSize > 1024) {
		formatSize = (Math.round((formatSize / 1024) * 100) / 100);
		toReturn = formatSize + $L(" GB");
	}
	return toReturn;
};