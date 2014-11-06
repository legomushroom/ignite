Ember = require './ember'
Spark = require './spark'
Hammer = require './hammer.min'
TWEEN = require './tweenjs.min'
Base = require './base'
BasePoint = require './base-point'
h = require './helpers'

class Main
  constructor:(@o={})->
    @vars()
    @events()
    @run()

  events:->
    first =
      x: null, y: null
    delta = 0
    timeout = null
    @canvas.addEventListener 'mousemove', (e)=>
      if !first.x then first = x: e.x, y: e.y
      else
        delta = first.x - e.x

      angle = if delta < 0 then Math.min delta/5, 45
      else Math.min delta/5, -45
      @base.setAngle angle

      if !timeout
        timeout = setTimeout =>
          console.log 'a'
          clearTimeout timeout
          timeout = null
          first = x: null, y: null
        , 100
      # console.log delta

  vars:->
    # SYS
    @canvas = document.getElementById("js-canvas")
    @ctx = @canvas.getContext("2d")
    @animationLoop = @animationLoop.bind(@)
    @embers = []
    @sparks = []
    @basePoints = []
    
    @base = new Base
      x: 310*h.PX, y: 460*h.PX, radius: 400*h.PX, angle: 0, ctx: @ctx

    @basePoint1 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 4
      offset: 71
      angle: 0
    @base.addPoint @basePoint1

    @basePoint11 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 15
      offset: 61
      angle: 0
    @base.addPoint @basePoint11

    @basePoint2 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 30
      offset: 182
      angle: -180
    @base.addPoint @basePoint2

    @basePoint21 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 20
      offset: 182
      angle: -180
    @base.addPoint @basePoint21

    @basePoint3 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 24
      offset: 101
      angle: 0
    @base.addPoint @basePoint3

    @basePoint31 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 22
      offset: 106
      angle: 0
    @base.addPoint @basePoint31

    @basePoint4 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 34
      offset: 173
      angle: 0
    @base.addPoint @basePoint4

    @basePoint41 = new BasePoint
      ctx: @ctx
      base: @base
      radius: 42
      offset: 193
      angle: 0
    @base.addPoint @basePoint41

    # @basePoints.push @basePoint11

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
      basePoint: @basePoint1
      base: @base
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
      basePoint: @basePoint11
      base: @base
    )

    # coef = 1
    # setInterval =>
    #   coef = -coef
    #   ang = coef*45
    #   it = @
    #   new TWEEN.Tween(p:0).to({p:1}, 400)
    #     .onUpdate ->
    #       it.base.setAngle ang*@p
    #     .easing(TWEEN.Easing.Elastic.Out)
    #     .start()
    #     .onComplete =>
    #       new TWEEN.Tween(p:0).to({p:1}, 1500)
    #         .onUpdate ->
    #           it.base.setAngle ang*(1-@p)
    #         .delay(5000)
    #         .easing(TWEEN.Easing.Elastic.Out)
    #         .start()
    # , 8000

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
      basePoint: @basePoint2
      base: @base
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
      basePoint: @basePoint21
      base: @base
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
      basePoint: @basePoint3
      base: @base
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
      basePoint: @basePoint4
      base: @base
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
      basePoint: @basePoint41
      base: @base
    )
   
    @embers.push ember1, ember11
    @embers.push ember2, ember21
    @embers.push ember3#, ember31
    @embers.push ember4, ember41

    spark1 = new Spark
      ctx:    @ctx
      color:  "#F6D58A"
      base: @base

    spark2 = new Spark
      ctx:    @ctx
      color:  "#D5296F"
      isDelayed: true
      base: @base

    spark3 = new Spark
      ctx:    @ctx
      color:  "#65B4ED"
      isDelayed: true
      base: @base

    spark4 = new Spark
      ctx:    @ctx
      color:  "#EA69A9"
      base: @base

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
    
    i = @sparks.length - 1
    while i >= 0
      @sparks[i].draw()
      i--

    i = @embers.length - 1
    while i >= 0
      @embers[i].draw()
      i--

    @drawBones()
    @base.draw()

    i = @base.points.length - 1
    while i >= 0
      @base.points[i].draw()
      i--

    TWEEN.update()
    requestAnimationFrame @animationLoop
    return


new Main