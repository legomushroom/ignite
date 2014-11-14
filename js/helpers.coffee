class Helpers
  PX:  2
  DEG: Math.PI/180
  rand:(min, max) -> Math.floor((Math.random() * ((max + 1) - min)) + min)


  slice:(val, max)->
    if val < 0
      if val < -max
        return -max

    if val > 0
      if val > max
        return max

    val

  transform:(el, val)->
    el.style["#{@prefix.js}Transform"] = val
    el.style.transform = val


  constructor:-> @vars()
  vars:->
    @prefix = @getPrefix()
    @isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

  getPrefix:->
    styles = window.getComputedStyle(document.documentElement, "")
    v = Array::slice.call(styles).join("").match(/-(moz|webkit|ms)-/)
    pre = (v or (styles.OLink is "" and [
      ""
      "o"
    ]))[1]
    dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1]
    
    dom: dom
    lowercase: pre
    css: "-" + pre + "-"
    js: pre[0].toUpperCase() + pre.substr(1)

module.exports  = new Helpers