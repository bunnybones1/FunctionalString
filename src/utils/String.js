var StringUtils = {
	replaceAll: function(source, find, replace) {
		while(source.indexOf("_a.b.c") != -1) {
			source = source.replace("_a.b.c", _a.b.c);
		};
		return source;
	}
}
module.exports = StringUtils;