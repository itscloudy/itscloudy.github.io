var SectionFirstTime = true;

var SectionView;
(function () {
    SectionView = function(sectionParam) {
        //以父类的构造函数初始化
        SectionView.superClass.constructor.call(this, sectionParam);
        //初始化
        var self = this;
        var init = function () { SectionView.prototype.init(self, self) };
        //Load View
        LoadView(self, init);
    };

    //Super Class
    extendViewClass(SectionView, View);

    SectionView.prototype.init = function (view) {
        //SuperClass init
        //在创建对象时进行初始化 需要传入初始化对象view
        !view && (view = this);
        
        SectionView.superClass.init.call(this, view);
        
        //SectionMenu初始化及显示方法
        console.log(view.name + "View init");
        //custom init func
        view.param.init(view, function () {
            //next step: loaded
            SectionView.prototype.loaded.call(this, view);
        });

        //延迟一秒显示，否则会导致页面样式修改无效
        //http://www.jb51.net/article/23469.htm
    };

    SectionView.prototype.loaded = function (view) {
        !view && (view = this);
        //TODO
        console.log(view.name + "View loaded");

        //custom loaded function
        view.param.loaded(view);

        SectionView.prototype.addEvents.call(this, view);
    }

    SectionView.prototype.addEvents = function (view) {
        //SuperClass addEvents
        //在创建对象时进行事件绑定 需要传入初始化对象view
        !view && (view = this);
        SectionView.superClass.addEvents.call(this, view);
        
        console.log(view.name + "View addEvent");
        //custom addEvents func
        view.param.addEvents(view);
        
        SectionView.prototype.show.call(this,view);
    };

    SectionView.prototype.show = function (view) {
        //SuperClass show
        !view && (view = this);
        if (view.param.loadstatus) {
            if (view.param.showtime) {//防止在new和调用show方法时执行两次
                return;
            }
            view.param.showtime++;

            SectionView.superClass.show.call(this,view);
            //TODO
            console.log(view.name + "View show");

            //custom show func
            view.param.show(view);

            //next step: resize
            SectionView.prototype.resize.call(this, view);
            
            //判断是否有currentPartView 
            if (!view.param.currentPartView) {
                //判断是否有默认default Part View，有则自动加载
                if (view.param.defaultPartViewParam) {
                    //view.param.currentPartView = );
                    Controler.transferPart(new PartView(view.param.defaultPartViewParam));
                }
            }

            if (SectionFirstTime) {
                //第一次加载，强制延迟5秒
                setTimeout(function () {
                    Controler.preloadLayerHide(view.target);
                }, 5000);
                SectionFirstTime = false;
            } else {
                Controler.preloadLayerHide(view.target);
            }
            
        }
    };
    
    SectionView.prototype.hide = function (view) {
        //SuperClass hide
        !view && (view = this);
        SectionView.superClass.hide.call(this, view);

        console.log(view.name + "View hide");

        //custom hide func
        view.param.hide(view);

    };

    SectionView.prototype.resize = function (view) {
        !view && (view = this);
        SectionView.superClass.resize.call(this, view);

        console.log(view.name + "View resize");
        
        //custom resize func
        view.param.resize(view);

        if (view.param.currentPartView) {
            view.param.currentPartView.resize();
        }
    }
})();

