/**
*   TODO
*   1.CD旋转效果加速度及减速效果
*   2.封面Title
**/

var filePath = "content/sound/";
var DefaultSongList = [{
    index: 0,
    title: "MyDearest",
    cover: filePath+"cover/guilty-crown-op-my-dearest.jpg",
    src: filePath + 'MyDearest.mp3',
}, {
    index: 1,
    title: "Departures",
    cover: filePath + "/cover/Departures.jpg",
    src: filePath + 'Departures.mp3',
}, {
    index: 2,
    title: "Silver Sky",
    cover: filePath + "cover/SilverSky.jpg",
    src: filePath + 'Silver Sky.mp3',
}, {
    index: 3,
    title: "告白",
    cover: filePath + "cover/supercell_gaobai.jpg",
    src: filePath + "Supercell-告白 (Album Mix).mp3",
}, {
    index: 4,
    title: "Daisy",
    cover: filePath + "cover/Daisy.jpg",
    src: filePath + "境界的彼方ED「Daisy」.mp3",
}, {
    index: 5,
    title: "ブルー・フィールド",
    cover: filePath + "cover/canglaned.jpg",
    src: filePath + "苍蓝钢铁的琶音ed.mp3",
}, {
    index: 6,
    title: "Savior of song",
    cover: filePath + "cover/saviorofsong.jpg",
    src: filePath + "Savior of song.mp3",
}
];

