;(function(undefined){
  
  PX = 2

  // EMBER CLASS
  var Ember = function Ember(o){
    this.o = o || {};
    this.ctx = this.o.ctx;
    if (!this.ctx) { console.error('no context, aborting'); return}
  };

  Ember.prototype.draw = function(){

    this.ctx.beginPath();
    this.ctx.moveTo(200*PX, 400*PX);
    this.ctx.lineTo(300*PX, 200*PX);
    this.ctx.lineTo(400*PX, 400*PX);
    this.ctx.closePath()
    this.ctx.lineWidth = PX;
    this.ctx.stroke()
    
  };

  // SYS
  var canvas  = document.getElementById('js-canvas');
  var ctx     = canvas.getContext('2d');
  var ember = new Ember({ ctx: ctx });
  ember.draw();









})()