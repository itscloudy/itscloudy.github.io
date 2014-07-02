// Gets the browser prefix
var browserPrefix;
navigator.sayswho = (function () {
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    M = M[0];
    if (M == "Chrome") { browserPrefix = "webkit"; }
    if (M == "Firefox") { browserPrefix = "moz"; }
    if (M == "Safari") { browserPrefix = "webkit"; }
    if (M == "MSIE") { browserPrefix = "ms"; }
})();

var Radar = {
    Container: new Array(),
    Hour: {
        target: null,
        rotate: 0,
    },
    Minute: {
        target: $("#RadarMinuteContainer"),
        rotate: null,
    },
    Setting: {
        durgingtime: 3,
    },
    Init: function (container) {
        if (!container) {
            throw "container can't not be none";
        } else {
            //debugger;
            if (this.Container.containsDom(container)) {
                console.log("Radar resize");
                return;
            } else {
                this.Container.push(container);
                console.log("Radar Init");
            }
        }
        var containerSize = Resize.getSize(container);

        var sizeR = 300;
        var radarTime = $("<div id='RadarTime'></div>");
        radarTime.css({
            "top": "50%",
            "margin-top": "-"+sizeR+"px",
        });
        container.append(radarTime);
        var filterBar = $("<div id='FilterBar'><div id='lightline'></div></div>");
        radarTime.append(filterBar);

        var svgns = "http://www.w3.org/2000/svg";
        var marginLength = 10;
        var radarDial = document.createElementNS(svgns, "svg");
        radarDial.setAttribute("id", "RadarDial");
        radarDial.setAttribute("width", sizeR * 2);
        radarDial.setAttribute("height", sizeR * 2);
        radarTime.append(radarDial);
        var circleNumber = 6;
        var circleMarginR = sizeR / 6 ;//1为line宽度
        for (var i = 0; i < circleNumber; i++) {
            var circle = document.createElementNS(svgns, "circle");
            circle.setAttribute("cx", sizeR);
            circle.setAttribute("cy", sizeR);
            circle.setAttribute("r", (circleMarginR - 1) + i * circleMarginR - marginLength);
            radarDial.appendChild(circle);
        }
        //中间分割线，过圆心
        var crossLineNumber = 6;
        var crossLine_unitAngle = 360 / 2 / crossLineNumber;
        for (var i = 0; i < 6; i++) {
            var line = document.createElementNS(svgns, "line");
            var angle = crossLine_unitAngle * i;
            var cosScaleV = cosScale(angle);
            var sinScaleV = sinScale(angle);
            var from = {
                x:sizeR + sizeR * sinScaleV,
                y: sizeR + sizeR * cosScaleV,
            };
            var to = {
                x: sizeR + (-sizeR) * sinScaleV,
                y: sizeR + (-sizeR) * cosScaleV,
            };
            line.setAttribute("x1", from.x);
            line.setAttribute("y1", from.y);
            line.setAttribute("x2", to.x);
            line.setAttribute("y2", to.y);
            radarDial.appendChild(line);
        }
        
        var radarMinuteContainer = $("<span id='RadarMinuteContainer'></span>");
        var radarMinute = $("<span id='RadarMinute'></span>");
        radarMinuteContainer.append(radarMinute);

        var radarHourContainer = $("<span id='RadarHourContainer'></span>");
        var radarHour = $("<span id='RadarHour'></span>");
        radarHourContainer.append(radarHour);

        var hourIcon = document.createElementNS(svgns, "svg");
        hourIcon.setAttribute("width", "24");
        hourIcon.setAttribute("height", "24");
        radarHour.append(hourIcon);

        var hourPath = document.createElementNS(svgns, "path");
        hourPath.setAttribute("d", "M 3 0 L 24 12 L 3 24");
        hourPath.setAttribute("style", "fill:lightgreen;");
        hourIcon.appendChild(hourPath);

        var minuteIcon = document.createElementNS(svgns, "svg");
        minuteIcon.setAttribute("width", "18");
        minuteIcon.setAttribute("height", "18");
        radarMinute.append(minuteIcon);

        var minutePath = document.createElementNS(svgns, "path");
        minutePath.setAttribute("d", "M 2.5 0 L 18 9 L 2.5 18");
        minutePath.setAttribute("style", "fill:lightgreen;");
        minuteIcon.appendChild(minutePath);

        radarTime.append(radarMinuteContainer).append(radarHourContainer);
        
        
        //sizeR原点,r内半径长度,length线段长度,angle角度，container容器
        function drawTimeMarkLine(sizeR, r, length, angle,className, container) {
            for (var i = 0; i < (360 / angle); i++) {
                var line = document.createElementNS(svgns, "line");
                var currentAngle = angle * i;
                var cosScaleV = cosScale(currentAngle);
                var sinScaleV = sinScale(currentAngle);
                var from = {
                    x: sizeR + r * sinScaleV,
                    y: sizeR + r * cosScaleV,
                };
                var to = {
                    x: sizeR + (r + length) * sinScaleV,
                    y: sizeR + (r + length) * cosScaleV,
                };
                line.setAttribute("class", className);
                line.setAttribute("x1", from.x);
                line.setAttribute("y1", from.y);
                line.setAttribute("x2", to.x);
                line.setAttribute("y2", to.y);

                container.appendChild(line);
            }
        }
        function drawTimeMarkText(sizeR, r, angle, className, container) {
            for (var i = 0; i < (360 / angle) ; i++) {
                var text = document.createElementNS(svgns, "text");
                var currentAngle = angle * i;
                /*var from = {
                    x: sizeR + r * sinScaleV,
                    y: sizeR - (r) * cosScaleV,
                };
                */
                //line.setAttribute("class", className);
                text.setAttribute("x", sizeR);
                text.setAttribute("y", sizeR-r);
                text.setAttribute("fill", "lightgreen");
                if (i) {
                    var textNode;
                    if (i < 10) {
                        textNode = document.createTextNode("0"+i);
                    } else {
                        textNode = document.createTextNode(i);
                    }
                    
                    text.appendChild(textNode);
                } else {
                    var textNode = document.createTextNode(12);
                    text.appendChild(textNode);
                }
                //rotate(deg, cx, cy)!
                
                currentAngle = (currentAngle - 2);
                text.setAttribute("transform", "rotate(" + currentAngle + "," + sizeR + "," + sizeR + ")");
                text.setAttribute("class", className);
                container.appendChild(text);
            }
        }

        
        var hourLength = 20;
        //小时刻度
        drawTimeMarkLine(sizeR, sizeR-hourLength, hourLength, 30, "hourmarkline", radarDial);
        //分钟刻度
        var minuteLength = 10;
        drawTimeMarkLine(sizeR, sizeR-(hourLength), minuteLength, 6, "minutemarkline", radarDial);
        //内圈刻度1
        drawTimeMarkLine(sizeR, sizeR / 3 - (hourLength / 2) - marginLength, hourLength, 30, "hourmarkline", radarDial);
        //内圈刻度2
        drawTimeMarkLine(sizeR, sizeR / 3 * 2 - (hourLength - minuteLength) - marginLength, hourLength, 30, "hourmarkline", radarDial);

        var textLength = 20;
        drawTimeMarkText(sizeR, sizeR - hourLength - textLength - marginLength, 360 / 12, "normaltext", radarDial);

        Radar.Hour.target = $(radarHourContainer);
        Radar.Minute.target = $(radarMinuteContainer);
    
        var duringTime = Radar.Setting.durgingtime;//second秒
        var timeout = 0;
        function showHour() {
            var time = Math.floor(Radar.Hour.rotate * (duringTime * 1000) / 360);
            //console.log(timeout++ + " time:" + time);
            setTimeout(function () {
                Radar.Hour.target.css("opacity", 1);
                setTimeout(function () {
                    Radar.Hour.target.css("opacity", 0);
                }, 2500);
            }, time);
        }
        function showMinute() {
            var time = Math.floor(Radar.Minute.rotate * (duringTime * 1000) / 360);
            //console.log(timeout++ + " time:" + time);
            setTimeout(function () {
                //console.log("run");
                Radar.Minute.target.css("opacity", 1);
                setTimeout(function () {
                    Radar.Minute.target.css("opacity", 0);
                }, 2500);
            }, time);
        }

        function nowTime() {
            var now = new Date();
            Radar.Hour.rotate = parseInt((now.getHours()) % 12 * 360 / 12 + parseInt((now.getMinutes() / 60) * 30));
            Radar.Minute.rotate = parseInt(now.getMinutes() * 360 / 60);
            //console.log("now" + now.toDateString());
            Radar.Hour.target.css({
                "-webkit-transform": "rotate(" + (Radar.Hour.rotate - 90) + "deg)",
            });
            Radar.Minute.target.css({
                "-webkit-transform": "rotate(" + (Radar.Minute.rotate - 90) + "deg)",
            });
            //debuggerdebugger;
            showHour();
            showMinute();
            
        }

        filterBar.bind("webkitAnimationStart", function () {
            nowTime();
        }).bind("webkitAnimationIteration", function () {
            nowTime();
        }).bind("webkitAnimationEnd", function () {
        });
    
        //angle [0~360]
        function cosScale(angle) {
            angle = angle / 180 * Math.PI;
            return parseFloat((new Number(Math.cos(angle))).toFixed(4));
        }
        function sinScale(angle) {
            angle = angle / 180 * Math.PI;
            return parseFloat((new Number(Math.sin(angle))).toFixed(4));
        }
    }
};


