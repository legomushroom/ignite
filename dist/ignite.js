(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BasePoint, h;

h = require('./helpers');

BasePoint = (function() {
  function BasePoint(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.getPosition();
  }

  BasePoint.prototype.vars = function() {
    this.ctx = this.o.ctx;
    this.base = this.o.base;
    this.radius = this.o.radius * h.PX;
    this.offset = this.o.offset;
    this.angle = this.o.angle;
    this.baseAngle = this.angle;
    return this.suppress = 0;
  };

  BasePoint.prototype.getPosition = function() {
    var minSuppress, rad;
    rad = this.base.radius - 5 * this.suppress - this.offset * h.PX;
    this.center = {
      x: this.base.x + Math.cos((this.base.angle - 90) * h.DEG) * rad,
      y: this.base.y + Math.sin((this.base.angle - 90) * h.DEG) * rad
    };
    this.x = (this.center.x + Math.cos(this.angle * h.DEG) * this.radius) / 2;
    this.y = (this.center.y + Math.sin(this.angle * h.DEG) * this.radius) / 2;
    minSuppress = this.ember != null ? this.ember.bottom.y - 50 : 9999;
    this.y = Math.min(minSuppress, this.y);
    return typeof this.onPositionChange === "function" ? this.onPositionChange() : void 0;
  };

  BasePoint.prototype.setOffset = function(offset) {
    this.offset = offset;
    return this.getPosition();
  };

  BasePoint.prototype.setAngle = function(angle) {
    this.angle = this.baseAngle + angle;
    return this.getPosition();
  };

  BasePoint.prototype.setSuppress = function(n) {
    this.suppress = n;
    return this.getPosition();
  };

  BasePoint.prototype.draw = function() {
    return;
    this.ctx.beginPath();
    this.ctx.lineWidth = h.PX;
    this.ctx.arc(this.center.x, this.center.y, 1 * h.PX, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(this.center.x, this.center.y);
    this.ctx.lineTo(this.x * h.PX, this.y * h.PX);
    return this.ctx.stroke();
  };

  return BasePoint;

})();

module.exports = BasePoint;



},{"./helpers":5}],2:[function(require,module,exports){
var Base, h;

h = require('./helpers');

Base = (function() {
  function Base(o) {
    this.o = o != null ? o : {};
    this.vars();
  }

  Base.prototype.vars = function() {
    this.ctx = this.o.ctx;
    this.x = this.o.x;
    this.initX = this.x;
    this.y = this.o.y;
    this.radius = this.o.radius;
    this.angle = this.o.angle;
    this.points = [];
    return this.suppress = 0;
  };

  Base.prototype.setAngle = function(angle) {
    var i, point, _i, _len, _ref, _results;
    this.angle = angle;
    _ref = this.points;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      point.getPosition();
      _results.push(point.setAngle(this.angle));
    }
    return _results;
  };

  Base.prototype.addPoint = function(point) {
    return this.points.push(point);
  };

  Base.prototype.setX = function(x) {
    var i, point, _i, _len, _ref, _results;
    this.x = x;
    _ref = this.points;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      _results.push(point.getPosition());
    }
    return _results;
  };

  Base.prototype.setSuppress = function(n) {
    var i, point, _i, _len, _ref, _results;
    this.suppress = n;
    _ref = this.points;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      _results.push(point.setSuppress(this.suppress));
    }
    return _results;
  };

  Base.prototype.draw = function() {
    var x, y;
    return;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 5 * h.PX, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'cyan';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.lineWidth = h.PX;
    this.ctx.strokeStyle = 'cyan';
    this.ctx.stroke();
    this.ctx.beginPath();
    x = this.x + Math.cos((this.angle - 90) * h.DEG) * this.radius;
    y = this.y + Math.sin((this.angle - 90) * h.DEG) * this.radius;
    this.ctx.lineWidth = h.PX;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = 'slateblue';
    return this.ctx.stroke();
  };

  return Base;

})();

module.exports = Base;



},{"./helpers":5}],3:[function(require,module,exports){
var Ember, TWEEN, h;

h = require('./helpers');

TWEEN = require('./tweenjs.min');

Ember = (function() {
  function Ember(o) {
    this.o = o != null ? o : {};
    this.ctx = this.o.ctx;
    this.top = this.o.top;
    this.flickRadius = this.o.flickRadius || 10;
    this.name = this.o.name;
    this.base = this.o.base;
    this.right = this.o.right;
    this.bottom = this.o.bottom;
    this.left = this.o.left;
    this.color = this.o.color || "deeppink";
    this.angleStep = this.o.angleStep || h.rand(30, 40);
    this.angleStart = this.o.angleStart || 0;
    this.basePoint = this.o.basePoint || this.top;
    this.basePoint.ember = this;
    this.basePoint.onPositionChange = (function(_this) {
      return function() {
        return _this.flickCenter = {
          x: _this.basePoint.x,
          y: _this.basePoint.y
        };
      };
    })(this);
    this.angle = this.angleStart;
    this.p = 0;
    if (!this.ctx) {
      console.error("no context, aborting");
      return;
    }
    this.getFlickBounds();
    this.delta = this.getDelta();
  }

  Ember.prototype.draw = function() {
    var ang, leftOffset, rightOffset, s, topOffset, topX, topY;
    this.ctx.beginPath();
    ang = this.base.angle;
    if (ang < 0) {
      leftOffset = ang / 2;
      rightOffset = ang;
    } else {
      leftOffset = ang;
      rightOffset = ang / 2;
    }
    s = this.base.suppress / 3;
    topOffset = 0;
    leftOffset = Math.max(s, leftOffset);
    this.ctx.moveTo((this.left.x + leftOffset) * h.PX, (this.left.y + s + topOffset) * h.PX);
    topX = this.top.x + (this.p * this.delta.x);
    topY = this.top.y + (this.p * this.delta.y);
    this.ctx.lineTo(topX * h.PX, topY * h.PX);
    this.ctx.lineTo((this.right.x + rightOffset) * h.PX, (this.right.y + s) * h.PX);
    this.ctx.lineTo(this.bottom.x * h.PX, this.bottom.y * h.PX);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.p += this.o.sensivity;
    if (this.p >= 1) {
      this.top.x = topX;
      this.top.y = topY;
      this.delta = this.getDelta();
      this.p = 0;
    }
    this.drawFlickBounds();
  };

  Ember.prototype.drawFlickBounds = function() {
    var x, y;
    return;
    this.ctx.beginPath();
    x = this.flickCenter.x * h.PX;
    y = this.flickCenter.y * h.PX;
    this.ctx.arc(x, y, this.flickRadius, 0, 2 * Math.PI);
    this.ctx.lineWidth = h.PX / 2;
    this.ctx.strokeStyle = '#777';
    this.ctx.stroke();
  };

  Ember.prototype.getFlickBounds = function() {
    var PX, flickCenter, flickRadius;
    PX = 2;
    flickCenter = {
      x: this.basePoint.x,
      y: this.basePoint.y
    };
    flickRadius = this.flickRadius * PX;
    this.flickCenter = flickCenter;
    this.flickCenterStart = {};
    this.flickCenterStart.x = flickCenter.x;
    this.flickCenterStart.y = flickCenter.y;
    this.flickRadius = flickRadius;
  };

  Ember.prototype.getDelta = function() {
    var ang, bAng, cX, cY, delta, newTop, oX, oY, rX, rY, speed, suppress;
    suppress = Math.abs(this.base.suppress);
    if (this.base.suppress > 0) {
      suppress /= 2;
    }
    speed = Math.abs(this.base.angle);
    this.speed = 60 - Math.max(speed, suppress);
    this.angle += this.angleStep / this.speed;
    ang = this.angle;
    rX = .1 * this.flickRadius;
    rY = 1 * this.flickRadius;
    cX = this.flickCenter.x;
    cY = this.flickCenter.y;
    bAng = this.base.angle * h.DEG;
    oX = cX - (rY * this.sin(ang)) * this.sin(bAng) + rX * this.cos(ang) * this.cos(bAng);
    oY = cY + (rX * this.cos(ang)) * this.sin(bAng) + rY * this.sin(ang) * this.cos(bAng);
    newTop = {
      x: oX,
      y: oY
    };
    return delta = {
      x: newTop.x - this.top.x,
      y: newTop.y - this.top.y
    };
  };

  Ember.prototype.sin = function(n) {
    return Math.sin.apply(n, arguments);
  };

  Ember.prototype.cos = function(n) {
    return Math.cos.apply(n, arguments);
  };

  return Ember;

})();

module.exports = Ember;



},{"./helpers":5,"./tweenjs.min":11}],4:[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map
},{}],5:[function(require,module,exports){
var Helpers;

Helpers = (function() {
  Helpers.prototype.PX = 2;

  Helpers.prototype.DEG = Math.PI / 180;

  Helpers.prototype.rand = function(min, max) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
  };

  Helpers.prototype.slice = function(val, max) {
    if (val < 0) {
      if (val < -max) {
        return -max;
      }
    }
    if (val > 0) {
      if (val > max) {
        return max;
      }
    }
    return val;
  };

  Helpers.prototype.transform = function(el, val) {
    el.style["" + this.prefix.js + "Transform"] = val;
    return el.style.transform = val;
  };

  function Helpers() {
    this.vars();
  }

  Helpers.prototype.vars = function() {
    this.prefix = this.getPrefix();
    return this.isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  };

  Helpers.prototype.getPrefix = function() {
    var dom, pre, styles, v;
    styles = window.getComputedStyle(document.documentElement, "");
    v = Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/);
    pre = (v || (styles.OLink === "" && ["", "o"]))[1];
    dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: "-" + pre + "-",
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  };

  return Helpers;

})();

