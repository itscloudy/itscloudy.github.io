var LoginView;
var LoginViewParam = {
    name: "Login",
    type: ViewType.FULL,
    load: "once",//once 只加载一次
    bgcolor: "rgba(0, 0, 0,1)",
    loaded: false,
};
(function () {
    LoginView = function() {
        //以父类的构造函数初始化
        LoginView.superClass.constructor.call(this, LoginViewParam);
        //初始化
        var self = this;
        var init = function() { LoginView.prototype.init(self, self); };
        //Load View
        LoadView(self, init);

    };

    //Super Class
    extendViewClass(LoginView, View, LoginViewParam);

    LoginView.prototype.init = function (view) {
        //SuperClass init
        //在创建对象时进行初始化 需要传入初始化对象view
        !view && (view = this);
        LoginView.superClass.init.call(this, view);

        //SectionMenu初始化及显示方法
        console.log(view.name + "View init");


        LoginView.prototype.addEvents.call(this, view);
        CallbackL(arguments);
    };

    LoginView.prototype.addEvents = function (view) {
        //SuperClass addEvents
        //在创建对象时进行事件绑定 需要传入初始化对象view
        !view && (view = this);
        LoginView.superClass.addEvents.call(this, view);
        //TODO
        console.log(view.name + "View addEvent");

        /*
        $("#LoginBtn").unbind("mouseover").mouseover(function () {
            $(this).css({ 'background-color': '#999', 'color': '#fff' });
        }).unbind("mousedown").mousedown(function () {
            $(this).css({ 'background-color': '#777' });
        }).unbind("mouseup").mouseup(function () {
            $(this).css({ 'background-color': '#999' });
        }).unbind("mouseout").mouseout(function () {
            $(this).css({ 'background-color': 'transparent', 'color': '#999' });
        })
        */
        $(".CircleZoom").unbind("mouseover").mouseover(function () {
            $(".CircleOut").addClass("circleEffect");
        }).unbind("mouseout").mouseout(function () {
            $(".CircleOut").removeClass("circleEffect");
        });

        $("#LoginTitle").unbind("mousedown").mousedown(function () {
            $(".CircleOut").removeClass("circleEffect").unbind('webkitTransitionEnd moztransitionend transitionend oTransitionEnd')
                .bind('webkitAnimationEnd webkitTransitionEnd moztransitionend transitionend oTransitionEnd', function () {
                console.log("circleEffect");
                    Controler.currentView.hide();
                    setTimeout(function () {

                        var screenHeight = Resize.Screen.height;//window.outerHeight;
                        var screenWidth = Resize.Screen.width;//window.outerWidth;
                        var sectionContainer = $("#SectionContainer");
                        sectionContainer.css({
                            "background-image":
                                "-webkit-gradient(radial, 20% 0%," + screenHeight / 6 + ", 20% 0%, " + screenHeight / 2 + ", from(#fff),to(transparent))," +
                                "-webkit-gradient(radial, 10% -50%," + screenHeight / 3 + ", 0% 0%, " + screenHeight + ", from(#fff),to(transparent))," +
                                "-webkit-gradient(radial, 60% 50%," + 0 + ",60% 50%, " + screenHeight / 16 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                                "-webkit-gradient(radial, 73% 65%," + 0 + ",73% 65%, " + screenHeight / 8 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                                "-webkit-gradient(radial, 100% 100%," + 0 + ", 100% 100%, " + screenHeight / 4 + ", from(#fff), to(transparent)),"+
                            "-moz-gradient(radial, 20% 0%," + screenHeight / 6 + ", 20% 0%, " + screenHeight / 2 + ", from(#fff),to(transparent))," +
                                "-moz-gradient(radial, 10% -50%," + screenHeight / 3 + ", 0% 0%, " + screenHeight + ", from(#fff),to(transparent))," +
                                "-moz-gradient(radial, 60% 50%," + 0 + ",60% 50%, " + screenHeight / 16 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                                "-moz-gradient(radial, 73% 65%," + 0 + ",73% 65%, " + screenHeight / 8 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                                "-moz-gradient(radial, 100% 100%," + 0 + ", 100% 100%, " + screenHeight / 4 + ", from(#fff), to(transparent))",
                        });
                        sectionContainer.removeClass("hidden");
						Resize.onResize();
                        setTimeout(function () {
                            $("#SectionContainer").css({
                                "background-color": "rgba(0,0,0,0.9)",
                            });
                            $("#Baseline").css({
                                "width":"100%",
                            });
                            setTimeout(function () {
                                Controler.transfer(new SectionView(AudioSectionView));
                            }, 500);
                        }, 200);

                }, 200);
            }).addClass("circleShine");
        });

        /*
        $("#UserName").keydown(function (event) {
    
        var keychar = String.fromCharCode(event.keyCode);
        alert(keychar);
        });
        */
        /*
        $("#UserName").unbind("focusin").focusin(function () {
            $(this).css({ 'color': '#fff' });
            if ($(this).attr('value').toString().toLowerCase().match("input your name")) {
                $(this).attr('value', '');
            }
        });
        /*
        $("#LoginBtn").unbind("click").click(function () {
            $("#BaselineCircle").css("right", "0px");
            setTimeout(function () {
                //基线延伸效果
                $("#BaselineCircle").animate({
                    width: "100%",
                    //opacity: 0.4,
                    //marginLeft: "0.6in",
                }, 500);
                // $("#BaselineCircle").addClass("baselineEffectIn");
                setTimeout(function () {
                    //$("#BaselineCircle").css("width", "100%");
                    //滚轮效果
                    $(".CircleOut").removeClass("circleEffect");
                    $(".CircleIn").hide();
                    $(".CircleZoom").addClass("rotateEffect")
                    $(".CircleOut").addClass("moveEffect");
                    setTimeout(function () {
                        $(".CircleZoom").hide();
                        $(".CircleOut").hide();
                        Controler.transfer(new Section1View())
                    }, 1500);

                }, 450);
            }, 300);
        });
        */
        CallbackL(arguments);
    };

    LoginView.prototype.show = function (view) {
        //SuperClass show
        !view && (view = this);
        LoginView.superClass.show.call(this, view);
        //TODO
        console.log(view.name + "View show");
        //
        CallbackL(arguments);
    };

    LoginView.prototype.hide = function (view) {
        //SuperClass hide
        !view && (view = this);
        LoginView.superClass.hide.call(this, view);
        //TODO
        console.log(view.name + "View hide");
        //
        CallbackL(arguments);
    };


})();
