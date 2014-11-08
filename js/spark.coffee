# EMBER CLASS
h     = require './helpers'

class Spark
  constructor:(@o={})->
    @vars()

  vars:->
    @ctx      = @o.ctx
    @start    = @o.start
    @length   = @o.length or 450
    @color    = @o.color
    @offset   = @o.offset or 0
    @getRandRadius()
    @getRandOffset()
    @getRandDelay()

    @isDelayed = @o.isDelayed or true
    @base2     = {}
    @cloneBase()
    @sinCoef  = 1
    @p        = 0
    @pSin     = 0
    @pSinStep = .1
    @d        = 0

  getRandOffset:-> @offset = h.rand(-35,35)
  getRandDelay:->  @delay = h.rand(0,20)
  getRandRadius:-> @radius = h.rand(5,10)

  cloneBase:->
    for key, value of @o.base
      @base2[key] = value

  draw:->
    if !@isDelayed
      !@isBaseCloned and @cloneBase()
      @isBaseCloned = true
      @ctx.beginPath()
      b = @base2
      speed = Math.abs(b.angle)/3000
      rad = (b.radius+100-@length+(@length*@p))
      quirk = Math.sin(@pSin)*@sinCoef
      x = b.x + Math.cos((b.angle+quirk-90)*h.DEG)*rad
      y = b.y + Math.sin((b.angle+quirk-90)*h.DEG)*rad
      x += @offset*h.PX
      @ctx.arc x, y, @radius*(1-@p), 0, 2*Math.PI
      @ctx.fillStyle = @color
      @ctx.fill()

      @pSin += @pSinStep + speed
      # @sinCoef = -@sinCoef if @pSin >= 1 or @pSin <= 0
      @p += .02 + speed
      
      if @p >= 1
        @p = 0
        @pSin = 0
        @sinCoef = -@sinCoef
        @isDelayed = true
        @radius = h.rand(5,10)
        @pSinStep = h.rand(0,2)/10
        @getRandOffset()
        @getRandDelay()
        @isBaseCloned = false
    else
      @d += .1
      if @d >= @delay*(1-Math.abs(@base2.angle)/45)
        @d = 0
        @isDelayed = false

module.exports = Spark
