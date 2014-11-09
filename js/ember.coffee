# EMBER CLASS
h     = require './helpers'
TWEEN = require './tweenjs.min'

class Ember
  constructor:(@o={})->
    @ctx = @o.ctx
    @top = @o.top
    @flickRadius = @o.flickRadius or 10
    @name = @o.name
    @base = @o.base
    @right = @o.right
    @bottom = @o.bottom
    @left = @o.left
    @color = @o.color or "deeppink"
    @angleStep = @o.angleStep or h.rand(30,40)
    @angleStart = @o.angleStart or 0
    @basePoint = @o.basePoint or @top
    @basePoint.ember = @
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
    ang = (@base.angle)
    if ang < 0
      leftOffset = ang/2
      rightOffset = ang
    else
      leftOffset = ang
      rightOffset = ang/2

    s = @base.suppress/3
    topOffset = 0
    leftOffset = Math.max s, leftOffset
    rightOffset = Math.max s, rightOffset

    if rightOffset is s then rightOffset = - rightOffset
    if @name is '1' and leftOffset = s
      topOffset = -s
      leftOffset = 0

    @ctx.moveTo (@left.x+leftOffset)*h.PX, (@left.y+s+topOffset)*h.PX
    topX = @top.x + (@p*@delta.x); topY = @top.y+(@p*@delta.y)
    @ctx.lineTo topX*h.PX, topY*h.PX
    @ctx.lineTo (@right.x+rightOffset)*h.PX, (@right.y+s)*h.PX
    @ctx.lineTo (@bottom.x)*h.PX,  (@bottom.y)*h.PX
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
    suppress = Math.abs(@base.suppress)
    if @base.suppress > 0 then suppress /= 2
    speed = Math.abs(@base.angle)
    speed = 60 - Math.max speed, suppress

    @angle += @angleStep/speed
    ang = @angle
    rX = .1*@flickRadius
    rY = 1*@flickRadius
    cX = @flickCenter.x; cY = @flickCenter.y
    bAng = @base.angle*h.DEG
    oX = cX-(rY*@sin(ang))*@sin(bAng)+rX*@cos(ang)*@cos(bAng)
    oY = cY+(rX*@cos(ang))*@sin(bAng)+rY*@sin(ang)*@cos(bAng)
    
    newTop = x: oX, y: oY
    delta  = x: newTop.x  - @top.x,  y: newTop.y  - @top.y

  sin:(n)-> Math.sin.apply n, arguments
  cos:(n)-> Math.cos.apply n, arguments

module.exports = Ember