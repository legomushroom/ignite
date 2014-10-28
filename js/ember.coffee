# EMBER CLASS
PX = 2
rand = Rand = (min, max) ->
  Math.round Math.random() * (max - min) + min

DEG = Math.PI / 180

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
  @ctx.arc @flickCenter.x*PX, @flickCenter.y*PX, @flickRadius, 0, 2*Math.PI
  @ctx.lineWidth = PX
  @ctx.stroke()
  return

Ember::getFlickBounds = GetFlickBounds = ->
  PX = 2
  flickCenter =
    x: @top.x
    y: @top.y

  flickRadius = @flickRadius*PX
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
module.exports = Ember