/**    
 * CODETANK 
 * Copyright (c) 2012, Tencent AlloyTeam, All rights reserved.
 * http://CodeTank.AlloyTeam.com/
 *
 * @version     1.0
 * @author      AlloyTeam
 *
 *  .d8888b.                888      88888888888               888   TM   
 * d88P  Y88b               888      ''''888''''               888      
 * 888    888               888          888                   888      
 * 888         .d88b.   .d88888  .d88b.  888  8888b.  88888b.  888  888 
 * 888        d88""88b d88" 888 d8P  Y8b 888     "88b 888 "88b 888 .88P 
 * 888    888 888  888 888  888 88888888 888 .d888888 888  888 888888K  
 * Y88b  d88P Y88..88P Y88b 888 Y8b.     888 888  888 888  888 888 "88b 
 *  "Y8888P"   "Y88P"   "Y88888  "Y8888  888 "Y888888 888  888 888  888 
 * 
 */

//Status
var Data = {
    hitRobot: 0,
    hitMiss: 0,
}
/* 1V1 */
var Target = {
    name: null,
    energy: 0,
    //最后位置
    last_pos: null,
    speen: 0,
    getPos: function (pos, rt) {
        //精确到整数位
        var parsed_pos = [Math.round(pos[0]), Math.round(pos[1])];
        //this.history_pos.push(parsed_pos);
        //this.last_pos = parsed_pos;

        //this.analyseStatus(rt);
    },
    //历史位置
    history_pos: new Array(),
    //分析后状态
    //stop 停止 , moved , moving
    status: null,
    analyseStatus: function (rt) {
        //普通分析,最近3个点
        var change = new Array();

        var n = 5;

        var h = Target.history_pos;
        var hlength = h.length;
        if (hlength > n) {
            for (var i = (hlength - n) ; i < hlength; i++) {
                if (i < hlength - 1) {
                    var x = h[i + 1][0] - h[i][0];
                    var y = h[i + 1][1] - h[i][1];
                    var t = [x, y];
                    change.push(t);
                }
            }
            if (change.length = n - 1) {
                var last = h[hlength - 1];
                //test
                if (change[0][0] == change[1][0] &&
                change[0][1] == change[1][1]) {
                    var x = change[0][0];
                    var y = change[0][1];
                    var targetPos = [last[0] + x, last[1] + y];
                    this.speed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

                    var dis = getDistance(targetPos, getPos(rt), rt);
                    //目标点子弹偏正

                    var discale = 0;
                    if (this.speed > 0) {
                        discale = dis / 12 * 8 / this.speed;
                    }

                    targetPos = [targetPos[0] + x * discale, targetPos[1] + y * discale];
                    var hit = "";
                    if ((Data.hitMiss + Data.hitRobot) != 0) {
                        hit = (Data.hitRobot / Data.hitMiss) + Data.hitRobot + "%";
                    }
                    Gun.fireTo(targetPos, rt);
                }
            } else {
                this.speed = null;
            }
        } else {
            //状态不明
            //return null;
        }
        rt.scan();
    }
}

Jx().$package(function (J) {
    Robot = new J.Class({ extend: tank.Robot }, {
        /**
        *robot主循环
        **/
        run: function () {
            //初始化战场信息
            //PG
            playgroundInit(this);
            //初始化坦克信息
            tankInit(this);

            /*loopList.push(function(rt){
                Moving.toPosition(PG.center(), rt);
            });
            */

            /*/*/// move test
            /*
            LoopList.push(function(rt){
                Moving.toPosition(PG.topleft(),rt);
            });
        
            LoopList.push(function(rt){
               Moving.toPosition(PG.bottomleft(),rt);
            });
            LoopList.push(function(rt){
                Moving.toPosition(PG.bottomright(),rt)
            });
            LoopList.push(function(rt){
                Moving.toPosition(PG.topright(),rt)
            });
            /*/


            /*
            Moving.toPosition([100,100],this,function(){
            })
            */
            //stepDone = true;

            Moving.toPosition(PG.center(), this, function () {
                stepDone = true;
            })
            LoopList.push(function (rt) {
                Gun.turn(-3600, rt);

            })

            //this.turnGun(3600);
            LoopList.push(function (rt) {
                rt.say(output);
            });

            /*
            LoopList.push(function(rt){
                //++TurnGunTime;
                rt.turnGun(360);
            });
            */
            var looptime = 0
            this.loop(function () {
                if (Loop) {
                    if (LoopList && LoopList.length) {
                        LoopList[looptime % (LoopList.length)](this);
                    }
                    looptime++;
                }
            });


        },

        /**
        *看到其他robot的处理程序
        **/
        onScannedRobot: function (e) {
            //停止移动，包括Gun
            if (!stepDone) {
                this.say("stepDone=" + stepDone);
                return
            }

            //var angle = getCenterAngle(e,this);
            //
            RadarTrack(e, this);

            this.say(output);

            //stepDone = false;
        },
        /**
        * 子弹击中目标
        */
        onBulletHit: function (e) {
            ++Data.hitRobot;
        },
        onBulletMissed: function (e) {
            ++Data.hitMiss;
        },
        /**
        *被子弹击中的处理程序
        **/
        onHitByBullet: function (e) {

        },

        /**
        *和墙碰撞的处理程序
        **/
        onHitWall: function (e) {
            this.say("HitWall");
        },

        onRobotDeath: function (e) {

        }

    });
});