function SongDropIn(file) {
    //判断文件类型

    //文件信息
    var name = file.name;
    var n =  name.split(".");
    n.pop();
    var title = n.join("");
    var src = URL.createObjectURL(file);
    var o = {
        index: DefaultSongList.length,
        title: title,
        cover: "../sound/cover/defaultCover.jpg",
        src:src,
    }
    DefaultSongList.push(o);

    SongAlbumInit(DefaultSongList.length - 1);
}
var CurrentSongIndex = null;
/* song Album */
var CustomAudioContext;
var AudioInit = function (view) {
    //拖入区域绑定
    view.param.container.unbind("drop").bind("drop", function (e) {
        e.preventDefault();
        e = e.originalEvent;
        console.log("==>drop");
        var length = e.dataTransfer.files.length;
        for (var i = 0; i < length; i++) {
            var file = e.dataTransfer.files[i];
            //后续处理代码略
            console.log("name=" + file.name);
            console.log("type=" + file.type);
            console.log(URL.createObjectURL(file));

            SongDropIn(file);
        }
    }).unbind("dragenter").bind("dragenter", function (e) {
        console.log("==>dragenter");
        e.preventDefault();
        e = e.originalEvent;
        //e.dropEffect = "copy";
        //e.effectAllowed = "copy";

    }).unbind("dragover").bind("dragover", function (e) {
        console.log("==>dragover");
        e.preventDefault();

    }).unbind("dragend").bind("dragend", function (e) {
        console.log("==>dragend");
        e.preventDefault();

    });


    //翻轉控制綁定
    $("#SongAlbumContainer").find(".leftArrow").bind("mousedown", function () {
        //开始往左翻转songAlbum
        if (!AlbumMoving) {
            movingNumber = CustomAudioContext.Audio.index;
            AlbumMoving = setInterval(function () {
                if (time % (absMoving) == 0) {
                    SongAlbumInit(--movingNumber);
                    absMoving > 1 && --absMoving;
                }
                time++;
            }, 500);
            SongAlbumInit(--movingNumber);
            absMoving > 1 && --absMoving;
            time++;
        }
    }).bind("mouseup", function () {
        //停止翻转 并开始播放当前歌曲
        clearAlbumMoving();
    }).bind("mouseleave", function () {
        clearAlbumMoving();
    })
    //right Arrow
    $("#SongAlbumContainer").find(".rightArrow").bind("mousedown", function () {
        //开始往右翻转songAlbum
        if (!AlbumMoving) {
            movingNumber = CustomAudioContext.Audio.index;
            AlbumMoving = setInterval(function () {
                if (time % (absMoving) == 0) {
                    SongAlbumInit(++movingNumber);
                    absMoving > 1 && --absMoving;
                }
                time++;
            }, 500);
            SongAlbumInit(++movingNumber);
            //absMoving!==0  absMoving * 3 => NaN
            absMoving > 1 && --absMoving;
            time++;
        }
    }).bind("mouseup", function () {
        //停止翻转 并开始播放当前歌曲
        clearAlbumMoving();
    }).bind("mouseleave", function () {
        clearAlbumMoving();
    });


    /* 播放模式控制 */
    $("#SongShuffleIcon").bind("click", function () {
        var c = $(this).attr("class"), cn = "enabled";
        if (c.indexOf("enabled") == -1) {
            //修改播放模式为随机
            CustomAudioContext.PlayMode.change("shuffle");
        } else {
            //取消修改随机修改模式
            CustomAudioContext.PlayMode.move();
        }
    })

    $("#SongRepeatIcon").bind("click", function () {
        var c = $(this).attr("class"), cn = "enabled";
        if (c.indexOf(cn) == -1) {
            //修改播放模式为单曲循环
            CustomAudioContext.PlayMode.change("repeat");
        } else {
            //取消单曲循环模式
            CustomAudioContext.PlayMode.move();
        }
    });

    //Mute静音控制
    $("#SongMuteIcon").bind("click", function () {
        var c = $(this).attr("class"), cn = "mute";
        if (c.indexOf(cn) == -1) {
            $(this).removeClass().addClass(cn);
            CustomAudioContext.Gainer.mute()
        } else {
            $(this).removeClass().addClass("enable");
            CustomAudioContext.Gainer.change(CustomAudioContext.Gainer.memory);
        }
    });

    /* Gain Controler */
    /* 音量控制 Slider */
    //console.log("===>Zoom" + C_zoom);

    var gainControl = $("#GainBar");
    var gainHandle = bindSlideControler(gainControl, function (value) {
        //change value
        value !== undefined && ((value = parseInt(toFixed(value, 2) * 100)));

        CustomAudioContext.Gainer.change(value / 100);//0-1
        $("#GainValue").html(value + "%");
        //console.log("gainControl:getTheVaule=" + value + "%");
    });
    /* 进度控制 Progress */
    var progressControl = $("#ProgressBar");
    var progressHandle = bindSlideControler(progressControl, function (value) {
        //change value
        value !== undefined && ((value = parseInt(toFixed(value, 2) * 100)));

        CustomAudioContext.Controler.progress.ichange(value);//0-1
        //$("#GainValue").html(value + "%");
        CustomAudioContext.Controler.progress.t.mousedown = false;
    });

    function bindSlideControler(target, callback) {
        var mouseDragControler = null;
        target.bind("mouseenter", function (e) {
            //只有当鼠标进入绑定的元素时触发 mousenter不区分子元素
            //只有当鼠标离开绑定的元素时触发 mouseleave不区分子元素
            $(this).find(".handle").fadeIn();
        }).bind("mouseleave", function () {
            if (!(mouseDragControler && mouseDragControler.t[0] == $(this).find(".handle")[0])) {
                $(this).find(".handle").fadeOut();
            }
        }).bind("mousedown", function (e) {
            var available = "x";
            var left = e.offsetX;
            var top = e.offsetY;
            var controler = $(this).find(".handle");
            var space = $(this).find(".space");

            controler.css({
                "display": "block",
            });

            left = left - controler.width() / 2;
            top = top - controler.height() / 2;
            left < 0 && (left = 0);
            top < 0 && (top = 0);
            if (available.indexOf("x") !== -1) {
                controler.css({
                    "left": left + "px",
                });
                space.css({
                    "width": left + controler.width(),
                });

                callback(left / ($(this).width() - controler.width()));
            }
            if (available.indexOf("y") !== -1) {
                controler.css({
                    "top": top + "px",
                });
                space.css({
                    "height": top + controler.height(),
                });

                callback(top / ($(this).height() - controler.height()));
            }

            mouseDragControler = new MouseDragControler(controler, e, available, callback)
            mouseDragControler.mousedown = true;
        }).find(".handle").bind("mousedown", function (e) {
            mouseDragControler = new MouseDragControler($(this), e, "x", callback);
            mouseDragControler.mousedown = true;
            stopBubble(e);
            stopDefault(e);
        })


        $(document).bind("mousemove", function (e) {
            if (mouseDragControler) {
                mouseDragControler.move(e);
            }
        }).bind("mouseup", function (e) {
            if (mouseDragControler) {
                mouseDragControler.end();
                mouseDragControler = null;
            }
        });

        //返回主动式调用对象
        return new MouseDragControler(target.find(".handle"), null, "x", null);
    }

    CustomAudioContext = {
        Audioctx: null,
        //Default playList
        //TODO more list
        Loop: false,
        PlayMode: {
            t: "normal",
            change: function (v) {
                var cac = CustomAudioContext;
                this.move();
                if (!v) {
                    v = "normal";
                }
                var enabled = "enabled";
                switch (v) {
                    case "normal":
                        if (cac.Audio.t) {
                            cac.Audio.t.loop = false;
                        };
                        cac.Loop = false;
                        break;
                    case "repeat":
                        if (cac.Audio.t) {
                            cac.Audio.t.loop = true;
                        }
                        cac.Loop = true;
                        $("#SongRepeatIcon").addClass(enabled);
                        break;
                    case "shuffle":
                        if (cac.Audio.t) {
                            cac.Audio.t.loop = false;
                        }
                        cac.Loop = false;
                        $("#SongShuffleIcon").addClass(enabled);
                        break;
                }
                this.t = v;
            },
            move: function () {
                this.t = "normal";
                var cac = CustomAudioContext;
                if (cac.Audio.t) {
                    cac.Audio.t.loop = false;
                };
                cac.Loop = false;
                $("#OrderControl div").removeClass("enabled");
            }
        },
        Gainer: {
            t: null,
            controler: $("#gain"),
            memory: 1,
            mute: function () {
                this.t.gain.value = 0;
                CustomAudioContext.Canvas.drawGraph("end");
            },
            change: function (v) {
                if (v !== 0 && !v) {
                    v = this.controler.val();
                }
                if (!this.t) {
                    throw "Gainer.t is null";
                }
                this.t.gain.value = v;
                this.memory = v;
                CustomAudioContext.Canvas.drawGraph();
            }
        },
        Analyzer: {
            t: null,
            freq_data: new Float32Array(1024),
            run: function () {
                this.t.smoothingTimeConstant = 0.5;
                this.t.fftSize = 1024;
                this.t.getFloatFrequencyData(this.freq_data);
            }
        },
        Controler: {
            play: function (ele) {
                var image = $(ele).find(".songImage");
                var currentAudio = CustomAudioContext.Audio.t;
                if (!currentAudio) {
                    throw "No CurrentAudio";
                }
                if (currentAudio.paused) {
                    if (image.attr("class").indexOf("playingCover") != -1) {
                        image.removeClass("animation-paused");
                    } else {
                        image.addClass("playingCover")
                    }
                    currentAudio.play();
                    CustomAudioContext.Canvas.drawGraph();
                } else {
                    image.addClass("animation-paused");
                    currentAudio.pause();
                    CustomAudioContext.Canvas.drawGraph("end");

                }
            },
            progress: {
                t: progressHandle,
                moveto: function (value) { //value = [0-100]
                    this.t.moveTo(value);
                },
                ichange: function (v) { //value = [0-100]
                    var audio = CustomAudioContext.Audio.t;
                    var currentTime = audio.duration * v / 100;

                    $("#CurrentTime").html(changeSecondTime(currentTime));
                    audio.currentTime = currentTime;
                    console.log("ichange progress: v=" + v + "%" + " currentTime(s)=" + currentTime + " currentTime=" + changeSecondTime(currentTime));
                }
            },
            next: function (i) {
                if (i != 0 && !i) {
                    i = 0;
                }

                //CustomAudioContext.init(i);
                var cac = CustomAudioContext;
                var songSrc = DefaultSongList[i].src;
                if (cac.Audio.t && i == cac.Audio.index) {
                    return
                }

                //clear prev effect
                //remove prev effect
                var centerSongCover = $(".centerSong[index!='" + i + "']");
                if (centerSongCover.length > 0) {
                    centerSongCover.find(".songImage").removeClass("playingCover");
                    centerSongCover.removeClass("centerSong");
                }


                cac.Audio.index = i;
                var audio = $("<audio></audio>")[0];
                audio.src = songSrc;
                audio.load();
                audio.autoplay = true;
                audio.loop = cac.Loop;
                $("#audioContainer").html(audio);
                cac.Audio.t = audio;

                if (!cac.Audioctx) {
                    cac.init(function () {
                        connectAudioctx(cac.Audio.t);
                    })
                } else {
                    connectAudioctx(cac.Audio.t);
                }
                function connectAudioctx(audio) {
                    var cac = CustomAudioContext;
                    var source = cac.Audioctx.createMediaElementSource(audio);
                    source.connect(cac.Gainer.t);
                    cac.CurrentSource = source;
                    audio.addEventListener('play', function (e) {
                        $("#DuringTime").html(changeSecondTime(this.duration));
                        var img = $(".centerSong").find(".songImage");
                        if (!(img.attr("class").indexOf("playingCover") != -1)) {
                            img.addClass("playingCover").removeClass("animation-paused");
                        }
                        CustomAudioContext.Canvas.drawGraph();
                    });

                    /*add Events */
                    audio.addEventListener("timeupdate", function (e) {
                        var progressPercent = parseInt(toFixed(this.currentTime / this.duration, 2) * 100);
                        if (!CustomAudioContext.Controler.progress.t.mousedown) {
                            $("#CurrentTime").html(changeSecondTime(this.currentTime));
                            $("#DuringTime").html(changeSecondTime(this.duration));
                            CustomAudioContext.Controler.progress.moveto(progressPercent);
                        }
                    })

                    audio.addEventListener("ended", function (e) {
                        //暂停旋转
                        $(".centerSong").find(".playingCover").addClass("animation-paused");
                        //取消XX谱
                        CustomAudioContext.Canvas.drawGraph("end");

                        //判断循环
                        if (!CustomAudioContext.Audio.t.loop) {
                            if (CustomAudioContext.PlayMode.t == "normal") {
                                SongAlbumInit((1 + CustomAudioContext.Audio.index));
                                console.log("播放下一首");
                            } else {
                                //随机获取下一首
                                var index = CustomAudioContext.Audio.index;
                                var number = DefaultSongList.each(function (a, i, index) {
                                    if (a.index != index) {
                                        return a;
                                    }
                                }, index)

                                var randomIndex = Math.floor(Math.random() * number.length);
                                console.log("random number = " + randomIndex);
                                SongAlbumInit(number[randomIndex].index);
                                console.log("随机播放下一首");
                            }
                        } else {
                            console.log("循环播放！");
                        }
                    });
                }
            },
        },
        Audio: {
            t: null,
            index: null,
        },
        CurrentSource: null,
        init: function (func) {
            if (!this.Audioctx) {

                //init AudioContext and return the object
                try {
                    // Fix up for prefixing
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.Audioctx = new AudioContext();
                } catch (e) {
                    alert('Web Audio API is not supported in this browser');
                }
            }

            var self = this;
            this.Gainer.t = this.Audioctx.createGainNode();
            this.Analyzer.t = this.Audioctx.createAnalyser();
            this.Gainer.t.connect(this.Analyzer.t);
            this.Analyzer.t.connect(this.Audioctx.destination);
            this.Analyzer.freq_data = new Float32Array(this.Analyzer.t.frequencyBinCount);

            //var bufferLoader = new BufferLoader(this.Audioctx, this.LoadList, finishedLoading);

            //bufferLoader.load();
            this.Canvas.resize();
            typeof func == "function" && func();

            /*
    
            function finishedLoading(bufferList, index) {
                var Audioctx = self.Audioctx;
                var audioContainer = $("#AudioControl");
                if (index != null) {
                    var btnControl = $("<input type='button' class='playBtn' id='play" + index + "' value='PLAY'/>");
                    var spanInfo = $("<span>" + self.LoadList[index].title + "</span>");
                    audioContainer.append(btnControl).append(spanInfo).append("<br/>");
                    btnControl.unbind("click").click(function () {
                        self.resizeCanvas();
                        
                        if (self.CurrentSource && self.CurrentSource.index != index) {
                            self.CurrentSource.source.stop(0);
                        }
                        if (this.value == "PLAY") {
                            $(".playBtn").attr("value", "PLAY");
                            var source1 = Audioctx.createBufferSource();
                            source1.buffer = bufferList;
                            source1.connect(self.Gain);
                            self.CurrentSource = {
                                source: source1,
                                index: index,
                            };
                            self.gainChange();
                            self.loopChange();
                            self.drawGraph();
                            source1.start(0);
                            this.value = "STOP";
                        } else {
                            self.CurrentSource.source.stop(0);
                            this.value = "PLAY";
                        }
    
                    });
                }
            }
            */
        },
        Canvas: {
            target: $(document.getElementById("cvs")),
            width: 0,
            height: 0,
            ctx: null,
            draw_animate: new Animation(function () {
                var audio = CustomAudioContext;
                var canvas = CustomAudioContext.Canvas;
                var w = canvas.width;
                var h = canvas.height;
                audio.Analyzer.run();
                var ctx = canvas.ctx;
                ctx.clearRect(0, 0, w, h);

                // Spacing between the individual bars
                /*
                //var SPACING = 10;
                for (var i = 0; i < self.FreqData.length; i++) {
                    // Work out the hight of the current bar
                    // by getting the current frequency
                    var magnitude = self.FreqData[i];
                    // Draw a bar from the bottom up (cause for the "-magnitude")
                    ctx.fillRect(i, h-(h+magnitude), 2, h);
                };
                ctx.fillStyle = "lightblue";
                */
                var length = audio.Analyzer.freq_data.length / 2;
                var center = {
                    x: w / 2,
                    y: h / 2,
                }
                w = w / 2;
                var SPACING = w / length;
                if (w > (length)) {

                    for (var i = 0; i < length; i++) {
                        // Work out the hight of the current bar
                        // by getting the current frequency
                        //var magnitude =h/2+ (self.FreqData[i]+48.16) * h/100;
                        var magnitude = (150 + audio.Analyzer.freq_data[i]) / 150 * h / 3;
                        if (magnitude > 0 && magnitude < h / 2) {
                            // Draw a bar from the bottom up (cause for the "-magnitude")
                            ctx.fillRect(i * SPACING + center.x, (center.y - magnitude), SPACING, magnitude);
                            ctx.fillRect((-i * SPACING - SPACING) + center.x, (center.y - magnitude), SPACING, magnitude);
                            ctx.fillStyle = "rgba(255,255,255,0.15)";
                            ctx.fillRect(i * SPACING + center.x, (center.y), SPACING, magnitude);
                            ctx.fillRect((-i * SPACING - SPACING) + center.x, (center.y), SPACING, magnitude);
                            ctx.fillStyle = "rgba(255,255,255,0.5)";
                        }
                    }
                } else {
                    var spaceNumber = length / w;
                    spaceNumber = Math.round(spaceNumber);
                    for (var i = 0; i < length; i++) {
                        if (i % spaceNumber == 0) {
                            var magnitude = (150 + audio.Analyzer.freq_data[i]) / 150 * h / 3;
                            if (magnitude > 0 && magnitude < h / 2) {
                                // Draw a bar from the bottom up (cause for the "-magnitude")
                                ctx.fillRect(i + center.x, (center.y - magnitude), 1, magnitude);
                                ctx.fillRect((-i - 1) + center.x, (center.y - magnitude), 1, magnitude);
                                ctx.fillStyle = "rgba(255,255,255,0.15)";
                                ctx.fillRect(i + center.x, (center.y), 1, magnitude);
                                ctx.fillRect((-i - 1) + center.x, (center.y), 1, magnitude);
                                ctx.fillStyle = "rgba(255,255,255,0.15)";
                            }
                        }

                    }
                }
                /*
                //根據 analyzer.freq_data.length的長度/2為canvas的長度，然後依此分成n等分，其平均的差值幅度將作為小球的半徑繪製
                var n = 10;
                var averageLength = Math.floor(length / 10);
                //var color = ["red", "yellow"];
                var color = ["red", "blue", "orange", "green", "yellow"];
                if (canvas.oldFreqData[0]) {
                    //計算每份的平均幅度差值

                    //当前时间的振幅平均值
                    var averAve = 0;
                    for (var i = 0; i < n; i++) {
                        var v = 0;
                        for (var j = i * averageLength; j < (i + 1) * averageLength; j++) {
                            v += audio.Analyzer.freq_data[j] - canvas.oldFreqData[j];
                        }
                        var ave = v / averageLength;
                        //canvas.averAveStorage.unshift(ave);
                        if (!canvas.averageValue[i]) {
                            canvas.averageValue[i] = 0;
                        }
                        canvas.averageValue[i] += Math.abs(ave);
                        canvas.averageValue[i] = canvas.averageValue[i] / 2;
                        
                        //长条形
                        var my_gradient = ctx.createLinearGradient(0, center.y * 2, 0, center.y);//((center.y) / 2 + ave * 5) - center.y / 2
                        my_gradient.addColorStop(0, "yellow");
                        my_gradient.addColorStop(0.4, "orange");
                        my_gradient.addColorStop(0.8, "red");
                        ctx.fillStyle = my_gradient;//color[i % color.length];
                        ctx.fillRect(center.x + (i) * averageLength * SPACING, (center.y - ave * 5) + center.y / 2, averageLength, ((center.y) / 2 + ave * 5));
                        
                        
                        //ctx.beginPath();
                        //圆
                        //ctx.arc(center.x + (i) * averageLength * SPACING, center.y + center.y / 3, averageLength / 2 / 2 * SPACING * (1 + ave / (center.y / 2) * 2), 0, Math.PI * 2, true);
                        //ctx.closePath();
                        //ctx.fill();
                        
                        ctx.fillStyle = "white";
                        ctx.font = "20px Helvetica";
                        //文字
                        ctx.fillText(toFixed(canvas.averageValue[i],3), center.x + (i) * averageLength * SPACING - averageLength / 2 / 2 / 2 * SPACING - 10, center.y + center.y / 3 + averageLength / 2 / 2 / 2 * SPACING - 10);

                        averAve = (averAve + ave) / 2
                    }
                    
                    if (center.y * .3 + averAve * 3 > 0) {
                        //平均振幅，圆
                        ctx.beginPath();
                        var grd = ctx.createRadialGradient(center.x * .5, center.y * 1.5, center.y * .3/2, center.x * .5, center.y * 1.5, center.y *.5);
                        grd.addColorStop(0, "white");
                        grd.addColorStop(0.5, "orange");
                        grd.addColorStop(0.8, "red");
                        ctx.fillStyle = grd;
                        ctx.arc(center.x * .5, center.y * 1.5, center.y * .3 + averAve * 3, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.fill();

                        ctx.fillStyle = "black";
                        ctx.font = "20px Helvetica";
                        ctx.fillText(toFixed(averAve,4), center.x * .5, center.y * 1.5);


                        //整幅曲线
                        //背景
                        ctx.fillStyle = "rgba(255,255,255,0.8)";
                        ctx.fillRect(0, center.y, center.x * 2, center.y);
                        //基线
                        ctx.beginPath();
                        ctx.strokeStyle = "green";
                        ctx.lineWidth = 3;
                        ctx.lineCap = "square";
                        ctx.moveTo(0, center.y * 1.5);
                        ctx.lineTo(center.x * 2, center.y * 1.5);
                        var sp = 4;//振幅点之间的间隔
                        var scale = 4;//扩大振幅
                        for (i in canvas.averAveStorage) {
                            var i = parseInt(i);
                            if (i == 0) {
                                ctx.moveTo(i * sp, center.y * 1.5 + -canvas.averAveStorage[i]*scale);
                            } else {
                                ctx.lineTo(i * sp, center.y * 1.5 + -canvas.averAveStorage[i] * scale);
                            }
                            if (i == canvas.averAveStorage.length - 1) {
                                ctx.stroke();
                                ctx.closePath();
                            }
                        }
                        
                    }
                    
                    

                    canvas.oldFreqData.set(audio.Analyzer.freq_data);
                } else {
                    canvas.oldFreqData.set(audio.Analyzer.freq_data);
                }
                */
            }),
            //testing
            oldFreqData: new Float32Array(1024),
            averageValue: new Array(10),
            averAveStorage:new Array(),
            drawGraph: function (v) {
                var canvas = CustomAudioContext.Canvas;
                var cac = CustomAudioContext;
                console.log("v=" + v + " animeId=" + canvas.draw_animate.animeId);
                if (v == "end" && canvas.draw_animate.animeId) {
                    canvas.draw_animate.stopAnimation();
                    console.log("stopAnimation animeId=" + canvas.draw_animate.animeId);
                    return;
                } else if (canvas.draw_animate.animeId) {
                    canvas.draw_animate.stopAnimation();
                    console.log("stopAnimation animeId=" + canvas.draw_animate.animeId);
                }
                !canvas.ctx && (canvas.ctx = canvas.target[0].getContext("2d"));
                this.draw_animate.startAnimation();

            },
            resize: function () {
                var container = $(this.target).parent();
                var size = Resize.getSize(container);
                this.target.attr({
                    "width": size.width + "px",
                    "height": size.height + "px",
                });
                this.width = size.width;
                this.height = size.height;
            },
        },
    };

}

