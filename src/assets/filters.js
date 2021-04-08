/*
 * vuejs 	过滤器
 * time 	2017年1月18日 18:46:54
 */

import Vue from 'vue';
import accounting from 'accounting';
function cutString(pStr, pLen) {
  // 原字符串长度
  var _strLen = pStr.length;
  var _tmpCode;
  var _cutString;
  // 默认情况下，返回的字符串是原字符串的一部分
  var _cutFlag = "1";
  var _lenCount = 0;
  var _ret = false;
  if (_strLen <= pLen/2) {
      _cutString = pStr;
      _ret = true;
  }
  if (!_ret) {
      for (var i = 0; i < _strLen ; i++ ) {
          if (isFull(pStr.charAt(i))) {
              _lenCount += 2;
          } else {
              _lenCount += 1;
          }
          if (_lenCount > pLen) {
              _cutString = pStr.substring(0, i);
              _ret = true;
              break;
          } else if (_lenCount == pLen) {
              _cutString = pStr.substring(0, i + 1);
              _ret = true;
              break;
          }
      }
  }
  if (!_ret) {
      _cutString = pStr;
      _ret = true;
  }
  if (_cutString.length == _strLen) {
      _cutFlag = "0";
  }
  return {"cutstring":_cutString, "cutflag":_cutFlag};
}
function isFull (pChar) {
  if ((pChar.charCodeAt(0) > 128)) {
      return true;
  } else {
      return false;
  }
}

export default {
	ellipsis: function (pStr, pLen) {
		if (!pStr) {
			return pStr
		}
		var _ret = cutString(pStr, pLen);
		var _cutFlag = _ret.cutflag;
		var _cutStringn = _ret.cutstring;

		if ("1" == _cutFlag) {
				return _cutStringn + "...";
		} else {
				return _cutStringn;
		}
	},
	/**
	  * 格式化数字，相当于vue1.0时的currency过滤器
	  * @param value 		传进来的数字
	  * @param symbol	 	货币称号，默认为人民币
	  * @param dat	 		保留的小数点位数，默认为2位
	  * @param return
	*/
	currency: function (value,symbol='¥',dat=2) {
	  return accounting.formatMoney(value,symbol,dat);
	}
}
