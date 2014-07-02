

/*
http://www.taobao.com/go/market/2013/1212/main.php?spm=608.2291429.8086006.1.z7AfTh

1.进入游戏界面，出现游戏说明
点击知道了
<div class="matching-game-tip"><span role="button"></span></div> =>click

matching-game-tip 节点消失
2.爱消除 开始开始键
<div class="matching-game-menu"><h1></h1><span role="button"></span></div> => click

3.游戏标识
<div class="matching-game-item" aria-label="3" style="top: 0px; left: 0px;"></div>
aria-label="3" 判断标识

4.抽奖
<span class="tbg-farm-dialog-common-btn inner-btn" data-name="getLucky">官人抽我</span> =>click

5.继续游戏
<span class="tbg-farm-dialog-common-btn tbg-farm-dialog-common-ml-60 inner-btn" data-name="replayGame">再玩一次</span>


排列 11列9行
<div class="matching-game-item" aria-label="5" style="top: 0px; left: 0px;"></div>

<div class="matching-game-item" aria-label="2" style="top: 275px; left: 550px;"></div>

块宽度 550/11 = 55
块高度 275/5  = 55

块坐标位置 	r = top / 55    0-5
		d = left / 55 	0-11
aria-label	[ 0 , 4 , 5 , 2 , 2 , 1 ,  ]
*/
    var map = new Array(new Array(11),
        new Array(11), new Array(11),
        new Array(11), new Array(11),
        new Array(11));
var wrongLine = 0;
var MapD = 11;
var MapR = 6;

function getCurrentTargets(callback) {
    var targets = document.getElementsByClassName("matching-game-item");
    if (targets.length == 66) {
        callback(targets);
    } else {
        setTimeout(function () {
            getCurrentTargets(callback);
        });
    }
}

function clearMap() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            map[i][j] = null;
        }
    }
}
var stopInitMap = false;
function initMap(targets, callback) {
    clearMap();
    for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        var label = t.getAttribute("aria-label");
        var top = parseFloat(t.style.top);
        var left = parseFloat(t.style.left);
        if (top % 55 != 0 || left % 55 != 0) {
            setTimeout(function () {
                if (!stopInitMap) {
                    initMap(targets, callback);
                }
            },500);
            return false;
        } else {
            var r = top / 55;
            var d = left / 55;
            var c = {
                target: t,
                label: label,
                location: {
                    r: r,
                    d: d,
                }
            };
            if (!map[r][d]) {
                map[r][d] = c;
            } else {
                //console.log(wrongLine + "sth wrong : [info] method=> initMap :get the location info r=" + r + ", d=" + d + ", label=" + label);
                wrongLine++;
                setTimeout(function () {
                    if (!stopInitMap) {
                        initMap(targets, callback);
                    }
                }, 500);
                return false;
            }
        }
    }
    //validate mapinfo
    var v_number = 0;
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] != null) {
                ++v_number;
            } else {
                //console.log(wrongLine + "sth wrong: validate mapinfo wrong => map[" + i + "][" + j + "]==null");
                setTimeout(function () {
                    if (!stopInitMap) {
                        initMap(targets, callback);
                    }
                }, 500);
                return false;
            }
        }
    }

    callback();
};

//判断可效的相邻块
function getClearTarget() {
    //map
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            var ct = map[i][j];
            //对象块右边替换验证
            //console.log("getClearTarget r=" + ct.location.r + " ,d=" + ct.location.d);
            var changeTarget1 = validateWithRight(ct);
            //对象块下边替换验证
            var changeTarget2 = validateWithBottom(ct);
            if (changeTarget1) {
                //console.log("左右可替换")
                changeAction(ct, changeTarget1);
                return null;
                break;
            } else if (changeTarget2) {
                //console.log("上下可替换");
                changeAction(ct, changeTarget2);
                return null;
                break;
            }

        }
    }
}

//替换右边块
function validateWithRight(target) {
    var t1 = target;
    var location = t1.location;
    //右边块 exist
    var t2 = null;
    if (location.d + 1 < MapD) {
        t2 = map[location.r][parseInt(location.d) + 1];
    }
    if (!t2) {
        return null;
    }
    //判断可消，label & location
    if (canClear(t1.label, t2.location, "changeToRight")) {
        return t2;
    }
    if (canClear(t2.label, t1.location, "changeToLeft")) {
        return t2;
    }
    return null;

}
//替换下边块

