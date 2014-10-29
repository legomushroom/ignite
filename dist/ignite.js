(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Draw, Ember, GetFlickBounds, SendTop, TWEEN, drawFlickBounds, h;

h = require('./helpers');

TWEEN = require('./tweenjs.min');

Ember = Ember = function(o) {
  this.o = o || {};
  this.ctx = this.o.ctx;
  this.top = this.o.top;
  this.right = this.o.right;
  this.bottom = this.o.bottom;
  this.left = this.o.left;
  this.color = this.o.color || "deeppink";
  this.flickRadius = this.o.flickRadius || 10;
  this.p = 0;
  this.p2 = 0;
  this.p2Step = .01;
  if (!this.ctx) {
    console.error("no context, aborting");
    return;
  }
  this.getFlickBounds();
  this.delta = this.getDelta();
};

Ember.prototype.draw = Draw = function() {
  var topX, topY;
  this.ctx.beginPath();
  this.ctx.moveTo(this.left.x * h.PX, (this.left.y + this.p2 * 20) * h.PX);
  topX = this.top.x + (this.p * this.delta.x);
  topY = this.top.y + (this.p * this.delta.y);
  this.ctx.lineTo(topX * h.PX, topY * h.PX);
  this.ctx.lineTo(this.right.x * h.PX, (this.right.y + this.p2 * 20) * h.PX);
  this.ctx.lineTo(this.bottom.x * h.PX, (this.bottom.y + this.p2 * 20) * h.PX);
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

Ember.prototype.drawFlickBounds = drawFlickBounds = function() {
  return;
  this.ctx.beginPath();
  this.ctx.arc(this.flickCenter.x * PX, this.flickCenter.y * PX, this.flickRadius, 0, 2 * Math.PI);
  this.ctx.lineWidth = PX;
  this.ctx.stroke();
};

Ember.prototype.getFlickBounds = GetFlickBounds = function() {
  var PX, flickCenter, flickRadius;
  PX = 2;
  flickCenter = {
    x: this.top.x,
    y: this.top.y
  };
  flickRadius = this.flickRadius * PX;
  this.flickCenter = flickCenter;
  this.flickCenterStart = {};
  this.flickCenterStart.x = flickCenter.x;
  this.flickCenterStart.y = flickCenter.y;
  this.flickRadius = flickRadius;
};

Ember.prototype.getDelta = function() {
  var angle, delta, newTop;
  angle = h.rand(0, 360);
  newTop = {
    x: this.flickCenter.x + Math.cos(angle * h.DEG) * .05 * this.flickRadius,
    y: this.flickCenter.y + Math.sin(angle * h.DEG) * 1.5 * this.flickRadius
  };
  delta = {
    x: newTop.x - this.top.x,
    y: newTop.y - this.top.y
  };
  return delta;
};

Ember.prototype.sendTop = SendTop = function(dX, dY) {
  var deltaX, deltaY, it, tween1, tween2;
  it = this;
  deltaX = deltaY = 0;
  tween2 = new TWEEN.Tween({
    p: 0
  }).to({
    p: 1
  }, 1000 + h.rand(0, 200)).onStart(function() {
    deltaX = it.flickCenterStart.x - it.flickCenter.x;
    deltaY = it.flickCenterStart.y - it.flickCenter.y;
  }).onUpdate(function() {
    it.flickCenter.x = it.flickCenterStart.x - (deltaX * (1 - this.p));
    it.flickCenter.y = it.flickCenterStart.y - (deltaY * (1 - this.p));
  }).easing(TWEEN.Easing.Elastic.Out);
  tween1 = new TWEEN.Tween({
    p: 0
  }).to({
    p: 1
  }, 300).onUpdate(function() {
    it.flickCenter.x = it.flickCenterStart.x + (dX * h.PX * this.p);
    it.flickCenter.y = it.flickCenterStart.y + (dY * h.PX * this.p);
  }).chain(tween2).start();
};

module.exports = Ember;



},{"./helpers":3,"./tweenjs.min":5}],2:[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map
},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
var Ember, Hammer, Main, TWEEN, h;

Ember = require('./ember');

Hammer = require('./hammer.min');

TWEEN = require('./tweenjs.min');

