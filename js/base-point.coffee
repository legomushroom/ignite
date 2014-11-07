h = require './helpers'

class BasePoint
  constructor:(@o={})->
    @vars()
    @getPosition()
  vars:->
    @ctx = @o.ctx
    @base = @o.base
    @radius = @o.radius*h.PX
    @offset = @o.offset
    @angle = @o.angle
    @baseAngle = @angle
    @suppress = 0

  getPosition:->
    rad = (@base.radius-5*@suppress-@offset*h.PX)
    @center =
      x: @base.x + Math.cos((@base.angle-90)*h.DEG)*rad
      y: @base.y + Math.sin((@base.angle-90)*h.DEG)*rad

    @x = (@center.x + Math.cos(@angle*h.DEG)*(@radius))/2
    @y = (@center.y + Math.sin(@angle*h.DEG)*(@radius))/2

    @onPositionChange?()

  setAngle:(angle)->
    @angle = @baseAngle + angle
    @getPosition()

  setSuppress:(n)->
    @suppress = n
    @getPosition()

  draw:->
    return
    @ctx.beginPath()
    @ctx.lineWidth = h.PX
  
    @ctx.arc @center.x, @center.y, 1*h.PX, 0, 2*Math.PI
    @ctx.fill()

    # @ctx.beginPath()
    # @ctx.arc x, y, @radius, 0, 2*Math.PI
    # @ctx.strokeStyle = 'cyan'
    # @ctx.stroke()

    @ctx.beginPath()
    @ctx.moveTo @center.x, @center.y
    @ctx.lineTo @x*h.PX, @y*h.PX
    @ctx.stroke()

module.exports = BasePoint