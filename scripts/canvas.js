let canvas;

function setup() {
    canvas = createCanvas(0, 0);
    canvas.parent('canvas');
    canvas.style('display', 'block');

    windowResized();

    noLoop();
}

function windowResized() {
    let w = windowWidth * 0.9;
    let h = Math.max(windowWidth, windowHeight) * 0.1;
    resizeCanvas(w, h);
}

function draw() {
    let grad = getGradient();
    if (grad.length == 0) {
        strokeWeight(0);
        fill(color(0,0,0));
        rect(0, 0, width, height);
        return;
    }
    if (grad.length == 1) {
        strokeWeight(0);
        fill(color(grad[0][0],grad[0][1],grad[0][2]));
        rect(0, 0, width, height);
        return;
    }
    strokeWeight(2);
    for (let x = 0; x < width; x++) {
        stroke(gradient(grad, x / width));
        line(x, 0, x, height);
    }
}

function gradient(gradient, p) {
    p = constrain(p, 0, 1);
    let pScaled = p * (gradient.length-1.00001);
    let c = Math.floor(pScaled);
    p = pScaled - c;
    let r = gradient[c][0] * (1-p) + gradient[c+1][0] * p;
    let g = gradient[c][1] * (1-p) + gradient[c+1][1] * p;
    let b = gradient[c][2] * (1-p) + gradient[c+1][2] * p;
    return color(Math.round(r), Math.round(g), Math.round(b));
}
