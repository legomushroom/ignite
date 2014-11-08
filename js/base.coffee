h = require './helpers'

class Base
  constructor:(@o={})-> @vars()
  vars:->
    @ctx = @o.ctx
    @x = @o.x
    @y = @o.y
    @radius = @o.radius
    @angle = @o.angle
    @points = []
    @suppress = 0
    @speed = 1
  setAngle:(angle)->
    @angle = angle
    for point, i in @points
      point.getPosition()
      point.setAngle @angle
  addPoint:(point)-> @points.push point

  setSuppress:(n)->
    @suppress = n
    for point, i in @points
      point.setSuppress @suppress

  setSpeed:(n)-> @speed = n

  draw:->
    return
    @ctx.beginPath()
    @ctx.arc @x, @y, 5*h.PX, 0, 2*Math.PI
    @ctx.fillStyle = 'cyan'
    @ctx.fill()
    @ctx.beginPath()
    @ctx.arc @x, @y, @radius, 0, 2*Math.PI
    @ctx.lineWidth = h.PX
    @ctx.strokeStyle = 'cyan'
    @ctx.stroke()

    @ctx.beginPath()
    x = @x + Math.cos((@angle-90)*h.DEG)*@radius
    y = @y + Math.sin((@angle-90)*h.DEG)*@radius
    @ctx.lineWidth = h.PX
    @ctx.moveTo @x, @y
    @ctx.lineTo x, y
    @ctx.strokeStyle = 'slateblue'
    @ctx.stroke()

module.exports = Base