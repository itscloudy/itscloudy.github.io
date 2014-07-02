var Rotate3DCube = {
    container: {
        target: "",
    },
    currentTarget: null,
    currentEvent: null,
    currentPosition:null,
    cube: {
        size: {
            w: 0,
            h: 0,
            u: 70,
        },
    },
    list:new Array(),
    Init: function (container,target) {
        console.log("Init 3D pane");
        //clear #Rotate3DCubeContainer
        var self = this;
        if (container) {
            self.container.target = container;
        }
        if (target) {
            self.currentTarget = target;
        }
        if (!self.container.target || !self.currentTarget) {
            console.log("rotate3Dcube param error");
            return false;
        }
        if (self.container.target.children(".Rotate3DCubeContainer").length == 0) {
            var rotateContainer = $("<div class='Rotate3DCubeContainer'></div>");
            self.container.target.append(rotateContainer);
            self.container.target = container;
        } 
        var sizeScale = Resize.MapCube.onresize(self.container.target.find(".Rotate3DCubeContainer"));
        //是否已有翻转块
        if (self.container.target.find(".Rotate3DCubeContainer").length != 0) {
            //判断是否已初始化或者高宽比有没有变化
            if ((self.row && self.row == sizeScale.scaleHeight) && (self.col && self.col == sizeScale.scaleWidth)) {
                return;
            }
        }
        //两个翻转size //TODO
        self.row = sizeScale.scaleHeight;
        self.col = sizeScale.scaleWidth;
        self.cube.size.w = self.cube.size.h = self.cube.size.u;
        if (!self.currentTarget.currentPosition) {
            self.currentTarget = Resize.ImageRealCenter.onresize(self.currentTarget);
            //show target
            self.currentTarget.css({
                "display":"block",
            });
        }
        //clear container 
        self.container.target.find(".Rotate3DCubeContainer").html("");
        var targets = self.currentTarget.parent().children();
        //if (self.container.target.children().length==0){
            for (var r = 0; r < self.row; r++) {
                for (var d = 0; d < self.col; d++) {
                    var cube = $('<div class="cubepane"></div>')
                    cube.css({
                        "width":self.cube.size.w+"px",
                        "height": self.cube.size.h + "px",
                    });
                    //init front pane
                    var front = $('<div class="pane-front"></div>');
                    //init back pane
                    var back = $('<div class="pane-end"></div>')

                    //add front pane
                    cube.append(front);
                    //add back pane
                    cube.append(back);

                    cube.attr("id", "cube-pane-" + r + "-" + d);
                    self.container.target.find(".Rotate3DCubeContainer").append(cube);
                }
            }
            //self.container.target.click();
            //bind event
            //target.parent().unbind("click").click(function (e) {
            self.currentTarget.parent().unbind("click").click(function (e) {
                var currentImageSize = {
                    width: self.currentTarget.width(),
                    height:self.currentTarget.height(),
                }
                var imageContainer = self.currentTarget.parent();
                var containerSize = {
                    width: imageContainer.width(),
                    height:imageContainer.height(),
                }

                var mouseLeft = e.offsetX - (currentImageSize.width-containerSize.width) / 2;
                var mouseTop = e.offsetY - (currentImageSize.height - containerSize.height) / 2;

                var cubePosition = {
                    row: Math.floor(mouseTop / self.cube.size.u),
                    col: Math.floor(mouseLeft / self.cube.size.u),
                }
                console.log("left:" + mouseLeft + " top:" + mouseTop);
                console.log("pane[" + cubePosition.row + "," + cubePosition.col + "]")

                self.currentPosition = cubePosition;
                self.initNext();
            });

            console.log("Rotate3Dpane Init");

            //Goto Init Front
            self.initFront(self.currentTarget);

            //add list
            if (!self.list.containsDom(self.container.target)) {
                self.list.push(self.container.target);
            }

        return self;
    },
    initFront: function (frontTarget) {
        var self = this;
        !frontTarget && (frontTarget = self.currentTarget);

        //if (self.container.target.children().length == 0) {
        var cubes = self.container.target.find(".Rotate3DCubeContainer").find(".cubepane");


        for (var r = 0; r < self.row; r++) {
                for (var d = 0; d < self.col; d++) {
                    var cube =$(cubes[r*self.col+d]);
                    
                    //init front pane
                    var front = cube.find(".pane-front");
                    
                    //add front content
                    var frontContent = frontTarget.clone();

                    //css posiion
                    var cube_left = d * self.cube.size.w;
                    var cube_top = r * self.cube.size.h;

                    frontContent.css({
                        "left": frontTarget.currentPosition.left - cube_left + "px",
                        "top": frontTarget.currentPosition.top - cube_top + "px",
                        "margin": "0px",
                        "display": "block",
                    });

                    front.html(frontContent);
                }
            }
        console.log("Front Panne Inited");

        return self;
    }

    //}
    ,
    initNext: function (next) {
        var self = this;
        if (!next) {
            next = self.currentTarget.next();
            if (next.length==0) {
                next = $(self.currentTarget.parent().children()[0]);
                if (!next) {
                    return;
                }
            }
        }
        //show Roate3DContainer to top
        self.container.target.find(".Rotate3DCubeContainer").removeClass("bottom-pane").addClass("top-pane");


        //clear #Rotate3DCubeContainer
        self.currentTarget.css({
            "display": "none",
        })

        //if (self.container.target.children().length != 0) {
        var cubes = self.container.target.find(".Rotate3DCubeContainer").children(".cubepane");
        if(cubes.length>0){
            for (var r = 0; r < self.row; r++) {
                for (var d = 0; d < self.col; d++) {
                    var cube = $(cubes[r * self.col + d]);
                    //init front pane
                    var front = cube.find(".pane-front");
                    //init back pane
                    var back = cube.find(".pane-end");
                    
                    //add back content
                    if (!next.currentPosition) {
                        next = Resize.ImageRealCenter.onresize(next);
                    }

                    var backContent = next.clone();

                    //css posiion
                    var cube_left = d * self.cube.size.w;
                    var cube_top = r * self.cube.size.h;
                    
                    backContent.css({
                        "left": next.currentPosition.left - cube_left + "px",
                        "top": next.currentPosition.top - cube_top + "px",
                        "margin": "0px",
                        "display": "block",
                    })
                    back.html(backContent);
                   //add back pane
                    cube.append(back);
                }
            }

            //Add index
            for (var i = 0; i < $(".cubepane").length; i++) {
                var t = $($(".cubepane")[i]);
                t.attr("index", i);
            }

            //last show pane call back
            //最右下角的
            //var lastpanes = $(cubes[cubes.length - 1]);
            var top_left ={
                step:self.currentPosition.row + self.currentPosition.col,
                position: {
                    row: 0,
                    col:0,
                }
            }
            var top_right = {
                step: self.currentPosition.row + (self.col - 1) - self.currentPosition.col,
                position: {
                    row: 0,
                    col:self.col-1,
                }
            }
            var bottom_left = {
                step: self.row - 1 - self.currentPosition.row + self.currentPosition.col,
                position: {
                    row: self.row - 1,
                    col:0,
                }
            }
            var bottom_right = {
                step: self.row - 1 - self.currentPosition.row + self.col - 1 - self.currentPosition.col,
                position: {
                    row: self.row - 1,
                    col: self.col - 1,
                }
            }
            var stepMax = Math.max(top_left.step, top_right.step, bottom_left.step, bottom_right.step);
            var stepArray = [top_left,top_right,bottom_left,bottom_right];
            var lastPosition = null;
            for (var i = 0; i < stepArray.length; i++) {
                if (stepArray[i].step == stepMax) {
                    lastPosition = stepArray[i];
                    break;
                }
            }
            //clear all
            cubes.unbind('webkitTransitionEnd moztransitionend transitionend oTransitionEnd')
            var lastIndex = lastPosition.position.row * self.col + lastPosition.position.col;
            var lastpanes = $(cubes[lastIndex]);
            console.log("lastPositin= row:" + lastPosition.position.row + " col:" + lastPosition.position.col+" lastNumber:"+lastIndex);
            lastpanes.unbind('webkitTransitionEnd moztransitionend transitionend oTransitionEnd').bind('webkitTransitionEnd moztransitionend transitionend oTransitionEnd', function () {
                console.log("TransitionEnd");
                self.AfterAll();
                
            });

            
            //change target iamgge
            self.currentTarget = next;

            self.showEffect();
            //self.container.target.click();

            console.log("3D pane showNext");
        }

        return self;
    },

    showEffect: function () {
        //简单效果 1 [左上角起多米诺骨牌]
        var self = this;
        /*
        //this.container.target.unbind("click").click(function () {
            //add delay
            var delay = 0.2;
            var duration = 0.6;
            var panes = $(self.container.target.children());
            for (var i = 0; i < panes.length; i++) {
                var pane = $(panes[i]);
                var backpane = pane.find(".pane-end");
                var frontpane = pane.find(".pane-front");
                //add transition class
                var r = parseInt(i / self.col);
                var d = i % self.col;
                var r_time = 0;
                r > 0 && (r_time = r * self.col * delay);
                var d_time = 0;
                //backpane add ready ckass
                
                if (r % 2 == 0) {
                    frontpane.addClass("frontpane-ready-to-right");
                    backpane.addClass("backpane-ready-to-right");
                    d_time = d * delay;
                    pane.addClass("pane-to-right");
                } else {
                    frontpane.addClass("frontpane-ready-to-left");
                    backpane.addClass("backpane-ready-to-left");
                    d_time = (self.col - 1 - d) * delay;
                    pane.addClass("pane-to-left");
                }
                var spaceTime = r_time + d_time;
                pane.css("-webkit-transition-delay", spaceTime + "s");
                pane.css("-webkit-transition-duration", duration + "s");
            }
        //});
        */
        //从左上角起的连片翻转
        //add delay
        var delay = 0.1;
        var duration = 0.7;
        var panes = $(self.container.target.find(".Rotate3DCubeContainer").children());
        /*
        for (var i = 0; i < panes.length; i++) {
            var pane = $(panes[i]);
            var backpane = pane.find(".pane-end");
            var frontpane = pane.find(".pane-front");
            //add transition class
            var r = parseInt(i / self.col);
            var d = i % self.col;
            //backpane add ready ckass
            rotateTo("left-top",frontpane,backpane,pane);

            var spaceTime = (d + r) * delay;
            pane.css("-webkit-transition-delay", spaceTime + "s");
            pane.css("-webkit-transition-duration", duration + "s");
        }
        */

        //getCurrentPosition 
        //根据点击点反转
        for (var i = 0; i < panes.length; i++) {
            var pane = $(panes[i]);
            var backpane = pane.find(".pane-end");
            var frontpane = pane.find(".pane-front");
            //add transition class
            var r = parseInt(i / self.col);
            var d = i % self.col;
            var step = Math.abs(self.currentPosition.row - r) + Math.abs(self.currentPosition.col - d);
            var spaceTime = step * delay;
            //判断方向,坐标轴建立
            var distanceX = (d - self.currentPosition.col);
            var distanceY = (r - self.currentPosition.row)*-1;
            //rotateTo("left-top", frontpane, backpane, pane);
            var tan = distanceY / distanceX;
            if ((tan && tan >= Math.tan(-15 / 180 * Math.PI) && tan <= Math.tan(15 / 180 * Math.PI))|| distanceY==0) {
                if (distanceX > 0) {
                    rotateTo("right", frontpane, backpane, pane);
                } else {
                    rotateTo("left", frontpane, backpane, pane);
                }
                
            } else if (distanceX==0|| tan >= Math.tan(75 / 180 * Math.PI)||tan<=Math.tan(-75/180*Math.PI)) {
                console.log("[r:" + r + ",d:" + d + "]");
                console.log("[distanceX:" + distanceX + ",distanceY:" + distanceY + "]");
                console.log("tan=" + tan);
                if (distanceY > 0) {
                    rotateTo("top", frontpane, backpane, pane);
                } else {
                    rotateTo("bottom", frontpane, backpane, pane);
                }
            }else if (tan > Math.tan(15 / 180 * Math.PI) && tan < Math.tan(75 / 180 * Math.PI)) {
                if (distanceX > 0) {
                    rotateTo("right-top", frontpane, backpane, pane);
                } else {
                    rotateTo("left-bottom", frontpane, backpane, pane);
                }
            } else if (tan > Math.tan(-75 / 180 * Math.PI)&& tan<Math.tan(-15/180*Math.PI)) {
                if (distanceX > 0) {
                    rotateTo("right-bottom", frontpane, backpane, pane);
                } else {
                    rotateTo("left-top", frontpane, backpane, pane);
                }
            }
            pane.css("-webkit-transition-delay", spaceTime + "s");
            pane.css("-webkit-transition-duration", duration + "s");
        }

        return self;

        function rotateTo(forward,frontpane,backpane,pane) {
            !forward && (forward = "right-top");
            forward = forward.toLowerCase();
            frontpane.addClass("frontpane-ready-to-" + forward);
            backpane.addClass("backpane-ready-to-" + forward);
            pane.addClass("pane-to-" + forward);
        }
        
    },
    resetPane: function () {
        var self = this;
        var cubes = $(self.container.target.find(".Rotate3DCubeContainer").find(".cubepane"));
        cubes.attr("class", "cubepane");

        //clear duration & delay
        cubes.css({
            "-webkit-transition-delay" : "0s",
            "-webkit-transition-duration":"0s",
        })

        var frontPanes = $(self.container.target.find(".Rotate3DCubeContainer").find(".pane-front"));
        frontPanes.attr("class", "pane-front");

        var endPanes = $(self.container.target.find(".Rotate3DCubeContainer").find(".pane-end"));
        endPanes.attr("class", "pane-end");

        return self;
    },
    AfterAll: function () {
        var self = this;
        self.currentTarget.css({
            "display": "block",
        });
        self.container.target.find(".Rotate3DCubeContainer").removeClass("top-pane").addClass("bottom-pane");
        //GOTO initCurrentFront
        self.resetPane().initFront();
        //alert("Affter All");
    }
    
}

//辗转相除法求最大公约数
//辗转相除法:

function f(x,y)
{
var m, n, t ;
if(x > y){
    m = x ;
    n = y ;
}else{
    m = y ;
    n = x ;
}

while(m % n != 0)
{
    t = n ;
    n = m % n ;
    m = t ;
}

return n ;
}


function bindRotate3DCube(targetImage) {
    targetImage.unbind("click").click(function () {
        //next Image
        var nextImage = $($(this).next());
        if (nextImage.length) {
            //Init Rotate3DCube
            Rotate3DCube.Init(targetImage, nextImage);
        } else {
            nextImage = ($(this).parent().children()[0])
            Rotate3DCube.Init(targetImage, nextImage);
        }
    });
}