// Trying out things

const golden = 1.618
let states = [Math.random(), 0.30, 0.90]

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
  case 0: r = v, g = t, b = p; break;
  case 1: r = q, g = v, b = p; break;
  case 2: r = p, g = v, b = t; break;
  case 3: r = p, g = q, b = v; break;
  case 4: r = t, g = p, b = v; break;
  case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}

let colors = states => hsvToRgb(...states)
let img

function setup() {
  let canvas = createCanvas(720, 400)
  canvas.parent('example')
  img = loadImage('/scripts/posts/colors/images.jpg')
}

let x

function draw() {
  // states[0] = (states[0] + 0.618) % 1
  // fill(...colors(states))
  // stroke(255)
  // strokeWeight(2)
  x = 70
  image(img, mouseX, mouseY, 200, 90);
  // ellipse(mouseX, mouseY, x, x)
}
