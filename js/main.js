;(function(undefined){

  // SYS
  var PX  = 2;
  var DEG = Math.PI/180;
  var canvas  = document.getElementById('js-canvas');
  var ctx     = canvas.getContext('2d');
  var rand = function Rand(min, max) {
    return Math.round(Math.random()*(max-min) + min);
  }

  // EMBER CLASS
  var Ember = function Ember(o){
    this.o = o || {};
    this.ctx = this.o.ctx;
    this.top = this.o.top;
    this.right = this.o.right;
    this.bottom = this.o.bottom;
    this.left = this.o.left;
    this.color = this.o.color || 'deeppink';
    this.flickRadius = this.o.flickRadius || 10;
    this.p = 0; // used to animate delta
    this.p2 = 0; // used to animate delta
    this.p2Step = .01
    if (!this.ctx) { console.error('no context, aborting'); return}
    this.getFlickBounds()
    this.delta = this.getDelta();
  };

  Ember.prototype.draw = function Draw(){
    this.ctx.beginPath();
    this.ctx.moveTo(this.left.x*PX, (this.left.y+this.p2*20)*PX);
    var topX = this.top.x+(this.p*this.delta.x);
    var topY = this.top.y+(this.p*this.delta.y);
    this.ctx.lineTo(topX*PX, topY*PX);
    this.ctx.lineTo((this.right.x)*PX, (this.right.y+this.p2*20)*PX);
    this.ctx.lineTo(this.bottom.x*PX, (this.bottom.y+this.p2*20)*PX);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    this.p += this.o.sensivity;
    if (this.p >= 1) {
      this.top.x = topX;
      this.top.y = topY;
      this.delta = this.getDelta();
      this.p = 0;
    }

    // this.p2 -= this.p2Step
    // if (this.p2 <= 0) {
    //   this.p2 = 1
    // }
    // if (this.p2 >= 1) {
    //   this.p2Step = -this.p2Step;
    // }
    // if (this.p2 <= 0) {
    //   this.p2Step = -this.p2Step;
    // }
    this.drawFlickBounds()
  };

  Ember.prototype.drawFlickBounds = function drawFlickBounds(){
    return;
    this.ctx.beginPath();
    this.ctx.arc(this.flickCenter.x*PX, this.flickCenter.y*PX, this.flickRadius, 0, 2*Math.PI);
    this.ctx.lineWidth = PX;
    this.ctx.stroke();
  }

  Ember.prototype.getFlickBounds = function GetFlickBounds(){
    var flickCenter = {
      x: this.top.x,
      y: this.top.y,
    }
    var flickRadius = this.flickRadius*PX;

    this.flickCenter = flickCenter;
    this.flickRadius = flickRadius;
  }
  
  Ember.prototype.getDelta = function(){
    var angle = rand(0,360);
    var newTop = {
      x: this.flickCenter.x + Math.cos(angle*DEG)*.05*this.flickRadius,
      y: this.flickCenter.y + Math.sin(angle*DEG)*1.5*this.flickRadius
    }
    // console.log(newTop);
    var delta = {
      x: newTop.x - this.top.x,
      y: newTop.y - this.top.y
    }
    return delta;
  }
  var embers = [];
  var ember1 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 10,
      color: '#ED8CBA',
      top:    { x: 280, y: 240 },
      right:  { x: 300, y: 410 },
      bottom: { x: 280, y: 438 },
      left:   { x: 232, y: 404 }
    });

  var ember11 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 20,
      color: '#ED8CBA',
      top:    { x: 280, y: 240 },
      right:  { x: 300, y: 410 },
      bottom: { x: 280, y: 438 },
      left:   { x: 232, y: 404 }
    });

  var ember2 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 20,
      color: '#E86CA9',
      top:    { x: 314, y: 130 },
      right:  { x: 364, y: 412 },
      bottom: { x: 310, y: 460 },
      left:   { x: 256, y: 420 }
    });

  var ember21 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 30,
      color: '#E86CA9',
      top:    { x: 314, y: 130 },
      right:  { x: 364, y: 412 },
      bottom: { x: 310, y: 460 },
      left:   { x: 256, y: 420 }
    });

  var ember3 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 10,
      color: '#A4D7F5',
      top:    { x: 330, y: 160 },
      right:  { x: 348, y: 388 },
      bottom: { x: 310, y: 460 },
      left:   { x: 280, y: 380 }
    });

  var ember31 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 20,
      color: '#A4D7F5',
      top:    { x: 330, y: 160 },
      right:  { x: 348, y: 388 },
      bottom: { x: 310, y: 460 },
      left:   { x: 280, y: 380 }
    });

  var ember4 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 10,
      color: '#F6D58A',
      top:    { x: 352, y: 252 },
      right:  { x: 376, y: 402 },
      bottom: { x: 328, y: 444 },
      left:   { x: 300, y: 410 }
    });

  var ember41 = new Ember({
      ctx: ctx,
      sensivity: .25,
      flickRadius: 20,
      color: '#F6D58A',
      top:    { x: 352, y: 252 },
      right:  { x: 376, y: 402 },
      bottom: { x: 328, y: 444 },
      left:   { x: 300, y: 410 }
    });

  embers.push(ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41);
  // embers.push(ember, ember2, ember3);
  ctx.globalCompositeOperation = 'multiply'


  drawBones = function drawBones() {
    ctx.lineWidth = 7*PX
    ctx.strokeStyle = '#80404B'
    // bone 1
    ctx.beginPath()
    ctx.moveTo(260*PX, 474*PX);
    ctx.lineTo(360*PX, 500*PX);
    ctx.stroke();
    // bone 2
    ctx.beginPath()
    ctx.moveTo(256*PX, 510*PX);
    ctx.lineTo(356*PX, 472*PX);
    ctx.stroke();
  }

  // LOOP
  var loop = function loop(){
    ctx.clearRect(0,0,1200,1200)
    
    for (var i = embers.length - 1; i >= 0; i--) {
      embers[i].draw()
    };
    drawBones()
    requestAnimationFrame(loop);
  };
  loop();




})()