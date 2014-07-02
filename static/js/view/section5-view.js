var Section5View;
var Section5ViewParam = {
    name: "Section5",
    type: ViewType.SECTION,
    load: "once",//once 只加载一次
    bgcolor: "rgba(154, 205, 50,0.6)",
    loaded: false,
    showtime:0,
};
(function () {
    Section5View = function() {
        //以父类的构造函数初始化
        Section5View.superClass.constructor.call(this, Section5ViewParam);
        //初始化
        var _this = this;
        var init = function() { Section5View.prototype.init(_this, _this) };
        //Load View
        LoadView(_this, init);
    };

    //Super Class
    extendViewClass(Section5View, View, Section5ViewParam);

    Section5View.prototype.init = function (view) {
        //SuperClass init
        //在创建对象时进行初始化 需要传入初始化对象view
        !view && (view = this);
        Section5View.superClass.init.call(this, view);
        
        //SectionMenu初始化及显示方法
        console.log(view.name + "View init");
        $("#Section5 .section-container").load("../view/audio.html", function (response, status, xhr) {
            //response - 包含来自请求的结果数据
            //status - 包含请求的状态（"success", "notmodified", "error", "timeout" 或 "parsererror"）
            //xhr - 包含 XMLHttpRequest 对象
            AudioInit();

            Section5View.prototype.addEvents.call(this, view);
        });

        
        CallbackL(arguments);
    };

    Section5View.prototype.addEvents = function (view) {
        //SuperClass addEvents
        //在创建对象时进行事件绑定 需要传入初始化对象view
        !view && (view = this);
        Section5View.superClass.addEvents.call(this, view);
        //TODO
        console.log(view.name + "View addEvent");

        Section5View.prototype.show.call(this, view);
        CallbackL(arguments);
    };

    Section5View.prototype.show = function (view) {
        //SuperClass show
        !view && (view = this);
        if (view.param.loaded) {
            Section5View.superClass.show.call(this, view);
            //TODO
            console.log(view.name + "View show");
            //
        
            view.resize(view);
            Controler.preloadLayerHide(view.target);
            CallbackL(arguments);
        }
    };
    
    Section5View.prototype.hide = function (view) {
        //SuperClass hide
        !view && (view = this);
        Section5View.superClass.hide.call(this, view);
        //TODO
        console.log(view.name + "View hide");
        //
        CallbackL(arguments);
    };

    Section5View.prototype.resize = function (view) {
        !view && (view = this);
        Section5View.superClass.resize.call(this, view);
        //TODO
        console.log(view.name + "View resize");
        var bgResize = function () {
            //SectionView bg w/h = 1.6
            //h screenH 70%
            //w screenW 50
            var imageHeight = 1200;
            var imageWidth = 990;
            var screenHeight = window.outerHeight;
            var screenWidth = window.outerWidth;
            var widthScale = screenWidth / imageWidth;
            var heightScale = screenHeight / imageHeight;
            /*
            console.log("screenHeight=" + screenHeight);
            console.log("screenWidth=" + screenWidth);
            console.log("widthScale=" + widthScale);
            console.log("heightScale=" + heightScale);
            */
            if (widthScale > heightScale) {
                $("#Section5 .section-container").addClass("section1bg_width").removeClass("section1bg_height");
            } else {
                $("#Section5 .section-container").addClass("section1bg_height").removeClass("section1bg_width");
            }
            /*
            $("#Section1 .section-container:before ").css({
                "background": "",
            });
            */
        };
        bgResize();

        //In progress
        CustomAudioContext.Canvas.resize();
        
        //In progress
        SongAlbumInit(CurrentSongIndex);
        //
        CallbackL(arguments);
    }
})();

//Section1 resize function