var SongAlbumInit = function (center) {
    var originalSongList = DefaultSongList.slice();
    var resizeContainer = Controler.currentView.target.children(".section-container")
    var albumContainer = $("#SongAlbumContainer");

    var resize = Resize.getSize(resizeContainer);
    var height = toFixed(resize.height / 2 * 1 / 2);
    var width = resize.width;

    //透视比例缩放
    //原始深度od = 1000，修改后深度ud = 800,图片宽度 =height
    //扩大后边缘扩展宽度为
    var fontDeep = 300;
    var od = 1000, ud = 1000 - 300;
    var spreadWidth = (od - ud) * (height / 2) / ud;

    albumContainer.css({
        "width": width + "px",
        "height": height + "px",
        "margin-top": -height - spreadWidth,
    });

    //TODO 
    //resize audio controler 
    $("#ProgressBar").css({
        width: (height + spreadWidth * 2) + "px",
    });
    $("#AudioControl").css({
        "margin-left": -((height + spreadWidth * 2) + 60 * 2 + 15 * 2) / 2 + "px",
        "width": (height + spreadWidth * 2 + 60 * 2 + 15 * 2) + "px",
    });
    $("#GainBar").css({
        "width": (height + spreadWidth * 2) / 2 + "px",
    });

    var unitWidth = height;
    var resize = false;
    var random = Math.floor(Math.random() * DefaultSongList.length);
    //RandomCenter
    if (center != 0 && !center) {
        if (CustomAudioContext.Audio.index == 0 || CustomAudioContext.Audio.index) {
            center = CustomAudioContext.Audio.index;
        } else {
            center = random;
        }
    }

    console.log("center = " + center);
    if (center > (originalSongList.length - 1)) {
        center = center - Math.floor((center + 1) / (originalSongList.length)) * originalSongList.length;
    } else if (center < 0) {
        center = originalSongList.length + (center - Math.ceil((center + 1) / (originalSongList.length)) * originalSongList.length);
    }
    console.log("centered = " + center);

    if (center < 0) {
        debugger;
    }
    //center = 3;//i index number;
    if (albumContainer.children(".songCover").length != 0) {
        resize = true;
    }
    //设定center为数组第一个
    var songList = originalSongList.splice(center, originalSongList.length);
    originalSongList.each(function (a, i, songList) {
        songList.push(a);
    }, songList);

    /* UI modify value */
    var secondOpacity = 0.9,
        minOpacity = 0.2,
        changeAngle = 120,
        changeLeftScale = 0.04,
        leftAdded = 5 / 4,
        deep = 400;
    width = width * (1 + 0.1 * 2);


    for (var i = 0; i < songList.length; i++) {
        var songCover;
        //if (resize) {
            songCover = $(".songCover[index='" + songList[i].index + "']");
        // } else {
            if (songCover.length === 0) {
                songCover = $("<span class='songCover' index='" + songList[i].index + "'>"
                + "<span class='songTitle'>" + songList[i].title + "</span>" +
                + "</span>");
                var songImage = $("<span class='songImage'></span>");
                songImage.css({
                    "background": "url(" + songList[i].cover + ") no-repeat",
                    "background-size": "100% auto",
                    "-webkit-transform":"rotateZ(0deg)",
                });
                songCover.append(songImage);
                albumContainer.append(songCover)
            }
            
        //}

        //右半边数量
        var leftNumber = Math.floor(songList.length / 2);
        var rightNumber = Math.ceil(songList.length / 2);
        if (i >= 0 && i < 0 + rightNumber) { //right side;
            var uleft = width / 2 / rightNumber,
                uAngle = changeAngle / rightNumber,
                uopacity = (secondOpacity - minOpacity) / (rightNumber + 1),//+1 确保最后一个opacity不为0
                uZ = deep / rightNumber, //深度设置 为 200 ~ -200
                index = i,
                left = index * uleft * (1 + (rightNumber / 2 - i) * changeLeftScale) * leftAdded;//* 4/3;
            songCover.css({
                "width": unitWidth + "px",
                "height": unitWidth + "px",
                "left": "50%",
                "margin-left": -unitWidth / 2 + "px",
                "-webkit-transform": "translate3d(" + left + "px," + 0 + "px," + (200 - uZ * index) + "px) rotateY(" + (-index * uAngle) + "deg)",
                "opacity": (secondOpacity - index * uopacity),
                "z-index": parseInt(toFixed((secondOpacity - index * uopacity), 2) * 100),
            });
            if (i == 0) {
                songCover.addClass("centerSong").css({
                    "opacity": 1,
                    "-webkit-transform": "translate3d(" + left + "px," + 0 + "px," + (fontDeep) + "px) rotateY(" + (-index * uAngle) + "deg)",
                });
            }

        } else {
            var index = (leftNumber + 1) - i;
            /*if (i < center) {
                index = center - i;
            }else*/
            if (i >= 0 + rightNumber) {
                index = leftNumber - (i - rightNumber);
            }
            var uleft = width / 2 / (leftNumber + 1); //+1 => 去除中间的位置 
            var uAngle = changeAngle / (leftNumber + 1);
            var uopacity = (secondOpacity - minOpacity) / (leftNumber + 1);
            var uZ = deep / (leftNumber + 1);
            var currentScale = (1 + (leftNumber / 2 - index) * changeLeftScale);
            var left = -(index * uleft * currentScale) * leftAdded;//* 4 / 3;
            songCover.css({
                "width": unitWidth + "px",
                "height": unitWidth + "px",
                "left": "50%",
                "margin-left": -unitWidth / 2 + "px",
                "-webkit-transform": "translate3d(" + left + "px," + 0 + "px," + (200 - uZ * index) + "px) rotateY(" + (index * uAngle) + "deg)",
                "opacity": secondOpacity - (index) * uopacity,
                "z-index": parseInt(toFixed((secondOpacity - (index) * uopacity), 2) * 100),
            });
        }
        !resize && albumContainer.append(songCover);


        //left Arrow postion
        var arrowContainer = $("#SongAlbumContainer .arrowContainer");
        //z-index depend on .centerSong
        arrowContainer.css({
            "width": (height) * 1.2 + "px",
            "height": height * 1.2 + "px",
            "opacity": 1,
            "margin-top": -(height * 0.2) / 2 + "px",
            "margin-left": -(height * 1.2) / 2 + "px",
            "-webkit-transform": "translate3d(" + 0 + "px," + 0 + "px," + (fontDeep) + "px) rotateY(" + (0) + "deg) rotateZ(-45deg)",
            "z-index": parseInt((secondOpacity) * 100) - 1,
        });
        var arrowWidth = height * 1.2 / 3 / 2 / 2;
        arrowContainer.find(".leftArrow").css({
            "width": arrowWidth + "px",//arrowWidth + "px",
            "height": arrowWidth + "px",//arrowWidth + "px",
            "border-top": arrowWidth + "px solid #fff",
            "border-left": arrowWidth + "px solid #fff",
            "border-right": arrowWidth + "px solid transparent",
            "border-bottom": arrowWidth + "px solid transparent",
        });
        arrowContainer.find(".rightArrow").css({
            "width": arrowWidth + "px",//arrowWidth + "px",
            "height": arrowWidth + "px",//arrowWidth + "px",
            "border-bottom": arrowWidth + "px solid #fff",
            "border-right": arrowWidth + "px solid #fff",
            "border-left": arrowWidth + "px solid transparent",
            "border-top": arrowWidth + "px solid transparent",
        });


        //Add events
        //1. play  .centerSong
        var playStatus; //播放状态 TODO depend on the audio source element
        $(".songCover").unbind("click").bind("click", function (e) {
            var index = parseInt($(this).attr("index"));
            if (!($(this).attr("class").indexOf("centerSong") != -1)) {
                SongAlbumInit(index);
            } else {
                //CustomAudioContext.Controler.next(index);
                CustomAudioContext.Controler.play($(this));
            }
        });
    }
    if (!AlbumMoving) {
        CustomAudioContext.Controler.next(center);
    }
};
/* Album 翻转控制 */
//left Arrow
var AlbumMoving = null
var movingNumber = 0;
var absMoving = 2;
var time = 0;



