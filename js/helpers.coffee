class Helpers
  PX:  2
  DEG: Math.PI/180

  rand:(min, max) -> Math.floor((Math.random() * ((max + 1) - min)) + min)


module.exports  = new Helpers