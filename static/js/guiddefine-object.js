/* 创建对象的三种方式 */
//6.1.1 对象直接量
var book = {
    "main title": "JavaScript",             //属性名字里有空格，必须用字符串表示
    "sub-title":"The Definiteive Guide",    //属性名里有连字符，必须用字符串表示
    "for": "all audiences",                 //for是保留字，必须用字符串表示
    author: {
        firstname: "David",
        surname:"Flanagan",
    }
}

//6.1.2 通过new创建对象
var a = new Array()

//6.1.4 Object.create();
var o1 = Object.create({ x: 1, y: 2 });//o1继承了属性x和y

var o2 = Object.create(null) //o2不继承任何属性和方法

//创建一个普通对象（通过{}或new Object()创建的对象，需要传入Object.prototype）:
var o3 = Object.create(Object.prototype);   //o3和{}和new Object()一样

//例6.1：通过原型继承创建一个新对象
function inhert(p) {
    //判断p是否为空
    if(p==null) throw TypeError()
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
/*
var P = {
    title:"Inherit Object"
}

var p = inhert(P);
*/

/* 数组类型判断 */
var isArray = Function.isArray || function (o) {
    return typeof o === "object" && Object.prototype.toString.call(o) == "[object Array]";
}

//例6-2 用来枚举属性的对象工具函数
/*
 * 把p中的可枚举函数复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
 */
function extend(o, p) {
    for (prop in p) {       //遍历p中的所有属性
        o[prop] = p[prop];  //将属性添加至o中
    }
    return o;
}
/*
 * 将p中的可枚举属性复制到o中，并返回o
 * 如果o和p中有同名的属性，o中的属性将不受影响
 * 这个函数不处理getter和setter以及复制属性
 */
function merge(o, p) {
    for (prop in p) {
        if (o.hasOwnProperty[prop]) continue;   //过滤掉已经在o中存在的属性
        o[prop] = p[prop];
    }
    return o;
}
/*
 * 如果o中的属性在p中没有同名属性，则从o中删除这个属性
 * 返回o
 */
function restrict(o, p) {
    for (prop in o) {
        if (!p[prop]) delete o[prop];   //如果在p中不存在，则删除之
    }
    return o;
}
/*
 * 如果o中的属性在p中存在同名属性，则从o中删除这个属性
 * 返回o
 */
function subtract(o, p) {
    for (prop in p) {
        o[prop];    //从o中删除（删除一个不存在的属性不会报错）    
    }
    return o;
}

/* 
 * 返回一个新对象，这个对象同时拥有o的属性和p的属性
 * 如果o和p中有同名属性，使用p中的属性值
 */
function union(o, p) { return extend(extend({}, o), p) };

/*
 * 返回一个新对象，这个对象拥有同时在o和p中出现的属性
 * 很像求o和p的交集，但p中属性的值被忽略
 */
function intersection(o, p) { return restrict(extend({}, o), p) };

/*
 * 返回一个数组，这个数组包含的是o中可枚举的自有属性的名字
 */
function key(o) {
    if (typeof o !== "object") throw TypeError();    //参数必须是对象
    var result = [];    //将要返回的数组
    for (prop in o){    //遍历所有可枚举的属性
        if (o.hasOwnProperty(prop))    //判断是否是自有属性
            result.push(o[prop]);
    }
    return result;
}

//私有变量，使用内部函数访问
function counter() {
    var n = 0;
    return {
        count: function () { return n++; },
        reset: function () { n = 0;},
    }
}

//例8-5 ECMAScript 3版本的Function.bind()方法
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

//Demo8.1.1函数处理数组
//计算数组元素的平均值和标准差
//使用数组方法map()和reduce()来实现同样的计算

//1 定义两个简单的函数
var sum = function (x, y) { return x + y; };
var square = function (x) { return x * x; };

//2 将这些函数和数组方法配合使用计算出平均数和标准差
var data = [1, 2, 3, 4, 5];
var mean = data.reduce(sum) / data.length;
var deviation = data.map(function (x) { return x - mean; });
var stddev = Math.sqrt(deviation.map(square).reduce(sum) / (data.length - 1));

//定义ECMAScript 3中的数组map()和reduce()函数
var map = Array.prototype.map ? function (a, f) { return a.map(f) } : function (a, f) {
    var results = [];
    for (var i = 0; i < a.length; i++) {
        if (i in a) results[i] = f.call(null, a[i], i, a);
    }
    return results;
};

var reduce = Array.prototype.reduce ? function (a, f, initial) {
    if (arguments.length > 2)
        return a.reduce(f, initial);    //如果传入了一个初始值
    else return a.reduce(f);            //否则没有初始值
} : function (a, f, initial) {   //这个算法来自ECMAScript 5规范
    var i = 0, len = a.length, accumlator;

    //以特定的初始值开始，否则第一个值取自a
    if (arguments.length > 2) accumlator = initial;
    else {  //找到数组中的第一个已定义的索引
        if (len == 0) throw TypeError();
        while (i < len) {
            if (i in a) {
                accumlator = a[i++];
                break;
            }
            else i++;
        }
        if (i == len) throw TypeError();
    }
    //对于数组中剩下的元素依次调用f();
    while (i < len) {
        if (i in a)
            accumlator = f.call(undefined, accumlator, a[i], i, a);
        i++;
    }
    return accumlator;
}

//8.2.2高阶函数 --就是操作函数的函数
//这个高阶函数返回一个新的函数，这个新函数将它的实参传入f()
//并返回f的返回至逻辑非
function not(f) {
    return function () {
        var result = f.apply(this, arguments);
        return !result;
    }
}

//判断a是否为偶数的函数
var even = function (x) {
    return x % 2 === 0;
}

var odd = not(even);    //一个新函数，所做的事情与even相反
[1, 3, 5, 7, 9].not(even);  //=> true 每个元素都是奇数


//所返回的函数的参数应当是一个实参数组，并对每个数组元素执行函数f()
//并返回所有计算结果组成的数组
//可以对比一下函数和上文提到的map()函数
function mapper(f) {
    return function (a) { return map(a, f); };
}
var increment = function (x) { return x + 1; };
var invrementer = mapper(increment);
incrementer([1, 2, 3]);     // => [2,3,4]

//返回一个新的可以计算f(g(...))的函数
//返回的函数h()将它所有的实参传入g(),然后将g()的返回值传入f()
//调用f()和g()时的this值和调用h()时是同一个this
function compose(f, g) {
    return function () {
        //需要给f()传入一个参数，所以使用f()的call()方法
        //需要给g()传入很多参数，所以使用g()的applu()方法
        return f.call(this, g.apply(this, arguments));
    };
}
var square = function (x) { return x * x; };
var sum = function (x, y) { return x + y; };
var squareofsum = compose(square, sum);
squareofsum(2, 3);  // => 25



//8.8.3不完全函数
//实现一个工具函数将类数组对象（或对象）转换为真正的数组
//在后面的示例代码中用到了这个方法将arguments对象转换为真正的数组
function array(a, n) { return Array.prototype.slice.call(a, n || 0); }
//这个函数的实参传递至左侧
function particalLeft(f /*,...*/) {
    var args = arguments;   //保存外部的实参数组
    return function () {
        var a = array(args, 1);     //开始处理外部的第1个args
        a = a.concat(arguments)     //然后增加所有的内部实参
        return f.apply(this, a);    //然后基于这个实参列表调用f()
    };
}

//这个函数的实参传递至右侧
function particalRight(f /*,...*/) {
    var args = arguments;   //保存外部的实参数组
    return function () {
        var a = array(arguments);   //从内部参数开始
        a = a.concat(array(args, 1));   //然后从外部第一个args开始添加
        return f.apply(this, a);    //然后基于这个实参列表调用f()
    };
}

//这个函数的实参被用作模版
//实参列表中的undefined值都被填充
function partical(f /*,...*/) {
    var args = arguments;   //保存外部实参数组
    return function () {
        var a = array(args, 1); //从外部实参开始
        var i = 0, j = 0;
        //遍历args，从内部实参填充undefined值
        for (; i < a.length; i++)
            if (a[i] === undefined) a[i] = arguments[j++];
        //现在将剩下的内部实参都追加进去
        a = a.concat(arguments, j);
        return f.apply(this, a);
    };
}

//这个函数带有三个实参
var f = function (x, y, z) { return x * (y - z); };
particalLeft(f, 1)(2, 3);   // => 1*(2-3)
particalRight(f, 1)(2, 3);  // => 2*(3-1)
partical(f, undefined, 1)(2, 3);    // => 2*(1-3)

//函数式编程
var data = [1, 1, 3, 5, 5];
var sum = function (x, y) { return x + y; };
var product = function (x, y) { return x * y; };
var neg = partical(product, -1);
var square = partical(Math.pow, undefined, 2);
var sqrt = partical(Math.pow, undefined, .5);
var reciprocal = partical(Math.pow, undefined, -1);

//计算平均值和平均差，所有的函数调用都不带运算符
//这段代码看起来很像lisp代码？
var mean = product(reduce(data,sum),reciprocal(data.length));
var stddev = sqrt(product(reduce(map(data, compose(square, parti(sum, neg(mean)))), sum), reciprocal(sum(data.length, -1))));

//8.8.4 记忆
//定义一个阶乘函数，他可以将上次的结果缓存起来。在函数式编程当中，这种缓存技巧叫做“记忆”(memorization)。
//返回f()的带有记忆功能的版本
//只有当f()实参的字符串都不相同时它才会工作
function memorize(f) {
    var cache = []; //将值保存在闭包内
    return function () {
        //将实参转换为字符串形式，并将其用作缓存的键
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) return cache[key];
        else return cache[key] = f.apply(this, arguments);
    };
}