function clearAlbumMoving() {
    if (AlbumMoving) {
        absMoving = 2;
        time = 0;
        clearInterval(AlbumMoving);
        AlbumMoving = null;
        if (movingNumber < 0) {
            movingNumber = DefaultSongList.length + (movingNumber - Math.ceil((movingNumber + 1) / (DefaultSongList.length)) * DefaultSongList.length);
        } else if (movingNumber > (DefaultSongList.length - 1)) {
            movingNumber = movingNumber - Math.floor((movingNumber + 1) / (DefaultSongList.length)) * DefaultSongList.length;
        }
        CustomAudioContext.Controler.next(movingNumber);
    }
}



//阻止冒泡事件  
function stopBubble(e) {
    if (e && e.stopPropagation) {//非IE  
        e.stopPropagation();
    }
    else {//IE  
        window.event.cancelBubble = true;
    }
}
function stopDefault(e) {
    //阻止默认浏览器动作(W3C)  
    if (e && e.preventDefault)
        e.preventDefault();
        //IE中阻止函数器默认动作的方式  
    else
        window.event.returnValue = false;
    return false;
}



//MouseControler t:dom target; moveavailable:x,y,xy,container(parent),callback
function MouseDragControler(t, e, available, callback) {
    this.t = t;
    this.position = t.position();
    this.available = available;
    this.mousedown = false;
    if (e) {
        this.start = {
            x: e.pageX,
            y: e.pageY,
        }
        this.margin = {
            left: e.offsetX,
            top: e.offsetY,
        }
    }
    var self = this;
    this.move = function (e) {
        var endPoint = {
            x: e.pageX,
            y: e.pageY,
        }
        var x = endPoint.x - self.start.x;
        var y = endPoint.y - self.start.y;

        var pWidth = self.t.parent().width() - self.t.width();
        var pHeight = self.t.parent().height() - self.t.height();
        var left = self.position.left + x;
        var top = self.position.top + y;
        left < 0 && (left = 0);
        left > pWidth && (left = pWidth);
        top < 0 && (top = 0);
        top > pHeight && (top = pHeight);

        //space spread
        var space = self.t.parent().find(".space");

        if (self.available.indexOf("x") != -1) {
            self.t.css({
                "left": left + "px",
            });
            space.css({
                "width": left + self.t.width() + "px",
            });

            callback(left / pWidth);
        }
        if (self.available.indexOf("y") != -1) {
            self.t.css({
                "top": top + "px"
            });
            space.css({
                "height": top + self.t.height() + "px",
            });
            callback(top / pHeight);
        }
    }
    this.moveTo = function (value) { //value:[0-100]
        var pWidth = self.t.parent().width() - self.t.width();
        var pHeight = self.t.parent().height() - self.t.height();
        var space = self.t.parent().find(".space");

        if (self.available.indexOf("x") != -1) {
            self.t.css({
                "left": pWidth * value / 100 + "px",
            });
            space.css({
                "width": pWidth * value / 100 + self.t.width() + "px",
            })
            //no callback
        }
        if (self.available.indexOf("y") != -1) {
            self.t.css({
                "top": pHeight * value / 100 + "px",
            })
            space.css({
                "height": pHeight * value / 100 + self.t.height() + "px",
            });
        }
    }

    this.end = function () {
        self.t.fadeOut();
    }
}




