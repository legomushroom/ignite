Ember = require './ember'
Spark = require './spark'
Hammer = require './hammer.min'
TWEEN = require './tweenjs.min'
Base = require './base'
BasePoint = require './base-point'
Shadow = require './shadow'
Shaker = require './shaker'
h = require './helpers'
mojs = require './mojs.min'

class Main
  constructor:(@o={})->
    @vars()
    @prepareText()
    @events()
    @run()
    @showTorch()

  stopNormalizingBase:->
    TWEEN.remove(@tween); @isNormalizing = false

  events:->
    mc = new Hammer(document.body)
    tch = new Hammer(@torch)
    isTouched = false
    timeout = null

    @shaker = new Shaker
    dir = ''
    tch.on 'panleft',  (e)=>
      return if dir is 'left'
      dir = 'left'
      @shaker.setPosition
        dir: 'left'
        timestamp: new Date().getTime()
    tch.on 'panright', (e)=>
      return if dir is 'right'
      dir = 'right'
      @shaker.setPosition
        dir: 'right'
        timestamp: new Date().getTime()

    currTorchX = 0; torchSceneX = 0; tm = null
    tch.on 'pan', (e)=>
      torchSceneX = currTorchX + e.deltaX
      velocityX = h.slice e.velocityX, 6
      angleVelocity = 12*velocityX
      if Math.abs(velocityX) > 1
        @stopNormalizingBase()
        @ang = angleVelocity
        @ang = h.slice @ang, 35
        @base.setAngle @ang
        coef = if @shaker.isShake then 2 else -1
        @base.setSuppress coef*Math.abs 9*velocityX
      else @normalizeBase()
      h.transform @torchScene, "translateX(#{torchSceneX}px)"

    currTorchXOld = -1
    setInterval =>
      if currTorchX is currTorchXOld and @isTorch then @normalizeBase()
      else currTorchXOld = currTorchX
    , 100

    tch.on 'panstart', (e)=> @isTorch = true; @hideLegend()
    tch.on 'panend',   (e)=>
      @isTorch = false; currTorchX = torchSceneX
      @normalizeBase()

    mc.on 'tap', (e)-> isTouched = true; @hideLegend()
    mc.on 'panstart', (e)=>
      @hideLegend()
      return if @isTorch
      # return if e.pointers[0].y > 520 or e.pointers[0].y < 100
      pointer = e.pointers[0]
      @base.panstart =  x: pointer.x, y: pointer.y
      isTouched = true; TWEEN.remove(@tween); @isNormalizing = false
    mc.on 'pan', (e)=>
      return if @isTorch
      if isTouched
        @ang = e.deltaX/10
        if @ang >  @MAX_ANGLE then @ang =  @MAX_ANGLE
        if @ang < -@MAX_ANGLE then @ang = -@MAX_ANGLE
        @base.setAngle @ang
        @suppress = e.deltaY/20
        @base.setSuppress @suppress
        if !timeout
          timeout = setTimeout =>
            isTouched = false
            timeout = null
            @normalizeBase()
          , 350

  normalizeBase:->
    return if @isNormalizing
    @isNormalizing = true
    it = @
    @tween = new TWEEN.Tween(p:0).to({p:1}, 1500)
      .onUpdate ->
        it.base.setAngle it.ang*(1-@p)
        it.base.setSuppress it.suppress*(1-@p)
      .easing(TWEEN.Easing.Elastic.Out)
      .onComplete =>
        @suppress = 0; @ang = 0; @isNormalizing = false
      .start()

  showLegend:->
    return if @isLegendHidden
    it = @
    @tweenLegend = new TWEEN.Tween(p:0).to({p:1}, 1200)
      .onUpdate -> it.legend.style.opacity = "#{@p}"
      .delay(2500)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()

  hideLegend:->
    return if @isLegendHidden
    @legend.style.display = 'none'
    @isLegendHidden = true
    TWEEN.remove(@tweenLegend)

  showText:->
    childs = @maskChilds
    @tweenText = new TWEEN.Tween(p:0).to({p:1}, 1200)
      .onUpdate ->
        i = childs.length - 1
        while i >= 0
          child = childs[i]#; coef = if child.isTorch then 1 else -1
          if child.strokeLength
            currOffset = child.strokeLength*(1-@p)
            child.style['stroke-dashoffset'] = "#{currOffset}px"
          i--
      .delay(200)
      .onStart => @text.style.display = 'block'
      .onComplete => @showMushroom()
      .easing(TWEEN.Easing.Cubic.Out)
      .start()

  showMushroom:->
    it = @
    @tweenMushroom = new TWEEN.Tween(p:0).to({p:1}, 400)
      .onUpdate ->
        it.mushroom.style.opacity = "#{@p}"
      .onStart =>
        @mushroom.style.display = 'block'
        @burst.run()
      .onComplete => @showLegend()
      .easing(TWEEN.Easing.Cubic.Out)
      .start()

  prepareText:->
    for path, i in @maskChilds
      length = path.getTotalLength()
      if length > 50
        torch = path.getAttribute 'torch'
        path.style['stroke-dasharray'] = "#{length}px"
        path.style['stroke-dashoffset'] = "#{-length}px"
        path.strokeLength = length
        path.isTorch = !!torch

  showTorch:->
    it = @
    @tweenTorch = new TWEEN.Tween(p:0).to({p:1}, 300)
      .onUpdate ->
        it.torch.style.opacity = @p
        h.transform it.torch, "translateY(#{25*(1-@p)}px)"
        if @p > .5 and !it.isShowRun then it.showFire()
        # console.log 'a'
      .easing(TWEEN.Easing.Cubic.Out)
      .delay 1000
      .onComplete => @showText()
      .start()

  showFire:->
    @isShowRun = true
    it = @; lefts  = []; rights = []; offsets = []
    i = it.embers.length - 1
    while i >= 0
      lefts[i] =
        x: it.embers[i].left.x
        y: it.embers[i].left.y
      rights[i] =
        x: it.embers[i].right.x
        y: it.embers[i].right.y
      offsets[i] = it.embers[i].basePoint.offset
      i--
    @tweenShow = new TWEEN.Tween(p:0).to({p:1},1500)
      .onUpdate ->
        i = it.embers.length - 1
        while i >= 0
          ember = it.embers[i]
          left = lefts[i]; right = rights[i]
          newLeftX = it.startX+((left.x-it.startX)*@p)
          newLeftY  = (it.startY+60)+((left.y-(it.startY+60))*@p)
          newRightX = it.startX+((right.x-it.startX)*@p)
          newRightY = (it.startY+60)+((right.y-(it.startY+60))*@p)
          ember.left  = x: newLeftX,  y: newLeftY
          ember.right = x: newRightX, y: newRightY
          ember.basePoint.setOffset 250+((offsets[i]-250)*@p)
          transform = "scale(#{@p}) translateY(#{300*(1-@p)}px)"
          h.transform it.shadow.shadow, transform
          # it.shadow.shadow.style.transform = transform
          i--
      .onStart => @isShowed = true
      .easing(TWEEN.Easing.Elastic.Out)
      .start()

  vars:->
    # SYS
    @canvas = document.getElementById("js-canvas")
    @ctx = @canvas.getContext("2d")
    @wWidth = parseInt @canvas.getAttribute('width'), 10
    @torch  = document.getElementById 'js-torch'
    @legend  = document.getElementById 'js-legend'
    @mask   = document.getElementById 'js-text-mask'
    @maskChilds = @mask.childNodes; childs = []
    for child, i in @maskChilds
      if child.getTotalLength
        childs.push child
    @maskChilds = childs

    @text   = document.getElementById 'js-text'
    @scene  = document.getElementById 'js-scene'
    @torchScene    = document.getElementById 'js-torch-scene'
    @mushroom      = document.getElementById 'js-mushroom'
    @animationLoop = @animationLoop.bind(@)
    @embers = []
    @sparks = []
    @basePoints = []
    @MAX_ANGLE = 35
    @suppress = 0
    @startX = @wWidth/4
    @startY = 390
    @burst = new mojs.Burst
      parent: @scene
      isRunLess: true
      duration: 800
      cnt: 5
      radius: { 75: 150 }
      color: '#FFC37B'
      # shape: 'line'
      bitRadius: { 3: 0 }
      lineWidth: { 2: 0 }
      position: x: 672, y: 394
      easing: 'Cubic.Out'
    
    @base = new Base
      ctx: @ctx
      x: (@startX+10)*h.PX
      y: (@startY+60)*h.PX
      radius: 400*h.PX
      angle: 0

    @shadow = new Shadow base: @base

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

  run:->
    @animationLoop()

    ember1 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      flickRadius: 20
      color:  "#E86CA9"
      top:    x: @startX+14, y: @startY-270
      right:  x: @startX+64, y: @startY+12
      bottom: x: @startX+10, y: @startY+60
      left:   x: @startX-44, y: @startY+20
      basePoint: @basePoint1
      base: @base
      name: '1'
    )
    ember11 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#E86CA9"
      top:    x: @startX+24, y: @startY-280
      right:  x: @startX+64, y: @startY+12
      bottom: x: @startX+10, y: @startY+60
      left:   x: @startX-4,  y: @startY+20
      basePoint: @basePoint11
      base: @base
      name: '11'
    )

    ember2 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 20
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: @startX-20, y: @startY-160
      right:  x: @startX,    y: @startY+10
      # bottom: x: @startX-20, y: @startY+38
      bottom: x: @startX, y: @startY+52
      left:   x: @startX-68, y: @startY+4
      basePoint: @basePoint2
      base: @base
      name: '2'
    )

    ember21 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#ED8CBA"
      top:    x: @startX-10, y: @startY-160
      right:  x: @startX,    y: @startY+10
      bottom: x: @startX, y: @startY+52
      # bottom: x: @startX-20, y: @startY+38
      left:   x: @startX-68, y: @startY+4
      basePoint: @basePoint21
      base: @base
      name: '21'
    )

    ember3 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      flickRadius: 20
      color: "#A4D7F5"
      top:    x: @startX+33, y: @startY-240
      right:  x: @startX+48, y: @startY-22
      bottom: x: @startX+10, y: @startY+60
      left:   x: @startX-20, y: @startY-20
      basePoint: @basePoint3
      base: @base
      name: '3'
    )

    ember4 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      flickRadius: 20
      color: "#F6D58A"
      top:    x: @startX+52, y: @startY-148
      right:  x: @startX+76, y: @startY+2
      # bottom: x: @startX+28, y: @startY+44
      bottom: x: @startX+8, y: @startY+60
      left:   x: @startX,    y: @startY+10
      basePoint: @basePoint4
      base: @base
      name: '4'
    )

    ember41 = new Ember(
      ctx: @ctx
      sensivity: .25
      angleStep: 45
      angleStart: 90
      flickRadius: 20
      color: "#F6D58A"
      top:    x: @startX+44, y: @startY-168
      right:  x: @startX+76, y: @startY+2
      # bottom: x: @startX+28, y: @startY+44
      bottom: x: @startX+8, y: @startY+60
      left:   x: @startX,    y: @startY+10
      basePoint: @basePoint41
      base: @base
      name: '41'
    )
   
    @embers.push ember1, ember11
    @embers.push ember2, ember21
    @embers.push ember3
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

    spark5 = new Spark
      ctx:    @ctx
      color:  "#65B4ED"
      base: @base

    spark6 = new Spark
      ctx:    @ctx
      color:  "#F6D58A"
      base: @base

    spark7 = new Spark
      ctx:    @ctx
      color:  "#D5296F"
      base: @base

    spark8 = new Spark
      ctx:    @ctx
      color:  "#EA69A9"
      base: @base

    @sparks.push spark1
    @sparks.push spark2
    @sparks.push spark3
    @sparks.push spark4
    @sparks.push spark5
    @sparks.push spark6
    @sparks.push spark7
    @sparks.push spark8

    @ctx.globalCompositeOperation = "multiply"

  # LOOP
  animationLoop: ->
    if @isShowed
      @ctx.clearRect 0, 0, @wWidth, @wWidth
      @shadow.draw()
      i = @sparks.length - 1
      while i >= 0
        @sparks[i].draw()
        i--

      i = @embers.length - 1
      while i >= 0
        @embers[i].draw()
        i--

      # @base.draw()
      # i = @base.points.length - 1
      # while i >= 0
      #   @base.points[i].draw()
      #   i--

    TWEEN.update()
    requestAnimationFrame @animationLoop


new Main