//radaTimeInterval();



/*
  // NOTE: The change to red signifies the start of
  // the animation

// Allows elements to be accessed in a clean way
var circle = document.getElementById('circle'), 
  button = document.getElementById('button');

// Gets element to show current percentage
var result = document.getElementById('result'),
    // Current position of circle around its path in percent in reference to the original
    totalCurrentPercent = 0,
    // Percent of circle around its path in percent in reference to the latest origin
    currentPercent = 0;

// Updates the percent change from the latest origin
var showPercent = window.setInterval(function() {
    if(currentPercent < 100)
    {
        currentPercent += 1;
    }
    else {
        currentPercent = 0;
    }
    result.innerHTML = currentPercent;
}, 39); // Runs at a rate based on the animation's duration (milliseconds / 100)

// Checks to see if the specified rule is within any of the stylesheets found in the document;
// returns the animation object if so
function findKeyframesRule(rule) {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; ++i) {
        for (var j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule) { return ss[i].cssRules[j]; }
        }
    }
    return null;
}

// Replaces the animation based on the percent when activated and other hard coded specifications
function change(anim) {
    // Obtains the animation object of the specified animation
    var keyframes = findKeyframesRule(anim),
        length = keyframes.cssRules.length;

    // Makes an array of the current percent values in the animation
    var keyframeString = [];  
    for(var i = 0; i < length; i ++)
    {
        keyframeString.push(keyframes[i].keyText);
    }

    // Removes all the % values from the array so the getClosest function can perform calculations
    var keys = keyframeString.map(function(str) {
        return str.replace('%', '');
    });

    // Updates the current position of the circle to be used in the calculations
    totalCurrentPercent += currentPercent;
    if(totalCurrentPercent > 100)
    {
        totalCurrentPercent -= 100;
    }
    // Self explanatory variables if you read the description of getClosest
    var closest = getClosest(keys);

    var position = keys.indexOf(closest), 
        firstPercent = keys[position];

    // Removes the current rules of the specified animation
    for(var i = 0, j = keyframeString.length; i < j; i ++)
    {
        keyframes.deleteRule(keyframeString[i]);
    }

    // Turns the percent when activated into the corresponding degree of a circle
    var multiplier = firstPercent * 3.6;

    // Essentially this creates the rules to set a new origin for the path based on the approximated
    // percent of the animation when activated and increases the diameter of the new circular path
    keyframes.insertRule("0% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 0) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 0) + "deg); background-color:red; }");
    keyframes.insertRule("13% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 45) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 45) + "deg); }");
    keyframes.insertRule("25% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 90) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 90) + "deg); }");
    keyframes.insertRule("38% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 135) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 135) + "deg); }");
    keyframes.insertRule("50% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 180) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 180) + "deg); }");
    keyframes.insertRule("63% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 225) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 225) + "deg); }");
    keyframes.insertRule("75% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 270) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 270) + "deg); }");
    keyframes.insertRule("88% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 315) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 315) + "deg); }");
    keyframes.insertRule("100% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 360) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 360) + "deg); }");

    // Shows the circle again
    circle.style.display = "inherit";
    // Sets the animation to the newly specified rules
    circle.style.webkitAnimationName = anim; 

    // Resets the approximate animation percent counter
    window.clearInterval(showPercent);
    currentPercent = 0;
    showPercent = self.setInterval(function() {
        if(currentPercent < 100)
        {
            currentPercent += 1;
        }
        else {
            currentPercent = 0;
        }
        result.innerHTML = currentPercent;
    }, 39); 
}

// Attatches the change function to the button's onclick function
button.onclick = function() {
    // Removes the animation so a new one can be set
    circle.style.webkitAnimationName = "none";
    // Temporarily hides the circle
    circle.style.display = "none";
    // Initializes change function
    setTimeout(function () { 
        change("rotate"); 
    }, 0);
}

// Gets the animation's closest % value based on the approximated % found below
function getClosest(keyframe) {
    var curr = keyframe[0];
    var diff = Math.abs (totalCurrentPercent - curr);
    for (var val = 0, j = keyframe.length; val < j; val++) {
        var newdiff = Math.abs(totalCurrentPercent - keyframe[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = keyframe[val];
        }
    }
    return curr;
}

// Check out http://zachsaucier.com/ for more of my projects
//@ sourceURL=pen.js

*/