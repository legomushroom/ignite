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
    rightOffset = Math.max(s, rightOffset);
    if (rightOffset === s) {
      rightOffset = -rightOffset;
    }
    if (this.name === '1' && (leftOffset = s)) {
      topOffset = -s;
      leftOffset = 0;
    }
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
    speed = 60 - Math.max(speed, suppress);
    this.angle += this.angleStep / speed;
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



},{"./helpers":5,"./tweenjs.min":8}],4:[function(require,module,exports){
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
  function Helpers() {}

  Helpers.prototype.PX = 2;

  Helpers.prototype.DEG = Math.PI / 180;

  Helpers.prototype.rand = function(min, max) {
    return Math.floor((Math.random() * ((max + 1) - min)) + min);
  };

  return Helpers;

})();

module.exports = new Helpers;



},{}],6:[function(require,module,exports){
var Base, BasePoint, Ember, Hammer, Main, Spark, TWEEN, h;

Ember = require('./ember');

Spark = require('./spark');

Hammer = require('./hammer.min');

TWEEN = require('./tweenjs.min');

Base = require('./base');

BasePoint = require('./base-point');

h = require('./helpers');

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.events();
    this.run();
  }

  Main.prototype.events = function() {
    var isTouched, mc, timeout;
    window.addEventListener('resize', (function(_this) {
      return function() {
        _this.wWidth = window.outerWidth;
        return _this.sizeCanvas();
      };
    })(this));
    mc = new Hammer(this.canvas);
    isTouched = false;
    timeout = null;
    mc.on('tap', function(e) {
      return isTouched = true;
    });
    mc.on('panstart', (function(_this) {
      return function(e) {
        _this.base.panstart = {
          x: e.x,
          y: e.y
        };
        isTouched = true;
        return TWEEN.remove(_this.tween);
      };
    })(this));
    return mc.on('pan', (function(_this) {
      return function(e) {
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
        return _this.suppress = 0;
      };
    })(this)).start();
  };

  Main.prototype.vars = function() {
    this.canvas = document.getElementById("js-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.wWidth = parseInt(this.canvas.getAttribute('width'), 10);
    this.animationLoop = this.animationLoop.bind(this);
    this.embers = [];
    this.sparks = [];
    this.basePoints = [];
    this.MAX_ANGLE = 35;
    this.suppress = 0;
    this.startX = this.wWidth / 4;
    this.startY = 500;
    this.base = new Base({
      ctx: this.ctx,
      x: (this.startX + 10) * h.PX,
      y: (this.startY + 60) * h.PX,
      radius: 400 * h.PX,
      angle: 0
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
        x: this.startX - 20,
        y: this.startY + 38
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
        x: this.startX - 20,
        y: this.startY + 38
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
        x: this.startX + 28,
        y: this.startY + 44
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
        x: this.startX + 28,
        y: this.startY + 44
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

  Main.prototype.drawShadow = function() {};

  Main.prototype.animationLoop = function() {
    var i;
    this.ctx.clearRect(0, 0, this.wWidth, this.wWidth);
    this.drawShadow();
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
    this.base.draw();
    i = this.base.points.length - 1;
    while (i >= 0) {
      this.base.points[i].draw();
      i--;
    }
    TWEEN.update();
    requestAnimationFrame(this.animationLoop);
  };

  return Main;

})();

new Main;



},{"./base":2,"./base-point":1,"./ember":3,"./hammer.min":4,"./helpers":5,"./spark":7,"./tweenjs.min":8}],7:[function(require,module,exports){
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



},{"./helpers":5}],8:[function(require,module,exports){
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