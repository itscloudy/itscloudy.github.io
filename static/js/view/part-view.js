var PartView;
(function () {
    PartView = function (partParam) {
        //以父类的构造函数初始化
        PartView.superClass.constructor.call(this, partParam);
        //初始化
        var self = this;
        var init = function () { PartView.prototype.init(self, self) };
        //Load View
        LoadView(self, init);
    };

    //Super Class
    extendViewClass(PartView, View);

    PartView.prototype.init = function (view) {
        //SuperClass init
        //在创建对象时进行初始化 需要传入初始化对象view
        !view && (view = this);
        
        PartView.superClass.init.call(this, view);
        
        //SectionMenu初始化及显示方法
        console.log(view.name + "PartView init");
        //custom init func
        view.param.init(view, function () {
            //next step: loaded
            PartView.prototype.loaded.call(this, view);
        });

        //延迟一秒显示，否则会导致页面样式修改无效
        //http://www.jb51.net/article/23469.htm
    };

    PartView.prototype.loaded = function (view) {
        !view && (view = this);
        //TODO
        console.log(view.name + "PartView loaded");

        //custom loaded function
        view.param.loaded(view);

        PartView.prototype.addEvents.call(this, view);
    }

    PartView.prototype.addEvents = function (view) {
        //SuperClass addEvents
        //在创建对象时进行事件绑定 需要传入初始化对象view
        !view && (view = this);
        PartView.superClass.addEvents.call(this, view);
        
        console.log(view.name + "PartView addEvent");
        //custom addEvents func
        view.param.addEvents(view);
        
        PartView.prototype.show.call(this,view);
    };

    PartView.prototype.show = function (view) {
        //SuperClass show
        !view && (view = this);
        if (view.param.loadstatus) {
            if (view.param.showtime) {//防止在new和调用show方法时执行两次
                return;
            }
            view.param.showtime++;
            //Update parent View currentPartView
            (view.param.parentViewParam).currentPartView = view;
            PartView.superClass.show.call(this,view);
            
            console.log(view.name + "PartView show");

            //custom show func
            view.param.show(view);

            //part 中使用 parentView的Container中的preload加载页，否则在未resize得情况下加载页显示会乱掉 - -
            Controler.preloadLayerHide(view.param.parentViewParam.target);
            //next step: resize
            PartView.prototype.resize.call(this, view);

        }
    };
    
    PartView.prototype.hide = function (view) {
        //SuperClass hide
        !view && (view = this);
        PartView.superClass.hide.call(this, view);

        console.log(view.name + "PartView hide");

        //custom hide func
        view.param.hide(view);

    };

    PartView.prototype.resize = function (view) {
        !view && (view = this);
        PartView.superClass.resize.call(this, view);

        console.log(view.name + "PartView resize");
       
        //custom resize func
        view.param.resize(view);
    }
})();

