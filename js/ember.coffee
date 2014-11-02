# EMBER CLASS
h     = require './helpers'
TWEEN = require './tweenjs.min'

class Ember
  constructor:(@o={})->
    @ctx = @o.ctx
    @top = @o.top
    @flickRadius = @o.flickRadius or 10
    @right = @o.right
    @bottom = @o.bottom
    @left = @o.left
    @color = @o.color or "deeppink"
    @angleStep = @o.angleStep or h.rand(30,40)
    @angleStart = @o.angleStart or 0
    @basePoint = @o.basePoint or @top
    @basePoint.onPositionChange = =>
      @flickCenter = x: @basePoint.x, y: @basePoint.y

    @angle = @angleStart
    @p = 0 # used to animate delta
    unless @ctx
      console.error "no context, aborting"
      return
    @getFlickBounds()
    @delta = @getDelta()

  draw:->
    @ctx.beginPath()
    @ctx.moveTo @left.x*h.PX, (@left.y)*h.PX
    topX = @top.x + (@p*@delta.x); topY = @top.y + (@p*@delta.y)
    @ctx.lineTo topX*h.PX, topY*h.PX
    @ctx.lineTo (@right.x)*h.PX, (@right.y)*h.PX
    @ctx.lineTo @bottom.x*h.PX,  (@bottom.y)*h.PX
    @ctx.closePath()
    @ctx.fillStyle = @color
    @ctx.fill()

    @p += @o.sensivity
    if @p >= 1
      @top.x = topX; @top.y = topY
      @delta = @getDelta()
      @p = 0

    @drawFlickBounds()
    return

  drawFlickBounds: ->
    # return
    @ctx.beginPath()
    x = @flickCenter.x*h.PX; y = @flickCenter.y*h.PX
    @ctx.arc x, y, @flickRadius, 0, 2*Math.PI
    @ctx.lineWidth = h.PX/2
    @ctx.strokeStyle = '#777'
    @ctx.stroke()
    return

  getFlickBounds: ->
    PX = 2
    flickCenter = x: @basePoint.x, y: @basePoint.y
    flickRadius = @flickRadius*PX
    @flickCenter = flickCenter
    @flickCenterStart = {}
    @flickCenterStart.x = flickCenter.x
    @flickCenterStart.y = flickCenter.y
    @flickRadius = flickRadius
    return
  
  getDelta: ->
    @angle += @angleStep

    if @angle % 360 > 90 and @angle % 360 < 270
      @angle += 10

    newTop =
      x: @flickCenter.x + Math.cos(@angle * h.DEG) * .05 * @flickRadius
      y: @flickCenter.y + Math.sin(@angle * h.DEG) * 1 * @flickRadius
    
    delta  = x: newTop.x  - @top.x,  y: newTop.y  - @top.y

module.exports = Ember