module.exports = new Helpers;



},{}],6:[function(require,module,exports){
var Base, BasePoint, Ember, Hammer, Main, Shadow, Shaker, Spark, TWEEN, h, mojs;

Ember = require('./ember');

Spark = require('./spark');

Hammer = require('./hammer.min');

TWEEN = require('./tweenjs.min');

Base = require('./base');

BasePoint = require('./base-point');

Shadow = require('./shadow');

Shaker = require('./shaker');

h = require('./helpers');

mojs = require('./mojs.min');

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.prepareText();
    this.events();
    this.run();
    this.showTorch();
  }

  Main.prototype.stopNormalizingBase = function() {
    TWEEN.remove(this.tween);
    return this.isNormalizing = false;
  };

  Main.prototype.events = function() {
    var currTorchX, currTorchXOld, dir, isTouched, mc, tch, timeout, tm, torchSceneX;
    mc = new Hammer(document.body);
    tch = new Hammer(this.torch);
    isTouched = false;
    timeout = null;
    this.shaker = new Shaker;
    dir = '';
    tch.on('panleft', (function(_this) {
      return function(e) {
        if (dir === 'left') {
          return;
        }
        dir = 'left';
        return _this.shaker.setPosition({
          dir: 'left',
          timestamp: new Date().getTime()
        });
      };
    })(this));
    tch.on('panright', (function(_this) {
      return function(e) {
        if (dir === 'right') {
          return;
        }
        dir = 'right';
        return _this.shaker.setPosition({
          dir: 'right',
          timestamp: new Date().getTime()
        });
      };
    })(this));
    currTorchX = 0;
    torchSceneX = 0;
    tm = null;
    tch.on('pan', (function(_this) {
      return function(e) {
        var angleVelocity, coef, velocityX;
        torchSceneX = currTorchX + e.deltaX;
        velocityX = h.slice(e.velocityX, 6);
        angleVelocity = 12 * velocityX;
        if (Math.abs(velocityX) > 1) {
          _this.stopNormalizingBase();
          _this.ang = angleVelocity;
          _this.ang = h.slice(_this.ang, 35);
          _this.base.setAngle(_this.ang);
          coef = _this.shaker.isShake ? 2 : -1;
          _this.base.setSuppress(coef * Math.abs(9 * velocityX));
        } else {
          _this.normalizeBase();
        }
        return h.transform(_this.torchScene, "translateX(" + torchSceneX + "px)");
      };
    })(this));
    currTorchXOld = -1;
    setInterval((function(_this) {
      return function() {
        if (currTorchX === currTorchXOld && _this.isTorch) {
          return _this.normalizeBase();
        } else {
          return currTorchXOld = currTorchX;
        }
      };
    })(this), 100);
    tch.on('panstart', (function(_this) {
      return function(e) {
        _this.isTorch = true;
        return _this.hideLegend();
      };
    })(this));
    tch.on('panend', (function(_this) {
      return function(e) {
        _this.isTorch = false;
        currTorchX = torchSceneX;
        return _this.normalizeBase();
      };
    })(this));
    mc.on('tap', function(e) {
      isTouched = true;
      return this.hideLegend();
    });
    mc.on('panstart', (function(_this) {
      return function(e) {
        var pointer;
        _this.hideLegend();
        if (_this.isTorch) {
          return;
        }
        pointer = e.pointers[0];
        _this.base.panstart = {
          x: pointer.x,
          y: pointer.y
        };
        isTouched = true;
        TWEEN.remove(_this.tween);
        return _this.isNormalizing = false;
      };
    })(this));
    return mc.on('pan', (function(_this) {
      return function(e) {
        if (_this.isTorch) {
          return;
        }
        if (isTouched) {
          _this.ang = e.deltaX / 10;
          if (_this.ang > _this.MAX_ANGLE) {
            _this.ang = _this.MAX_ANGLE;
          }
          if (_this.ang < -_this.MAX_ANGLE) {
            _this.ang = -_this.MAX_ANGLE;
          }
          _this.base.setAngle(_this.ang);
          _this.suppress = e.deltaY / 20;
          _this.base.setSuppress(_this.suppress);
          if (!timeout) {
            return timeout = setTimeout(function() {
              isTouched = false;
              timeout = null;
              return _this.normalizeBase();
            }, 350);
          }
        }
      };
    })(this));
  };

  Main.prototype.normalizeBase = function() {
    var it;
    if (this.isNormalizing) {
      return;
    }
    this.isNormalizing = true;
    it = this;
    return this.tween = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1500).onUpdate(function() {
      it.base.setAngle(it.ang * (1 - this.p));
      return it.base.setSuppress(it.suppress * (1 - this.p));
    }).easing(TWEEN.Easing.Elastic.Out).onComplete((function(_this) {
      return function() {
        _this.suppress = 0;
        _this.ang = 0;
        return _this.isNormalizing = false;
      };
    })(this)).start();
  };

  Main.prototype.showLegend = function() {
    var it;
    it = this;
    return this.tweenText = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1200).onUpdate(function() {
      return it.legend.style.opacity = "" + this.p;
    }).delay(2000).easing(TWEEN.Easing.Cubic.Out).start();
  };

  Main.prototype.hideLegend = function() {
    !this.isLegendHidden && (this.legend.style.display = 'none');
    return this.isLegendHidden = true;
  };

  Main.prototype.showText = function() {
    var childs;
    childs = this.maskChilds;
    return this.tweenText = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1200).onUpdate(function() {
      var child, currOffset, i, _results;
      i = childs.length - 1;
      _results = [];
      while (i >= 0) {
        child = childs[i];
        if (child.strokeLength) {
          currOffset = child.strokeLength * (1 - this.p);
          child.style['stroke-dashoffset'] = "" + currOffset + "px";
        }
        _results.push(i--);
      }
      return _results;
    }).delay(200).onStart((function(_this) {
      return function() {
        return _this.text.style.display = 'block';
      };
    })(this)).onComplete((function(_this) {
      return function() {
        return _this.showMushroom();
      };
    })(this)).easing(TWEEN.Easing.Cubic.Out).start();
  };

  Main.prototype.showMushroom = function() {
    var it;
    it = this;
    return this.tweenMushroom = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 400).onUpdate(function() {
      return it.mushroom.style.opacity = "" + this.p;
    }).onStart((function(_this) {
      return function() {
        _this.mushroom.style.display = 'block';
        return _this.burst.run();
      };
    })(this)).onComplete((function(_this) {
      return function() {
        return _this.showLegend();
      };
    })(this)).easing(TWEEN.Easing.Cubic.Out).start();
  };

  Main.prototype.prepareText = function() {
    var i, length, path, torch, _i, _len, _ref, _results;
    _ref = this.maskChilds;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      path = _ref[i];
      length = path.getTotalLength();
      if (length > 50) {
        torch = path.getAttribute('torch');
        path.style['stroke-dasharray'] = "" + length + "px";
        path.style['stroke-dashoffset'] = "" + (-length) + "px";
        path.strokeLength = length;
        _results.push(path.isTorch = !!torch);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Main.prototype.showTorch = function() {
    var it;
    it = this;
    return this.tweenTorch = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 300).onUpdate(function() {
      it.torch.style.opacity = this.p;
      h.transform(it.torch, "translateY(" + (25 * (1 - this.p)) + "px)");
      if (this.p > .5 && !it.isShowRun) {
        return it.showFire();
      }
    }).easing(TWEEN.Easing.Cubic.Out).delay(1000).onComplete((function(_this) {
      return function() {
        return _this.showText();
      };
    })(this)).start();
  };

  Main.prototype.showFire = function() {
    var i, it, lefts, offsets, rights;
    this.isShowRun = true;
    it = this;
    lefts = [];
    rights = [];
    offsets = [];
    i = it.embers.length - 1;
    while (i >= 0) {
      lefts[i] = {
        x: it.embers[i].left.x,
        y: it.embers[i].left.y
      };
      rights[i] = {
        x: it.embers[i].right.x,
        y: it.embers[i].right.y
      };
      offsets[i] = it.embers[i].basePoint.offset;
      i--;
    }
    return this.tweenShow = new TWEEN.Tween({
      p: 0
    }).to({
      p: 1
    }, 1500).onUpdate(function() {
      var ember, left, newLeftX, newLeftY, newRightX, newRightY, right, transform, _results;
      i = it.embers.length - 1;
      _results = [];
      while (i >= 0) {
        ember = it.embers[i];
        left = lefts[i];
        right = rights[i];
        newLeftX = it.startX + ((left.x - it.startX) * this.p);
        newLeftY = (it.startY + 60) + ((left.y - (it.startY + 60)) * this.p);
        newRightX = it.startX + ((right.x - it.startX) * this.p);
        newRightY = (it.startY + 60) + ((right.y - (it.startY + 60)) * this.p);
        ember.left = {
          x: newLeftX,
          y: newLeftY
        };
        ember.right = {
          x: newRightX,
          y: newRightY
        };
        ember.basePoint.setOffset(250 + ((offsets[i] - 250) * this.p));
        transform = "scale(" + this.p + ") translateY(" + (300 * (1 - this.p)) + "px)";
        h.transform(it.shadow.shadow, transform);
        _results.push(i--);
      }
      return _results;
    }).onStart((function(_this) {
      return function() {
        return _this.isShowed = true;
      };
    })(this)).easing(TWEEN.Easing.Elastic.Out).start();
  };

  Main.prototype.vars = function() {
    var child, childs, i, _i, _len, _ref;
    this.canvas = document.getElementById("js-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.wWidth = parseInt(this.canvas.getAttribute('width'), 10);
    this.torch = document.getElementById('js-torch');
    this.legend = document.getElementById('js-legend');
    this.mask = document.getElementById('js-text-mask');
    this.maskChilds = this.mask.childNodes;
    childs = [];
    _ref = this.maskChilds;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      child = _ref[i];
      if (child.getTotalLength) {
        childs.push(child);
      }
    }
    this.maskChilds = childs;
    this.text = document.getElementById('js-text');
    this.scene = document.getElementById('js-scene');
    this.torchScene = document.getElementById('js-torch-scene');
    this.mushroom = document.getElementById('js-mushroom');
    this.animationLoop = this.animationLoop.bind(this);
    this.embers = [];
    this.sparks = [];
    this.basePoints = [];
    this.MAX_ANGLE = 35;
    this.suppress = 0;
    this.startX = this.wWidth / 4;
    this.startY = 390;
    this.burst = new mojs.Burst({
      parent: this.scene,
      isRunLess: true,
      duration: 800,
      cnt: 5,
      radius: {
        75: 150
      },
      color: '#FFC37B',
      bitRadius: {
        3: 0
      },
      lineWidth: {
        2: 0
      },
      position: {
        x: 672,
        y: 394
      },
      easing: 'Cubic.Out'
    });
    this.base = new Base({
      ctx: this.ctx,
      x: (this.startX + 10) * h.PX,
      y: (this.startY + 60) * h.PX,
      radius: 400 * h.PX,
      angle: 0
    });
    this.shadow = new Shadow({
      base: this.base
    });
    this.basePoint1 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 4,
      offset: 71,
      angle: 0
    });
    this.base.addPoint(this.basePoint1);
    this.basePoint11 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 15,
      offset: 61,
      angle: 0
    });
    this.base.addPoint(this.basePoint11);
    this.basePoint2 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 30,
      offset: 182,
      angle: -180
    });
    this.base.addPoint(this.basePoint2);
    this.basePoint21 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 20,
      offset: 182,
      angle: -180
    });
    this.base.addPoint(this.basePoint21);
    this.basePoint3 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 24,
      offset: 101,
      angle: 0
    });
    this.base.addPoint(this.basePoint3);
    this.basePoint31 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 22,
      offset: 106,
      angle: 0
    });
    this.base.addPoint(this.basePoint31);
    this.basePoint4 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 34,
      offset: 173,
      angle: 0
    });
    this.base.addPoint(this.basePoint4);
    this.basePoint41 = new BasePoint({
      ctx: this.ctx,
      base: this.base,
      radius: 42,
      offset: 193,
      angle: 0
    });
    return this.base.addPoint(this.basePoint41);
  };

  Main.prototype.run = function() {
    var ember1, ember11, ember2, ember21, ember3, ember4, ember41, spark1, spark2, spark3, spark4, spark5, spark6, spark7, spark8;
    this.animationLoop();
    ember1 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      flickRadius: 20,
      color: "#E86CA9",
      top: {
        x: this.startX + 14,
        y: this.startY - 270
      },
      right: {
        x: this.startX + 64,
        y: this.startY + 12
      },
      bottom: {
        x: this.startX + 10,
        y: this.startY + 60
      },
      left: {
        x: this.startX - 44,
        y: this.startY + 20
      },
      basePoint: this.basePoint1,
      base: this.base,
      name: '1'
    });
    ember11 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      angleStart: 90,
      flickRadius: 20,
      color: "#E86CA9",
      top: {
        x: this.startX + 24,
        y: this.startY - 280
      },
      right: {
        x: this.startX + 64,
        y: this.startY + 12
      },
      bottom: {
        x: this.startX + 10,
        y: this.startY + 60
      },
      left: {
        x: this.startX - 4,
        y: this.startY + 20
      },
      basePoint: this.basePoint11,
      base: this.base,
      name: '11'
    });
    ember2 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      angleStart: 20,
      flickRadius: 20,
      color: "#ED8CBA",
      top: {
        x: this.startX - 20,
        y: this.startY - 160
      },
      right: {
        x: this.startX,
        y: this.startY + 10
      },
      bottom: {
        x: this.startX,
        y: this.startY + 52
      },
      left: {
        x: this.startX - 68,
        y: this.startY + 4
      },
      basePoint: this.basePoint2,
      base: this.base,
      name: '2'
    });
    ember21 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      angleStart: 90,
      flickRadius: 20,
      color: "#ED8CBA",
      top: {
        x: this.startX - 10,
        y: this.startY - 160
      },
      right: {
        x: this.startX,
        y: this.startY + 10
      },
      bottom: {
        x: this.startX,
        y: this.startY + 52
      },
      left: {
        x: this.startX - 68,
        y: this.startY + 4
      },
      basePoint: this.basePoint21,
      base: this.base,
      name: '21'
    });
    ember3 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      flickRadius: 20,
      color: "#A4D7F5",
      top: {
        x: this.startX + 33,
        y: this.startY - 240
      },
      right: {
        x: this.startX + 48,
        y: this.startY - 22
      },
      bottom: {
        x: this.startX + 10,
        y: this.startY + 60
      },
      left: {
        x: this.startX - 20,
        y: this.startY - 20
      },
      basePoint: this.basePoint3,
      base: this.base,
      name: '3'
    });
    ember4 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      flickRadius: 20,
      color: "#F6D58A",
      top: {
        x: this.startX + 52,
        y: this.startY - 148
      },
      right: {
        x: this.startX + 76,
        y: this.startY + 2
      },
      bottom: {
        x: this.startX,
        y: this.startY + 70
      },
      left: {
        x: this.startX,
        y: this.startY + 10
      },
      basePoint: this.basePoint4,
      base: this.base,
      name: '4'
    });
    ember41 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      angleStep: 45,
      angleStart: 90,
      flickRadius: 20,
      color: "#F6D58A",
      top: {
        x: this.startX + 44,
        y: this.startY - 168
      },
      right: {
        x: this.startX + 76,
        y: this.startY + 2
      },
      bottom: {
        x: this.startX,
        y: this.startY + 70
      },
      left: {
        x: this.startX,
        y: this.startY + 10
      },
      basePoint: this.basePoint41,
      base: this.base,
      name: '41'
    });
    this.embers.push(ember1, ember11);
    this.embers.push(ember2, ember21);
    this.embers.push(ember3);
    this.embers.push(ember4, ember41);
    spark1 = new Spark({
      ctx: this.ctx,
      color: "#F6D58A",
      base: this.base
    });
    spark2 = new Spark({
      ctx: this.ctx,
      color: "#D5296F",
      isDelayed: true,
      base: this.base
    });
    spark3 = new Spark({
      ctx: this.ctx,
      color: "#65B4ED",
      isDelayed: true,
      base: this.base
    });
    spark4 = new Spark({
      ctx: this.ctx,
      color: "#EA69A9",
      base: this.base
    });
    spark5 = new Spark({
      ctx: this.ctx,
      color: "#65B4ED",
      base: this.base
    });
    spark6 = new Spark({
      ctx: this.ctx,
      color: "#F6D58A",
      base: this.base
    });
    spark7 = new Spark({
      ctx: this.ctx,
      color: "#D5296F",
      base: this.base
    });
    spark8 = new Spark({
      ctx: this.ctx,
      color: "#EA69A9",
      base: this.base
    });
    this.sparks.push(spark1);
    this.sparks.push(spark2);
    this.sparks.push(spark3);
    this.sparks.push(spark4);
    this.sparks.push(spark5);
    this.sparks.push(spark6);
    this.sparks.push(spark7);
    this.sparks.push(spark8);
    return this.ctx.globalCompositeOperation = "multiply";
  };

  Main.prototype.animationLoop = function() {
    var i;
    if (this.isShowed) {
      this.ctx.clearRect(0, 0, this.wWidth, this.wWidth);
      this.shadow.draw();
      i = this.sparks.length - 1;
      while (i >= 0) {
        this.sparks[i].draw();
        i--;
      }
      i = this.embers.length - 1;
      while (i >= 0) {
        this.embers[i].draw();
        i--;
      }
    }
    TWEEN.update();
    return requestAnimationFrame(this.animationLoop);
  };

  return Main;

})();