//返回两个整数的最大公约数
//使用欧几里德算法:http://en.wikipeidia.org/wiki/Euclidean_algorithm
function gcd(a, b) {    //这里省略对a和b的类型检查
    var t;  //临时变量用来存储交换数值
    if (a < b) t = b, b = a, a = t; //确保a>=b
    while (b != 0) t = b, b = a % b, a = t; //这是求最大公约数的欧几里德算法
    return a;
}

var gcdmeno = memorize(gcd);
gcdmeno(87, 187);   // => 17

//注意，当我们写一个递归函数时，往往需要实现记忆功能
//我们更希望调用实现了记忆功能的递归函数，而不是原递归函数
var factorial = memorize(function (n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
});
factorial(5);   // => 120.对于4~1的值也有缓存



// JavaScript source code

//例9-16: 抽象类和非抽象Set类的层次结构
//这个函数可以用作任何抽象方法，非常方便
function abstractmethod() { throw new Error("abstract method"); }

/*
 * AbstractSet类定义了一个抽象方法:contains()
 */
function AbstractSet() { throw new Error("Can't instantiate abstract class"); }
AbstractSet.prototype.contains = abstractmethod;

/*
 * NotSet是AbstractSet的一个非抽象子类
 * 所有不在其他集合中的成员都在这个集合中
 * 因为它是在其他集合不可写的条件下定义的
 * 同时由于它的成员是无限个，因此她是不可枚举的
 * 我们只能用她来检测元素成员的归属情况
 * 注意，我们使用了Function.prototype.extend()方法来定义这个类
 */
