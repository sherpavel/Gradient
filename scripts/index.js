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
            // Menu.hide();
        });

    for (let i = 0; i < COLORS.length; i++) {
        $(COLORS[i].dom).insertBefore($("#adder"));
    }

    Menu.setup();
    COLORS[0].dom.click();
});


// Misc functions
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
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
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
