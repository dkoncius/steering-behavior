function Vehicle(x, y){
  this.pos = createVector(random(width), random(height)); // position
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D(); // velocity - greitis
  this.acc = createVector(); // acceleration
  this.maxspeed = 10;
  this.maxforce = 1;
}

Vehicle.prototype.behaviors = function(){
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.applyForce = function(f){
  this.acc.add(f);
}

Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos); // subtract
  var d = desired.mag(); // d - distance, mag - magnitude
  var speed = this.maxspeed;
  if(d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos); // subtract
  var d = desired.mag(); // mag - magnitude
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1); // mult = multiply
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Vehicle.prototype.update = function(){
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0); // multiply
}

Vehicle.prototype.show = function(){
  stroke(255);
  strokeWeight(8);
  point(this.pos.x, this.pos.y);
}
