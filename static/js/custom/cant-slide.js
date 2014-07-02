var CantSlide = {
    load:function(viewParam){
        var container = viewParam.container;
        var self = this;
        if (container.find("#BoxSlide").length === 0) {
            //需要一种初始化数据和html结构的方式
            container.load("../Day-Dream/view/cantslide.html", function (response, status, xhr) {
                //response - 包含来自请求的结果数据
                //status - 包含请求的状态（"success", "notmodified", "error", "timeout" 或 "parsererror"）
                //xhr - 包含 XMLHttpRequest 对象
                //AudioInit();
                self.init(viewParam);
            });
        }
        
    },
    init: function (viewParam) {
        var container = viewParam.container;
        var clipNumber = $("#BoxSlide li").length,
        csize = Resize.getSize(container);
        var averageWidth = csize.width / (clipNumber + .5);//+1作为边距留白
        var tan = Math.atan(averageWidth / 2 / csize.height);

        $("#BoxSlide").css({
            "width": csize.width - averageWidth / 2 + "px",
        })
        var deg = toFixed(tan / Math.PI * 180, 2);
        $("#BoxSlide > li").css({
            "-webkit-transform": "skewX(" + -deg + "deg)",
        });
        $(".upright").css({
            "-webkit-transform": "skewX(" + deg + "deg)",
        });
        $(".cant").css({
            "-webkit-transform": "rotateZ(" + deg + "deg) skewX(" + deg + "deg)",
        });

        var images = $("#BoxSlide img");
        images.load(function () {
            var rgb = getAverageRGB(this);
            var liparent = $(this).parent().parent().parent();
            liparent.attr({
                "bg-color": "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + 0.5 + ")",
            })
            liparent.css({
                "color": "#fff",
                //"color": "rgba(" + (255 - rgb.r) + "," + (255 - rgb.g) + "," + (255 - rgb.b) + "," + 1 + ")",
            });
            liparent.find(".title").css({
                "background-color": "rgba(" + (255 - rgb.r) + "," + (255 - rgb.g) + "," + (255 - rgb.b) + "," + 1 + ")",
            })
            var parent = $(this).parent();
            if (!(parent.find("img").length > 1)) {
                var imgDataUrl = grayscale(this);
                parent.append("<img src='" + imgDataUrl + "'/>");
            }
        })
        CantSlide.addEvents();

        
    },
    addEvents: function () {
        /*
        var img = $("#BoxSlide img");
        for (var i = 0; i < img.length; i++) {
            var rgb = getAverageRGB(img[i]);
            var liparent = $(img[i]).parent().parent().parent();
            liparent.attr({
                "bg-color": "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + 1 + ")",
            })
            liparent.css({
                "color": "#fff",
                //"color": "rgba(" + (255 - rgb.r) + "," + (255 - rgb.g) + "," + (255 - rgb.b) + "," + 1 + ")",
            });
            liparent.find(".title").css({
                "background-color": "rgba(" + (255 - rgb.r) + "," + (255 - rgb.g) + "," + (255 - rgb.b) + "," + 1 + ")",
            })
            var parent = $(img[i]).parent();
            if (!(parent.find("img").length > 1)) {
                var imgDataUrl = grayscale(img[i].src);
                parent.append("<img src='" + imgDataUrl + "'/>");
            }
        }
        */
        $("#BoxSlide li").bind("mouseenter", function () {
            var bgColor = $(this).attr("bg-color");
            $(this).css({
                "background-color": bgColor,
            })
        }).bind("mouseleave", function () {
            $(this).css({
                "background-color": "transparent",
            })
        });
    },
    resize: function (viewParam) {
        this.init(viewParam);
    }
}

