class Shaker
  constructor:-> @vars()
  vars:-> @pos = []
  setPosition:(pos)->
    @pos.push pos
    len = @pos.length
    return if len < 3
    lastI = len-1
    if (pos.dir isnt @pos[lastI-1].dir) and (pos.dir is @pos[lastI-2].dir)
      time = (pos.timestamp - @pos[lastI-1].timestamp)/1000
      @isShake = time < .5

module.exports = Shaker