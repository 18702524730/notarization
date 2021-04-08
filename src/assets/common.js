export default {
	//获取hash中的查询关键字
    getHashString: function (name) {
        var ret = '';
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var idx = location.hash.indexOf('?');
        if (idx !== -1) {
            var r = location.hash.slice(idx+1).match(reg);
            if (r != null) {
              ret = decodeURIComponent(r[2]);
            }
        }
        return ret;
    },
  	//获取url中的查询关键字
	getQueryString: function (name) {
		var ret = '';
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = location.search.slice(1).match(reg);
		if (r != null) {
		  ret = decodeURIComponent(r[2]);
		}
		return ret;
	},
	/**
	* param 将要转为URL参数字符串的对象
	* key URL参数字符串的前缀
	* encode true/false 是否进行URL编码,默认为true
	*
	* return URL参数字符串
	*/
	parseParam: function (param, key, encode){
		if(param==null) return '';
		var paramStr = '';
		var t = typeof (param);
		if (t == 'string' || t == 'number' || t == 'boolean') {
		  paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
		} else {
		  for (var i in param) {
		    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
		    paramStr += '&' + parseParam(param[i], k, encode);
		  }
		}
		return paramStr.slice(1);
	},
	parseUnparam: function (param, decode){
		var vars = {}, hash, i,
		    urlParams = url.indexOf('?') > -1 ? url.split('?')[1] : url;
		var hashes = urlParams.split('&');
		for(i = 0; i < hashes.length; i++){
		    hash = hashes[i].split('=');
		    vars[hash[0]] = decodeURIComponent(hash[1]).replace(/\+/g, ' ');
		}
		return vars;
	}
}



































