# EMBER CLASS
h     = require './helpers'
TWEEN = require './tweenjs.min'

class Ember
  constructor:(@o={})->
    @ctx = @o.ctx
    @top = @o.top
    @flickRadius = @o.flickRadius or 10
    @top2 = @o.top
    # @top2.y +=  @flickRadius
    @right = @o.right
    @bottom = @o.bottom
    @left = @o.left
    @color = @o.color or "deeppink"
    @angle = 0
    @angle2 = 0
    @angleStep = h.rand(25,50)
    @angleStep2 = h.rand(25,50)
    @p = 0 # used to animate delta
    # @p2 = 0 # used to animate delta
    # @p2Step = .01
    unless @ctx
      console.error "no context, aborting"
      return
    @getFlickBounds()
    deltas = @getDelta()
    @delta = deltas.delta
    @delta2 = deltas.delta2
    # @delta3 = deltas.delta3

  draw: ->
    
    @ctx.beginPath()
    @ctx.moveTo @left.x*h.PX, (@left.y)*h.PX
    topX = @top.x + (@p*@delta.x); topY = @top.y + (@p*@delta.y)
    @ctx.lineTo topX*h.PX, topY*h.PX
    @ctx.lineTo (@right.x)*h.PX, (@right.y)*h.PX
    @ctx.lineTo @bottom.x*h.PX,  (@bottom.y)*h.PX
    @ctx.closePath()
    @ctx.fillStyle = @color
    @ctx.fill()

    # @ctx.beginPath()
    # @ctx.moveTo @left.x*h.PX, @left.y*h.PX
    # topX2 = @top2.x + @p*@delta2.x; topY2 = @top2.y + @p*@delta2.y
    # @ctx.lineTo topX2*h.PX, topY2*h.PX
    # @ctx.lineTo @right.x*h.PX, @right.y*h.PX
    # @ctx.lineTo @bottom.x*h.PX,@bottom.y*h.PX
    # @ctx.closePath()
    # @ctx.fillStyle = @color
    # @ctx.fill()

    @p += @o.sensivity
    if @p >= 1
      @top.x = topX; @top.y = topY
      # @top2.x = topX2; @top2.y = topY2
      deltas = @getDelta()
      @delta = deltas.delta
      @delta2 = deltas.delta2
      @p = 0

    @drawFlickBounds()
    return

  drawFlickBounds: ->
    return
    @ctx.beginPath()
    x = @flickCenter.x*h.PX; y = @flickCenter.y*h.PX
    @ctx.arc x, y, @flickRadius, 0, 2*Math.PI
    @ctx.lineWidth = h.PX
    @ctx.stroke()
    return

  getFlickBounds: ->
    PX = 2
    flickCenter = x: @top.x, y: @top.y
    flickRadius = @flickRadius*PX
    @flickCenter = flickCenter
    @flickCenterStart = {}
    @flickCenterStart.x = flickCenter.x
    @flickCenterStart.y = flickCenter.y
    @flickRadius = flickRadius
    return
  
  getDelta: ->
    @angle += @angleStep
    @angle2 -= @angleStep

    newTop =
      x: @flickCenter.x + Math.cos(@angle * h.DEG) * .05 * @flickRadius
      y: @flickCenter.y + Math.sin(@angle * h.DEG) * 1.5 * @flickRadius
    newTop2 =
      x: @flickCenter.x + Math.cos(@angle2 * h.DEG) * .05 * @flickRadius
      y: @flickCenter.y + Math.sin(@angle2 * h.DEG) * 1.5 * @flickRadius
    
    delta  = x: newTop.x  - @top.x,  y: newTop.y  - @top.y
    delta2 = x: newTop2.x - @top2.x, y: newTop2.y - @top2.y
    delta: delta, delta2: delta2

  # sendTop: (dX, dY) ->
  #   it = @
  #   deltaX = deltaY = 0
  #   tween2 = new TWEEN.Tween(p: 0).to(
  #     p: 1
  #   , 1000 + h.rand(0, 200)).onStart(->
  #     deltaX = it.flickCenterStart.x - it.flickCenter.x
  #     deltaY = it.flickCenterStart.y - it.flickCenter.y
  #     return
  #   ).onUpdate(->
  #     it.flickCenter.x = it.flickCenterStart.x - (deltaX * (1 - @p))
  #     it.flickCenter.y = it.flickCenterStart.y - (deltaY * (1 - @p))
  #     return
  #   ).easing(TWEEN.Easing.Elastic.Out)
  #   tween1 = new TWEEN.Tween(p: 0).to(
  #     p: 1
  #   , 300).onUpdate(->
  #     it.flickCenter.x = it.flickCenterStart.x + (dX * h.PX * @p)
  #     it.flickCenter.y = it.flickCenterStart.y + (dY * h.PX * @p)
  #     return
  #   ).chain(tween2).start()
  #   return
module.exports = Ember