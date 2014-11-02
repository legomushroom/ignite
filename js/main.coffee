Ember = require './ember'
Spark = require './spark'
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
    @canvas2 = document.getElementById("js-canvas2")
    @ctx = @canvas.getContext("2d")
    @ctx2 = @canvas2.getContext("2d")
    @animationLoop = @animationLoop.bind(@)
    @embers = []
    @sparks = []
    @wind =
      x: 400, y: 300
      angle: -150
      acc: 200

    setTimeout (=>
      @runWind()
    ), 3000

    # mc = new Hammer(@canvas)

    # mc.add new Hammer.Pan {threshold: 50}

    # mc.on 'tap', (e)=> @drawTap(e)
  

  run:->
    @animationLoop()

    ember1 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      flickRadius: 20
      color:  "#E86CA9"
      top:    x: 314, y: 130
      right:  x: 364, y: 412
      bottom: x: 310, y: 460
      left:   x: 256, y: 420
    )
    ember11 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#E86CA9"
      top:    x: 324, y: 120
      right:  x: 364, y: 412
      bottom: x: 310, y: 460
      left:   x: 256, y: 420
    )

    ember2 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 20
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: 280, y: 240
      right:  x: 300, y: 410
      bottom: x: 280, y: 438
      left:   x: 232, y: 404
    )

    ember21 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: 290, y: 240
      right:  x: 300, y: 410
      bottom: x: 280, y: 438
      left:   x: 232, y: 404
    )

    ember3 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      flickRadius: 20
      color: "#A4D7F5"
      top:    x: 333, y: 160
      right:  x: 348, y: 388
      bottom: x: 310, y: 460
      left:   x: 280, y: 380
    )

    ember31 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#A4D7F5"
      top:    x: 333, y: 160
      right:  x: 348, y: 388
      bottom: x: 310, y: 460
      left:   x: 280, y: 380
    )
    
    ember4 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
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
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#F6D58A"
      top:    x: 344, y: 232
      right:  x: 376, y: 402
      bottom: x: 328, y: 444
      left:   x: 300, y: 410
    )
   
    @embers.push ember1, ember11
    @embers.push ember2, ember21
    @embers.push ember3, ember31
    @embers.push ember4, ember41

    spark1 = new Spark
      ctx:    @ctx
      start:  x: 344, y: 200
      color:  "#F6D58A"
      length: 10
      radius: 7
      delay: 9

    spark2 = new Spark
      ctx:    @ctx
      start:  x: 284, y: 260
      color:  "#D5296F"
      length: 10
      radius: 9
      delay: 12
      isDelayed: true

    spark3 = new Spark
      ctx:    @ctx
      start:  x: 324, y: 210
      color:  "#65B4ED"
      length: 10
      radius: 6
      delay: 8
      isDelayed: true

    spark4 = new Spark
      ctx:    @ctx
      start:  x: 310, y: 160
      color:  "#EA69A9"
      length: 10
      radius: 6
      delay: 18

    @sparks.push spark1
    @sparks.push spark2
    @sparks.push spark3
    @sparks.push spark4

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

    # LOOP
  animationLoop: ->
    @ctx.clearRect 0, 0, 1200, 1200
    
    # @drawMask()
    i = @sparks.length - 1
    while i >= 0
      @sparks[i].draw()
      i--

    i = @embers.length - 1
    while i >= 0
      @embers[i].draw()
      i--

    @drawBones()
    # @ctx.restore()
    TWEEN.update()
    requestAnimationFrame @animationLoop
    return

new Main