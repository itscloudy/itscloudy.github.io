"use strict"; //ECMAScript 严格模式
/*
 * window error
 */
(function () {
    window.onerror = function (msg, url, line) {
        //var ErrorMsg = "Error=" + msg + "</br>URL=" + url + "</br>LINE=" + line + "</br>" + $("#dataView").html();
        //alert("Error=" + msg + " url=" + url + " line=" + line);
        //DebugLog(ErrorMsg);
    };
}());

$().ready(function () {
   //f Resize.onResize();

    //First View - LoginView
    //Controler.transfer(new LoginView());//跳过登陆界面
    
    if (!getCookie("username")) {
        Controler.transfer(new LoginView());
    } else {
    
    Resize.onResize();

        //sectionContainer.removeClass("hidden");
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
        
        //Controler.transfer(new LoginView());

    }

    /* clip slide image  
        $("#BoxSlide img").load(function () {
            console.log($(this)[0].src + "loaded");
        });
        var imgList = $("#BoxSlide img");
        for (var i = 0; i < imgList.length; i++) {
            //get the img dom
            var img = imgList[i][0];

            //trans to 黑白灰度图片 
            //return data URL
            //var cover = $("<img class=''/>")
        }

        $("#BoxSlide li").bind("mouseover", function () {

        });
	*/
        $(window).bind("online", function (e) {
            alert("=>" + navigator.onLine ? "onLine" : "offLine");
        });
        $(window).bind("offline", function (e) {
            alert("=>" + navigator.onLine ? "onLine" : "offLine");
        });


        document.onkeydown = function (e) {
            var currKey=0,e=e||event;
            currKey=e.keyCode||e.which||e.charCode;
            var keyName = String.fromCharCode(currKey);
            var ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, altKey = e.altKey, metaKey = e.metaKey;
            console.log("onkeydown [" + navigator.appName + "] ==> 按键码:" + currKey + " 字符:[" + keyName + "] ctrlKey:" + ctrlKey + " shiftKey:" + shiftKey + " altKey:" + altKey);
        };

        document.onkeyup = function (e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            var keyName = String.fromCharCode(currKey);
            var ctrlKey = e.ctrlKey,shiftKey = e.shiftKey,altKey = e.altKey,metaKey = e.metaKey;//command 键（Mac下）
            console.log("onkeyup [" + navigator.appName + "] ==> 按键码:" + currKey + " 字符:[" + keyName + "] ctrlKey:" + ctrlKey+" shiftKey:"+shiftKey+" altKey:"+altKey);

        }
        document.onkeypress = function (e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            var keyName = String.fromCharCode(currKey);
            var ctrlKey = e.ctrlKey, shiftKey = e.shiftKey, altKey = e.altKey, metaKey = e.metaKey;
            console.log("onkeypress [" + navigator.appName + "] ==> 按键码:" + currKey + " 字符:[" + keyName + "] ctrlKey:" + ctrlKey + " shiftKey:" + shiftKey + " altKey:" + altKey);
        }

});

