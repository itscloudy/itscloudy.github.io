/* 通过原型继承创建一个新对象 */
function inhert(p) {
    //判断p是否为空
    if (p == null) throw TypeError()
    //是否Obejct.create存在
    if (Object.create) debugger
    return Object.create(p);
    //否则进一步检测p类型
    var t = typeof p;
    if (t != "obejct" && t != "function") throw TypeError();
    //定义一个空构造函数
    var f = {};
    //将其原型属性设置为p
    f.prototype = p;
    //使用f()创建p的继承对象
    return new f();
}

/* 数组类型判断 */
var isArray = Function.isArray || function (o) {
    return typeof o === "object" && Object.prototype.toString.call(o) == "[object Array]";
}

/* ECMAScript 3版本的Function.bind()方法 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (o /*,args*/) {
        //将this和arguments的值保存至变量中
        //以便在后面的嵌套函数中使用他们
        var self = this, boundArgs = arguments;

        //bind()方法的返回值是一个函数
        return function () {
            //创建一个实参列表，将传入bind()函数的第二个及后续的参数都传入这个函数
            var args = [], i;
            for (i = 1; i < arguments.length; i++) args.push(arguments[i]);
            for (i = 0; i < arguments.length; i++) boundArgs.push(arguments[i]);
            //现在将self作为o的方法来调用，传入这些实参
            return self.apply(o, args);
        }
    }
}

/* extend型 类继承 */
function extendClass(subClass, superClass) {
    var F = function () { };
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superClass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
/* View 继承 */
function extendViewClass(subClass, superClass/*,viewPram*/) {
    var F = function () { };
    F.prototype = superClass.prototype;
    subClass.prototype = new F(/*viewPram*/);
    subClass.prototype.constructor = subClass;

    subClass.superClass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

function clone(o){
    if (typeof o !== "object") throw TypeError();    //参数必须是对象
    var object = {};    //将要返回的数组
    for (prop in o) {    //遍历所有可枚举的属性
        if (typeof o[prop] == "object") {
            object[prop] = clone(o[prop]);
        }
        if (o[prop] == undefined) {
            object[prop] = undefined;
        }
        if (o[prop] == null) {
            object[prop] = null
        }
        if (o[prop] != o[prop]) {
            object[prop] = NaN;
        }
        else if (isArray(o[prop])) {
            object[prop] = o[prop].slice();
        } else {
            object[prop] = o[prop];
        }
    }
    return object;
}

function toFixed(number, n) {
    !n && (n = 4);
    var a = new Number(number);
    return parseFloat(a.toFixed(n));
}