var NotSet = AbstractSet.extend(
    function NotSet(set) { this.set = set; },
    {
        contains: function (x) { return !this.set.contains(x); },
        toString: function (x) { return "~" + this.set.toString(); },
        equals: function (that) {
            return that instanceof NotSet && this.set.equals(that.set);
        }
    }
    );

/*
 * AbstractEnumerableSet是AbstractSet的一个抽象子类
 * 它定义了抽象方法size()和foreach()
 * 然后实现了非抽象方法isEmpth(),toArray(),to[Locale]String()和equals()方法
 * 子类实现了contains(),size()和foreach()，这三个方法可以很轻易的调用这5个非抽象方法
 */
var AbstractEnumerableSet = AbstractSet.extend(
    function () { throw new Error("Can't instantiate abstract classes");},
    {
        size: abstractmethod,
        foreach: abstractmethod,
        isEmpty: function () { return this.size() == 0 },
        toString: function () {
            var s = "{", i = 0;
            this.foreach(function (v) {
                if (i++ > 0) s += ", ";
                s += v;
            });
            return s + "}";
        },
        toLocalString: function () {
            var s = "{", i = 0;
            this.foreach(function (v) {
                if (i++ > 0) s += ", ";
                if (v == null) s += v;  //null和undefined
                else s += v.toLocalString();    //其他情况
            });
            return s + "}";
        },
        toArray: function () {
            var a = [];
            this.foreach(function (v) { a.push(v); });
            return a;
        },
        equals: function (that) {
            if (!(that instanceof AbstractEnumerableSet)) return false;
            //如果他们的大小不同，则他们不相等
            if (this.size() !== that.size()) return false;
            //检查每一个元素是否也在that中
            try {
                this.foreach(function (v) { if (!that.contains(v)) throw false; });
                return true;
            } catch (x) {
                if (x === false) return false;  //集合不相等
                throw x;    //发生了其他异常；重新抛出异常
            }
        }
    }
    );

