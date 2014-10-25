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
    this.color = this.o.color || 'deeppink';
    this.p = 0; // used to animate delta
    if (!this.ctx) { console.error('no context, aborting'); return}
    this.getFlickBounds()
    this.delta = this.getDelta();
  };

  Ember.prototype.draw = function Draw(){
    this.ctx.beginPath();
    this.ctx.moveTo(250*PX, 300*PX);
    var topX = this.top.x+(this.p*this.delta.x);
    var topY = this.top.y+(this.p*this.delta.y);
    this.ctx.lineTo(topX*PX, topY*PX);
    this.ctx.lineTo(350*PX, 300*PX);
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
    var flickRadius = 10*PX; // !!hardCode!!

    this.flickCenter = flickCenter;
    this.flickRadius = flickRadius;
  }
  
  Ember.prototype.getDelta = function(){
    var angle = rand(0,360);
    var newTop = {
      x: this.flickCenter.x + Math.cos(angle*DEG)*.5*this.flickRadius,
      y: this.flickCenter.y + Math.sin(angle*DEG)*1.5*this.flickRadius
    }
    // console.log(newTop);
    var delta = {
      x: newTop.x - this.top.x,
      y: newTop.y - this.top.y
    }
    return delta;
  }

  var ember = new Ember({
      ctx: ctx,
      sensivity: .15,
      color: 'rgba(255,20,147,0.5)',
      top: { x: 275, y: 100 }
    });

  var ember2 = new Ember({
      ctx: ctx,
      sensivity: .15,
      color: 'rgba(155,20,147,0.5)',
      top: { x: 325, y: 150 }
    });

  var ember3 = new Ember({
      ctx: ctx,
      sensivity: .1,
      color: 'rgba(55,120,147,0.5)',
      top: { x: 300, y: 50 }
    });
  
  // LOOP
  var loop = function loop(){
    ctx.clearRect(0,0,1200,1200)
    ember.draw();
    ember2.draw();
    ember3.draw();
    requestAnimationFrame(loop)
  };
  loop();




})()