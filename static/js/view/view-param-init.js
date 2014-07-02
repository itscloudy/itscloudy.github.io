

var TextWallPartView = new PartViewParam(
    {
    name: "TextWall-part",
    //sectionContainer: PuzzleSectionView.container,
    init: function (view, callback) {
        var htr = new Array();
        htr.push('<div id="TextWall">');
        htr.push('<div class="text">WHAT\'S</div>');
        htr.push('<div class="text">YOUR</div>');
        htr.push('<div class="text">Day-Dream</div>');
        htr.push('<div class="text">?</div>');
        htr.push('<div class="wallCover"></div>');
        htr.push('<div class="wall"></div>');
        htr.push('</div>');
        view.param.container.append(htr.join(""));

        //if ($("#TextWall").attr("class").indexOf("hidden") !== -1) {
        //    $("#TextWall").removeClass("hidden");
        //}
        callback();
    },
    resize: function (view) {
        // cant slide 
        //CantSlide.init();
        var containerSize = Resize.getSize(view.param.container);
        var text = $("#TextWall .text");
        var txtHeight = containerSize.height / text.length
        text.css({
            "height": txtHeight + "px",
            "font-size": txtHeight + "px",
            "line-height": txtHeight + "px",
        });

        $("#TextWall .wall").css({
            "background-image": "-webkit-gradient(radial, 50% 50% ," + containerSize.height / (text.length * 2) + ",50% 50%, " + containerSize.height / (text.length) + ", from(transparent), to(black))",
            "width": "300%",
            "height": "300%",
            "top": "0px",
            "left": "0px",
        })

        var wallTime = null;
        $("#TextWall .wallCover").unbind("mousemove").bind("mousemove", function (e) {
            
            var x = e.offsetX;
            var y = e.offsetY;

            var originX = containerSize.width, originY = containerSize.height;
            var left = -originX * 1.5 + x;
            var top = -originY * 1.5 + y;

            $("#TextWall .wall").css({
                "-webkit-transform": "translate(" + left + "px," + top + "px)",
            });
            var text = $("#TextWall .text");

            for (var i = 0; i < text.length; i++) {
                var t = $(text[i])
                var top = t.position().top;
                var targetCenter = {
                    x: containerSize.width / 2,
                    y: top + txtHeight / 2,
                }
                t.css({
                    "text-shadow": -(x - targetCenter.x) * .5 + "px " + -(y - targetCenter.y) * .5 + "px " + txtHeight * .2 + "px #000",
                });
            }

        }).unbind("mouseleave").bind("mouseleave", function () {
            $("#TextWall .wall").css({
                "-webkit-transform": "translate(" + 0 + "px," + 0 + "px)",
            });
        });
    }
    });

var CantSlidePartView = new PartViewParam({
    name: "CantSlide-part",
    init: function (view,callback) {
        CantSlide.load(CantSlidePartView);
        callback();
    },
    resize: function () {
        CantSlide.resize(CantSlidePartView);
    }
});



var PuzzleSectionView = new SectionViewParam({
    name: "Section1",
    defaultPartViewParam: TextWallPartView,
});

var SectionView2 = new SectionViewParam({
    name: "Section2",
    init: function (view, callback) {
        /*Init Html content*/
        var imageBoard = $('<div id="imageBoard"></div>');
        var imgList = [{
            title: "",
            src: "content/img/image1.jpg",
        }, {
            title: "",
            src: "content/img/image2.jpg",
        }, {
            title: "",
            src: "content/img/image3.jpg",
        }, {
            title: "",
            src: "content/img/image4.jpg",
        }];

        var dataTarget;

        for (var i = 0 ; i < imgList.length; i++) {
            var img = $('<img src="' + imgList[i].src + '" alt=' + imgList[i].title + '>');
            img.addClass("hidden");
            img.resize(function () {
                console.log("img resize");
            });
            imageBoard.append(img);
            if (i == 0) {
                dataTarget = img;
            }
        }

        var SectionContainer = view.param.container;
        SectionContainer.html(imageBoard);

        dataTarget.load(function () {
            //加载完后
            typeof callback === "function" && callback();
        });
        //typeof callback === "function" && callback();
    },
    loaded: function () {

    },
    show: function (view) {
        //function afterShown() {
        //3D Cube初始化方法
        //在主内容显示之后初始化
        Resize.ImageRealCenter.onresize($($("#imageBoard").children("img")[0]));

        Resize.MapCube.onresize($("#imageBoard"));
        var imagesContainer = view.param.container;
        var imagesTarget = $($("#imageBoard").children("img")[0]);
        Rotate3DCube.Init(imagesContainer, imagesTarget);
        //}
        //afterShown();
    },
    resize: function () {

        Resize.MapCube.list.each(function (target, i) {
            Resize.MapCube.onresize(target, 0.5);
        });
        Resize.ImageRealCenter.list.each(function (target, i) {
            Resize.ImageRealCenter.onresize(target, 0.5);
        });
        Rotate3DCube.Init();

    }
});

var PhotoSectionView = new SectionViewParam({
    name: "Section3",
    reload: "once",
    resize: function () {
        AlbumWall.Init();
    }
});

var RadarTimeSectionView = new SectionViewParam({
    name: "Section4",
    reload: "refresh",
    resize: function (view) {
        Radar.Init(view.target.children(".section-container"));
    }
});

var AudioSectionView = new SectionViewParam({
    name: "Section5",
    init: function (view, callback) {
        view.param.container.load("../view/audio.html", function (response, status, xhr) {
            //response - 包含来自请求的结果数据
            //status - 包含请求的状态（"success", "notmodified", "error", "timeout" 或 "parsererror"）
            //xhr - 包含 XMLHttpRequest 对象
            AudioInit(view);
            callback();
        });
    },
    resize: function (view) {
        var bgResize = function () {
            //SectionView bg w/h = 1.6
            //h screenH 70%
            //w screenW 50
            var imageHeight = 1200;
            var imageWidth = 990;
            var screenHeight = Resize.Screen.height;
            var screenWidth = Resize.Screen.width;
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
    },
});

//动态绑定ParentContainer
CantSlidePartView.bindParentContainer(PuzzleSectionView);
