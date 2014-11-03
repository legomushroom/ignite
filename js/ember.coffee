# EMBER CLASS
h     = require './helpers'
TWEEN = require './tweenjs.min'

class Ember
  constructor:(@o={})->
    @ctx = @o.ctx
    @top = @o.top
    @flickRadius = @o.flickRadius or 10
    @base = @o.base
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
    return
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
    @angle += @angleStep/60
    # @angle %= 360

    # if @angle > 90 and @angle < 270
    #   @angle += 20

    ang = @angle
    rX = .01*@flickRadius
    rY = 1*@flickRadius
    cX = @flickCenter.x; cY = @flickCenter.y
    bAng = @base.angle*h.DEG
    oX = cX-(rY*@sin(ang))*@sin(bAng)+rX*@cos(ang)*@cos(bAng)
    oY = cY+(rX*@cos(ang))*@sin(bAng)+rY*@sin(ang)*@cos(bAng)
    # console.log oX, oY
    newTop =
      x: @flickCenter.x + Math.cos((@angle+90)*h.DEG)*.1*@flickRadius
      y: @flickCenter.y + Math.sin((@angle+90)*h.DEG)*1*@flickRadius

    newTop =
      x: oX, y: oY
    
    delta  = x: newTop.x  - @top.x,  y: newTop.y  - @top.y

  sin:(n)-> Math.sin.apply n, arguments
  cos:(n)-> Math.cos.apply n, arguments

module.exports = Ember