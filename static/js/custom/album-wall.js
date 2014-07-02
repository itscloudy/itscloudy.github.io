var AlbumWall = {
    Album: {
        CoverList: [
            {
                id:1,
                title: "album1",
                image: {
                    src: "content/album/cover/photo1.jpg",
                    width: 440,
                    height: 657,
                },
                createtime: "20131105",
                updatetime: "20131105",
                pagesize: 1,
            }, {
                id: 2,
                title: "album2",
                image: {
                    src: "content/album/cover/photo2.jpg",
                    width: 440,
                    height: 435,
                },
                createtime: "20131203",
                updatetime: "20131203",
                pagesize: 1,
            }, {
                id: 3,
                title: "album3",
                image: {
                    src: "content/album/cover/photo3.jpg",
                    width: 600,
                    height: 599,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 4,
                title: "album4",
                image: {
                    src: "content/album/cover/photo4.jpg",
                    width: 600,
                    height: 400,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 5,
                title: "album5",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 314,
                    height: 424,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 6,
                title: "album6",
                image: {
                    src: "content/album/cover/photo6.jpg",
                    width: 437,
                    height: 589,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 7,
                title: "album7",
                image: {
                    src: "content/album/cover/photo7.jpg",
                    width: 500,
                    height: 331,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 8,
                title: "album8",
                image: {
                    src: "content/album/cover/photo8.jpg",
                    width: 500,
                    height: 333,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 9,
                title: "album9",
                image: {
                    src: "content/album/cover/photo9.jpg",
                    width: 552,
                    height: 461,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 10,
                title: "album10",
                image: {
                    src: "content/album/cover/photo10.jpg",
                    width: 410,
                    height: 600,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 11,
                title: "album11",
                image: {
                    src: "content/album/cover/photo11.jpg",
                    width: 600,
                    height: 600,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 12,
                title: "album12",
                image: {
                    src: "content/album/cover/photo12.jpg",
                    width: 600,
                    height: 600,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 13,
                title: "album13",
                image: {
                    src: "content/album/cover/photo13.jpg",
                    width: 510,
                    height: 340,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 14,
                title: "album14",
                image: {
                    src: "content/album/cover/photo14.jpg",
                    width: 900,
                    height: 1200,
                },
                createtime: "20140107",
                updatetime: "20140107",
                pagesize: 1,
            }, {
                id: 15,
                title: "album15",
                image: {
                    src: "content/album/cover/photo15.png",
                    width: 607,
                    height: 477,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            },/* {
                id: 16,
                title: "album16",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 164,
                    height: 78,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 17,
                title: "album17",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 344,
                    height: 234,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 18,
                title: "album18",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 384,
                    height: 124,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 19,
                title: "album19",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 184,
                    height: 324,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }, {
                id: 20,
                title: "album20",
                image: {
                    src: "content/album/cover/photo5.jpg",
                    width: 84,
                    height: 224,
                },
                createtime: "20131201",
                updatetime: "20131201",
                pagesize: 1,
            }*/],
        //分割后的PageList
        PageList: [],
    },
    Setting: {
        WallPageSizeMax: 20,
        CoverSizeMin: { width: 50, height: 50 },//add 2*BorderWidth == 70
        BorderWidth: 10,
    },
    Wall: {
        target: $(".album-wall"),
        size:0,
        //size: {
        //    width: function () {
        //        var width = AlbumWall.Wall.target.attr("resize-width");
        //        if (width) {
        //            return width;
        //        } else {
        //            return AlbumWall.Wall.target.width();
        //        }
        //        //return AlbumWall.Wall.target.width();
        //    },
        //    height: function () {
        //        var height = AlbumWall.Wall.target.attr("resize-height");
        //        if (height) {
        //            return height;
        //        } else {
        //            return AlbumWall.Wall.target.height();
        //        }
        //       // return AlbumWall.Wall.target.height();
        //    },
        //    area: function () {
        //        return AlbumWall.Wall.size.width() * AlbumWall.Wall.size.height();
        //    },
        //},
        position: {},
    },
    //坐标轴
    Axis: {
        custome_widthScale: 1,
        custome_heightScale:0.9,
        width_scale: 1,
        height_scale: 1,
        scale: 1,
        margin_left: 0,
        margin_top:0,
        width: 0,
        height: 0,
        //原点
        origin: {
            x: 0,
            y: 0,
        },
        Baseline: new Array(),
        OutBaseline: new Array(),
        CrossPoint: new Array(),
        OutCrossPoint: new Array(),
        Sac: new Array(),//死巷，凹区间块
        Content: new Array(),
        AutoContent: new Array(),//无填充死巷的自动填充块
    },
    Init: function() {
        var self = this;
        var coverList = self.Album.CoverList.slice();
        var container = $("#Section3 .section-container");
        var containerSize = Resize.getSize(container);
        
        AlbumWall.Wall.target.attr("resize-width", containerSize.width + "px");
        AlbumWall.Wall.target.attr("resize-height", containerSize.height + "px");
        AlbumWall.Wall.target.css({
            "width": containerSize.width + "px",
            "height": containerSize.height + "px",
        });
        this.Wall.position = this.Wall.target.position();

        this.Wall.size = Resize.getSize(this.Wall.target);
        //添加计算的area图片面积
        coverList = coverList.each(function(a, i) {
            var cover = a;
            //原图片面积
            cover.image.area = cover.image.width * cover.image.height;
            //添加border后面积
            cover.image.border_area = (cover.image.width + 2 * AlbumWall.Setting.BorderWidth) * (cover.image.height + 2 * AlbumWall.Setting.BorderWidth);
            return cover;
        });
        //albumList 重排
        //排列优先级 1,upadate;2,pagesize;3,create;4,image.area
        coverList.sort(function(a, b) {
            //a在前，返回负数
            //b在前,返回正数
            //0，不变
            /*/
            if (a.image.area > b.image.area) {
                    return -1;
                } else if (a.image.area == b.image.area) {
                    return 0;
                } else {
                    return 1;
                }
            
            /*/
            if (a.updatetime > b.updatetime) { //a最新更新
                return -1;
            } else if (a.updatetime == b.updatetime) {
                if (a.pagesize > b.pagesize) {
                    return -1;
                } else if (a.pagesize == b.pagesize) {
                    if (a.create > b.create) {
                        return -1;
                    } else if (a.create == b.create) {
                        if (a.image.area > b.image.area) {
                            return -1;
                        } else if (a.image.area == b.image.area) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
            //*/
            
        });

        //！取消以下函数
        //split coverlist by wall pagesize 根据pageSize分割albumWall
        var pageLength = 1;// Math.ceil(coverList.length / self.Setting.WallPageSizeMax);
        for (var i = 0; i < pageLength; i++) {
            //按照WallPageSizeMax值来分割coverList !取消
            //var list = coverList.splice(0, self.Setting.WallPageSizeMax);
            var list = coverList.slice();

            //get page album-border sum area
            var albumBorderSumArea = 0;
            list.each(function(o, j) {
                albumBorderSumArea += o.image.border_area;
            });
            var wallSizeArea = self.Wall.size.width * self.Wall.size.height;
            var resizeBorderArea = 0;
            
            //根据 wallSizeArea来resize album ！取消
            /*
            if (albumBorderSumArea > wallSizeArea) {
                //如果albumSize > average album size && the album size/ (albumBorderSumArea/(self.Wall.size.width * self.Wall.size.height))
                var averageSize = toFixed(wallSizeArea / list.length);
                var areaScale = toFixed(Math.sqrt(wallSizeArea / albumBorderSumArea));
                list.each(function(o, j, averageSize, areaScale) {
                    var resizeWidth = 0;
                    var resizeHeight = 0;
                    if (o.image.border_area > averageSize) {
                        resizeWidth = o.image.width * areaScale;
                        resizeHeight = o.image.height * areaScale;
                    } else {
                        resizeWidth = o.image.width;
                        resizeHeight = o.image.height;
                    }

                    o.image.resize_width = resizeWidth;
                    o.image.resize_height = resizeHeight;
                    o.image.resize_border_area = (resizeWidth + 2 * self.Setting.BorderWidth) * (resizeHeight + 2 * self.Setting.BorderWidth);
                    resizeBorderArea += o.image.resize_border_area;
                    return o;
                }, averageSize, areaScale);

                //TODO
                //仍然会有放不下的情况？
                console.log("realBorderSizeArea=" + albumBorderSumArea + " resizeBorderArea=" + resizeBorderArea + " wallSizeArea=" + wallSizeArea);
            } else {
                var averageSize = toFixed(wallSizeArea / list.length);
                list.each(function(o, j, averageSize) {
                    var resizeWidth = 0;
                    var resizeHeight = 0;
                    if (o.image.border_area > averageSize) {
                        resizeWidth = o.image.width * toFixed(Math.sqrt(toFixed(averageSize / o.image.border_area)));
                        resizeHeight = o.image.height * toFixed(Math.sqrt(toFixed(averageSize / o.image.border_area)));
                    } else {
                        resizeWidth = o.image.width;
                        resizeHeight = o.image.height;
                    }

                    o.image.resize_width = resizeWidth;
                    o.image.resize_height = resizeHeight;
                    o.image.resize_border_area = (resizeWidth + 2 * self.Setting.BorderWidth) * (resizeHeight + 2 * self.Setting.BorderWidth);
                    resizeBorderArea += o.image.resize_border_area;
                    return o;
                }, averageSize);
            }

            */
            //2014/01/06 update
            //resize方法，判断wallSize width&height 图片bordersize长或宽不超过wallsize

            var wallsize = {
                width: self.Wall.size.width,
                height:self.Wall.size.height,
            }

            list.each(function (o, j, wallsize) {
                var resizeWidth = 0;
                var resizeHeight = 0;
                var widthScale = toFixed(o.image.width / wallsize.width);
                var heightScale = toFixed(o.image.height / wallsize.height);
                if (widthScale > 1 || heightScale > 1) {
                    var lastScale = 1;
                    if (widthScale > heightScale) {
                        lastScale = widthScale;
                    } else {
                        lastScale = heightScale;
                    }
                    resizeWidth = toFixed(o.image.width / lastScale);
                    resizeHeight = toFixed(o.image.height / lastScale);
                } else {
                    resizeWidth = o.image.width;
                    resizeHeight = o.image.height;
                }

                o.image.resize_width = resizeWidth;
                o.image.resize_height = resizeHeight;

                o.image.resize_border_area = (resizeWidth + 2 * self.Setting.BorderWidth) * (resizeHeight + 2 * self.Setting.BorderWidth);
                //resizeBorderArea += o.image.resize_border_area;
                return o;
            }, wallsize);


            var target = {
                list: list,
                border_sum_area: albumBorderSumArea,
            };
            //根据WallSizeArea resize;
            self.Album.PageList.push(target);
        }

        //2 构建Wall 直角坐标轴
        var wallWidth = parseInt(self.Wall.size.width);
        var wallHeight = parseInt(self.Wall.size.height);
        if (wallWidth > wallHeight) {
            self.Axis.width_scale = toFixed(wallHeight / wallWidth);
            self.Axis.height_scale = 1;
        } else {
            self.Axis.height_scale = toFixed(wallWidth / wallHeight);
            self.Axis.width_scale = 1;
        }
        //坐标轴微调
        self.Axis.height_scale = self.Axis.height_scale / AlbumWall.Axis.custome_heightScale;
        self.Axis.width_scale = self.Axis.width_scale / AlbumWall.Axis.custome_widthScale;

        //原点坐标
        //偏正为正方形的坐标系原点
        self.Axis.origin.x = toFixed(Math.min(wallWidth, wallHeight) / 2);
        self.Axis.origin.y = toFixed(Math.min(wallWidth, wallHeight) / 2);
        

        self.Axis.width = self.Axis.origin.x * 2;
        self.Axis.height = self.Axis.origin.y * 2;
        //init location to put the album
        self.Axis.baseline = new Array();

        //PageList[0] albumList
        var albumList = self.Album.PageList[0].list.slice();

        //resize the album size according to the width_scale & height_scale 
        albumList = albumList.each(function(a) {
            a.image.axis_width = toFixed(a.image.resize_width * AlbumWall.Axis.width_scale);
            a.image.axis_height = toFixed(a.image.resize_height * AlbumWall.Axis.height_scale);
            return a;
        });
        //Init
        AlbumWall.Axis.Baseline = new Array(),
        AlbumWall.Axis.OutBaseline = new Array(),
        AlbumWall.Axis.CrossPoint= new Array(),
        AlbumWall.Axis.OutCrossPoint= new Array(),
        AlbumWall.Axis.Sac= new Array(),//死巷，凹区间块
        AlbumWall.Axis.Content= new Array(),
        AlbumWall.Axis.AutoContent = new Array(),//无填充死巷的自动填充块
        //获取Baseline
        caculateAlbumArrange(albumList);

        //监听鼠标位置，
        this.watchPosition();

        function caculateAlbumArrange(albumList) {
            (!album || !isArray(albumList) || album.length == 0) && (function() {
                throw Exception;
                return null;
            });
            var album = albumList[0];
            //获取图片
            console.log(album.id);
            if (album.id === 13) {
                //debugger;
            }
            //[1]:无baseline的情况
            if (AlbumWall.Axis.OutBaseline.length == 0 && AlbumWall.Axis.CrossPoint.length == 0) {
                //取坐标系-x方向为album上下对称点且右边对齐y轴
                /*
                album.image.axis = {};
                album.image.axis.location = {
                    x: -album.image.axis_width,
                    y: toFixed((album.image.axis_height / 2),4),
                };
                */
                
                album.image.axis = {};
                album.image.axis.location = {
                    x: -toFixed(album.image.axis_width/2),
                    y: toFixed((album.image.axis_height / 2)),
                };
                
                album.image.axis.border = getAxisImageBorder(album.image);

                //test
                var baseline = borderToBaseline(album.image.axis.border);
                if (validateBaseline(baseline,"just get te album and no outBaseline & crossPoint")) {
                    addBaseLine(baseline);
                    //完成本次排列
                    
                    afterArrange(album, albumList);
                }

                //无CrossPoint，有baseline的情况
            } else if (AlbumWall.Axis.OutBaseline.length != 0 || AlbumWall.Axis.CrossPoint.length != 0) {
                //根据self.Axis.Baseline
                if (validateBaseline(AlbumWall.Axis.Baseline,"have outBaseline or CrossPoint")) {
                    //get the baseline center point and the distance to the origin point
                    var outBaselineCenter = AlbumWall.Axis.OutBaseline.each(function (b, i) {
                        var x = toFixed((b.from.x + b.to.x) / 2);
                        var y = toFixed((b.from.y + b.to.y) / 2);
                        b.type = "out-baseline-center";
                        b.distance = Math.pow(x, 2) + Math.pow(y, 2);
                        b.center = {
                            x: x,
                            y: y,
                        };
                        return b;
                    });

                    //根据AlbumWall.Axis.CrossPoint
                    //get the baseline center point and the distance to the origin point
                    var crossPointArray = AlbumWall.Axis.CrossPoint.each(function(b) {
                        var x = b.point.x;
                        var y = b.point.y;
                        b.distance = Math.pow(x, 2) + Math.pow(y, 2);
                        b.type = "cross-point";
                        return b;
                    });
                    var conditionList = new Array();
                    conditionList.pushArray(outBaselineCenter);
                    conditionList.pushArray(crossPointArray);
                    conditionList.sort(function(a, b) {
                        //a在前，返回负数
                        //b在前,返回正数
                        //0，不变
                        if (a.distance < b.distance) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    var condition = null;
                    if (conditionList && conditionList.length > 0) {
                        condition = conditionList[0];
                    } else {
                        throw Exception;
                        return null;
                    }
                    if (condition.type == "out-baseline-center") {
                        //if is baselineCenter;
                        var targetBaseline = condition;
                        album.image.axis = {};
                        switch (targetBaseline.space) {
                        case "y":
                            album.image.axis.location = {
                                x: toFixed(targetBaseline.center.x - toFixed(album.image.axis_width / 2)),
                                y: toFixed(targetBaseline.center.y + album.image.axis_height),
                            };
                            break;
                        case "-y":
                            album.image.axis.location = {
                                x: toFixed(targetBaseline.center.x - toFixed(album.image.axis_width / 2)),
                                y: targetBaseline.center.y,
                            };
                            break;
                        case "x":
                            album.image.axis.location = {
                                x: targetBaseline.center.x,
                                y: toFixed(targetBaseline.center.y + toFixed(album.image.axis_height / 2)),
                            };
                            break;
                        case "-x":
                            album.image.axis.location = {
                                x: toFixed(targetBaseline.center.x - album.image.axis_width),
                                y: toFixed(targetBaseline.center.y + toFixed(album.image.axis_height / 2)),
                            };
                            break;
                        }

                        album.image.axis.border = getAxisImageBorder(album.image);

                        //test
                        var baseline = borderToBaseline(album.image.axis.border);
                        if (validateBaseline(baseline,"out-baseline-center arrange finish")) {
                            //添加并且整合AlbumWall.Axis.Baseline
                            addBaseLine(baseline);
                            //完成本次排列
                            afterArrange(album, albumList);
                        }
                    } else if (condition.type == "cross-point") {
                        var targetCrossPoint = condition;
                        var widthAvailable = function(crossPoint, album) {
                            if (!crossPoint.limit_x ||
                                (crossPoint.limit_x && crossPoint.limit_x >= album.image.axis_width)) {
                                return true;
                            } else {
                                return false;
                            }
                        };

                        var heightAvailable = function(crossPoint, album) {
                            if (!crossPoint.limit_y ||
                                (crossPoint.limit_y && crossPoint.limit_y >= album.image.axis_height)) {
                                //y轴方向 纵向 高度 可置
                                return true;
                            } else {
                                return false;
                            }
                        };

                        //if space available and add in;
                        if (widthAvailable(targetCrossPoint, album) && heightAvailable(targetCrossPoint, album)) {
                            addAlbum(album, albumList, targetCrossPoint);
                        } else {
                            //get other avaliable album to put in
                            for (var j = 0; j < albumList.length; j++) {
                                if (widthAvailable(targetCrossPoint, albumList[j]) && heightAvailable(targetCrossPoint, albumList[j])) {
                                    var otheralbum = albumList.getIndex(j);
                                    addAlbum(otheralbum, albumList, targetCrossPoint);
                                } else {
                                    if (j == albumList.length - 1) {
                                    //TODO，不使用album填充，直接baseline里面截取链接
                                    //根据targetCrossPoint来获取形成闭区间的两个点以及他们的可延伸区域，并获取延伸段小的那个点作为填充的延伸baseline
                                    var currentIndex;
                                    for (var c = 0 ; c < crossPointArray.length; c++) {
                                        var current = crossPointArray[c];
                                        if (targetCrossPoint.point.x == current.point.x && targetCrossPoint.point.y == current.point.y) {
                                            if (!currentIndex&&currentIndex!=0) {
                                                currentIndex = c;
                                            } else {
                                                throw "to match";
                                            }
                                        }
                                    }
                                        
                                    if (!currentIndex && currentIndex != 0) {
                                        throw "no match index";
                                    } else {
                                        currentIndex;
                                    };
                                    var extendsCrossPoint = null;
                                    //如果是下一个
                                    if (currentIndex + 1 < crossPointArray.length) {
                                        var next = crossPointArray[currentIndex + 1];
                                        var current = targetCrossPoint;
                                        extendsCrossPoint = getExtendsCrossPoint(next, current);
                                    } else {
                                        var next = crossPointArray[0];
                                        var current = targetCrossPoint;
                                        if (extendsCrossPoint&&getExtendsCrossPoint(next, current)) {
                                            throw "extendsCrossPoint repeat ";
                                        } else if (!extendsCrossPoint) {
                                            extendsCrossPoint = getExtendsCrossPoint(next, current);
                                        }
                                    }

                                    //如果是上一个
                                    if (currentIndex > 0) {
                                        var prev = crossPointArray[currentIndex - 1];
                                        var current = targetCrossPoint;
                                        if (extendsCrossPoint && getExtendsCrossPoint(prev, current)) {
                                            throw "extendsCrossPoint repeat ";
                                        } else if (!extendsCrossPoint) {
                                            extendsCrossPoint = getExtendsCrossPoint(prev, current);
                                        }
                                    } else {
                                        var prev = crossPointArray[crossPointArray.length - 1];
                                        var current = targetCrossPoint;
                                        if (extendsCrossPoint && getExtendsCrossPoint(prev, current)) {
                                            throw "extendsCrossPoint repeat ";
                                        } else if (!extendsCrossPoint) {
                                            extendsCrossPoint = getExtendsCrossPoint(prev, current);
                                        }
                                    }

                                    if (extendsCrossPoint) {
                                        //对现有的baseline从crosspoint处延伸填充闭合区域
                                        //debugger;
                                        AlbumWall.Axis.Baseline = extendBaseline(extendsCrossPoint);
                                        afterArrange(null, albumList);
                                    } else {
                                        throw "no such extendsCrossPoint";
                                    }
                                    
                                    function extendBaseline(closePoint) {
                                        var p1 = closePoint.p1;
                                        var p2 = closePoint.p2;
                                        var baseline = AlbumWall.Axis.Baseline;
                                        var removeLine1;//移除的line1，p1和p2点所形成的baseline
                                        var removeLine2;//移除的line2，p1点为一端的line
                                        var cutLine3;//
                                        
                                        for (var i = 0; i < baseline.length; i++) {
                                            var b = baseline[i];
                                            //获取p1,p2连接baseline
                                            if ((pointCompare(b.from, p1.point) && pointCompare(b.to, p2.point) || (pointCompare(b.to, p1.point) && pointCompare(b.from, p2.point)))) {
                                                if (removeLine1) {
                                                    throw "has removeLine1";
                                                } else {
                                                    removeLine1 = i;
                                                }
                                            }
                                        }
                                        if (removeLine1==undefined) {
                                            throw "no removeLine1";
                                        }
                                        //remove line1
                                        var line1 = AlbumWall.Axis.Baseline.getIndex(removeLine1);
                                        
                                        for (var i = 0; i < baseline.length; i++) {
                                            var b = baseline[i];
                                            //获取p1的非闭合段
                                            if ((pointCompare(b.from, p1.point) && !pointCompare(b.to, p2.point)) || (pointCompare(b.to, p1.point) && !pointCompare(b.from, p2.point))) {
                                                if (removeLine2) {
                                                    throw "has removeLine2";
                                                } else {
                                                    removeLine2 = i;
                                                }
                                            }
                                        }
                                        if (removeLine2==undefined) {
                                            throw "no removeLine2";
                                        }
                                        var line2 = AlbumWall.Axis.Baseline.getIndex(removeLine2);
                                        
                                        for (var i = 0; i < baseline.length; i++) {
                                            var b = baseline[i];
                                            //获取p2的非闭合段
                                            if ((pointCompare(b.from, p2.point) && !pointCompare(b.to, p1.point)) || (pointCompare(b.to, p2.point) && !pointCompare(b.from, p1.point))) {
                                                if (cutLine3) {
                                                    throw "has cutLine3";
                                                } else {
                                                    cutLine3 = i;
                                                    //debugger;
                                                }
                                            }
                                        }
                                        if (cutLine3 == undefined) {
                                            throw "no cutLine3";
                                        }

                                        var line3 = AlbumWall.Axis.Baseline[cutLine3];
                                        
                                        //获取line2的另一个点
                                        var extendP1;
                                        if (pointCompare(p1.point, line2.from)) {
                                            extendP1 = line2.to;

                                        } else {
                                            extendP1 = line2.from;
                                            if (!pointCompare(line2.to, p1.point)) {
                                                throw "extendP1 error";
                                            }
                                        }
                                        //var extendBaseline;
                                        for (var i = 0; i < baseline.length; i++) {
                                            var b = baseline[i];
                                            //获取extendBaseline 
                                            if (pointCompare(b.from, extendP1)) {
                                                if (b.x == null) {  //平行于x轴
                                                    if (b.space.indexOf("-") != -1) { //负方向
                                                        b.from.x = p2.point.x;
                                                        b.t = p2.point.x;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.to, p2.point)) {
                                                            line3.to.y = b.from.y;
                                                            line3.t = b.from.y;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status5 validate")) {
                                                                throw "extend status5 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status5 error";
                                                        }
                                                    } else {
                                                        b.from.x = p2.point.x;
                                                        b.f = p2.point.x;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.to, p2.point)) {
                                                            line3.to.y = b.from.y;
                                                            line3.f = b.from.y;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status6 validate")) {
                                                                throw "extend status6 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status6 error";
                                                        }
                                                    }
                                                } else {
                                                    if (b.space.indexOf("-") != -1) {
                                                        //平行于y轴 负方向
                                                        b.from.y = p2.point.y;
                                                        b.f = p2.point.y;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.to, p2.point)) {
                                                            line3.to.x = b.from.x;
                                                            line3.t = b.from.x;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status7 validate")) {
                                                                throw "extend status7 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status7 error";
                                                        }
                                                    } else {
                                                        //平行于y轴 正方向
                                                        b.from.y = p2.point.y;
                                                        b.t = p2.point.y;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.to, p2.point)) {
                                                            line3.to.x = b.from.x;
                                                            line3.f = b.from.x;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status8 validate")) {
                                                                throw "extend status8 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status8 error";
                                                        }
                                                    }
                                                }
                                            } else if (pointCompare(b.to, extendP1)) {
                                                if (b.x == null) { //baseline平行于x轴
                                                    if (b.space.indexOf("-") != -1) { //负方向
                                                        //extendBaseline延伸 ，to延伸
                                                        b.to.x = p2.point.x;
                                                        b.f = p2.point.x;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.from, p2.point)) {
                                                            line3.from.y = b.to.y;
                                                            line3.t = b.to.y;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status1 validate")) {
                                                                throw "extend status1 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status1 error";
                                                        }
                                                    } else { //baseline平行于x轴 ，y正方向
                                                        //extendBaseline延伸 ，to延伸
                                                        b.to.x = p2.point.x;
                                                        b.t = p2.point.x;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.from, p2.point)) {
                                                            line3.from.y = b.to.y;
                                                            line3.f = b.to.y;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status validate")) {
                                                                throw "extend status2 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status2 error";
                                                        }
                                                    }
                                                } else {
                                                    //平行于y轴方向
                                                    if (b.space.indexOf("-") != -1) { //负方向
                                                        b.to.y = p2.point.y;
                                                        b.t = p2.point.y;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.from, p2.point)) {
                                                            line3.from.x = b.to.x;
                                                            line3.t = b.to.x;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status3 validate")) {
                                                                throw "extend status3 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status3 error";
                                                        }
                                                    } else {
                                                        //平行于y轴 正方向
                                                        b.to.y = p2.point.y;
                                                        b.f = p2.point.y;
                                                        b.length = toFixed(b.t - b.f);
                                                        //截断
                                                        if (pointCompare(line3.from, p2.point)) {
                                                            line3.from.x = b.to.x;
                                                            line3.f = b.to.x;
                                                            line3.length = Math.abs(line3.t - line3.f);
                                                            //debugger;
                                                            if (!validateBaseline(AlbumWall.Axis.Baseline,"extend status4 validate")) {
                                                                throw "extend status4 validate error";
                                                            } else {
                                                                //debugger;
                                                            }
                                                        } else {
                                                            throw "extend status4 error";
                                                        }
                                                    }
                                                }

                                                //debugger;
                                            }
                                        }
                                        //debugger;

                                        //extendBaseline 并且延长至Line3的交点
                                        return AlbumWall.Axis.Baseline;
                                    }

                                    function pointCompare(p1, p2) {
                                        if (p1.x == p2.x && p1.y == p2.y) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                        
                                    //获取关联闭合区域点，比较获取可延伸点，然后延伸闭合baseline
                                    function getExtendsCrossPoint(next, current) {
                                        var crossPoint = null;
                                        if (next.limit_x && current.limit_x && next.limit_x == current.limit_x) {
                                            //判断space_y_length
                                            if (next.space_y_length < current.space_y_length) {
                                                crossPoint = {
                                                    p1: next,
                                                    p2: current,
                                                };
                                                //debugger;
                                            } else {
                                                crossPoint = {
                                                    p1: current,
                                                    p2: next,
                                                };
                                                //debugger;
                                            }
                                        } else if (next.limit_y && current.limit_y && next.limit_y == current.limit_y) {
                                            if (next.space_x_length < current.space_x_length) {
                                                crossPoint = {
                                                    p1: next,
                                                    p2: current,
                                                };
                                                //debugger;
                                            } else {
                                                crossPoint = {
                                                    p1: current,
                                                    p2: next,
                                                };
                                                //debugger;
                                            }
                                        }
                                        if (!crossPoint) {
                                            //debugger;
                                        }
                                        return crossPoint;
                                    }
                                        
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        function afterArrange(album, albumList) {
            if(album){
                for (var i = 0; i < albumList.length; i++) {
                    if (album.title == albumList[i].title) {//区分album
                        albumList.getIndex(i);
                        //debugger;
                    }
                }

                //添加到最终内容Content
                AlbumWall.Axis.Content.push(album);
                //drawAlbum(album);
                if (album.type == "auto") {
                    //debugger;
                }
            }
            AlbumWall.Axis.CrossPoint = getCrossPoint(AlbumWall.Axis.Baseline);
            AlbumWall.Axis.OutCrossPoint = getOutCrossPoint(AlbumWall.Axis.Baseline);
            if (album) {
                console.log("before outBaseline=" + album.id);
            }
            AlbumWall.Axis.OutBaseline = getOutBaseline(AlbumWall.Axis.OutCrossPoint);
            AlbumWall.Axis.CrossPoint = getSac(AlbumWall.Axis.CrossPoint);
            if (albumList.length > 0) {
                caculateAlbumArrange(albumList);
            } else {
                //arrange complete
                //debugger;
                //TODO
                //判断baseline，判断最左baseline和最右baseline之间的距离，>AlbumWall.Axis.width
                //获取最左边
                
                var leftBaseline, rightBaseline, topBaseline, bottomBaseline;
                for (var i = 0; i < AlbumWall.Axis.Baseline.length; i++) {
                    var b = AlbumWall.Axis.Baseline[i];
                    switch (b.space) {
                        case "x"://rightborder
                            if (!rightBaseline || (rightBaseline && rightBaseline.x < b.x)) {
                                rightBaseline = b;
                            }
                            break;
                        case "-x"://leftborder
                            if (!leftBaseline || (leftBaseline && leftBaseline.x > b.x)) {
                                leftBaseline = b;
                            }
                            break;
                        case "y"://topborder
                            if (!topBaseline || (topBaseline && topBaseline.y < b.y)) {
                                topBaseline = b;
                            }
                            break;
                        case "-y"://bottomborder
                            if (!bottomBaseline || (bottomBaseline && bottomBaseline.y > b.y)) {
                                bottomBaseline = b;
                            }
                            break;
                    }
                }
                
                var borderWidth, borderHeight;
                //最终左右上下 偏移剧中？
                if (leftBaseline && rightBaseline && topBaseline && bottomBaseline) {
                    borderWidth = toFixed(Math.abs(rightBaseline.x - leftBaseline.x));
                    borderHeight = toFixed(Math.abs(topBaseline.y - bottomBaseline.y));
                    var maxBorder = Math.max(borderWidth, borderHeight);
                    if (maxBorder > AlbumWall.Axis.width) {
                       
                        AlbumWall.Axis.scale = toFixed(AlbumWall.Axis.width / maxBorder);
                    }
                    var originX = toFixed((rightBaseline.x + leftBaseline.x) / 2);
                    var originY = toFixed((topBaseline.y + bottomBaseline.y) / 2);
                    AlbumWall.Axis.margin_left = (originX);
                    AlbumWall.Axis.margin_top = (originY);
                    //debugger;
                } else {
                    throw "baseline top,left,right,bottom error";
                }
                
                
                AlbumWall.Axis.Content.each(function (album,i) {
                    drawAlbum(album,i);
                });
                
            }
        }

        function addAlbum(album, albumList, targetCrossPoint) {
            album.image.axis = {};
            var spaceStr = targetCrossPoint.space_x + targetCrossPoint.space_y;
            switch (spaceStr) {
                case "xy":
                    //第一象限
                    album.image.axis.location = {
                        x: targetCrossPoint.point.x,
                        y: toFixed(targetCrossPoint.point.y + album.image.axis_height),
                    };
                    break;
                case "x-y":
                    //第二象限
                    album.image.axis.location = {
                        x: targetCrossPoint.point.x,
                        y: targetCrossPoint.point.y,
                    };
                    break;
                case "-x-y":
                    //第三象限
                    album.image.axis.location = {
                        x: toFixed(targetCrossPoint.point.x - album.image.axis_width),
                        y: targetCrossPoint.point.y,
                    };
                    break;
                case "-xy":
                    //第四象限
                    album.image.axis.location = {
                        x: toFixed(targetCrossPoint.point.x - album.image.axis_width),
                        y: toFixed(targetCrossPoint.point.y + album.image.axis_height),
                    };
                    break;
            }

            album.image.axis.border = getAxisImageBorder(album.image);
            //test
            var baseline = borderToBaseline(album.image.axis.border);
            if (validateBaseline(baseline,"add Album func")) {
                //添加并且整合AlbumWall.Axis.Baseline
                addBaseLine(baseline);
                //完成本次排列
                afterArrange(album, albumList);
            }
        }

        function drawAlbum(album, i) {
            //AlbumWall.Axis.scale  坐标轴比例 = 用于图片缩放，正常比例为1
            //AlbumWall.Axis.width_scale    坐标轴宽度比 = 用于图片在实际Wall和正方型坐标轴的坐标换算[不用修改]
            //AlbumWall.Axis.height_scale   同上
            var albumWidth = album.image.axis_width / AlbumWall.Axis.width_scale //* AlbumWall.Axis.scale;
            var albumHeight = album.image.axis_height / AlbumWall.Axis.height_scale //* AlbumWall.Axis.scale;
            var borderWidth = AlbumWall.Setting.BorderWidth * AlbumWall.Axis.width_scale //* AlbumWall.Axis.scale;
            var borderHeight = AlbumWall.Setting.BorderWidth * AlbumWall.Axis.height_scale //* AlbumWall.Axis.scale;
            
            //AlbumWall.Axis.margin_top     使排列后的图片整体剧中的偏移值 top
            //AlbumWall.Axis.margin_left    同上  便宜值 left

            //var albumTop = ((AlbumWall.Axis.origin.y - album.image.axis.location.y + AlbumWall.Axis.margin_top) * AlbumWall.Axis.scale + (1 - AlbumWall.Axis.scale) / 2 * AlbumWall.Axis.width) / AlbumWall.Axis.height_scale + (1 - AlbumWall.Axis.custome_heightScale) / 2 * AlbumWall.Axis.width;
            //var albumLeft = ((album.image.axis.location.x + AlbumWall.Axis.origin.x - AlbumWall.Axis.margin_left) * AlbumWall.Axis.scale + (1 - AlbumWall.Axis.scale) / 2 * AlbumWall.Axis.height) / AlbumWall.Axis.width_scale + (1 - AlbumWall.Axis.custome_widthScale) / 2 * AlbumWall.Axis.height;

            var albumTop = ((AlbumWall.Axis.origin.y - album.image.axis.location.y + AlbumWall.Axis.margin_top)) / AlbumWall.Axis.height_scale + (1 - AlbumWall.Axis.custome_heightScale) / 2 * AlbumWall.Axis.width;
            var albumLeft = ((album.image.axis.location.x + AlbumWall.Axis.origin.x - AlbumWall.Axis.margin_left)) / AlbumWall.Axis.width_scale + (1 - AlbumWall.Axis.custome_widthScale) / 2 * AlbumWall.Axis.height;

            //主要修改数据
            //album.image.axis.location.x   计算后的位于坐标轴的x值
            //album.image.axis.location.y   同上  坐标轴的y值

            //AlbumWall.Axis.origin.y   坐标轴中点 y 坐标
            //AlbumWall.Axis.origin.x   坐标轴中点 x 坐标

            //Considering 修改坐标原点坐标还是图片坐标？
            //通过修改Album的Container的3D坐标里移动图片整体，scale来修改比例

            //获取mousemove位于Container的位置
            //AlbumWall.Axis.width_scale使用来换算获取位于坐标轴的位置

            //debugger;
            var albumContainer = $("#" + album.id);
            if (albumContainer.length == 0) {
                albumContainer = $("<div " +
                    "id='" + album.id + "' class='albumContainer' style='box-sizing: border-box;position:absolute;'></div>");
               
                var spaceTime = parseInt(i) * 0.1;
                var duration = 1.1;
                albumContainer.css({
                    "-webkit-transition-delay": spaceTime + "s",
                    "-webkit-transition-duration": duration + "s",
                });
                //if (album.id == "5") {
                    //debugger;
                //}
                //albumContainer.html(album.title);
                AlbumWall.Wall.target.append(albumContainer);
                var cover = $("<img src='" + album.image.src + "'/>");
                
                var coverContainer = $("<div class='albumborder'></div>");
                coverContainer.css({
                    "border-top": borderHeight + "px solid transparent",
                    "border-bottom": borderHeight + "px solid transparent",
                    "border-left": borderWidth + "px solid transparent",
                    "border-right": borderWidth + "px solid transparent",
                    "box-sizing": "border-box",
                    "width": "100%",
                    "height": "100%",
                    "background": "#fff",
                });
                coverContainer.append(cover);
                albumContainer.append(coverContainer);
            }
            albumContainer.css({
                "width": albumWidth + "px",
                "height": albumHeight + "px",
                "top": albumTop + "px",
                "left": albumLeft + "px",
                "border-top": borderHeight + "px solid transparent",
                "border-bottom": borderHeight + "px solid transparent",
                "border-left": borderWidth + "px solid transparent",
                "border-right": borderWidth + "px solid transparent",
            });
            albumContainer.find("div").css({
                "border-top": borderHeight + "px solid transparent",
                "border-bottom": borderHeight + "px solid transparent",
                "border-left": borderWidth + "px solid transparent",
                "border-right": borderWidth + "px solid transparent",
            });
            cover = albumContainer.find("img");
            var actualWidth = albumWidth - (borderWidth * 4);
            var actualHeight = albumHeight - (borderHeight * 4);
            var widthScale = actualWidth / album.image.width;
            var heightNumber = album.image.height * widthScale;
            var widthValue = "auto", heightValue = "auto";
            if (heightNumber > actualHeight) {
                heightValue = "100%";
            } else {
                widthValue = "100%";
            }
            cover.css({
                "height": heightValue, "width": widthValue, "display": "block", "margin": "auto",
            });

            ////debugger;
        }

/*
        common function
        */
        function getAxisImageBorder(image) {//根据axisLocation获取其border
            var border = {
                top: {
                    y: image.axis.location.y,
                    limit: [image.axis.location.x,toFixed(image.axis.location.x + image.axis_width)],
                },
                right: {
                    x: toFixed(image.axis.location.x + image.axis_width),
                    limit: [toFixed(image.axis.location.y - image.axis_height), image.axis.location.y],
                },
                bottom: {
                    y: toFixed(image.axis.location.y - image.axis_height),
                    limit: [image.axis.location.x, toFixed(image.axis.location.x + image.axis_width)],
                },
                left: {
                    x: image.axis.location.x,
                    limit: [toFixed(image.axis.location.y - image.axis_height), image.axis.location.y],
                }
            };
            return border;
        }
        
        //put the axis border to baseline && get the last baseline
        //var baseline = addBaseLine(album.image.axis.border);
        function addBaseLine(baseline) {
            var lastBaseLine = new Array();
            if (AlbumWall.Axis.Baseline.length == 0) {
                lastBaseLine = baseline.slice();
            } else {
                //判断baseline cover情况
                lastBaseLine = baseline.slice();
                //获取重合段baseline
                var overlarp = overlarpline(lastBaseLine);
                //获取移除重合后的baseline
                var axisBaseline = removeOverlapLine(overlarp, self.Axis.Baseline);
                var albumBaseline = removeOverlapLine(overlarp, lastBaseLine);
                //整合新的Axis.Baseline,并且获取crossPoint
                lastBaseLine = mergeBaseline(axisBaseline, albumBaseline);
            }
            AlbumWall.Axis.Baseline = lastBaseLine;
        }
        
        //获取coverline 重合baseline
        function overlarpline(baseline) {
            var overlarp = new Array();
            for (var i = 0; i < baseline.length; i++) {
                for (var j = 0; j < AlbumWall.Axis.Baseline.length; j++) {
                    var b1 = baseline[i];
                    var b2 = AlbumWall.Axis.Baseline[j];
                    if (b1.x == b2.x && b1.y == b2.y) { //处于同一直线上
                        var minF = Math.min(b1.f, b2.f);
                        var maxT = Math.max(b1.t, b2.t);
                        var totalLength = b1.t - b1.f + b2.t - b2.f;
                        if ((maxT - minF) < totalLength) {
                            //获取重合段,
                            //重合段数据
                            var larp = {
                                x: b1.x,
                                y: b1.y,
                                f: Math.max(b1.f, b2.f),
                                t: Math.min(b1.t, b2.t),
                            };
                            overlarp.push(larp);
                        }
                    }
                }
            }
            return overlarp;
        }
        //移除重合段baseline，拆分原baseline
        function removeOverlapLine(overlarp, baseline) {
            var newBaseline = new Array();
            if (!overlarp || overlarp.length == 0) {
                throw ("overlarp error");
                return null;
            } else {
                for (var i = 0; i < baseline.length; i++) {
                    var b = clone(baseline[i]);
                    var cover = false;
                    for (var j = 0; j < overlarp.length; j++) {
                        var l = clone(overlarp[j]);
                        if ((b.x == l.x && b.y == l.y) && ((l.f >= b.f && l.f < b.t) || (l.t <= b.t && l.t > b.f))) {
                            cover = true;
                            var t = clone(baseline.slice()[i]);
                            //删除或者拆分被重合的baseline
                            if (l.f > b.f) {
                                //前段间隔. l.f的开始位置为b.t的结束位置
                                t.t = l.f;
                                if (b.y) {//y值不为null,x轴平行方向line
                                    if (b.space == "y") { //space == "y" 方向为y轴正方向，为topborder
                                        //topborder，修改b.to.x值
                                        t.to.x = l.f;
                                        t.length = toFixed(Math.abs(t.to.x - t.from.x));
                                    } else { //y轴负方向，为bottomborder
                                        //bottomborder,修改b.from.x值
                                        t.from.x = l.f;
                                        t.length = toFixed(Math.abs(t.from.x - t.to.x));
                                    }
                                } else { //x值不为bull,y轴平行方向line
                                    if (b.space == "x") { //space == "x" x轴正方向, 为rightborder
                                        //rightborder,修改b.from.y
                                        t.from.y = l.f;
                                        t.length = toFixed(Math.abs(t.from.y - t.to.y));
                                    } else {
                                        //leftborder
                                        t.to.y = l.f;
                                        t.length = toFixed(Math.abs(t.to.y - t.from.y));
                                    }
                                }
                                //debugger;
                                newBaseline.push(t);
                                
                            }
                            t = clone(baseline.slice()[i]);
                            if (l.t < b.t) {
                                //后段间隔,l.t的结束位置为b.f的开始位置
                                t.f = l.t;
                                if (t.y) {
                                    if (b.space == "y") {
                                        t.from.x = l.t;
                                        t.length = toFixed(Math.abs(t.to.x - t.from.x));
                                    } else {
                                        t.to.x = l.t;
                                        t.length = toFixed(Math.abs(t.from.x - t.to.x));
                                    }
                                } else {
                                    if (b.space == "x") {
                                        t.to.y = l.t;
                                        t.length = toFixed(Math.abs(t.from.y - t.to.y));
                                    } else {
                                        t.from.y = l.t;
                                        t.length = toFixed(Math.abs(t.to.y - t.from.y));
                                    }
                                }
                                //debugger;
                                newBaseline.push(t);
                                
                            } else {
                                //前段重合或者后段重合或者完全重合，移除
                                ////debugger;
                            }
                        } else {
                            if (j == (overlarp.length - 1)&&!cover) {
                                newBaseline.push(b);
                            }
                        }
                    }
                }
                return newBaseline;
            }
        }
        
        //整合新的Axis.Baseline
        function mergeBaseline(b1, b2) {
            //拆分b1和b2，头尾相接
            var baseline = new Array();
            //startline
            if(b1.length==0||b2.length==0){
                console.log("mergeBaseline param error: b1,b2 null");
                return null;
            }
            b1.pushArray(b2);
            var b = b1;
            baseline.push(b.getIndex(0));//定义链头
            //connect baseline
            baseline = connectBaseline(baseline, b);
            baseline = mergeExtraBaseline(baseline);
            return baseline;
        }

        //getCrossPoint && Sac 
        function getCrossPoint(baseline) {
            if(!validateBaseline(baseline,"getCrossPoint func")){
                return null;                                    
            }
            var crossPointArray = new Array();
            for (var i = 0; i < baseline.length; i++) {
                var b1 = baseline[i];
                var b2;
                if (i == (baseline.length - 1)) {
                    b2 = baseline[0];
                } else {
                    b2 = baseline[i + 1];
                }
                //判断两条baseline所形成的直角，凹直角或是凸直角
                var crossPoint = baselineRightAngle(b1, b2);
                if (crossPoint) {
                    crossPointArray.push(crossPoint);
                }
            }
            return crossPointArray;
        }

        //判断两条baseline所形成的是凸直角还是凹直角，凹直角的交点即为crossPoint
        function baselineRightAngle(b1, b2) {
            if (b1.space == "x" && b2.space == "y") {
                //凹 第一象限
                var crosspoint = {
                    space_x: b1.space,
                    space_x_length:b2.length,
                    space_y: b2.space,
                    space_y_length:b1.length,
                    point: b1.to,
                };
                return crosspoint;
            } else if (b1.space == "-y" && b2.space == "x") {
                //凹 第二象限
                var crosspoint = {
                    space_x: b2.space,
                    space_x_length:b1.length,
                    space_y: b1.space,
                    space_y_length:b2.length,
                    point: b1.to,
                };
                return crosspoint;
            } else if (b1.space == "-x" && b2.space == "-y") {
                //凹 第三象限
                var crosspoint = {
                    space_x: b1.space,
                    space_x_length:b2.length,
                    space_y: b2.space,
                    space_y_length:b1.length,
                    point: b1.to,
                };
                return crosspoint;
            } else if (b1.space == "y" && b2.space == "-x") {
                //凹 第四象限
                var crosspoint = {
                    space_x: b2.space,
                    space_x_length: b1.length,
                    space_y: b1.space,
                    space_y_length: b2.length,
                    point: b1.to,
                };
                return crosspoint;
            }
            return null;
        }

        function getOutCrossPoint(baseline) {
            if (!validateBaseline(baseline,"getOutCrossPoint func")) {
                return null;
            }
            var outCrossPointArray = new Array();
            for (var i = 0; i < baseline.length; i++) {
                var b1 = baseline[i];
                var b2;
                if (i == (baseline.length - 1)) {
                    b2 = baseline[0];
                } else {
                    b2 = baseline[i + 1];
                }
                //判断两条baseline所形成的直角，凹直角或是凸直角
                var outCrossPoint = outBaselineAngel(b1, b2);
                if (outCrossPoint) {
                    outCrossPointArray.push(outCrossPoint);
                }
            }
            if (outCrossPointArray.length == 0) {
                throw "outCrossPointArray none";
            }
            return outCrossPointArray;
        }

        function outBaselineAngel(b1,b2) {
            if (b1.space == "y" && b2.space == "x") {
                var outpoint = {
                    point: b1.to,
                    space_x: b2.space,
                    space_y: b1.space,
                };
                return outpoint;
            } else if (b1.space == "x" && b2.space == "-y") {
                //凸 第二象限
                var outpoint = {
                    point: b1.to,
                    space_x: b1.space,
                    space_y: b2.space,
                };
                return outpoint;
            } else if (b1.space == "-y" && b2.space == "-x") {
                //凸 第三象限
                var outpoint = {
                    point: b1.to,
                    space_x: b2.space,
                    space_y: b1.space,
                };
                return outpoint;
            } else if (b1.space == "-x" && b2.space == "y") {
                //凸 第四象限
                var outpoint = {
                    point: b1.to,
                    space_x: b1.space,
                    space_y: b2.space,
                };
                return outpoint;
            }
        }

        function getOutBaseline(out) {
            var baselineArray = new Array();
            for (var i = 0; i < out.length; i++) {
                var l1 = out[i];
                var l2;
                if (i == (out.length - 1)) {
                    l2 = out[0];
                } else {
                    l2 = out[i + 1];
                }
                if ((l1.point.x == l2.point.x) || (l2.point.y == l2.point.y)) {
                    if (l1.space_x == l2.space_x) {
                        if (l1.space_y == l2.space_y || (l1.space_x == "x" && l1.space_y == "-y") || (l1.space_x == "-x" && l1.space_y == "y")) {
                            continue;
                        }
                        var baseline = {
                            space: l1.space_x,//y正方向空
                            x: l1.point.x,
                            y: null,
                            f: Math.min(l1.point.y,l2.point.y),//limit from
                            t: Math.max(l1.point.y,l2.point.y),//limit to
                            from: l1.point, //从左至右
                            to: l2.point,
                            length: toFixed(Math.abs(Math.max(l1.point.y, l2.point.y) - Math.min(l1.point.y, l2.point.y))),
                        };
                        //for test
                        if (toFixed(Math.abs(Math.max(l1.point.y, l2.point.y) - Math.min(l1.point.y, l2.point.y))) == 0) {
                            //outbaseline length ==0 ?!
                            //debugger
                        }
                        baselineArray.push(baseline);
                    } else if (l1.space_y == l2.space_y) {
                        if (l1.space_x == l2.space_x || (l1.space_y == "y" && l1.space_x == "x") || (l1.space_y == "-y" && l1.space_x == "-x")) {
                            continue;
                        }
                        var baseline = {
                            space: l1.space_y,//y正方向空
                            x: null,
                            y: l1.point.y,
                            f: Math.min(l1.point.x, l2.point.x),//limit from
                            t: Math.max(l1.point.x, l2.point.x),//limit to
                            from: l1.point, //从左至右
                            to: l2.point,
                            length: toFixed(Math.abs(Math.max(l1.point.x, l2.point.x) - Math.min(l1.point.x, l2.point.x))),
                        };
                        //for test
                        if (toFixed(Math.abs(Math.max(l1.point.x, l2.point.x) - Math.min(l1.point.x, l2.point.x))) == 0) {
                            //outbaseline length ==0 ?!
                            //debugger
                        }
                        baselineArray.push(baseline);
                    }
                }
            }
            return baselineArray;
        }

        //根据crosspoint判断是否有凹区间，获取这个区间的数据 -- cancel
        //-- update 修改方法为判断crossPoint点的space方向的limit值
        function getSac(crosspoint) {
            for (var i = 0; i < crosspoint.length; i++) {
                var c1 = crosspoint[i];
                var c2;
                var cIndex = i + 1;
                if (i < (crosspoint.length - 1)) {
                    c2 = crosspoint[i + 1];
                } else {
                    c2 = crosspoint[0];
                    cIndex = 0;
                }

                if (c1.point.x == c2.point.x) {//处于同一平行于y轴的直线上
                    if (c1.space_x == c2.space_x) {//x轴空白方向一致
                        if (c1.space_y != c2.space_y) {//y轴空白方向相反。形成凹区间
                            ////debugger;
                            if ((c1.space_y.indexOf("-") != -1 && c1.point.y > c2.point.y) || ((c2.space_y.indexOf("-") != -1 && c2.point.y > c1.point.y))) {
                            //update c1
                            crosspoint[i].limit_y = toFixed(Math.abs((Math.max(c1.point.y,c2.point.y)-Math.min(c1.point.y,c2.point.y))));
                            //update c2;
                            crosspoint[cIndex].limit_y =toFixed(Math.abs((Math.max(c1.point.y,c2.point.y)-Math.min(c1.point.y,c2.point.y))));
                            }
                        }
                    }
                }else if(c1.point.y == c2.point.y){
                    if(c1.space_y == c2.space_y){
                        if (c1.space_x != c2.space_x) {
                            ////debugger;
                            if ((c1.space_x.indexOf("-") != -1 && c1.point.x > c2.point.x) || (c2.space_x.indexOf("-") != -1 && c2.point.x > c1.point.x)) {
                                crosspoint[i].limit_x = toFixed(Math.abs((Math.max(c1.point.x,c2.point.x)-Math.min(c1.point.x,c2.point.x))));
                                crosspoint[cIndex].limit_x = toFixed(Math.abs((Math.max(c1.point.x,c2.point.x)-Math.min(c1.point.x,c2.point.x))));
                            }
                        }
                    }
                }
            }
            return crosspoint;
        }

        //转换border to baseline 数据
        function borderToBaseline(border) {
            var baselinelist = new Array();
            var topBorder = {
                space: "y",//y正方向空
                x: null,
                y: border.top.y,
                f: border.top.limit[0],//limit from
                t: border.top.limit[1],//limit to
                from: { x: border.top.limit[0], y: border.top.y }, //从左至右
                to: { x: border.top.limit[1], y: border.top.y },
                length: Math.abs(border.top.limit[1] - border.top.limit[0]),
            };
            baselinelist.push(topBorder);
            var rightBorder = {
                space: "x",//x正方向空
                x: border.right.x,
                y: null,
                f: border.right.limit[0],//limit from
                t: border.right.limit[1],//limit to
                from: { x: border.right.x, y: border.right.limit[1] },//从上到下
                to: { x: border.right.x, y: border.right.limit[0] },
                length: Math.abs(border.right.limit[1] - border.right.limit[0]),
            };
            baselinelist.push(rightBorder);
            var bottomBorder = {
                space: "-y",//y负方向空
                x: null,
                y: border.bottom.y,
                f: border.bottom.limit[0],//limit from
                t: border.bottom.limit[1],//limit to
                from: { x: border.bottom.limit[1], y: border.bottom.y }, //从左至右
                to: { x: border.bottom.limit[0], y: border.bottom.y },
                length: Math.abs(border.bottom.limit[1] - border.bottom.limit[0]),
            };
            baselinelist.push(bottomBorder);
            var leftBorder = {
                space: "-x",//x负方向空
                x: border.left.x,
                y: null,
                f: border.left.limit[0],//limit from
                t: border.left.limit[1],//limit to
                from: { x: border.left.x, y: border.left.limit[0] },//从下到上
                to: { x: border.left.x, y: border.left.limit[1] },
                length: Math.abs(border.left.limit[1] - border.left.limit[0]),
            };
            baselinelist.push(leftBorder);
            return baselinelist;
        }

        //验证baseline是否正确，完全闭合区间
        function validateBaseline(baseline, place) {
            console.log("==> ValidateBaseline (" + place+")");
            if ((baseline.length < 4) || (baseline.length % 2 != 0)) {
                throw "invalid baseline & place="+place;
                return false;
            }
            baseline.each(function (b, i) {
                var start = this[0];
                var prev = null;
                if (i == 0) {
                    start = b;
                    prev = this[this.length - 1];
                    if (prev.to.x != start.from.x || prev.to.y != start.from.y) {
                        throw ("baseline data error, not close area & place=" + place);
                        return false;
                    }
                } else {
                    prev = this[i - 1];
                    if (prev.to.x != b.from.x || prev.to.y != b.from.y) {
                        throw ("baseline data error, not close area & place=" + place);
                        return false;
                    }
                }
                //判断f和t的值是否正确
                switch (b.space) {
                    case "x":
                        if (intCompare(b.f,b.to.y)) {
                            throw "b.f!=b.from.y & place=" + place
                        }
                        if (intCompare(b.t,b.from.y)) {
                            throw "b.t != b.to.y & place=" + place
                        }
                        break;
                    case "-x":
                        if (intCompare(b.f,b.from.y)) {
                            throw "b.f!=b.from.y & place=" + place
                        }
                        if (intCompare(b.t,b.to.y)) {
                            throw "b.t != b.to.y & place=" + place
                        }
                        break;
                    case "y":
                        if (intCompare(b.f,b.from.x)) {
                            throw "b.f!=b.from.y & place=" + place
                        }
                        if (intCompare(b.t,b.to.x)) {
                            throw "b.t != b.to.y & place=" + place
                        }
                        break;
                    case "-y":
                        if (intCompare(b.f,b.to.x)) {
                            throw "b.f!=b.from.y & place=" + place
                        }
                        if (intCompare(b.t,b.from.x)) {
                            throw "b.t != b.to.y & place=" + place
                        }
                        break;
                }

                function intCompare(n1, n2) {
                    return (parseInt(n1) != parseInt(n2));
                }

                if (b.length === 0) {
                    console.log("lineLength=" + b.length + " from.x=" + b.from.x + " from.y=" + b.from.y + " to.x=" + b.to.x + " to.y=" + b.to.y + " & place=" + place);
                }
            });
            return true;
        }
        
        //选取baseline的最后一个baseline的to值 == baseline.from的值，然后push到baseline中
        function connectBaseline(container, baseline) {
            var last = container[container.length - 1];
            var match = null;
            if (baseline.length > 1) {
                for (var i = 0; i < baseline.length; i++) {
                    var b = baseline[i];
                    if (last.to.x == b.from.x && last.to.y == b.from.y) {
                        if (!match) {
                            match = baseline.getIndex(i);
                        } else {
                            throw Exception;
                        }
                    }
                }
                if (match) {
                    container.push(match);
                } 

            } else if (baseline.length == 1) {
                var first = container[0];
                var b = baseline[0];
                if (b.to.x == first.from.x && b.to.y == first.from.y) {
                    container.push(baseline.getIndex(0));
                    return container;
                } 
            }
            if (baseline.length > 0) {
                return connectBaseline(container, baseline);
            }
        }
        
        //移除链接后为同一直线的baseline
        function mergeExtraBaseline(baseline) {
            var newLine = new Array();
            for (var i = 0; i < baseline.length; i++) {
                var b1 = baseline[i];
                var bIndex;
                if (i < baseline.length - 1) {
                    bIndex = i + 1;
                } else {
                    bIndex = 0;
                }
                var b2 = baseline[bIndex];
                if (b1.space == b2.space && b1.x == b2.x && b1.y == b2.y) {
                    b2 = baseline.getIndex(bIndex);
                    b1.f = Math.min(b1.f, b2.f);
                    b1.t = Math.max(b1.t, b2.t);
                    b1.to = b2.to;
                    b1.length += b2.length;
                    if (bIndex == 0) {
                        //当最后一个被merge的时候即合并了第一条baseline，去除newLine中的first baseline;
                        newLine.getIndex(0);
                    }
                }
                
                newLine.push(b1);
            }
            return newLine;
        }
    },
    watchPosition: function () {
        var container = $("#Section3 .section-container");
        container.css({
            "overflow": "visible",
        })
        var enter = false;
        var down = false;
        container.unbind("mouseenter").bind("mouseenter", function (e) {
            console.log("x=" + e.offsetX + " y=" + e.offsetY);
            enter = true;
        }).unbind("mouseleave").bind("mouseleave", function () {
            enter = false;
        }).unbind("mousedown").bind("mousedown", function () {
            down = true;
        }).unbind("mouseup").bind("mouseup", function () {
            down = false;
        })
        $(document).unbind("mousemove").bind("mousemove", function (e) {
            if (enter) {
                var mousePos = {
                    x: e.pageX,
                    y: e.pageY,
                }
                
                
                //相对偏移坐标量
                var moveAxis = {
                    x: mousePos.x * AlbumWall.Axis.width_scale - AlbumWall.Axis.origin.x,
                    y: mousePos.y * AlbumWall.Axis.height_scale - AlbumWall.Axis.origin.y,
                }

                //绝对偏移量 //+换算相对相反位移 //+超出缩放比例AlbumWall.Axis.scale
                var actualMove = {
                    x: -moveAxis.x / AlbumWall.Axis.width_scale / AlbumWall.Axis.scale,
                    y: -moveAxis.y / AlbumWall.Axis.height_scale / AlbumWall.Axis.scale,
                }

                //console.log("actualMove x=" + actualMove.x + " y=" + actualMove.y);

                var target = AlbumWall.Wall.target;
                target.css({
                    "-webkit-transform": "translate3d("+actualMove.x+"px,"+actualMove.y+"px,"+0+"px)",
                })
                /*
                var albumWidth = album.image.axis_width / AlbumWall.Axis.width_scale * AlbumWall.Axis.scale;
                var albumHeight = album.image.axis_height / AlbumWall.Axis.height_scale * AlbumWall.Axis.scale;
                var borderWidth = AlbumWall.Setting.BorderWidth * AlbumWall.Axis.width_scale * AlbumWall.Axis.scale;
                var borderHeight = AlbumWall.Setting.BorderWidth * AlbumWall.Axis.height_scale * AlbumWall.Axis.scale;

                //AlbumWall.Axis.margin_top     使排列后的图片整体剧中的偏移值 top
                //AlbumWall.Axis.margin_left    同上  便宜值 left

                var albumTop = ((AlbumWall.Axis.origin.y - album.image.axis.location.y + AlbumWall.Axis.margin_top) * AlbumWall.Axis.scale + (1 - AlbumWall.Axis.scale) / 2 * AlbumWall.Axis.width) / AlbumWall.Axis.height_scale + (1 - AlbumWall.Axis.custome_heightScale) / 2 * AlbumWall.Axis.width;
                var albumLeft = ((album.image.axis.location.x + AlbumWall.Axis.origin.x - AlbumWall.Axis.margin_left) * AlbumWall.Axis.scale + (1 - AlbumWall.Axis.scale) / 2 * AlbumWall.Axis.height) / AlbumWall.Axis.width_scale + (1 - AlbumWall.Axis.custome_widthScale) / 2 * AlbumWall.Axis.height;

                //主要修改数据
                //album.image.axis.location.x   计算后的位于坐标轴的x值
                //album.image.axis.location.y   同上  坐标轴的y值

                //AlbumWall.Axis.origin.y   坐标轴中点 y 坐标
                //AlbumWall.Axis.origin.x   坐标轴中点 x 坐标

                //Considering 修改坐标原点坐标还是图片坐标？
                //通过修改Album的Container的3D坐标里移动图片整体，scale来修改比例

                //获取mousemove位于Container的位置
                //AlbumWall.Axis.width_scale使用来换算获取位于坐标轴的位置
                */

            }
        })
    }
};

    //获取数组中的index元素对象并且从原数组中移除
Array.prototype.getIndex = function (index) {
    return this.splice(index, 1)[0];
};

//将一个数组push进另一个数组
Array.prototype.pushArray = function (array) {
    if (isArray(array)) {
        array.each(function (a, i, target) {
            target.push(a);
        }, this);
    } else {
        throw ("pushArray param error");
    }
};


