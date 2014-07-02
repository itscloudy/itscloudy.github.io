/*
 * View Controler
 */

var Controler = {
    prevView: new Array(),
    currentView: null,
    nextView:null,
    transfer: function (nextView) {
        this.nextView = nextView;
        if (this.prevView.length > 0 && this.prevView[this.prevView.length-1].name !== nextView.name) {
            this.prevView[(this.prevView.length - 1)].hide();
        }
        nextView && typeof nextView.show === 'function' && nextView.show();
        this.currentView = nextView;
        if (this.currentView) {
            if (this.prevView.length > 0) {
                if (this.currentView.name !== this.prevView[this.prevView.length - 1].name) {
                    this.prevView.push(this.currentView);
                }
            } else {
                this.prevView.push(this.currentView);
            }
        }
        if (this.prevView.length > 10) {//最多存储10个prevView记录
            this.prevView.shift();
        }
    },
    prevPart: new Array(),
    currentPart: null,
    nextPart: null,
    transferPart: function (nextPart) {
        this.nextPart = nextPart;
        if (this.prevPart.length > 0 && this.prevPart[this.prevPart.length - 1].name !== nextPart.name) {
            this.prevPart[(this.prevPart.length - 1)].hide();
        }
        nextPart && typeof nextPart.show === 'function' && nextPart.show();
        this.currentPart = nextPart;
        if (this.currentPart) {
            if (this.prevPart.length > 0) {
                if (this.currentPart.name !== this.prevPart[this.prevPart.length - 1].name) {
                    this.prevPart.push(this.currentPart);
                }
            } else {
                this.prevPart.push(this.currentPart);
            }
        }
        if (this.prevPart.length > 10) {//最多存储10个prevPart记录
            this.prevPart.shift();
        }
    },
    goback: function () {
        this.currentView.hide();
        this.prevView.pop();
        this.currentView = this.prevView[(this.prevView.length - 1)];
        this.currentView.show();
    },
    preloadLayerShow: function (target, msg) {
        $(target).children("[class!='preloadLayer']").addClass("prehidden");
        var tar = $(target).children(".preloadLayer");
        if (!tar.length) {
            var preloadLayer = null;
            var preloadHtml = new Array();
            preloadHtml.push("<div class='preloadLayer' t='0'>");
            preloadHtml.push("<div class='floatingCirclesG' style='position: absolute;top: 50%;margin-top: -105px;left: 50%;margin-left: -105px;z-index: 1000;'>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_01'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_02'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_03'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_04'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_05'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_06'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_07'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_08'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_09'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_10'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_11'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_12'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_13'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_14'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_15'></div>");
            preloadHtml.push("</div>");
            preloadHtml.push("<div class='loadingMsg'>");
            msg?preloadHtml.push(msg):preloadHtml.push("LoadinG...[for test]");
            preloadHtml.push("</div>");
            preloadHtml.push("</div>");
            preloadLayer = preloadHtml.join("");
            $(target).append(preloadLayer);
        } else {
            
            if (tar.attr("class").indexOf("prehidden") !== -1) {//存在 prehidden(class)
                tar.removeClass("prehidden").css("display", "block").find(".floatingCirclesG").addClass("animation-paused");
            } else {
                //判断调用次数
                var time = parseInt(tar.attr("t"));
                //if (time === 0) {
                tar.attr("t", ++time);
                //}
                
            }
            //$(target).children(".preloadLayer").removeClass("hiddenv");
        }
        Controler.preloadTarget = target;
    },
    preloadLayerHide: function (target) {
        var tar = $(target).children(".preloadLayer");
        if (tar.length) {
            //使用t参数，当多次调用preload时候累加
            var time = parseInt(tar.attr("t"));
            
            if (time === 0) {
                //tar.fadeOut().addClass("prehidden");
                tar.fadeOut();
                $(target).children().removeClass("prehidden");
                tar.addClass("prehidden");
                tar.find(".floatingCirclesG").addClass("animation-paused");
            } else {
                
                tar.attr("t",--time);
            }
            
        }
    },
    preloadTarget: null,
};


/*
 * Audio tag controller
 */
/*

var audio = $("<audio id='currentAudioSong' autoplay='true'></audio>");
var source = $("<source></source>");
source.attr("type", "audio/mpeg");
source.attr("src", /*Music File URL Link);
//source.attr("src","http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3");

audio.html(source);
var audioContainer = $("#audioContainer");
audioContainer.html(audio);

$($("#currentAudioSong")[0]).bind("timeupdate", function (event) {
    //TODO
    //event.currentTarget.currentTime => get the current time the song playing
});

$($("#currentAudioSong")[0]).bind("play", function (e) {
    //TODO
});

$($("#currentAudioSong")[0]).bind("pause", function (e) {
    //TODO
});


/*
 * Ajax data Request
 */
var CurrentAjax = {
    Ajax : {},
    Count:0,
    add:function(func){
        typeof func=="function"&&(CurrentAjax.Ajax = func);
        CurrentAjax.Count = 0;
    },
    send:function(){
        CurrentAjax.Count+=1;
        typeof CurrentAjax.Ajax=="function" && CurrentAjax.Ajax();
    },
    reSend:function(){
        CurrentAjax.Count += 1;
        CurrentAjax.Ajax();
    },
    clear:function(){
        CurrentAjax.Count = 0;
    }
};

var AjaxComplete = function(status){
    switch (status){
        case "success":
            //TODO
            break;
        case "error":   //请求失败
            //TODO
            break;
        case "timeout": //请求超时
            //TODO
            if(CurrentAjax.Count<10){
                msg = "请求超时，正在重新加载..";
                $("#loadingMsg").html(msg);
                CurrentAjax.reSend();
            }else{
                msg = "请求失败，请检查网络连接!";
                $("#loadingMsg").html(msg);
                CurrentAjax.clear();
            }
            $(".startMsg").html(msg);
            break;
    };
};

var Data = {
    init:{
        billboard:function(func){
            var currentData="";
            CurrentAjax.add(function(){
                $.ajax({
                    url: Oauth_helper.BaiduAPI_addedAccessTaken(BaiduMusicAPI.Billboard()), //URL Config
                    success: function(data) {
                        currentData=data;
                        typeof func =="function"&&func(currentData);
                    },
                    timeout:10000,
                    complete:function(jqXHR,status){
                        //console.log("ajaxCompleteStatus:"+status);
                        AjaxComplete(status);
                    },
                });
            });
            CurrentAjax.send();
        },
    }
}



/*
 * iframe control
    var hrefData = document.getElementById("loginPage").contentDocument.location.href;
    var loginPage = $(document.getElementById("loginPage").contentDocument);
 */




