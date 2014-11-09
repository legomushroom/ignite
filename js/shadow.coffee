h = require './helpers'

class Shadow

  constructor:(@o={})->
    @vars()

  vars:->
    @shadow = document.getElementById 'js-shadow'
    @base = @o.base
    @tick = 0
    @o = .75
    @spread = 0

  draw:->
    @tick++
    if @tick % 3 is 0
      @o = h.rand(9,10)/10
      shadowString = "0 0 400px #{200-@base.suppress}px #F6D58A"
      @shadow.style.boxShadow = shadowString
      @shadow.style.opacity = @o

module.exports = Shadow