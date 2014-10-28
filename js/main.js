(function(undefined_) {
  var DEG, Draw, Ember, GetFlickBounds, PX, Rand, SendTop, animationLoop, canvas, ctx, drawBones, drawFlickBounds, ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41, embers, mc, rX, rY, rand;
  PX = 2;
  DEG = Math.PI / 180;
  canvas = document.getElementById("js-canvas");
  ctx = canvas.getContext("2d");
  rand = Rand = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  mc = new Hammer(canvas);
  Ember = Ember = function(o) {
    this.o = o || {};
    this.ctx = this.o.ctx;
    this.top = this.o.top;
    this.right = this.o.right;
    this.bottom = this.o.bottom;
    this.left = this.o.left;
    this.color = this.o.color || "deeppink";
    this.flickRadius = this.o.flickRadius || 10;
    this.p = 0;
    this.p2 = 0;
    this.p2Step = .01;
    if (!this.ctx) {
      console.error("no context, aborting");
      return;
    }
    this.getFlickBounds();
    this.delta = this.getDelta();
  };
  Ember.prototype.draw = Draw = function() {
    var topX, topY;
    this.ctx.beginPath();
    this.ctx.moveTo(this.left.x * PX, (this.left.y + this.p2 * 20) * PX);
    topX = this.top.x + (this.p * this.delta.x);
    topY = this.top.y + (this.p * this.delta.y);
    this.ctx.lineTo(topX * PX, topY * PX);
    this.ctx.lineTo(this.right.x * PX, (this.right.y + this.p2 * 20) * PX);
    this.ctx.lineTo(this.bottom.x * PX, (this.bottom.y + this.p2 * 20) * PX);
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
    this.drawFlickBounds();
  };
  Ember.prototype.drawFlickBounds = drawFlickBounds = function() {
    return;
    this.ctx.beginPath();
    this.ctx.arc(this.flickCenter.x * PX, this.flickCenter.y * PX, this.flickRadius, 0, 2 * Math.PI);
    this.ctx.lineWidth = PX;
    this.ctx.stroke();
  };
  Ember.prototype.getFlickBounds = GetFlickBounds = function() {
    var flickCenter, flickRadius;
    flickCenter = {
      x: this.top.x,
      y: this.top.y
    };
    flickRadius = this.flickRadius * PX;
    this.flickCenter = flickCenter;
    this.flickCenterStart = {};
    this.flickCenterStart.x = flickCenter.x;
    this.flickCenterStart.y = flickCenter.y;
    this.flickRadius = flickRadius;
  };
  Ember.prototype.getDelta = function() {
    var angle, delta, newTop;
    angle = rand(0, 360);
    newTop = {
      x: this.flickCenter.x + Math.cos(angle * DEG) * .05 * this.flickRadius,
      y: this.flickCenter.y + Math.sin(angle * DEG) * 1.5 * this.flickRadius
    };
    delta = {
      x: newTop.x - this.top.x,
      y: newTop.y - this.top.y
    };
    return delta;
  };
  Ember.prototype.sendTop = SendTop = function(dX, dY) {
    var deltaX, deltaY, it, tween1, tween2;
    it = this;
    deltaX = deltaY = 0;
    tween2 = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1000 + rand(0, 200)).onStart(function() {
      deltaX = it.flickCenterStart.x - it.flickCenter.x;
      deltaY = it.flickCenterStart.y - it.flickCenter.y;
    }).onUpdate(function() {
      it.flickCenter.x = it.flickCenterStart.x - (deltaX * (1 - this.p));
      it.flickCenter.y = it.flickCenterStart.y - (deltaY * (1 - this.p));
    }).easing(TWEEN.Easing.Elastic.Out);
    tween1 = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 300).onUpdate(function() {
      it.flickCenter.x = it.flickCenterStart.x + (dX * PX * this.p);
      it.flickCenter.y = it.flickCenterStart.y + (dY * PX * this.p);
    }).chain(tween2).start();
  };
  embers = [];
  ember1 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 10,
    color: "#ED8CBA",
    top: {
      x: 280,
      y: 240
    },
    right: {
      x: 300,
      y: 410
    },
    bottom: {
      x: 280,
      y: 438
    },
    left: {
      x: 232,
      y: 404
    }
  });
  ember11 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 20,
    color: "#ED8CBA",
    top: {
      x: 280,
      y: 240
    },
    right: {
      x: 300,
      y: 410
    },
    bottom: {
      x: 280,
      y: 438
    },
    left: {
      x: 232,
      y: 404
    }
  });
  ember2 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 20,
    color: "#E86CA9",
    top: {
      x: 314,
      y: 130
    },
    right: {
      x: 364,
      y: 412
    },
    bottom: {
      x: 310,
      y: 460
    },
    left: {
      x: 256,
      y: 420
    }
  });
  ember21 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 30,
    color: "#E86CA9",
    top: {
      x: 314,
      y: 130
    },
    right: {
      x: 364,
      y: 412
    },
    bottom: {
      x: 310,
      y: 460
    },
    left: {
      x: 256,
      y: 420
    }
  });
  ember3 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 10,
    color: "#A4D7F5",
    top: {
      x: 330,
      y: 160
    },
    right: {
      x: 348,
      y: 388
    },
    bottom: {
      x: 310,
      y: 460
    },
    left: {
      x: 280,
      y: 380
    }
  });
  ember31 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 20,
    color: "#A4D7F5",
    top: {
      x: 330,
      y: 160
    },
    right: {
      x: 348,
      y: 388
    },
    bottom: {
      x: 310,
      y: 460
    },
    left: {
      x: 280,
      y: 380
    }
  });
  ember4 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 10,
    color: "#F6D58A",
    top: {
      x: 352,
      y: 252
    },
    right: {
      x: 376,
      y: 402
    },
    bottom: {
      x: 328,
      y: 444
    },
    left: {
      x: 300,
      y: 410
    }
  });
  ember41 = new Ember({
    ctx: ctx,
    sensivity: .25,
    flickRadius: 20,
    color: "#F6D58A",
    top: {
      x: 352,
      y: 252
    },
    right: {
      x: 376,
      y: 402
    },
    bottom: {
      x: 328,
      y: 444
    },
    left: {
      x: 300,
      y: 410
    }
  });
  embers.push(ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41);
  ctx.globalCompositeOperation = "multiply";
  drawBones = drawBones = function() {
    ctx.lineWidth = 7 * PX;
    ctx.strokeStyle = "#80404B";
    ctx.beginPath();
    ctx.moveTo(260 * PX, 474 * PX);
    ctx.lineTo(360 * PX, 500 * PX);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(256 * PX, 510 * PX);
    ctx.lineTo(356 * PX, 472 * PX);
    ctx.stroke();
  };
  rX = rY = 0;
  setTimeout((function() {
    var i;
    i = embers.length - 1;
    while (i >= 0) {
      if (i % 2 === 0) {
        rX = rand(-100, 100);
        rY = rand(-100, 100);
      }
      embers[i].sendTop(-50 + rX, rY);
      i--;
    }
  }), 3000);
  animationLoop = function() {
    var i;
    ctx.clearRect(0, 0, 1200, 1200);
    i = embers.length - 1;
    while (i >= 0) {
      embers[i].draw();
      i--;
    }
    drawBones();
    TWEEN.update();
    requestAnimationFrame(animationLoop);
  };
  animationLoop();
})();
