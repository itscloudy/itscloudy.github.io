// JavaScript source code
/*
 * window error
 */

(function(){
    window.onerror = function(msg, url, line) {
        var ErrorMsg = "Error="+msg+"</br>URL="+url+"</br>LINE="+line+"</br>"+$("#dataView").html();
        //DebugLog(ErrorMsg);
    };
}());



/*
 * View Controler
 */

var Controler = {
    prevView: new Array(),
    currentView: null,
    transfer: function (nextView) {
        if (Controler.prevView.length > 0 && Controler.prevView.name != nextView.name) {
            Controler.prevView[(Controler.prevView.length - 1)].hide();
        }
        nextView && typeof nextView.show === 'function' && nextView.show();
        Controler.currentView = nextView;
        if (Controler.currentView) {
            if (Controler.prevView.length > 0) {
                if (Controler.currentView.name != Controler.prevView[Controler.prevView.length - 1].name) {
                    Controler.prevView.push(Controler.currentView);
                }
            } else {
                Controler.prevView.push(Controler.currentView);
            }
        }
        if (Controler.prevView.length > 10) {
            Controler.prevView.shift();
        }
    },
    goback: function () {
        Controler.currentView.hide();
        Controler.prevView.pop();
        Controler.currentView = Controler.prevView[(Controler.prevView.length - 1)];
        Controler.currentView.show();
    },
    preloadLayerShow: function (target, msg) {
        $(target).children().addClass("hiddenv");
        if ($(target).attr("class").indexOf("View") != -1) {
            $(target).addClass("nobg");
        }
        if (!$(target).children(".preloadLayer").length) {
            var preloadLayer = null;
            var preloadHtml = new Array();
            preloadHtml.push("<div class='preloadLayer'>");
            preloadHtml.push("<div id='floatingCirclesG' style='position: absolute;top: 50%;margin-top: -84px;left: 50%;margin-left: -64px;z-index: 1000;'>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_01'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_02'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_03'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_04'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_05'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_06'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_07'></div>");
            preloadHtml.push("<div class='f_circleG' id='frotateG_08'></div>");
            preloadHtml.push("</div>");
            preloadHtml.push("<div id='loadingMsg'>");
            //msg?preloadHtml.push(msg):preloadHtml.push("æ•°æ�®åŠ è½½ä¸­ï¼Œè¯·ç¨�å�Ž...");
            preloadHtml.push("</div>");
            //preloadHtml.push("<div id='waitMsg'>è¯·ç¨�å€™...</div>");

            preloadHtml.push("</div>");
            preloadLayer = preloadHtml.join("");
            $(target).append(preloadLayer);
        } else {
            //msg?$("#loadingMsg").html(msg):$("#loadingMsg").html("æ•°æ�®åŠ è½½ä¸­ï¼Œè¯·ç¨�å�Ž...");
            $(target).children(".preloadLayer").css("display", "block").removeClass("hiddenv");
            //$(target).children(".preloadLayer").removeClass("hiddenv");
        }
        Controler.preloadTarget = target;
    },
    preloadLayerHide: function (target) {
        //if($(target).children(".preloadLayer").length){
        $(target).removeClass("nobg");
        $(target).children(".preloadLayer").css("display", "none");
        $(target).children().removeClass("hiddenv");
        //}

        //$("#dataView").css("display","none");
    },
    preloadTarget: null,
};


/*
 * Audio tag controller
 */

var audio = $("<audio id='currentAudioSong' autoplay='true'></audio>");
var source = $("<source></source>");
source.attr("type", "audio/mpeg");
source.attr("src", /*Music File URL Link*/);
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
 * 
 */
var hrefData = document.getElementById("loginPage").contentDocument.location.href;
var loginPage = $(document.getElementById("loginPage").contentDocument);




