h = require './helpers'

class Shadow

  constructor:(@o={})->
    @vars()

  vars:->
    @shadow = document.getElementById 'js-shadow'
    @base = @o.base
    @tick = 0
    @o = .75
    @speed = 3

  draw:->
    # return
    return if @isFF
    suppress = 0
    suppress = if @base.suppress < 0
      @base.suppress/80
    else @base.suppress/120

    scale = "scale(#{1-suppress})"
    x = @base.x - @base.initX
    translate = if @base.suppress > 0
      "translate(#{2*@base.angle}px,#{3*@base.suppress}px)"
    else ''
    h.transform @shadow, "#{scale} #{translate} translateZ(0)"
    # @shadow.style.transform = "#{scale} #{translate} translateZ(0)"

    @tick++
    sup = Math.abs ~~(10*suppress)
    ang = Math.abs ~~(@base.angle/45)
    flick = Math.max sup, ang
    if @tick % (@speed - flick) is 0
      @o = h.rand(8,10)/10
      @shadow.style.opacity = @o

module.exports = Shadow