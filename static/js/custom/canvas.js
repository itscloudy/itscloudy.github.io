	//TODO
/* 将图片转换为相应效果后输出 getDataUrl */
// Grayscale w canvas method
// 获取灰度图片
function grayscale(imgObj) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    //var imgObj = new Image();
    //imgObj.src = src;
    canvas.width = imgObj.naturalWidth;
    canvas.height = imgObj.naturalHeight;
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}


/* 通过canvas获取图片的主要颜色 */

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
        
        //去除透明像素
        if (!(data.data[i] == 0 && data.data[i + 1] == 0 && data.data[i + 2] == 0)) {
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
            ++count;
        }
        
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);
    return rgb;
}

