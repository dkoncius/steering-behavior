1. Būtina pirmiau atlikti Intro žingsnį arba bent jau įsirašyti node.js ir mokėti pasileisti npm serverį per console.
2. Susikurti naują aplankalą Steering Behaviors -> Įsikelti Avenir font -> Susikurt index.html ir sketch.js
3. Susieti index.html su p5 cdn ir sketch.js:

<script language="javascript" type="text/javascript" src="https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.min.js"></script>
<script src="sketch.js"></script>

4. Susikurti teksto šabloną. Papildyti sketch.js:

var font;

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf')
}

function setup() {
  createCanvas(800,300);
  background(51);
  textFont(font);
  textSize(128);
  fill(255);
  text("David", 25, 200);
}

5. Surasti teksto ribas. Papildyti sketch.js -> setup():

var points = font.textToPoints("David", 25, 200);
console.log(points);

Atkreipti dėmesį, kad mums duoda x ir y pozicijų kordinates, kurias mes paversime taškais.

6. Paversti kordinates matomais taškais. Papildyti sketch.js -> setup():

for (var i = 0; i < points.length; i++) {
  var pt = points[i];
  stroke(0, 255, 0);
  strokeWeight(4);
  point(pt.x, pt.y);
}

7. Pridėti teksto dydį prie points kintamojo:

  var points = font.textToPoints("David", 25, 200, 192);

8. Ištrinti teksto šabloną ir pakoreguoti taškų stilių:

stroke(255);
strokeWeight(8);

9. Paversti nupieštus taškus objektais. Susikurti vehicle.js ir susieti su html:

<script src="vehicle.js"></script>

10. Papildyti vehicle.js:

function Vehicle(x, y){
  this.pos = createVector(x, y);
  this.target = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
}

Vehicle.prototype.update = function(){
  this.pos.add(this.vel);
  this.vel.add(this.acc);
}

Vehicle.prototype.show = function(){
  stroke(255);
  strokeWeight(8);
  point(this.pos.x, this.pos.y);
}

11. Pakoreguoti sketch.js. Ištrinti taškus ir vietoje jų į for loop pridėti:

var vehicle = new Vehicle(pt.x, pt.y);
vehicles.push(vehicle);

Tuomet, sukurti masyvą viršuje po var font į kurį pridėsime objektus su push:

var vehicles = [];


12. Tuomet, nupiešti foną ir visus taškus remiantis vehicles.js sukurtais objektais:

function draw(){
  background(51);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.update();
    v.show();
  }
}

13. Pademonstruoti, kad viskas veikia. Pakoreguoti vehicle.js:

this.vel = p5.Vector.random2D();

14. Padaryti, kad taškų objektai po truputi išjudėtų iš savo pozicijų. Papildyti vehicle.js:

 Vehicle(){
   this.maxspeed = 5;
   this.maxforce = 0.3;
 }

 Vehicle.prototype.behaviors = function(){
   var seek = this.seek(this.target);
   this.applyForce(seek);
 }

 Vehicle.prototype.applyForce = function(f){
   this.acc.add(f);
 }

 Vehicle.prototype.seek = function(target) {
   var desired = p5.Vector.sub(target, this.pos); // subtract
   desired.setMag(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.vel);
   steer.limit(this.maxforce);
   return steer;
 }

 Vehicle.prototype.update = function(){
   this.pos.add(this.vel);
   this.vel.add(this.acc);
   this.acc.mult(0); // multiply
 }

 15. Iškviesti behaviors funkciją per sketch.js:

 function draw(){
   for (var i = 0; i < vehicles.length; i++) {
     v.behaviors();
   }
 }

 16. Padaryti, kad visi taškų objektai sustotų į savo vieta. Eiti į vehicle.js -> Copy-paste  seek funkciją, o seną paversti komentaru. Tuomet, pakoreguoti naują seek funkciją:

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

 17. Tuomet, per vehicle.js pakoreguoti behaviors funkciją. Vietoje seek pakeisti į arrive:

 Vehicle.prototype.behaviors = function(){
   var arrive = this.arrive(this.target);
   this.applyForce(arrive);
 }

 18. Padaryti, kad iš toliau atsirastų taškų objektai. Pakoreguoti vehicle.js -> Vehicle() -> this.pos:

 this.pos = createVector(random(width), random(height));

 19. Pasidaryti aplankalo kopiją ir toliau kurti sename.
 20. Išimti seek iš komentarų ir pakoreguoti per vehicle.js:

 Vehicle.prototype.flee = function(target) {
   var desired = p5.Vector.sub(target, this.pos); // subtract
   desired.setMag(this.maxspeed);
   desired.mult(-1); // mult = multiply
   var steer = p5.Vector.sub(desired, this.vel);
   steer.limit(this.maxforce);
   return steer;
 }

 21.Tuomet, susieti flee funkciją su pelės pozicija per behaviors funkciją:

   var mouse = createVector(mouseX, mouseY);
   var flee = this.flee(mouse);
   this.applyForce(flee);

22. Sumažinti pėlės force. Pakoreguoti vehicles.js -> flee funkciją:

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

Paaiškinti, kad sąlygą tikriną taškų objektų atstumą nuo pėlės ir kai pasiekiamas tam tikras atstumas (magnitude), tuomet taškų objektai grįžta atgal.


23. Padidinti speed ir force. Pakoreguoti vehicle.js:

this.maxspeed = 10;
this.maxforce = 1;

24. Padaryti, kad flee force būtų žymiai didesne už arrive force. Papildyti vehicle.js:


Vehicle.prototype.behaviors = function(){
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
}

25. Savarankiška užduotis nr. 1. Padaryti, kad taškų objektai judėtų aplink kiekvieną raidę.
26. Savarankiška užduotis nr. 2. Sukurti, input, kuriame parašius žodį, taškų objektai sukurtų jo vizualizaciją.