new Main;



},{"./base":2,"./base-point":1,"./ember":3,"./hammer.min":4,"./helpers":5,"./mojs.min":7,"./shadow":8,"./shaker":9,"./spark":10,"./tweenjs.min":11}],7:[function(require,module,exports){
!function t(i,e,s){function n(o,h){if(!e[o]){if(!i[o]){var a="function"==typeof require&&require;if(!h&&a)return a(o,!0);if(r)return r(o,!0);throw new Error("Cannot find module '"+o+"'")}var p=e[o]={exports:{}};i[o][0].call(p.exports,function(t){var e=i[o][1][t];return n(e?e:t)},p,p.exports,t,i,e,s)}return e[o].exports}for(var r="function"==typeof require&&require,o=0;o<s.length;o++)n(s[o]);return n}({1:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};s=t("./byte"),e=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.vars=function(){return i.__super__.vars.apply(this,arguments),this.spikes=this["default"]({prop:"spikes",def:5}),this.spikesEnd=this["default"]({prop:"spikesEnd",def:this.spikes}),this.rate=this["default"]({prop:"rate",def:.25}),this.rateEnd=this["default"]({prop:"rateEnd",def:this.rate})},i.prototype.run=function(t,e){var s,n;return this.oa=null!=t?t:{},i.__super__.run.apply(this,arguments),s=this,this.from=this.oa.isChain?e:{radiusX:this.radiusX,radiusY:this.radiusY,lineWidth:this.lineWidth,angle:this.angleStart,opacity:this.opacity,lineDashOffset:this.lineDashOffset,spikes:this.spikes,rate:this.rate},this.to={radiusX:this.radiusXEnd,radiusY:this.radiusYEnd,lineWidth:this.lineWidthEnd,angle:this.angleEnd,opacity:this.opacityEnd,lineDashOffset:this.lineDashOffsetEnd,spikes:this.spikesEnd,rate:this.rateEnd},this.mixStarSpikesProps(),this.mixLineDash(),this.mixColor(this.oa.isChain),this.mixFill(this.oa.isChain),this.calcSize(),this.addElements(),n=this.initTween(this.oa.isChain).onUpdate(function(){return s.draw.call(this,s)}),this.tweens.push(n)},i.prototype.draw=function(t){return t.rotate({angle:this.angle*t.h.DEG}),t.object.setProp({radiusX:this.radiusX/2,radiusY:this.radiusY/2,position:{x:2*t.center,y:2*t.center},lineWidth:this.lineWidth,lineDash:t.updateLineDash(this),colorObj:t.updateColor(this),fillObj:t.updateFill(this),opacity:this.opacity,spikes:this.spikes,rate:this.rate,lineDashOffset:this.lineDashOffset}),t.ctx.restore()},i.prototype.addElements=function(){var t;return t=this.shapes[this.shape.toLowerCase()]||Circle,this.object=new t({ctx:this.ctx,position:{x:this.center,y:this.center},lineCap:this.lineCap,lineDash:this.lineDash,fill:this.fill})},i.prototype.mixStarSpikesProps=function(){return this.from.spikes=this.spikes,this.to.spikes=this.spikesEnd},i}(s),i.exports=e},{"./byte":4}],2:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};s=t("./byte"),e=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.vars=function(){return i.__super__.vars.apply(this,arguments),this.Shape=this.shapes[this.shape.toLowerCase()]||Circle,this.cnt=this["default"]({prop:"cnt",def:3}),this.degree=this["default"]({prop:"degree",def:360}),this.degreeEnd=this["default"]({prop:"degreeEnd",def:this.degree}),this.bitSpikes=this["default"]({prop:"bitSpikes",def:5}),this.bitSpikesEnd=this["default"]({prop:"bitSpikesEnd",def:this.bitSpikes}),this.bitAngle=this["default"]({prop:"bitAngle",def:0}),this.bitAngleEnd=this["default"]({prop:"bitAngleEnd",def:this.bitAngle}),this.bitRate=this["default"]({prop:"bitRate",def:.5}),this.bitRateEnd=this["default"]({prop:"bitRateEnd",def:this.bitRate}),this.bitRadius=this["default"]({prop:"bitRadius",def:10}),this.bitRadiusEnd=this["default"]({prop:"bitRadiusEnd",def:this.bitRadius})},i.prototype.run=function(t,e){var s,n;return this.oa=null!=t?t:{},i.__super__.run.apply(this,arguments),s=this,this.from=this.oa.isChain?e:{radiusX:this.radiusX,radiusY:this.radiusY,bitAngle:this.bitAngle,lineWidth:this.lineWidth,bitRadius:this.bitRadius,degree:this.degree,angle:this.angle,spikes:this.bitSpikesEnd,bitRate:this.bitRate,lineDashOffset:this.lineDashOffset},this.to={radiusX:this.radiusXEnd,radiusY:this.radiusYEnd,bitAngle:this.bitAngleEnd,lineWidth:this.lineWidthEnd,bitRadius:this.bitRadiusEnd,degree:this.degreeEnd,angle:this.angleEnd,spikes:this.spikesEnd,bitRate:this.bitRateEnd,lineDashOffset:this.lineDashOffsetEnd},this.mixStarSpikesProps(),this.mixLineDash(),this.mixColor(this.oa.isChain),this.mixFill(this.oa.isChain),this.calcSize(),this.addElements(),this.degreeCnt=this.degree%360===0?this.cnt:this.cnt-1,this.rotStep=this.degree/this.degreeCnt,n=this.initTween(this.oa.isChain).onUpdate(function(){return s.draw.call(this,s)}),this.tweens.push(n)},i.prototype.draw=function(t){var i,e,s,n,r,o,h,a,p,u,l,f,d;for(e=t.degreeCnt,o=t.rotStep,t.rotate({angle:this.angle*t.h.DEG}),t.ctx.clear(),a=this.degree/e,i=0,r=0,d=t.els,n=l=0,f=d.length;f>l;n=++l)s=d[n],h=(i+t.angle)*t.h.DEG,p=2*t.center+Math.cos(h)*this.radiusX,u=2*t.center+Math.sin(h)*this.radiusY,s.setProp({position:{x:p,y:u},angle:r+this.bitAngle,lineWidth:this.lineWidth,fillObj:t.updateFill(this),colorObj:t.updateColor(this),radiusX:this.bitRadius,radiusY:this.bitRadius,spikes:this.spikes,rate:this.bitRate,lineDash:t.updateLineDash(this),lineDashOffset:this.lineDashOffset}),i+=a,r+=o;return t.ctx.restore()},i.prototype.addElements=function(){var t,i,e,s;for(null==this.els&&(this.els=[]),this.els.length=0,s=[],t=i=0,e=this.cnt;e>=0?e>i:i>e;t=e>=0?++i:--i)s.push(this.els.push(new this.Shape({ctx:this.ctx,parentSize:{x:this.sizeX,y:this.sizeY},position:{x:2*this.center,y:2*this.center},isClearLess:!0,radius:this.bitRadius,color:this.color,fill:this.fill,spikes:this.bitSpikes,rate:this.bitRate,lineDash:this.lineDash})));return s},i.prototype.mixStarSpikesProps=function(){return this.from.spikes=this.spikes,this.to.spikes=this.spikesEnd,this.from.rate=this.rate,this.to.rate=this.rateEnd},i}(s),i.exports=e},{"./byte":4}],3:[function(t,i){var e,s,n;n=t("../helpers"),t("../polyfills"),s=t("../vendor/tween"),e=function(){function t(t){this.o=null!=t?t:{},this.vars(),this.o.isRunLess||("function"==typeof this.run?this.run():void 0)}return t.prototype.oa={},t.prototype.h=n,t.prototype.TWEEN=s,t.prototype.deg=Math.PI/180,t.prototype.DEG=Math.PI/180,t.prototype.px=n.pixel,t.prototype.parent=n.body,t.prototype.vars=function(){return this.ctx=this.o.ctx||this.ctx,this.px=n.pixel,this.parent=this["default"]({prop:"parent",def:n.body}),this.color=this["default"]({prop:"color",def:"#222"}),this.colorMap=this["default"]({prop:"colorMap",def:[this.color]}),this.fill=this["default"]({prop:"fill",def:"rgba(0,0,0,0)"}),this.fillEnd=this["default"]({prop:"fillEnd",def:this.fill}),this.lineWidth=this["default"]({prop:"lineWidth",def:1}),this.lineCap=this["default"]({prop:"lineCap",def:"round"}),this.opacity=this["default"]({prop:"opacity",def:1}),this.isClearLess=this["default"]({prop:"isClearLess",def:!1}),this.colorObj=n.makeColorObj(this.color),this.fillObj=this.h.makeColorObj(this.fill)},t.prototype.setProp=function(t){var i,e;for(i in t)e=t[i],null!=e&&(this[i]=e);return this.render()},t.prototype["default"]=function(t){var i,e;return e=t.prop,i=t.def,this.syntaxSugar({o:this.o,prop:e}),this.syntaxSugar({o:this.oa,prop:e}),this[e]=null!=this.oa[e]?this.oa[e]:null!=this.o[e]?this.o[e]:null!=this[e]?this[e]:i},t.prototype.defaultPart=function(t){return this[t.prop]=null,this["default"](t)},t.prototype.syntaxSugar=function(t){var i,e,s,n,r;if(t.o[t.prop]&&this.h.isObj(t.o[t.prop])){if(null!=(null!=(s=t.o[t.prop])?s.end:void 0))return t.o[""+t.prop+"End"]=t.o[t.prop].end,t.o[""+t.prop]=t.o[t.prop].start;if(!t.o[t.prop].x){n=t.o[t.prop],r=[];for(i in n){e=n[i],"lineDash"!==t.prop&&"lineDashEnd"!==t.prop?(t.o[""+t.prop+"End"]=e,t.o[""+t.prop]=parseFloat(i)):(t.o[""+t.prop+"End"]=this.stringToArray(e),t.o[""+t.prop]=this.stringToArray(i));break}return r}}},t.prototype.stringToArray=function(t){var i,e,s,n,r,o;for(i=[],o=t.split(","),e=n=0,r=o.length;r>n;e=++n)s=o[e],i.push(parseFloat(s));return i},t}(),i.exports=e},{"../helpers":14,"../polyfills":15,"../vendor/tween":16}],4:[function(t,i){var e,s,n,r,o,h,a,p,u,l,f={}.hasOwnProperty,d=function(t,i){function e(){this.constructor=t}for(var s in i)f.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};l=t("../helpers"),e=t("./bit"),n=t("./objects/circle"),h=t("./objects/rectangle"),p=t("./objects/triangle"),a=t("./objects/star"),r=t("./objects/cross"),o=t("./objects/line"),u=t("./objects/zigzag"),s=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return d(i,t),i.prototype.shapes={circle:n,rectangle:h,triangle:p,star:a,cross:r,line:o,zigzag:u},i.prototype.vars=function(){return this.isShowStart=this["default"]({prop:"isShowStart",def:!1}),this.isShowEnd=this["default"]({prop:"isShowEnd",def:!1}),this.parent=this.o.parent||l.body,this.el=this.oa.el||this.o.el||this.el||this.createEl(),this.ctx=this.o.ctx||this.ctx||this.el.getContext("2d"),i.__super__.vars.apply(this,arguments),this.defaultByteVars(),this.s=1*l.time(1),null==this.tweens&&(this.tweens=[]),null!=this.chains?this.chains:this.chains=[]},i.prototype.run=function(t,i){var e,s,n,r,o;if(this.oa=null!=t?t:{},l.size(this.oa)&&this.vars(),!i){for(o=this.tweens,e=n=0,r=o.length;r>n;e=++n)s=o[e],this.TWEEN.remove(s);return this.tweens.length=0,this.chains.length=0}},i.prototype.mixLineDash=function(){var t,i,e,s,n,r,o,h,a;if(this.lineDash&&this.lineDashEnd){for(o=this.lineDash,i=e=0,n=o.length;n>e;i=++e)t=o[i],this.from["lineDash"+i]=t;for(h=this.lineDashEnd,a=[],i=s=0,r=h.length;r>s;i=++s)t=h[i],a.push(this.to["lineDash"+i]=t);return a}},i.prototype.mixColor=function(t){return this.color&&this.colorEnd&&(t||(this.from.r=this.colorObj.r,this.from.g=this.colorObj.g,this.from.b=this.colorObj.b,this.from.a=this.colorObj.a),this.to.r=this.colorEndObj.r,this.to.g=this.colorEndObj.g,this.to.b=this.colorEndObj.b,this.to.a=this.colorEndObj.a),this.colorObjTween=l.clone(this.colorObj)},i.prototype.mixFill=function(t){return this.fill&&this.fillEnd&&(t||(this.from.fr=this.fillObj.r,this.from.fg=this.fillObj.g,this.from.fb=this.fillObj.b,this.from.fa=this.fillObj.a),this.to.fr=this.fillEndObj.r,this.to.fg=this.fillEndObj.g,this.to.fb=this.fillEndObj.b,this.to.fa=this.fillEndObj.a),this.fillObjTween=l.clone(this.fillObj)},i.prototype.updateColor=function(t){return this.colorObjTween.r=parseInt(t.r,10),this.colorObjTween.g=parseInt(t.g,10),this.colorObjTween.b=parseInt(t.b,10),this.colorObjTween.a=parseFloat(t.a),this.colorObjTween},i.prototype.updateFill=function(t){return this.fillObjTween.r=parseInt(t.fr,10),this.fillObjTween.g=parseInt(t.fg,10),this.fillObjTween.b=parseInt(t.fb,10),this.fillObjTween.a=parseFloat(t.fa),this.fillObjTween},i.prototype.updateLineDash=function(t){var i,e,s,n;if(i=0,s=[],this.lineDash&&this.lineDashEnd)for(e in t)n=t[e],("lineDash0"===e||e==="lineDash"+i)&&(s.push(n),i++);return s},i.prototype.initTween=function(t){var i;return i=new this.TWEEN.Tween(this.from).to(this.to,this.duration*this.s).delay(this.delay*this.s).easing(this.TWEEN.Easing[this.easings[0]][this.easings[1]]).repeat(this.repeat-1).onStart(function(i){return function(){var e;return i.setElSize(),i.isRunning=!0,!t&&i.ctx.clear(),(!i.isShowStart||i.isShowEnd)&&(i.el.style.display="block"),null!=(e=i.o.onStart)?e.call(i,arguments):void 0}}(this)).onComplete(function(t){return function(){var i,e,s;return t.isShowStart=!1,null!=(e=t.onComplete)&&e.call(t,arguments),i=null!=(s=t.chains)?s[0]:void 0,i?t.runFromChain(i):(!t.isShowEnd&&(t.el.style.display="none"),t.isRunning=!1)}}(this)).yoyo(this.yoyo).start(),l.startAnimationLoop(),i},i.prototype.runFromChain=function(t){var i;return i=this.h.clone(this.to),t.isChain=!0,null==t.onComplete&&(t.onComplete=function(){}),null==t.onStart&&(t.onStart=function(){}),null==t.repeat&&(t.repeat=0),null==t.yoyo&&(t.yoyo=!1),null==t.delay&&(t.delay=0),null==t.duration&&(t.duration=400*this.s),this.run(t,i),this.chains.shift()},i.prototype.chain=function(t){return null==t&&(t={}),this.isRunning?this.chains.push(t):this.runFromChain(t)},i.prototype.defaultByteVars=function(){var t,i,e;return this.radius=this["default"]({prop:"radius",def:100}),this.radiusX=this["default"]({prop:"radiusX",def:this.radius}),this.radiusY=this["default"]({prop:"radiusY",def:this.radius}),this.radiusEnd=this["default"]({prop:"radiusEnd",def:this.radius}),this.radiusXEnd=this.defaultPart({prop:"radiusXEnd",def:this.radiusEnd}),this.radiusYEnd=this.defaultPart({prop:"radiusYEnd",def:this.radiusEnd}),this.lineWidth=this["default"]({prop:"lineWidth",def:1}),this.lineWidthMiddle=this["default"]({prop:"lineWidthMiddle",def:null}),this.lineWidthEnd=this["default"]({prop:"lineWidthEnd",def:this.lineWidth}),this.lineDashOffset=this["default"]({prop:"lineDashOffset",def:0}),this.lineDashOffsetEnd=this["default"]({prop:"lineDashOffsetEnd",def:this.lineDashOffset}),this.lineDash=this["default"]({prop:"lineDash",def:[]}),this.lineDashEnd=this["default"]({prop:"lineDashEnd",def:this.lineDash}),this.normalizeLineDashes(),this.opacity=this["default"]({prop:"opacity",def:1}),this.opacityEnd=this["default"]({prop:"opacityEnd",def:this.opacity}),this.colorEnd=this["default"]({prop:"colorEnd",def:this.color}),this.colorEnd&&(this.colorEndObj=l.makeColorObj(this.colorEnd)),this.fillEnd&&(this.fillEndObj=l.makeColorObj(this.fillEnd)),this.colorMap=this["default"]({prop:"colorMap",def:[this.color]}),this.angle=this["default"]({prop:"angle",def:0}),this.angleStart=this["default"]({prop:"angleStart",def:this.angle}),this.angleEnd=this["default"]({prop:"angleEnd",def:this.angleStart}),this.shape=this["default"]({prop:"shape",def:"circle"}),this.Shape=this.shapes[this.shape.toLowerCase()]||n,this.repeat=this["default"]({prop:"repeat",def:0}),this.yoyo=this["default"]({prop:"yoyo",def:!1}),this.duration=this["default"]({prop:"duration",def:400}),this.delay=this["default"]({prop:"delay",def:0}),this.easing=this.defaultPart({prop:"easing",def:"Linear.None"}),this.easings=this.easing.split("."),this.onComplete=this["default"]({prop:"onComplete",def:null}),this.onStart=this["default"]({prop:"onStart",def:null}),t=Math.abs,i=Math.max(t(this.radiusXEnd),t(this.radiusYEnd)),e=Math.max(t(this.radiusX),t(this.radiusY)),this.maxRadius=Math.max(i,e),this.maxLineWidth=Math.max(this.lineWidthEnd,this.lineWidthMiddle,this.lineWidth)},i.prototype.normalizeLineDashes=function(){var t,i,e,s,n,r,o,h,a,p,u;if(this.lineDash.length<this.lineDashEnd.length)for(a=this.lineDashEnd,i=n=0,o=a.length;o>n;i=++n)t=a[i],null==(e=this.lineDash)[i]&&(e[i]=this.lineDash[0]);if(this.lineDash.length>this.lineDashEnd.length){for(p=this.lineDash,u=[],i=r=0,h=p.length;h>r;i=++r)t=p[i],u.push(null!=(s=this.lineDashEnd)[i]?s[i]:s[i]=this.lineDashEnd[0]);return u}},i.prototype.createEl=function(){return this.el=document.createElement("canvas"),this.el.style.position="absolute",this.el.style.left=0,this.el.style.top=0,!this.isShowStart&&(this.el.style.display="none"),this.parent.appendChild(this.el)},i.prototype.calcSize=function(){var t,i,e,s;return t=Math.abs,i=Math.max(t(this.to.radiusX),t(this.to.radiusY)),s=Math.max(t(this.from.radiusX),t(this.from.radiusY)),this.maxRadius=Math.max(i,s),this.maxLineWidth=Math.max(this.from.lineWidth,this.to.lineWidth),this.maxBitRadius=Math.max(this.from.bitRadius,this.to.bitRadius),this.maxBitRadius|=0,this.size=2*(this.maxRadius+2*this.maxLineWidth+2*this.maxBitRadius),e=Math.max(this.from.rate,this.to.rate),e>1&&(this.size*=e),this.center=this.size/2,this.sizeX=this.size,this.sizeY=this.size,this.centerX=this.sizeX/2,this.centerY=this.sizeY/2,this.position=this["default"]({prop:"position",def:{x:this.sizeX/2,y:this.sizeY/2}})},i.prototype.setElSize=function(){return this.el.setAttribute("width",l.pixel*this.sizeX),this.el.setAttribute("height",l.pixel*this.sizeY),l.pixel>1&&(this.el.style.width=""+this.sizeX+"px",this.el.style.height=""+this.sizeY+"px"),this.posit(),this.el},i.prototype.setPosition=function(t,i){return null==i&&(i=0),this.position.x=t,null!=i&&(this.position.y=i),this.posit()},i.prototype.posit=function(){var t,i;return t=this.position.x-this.sizeX/2,i=this.position.y-this.sizeY/2,this.el.style.left=""+t+"px",this.el.style.top=""+i+"px"},i.prototype.rotate=function(t){return this.ctx.save(),this.ctx.translate(2*this.centerX,2*this.centerY),this.ctx.rotate(t.angle),this.ctx.translate(-2*this.centerX,-2*this.centerY)},i}(e),i.exports=s},{"../helpers":14,"./bit":3,"./objects/circle":5,"./objects/cross":6,"./objects/line":7,"./objects/rectangle":9,"./objects/star":10,"./objects/triangle":11,"./objects/zigzag":12}],5:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};s=t("./object"),e=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="circle",i.prototype.vars=function(){return this.degree=this["default"]({prop:"degree",def:360}),this.degreeOffset=this["default"]({prop:"degreeOffset",def:0}),i.__super__.vars.apply(this,arguments)},i.prototype.render=function(){return this.preRender(),this.ctx.arc(1,1,1,this.degreeOffset*this.deg,(this.degree+this.degreeOffset)*this.deg,!1),this.postRender()},i}(s),i.exports=e},{"./object":8}],6:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};s=t("./object"),e=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="Cross",i.prototype.render=function(){return this.preRender(),this.ctx.moveTo(1,0),this.ctx.lineTo(1,2),this.ctx.moveTo(0,1),this.ctx.lineTo(2,1),this.postRender()},i}(s),i.exports=e},{"./object":8}],7:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};s=t("./object"),e=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="Line",i.prototype.render=function(){return this.preRender(),this.ctx.moveTo(0,1),this.ctx.lineTo(2,1),this.postRender()},i}(s),i.exports=e},{"./object":8}],8:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};e=t("../bit"),s=function(t){function i(t){this.o=null!=t?t:{},this.vars()}return r(i,t),i.prototype.vars=function(){var t;return this.ctx=this.o.ctx||this.ctx,this.px=this.h.pixel,this.parent=this["default"]({prop:"parent",def:this.h.body}),this.color=this["default"]({prop:"color",def:"#222"}),this.fill=this["default"]({prop:"fill",def:"#222"}),this.lineWidth=this["default"]({prop:"lineWidth",def:1}),this.lineCap=this["default"]({prop:"lineCap",def:"round"}),this.opacity=this["default"]({prop:"opacity",def:1}),this.isClearLess=this["default"]({prop:"isClearLess",def:!1}),this.angle=this["default"]({prop:"angle",def:0}),this.lineDash=this["default"]({prop:"lineDash",def:[]}),this.lineDashOffset=this["default"]({prop:"lineDashOffset",def:0}),this.radius=this["default"]({prop:"radius",def:50}),this.radiusX=this.defaultPart({prop:"radiusX",def:this.radius}),this.radiusY=this.defaultPart({prop:"radiusY",def:this.radius}),this.size={width:2*this.radiusX,height:2*this.radiusY},t={x:this.size.width/2,y:this.size.height/2},this.position=this["default"]({prop:"position",def:t}),this.colorObj=this.h.makeColorObj(this.color),this.fillObj=this.h.makeColorObj(this.fill)},i.prototype.renderStart=function(){var t;return t=this.name||"object",this.ctx?(this.isClearLess||this.ctx.clear(),this.ctx.save(),this.ctx.beginPath()):void console.error(""+t+".render: no context!")},i.prototype.preRender=function(){return this.renderStart(),this.rotation(),this.radiusRender()},i.prototype.postRender=function(){var t;return t=this.fillObj,this.ctx.fillStyle="rgba("+t.r+","+t.g+","+t.b+", "+(this.opacity-(1-t.a))+")",this.ctx.fill(),this.ctx.restore(),this.stroke()},i.prototype.rotation=function(){var t,i;return t=this.position.x,i=this.position.y,this.ctx.translate(t,i),this.ctx.rotate(this.angle*this.h.DEG),this.ctx.translate(-t,-i)},i.prototype.radiusRender=function(){return this.ctx.translate(this.position.x-4*this.radiusX,this.position.y-4*this.radiusY),this.ctx.scale(4*this.radiusX,4*this.radiusY)},i.prototype.stroke=function(){var t,i;return this.ctx.lineWidth=this.lineWidth*this.px,this.ctx.lineCap=this.lineCap,this.ctx.lineDashOffset=this.lineDashOffset,"function"==typeof(i=this.ctx).setLineDash&&i.setLineDash(this.lineDash),t=this.colorObj,this.ctx.strokeStyle="rgba("+t.r+","+t.g+","+t.b+", "+(this.opacity-(1-t.a))+")",this.lineWidth>0&&this.ctx.stroke()},i}(e),i.exports=s},{"../bit":3}],9:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};e=t("./object"),s=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="Square",i.prototype.render=function(){return this.preRender(),this.ctx.rect(.3,.3,1.4,1.4),this.postRender()},i}(e),i.exports=s},{"./object":8}],10:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};e=t("./object"),s=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="Star",i.prototype.vars=function(){return i.__super__.vars.apply(this,arguments),this.spikes=this["default"]({prop:"spikes",def:5}),this.rate=this["default"]({prop:"rate",def:.5})},i.prototype.render=function(){var t,i,e,s,n,r,o,h,a;for(this.preRender(),r=Math.PI/2*3,t=1,i=1,h=t,a=i,s=this.rate,n=1,o=Math.PI/this.spikes,this.ctx.moveTo(t,i-s),e=0;e<this.spikes;)h=t+Math.cos(r)*s,a=i+Math.sin(r)*s,this.ctx.lineTo(h,a),r+=o,h=t+Math.cos(r)*n,a=i+Math.sin(r)*n,this.ctx.lineTo(h,a),r+=o,e++;return this.ctx.lineTo(t,i-s),this.ctx.closePath(),this.postRender()},i}(e),i.exports=s},{"./object":8}],11:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};e=t("./object"),s=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="Triangle",i.prototype.vars=function(){return i.__super__.vars.apply(this,arguments),this.spikes=this["default"]({prop:"spikes",def:3})},i.prototype.render=function(){var t,i,e,s,n,r,o,h,a;for(this.preRender(),t=30,n=360/this.spikes,i=h=0,a=this.spikes;a>=0?a>=h:h>=a;i=a>=0?++h:--h)s=(t+this.angle)*this.h.DEG,r=1+Math.cos(s),o=1+Math.sin(s),t+=n,e=0===i?"moveTo":"lineTo",this.ctx[e](r,o);return this.ctx.closePath(),this.postRender()},i}(e),i.exports=s},{"./object":8}],12:[function(t,i){var e,s,n={}.hasOwnProperty,r=function(t,i){function e(){this.constructor=t}for(var s in i)n.call(i,s)&&(t[s]=i[s]);return e.prototype=i.prototype,t.prototype=new e,t.__super__=i.prototype,t};e=t("./object"),s=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return r(i,t),i.prototype.name="ZigZag",i.prototype.vars=function(){return i.__super__.vars.apply(this,arguments),this.rate=this["default"]({prop:"rate",def:.25}),this.spikes=this["default"]({prop:"spikes",def:10})},i.prototype.render=function(){var t,i,e,s,n,r;for(this.preRender(),t=n=0,r=this.spikes;r>=0?r>n:n>r;t=r>=0?++n:--n)i=0===t?"moveTo":"lineTo",s=t%2===0?this.rate:-this.rate,e=0+t*(2/(this.spikes-1)),this.ctx[i](e,1+s);return this.postRender()},i}(e),i.exports=s},{"./object":8}],13:[function(t){var i,e,s,n,r;r=t("./helpers"),i=t("./bits/Bubble"),e=t("./bits/Burst"),s=function(){function t(){}return t.prototype.Bubble=i,t.prototype.Burst=e,t}(),n=new s,"function"==typeof define&&define.amd?define("charites",[],function(){return n}):module.exports = n/*window.charites=n*/},{"./bits/Bubble":1,"./bits/Burst":2,"./helpers":14}],14:[function(t,i){var e,s;s=t("./vendor/tween"),e=function(){function t(t){this.o=null!=t?t:{},this.animationLoop=this.animationLoop.bind(this),this.div=document.createElement("div"),this.computedStyle=function(t){return window.getComputedStyle?getComputedStyle(t,""):t.currentStyle},this.shortColors={aqua:"rgb(0,255,255)",black:"rgb(0,0,0)",blue:"rgb(0,0,255)",fuchsia:"rgb(255,0,255)",gray:"rgb(128,128,128)",green:"rgb(0,128,0)",lime:"rgb(0,255,0)",maroon:"rgb(128,0,0)",navy:"rgb(0,0,128)",olive:"rgb(128,128,0)",purple:"rgb(128,0,128)",red:"rgb(255,0,0)",silver:"rgb(192,192,192)",teal:"rgb(0,128,128)",white:"rgb(255,255,255)",yellow:"rgb(255,255,0)",orange:"rgb(255,128,0)"}}return t.prototype.pixel=2,t.prototype.doc=document,t.prototype.body=document.body,t.prototype.deg=Math.PI/180,t.prototype.DEG=Math.PI/180,t.prototype.s=1,t.prototype.time=function(t){return t*this.s},t.prototype.isFF=function(){return navigator.userAgent.toLowerCase().indexOf("firefox")>-1},t.prototype.isIE=function(){return this.isIE9l()||this.isIE10g()},t.prototype.isIE9l=function(){return navigator.userAgent.toLowerCase().indexOf("msie")>-1},t.prototype.isIE10g=function(){return navigator.userAgent.toLowerCase().indexOf("rv")>-1},t.prototype.slice=function(t,i){return t>i?i:t},t.prototype.sliceMod=function(t,i){return t>0?t>i?i:t:-i>t?-i:t},t.prototype.clone=function(t){var i,e,s;e={};for(i in t)s=t[i],e[i]=s;return e},t.prototype.getStyle=function(t){var i;return i=window.getComputedStyle?getComputedStyle(t,null):t.currentStyle},t.prototype.rand=function(t,i){return Math.floor(Math.random()*(i+1-t)+t)},t.prototype.bind=function(t,i){var e,s;return s=function(){var s,n;return s=Array.prototype.slice.call(arguments),n=e.concat(s),t.apply(i,n)},e=Array.prototype.slice.call(arguments,2),s},t.prototype.isObj=function(t){return!!t&&t.constructor===Object},t.prototype.makeColorObj=function(t){var i,e,s,n,r,o,h,a,p,u;return"#"===t[0]&&(p=/^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(t),s={},p&&(o=2===p[1].length?p[1]:p[1]+p[1],n=2===p[2].length?p[2]:p[2]+p[2],e=2===p[3].length?p[3]:p[3]+p[3],s={r:parseInt(o,16),g:parseInt(n,16),b:parseInt(e,16),a:1})),"#"!==t[0]&&(r="r"===t[0]&&"g"===t[1]&&"b"===t[2],r&&(u=t),r||(u=this.shortColors[t]?this.shortColors[t]:(this.div.style.color=t,this.isFF()||this.isIE()?this.computedStyle(this.div).color:this.div.style.color)),h="^rgba?\\((\\d{1,3}),\\s?(\\d{1,3}),",a="\\s?(\\d{1,3}),?\\s?(\\d{1}|0?\\.\\d{1,})?\\)$",p=new RegExp(h+a,"gi").exec(u),s={},i=parseFloat(p[4]||1),p&&(s={r:parseInt(p[1],10),g:parseInt(p[2],10),b:parseInt(p[3],10),a:null==i||isNaN(i)?1:i})),s},t.prototype.size=function(t){var i,e,s;i=0;for(e in t)s=t[e],i++;return i},t.prototype.isSizeChange=function(t){var i,e,s,n;return e=t.radiusStart||t.radiusEnd,s=t.radiusStartX||t.radiusStartY,n=t.radiusEndX||t.radiusEndX,i=t.lineWidth||t.lineWidthMiddle||t.lineWidthEnd,e||s||n||i},t.prototype.lock=function(t){return!this[t.lock]&&t.fun(),this[t.lock]=!0},t.prototype.unlock=function(t){return this[t.lock]=!1},t.prototype.animationLoop=function(){return s.getAll().length||(this.isAnimateLoop=!1),this.isAnimateLoop?(s.update(),requestAnimationFrame(this.animationLoop)):void 0},t.prototype.startAnimationLoop=function(){return this.isAnimateLoop?void 0:(this.isAnimateLoop=!0,this.animationLoop())},t.prototype.stopAnimationLoop=function(){return this.isAnimateLoop=!1},t}(),i.exports=function(){return new e}()},{"./vendor/tween":16}],15:[function(t,i){i.exports=function(){return CanvasRenderingContext2D.prototype.clear?void 0:CanvasRenderingContext2D.prototype.clear=function(t){t&&(this.save(),this.setTransform(1,0,0,1,0,0)),this.clearRect(0,0,this.canvas.width,this.canvas.height),t&&this.restore()}}()},{}],16:[function(t,i){!function(t){!function(){for(var t=0,i=["ms","moz","webkit","o"],e=0;e<i.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[i[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[e]+"CancelAnimationFrame"]||window[i[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(i){var e=(new Date).getTime(),s=Math.max(0,16-(e-t)),n=window.setTimeout(function(){i(e+s)},s);return t=e+s,n}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}(),Date.now===t&&(Date.now=function(){return(new Date).valueOf()});var e=e||function(){var i=[];return{REVISION:"14",getAll:function(){return i},removeAll:function(){i=[]},add:function(t){i.push(t)},remove:function(t){var e=i.indexOf(t);-1!==e&&i.splice(e,1)},update:function(e){if(0===i.length)return!1;var s=0;for(e=e!==t?e:"undefined"!=typeof window&&window.performance!==t&&window.performance.now!==t?window.performance.now():Date.now();s<i.length;)i[s].update(e)?s++:i.splice(s,1);return!0}}}();e.Tween=function(i){var s=i,n={},r={},o={},h=1e3,a=0,p=!1,u=!1,l=!1,f=0,d=null,c=e.Easing.Linear.None,y=e.Interpolation.Linear,g=[],b=null,m=!1,v=null,x=null,w=null;for(var E in i)n[E]=parseFloat(i[E],10);this.to=function(i,e){return e!==t&&(h=e),r=i,this},this.start=function(i){e.add(this),u=!0,m=!1,d=i!==t?i:"undefined"!=typeof window&&window.performance!==t&&window.performance.now!==t?window.performance.now():Date.now(),d+=f;for(var h in r){if(r[h]instanceof Array){if(0===r[h].length)continue;r[h]=[s[h]].concat(r[h])}n[h]=s[h],n[h]instanceof Array==!1&&(n[h]*=1),o[h]=n[h]||0}return this},this.stop=function(){return u?(e.remove(this),u=!1,null!==w&&w.call(s),this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var t=0,i=g.length;i>t;t++)g[t].stop()},this.delay=function(t){return f=t,this},this.repeat=function(t){return a=t,this},this.yoyo=function(t){return p=t,this},this.easing=function(t){return c=t,this},this.interpolation=function(t){return y=t,this},this.chain=function(){return g=arguments,this},this.onStart=function(t){return b=t,this},this.onUpdate=function(t){return v=t,this},this.onComplete=function(t){return x=t,this},this.onStop=function(t){return w=t,this},this.update=function(t){var i;if(d>t)return!0;m===!1&&(null!==b&&b.call(s),m=!0);var e=(t-d)/h;e=e>1?1:e;var u=c(e);for(i in r){var w=n[i]||0,E=r[i];E instanceof Array?s[i]=y(E,u):("string"==typeof E&&(E=w+parseFloat(E,10)),"number"==typeof E&&(s[i]=w+(E-w)*u))}if(null!==v&&v.call(s,u),1==e){if(a>0){isFinite(a)&&a--;for(i in o){if("string"==typeof r[i]&&(o[i]=o[i]+parseFloat(r[i],10)),p){var _=o[i];o[i]=r[i],r[i]=_}n[i]=o[i]}return p&&(l=!l),d=t+f,!0}null!==x&&x.call(s);for(var O=0,j=g.length;j>O;O++)g[O].start(t);return!1}return!0}},e.Easing={Linear:{None:function(t){return t}},Quadratic:{In:function(t){return t*t},Out:function(t){return t*(2-t)},InOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}},Cubic:{In:function(t){return t*t*t},Out:function(t){return--t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}},Quartic:{In:function(t){return t*t*t*t},Out:function(t){return 1- --t*t*t*t},InOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}},Quintic:{In:function(t){return t*t*t*t*t},Out:function(t){return--t*t*t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}},Sinusoidal:{In:function(t){return 1-Math.cos(t*Math.PI/2)},Out:function(t){return Math.sin(t*Math.PI/2)},InOut:function(t){return.5*(1-Math.cos(Math.PI*t))}},Exponential:{In:function(t){return 0===t?0:Math.pow(1024,t-1)},Out:function(t){return 1===t?1:1-Math.pow(2,-10*t)},InOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)}},Circular:{In:function(t){return 1-Math.sqrt(1-t*t)},Out:function(t){return Math.sqrt(1- --t*t)
},InOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)}},Elastic:{In:function(t){var i,e=.1,s=.4;return 0===t?0:1===t?1:(!e||1>e?(e=1,i=s/4):i=s*Math.asin(1/e)/(2*Math.PI),-(e*Math.pow(2,10*(t-=1))*Math.sin(2*(t-i)*Math.PI/s)))},Out:function(t){var i,e=.1,s=.4;return 0===t?0:1===t?1:(!e||1>e?(e=1,i=s/4):i=s*Math.asin(1/e)/(2*Math.PI),e*Math.pow(2,-10*t)*Math.sin(2*(t-i)*Math.PI/s)+1)},InOut:function(t){var i,e=.1,s=.4;return 0===t?0:1===t?1:(!e||1>e?(e=1,i=s/4):i=s*Math.asin(1/e)/(2*Math.PI),(t*=2)<1?-.5*e*Math.pow(2,10*(t-=1))*Math.sin(2*(t-i)*Math.PI/s):e*Math.pow(2,-10*(t-=1))*Math.sin(2*(t-i)*Math.PI/s)*.5+1)}},Back:{In:function(t){var i=1.70158;return t*t*((i+1)*t-i)},Out:function(t){var i=1.70158;return--t*t*((i+1)*t+i)+1},InOut:function(t){var i=2.5949095;return(t*=2)<1?.5*t*t*((i+1)*t-i):.5*((t-=2)*t*((i+1)*t+i)+2)}},Bounce:{In:function(t){return 1-e.Easing.Bounce.Out(1-t)},Out:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},InOut:function(t){return.5>t?.5*e.Easing.Bounce.In(2*t):.5*e.Easing.Bounce.Out(2*t-1)+.5}}},e.Interpolation={Linear:function(t,i){var s=t.length-1,n=s*i,r=Math.floor(n),o=e.Interpolation.Utils.Linear;return 0>i?o(t[0],t[1],n):i>1?o(t[s],t[s-1],s-n):o(t[r],t[r+1>s?s:r+1],n-r)},Bezier:function(t,i){var s,n=0,r=t.length-1,o=Math.pow,h=e.Interpolation.Utils.Bernstein;for(s=0;r>=s;s++)n+=o(1-i,r-s)*o(i,s)*t[s]*h(r,s);return n},CatmullRom:function(t,i){var s=t.length-1,n=s*i,r=Math.floor(n),o=e.Interpolation.Utils.CatmullRom;return t[0]===t[s]?(0>i&&(r=Math.floor(n=s*(1+i))),o(t[(r-1+s)%s],t[r],t[(r+1)%s],t[(r+2)%s],n-r)):0>i?t[0]-(o(t[0],t[0],t[1],t[1],-n)-t[0]):i>1?t[s]-(o(t[s],t[s],t[s-1],t[s-1],n-s)-t[s]):o(t[r?r-1:0],t[r],t[r+1>s?s:r+1],t[r+2>s?s:r+2],n-r)},Utils:{Linear:function(t,i,e){return(i-t)*e+t},Bernstein:function(t,i){var s=e.Interpolation.Utils.Factorial;return s(t)/s(i)/s(t-i)},Factorial:function(){var t=[1];return function(i){var e,s=1;if(t[i])return t[i];for(e=i;e>1;e--)s*=e;return t[i]=s}}(),CatmullRom:function(t,i,e,s,n){var r=.5*(e-t),o=.5*(s-i),h=n*n,a=n*h;return(2*i-2*e+r+o)*a+(-3*i+3*e-2*r-o)*h+r*n+i}}},i.exports=e}()},{}]},{},[13]);
},{}],8:[function(require,module,exports){
var Shadow, h;

h = require('./helpers');

Shadow = (function() {
  function Shadow(o) {
    this.o = o != null ? o : {};
    this.vars();
  }

  Shadow.prototype.vars = function() {
    this.shadow = document.getElementById('js-shadow');
    this.base = this.o.base;
    this.tick = 0;
    this.o = .75;
    return this.speed = 3;
  };

  Shadow.prototype.draw = function() {
    var ang, flick, scale, sup, suppress, translate, x;
    if (this.isFF) {
      return;
    }
    suppress = 0;
    suppress = this.base.suppress < 0 ? this.base.suppress / 80 : this.base.suppress / 120;
    scale = "scale(" + (1 - suppress) + ")";
    x = this.base.x - this.base.initX;
    translate = this.base.suppress > 0 ? "translate(" + (2 * this.base.angle) + "px," + (3 * this.base.suppress) + "px)" : '';
    h.transform(this.shadow, "" + scale + " " + translate + " translateZ(0)");
    this.tick++;
    sup = Math.abs(~~(10 * suppress));
    ang = Math.abs(~~(this.base.angle / 45));
    flick = Math.max(sup, ang);
    if (this.tick % (this.speed - flick) === 0) {
      this.o = h.rand(8, 10) / 10;
      return this.shadow.style.opacity = this.o;
    }
  };

  return Shadow;

})();

module.exports = Shadow;



},{"./helpers":5}],9:[function(require,module,exports){
var Shaker;

Shaker = (function() {
  function Shaker() {
    this.vars();
  }

  Shaker.prototype.vars = function() {
    return this.pos = [];
  };

  Shaker.prototype.reset = function() {
    var len;
    this.isShake = false;
    len = this.pos.length;
    if (len < 3) {
      return;
    }
    return this.pos = [this.pos[len - 3], this.pos[len - 2], this.pos[len - 1]];
  };

  Shaker.prototype.setPosition = function(pos) {
    var lastI, len, time;
    this.pos.push(pos);
    len = this.pos.length;
    if (len < 3) {
      return;
    }
    lastI = len - 1;
    if ((pos.dir !== this.pos[lastI - 1].dir) && (pos.dir === this.pos[lastI - 2].dir)) {
      time = (pos.timestamp - this.pos[lastI - 1].timestamp) / 1000;
      return this.isShake = time < .2;
    }
  };

  return Shaker;

})();

module.exports = Shaker;



},{}],10:[function(require,module,exports){
var Spark, h;

h = require('./helpers');

Spark = (function() {
  function Spark(o) {
    this.o = o != null ? o : {};
    this.vars();
  }

  Spark.prototype.vars = function() {
    this.ctx = this.o.ctx;
    this.start = this.o.start;
    this.length = this.o.length || 450;
    this.color = this.o.color;
    this.offset = this.o.offset || 0;
    this.getRandRadius();
    this.getRandOffset();
    this.getRandDelay();
    this.isDelayed = this.o.isDelayed || true;
    this.base2 = {};
    this.cloneBase();
    this.sinCoef = 1;
    this.p = 0;
    this.pSin = 0;
    this.pSinStep = .1;
    return this.d = 0;
  };

  Spark.prototype.getRandOffset = function() {
    return this.offset = h.rand(-35, 35);
  };

  Spark.prototype.getRandDelay = function() {
    return this.delay = h.rand(0, 20);
  };

  Spark.prototype.getRandRadius = function() {
    return this.radius = h.rand(5, 10);
  };

  Spark.prototype.cloneBase = function() {
    var key, value, _ref, _results;
    _ref = this.o.base;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      _results.push(this.base2[key] = value);
    }
    return _results;
  };

  Spark.prototype.draw = function() {
    var b, quirk, rad, speed, x, y;
    if (!this.isDelayed) {
      !this.isBaseCloned && this.cloneBase();
      this.isBaseCloned = true;
      this.ctx.beginPath();
      b = this.base2;
      speed = Math.abs(b.angle) / 3000;
      rad = b.radius + 100 - this.length + (this.length * this.p);
      quirk = Math.sin(this.pSin) * this.sinCoef;
      x = b.x + Math.cos((b.angle + quirk - 90) * h.DEG) * rad;
      y = b.y + Math.sin((b.angle + quirk - 90) * h.DEG) * rad;
      x += this.offset * h.PX;
      this.ctx.arc(x, y, this.radius * (1 - this.p), 0, 2 * Math.PI);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.pSin += this.pSinStep + speed;
      this.p += .02 + speed;
      if (this.p >= 1) {
        this.p = 0;
        this.pSin = 0;
        this.sinCoef = -this.sinCoef;
        this.isDelayed = true;
        this.radius = h.rand(5, 10);
        this.pSinStep = h.rand(0, 2) / 10;
        this.getRandOffset();
        this.getRandDelay();
        return this.isBaseCloned = false;
      }
    } else {
      this.d += .1;
      if (this.d >= this.delay * (1 - Math.abs(this.base2.angle) / 45)) {
        this.d = 0;
        return this.isDelayed = false;
      }
    }
  };

  return Spark;

})();

module.exports = Spark;



},{"./helpers":5}],11:[function(require,module,exports){
// tween.js v.0.15.0 https://github.com/sole/tween.js
void 0 === Date.now && (Date.now = function() {
    return (new Date).valueOf()
});
var TWEEN = TWEEN || function() {
        var n = [];
        return {
            REVISION: "14",
            getAll: function() {
                return n
            },
            removeAll: function() {
                n = []
            },
            add: function(t) {
                n.push(t)
            },
            remove: function(t) {
                var r = n.indexOf(t); - 1 !== r && n.splice(r, 1)
            },
            update: function(t) {
                if (0 === n.length) return !1;
                var r = 0;
                for (t = void 0 !== t ? t : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); r < n.length;) n[r].update(t) ? r++ : n.splice(r, 1);
                return !0
            }
        }
    }();
TWEEN.Tween = function(n) {
    var t = n,
        r = {}, i = {}, u = {}, o = 1e3,
        e = 0,
        a = !1,
        f = !1,
        c = !1,
        s = 0,
        h = null,
        l = TWEEN.Easing.Linear.None,
        p = TWEEN.Interpolation.Linear,
        E = [],
        d = null,
        v = !1,
        I = null,
        w = null,
        M = null;
    for (var O in n) r[O] = parseFloat(n[O], 10);
    this.to = function(n, t) {
        return void 0 !== t && (o = t), i = n, this
    }, this.start = function(n) {
        TWEEN.add(this), f = !0, v = !1, h = void 0 !== n ? n : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), h += s;
        for (var o in i) {
            if (i[o] instanceof Array) {
                if (0 === i[o].length) continue;
                i[o] = [t[o]].concat(i[o])
            }
            r[o] = t[o], r[o] instanceof Array == !1 && (r[o] *= 1), u[o] = r[o] || 0
        }
        return this
    }, this.stop = function() {
        return f ? (TWEEN.remove(this), f = !1, null !== M && M.call(t), this.stopChainedTweens(), this) : this
    }, this.stopChainedTweens = function() {
        for (var n = 0, t = E.length; t > n; n++) E[n].stop()
    }, this.delay = function(n) {
        return s = n, this
    }, this.repeat = function(n) {
        return e = n, this
    }, this.yoyo = function(n) {
        return a = n, this
    }, this.easing = function(n) {
        return l = n, this
    }, this.interpolation = function(n) {
        return p = n, this
    }, this.chain = function() {
        return E = arguments, this
    }, this.onStart = function(n) {
        return d = n, this
    }, this.onUpdate = function(n) {
        return I = n, this
    }, this.onComplete = function(n) {
        return w = n, this
    }, this.onStop = function(n) {
        return M = n, this
    }, this.update = function(n) {
        var f;
        if (h > n) return !0;
        v === !1 && (null !== d && d.call(t), v = !0);
        var M = (n - h) / o;
        M = M > 1 ? 1 : M;
        var O = l(M);
        for (f in i) {
            var m = r[f] || 0,
                N = i[f];
            N instanceof Array ? t[f] = p(N, O) : ("string" == typeof N && (N = m + parseFloat(N, 10)), "number" == typeof N && (t[f] = m + (N - m) * O))
        }
        if (null !== I && I.call(t, O), 1 == M) {
            if (e > 0) {
                isFinite(e) && e--;
                for (f in u) {
                    if ("string" == typeof i[f] && (u[f] = u[f] + parseFloat(i[f], 10)), a) {
                        var T = u[f];
                        u[f] = i[f], i[f] = T
                    }
                    r[f] = u[f]
                }
                return a && (c = !c), h = n + s, !0
            }
            null !== w && w.call(t);
            for (var g = 0, W = E.length; W > g; g++) E[g].start(n);
            return !1
        }
        return !0
    }
}, TWEEN.Easing = {
    Linear: {
        None: function(n) {
            return n
        }
    },
    Quadratic: {
        In: function(n) {
            return n * n
        },
        Out: function(n) {
            return n * (2 - n)
        },
        InOut: function(n) {
            return (n *= 2) < 1 ? .5 * n * n : -.5 * (--n * (n - 2) - 1)
        }
    },
    Cubic: {
        In: function(n) {
            return n * n * n
        },
        Out: function(n) {
            return --n * n * n + 1
        },
        InOut: function(n) {
            return (n *= 2) < 1 ? .5 * n * n * n : .5 * ((n -= 2) * n * n + 2)
        }
    },
    Quartic: {
        In: function(n) {
            return n * n * n * n
        },
        Out: function(n) {
            return 1 - --n * n * n * n
        },
        InOut: function(n) {
            return (n *= 2) < 1 ? .5 * n * n * n * n : -.5 * ((n -= 2) * n * n * n - 2)
        }
    },
    Quintic: {
        In: function(n) {
            return n * n * n * n * n
        },
        Out: function(n) {
            return --n * n * n * n * n + 1
        },
        InOut: function(n) {
            return (n *= 2) < 1 ? .5 * n * n * n * n * n : .5 * ((n -= 2) * n * n * n * n + 2)
        }
    },
    Sinusoidal: {
        In: function(n) {
            return 1 - Math.cos(n * Math.PI / 2)
        },
        Out: function(n) {
            return Math.sin(n * Math.PI / 2)
        },
        InOut: function(n) {
            return .5 * (1 - Math.cos(Math.PI * n))
        }
    },
    Exponential: {
        In: function(n) {
            return 0 === n ? 0 : Math.pow(1024, n - 1)
        },
        Out: function(n) {
            return 1 === n ? 1 : 1 - Math.pow(2, - 10 * n)
        },
        InOut: function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : (n *= 2) < 1 ? .5 * Math.pow(1024, n - 1) : .5 * (-Math.pow(2, - 10 * (n - 1)) + 2)
        }
    },
    Circular: {
        In: function(n) {
            return 1 - Math.sqrt(1 - n * n)
        },
        Out: function(n) {
            return Math.sqrt(1 - --n * n)
        },
        InOut: function(n) {
            return (n *= 2) < 1 ? -.5 * (Math.sqrt(1 - n * n) - 1) : .5 * (Math.sqrt(1 - (n -= 2) * n) + 1)
        }
    },
    Elastic: {
        In: function(n) {
            var t, r = .1,
                i = .4;
            return 0 === n ? 0 : 1 === n ? 1 : (!r || 1 > r ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), - (r * Math.pow(2, 10 * (n -= 1)) * Math.sin(2 * (n - t) * Math.PI / i)))
        },
        Out: function(n) {
            var t, r = .1,
                i = .4;
            return 0 === n ? 0 : 1 === n ? 1 : (!r || 1 > r ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), r * Math.pow(2, - 10 * n) * Math.sin(2 * (n - t) * Math.PI / i) + 1)
        },
        InOut: function(n) {
            var t, r = .1,
                i = .4;
            return 0 === n ? 0 : 1 === n ? 1 : (!r || 1 > r ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), (n *= 2) < 1 ? -.5 * r * Math.pow(2, 10 * (n -= 1)) * Math.sin(2 * (n - t) * Math.PI / i) : r * Math.pow(2, - 10 * (n -= 1)) * Math.sin(2 * (n - t) * Math.PI / i) * .5 + 1)
        }
    },
    Back: {
        In: function(n) {
            var t = 1.70158;
            return n * n * ((t + 1) * n - t)
        },
        Out: function(n) {
            var t = 1.70158;
            return --n * n * ((t + 1) * n + t) + 1
        },
        InOut: function(n) {
            var t = 2.5949095;
            return (n *= 2) < 1 ? .5 * n * n * ((t + 1) * n - t) : .5 * ((n -= 2) * n * ((t + 1) * n + t) + 2)
        }
    },
    Bounce: {
        In: function(n) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - n)
        },
        Out: function(n) {
            return 1 / 2.75 > n ? 7.5625 * n * n : 2 / 2.75 > n ? 7.5625 * (n -= 1.5 / 2.75) * n + .75 : 2.5 / 2.75 > n ? 7.5625 * (n -= 2.25 / 2.75) * n + .9375 : 7.5625 * (n -= 2.625 / 2.75) * n + .984375
        },
        InOut: function(n) {
            return .5 > n ? .5 * TWEEN.Easing.Bounce.In(2 * n) : .5 * TWEEN.Easing.Bounce.Out(2 * n - 1) + .5
        }
    }
}, TWEEN.Interpolation = {
    Linear: function(n, t) {
        var r = n.length - 1,
            i = r * t,
            u = Math.floor(i),
            o = TWEEN.Interpolation.Utils.Linear;
        return 0 > t ? o(n[0], n[1], i) : t > 1 ? o(n[r], n[r - 1], r - i) : o(n[u], n[u + 1 > r ? r : u + 1], i - u)
    },
    Bezier: function(n, t) {
        var r, i = 0,
            u = n.length - 1,
            o = Math.pow,
            e = TWEEN.Interpolation.Utils.Bernstein;
        for (r = 0; u >= r; r++) i += o(1 - t, u - r) * o(t, r) * n[r] * e(u, r);
        return i
    },
    CatmullRom: function(n, t) {
        var r = n.length - 1,
            i = r * t,
            u = Math.floor(i),
            o = TWEEN.Interpolation.Utils.CatmullRom;
        return n[0] === n[r] ? (0 > t && (u = Math.floor(i = r * (1 + t))), o(n[(u - 1 + r) % r], n[u], n[(u + 1) % r], n[(u + 2) % r], i - u)) : 0 > t ? n[0] - (o(n[0], n[0], n[1], n[1], - i) - n[0]) : t > 1 ? n[r] - (o(n[r], n[r], n[r - 1], n[r - 1], i - r) - n[r]) : o(n[u ? u - 1 : 0], n[u], n[u + 1 > r ? r : u + 1], n[u + 2 > r ? r : u + 2], i - u)
    },
    Utils: {
        Linear: function(n, t, r) {
            return (t - n) * r + n
        },
        Bernstein: function(n, t) {
            var r = TWEEN.Interpolation.Utils.Factorial;
            return r(n) / r(t) / r(n - t)
        },
        Factorial: function() {
            var n = [1];
            return function(t) {
                var r, i = 1;
                if (n[t]) return n[t];
                for (r = t; r > 1; r--) i *= r;
                return n[t] = i
            }
        }(),
        CatmullRom: function(n, t, r, i, u) {
            var o = .5 * (r - n),
                e = .5 * (i - t),
                a = u * u,
                f = u * a;
            return (2 * t - 2 * r + o + e) * f + (-3 * t + 3 * r - 2 * o - e) * a + o * u + t
        }
    }
}, "undefined" != typeof module && module.exports && (module.exports = TWEEN);
},{}]},{},[6])