//BufferLoader Object

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                //if (++loader.loadCount == loader.urlList.length) {
                //    loader.onload(loader.bufferList, null);
                //} else {

                loader.onload(loader.bufferList[index], index);
                //}
            },
            function (error) {
                console.error('decodeAudioData error', error);
            }
        );
    };

    request.onerror = function () {
        alert('BufferLoader: XHR error');
    };
    request.send();
};

BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i].src, i);
};

function changeSecondTime(second) {
    if (second) {
        var minutes = Math.floor(second / 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = parseInt(Math.round(second % 60));
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    } else {
        return "00:00";
    }
}


(function () {
    // chrome shipped without the time arg in m10
    var timeundefined = false;
    if (window.webkitRequestAnimationFrame) {
        webkitRequestAnimationFrame(function (time) {
            timeundefined = (time == undefined);
        });
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                (!timeundefined && window.webkitRequestAnimationFrame) ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    return window.setTimeout(function () {
                        callback(+new Date);
                    }, 1000 / 60);
                };
    })();

})();

//标准提供了cancelAnimationFrame函数，用于外部打断

window.clearRequestTimeout = function (id) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(id) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(id) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(id) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(id) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(id) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(id) :
    clearTimeout(id);
};


function Animation(func,time) {
    this.animeId;
    this.func = func;
    this.delaytime = time
    this.startAnimation = function () {
        var self = this;
        self.lastTime = +new Date();
        self.animeId = requestAnimFrame(function (time) {
            //var delayTime = time - self.lastTime;
            // doSomething( delayTime ); // do some paint and calculate
            //typeof func === "function" && 
            self.func();
            //console.log(delayTime);
            self.startAnimation();
        });
    },
    this.stopAnimation = function () {
        clearRequestTimeout(this.animeId);
    }
}