var Loop = true;

var stepDone = false;

var LoopList = new Array();


var TurnGunTime = 0;
var ScanedTargetAngle = new Array();

var scan = 0;
var output = "";


//雷达锁定
function RadarTrack(e, rt, callback) {
    //相对位置角度
    //rt.stopMove();
    var bearingAngle = e.getBearing();
    var headingAngle = rt.getHeading();

    var targetAngle = bearingAngle + headingAngle;
    var dis = e.getDistance();
    var cp = getPos(rt);

    var changeY = Math.sin(targetAngle / 180 * Math.PI) * dis;
    var changeX = Math.cos(targetAngle / 180 * Math.PI) * dis;

    var x = (cp[0] + changeX);
    var y = (cp[1] + changeY);

    Target.getPos([x, y], rt);
    rt.say("target=" + [x, y]);
    //雷达扫描获取偏正角度
    var angle = getCenterAngle(e, rt)
    //角度偏正
    //rt.stopMove();
    //判断剩余炮管旋转角度
    if (rt.getGunTurnRemaining() != 0) {
        rt.stopMove();
    }
    //返回剩余的旋转角度
    //getTurnRemaining()
    //剩余移动距离
    //getDistanceRemaining()

    /*if(Gun.turned_angle){
        if(Gun.turned_angle>0){
            rt.turnGun(Math.abs(angle));
                    //this.fire(1);
        }else{
            rt.turnGun(-Math.abs(angle));
            //this.fire(1);
        }
    }else{
    
        rt.turnGun(angle);
   }*/
    rt.turnGunLeft(smartTurn(angle));

    //Gun.fire(rt);
    //output = "偏正角度="+angle+" distance="+distance;
    output = "偏正角度=" + angle + " 剩余角度:" + rt.getGunTurnRemaining();
    rt.scan();
}

//雷达扫描获取偏正角度
function getCenterAngle(e, rt) {
    //探测到的敌人相对于该坦克的角度
    var allAngle = e.getBearing() + rt.getHeading();
    var gunAngle = rt.getGunHeading();
    var angleGunToTurn = (allAngle - gunAngle);

    return angleGunToTurn;
}

//自定义TurnGun方法，旋转角度的正负值将作为开炮偏正角度的参考依据
var Gun = {
    turned_angle: 0,
    turn: function (angle, rt, callback) {
        this.turned_angle = angle;
        rt.turnGun(angle, callback);
    },
    //连续命中
    cc_hit: 0,
    fire: function (rt) {
        //连续命中后火炮加成
        if (rt.getGunHeat() == 0) {
            rt.fire();
        }
    },
    fireTo: function (pos, rt) {
        //判断目标位置是否在战场内
        if (pos[0] < 0 || pos[0] > PG.w || pos[1] < 0 || pos[1] > PG.h) {
            return;
        }
        var gg = rt.getGunHeading();
        //目标坐标点角度
        var tg = getTargetHeading(pos, getPos(rt), rt);
        //获取夹角差值
        var angle = smartTurn((tg - gg) * -1);
        rt.say(output);
        if (rt.getGunHeat() == 0) {
            rt.turnGun(angle);
            this.fire(rt);
            rt.scan();
            //对预定目标打击后往反方向扫描
            if (angle > 0) {
                rt.turnGun(-360);
            } else {
                rt.turnGun(360);
            }

        }
        rt.scan();
    }
}