/*
 * SingletonSet是AbstractEnumerableSet的非抽象子类
 * singleton集合是只读的，他只包含一个成员
 */
var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member;    },
    {
        contains: function (x) { return x === this.member; },
        size: function () { return 1; },
        foreach: function (f, ctx) { f.call(ctx, this.member);}
    }
    );

/*
 * AbstractWritableSet是AbstractEnumerableSet的抽象子类
 * 它定义了抽象方法add()和remove()
 * 然后实现了非抽象方法union(),intersection()和difference()
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
    function () { throw new Error("Can't instantiate abstract classes");},
    {
        add: abstractmethod,
        remove: abstractmethod,
        union: function (that) {
            var self = this;
            that.foreach(function (v) { self.add(v); });
            return this;
        },
        intersection: function (that) {
            var self = this;
            this.foreach(function (v) { if (!that.contains(v)) self.remove(v); });
            return this;
        },
        difference: function (that) {
            var self = this;
            that.foreach(function (v) { self.remove(v); });
            return this;
        }
    }
    );

/*
 * ArraySet是AbstractWriteableSet的非抽象子类
 * 它以数组的形式表示集合中的元素
 * 对于它的contains()方法使用了数组的线性查找
 * 因为contains()方法的算法复杂度是o(n)而不是o(1)
 * 它非常适合于相对小型的集合，注意，这里的实现用到了ES5的数组方法indexOf()和forEach()
 */
var ArraySet = AbstractWritableSet.extend(
    function ArraySet() {
        this.values = [];
        this.add.apply(this, arguments);
    },
    {
        contains: function (v) { return this.values.indexOf(v) != -1; },
        size: function () { return this.values.length; },
        foreach: function (f, c) { this.values.forEach(f, c); },
        add: function () {
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!this.contains(arg)) this.values.push(arg);
            }
            return this;
        },
        remove: function () {
            for (var i = 0; i < arguments.length; i++) {
                var p = this.values.indexOf(arguments[i]);
                if (p == -1) continue;
                this.values.splice(p, 1);
            }
            return this;
        }
    }
    );

//例9-17：定义不可枚举的属性
//将代码包装在一个匿名函数中，这样定义的变量就在这个函数作用域内
(function () {
    //定义一个不可枚举的属性objectId，它可以被所有对象继承
    //当读取这个属性时调用getter函数
    //它没有定义setter，因此它是只读的
    //它是不可配置的，因此它是不能删除的
    Object.defineProperty(Object.prototype, "objectId", {
        get: idGetter,       //取值器
        enumerable: false,   //不可枚举
        configurable:false   //不可删除
    })

    //当读取objectId的时候直接调用这个getter函数
    function idGetter() {       //getter函数返回该id
        //如果对象中不存在id
        if (!idprop in this) {
            //并且可以增加属性
            if (!Object.isExtensible(this))
                throw Error("Can't define id for nonextensible objects");
            Object.defineProperty(this, idprop, {   //给它一个值
                value: nextid++,     //就是这个值
                writable: false,     //只读的
                enumerable: false,    //不可枚举的
                configurable: false  //不可删除的
            })
        }
        return this[idprop];
    };

    //idGetter()用到了这些变量，这些都属于私有变量
    var idprop = "|**objectId**|";  //假设这个属性没有用到
    var nextid = 1; //给它设置初始值

}());    //立即执行这个包装函数

