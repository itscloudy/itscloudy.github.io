
/**
*Section视图默认配置函数
**/
var SectionViewParam = function (obj) {
    //default value

    this.type = ViewType.SECTION;
    this.reload = "once";
    this.showtime = 0;
    this.loadstatus = false;
    this.currentPartView = null;
    this.defaultPartViewParam = null;
    //默认方法
    //init 参数callback，默认调用，否则初始化失败
    this.init = function (view, callback) { typeof callback === "function" && callback(); };
    this.loaded = function () { console.log("custom view loaded"); };
    this.addEvents = function () { console.log("custom view addEvents"); };
    this.show = function () { console.log("custom view show"); };
    this.hide = function () { console.log("custom view hide"); };
    this.resize = function () { console.log("custom view resize"); }

    //user param
    for (i in obj) {
        //相同参数的重写
        this[i] = obj[i];
    }
    //判断Section dom节点是否存在
    if ($("#" + this.name).length === 0) {
        var section = $('<section id="' + this.name + '"></section>');
        var container = $('<div class="section-container"></div>');
        section.append(container);
        //#SectionContainer
        $("#SectionContainer").append(section);
        this.container = container;
    } else {
        this.container = $("#" + this.name + " .section-container");
    }

    //判断defaultPartViewParam是否存在，存在则进行container绑定
    if (this.defaultPartViewParam) {
        this.defaultPartViewParam.bindParentContainer(this);
    }

    //init sth
    this.target = $("#" + this.name);
}

/**
  *
  * Part视图默认配置函数
  * 设定为Section视图中的部分块，默认为创建part-container，且长宽占满section-container
  **/
var PartViewParam = function (obj) {
    this.type = ViewType.PART;
    this.reload = "once";
    this.showtime = 0;
    this.loadstatus = false;

    //默认方法
    //init 参数callback，默认调用，否则初始化失败
    this.init = function (view, callback) { typeof callback === "function" && callback(); };
    this.loaded = function () { console.log("custom part view loaded"); };
    this.addEvents = function () { console.log("custom part view addEvents"); };
    this.show = function () { console.log("custom part view show"); };
    this.hide = function () { console.log("custom part view hide"); };
    this.resize = function () { console.log("custom part view resize"); }
    //user param
    for (i in obj) {
        //相同参数的重写
        this[i] = obj[i];
    }

    //bind parentContainer && init target Dom
    this.bindParentContainer = function(viewparam){
        this.parentContainer = viewparam.container;
        this.container = $('<div id="' + this.name + '" class="part-container"></div>');
        this.parentContainer.append(this.container);
        this.parentViewParam = viewparam;
    }

    //init sth
    this.target = $("#" + this.name);
}
