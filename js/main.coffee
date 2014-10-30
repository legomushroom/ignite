Ember = require './ember'
Hammer = require './hammer.min'
TWEEN = require './tweenjs.min'
h = require './helpers'

class Main
  constructor:(@o={})->
    @vars()
    @run()

  vars:->
    # SYS
    @canvas = document.getElementById("js-canvas")
    @ctx = @canvas.getContext("2d")
    @animationLoop = @animationLoop.bind(@)
    @embers = []

  run:->
    @animationLoop()

    mc = new Hammer(@canvas)

    ember1 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: 280, y: 240
      right:  x: 300, y: 410
      bottom: x: 280, y: 438
      left:   x: 232, y: 404
    )

    ember11 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: 290, y: 240
      right:  x: 300, y: 410
      bottom: x: 280, y: 438
      left:   x: 232, y: 404
    )

    ember2 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#E86CA9"
      top: x: 314, y: 130
      right:  x: 364, y: 412
      bottom: x: 310, y: 460
      left:   x: 256, y: 420
    )
    ember21 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#E86CA9"
      top: x: 324, y: 130
      right:  x: 364, y: 412
      bottom: x: 310, y: 460
      left:   x: 256, y: 420
    )
    
    ember3 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#A4D7F5"
      top:    x: 330, y: 160
      right:  x: 348, y: 388
      bottom: x: 310, y: 460
      left:   x: 280, y: 380
    )
    
    ember4 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#F6D58A"
      top:    x: 352, y: 252
      right:  x: 376, y: 402
      bottom: x: 328, y: 444
      left:   x: 300, y: 410
    )

    ember41 = new Ember(
      ctx: @ctx
      sensivity: .25
      flickRadius: 20
      color: "#F6D58A"
      top:    x: 346, y: 252
      right:  x: 376, y: 402
      bottom: x: 328, y: 444
      left:   x: 300, y: 410
    )

   
    @embers.push ember1, ember2, ember3, ember4, ember41, ember21, ember11

    @ctx.globalCompositeOperation = "multiply"
  
  drawBones:->
    @ctx.lineWidth = 7*h.PX
    @ctx.strokeStyle = "#80404B"
    
    # bone 1
    @ctx.beginPath()
    @ctx.moveTo 260 * h.PX, 474 * h.PX
    @ctx.lineTo 360 * h.PX, 500 * h.PX
    @ctx.stroke()
    
    # bone 2
    @ctx.beginPath()
    @ctx.moveTo 256 * h.PX, 510 * h.PX
    @ctx.lineTo 356 * h.PX, 472 * h.PX
    @ctx.stroke()


    # mc.on('tap', function(e) {
    #   console.log(e);
    #   x = e.pointers[0].clientX;
    #   y = e.pointers[0].clientY;
    # });
    # rX = rY = 0
    # setTimeout (=>
    #   i = @embers.length - 1

    #   while i >= 0
    #     if i % 2 is 0
    #       rX = h.rand(-100, 100)
    #       rY = h.rand(-100, 100)
    #     @embers[i].sendTop -50 + rX, rY
    #     i--
    #   return
    # ), 3000

    # LOOP
  animationLoop: ->
    @ctx.clearRect 0, 0, 1200, 1200
    i = @embers.length - 1

    while i >= 0
      @embers[i].draw()
      i--
    @drawBones()
    TWEEN.update()
    requestAnimationFrame @animationLoop
    return

new Main