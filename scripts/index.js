let COLORS = [];

/* URL params:
    c=[hex]
*/
const urlParams = new URLSearchParams(window.location.search);
urlParams.getAll("c").forEach(hex => {
    COLORS.push(new ColorSelector(hexToRgb("#"+hex)));
});
if (COLORS.length == 0) {
    COLORS = [
        new ColorSelector([0,255,255]),
        new ColorSelector([204,0,255]),
    ];
}

$(document).ready(function() {
    // Setup selectors
    $("#adder")
        .addClass("selector")
        .on("click", () => {
            let selector = new ColorSelector(HSVtoRGB(Math.random(), 1, 1));
            COLORS.push(selector);
            $(selector.dom).insertBefore($("#adder"));
            draw();
            updateCode();
        });
    for (let i = 0; i < COLORS.length; i++) {
        $(COLORS[i].dom).insertBefore($("#adder"));
    }

    // Menu
    Menu.setup();
    COLORS[0].dom.click();

    // Code block
    updateCode(LANG.JS_ARRAY);

    // Lang options
    let select = $("#lang");
    for (const [key, value] of Object.entries(LANG)) {
        select.append($(`<option value="${key}">${LANG_NAME[key]}</option>`));
    }
    select.on("change", function() {
        lang = LANG[this.value];
        updateCode();
    });

    // Copy btn
    $("#copy").on("click", () => {
        copyToClipboard($("#code").text());
        $("#copy").children(":first")
            .attr("src", "./resources/checkmark.png")
            .css("filter", "invert()");
        $("#copy").css("background-color", "var(--dark-color)");
        setTimeout(() => {
            $("#copy").children(":first")
                .attr("src", "./resources/copy.png")
                .removeAttr("style");
            $("#copy").removeAttr("style");
        }, 500);
    });

    // Share btn
    $("#share").on("click", () => {
        let link = window.location.href + "?" + genURLParams();
        
        // Copy
        copyToClipboard(link);

        // Display msg
        $("#share").children(":first")
            .text("Coppied!")
            .css("color", "hsl(130, 100%, 50%)");
        $("#share").css("background-color", "var(--dark-color)");
        setTimeout(() => {
            $("#share").children(":first")
                .text("Share link")
                .removeAttr("style");
            $("#share").removeAttr("style");
        }, 500);
    });
});

// Misc functions
function copyToClipboard(str) {
    let el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function genURLParams() {
    let url = "";
    let grad = getGradient();
    for (let i = 0; i < grad.length; i++) {
        url += `c=${rgbToHex(grad[i])}` + ((i < grad.length-1) ? "&" : "");
    }
    return url;
}

const LANG = {
    JS_ARRAY: 0,
    JS_OBJ: 10,
    CSS_GRAD: 20,
    JAVA_ARRAY: 30,
    JAVA_COLOR: 40,
    CPP_ARRAY: 50,
};
const LANG_NAME = {
    JS_ARRAY: "JS 2D array",
    JS_OBJ: "JS object array",
    CSS_GRAD: "CSS gradient",
    JAVA_ARRAY: "Java 2D array",
    JAVA_COLOR: "Java 'Color' objects",
    CPP_ARRAY: "C/C++ 2D array",
};
let lang = LANG.JS_ARRAY;
function updateCode() {
    let text = " ";
    let grad = getGradient();
    if (lang === LANG.JS_ARRAY) {
        text = "let gradient = [\n";
        for (let i = 0; i < grad.length; i++) {
            text += `\t[${grad[i][0]}, ${grad[i][1]}, ${grad[i][2]}]` + ((i < grad.length-1) ? "," : "") + "\n";
        }
        text += "];"
    } else if (lang === LANG.JS_OBJ) {
        text = "let gradient = [\n";
        for (let i = 0; i < grad.length; i++) {
            text += `\t{r: ${grad[i][0]}, g: ${grad[i][1]}, b: ${grad[i][2]}}` + ((i < grad.length-1) ? "," : "") + "\n";
        }
        text += "];"
    } else if (lang === LANG.CSS_GRAD) {
        text = "linear-gradient(";
        for (let i = 0; i < grad.length; i++) {
            text += `rgb(${grad[i][0]}, ${grad[i][1]}, ${grad[i][2]})` + ((i < grad.length-1) ? ", " : "");
        }
        text += ");"
    } else if (lang === LANG.JAVA_ARRAY) {
        text = "int[][] gradient = {\n";
        for (let i = 0; i < grad.length; i++) {
            text += `\t{${grad[i][0]}, ${grad[i][1]}, ${grad[i][2]}}` + ((i < grad.length-1) ? "," : "") + "\n";
        }
        text += "};"
    } else if (lang === LANG.JAVA_COLOR) {
        text = "Color[] gradient = {\n";
        for (let i = 0; i < grad.length; i++) {
            text += `\tnew Color(${grad[i][0]}, ${grad[i][1]}, ${grad[i][2]})` + ((i < grad.length-1) ? "," : "") + "\n";
        }
        text += "};"
    } else if (lang === LANG.CPP_ARRAY) {
        text = `int gradient[${grad.length}][3] = {\n`;
        for (let i = 0; i < grad.length; i++) {
            text += `\t{${grad[i][0]}, ${grad[i][1]}, ${grad[i][2]}}` + ((i < grad.length-1) ? "," : "") + "\n";
        }
        text += "};"
    }
    $("#code").text(text);


}

function getGradient() {
    let grad = [];
    COLORS.forEach(color => grad.push(color.rgb));
    return grad;
}

window.onload = () => {
    $("body").removeClass("fade");
};

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
}

function rgbToHex(rgb) {
    return ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [h, s, v];
}