/*
//相当于使用setInterval(render, 16)方法,但是具有更高的性能
(function animloop() {
    for (i in AnimList) {
        AnimList[i]();
    }
    requestAnimFrame(animloop);
    render();
})();

var AnimList = new Object();


    //动画事件对象
    //添加函数
    //func 动画函数
    //name 主键名,可选，未定义则自动赋now值

function addAnim(func, name) {
    if (typeof func !== "function") {
        throw "param must be function -- addAdmin";
    } else {
        !name && (name = Date.now().toString());
        AnimList[name] = func;
        return name;
    }
}


    //动画事件删除函数
    //name 必选参数

function deleteAnim(name) {
    if (!name) {
        throw "func deleteAnim param 'name' can't be null";
    } else {
        delete AnimList[name];
    }
}

function deleteAllAnim() {
    for (i in AnimList) {
        delete AnimList[i]
    }
}

*/


/* other main.js
// The audio element
audioElement = document.getElementById('audio');
    
// The canvas, its context and fillstyle
canvas = document.getElementById('fft');
ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
 
// Create new Audio Context and an audio Analyzer
audioContext = new webkitAudioContext();
analyser = audioContext.createAnalyser();
 
// Canvas' height and width
CANVAS_HEIGHT = canvas.height;
CANVAS_WIDTH = canvas.width;
// We'll need the offset later
OFFSET = 100;
// Spacing between the individual bars
SPACING = 10;
// initialize and start drawing
// when the audio starts playing
window.onload = init;
audioElement.addEventListener('play', draw);
 
function init() {
  // Take input from audioElement
  source = audioContext.createMediaElementSource(audioElement);
  // Connect the stream to an Analyzer
  source.connect(analyser);
  // Connect the Analyzer to the speakers
  analyser.connect(audioContext.destination);
  // Start the animation
  draw();
}
 
function draw() {
  // See http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimFrame(draw, canvas);
  // New typed array for the raw frequency data
  freqData = new Uint8Array(analyser.frequencyBinCount);
  // Put the raw frequency into the newly created array
  analyser.getByteFrequencyData(freqData);
  // Clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // This loop draws all the bars
  OFFSET = 100;
// Spacing between the individual bars
SPACING = 10;
  for (var i = 0; i < freqData.length - OFFSET; i++) {
    // Work out the hight of the current bar
    // by getting the current frequency
    var magnitude = freqData[i + OFFSET];
    // Draw a bar from the bottom up (cause for the "-magnitude")
    ctx.fillRect(i * SPACING, CANVAS_HEIGHT, SPACING / 2, -magnitude);
  };
}
*/

/*
gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
 
gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
gradient.addColorStop(0.15, "rgba(255, 255, 0, 1)");
gradient.addColorStop(0.3, "rgba(0, 255, 0, 1)");
gradient.addColorStop(0.5, "rgba(0, 255, 255, 1)");
gradient.addColorStop(0.65, "rgba(0, 0, 255, 1)");
gradient.addColorStop(0.8, "rgba(255, 0, 255, 1)");
gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
 
ctx.fillStyle = gradient;
*/