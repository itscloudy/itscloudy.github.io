/**
* 使用Canvas API 提取图片颜色
*/
$().ready(function () {
    initCanvas();
});
var imageList = [
    "../sound/cover/supercell_gaobai.jpg",
    "../sound/cover/Daisy.jpg",
    "../sound/cover/guilty-crown-op-my-dearest.jpg",
    "../sound/cover/SilverSky.jpg",
    "../sound/cover/supercell_gaobai.jpg",
]
var currentIndex = 0;
function initCanvas() {
    //getImage("../sound/cover/SilverSky.jpg");
    getImage(imageList[currentIndex]);
}

$("#MainContainer").click(function () {
    ++currentIndex;
    currentIndex = currentIndex % imageList.length;
    getImage(imageList[currentIndex]);
});

function getImage(src) {

    var image = document.createElement("img");
    image.src = src;
    $(image).load(function () {
        var rgb = getAverageRGB(image);
        $("#MainContainer").css({
            "background": "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")",
        })
        function getAverageRGB(imgEl) {
            var blockSize = 5, // only visit every 5 pixels
            defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

            if (!context) {
                return defaultRGB;
            }

            height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
            width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

            context.drawImage(imgEl, 0, 0);

            try {
                data = context.getImageData(0, 0, width, height);
            } catch (e) {
                // security error, img on diff domain 
                return defaultRGB;
            }

            length = data.data.length;

            while ((i += blockSize * 4) < length) {
                ++count;
                rgb.r += data.data[i];
                rgb.g += data.data[i + 1];
                rgb.b += data.data[i + 2];
            }

            // ~~ used to floor values
            rgb.r = ~~(rgb.r / count);
            rgb.g = ~~(rgb.g / count);
            rgb.b = ~~(rgb.b / count);
            return rgb;
        }
    });
}

