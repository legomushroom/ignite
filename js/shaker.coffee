class Shaker
  constructor:-> @vars()
  vars:-> @pos = []
  reset:->
    @isShake = false
    len = @pos.length
    return if len < 3
    @pos = [@pos[len-3], @pos[len-2], @pos[len-1]]

  setPosition:(pos)->
    @pos.push pos
    len = @pos.length
    return if len < 3
    lastI = len-1
    if (pos.dir isnt @pos[lastI-1].dir) and (pos.dir is @pos[lastI-2].dir)
      time = (pos.timestamp - @pos[lastI-1].timestamp)/1000
      # console.log time < .2, time
      @isShake = time < .2

module.exports = Shaker