//Resize 

var BaseSizeNumber = 2 * 3 * 5 * 7;//210
var GoldenScale = 0.618;//黄金比例

//var cubeWidth = cubeHeight = 70;
var Resize = {
    Screen:{
        width: 0,
        height: 0,
    },
    square: 70,
    Section: {
        onresize: function(target, smooth) {
            //resize the section-container
            //width depend on FirstMenu
            !target && (target = Controler.currentView.target.children(".section-container"));
            !target && function() { return false; };
            var width = Resize.Screen.width; //SectionMenu.baseWidth();
            var mainMenuHeight = $("#MainMenu").attr("resize-height");
            if (!mainMenuHeight) {
                mainMenuHeight = $("#MainMenu").height();
            }
            var height = $(document).height() - parseInt(mainMenuHeight);
            (!smooth && smooth != 0) && (smooth = 0);
            //绝对 剧中
            target.css({
                "width": width + "px",
                "height": height + "px",
                "top": "0px",
                "left": "50%",
                "margin-left": -width / 2 + "px",
                "-webkit-transition-duration": smooth + "s",
                "-moz-transition-duration": smooth + "s",
            });
            //resize element
            target.attr("resize-width", width).attr("resize-height", height);

            //add to list
            if (!this.list.containsDom(target)) {
                this.list.push(target);
            }

            CallbackL(arguments);
        },
        list: new Array(),
    },
    MapCube: {
        onresize: function(target, smooth) {
            var parent = target.parent();
            var parentWidth;
            var resizeWidth = parent.attr("resize-width");
            if (resizeWidth) {
                parentWidth = resizeWidth;
            } else {
                parentWidth = parent.width();
            }
            var resizeHeight = parent.attr("resize-height");
            if (resizeHeight) {
                parentHeight = resizeHeight;
            } else {
                parentHeight = parent.height();
            }
            var scaleWidth = Math.floor(parentWidth / Resize.square);
            var scaleHeight = Math.floor(parentHeight / Resize.square);
            var targetWidth = scaleWidth * Resize.square;
            var targetHeight = scaleHeight * Resize.square;
            //css
            (!smooth && smooth != 0) && (smooth = 0);
            target.css({
                "width": targetWidth + "px",
                "height": targetHeight + "px",
                "position": "absolute",
                "top": "50%",
                "margin-top": targetHeight / 2 * -1 + "px",
                "left": "50%",
                "margin-left": targetWidth / 2 * -1 + "px",
                "-webkit-transition-duration": smooth + "s",
                "-moz-transition-duration": smooth + "s",
            });

            target.attr("resize-width", targetWidth).attr("resize-height", targetHeight);

            if (!this.list.containsDom(target)) {
                this.list.push(target);
            }

            CallbackL(arguments);
            //return size scale
            return {
                "scaleWidth": scaleWidth,
                "scaleHeight": scaleHeight
            }
        },
        list: new Array(),
    },
    //图片resize Type:显示实际尺寸，容器居中
    ImageRealCenter: {
        onresize: function(img, smooth) {
            //loaded
            //img.load(function () {
            //after img loaded
            var width = img.width();
            var height = img.height();
            var parent = img.parent();
            var resizeWidth = parent.attr("resize-width");
            var parentWidth = parent.width();
            if (resizeWidth) {
                parentWidth = resizeWidth;
            }
            var resizeHeight = parent.attr("resize-height");
            var parentHeight = parent.height();
            if (resizeHeight) {
                parentHeight = resizeHeight;
            }
            (!smooth && smooth != 0) && (smooth = 0);
            img.css({
                "position": "absolute",
                "top": "50%",
                "margin-top": height / 2 * -1 + "px",
                "left": "50%",
                "margin-left": width / 2 * -1 + "px",
                "-webkit-transition-duration": smooth + "s",
                "-moz-transition-duration": smooth + "s",
            });
            img.attr("resize-width", width).attr("resize-height", height);
            //return actural absolute: left & top
            var left = parentWidth / 2 - width / 2;
            var top = parentHeight / 2 - height / 2;
            img.currentPosition = {
                left: left,
                top: top,
            }
            if (!this.list.containsDom(img)) {
                this.list.push(img);
            }

            CallbackL(arguments);
            return img;
        },
        list: new Array(),
    },
    onResize: function() {
        var self = this;
        self.Screen.height = window.outerHeight;
        self.Screen.width = window.outerWidth;

        self.globalResize();

        Controler.currentView && Controler.currentView.resize();


    },
    globalResize: function() {
        //GlobalResizeFunction
        var sectionBgResize = function() {
            var screenHeight = Resize.Screen.height;
            var screenWidth = Resize.Screen.width;
            //resize SectionContainer background
            var sectionContainer = $("#SectionContainer");
            sectionContainer.css({
                "background-image":
                    "-webkit-gradient(radial, 20% 0%," + screenHeight / 6 + ", 20% 0%, " + screenHeight / 2 + ", from(#fff),to(transparent))," +
                        "-webkit-gradient(radial, 10% -50%," + screenHeight / 3 + ", 0% 0%, " + screenHeight + ", from(#fff),to(transparent))," +
                        "-webkit-gradient(radial, 60% 50%," + 0 + ",60% 50%, " + screenHeight / 16 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                        "-webkit-gradient(radial, 73% 65%," + 0 + ",73% 65%, " + screenHeight / 8 + ", from(rgba(255, 255, 255,0.4)),to(transparent))," +
                        "-webkit-gradient(radial, 100% 100%," + 0 + ", 100% 100%, " + screenHeight / 4 + ", from(#fff), to(transparent))"
            });
        };
        sectionBgResize();

        SectionMenu.onresize();
    },
    //Common function 
    getSize: function(target) {
        if (!target) {
            throw "no target obj";
        }
        var resizeWidth = target.attr("resize-width");
        var resizeHeight = target.attr("resize-height");
        if (resizeWidth && resizeHeight) {
            return { width: parseInt(resizeWidth), height: parseInt(resizeHeight) };
        } else {
            return { width: target.width(), height: target.height() };
        }
    }
};


//bind window resize event
var resizetime;

$(window).resize(function () {
    //
    if(!resizetime) {
        resizetime = setTimeout(function() {
            console.log("=> fire windows resize");
            clearTimeout(resizetime);
            resizetime = null;

            //SectionMenu.onresize(function() {
                Resize.onResize();
            //});

        }, 1000);
    }
});









//tools functions
Array.prototype.containsDom = function (a) {
    ///<summary>
    ///Check if element contains in the array
    ///</summary>
    ///<param name="a" type="Object">One element object to be checked</param>
    try {
        for (var i in this) {
            if (this[i][0]) {
                if (this[i][0] == a[0])
                    return true;
            } else {
                return false;
            }
        }
        return false;
    } catch (e) { return false; }
};