//创建一个不可变的类，它的属性和方法都是只读的
//  这个方法可以使用new调用，也可以省略new，它可以用作构造函数也可以用作工厂函数
function Range(from, to) {
    //这些是对from和to只读的属性的描述符
    var props = {
        from: { value: from, enumerable: true, writable: false, configurable: false },
        to: { value: to, enumerable: true, writable: false, configurable: false }
    };
    if (this instanceof Range)   //如果作为构造函数来调用
        Object.defineProperties(this, props);   //定义属性
    else                        //否则，作为工厂方法来调用
        return Object.create(Range.prototype,props) //创建并返回这个新Range对象，属性由props指定
}
// 如果用同样方法给Range.prototype对象添加属性
// 那么我们需要给这些属性设置他们的特性
// 因此我们无法识别出它们的可枚举性，可写性或可配置性，这些属性特性默认都是false
Object.defineProperties(Range.prototype, {
    includes: {
        value: function (x) { return this.from <= x && x <= this.to;}
    },
    foreach: {
        value: function (f) {
            for (var x = Math.ceil(this.from) ; x <= this.to; x++) f(x);
        }
    },
    toString: {
        value: function () { return "(" + this.from + "..." + this.to + ")";}
    }
});

/* add 13/0929 cloud */
// JavaScript source code

//例9-16: 抽象类和非抽象Set类的层次结构
//这个函数可以用作任何抽象方法，非常方便
function abstractmethod() { throw new Error("abstract method"); }

/*
 * AbstractSet类定义了一个抽象方法:contains()
 */
function AbstractSet() { throw new Error("Can't instantiate abstract class"); }
AbstractSet.prototype.contains = abstractmethod;

/*
 * NotSet是AbstractSet的一个非抽象子类
 * 所有不在其他集合中的成员都在这个集合中
 * 因为它是在其他集合不可写的条件下定义的
 * 同时由于它的成员是无限个，因此她是不可枚举的
 * 我们只能用她来检测元素成员的归属情况
 * 注意，我们使用了Function.prototype.extend()方法来定义这个类
 */
var NotSet = AbstractSet.extend(
    function NotSet(set) { this.set = set; },
    {
        contains: function (x) { return !this.set.contains(x); },
        toString: function (x) { return "~" + this.set.toString(); },
        equals: function (that) {
            return that instanceof NotSet && this.set.equals(that.set);
        }
    }
    );

/*
 * AbstractEnumerableSet是AbstractSet的一个抽象子类
 * 它定义了抽象方法size()和foreach()
 * 然后实现了非抽象方法isEmpth(),toArray(),to[Locale]String()和equals()方法
 * 子类实现了contains(),size()和foreach()，这三个方法可以很轻易的调用这5个非抽象方法
 */
var AbstractEnumerableSet = AbstractSet.extend(
    function () { throw new Error("Can't instantiate abstract classes"); },
    {
        size: abstractmethod,
        foreach: abstractmethod,
        isEmpty: function () { return this.size() == 0 },
        toString: function () {
            var s = "{", i = 0;
            this.foreach(function (v) {
                if (i++ > 0) s += ", ";
                s += v;
            });
            return s + "}";
        },
        toLocalString: function () {
            var s = "{", i = 0;
            this.foreach(function (v) {
                if (i++ > 0) s += ", ";
                if (v == null) s += v;  //null和undefined
                else s += v.toLocalString();    //其他情况
            });
            return s + "}";
        },
        toArray: function () {
            var a = [];
            this.foreach(function (v) { a.push(v); });
            return a;
        },
        equals: function (that) {
            if (!(that instanceof AbstractEnumerableSet)) return false;
            //如果他们的大小不同，则他们不相等
            if (this.size() !== that.size()) return false;
            //检查每一个元素是否也在that中
            try {
                this.foreach(function (v) { if (!that.contains(v)) throw false; });
                return true;
            } catch (x) {
                if (x === false) return false;  //集合不相等
                throw x;    //发生了其他异常；重新抛出异常
            }
        }
    }
    );

/*
 * SingletonSet是AbstractEnumerableSet的非抽象子类
 * singleton集合是只读的，他只包含一个成员
 */
var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member; },
    {
        contains: function (x) { return x === this.member; },
        size: function () { return 1; },
        foreach: function (f, ctx) { f.call(ctx, this.member); }
    }
    );

