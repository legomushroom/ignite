# EMBER CLASS
h     = require './helpers'

class Spark
  constructor:(@o={})->
    @vars()

  vars:->
    @ctx      = @o.ctx
    @start    = @o.start
    @position = {}
    @position.x = @start.x; @position.y = @start.y
    @length   = @o.length
    @radius   = @o.radius
    @color    = @o.color
    @delay    = @o.delay
    @delta    = @getDelta()
    @offset   = @o.offset or 0
    @isDelayed = @o.isDelayed
    @base     = @o.base
    @sinCoef  = 1
    @p        = 0
    @pSin     = 0
    @pSinStep = .04
    @d        = 0

  draw:->
    if !@isDelayed
      @ctx.beginPath()
      # x = (@position.x+(30*Math.sin(@pSin)))*h.PX
      # y = (@position.y - (@p*@delta))*h.PX
      
      b = @base
      rad = (b.radius+100-@length+(@length*@p))
      quirk = 3*Math.sin(@pSin)*@sinCoef
      x = b.x + Math.cos((b.angle+quirk-90)*h.DEG)*rad
      y = b.y + Math.sin((b.angle+quirk-90)*h.DEG)*rad
      x += @offset*h.PX
      @ctx.arc x, y, @radius*(1-@p), 0, 2*Math.PI
      @ctx.fillStyle = @color
      @ctx.fill()

      @pSin += @pSinStep
      # @sinCoef = -@sinCoef if @pSin >= 1 or @pSin <= 0
      @p += .02
      
      if @p >= 1
        @p = 0
        @pSin = 0
        @sinCoef = -@sinCoef
        @isDelayed = true
        @radius = h.rand(5,10)
    
    else
      @d += .1
      if @d >= @delay
        @d = 0
        @isDelayed = false

  getDelta:-> @start.y - @length

module.exports = Spark
