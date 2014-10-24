;(function(undefined){

  // SYS
  PX = 2
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
    this.p = 0; // used to animate delta
    if (!this.ctx) { console.error('no context, aborting'); return}
    this.getFlickBounds()
    this.delta = this.getDelta();
  };

  Ember.prototype.draw = function Draw(){
    this.ctx.clearRect(0,0,1200,1200)
    this.ctx.beginPath();
    this.ctx.moveTo(200*PX, 300*PX);
    var topX = this.top.x+(this.p*this.delta.x);
    var topY = this.top.y+(this.p*this.delta.y);
    this.ctx.lineTo(topX*PX, topY*PX);
    this.ctx.lineTo(400*PX, 300*PX);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgba(255,20,147,0.5)';
    this.ctx.fill();

    this.p += .2;
    if (this.p >= 1) {
      this.top.x = topX;
      this.top.y = topY;
      this.delta = this.getDelta();
      this.p = 0;
    }

    this.drawFlickBounds()
  };

  Ember.prototype.drawFlickBounds = function drawFlickBounds(){
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
    var flickRadius = 50*PX; // !!hardCode!!

    this.flickCenter = flickCenter;
    this.flickRadius = flickRadius;
  }
  
  Ember.prototype.getDelta = function(){
    var newTop = {
      x: this.top.x + rand(-10,10),
      y: this.top.y + rand(-50,50)
    }

    var delta = {
      x: this.top.x - newTop.x,
      y: this.top.y - newTop.y
    }
    return delta;
  }


  var ember = new Ember({
      ctx: ctx,
      top: { x: 250, y: 100 }
    });
  
  // LOOP
  var loop = function loop(){
    ember.draw();
    requestAnimationFrame(loop)
  };
  loop();






})()