/*
 * AbstractWritableSet是AbstractEnumerableSet的抽象子类
 * 它定义了抽象方法add()和remove()
 * 然后实现了非抽象方法union(),intersection()和difference()
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
    function () { throw new Error("Can't instantiate abstract classes"); },
    {
        add: abstractmethod,
        remove: abstractmethod,
        union: function (that) {
            var self = this;
            that.foreach(function (v) { self.add(v); });
            return this;
        },
        intersection: function (that) {
            var self = this;
            this.foreach(function (v) { if (!that.contains(v)) self.remove(v); });
            return this;
        },
        difference: function (that) {
            var self = this;
            that.foreach(function (v) { self.remove(v); });
            return this;
        }
    }
    );

/*
 * ArraySet是AbstractWriteableSet的非抽象子类
 * 它以数组的形式表示集合中的元素
 * 对于它的contains()方法使用了数组的线性查找
 * 因为contains()方法的算法复杂度是o(n)而不是o(1)
 * 它非常适合于相对小型的集合，注意，这里的实现用到了ES5的数组方法indexOf()和forEach()
 */
var ArraySet = AbstractWritableSet.extend(
    function ArraySet() {
        this.values = [];
        this.add.apply(this, arguments);
    },
    {
        contains: function (v) { return this.values.indexOf(v) != -1; },
        size: function () { return this.values.length; },
        foreach: function (f, c) { this.values.forEach(f, c); },
        add: function () {
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!this.contains(arg)) this.values.push(arg);
            }
            return this;
        },
        remove: function () {
            for (var i = 0; i < arguments.length; i++) {
                var p = this.values.indexOf(arguments[i]);
                if (p == -1) continue;
                this.values.splice(p, 1);
            }
            return this;
        }
    }
    );

//例9-17：定义不可枚举的属性
//将代码包装在一个匿名函数中，这样定义的变量就在这个函数作用域内
(function () {
    //定义一个不可枚举的属性objectId，它可以被所有对象继承
    //当读取这个属性时调用getter函数
    //它没有定义setter，因此它是只读的
    //它是不可配置的，因此它是不能删除的
    Object.defineProperty(Object.prototype, "objectId", {
        get: idGetter,       //取值器
        enumerable: false,   //不可枚举
        configurable: false   //不可删除
    })

    //当读取objectId的时候直接调用这个getter函数
    function idGetter() {       //getter函数返回该id
        //如果对象中不存在id
        if (!idprop in this) {
            //并且可以增加属性
            if (!Object.isExtensible(this))
                throw Error("Can't define id for nonextensible objects");
            Object.defineProperty(this, idprop, {   //给它一个值
                value: nextid++,     //就是这个值
                writable: false,     //只读的
                enumerable: false,    //不可枚举的
                configurable: false  //不可删除的
            })
        }
        return this[idprop];
    };

    //idGetter()用到了这些变量，这些都属于私有变量
    var idprop = "|**objectId**|";  //假设这个属性没有用到
    var nextid = 1; //给它设置初始值

}());    //立即执行这个包装函数

//创建一个不可变的类，它的属性和方法都是只读的
//  这个方法可以使用new调用，也可以省略new，它可以用作构造函数也可以用作工厂函数
function Range(from, to) {
    //这些是对from和to只读的属性的描述符
    var props = {
        from: { value: from, enumerable: true, writable: false, configurable: false },
        to: { value: to, enumerable: true, writable: false, configurable: false }
    };
    if (this instanceof Range)   //如果作为构造函数来调用
        Object.defineProperties(this, props);   //定义属性
    else                        //否则，作为工厂方法来调用
        return Object.create(Range.prototype, props) //创建并返回这个新Range对象，属性由props指定
}
// 如果用同样方法给Range.prototype对象添加属性
// 那么我们需要给这些属性设置他们的特性
// 因此我们无法识别出它们的可枚举性，可写性或可配置性，这些属性特性默认都是false
Object.defineProperties(Range.prototype, {
    includes: {
        value: function (x) { return this.from <= x && x <= this.to; }
    },
    foreach: {
        value: function (f) {
            for (var x = Math.ceil(this.from) ; x <= this.to; x++) f(x);
        }
    },
    toString: {
        value: function () { return "(" + this.from + "..." + this.to + ")"; }
    }
});