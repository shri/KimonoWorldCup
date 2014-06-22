function getBase64Image(URL) {
    var img = new Image();
    img.src = URL.src;
    img.crossOrigin = 'Anonymous';
    canvas.style.display="none";
    document.getElementById("country").innerHTML = URL.id;
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        startColor(canvas.toDataURL("image/jpg"));
    }
        
}

function startColor(imgSrc)
    {
        var rgb = getAverageRGB(imgSrc);
        var hexValue = rgbToHex(rgb.r,rgb.g,rgb.b)
        document.getElementById("hexval").innerHTML = hexValue ;
        document.body.style.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
	}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getAverageRGB(imgI) {
        var imgEl = new Image();
        imgEl.src = imgI; //base64 files need to be put into .src not the actualy img
        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {
                r: 0,
                g: 0,
                b: 0
            }, // for non-supporting envs
            //canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {
                r: 0,
                g: 0,
                b: 0
            },
            count = 0;

        if (!context) {
            return defaultRGB;
        }
    
        height = canvas.height
        width = canvas.width
        
        try {
            //alert(data)
            data = context.getImageData(0, 0, width, height);
            } catch (e) {
            /* security error, img on diff domain */
            alert('Security Error!');
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
        rgb.r = ~~ (rgb.r / count);
        rgb.g = ~~ (rgb.g / count);
        rgb.b = ~~ (rgb.b / count);

        return rgb;
    }


