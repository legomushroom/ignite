((undefined_) ->
  
  # SYS
  PX = 2
  DEG = Math.PI / 180
  canvas = document.getElementById("js-canvas")
  ctx = canvas.getContext("2d")
  rand = Rand = (min, max) ->
    Math.round Math.random() * (max - min) + min

  mc = new Hammer(canvas)
  
  # EMBER CLASS
  Ember = Ember = (o) ->
    @o = o or {}
    @ctx = @o.ctx
    @top = @o.top
    @right = @o.right
    @bottom = @o.bottom
    @left = @o.left
    @color = @o.color or "deeppink"
    @flickRadius = @o.flickRadius or 10
    @p = 0 # used to animate delta
    @p2 = 0 # used to animate delta
    @p2Step = .01
    unless @ctx
      console.error "no context, aborting"
      return
    @getFlickBounds()
    @delta = @getDelta()
    return

  Ember::draw = Draw = ->
    @ctx.beginPath()
    @ctx.moveTo @left.x * PX, (@left.y + @p2 * 20) * PX
    topX = @top.x + (@p * @delta.x)
    topY = @top.y + (@p * @delta.y)
    @ctx.lineTo topX * PX, topY * PX
    @ctx.lineTo (@right.x) * PX, (@right.y + @p2 * 20) * PX
    @ctx.lineTo @bottom.x * PX, (@bottom.y + @p2 * 20) * PX
    @ctx.closePath()
    @ctx.fillStyle = @color
    @ctx.fill()
    @p += @o.sensivity
    if @p >= 1
      @top.x = topX
      @top.y = topY
      @delta = @getDelta()
      @p = 0
    
    # this.p2 -= this.p2Step
    # if (this.p2 <= 0) {
    #   this.p2 = 1
    # }
    # if (this.p2 >= 1) {
    #   this.p2Step = -this.p2Step;
    # }
    # if (this.p2 <= 0) {
    #   this.p2Step = -this.p2Step;
    # }
    @drawFlickBounds()
    return

  Ember::drawFlickBounds = drawFlickBounds = ->
    return
    @ctx.beginPath()
    @ctx.arc @flickCenter.x*PX, @flickCenter.y*PX, @flickRadius, 0, 2 * Math.PI
    @ctx.lineWidth = PX
    @ctx.stroke()
    return

  Ember::getFlickBounds = GetFlickBounds = ->
    flickCenter =
      x: @top.x
      y: @top.y

    flickRadius = @flickRadius * PX
    @flickCenter = flickCenter
    @flickCenterStart = {}
    @flickCenterStart.x = flickCenter.x
    @flickCenterStart.y = flickCenter.y
    @flickRadius = flickRadius
    return

  Ember::getDelta = ->
    angle = rand(0, 360)
    newTop =
      x: @flickCenter.x + Math.cos(angle * DEG) * .05 * @flickRadius
      y: @flickCenter.y + Math.sin(angle * DEG) * 1.5 * @flickRadius

    
    # console.log(newTop);
    delta =
      x: newTop.x - @top.x
      y: newTop.y - @top.y

    delta

  Ember::sendTop = SendTop = (dX, dY) ->
    it = this
    deltaX = deltaY = 0
    tween2 = new TWEEN.Tween(p: 0).to(
      p: 1
    , 1000 + rand(0, 200)).onStart(->
      deltaX = it.flickCenterStart.x - it.flickCenter.x
      deltaY = it.flickCenterStart.y - it.flickCenter.y
      return
    ).onUpdate(->
      it.flickCenter.x = it.flickCenterStart.x - (deltaX * (1 - @p))
      it.flickCenter.y = it.flickCenterStart.y - (deltaY * (1 - @p))
      return
    ).easing(TWEEN.Easing.Elastic.Out)
    tween1 = new TWEEN.Tween(p: 0).to(
      p: 1
    , 300).onUpdate(->
      it.flickCenter.x = it.flickCenterStart.x + (dX * PX * @p)
      it.flickCenter.y = it.flickCenterStart.y + (dY * PX * @p)
      return
    ).chain(tween2).start()
    return

  embers = []
  ember1 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 10
    color: "#ED8CBA"
    top:
      x: 280
      y: 240

    right:
      x: 300
      y: 410

    bottom:
      x: 280
      y: 438

    left:
      x: 232
      y: 404
  )
  ember11 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 20
    color: "#ED8CBA"
    top:
      x: 280
      y: 240

    right:
      x: 300
      y: 410

    bottom:
      x: 280
      y: 438

    left:
      x: 232
      y: 404
  )
  ember2 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 20
    color: "#E86CA9"
    top:
      x: 314
      y: 130

    right:
      x: 364
      y: 412

    bottom:
      x: 310
      y: 460

    left:
      x: 256
      y: 420
  )
  ember21 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 30
    color: "#E86CA9"
    top:
      x: 314
      y: 130

    right:
      x: 364
      y: 412

    bottom:
      x: 310
      y: 460

    left:
      x: 256
      y: 420
  )
  ember3 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 10
    color: "#A4D7F5"
    top:
      x: 330
      y: 160

    right:
      x: 348
      y: 388

    bottom:
      x: 310
      y: 460

    left:
      x: 280
      y: 380
  )
  ember31 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 20
    color: "#A4D7F5"
    top:
      x: 330
      y: 160

    right:
      x: 348
      y: 388

    bottom:
      x: 310
      y: 460

    left:
      x: 280
      y: 380
  )
  ember4 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 10
    color: "#F6D58A"
    top:
      x: 352
      y: 252

    right:
      x: 376
      y: 402

    bottom:
      x: 328
      y: 444

    left:
      x: 300
      y: 410
  )
  ember41 = new Ember(
    ctx: ctx
    sensivity: .25
    flickRadius: 20
    color: "#F6D58A"
    top:
      x: 352
      y: 252

    right:
      x: 376
      y: 402

    bottom:
      x: 328
      y: 444

    left:
      x: 300
      y: 410
  )
  embers.push ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41
  
  # embers.push(ember, ember2, ember3);
  ctx.globalCompositeOperation = "multiply"
  drawBones = drawBones = ->
    ctx.lineWidth = 7 * PX
    ctx.strokeStyle = "#80404B"
    
    # bone 1
    ctx.beginPath()
    ctx.moveTo 260 * PX, 474 * PX
    ctx.lineTo 360 * PX, 500 * PX
    ctx.stroke()
    
    # bone 2
    ctx.beginPath()
    ctx.moveTo 256 * PX, 510 * PX
    ctx.lineTo 356 * PX, 472 * PX
    ctx.stroke()
    return

  
  # mc.on('tap', function(e) {
  #   console.log(e);
  #   x = e.pointers[0].clientX;
  #   y = e.pointers[0].clientY;
  # });
  rX = rY = 0
  setTimeout (->
    i = embers.length - 1

    while i >= 0
      if i % 2 is 0
        rX = rand(-100, 100)
        rY = rand(-100, 100)
      embers[i].sendTop -50 + rX, rY
      i--
    return
  ), 3000
  
  # LOOP
  animationLoop = ->
    ctx.clearRect 0, 0, 1200, 1200
    i = embers.length - 1

    while i >= 0
      embers[i].draw()
      i--
    drawBones()
    TWEEN.update()
    requestAnimationFrame animationLoop
    return

  animationLoop()
  return
)()