var Moving = {
    //直线运动，偏正角度后移动至战场中间位置
    toPosition: function (pos, rt, callback) {
        //判断目标点加上车辆半径距离是否超出PG战场(防止碰撞)
        pos = avoidHitWall(pos);
        //获取目标点和单前点的角度
        var angle = getTargetHeading(pos, getPos(rt), rt);
        //相对当前车身角度
        var turnAngle = rt.getHeading() - angle;
        if (Math.abs(turnAngle) > 180) {  //选择最小旋转轨迹
            if (turnAngle > 0) {
                turnAngle = turnAngle - 360;
            } else {
                turnAngle = turnAngle + 360;
            }
        }
        //调转
        //rt.say("Heading="+rt.getHeading()+" angle="+angle+" turnAngle="+turnAngle);
        rt.turn(turnAngle);
        var distance = getDistance(pos, getPos(rt), rt);
        rt.ahead(distance, callback);
        //Gun.turn(-360, rt)

    }
}

//修改目标点，如果是墙碰撞点则对目标点作移位
function avoidHitWall(pos) {
    var x = pos[0];
    var y = pos[1];
    if ((x - TK.r) < 0) {
        pos[0] = TK.r;
    }
    if ((x + TK.r) > PG.w) {
        pos[0] = PG.w - TK.r;
    }
    if ((y - TK.r) < 0) {
        pos[1] = TK.r;
    }
    if ((y + TK.r) > PG.h) {
        pos[1] = PG.h - TK.r;
    }
    return pos;

}

//获取修改坐标系后的点
function getPos(rt) {
    return changeOrigin(rt.getPos());
}

//修改坐标系
//左上原点修改为左下原点
function changeOrigin(pos) {
    return [pos[0], PG.h - pos[1]];
}

//获取目标坐标和当前坐标的坐标轴角
function getTargetHeading(tar, cur, rt) {
    //对边 ， y值差
    var borderR = (tar[1] - cur[1]);
    var borderB = (tar[0] - cur[0]);

    if (borderR == 0) {
        if (borderB > 0) {
            return 0;
        } else if (borderB < 0) {
            return 180;
        } else {
            return 0;
        }
    }
    if (borderB == 0) {
        if (borderR > 0) {
            return 90;
        } else if (borderR < 0) {
            return 270;
        } else {
            return 0;
        }
    }

    var tan = Math.abs(borderR / borderB);

    var tAngle = Math.atan(tan) / Math.PI * 180;
    if (borderR > 0 && borderB > 0) {
        //tAngle;
    } else if (borderR > 0 && borderB < 0) {
        tAngle = 180 - tAngle;
    } else if (borderR < 0 && borderB > 0) {
        tAngle = 360 - tAngle;
    } else if (borderR < 0 && borderB < 0) {
        tAngle = 180 + tAngle;
    }
    return tAngle;
}

//获取目标点的距离
function getDistance(tar, cur, rt) {
    var n = Math.pow(Math.abs(tar[0] - cur[0]), 2) + Math.pow(Math.abs(tar[1] - cur[1]), 2);
    if (n == 0) {
        return 0;
    } else {
        return Math.sqrt(n);
    }
}

//Tank自身数值
var TK = {
    w: 0,
    h: 0,
    r: 0,
}
//初始化方法
var tankInit = function (rt) {
    TK.w = rt.getWidth();
    TK.h = rt.getHeight();
    //车辆半径
    TK.r = Math.sqrt(Math.pow(TK.w / 2, 2) + Math.pow(TK.h / 2, 2)) + 1;//偏正加1
    //雷达独立于robot
    rt.setAdjustRadarForRobotTurn(true);
    //雷达是否独立于火炮的旋转
    rt.setAdjustRadarForGunTurn(false);
    //火炮独立于roboot
    rt.setAdjustGunForRobotTurn(true);
}
//战场数据初始化
var PG = {
    w: 0,
    h: 0,
    enemy: 0,
    //原始点,top,left 原点
    center: function () {
        return [PG.w / 2, PG.h / 2];
    },
    topleft: function () {
        return [0, PG.h];
    },
    topright: function () {

        return [PG.w, PG.h];
    },
    bottomleft: function () {
        return [0, 0];
    },
    bottomright: function () {
        return [PG.w, 0];
    },
};
var playgroundInit = function (rt) {
    currentTime();
    PG.w = rt.getBattleFieldWidth();
    PG.h = rt.getBattleFieldHeight();
    PG.s = rt.getBattleFieldSize();
}

var smartTurn = function (angle) {
    if (angle > 180) {
        angle = angle - 360;
    }
    else if (angle < -180) {
        angle = angle + 360;
    }
    return angle;
};
//返回游戏开始时间
var startTime = null;
var currentTime = function () {
    if (!startTime) {
        startTime = new Date().getTime();
        return 0;
    } else {
        return (new Date().getTime() - startTime) / 1000;//返回秒
    }
}