h = require('./helpers');

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.run();
  }

  Main.prototype.vars = function() {
    this.canvas = document.getElementById("js-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animationLoop = this.animationLoop.bind(this);
    return this.embers = [];
  };

  Main.prototype.run = function() {
    var ember1, ember11, ember2, ember21, ember3, ember31, ember4, ember41, mc;
    this.animationLoop();
    mc = new Hammer(this.canvas);
    ember1 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 10,
      color: "#ED8CBA",
      top: {
        x: 280,
        y: 240
      },
      right: {
        x: 300,
        y: 410
      },
      bottom: {
        x: 280,
        y: 438
      },
      left: {
        x: 232,
        y: 404
      }
    });
    ember11 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 20,
      color: "#ED8CBA",
      top: {
        x: 280,
        y: 240
      },
      right: {
        x: 300,
        y: 410
      },
      bottom: {
        x: 280,
        y: 438
      },
      left: {
        x: 232,
        y: 404
      }
    });
    ember2 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 20,
      color: "#E86CA9",
      top: {
        x: 314,
        y: 130
      },
      right: {
        x: 364,
        y: 412
      },
      bottom: {
        x: 310,
        y: 460
      },
      left: {
        x: 256,
        y: 420
      }
    });
    ember21 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 30,
      color: "#E86CA9",
      top: {
        x: 314,
        y: 130
      },
      right: {
        x: 364,
        y: 412
      },
      bottom: {
        x: 310,
        y: 460
      },
      left: {
        x: 256,
        y: 420
      }
    });
    ember3 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 10,
      color: "#A4D7F5",
      top: {
        x: 330,
        y: 160
      },
      right: {
        x: 348,
        y: 388
      },
      bottom: {
        x: 310,
        y: 460
      },
      left: {
        x: 280,
        y: 380
      }
    });
    ember31 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 20,
      color: "#A4D7F5",
      top: {
        x: 330,
        y: 160
      },
      right: {
        x: 348,
        y: 388
      },
      bottom: {
        x: 310,
        y: 460
      },
      left: {
        x: 280,
        y: 380
      }
    });
    ember4 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 10,
      color: "#F6D58A",
      top: {
        x: 352,
        y: 252
      },
      right: {
        x: 376,
        y: 402
      },
      bottom: {
        x: 328,
        y: 444
      },
      left: {
        x: 300,
        y: 410
      }
    });
    ember41 = new Ember({
      ctx: this.ctx,
      sensivity: .25,
      flickRadius: 20,
      color: "#F6D58A",
      top: {
        x: 352,
        y: 252
      },
      right: {
        x: 376,
        y: 402
      },
      bottom: {
        x: 328,
        y: 444
      },
      left: {
        x: 300,
        y: 410
      }
    });
    this.embers.push(ember1, ember11, ember2, ember21, ember3);
    this.embers.push(ember31, ember4, ember41);
    return this.ctx.globalCompositeOperation = "multiply";
  };

  Main.prototype.drawBones = function() {
    var rX, rY;
    this.ctx.lineWidth = 7 * h.PX;
    this.ctx.strokeStyle = "#80404B";
    this.ctx.beginPath();
    this.ctx.moveTo(260 * h.PX, 474 * h.PX);
    this.ctx.lineTo(360 * h.PX, 500 * h.PX);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(256 * h.PX, 510 * h.PX);
    this.ctx.lineTo(356 * h.PX, 472 * h.PX);
    this.ctx.stroke();
    rX = rY = 0;
    return setTimeout(((function(_this) {
      return function() {
        var i;
        i = _this.embers.length - 1;
        while (i >= 0) {
          if (i % 2 === 0) {
            rX = h.rand(-100, 100);
            rY = h.rand(-100, 100);
          }
          _this.embers[i].sendTop(-50 + rX, rY);
          i--;
        }
      };
    })(this)), 3000);
  };

  Main.prototype.animationLoop = function() {
    var i;
    this.ctx.clearRect(0, 0, 1200, 1200);
    i = this.embers.length - 1;
    while (i >= 0) {
      this.embers[i].draw();
      i--;
    }
    this.drawBones();
    TWEEN.update();
    requestAnimationFrame(this.animationLoop);
  };

  return Main;

})();

new Main;



},{"./ember":1,"./hammer.min":2,"./helpers":3,"./tweenjs.min":5}],5:[function(require,module,exports){
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
},{}]},{},[4])