function validateWithBottom(target) {
    var t1 = target;
    //console.log(target.location);
    var location = target.location;
    var t2 = null;
    if (location.r + 1 < MapR) {
        var r = parseInt(location.r);
        t2 = map[r + 1][location.d];
        //console.log(t2.location.r + " - " + t2.location.d);
    }
    if (!t2) {
        return null;
    }
    if (canClear(t1.label, t2.location, "changeToBottom")) {
        //console.log("canclear");
        return t2;
    }
    if (canClear(t2.label, t1.location, "changeToTop")) {
        //console.log("canclear");
        return t2;
    }
    return null;
}

function canClear(label, location, direction) {
    //label目标标识 0时为random块
    //location目标位置
    var v = false;
    //console.log("if ？ canClear label=" + label + " , location:r=" + location.r + ",d=" + location.d);
    var t1 = null;
    var t2 = null;
    var t = map[location.r][location.d];
    //1 左边两块
    location.d = parseInt(location.d);
    location.r = parseInt(location.r);
    if (location.d >= 2 && direction != "changeToRight") {
        var t1 = map[location.r][location.d - 2];
        var t2 = map[location.r][location.d - 1];

        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("左边两块 can clear");
            return true;
        } else {
            //console.log("左边两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //上边两块
    if (location.r >= 2 && direction != "changeToBottom") {
        var t1 = map[location.r - 1][location.d];
        var t2 = map[location.r - 2][location.d];
        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        //console.log
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("上边两块 can clear");
            return true;
        } else {
            //console.log("上边两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //下边两块
    if (location.r + 2 < MapR && direction != "changeToTop") {
        var t1 = map[location.r + 1][location.d];
        var t2 = map[location.r + 2][location.d];
        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("下边两块 can clear");
            return true;
        } else {
            //console.log("下边两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //右边两块
    if (location.d + 2 < MapD && direction != "changeToLeft") {
        var t1 = map[location.r][location.d + 1];
        var t2 = map[location.r][location.d + 2];
        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("右边两块 can clear");
            return true;
        } else {
            //console.log("右边两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //左右两块
    if ((location.d + 1 < MapD && location.d - 1 >= 0) && direction != "changeToRight" && direction != "changeToLeft") {
        var t1 = map[location.r][location.d + 1];
        var t2 = map[location.r][location.d - 1];
        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("左右两块 can clear");
            return true;
        } else {
            //console.log("左右两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //上下两块
    /*if (location.r == 3 && location.d == 0) {
        //console.log("t1: r=" + t1.location.r + ", d=" + t1.location.d);
        //console.log("t2: r=" + t2.location.r + ", d=" + t2.location.d);
        console.log("current location:r=" + location.r + " d=" + location.d);
        console.log("label=" + label);
        console.log("direction=" + direction);
    }*/
    if ((location.r + 1 < MapR && (location.r - 1 >= 0)) && direction != "changeToTop" && direction != "changeToBottom") {
        var t1 = map[location.r + 1][location.d];
        var t2 = map[location.r - 1][location.d];
        
        
        //console.log("targetLocation=> r=" + location.r + " , d=" + location.d);
        /*if ((t1.label == t2.label && t1.label == label) || (t1.label == t2.label && label == "0")) {
            //console.log("上下两块 can clear");
            return true;
        } else {
            //console.log("上下两块 can't clear");
        }*/
        var compare = compareMath(t1.label, t2.label, label);
        if (compare) {
            return compare;
        }
    }
    //console.log("=> nothing can clear");
    return false;
};

function compareMath(l1,l2,l3) {
    if ((l1 == l2 && l1 == l3)||(l1==l2&&l3=="0")||(l1=="0"&&l2==l3)||(l2=="0"&&l1==l3)) {
        return true;
    } else {
        return false;
    }
}


var stopCaculate = false;

var changeInterval = 0;
function changeAction(current, change) {
    changeInterval++;
    if (changeInterval > 5) {
        Controler.stopGame();
        setTimeout(function () {
            Controler.start();
        }, 500);
        return false;
    }
    //console.log("start changeAction ==> current.aria-selected=" + current.target.getAttribute("aria-selected"));
    if (!current.target.getAttribute("aria-selected")) {
        current.target.click();
        //console.log("=>click currentTarget : location.r=" + current.location.r + " - location.d" + current.location.d);
        //alert("click");
    }
    setTimeout(function () {
        if (stopCaculate) {
            return false;
        }
        //console.log("current.aria-selected = " + current.target.getAttribute("aria-selected"));
        //console.log("change.aria-selected = " + change.target.getAttribute("aria-selected"));
        if (current.target.getAttribute("aria-selected") == "true") {
            //if (change.target.getAttribute("aria-selected") == null) {
            //console.log("click change.r = " + change.location.r + " - change.d = " + change.location.d);
            change.target.click();
            //console.log("change clicked");
            startCaculate();
        } else {
            console.log("click change again");
            if (stopCaculate) {
                return;
            }
            changeAction(current, change);
        }
    }, 500);
}

var viewInterval = null;
var gameInfo = {
    time: 0,
    none:0,//什么都没有
    oneyuan: 0,
    zhonghongbao: 0,//去种红包吧？
    taojingbi: 0,//淘金币？
    tolow:0,
}
var Controler ={
    start: function () {
        stopCaculate = false;
        stopInitMap = false;
        if (document.getElementsByClassName("matching-game-menu")[0] && document.getElementsByClassName("matching-game-menu")[0].getElementsByTagName("span")[0]) {
            //点击开始箭头
            document.getElementsByClassName("matching-game-menu")[0].getElementsByTagName("span")[0].click();
            setTimeout(function () {
                startCaculate();
            }, 500);
        } else {
            startCaculate()
        }
        
        if (!viewInterval) {
            viewInterval = setInterval(function() {
                //官人点我
                if (document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[0] && document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[0].innerHTML == "官人抽我") {
                    console.log("开始抽奖")
                    Controler.stopGame();
                    document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[0].click();
                }
                if (document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[1] && document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[1].innerHTML == "再玩一次" && document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[1].getAttribute("class").indexOf("hidden-btn") == -1) {
                    console.log("再玩一次");
                    gameInfo.time++;
                    var info = document.getElementsByClassName("tbg-farm-dialog-game-score tbg-farm-lottery tbg-farm-bg-cloud")[0];
                    if (info && info.getElementsByClassName("tbg-farm-dialog-just")[0]) {
                        var result = info.getElementsByClassName("tbg-farm-dialog-just")[0].getAttribute("class");
                        if (result.indexOf("tbg-farm-dialog-get-2") != -1) {
                            gameInfo.oneyuan++;
                        } else if (result.indexOf("tbg-farm-dialog-get-1") != -1) {
                            gameInfo.zhonghongbao++;
                        } else if (result.indexOf("tbg-farm-dialog-get-0") != -1) {
                            gameInfo.none++;
                        } else if (result.indexOf("tbg-farm-dialog-get-3") != -1) {
                            gameInfo.taojingbi++;
                        }
                    } else {
                        gameInfo.tolow++;
                        Controler.stop();
                        Controler.start();
                    }

                    document.getElementsByClassName("tbg-farm-dialog-common-btn inner-btn")[1].click();
                    setTimeout(function() {
                        Controler.start();
                    }, 3200);

                }
            }, 500);
        }
        

        
    },
    stop: function () {
        stopCaculate = true;
        stopInitMap = true;
        clearInterval(viewInterval);
        viewInterval = null;
        console.log("停止游戏");
    },
    stopGame: function () {
        //console.log("stopGame")
        stopCaculate = true;
        stopInitMap = true;
    }
}

function startCaculate() {
    getCurrentTargets(function (targets) {
        //console.log("==>开始计算");
        changeInterval = 0;
        initMap(targets, function () {
            getClearTarget();
        });
    });
}

function getKey(e) {
    e = e || window.event;
    var keycode = e.which ? e.which : e.keyCode;
    if (keycode == 83) { //如果按下s键，开始
        console.log("start");
        Controler.start();
    } else if (keycode == 69) {//按下e键，stop
        console.log("end");
        Controler.stop();
    } else if (keycode == 76) {
        //显示成果 
        console.log("亲，你到现在一共游戏" + gameInfo.time + "次，收货如下：【神马都木有】" + gameInfo.none + "次，【1块钱红包！！】" + gameInfo.oneyuan + "次， 【淘金币？】" + gameInfo.taojingbi + "次， 【分数太低】" + gameInfo.tolow+"次");
        if (gameInfo.oneyuan == 0) {
            console.log("“看来运气不咋滴啊，来，给你吹口仙气~，赶紧继续吧！”")
        } else if (gameInfo.oneyuan < 5) {
            console.log("“呦~ 不错嘛，有" + gameInfo.oneyuan + "个了，加了个油~”");
        } else if (gameInfo.oneyuan > 5) {
            console.log("“哇塞，"+gameInfo.oneyuan+"个进账了，碉堡了！！”")
        }
        if (gameInfo.tolow > 0) {
            console.log("“什么？ 分数太低？......额.......        这是Bug”")
        }

    }
}

// 把keyup事件绑定到document中 
function listenKey() {
    console.log("listenKey");
    /*if (document.addEventListener) {
        console.log("document.addEventListener");
        document.addEventListener("onkeydown", getKey, false);
    } else if (document.attachEvent) {
        console.log("document.attachEvent");
        document.attachEvent("onkeydown", getKey);
    } else {
        document.onkeydown = getKey;
    }*/
    document.onkeydown = getKey;
}

listenKey();