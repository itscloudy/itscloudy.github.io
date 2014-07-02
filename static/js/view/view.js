//View
/* Base View Class */
var View = function (viewParam) {
    this.name = viewParam.name;
    this.target = $("#" + viewParam.name);
    this.viewtype = viewParam.type;
    this.reload = viewParam.reload;
    this.showtime = viewParam.showtime;
    this.param = viewParam;//default
    
};

//视图初始化方法
View.prototype.init = function(view) {
    //获得视图对象 id = name
    console.log("View init");
    !view && (view = this);
    view.target.addClass(view.viewtype.classview);
    //View Type Common init func
    typeof view.viewtype.init == "function" && view.viewtype.init(view);

    //callback
    CallbackL(arguments);
};

//视图初始化方法
View.prototype.addEvents = function(view) {
    //获得视图对象 id = name
    //loaded done
    !view && (view = this);
    view.param.loadstatus = true;

    console.log("View addEvents");
    //callback
    CallbackL(arguments);
};

//视图显示方法
View.prototype.show = function (view) {
	!view && (view = this);
    view.viewtype.showstyle(view.target);
    
    //TODO
    console.log("View show");

    //callback
    
    CallbackL(arguments);
};

View.prototype.hide = function(view) {
	!view && (view = this);
    view.viewtype.hidestyle(view.target);
    //TODO
    console.log("View hide");

    view.param.showtime += 1;
    //callback
    CallbackL(arguments);
};

View.prototype.resize = function (view) {
	!view && (view = this);
    view.viewtype.resizestyle && view.viewtype.resizestyle(view.param.container);
    //TODO
    console.log("View resize");

    //callback
    CallbackL(arguments);
};


var ViewShow = {
    NORMAL: function(target) {
        target && target.removeClass("hidden");
    },
    FADEIN: function (target) {
        if(target){
            target.css({
                "opacity": "0",
                "-webkit-transition-delay":"1s",
                "-webkit-transition-property": "opacity",
                "-webkit-transition-duration": "1.5s",
                "-webkit-transition-timing-function": "ease-in-out",
                "-moz-transition-delay": "1s",
                "-moz-transition-property": "opacity",
                "-moz-transition-duration": "1.5s",
                "-moz-transition-timing-function": "ease-in-out",
            });
            target.removeClass("hidden");
            target.css({
                "opacity": "1",
                "background-color": Controler.nextView.param.bgcolor,
            });
        };
    },
    Section:{
        FADEIN: function (target) {
            //background color change

            /*
            $("#SectionContainer").css({
                "background-color": Controler.nextView.param.bgcolor,
            });
            */
            $("#SectionContainer").removeClass("hidden");
            if (target) {
                target.removeClass("hidden");
                target.css({
                    "opacity": "1",
                    "z-index": "50",
                });
            };
        },
        
    },
    
};

var ViewHide = {
    NORMAL: function(target) {
        target && target.addClass("hidden");

    },
    FADEOUT: function(target) {
        /*if(target){
            target.css({
                "opacity": "1",
                "-webkit-transition-property": "opacity",
                "-webkit-transition-duration": "0.4s",
                "-webkit-transition-timing-function": "ease-in-out",
            });
            target.css({
                "opacity": "0",
            });
            setTimeout(function() {
                target.addClass("hidden");
            }, 400);
        };
        */
    },
    Section: {
        NORMAL: function (target) {
            //ViewHide.NORMAL(target);
            //$("#SectionContainer").addClass("hidden");
            if (target) {
                target.css({
                    "opacity": "0",
                    "z-index": "25",
                });
                target.addClass("hidden");
            };
        }
    }
};
/*
 * 视图类型
 * 根据视图类型设定视图的大小，层级，容器，视图默认显示方式
 */
var ViewType = {
    FULL: {
        container: $("#MainContainer"),
        classview: "full-view",
        showstyle: ViewShow.FADEIN, //设定默认的显示方式
        hidestyle: ViewHide.NORMAL, //设定默认的隐藏方式
    },
    SECTION: {
        container: $("#SectionContainer"),
        classview: "section-view",
        showstyle: ViewShow.Section.FADEIN,
        hidestyle: ViewHide.Section.NORMAL,
        //common init function
        init: function(view) {
            //section 栏的初始化方法，定义section
            //Resize.Section.onresize(view.target.children(".section-container"));
            SectionMenu.FirstMenu_Init(view.name);
            //section preload
            Controler.preloadLayerShow(view.target);
        },
        show: function (view) {
            //section 栏的show 方法, save current state
            //TODO throw the url
        },
        resizestyle: function (target) {
            !target && (target = Controler.currentView.param.container);
            if (target) {
                Resize.Section.onresize(target, 0.5);
            } else {
                debugger;
            }
            
        }
    },
    PART:{
        //container: $("#SectionContainer"),
        classview: "part-view",
        showstyle: ViewShow.Section.FADEIN,
        hidestyle: ViewHide.Section.NORMAL,
        //common init function
        init: function (view) {
            //section 栏的初始化方法，定义section
            //Resize.Section.onresize(view.target.children(".section-container"));
            Controler.preloadLayerShow(view.param.parentViewParam.target);
        },
        show: function (view) {
            //section 栏的show 方法, save current state
            //TODO throw the url
        },
        resizestyle: function (target) {
            !target && (target = Controler.currentView.param.container);
            if (target) {
                Resize.Section.onresize(target, 0.5);
            } else {
                debugger;
            }

        }
    }
};

//判断 View的加载方式
var LoadView = function (view, func) {
    view.param.showtime = 0;
    switch (view.reload) {
        case "once":
            if (view.param.loadstatus) {
                return;
            } else {
                typeof func == "function" && func();
                //view.param.loaded = true;
            }
            break;
        case "refresh":
            typeof func == "function" && func();
            break;
        default:
        	typeof func == "function" && func();
            break;
    }
};

