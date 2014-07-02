/*
* Common JavaScript Func
*/

/**
 * 键值对 key = calue ； 
 * expires = minutes*60*1000
 * domain 
 * 默认情况下，如果在某个页面创建了一个cookie，那么该页面所在目录中的其他页面也可以访问该cookie。如果这个目录下还有子目录，则在子目录中也可以访问。
 * secure 一个布尔类型的值，secure值为true时，在http中是无效的，在https中才有效。
 */

function setCookie(cookieName, cookieValue, minutes, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60000);
    var curcookie = encodeURI(cookieName) + '=' + encodeURI(cookieValue)
        + (expires ? '; expires=' + expires.toGMTString() : '')
        + (path ? '; path=' + path : '/')
        + (domain ? '; domain=' + domain : '')
        + (secure ? '; secure' : '');
    document.cookie = curcookie;
}

/*
 * 只能一次获取所有的cookie,用户必须自己解析
 */
function getCookie(name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? null : decodeURI(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

/*
 * 删除一个cookie,可以将其过期时间设置成过去的一个时间
 */
function deletecookie(CookieName, path) {
    if (getCookie(CookieName))
        document.cookie =
        CookieName + '=' +
        ((path) ? ';path=' + path : '') +
        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}

function convertToEncodedHtml(input) {
    ///<summary>
    /// Replace ' & > < \ to encoded entry in a string
    ///</summary>
    if (!input) {
        return "n/a";
    }
    return input.replace("&", "&amp;", "g")
    .replace(">", "&gt;", "g")
    .replace("<", "&lt;", "g")
    .replace("\"", "&quot;", "g")
    .replace("'", "&acute;", "g");
}

function convertSpecialChar(input) {
    ///<summary>
    ///Replace sepcial chars to accord with security requirement of IIS
    ///</summary>
    input = input.replace(":", "coloncolon");
    input = input.replace("&", "andand");
    return input;
}

String.prototype.format = function () {
    ///<summary>
    /// String.format to replace {0}, {1} by arguments
    ///</summary>
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
};

function isInt(v) {
    ///<summary>
    ///return true if the v is integer
    ///</summary>
    var vArr = v.match(/^[0-9]+$/);
    return (vArr == null) ? false : true;
}

function getRGBColor(rgbInit, hexStart, hexEnd, rangeStart, rangeEnd, currentIndex) {
    ///<summary>
    ///Make dynamic RGB color base on index and range. For example: when 100 between 0 to 150, try to find color for it from color range 0,255,0 to 246,255,0.
    ///</summary>
    ///<param name="rgbInit" type="String">rgb color value which has {0} and should be replaced</param>
    ///<param name="hexStart" type="Integer">color hex rang start</param>
    ///<param name="hexEnd" type="Integer">color hex rang end</param>
    ///<param name="rangeStart" type="Integer">calculate range start</param>
    ///<param name="rangeEnd" type="Integer">calculate range start</param>
    ///<param name="currentIndex" type="Integer">calculate current index</param>
    var scale = (currentIndex - rangeStart) / (rangeEnd - rangeStart);
    var hex = hexStart + (hexEnd - hexStart) * scale;
    return rgbInit.format(parseInt(hex));
}

function filteKeywordForSql(input) {
    ///<summary>
    /// Convert all special html entries
    ///</summary>
    ///<param name="input" type="String">input Html string</param>
    if (input != null) {
        input = input.replace("=", "", "g");
        input = input.replace(">", "", "g");
        input = input.replace("<", "", "g");
        input = input.replace("\"", "", "g");
        input = input.replace("'", "", "g");
        return input;
    }
    else
        return null;
}

function getRandomIntArray(rangeStart, rangeEnd, amount) {
    var rdms = new Array(amount);
    for (var i = 0; i < amount; i++) {
        rdms[i] = getRandomInt(rangeStart, rangeEnd);
    }
    return rdms;
}

function getRandomInt(rangeStart, rangeEnd) {
    ///<summary>
    ///Get random integer by range
    ///</summary>
    var vRdm = (Math.random() * (rangeEnd - rangeStart) + rangeStart);
    return Math.round(vRdm);
}

function cutStr(inputstr, len, deletestr) {
    ///<summary>
    ///cut string  and add ... after it.
    ///</summary>
    ///<param name="inputstr" type="String">String which you want to cut</param>
    ///<param name="len" type="Number">How many chars you want to keep</param>
    ///<param name="deletestr" type="String">string you want to delete</param>
    var outstr = inputstr;
    if (outstr != null) {
        if (outstr.length > 0) {
            if (deletestr != null) {
                if (outstr.indexOf(deletestr) > -1)
                    outstr = outstr.replace(deletestr, "");
            }
            if (outstr.length > len) {
                outstr = outstr.substring(0, len) + "...";
            }
        }
    }
    return outstr;
}

Array.prototype.contains = function (a) {
    ///<summary>
    ///Check if element contains in the array
    ///</summary>
    ///<param name="a" type="Object">One element object to be checked</param>
    try {
        if (this.indexOf && typeof this.indexOf == "function")
            return this.indexOf(a) > -1;
        for (var i in this) {
            if (this[i] == a)
                return true;
        }

        return false;
    } catch (e) { return false; }
};



Array.prototype.each = function (fn) {
    ///<summary>
    ///Execute function for each element in array and return result
    ///</summary>
    ///<param name="fn" type="Function">function to be executed</param>
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++) {
        var res = fn.apply(this, [this[i], i].concat(args));
        if (res != null) a.push(res);
    }
    return a;
};

Array.prototype.distinct = function () {
    ///<summary>
    ///Remove duplicate elements and return an array contains unique items
    ///</summary>
    var ra = new Array();
    for (var i = 0; i < this.length; i++) {
        if (!ra.contains(this[i])) {
            ra.push(this[i]);
        }
    }
    return ra;
};

Array.complement = function (a, b) {
    ///<summary>
    ///Get complement result from two arrays.
    ///</summary>
    ///<param name="a" type="Array">First array</param>
    ///<param name="b" type="Array">Second array</param>
    return Array.minus(Array.union(a, b), Array.intersect(a, b));
};

Array.intersect = function (a, b) {
    ///<summary>
    ///Get intersect result from two arrays.
    ///</summary>
    ///<param name="a" type="Array">First array</param>
    ///<param name="b" type="Array">Second array</param>
    return a.distinct().each(function (o) { return b.contains(o) ? o : null });
};

Array.minus = function (a, b) {
    ///<summary>
    ///Get minus result from two arrays.
    ///</summary>
    ///<param name="a" type="Array">First array</param>
    ///<param name="b" type="Array">Second array</param>
    return a.distinct().each(function (o) { return b.contains(o) ? null : o });
};

Array.union = function (a, b) {
    ///<summary>
    ///Get union result from two arrays.
    ///</summary>
    ///<param name="a" type="Array">First array</param>
    ///<param name="b" type="Array">Second array</param>
    return a.concat(b).distinct();
};

//Last callback - Cloud added 
function CallbackL() {
    //callback function (最后一个参数为回调函数)
    var func;
    arguments[0] && (func = arguments[0][arguments[0].length - 1]);
    typeof func == "function" && func();
}