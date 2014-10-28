var Ember, Main;

Ember = require('./ember');
Hammer = require('./hammer.min');

Main = (function() {
  function Main(o) {
    var DEG, PX, Rand, animationLoop, canvas, ctx, drawBones, ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41, embers, mc, rX, rY, rand;
    this.o = o != null ? o : {};
    PX = 2;
    DEG = Math.PI / 180;
    canvas = document.getElementById("js-canvas");
    ctx = canvas.getContext("2d");
    rand = Rand = function(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    };
    mc = new Hammer(canvas);
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
    embers.push(ember1, ember11, ember2, ember21, ember3);
    embers.push(ember31, ember4, ember41);
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
  }

  return Main;

})();

new Main;
