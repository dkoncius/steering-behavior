var font;
var vehicles = [];

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf')
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(51);
  // textFont(font);
  // textSize(128);
  // fill(255);
  // text("David", 100, 200);

  var points = font.textToPoints("Jūratėlei", windowWidth/7, windowHeight/2, windowWidth/5.5);

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y);
    vehicles.push(vehicle);
    // stroke(255);
    // strokeWeight(8);
    // point(pt.x, pt.y);
  }
}

function draw(){
  background(51);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
}
