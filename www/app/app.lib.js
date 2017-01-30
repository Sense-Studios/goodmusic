function murmurhash(e, t) {
  var n, r, i, o, a, s, u, l;
  for (t || (t = 1), n = 3 & e.length, r = e.length - n, i = t, a = 3432918353, s = 461845907, l = 0; r > l;)
    u = 255 & e.charCodeAt(l) | (255 & e.charCodeAt(++l)) << 8 | (255 & e.charCodeAt(++l)) << 16 | (255 & e.charCodeAt(++l)) << 24, ++l, u = 4294967295 & (65535 & u) * a + ((65535 & (u >>> 16) * a) << 16), u = u << 15 | u >>> 17, u = 4294967295 & (65535 & u) * s + ((65535 & (u >>> 16) * s) << 16), i ^= u, i = i << 13 | i >>> 19, o = 4294967295 & 5 * (65535 & i) + ((65535 & 5 * (i >>> 16)) << 16), i = (65535 & o) + 27492 + ((65535 & (o >>> 16) + 58964) << 16);
  switch (u = 0, n) {
  case 3:
    u ^= (255 & e.charCodeAt(l + 2)) << 16;
  case 2:
    u ^= (255 & e.charCodeAt(l + 1)) << 8;
  case 1:
    u ^= 255 & e.charCodeAt(l), u = 4294967295 & (65535 & u) * a + ((65535 & (u >>> 16) * a) << 16), u = u << 15 | u >>> 17, u = 4294967295 & (65535 & u) * s + ((65535 & (u >>> 16) * s) << 16), i ^= u;
  }
  return i ^= e.length, i ^= i >>> 16, i = 4294967295 & 2246822507 * (65535 & i) + ((65535 & 2246822507 * (i >>> 16)) << 16), i ^= i >>> 13, i = 4294967295 & 3266489909 * (65535 & i) + ((65535 & 3266489909 * (i >>> 16)) << 16), i ^= i >>> 16, i >>> 0;
}
window.console = window.console || {}, window.console.log = window.console.log || function () {
};
var Cjs = Cjs || function (e, t) {
    var n = {}, r = n.lib = {}, i = function () {
      }, o = r.Base = {
        extend: function (e) {
          i.prototype = this;
          var t = new i();
          return e && t.mixIn(e), t.hasOwnProperty('init') || (t.init = function () {
            t.$super.init.apply(this, arguments);
          }), t.init.prototype = t, t.$super = this, t;
        },
        create: function () {
          var e = this.extend();
          return e.init.apply(e, arguments), e;
        },
        init: function () {
        },
        mixIn: function (e) {
          for (var t in e)
            e.hasOwnProperty(t) && (this[t] = e[t]);
          e.hasOwnProperty('toString') && (this.toString = e.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        }
      }, a = r.WordArray = o.extend({
        init: function (e, n) {
          e = this.words = e || [], this.sigBytes = n != t ? n : 4 * e.length;
        },
        toString: function (e) {
          return (e || u).stringify(this);
        },
        concat: function (e) {
          var t = this.words, n = e.words, r = this.sigBytes;
          if (e = e.sigBytes, this.clamp(), r % 4)
            for (var i = 0; e > i; i++)
              t[r + i >>> 2] |= (255 & n[i >>> 2] >>> 24 - 8 * (i % 4)) << 24 - 8 * ((r + i) % 4);
          else if (65535 < n.length)
            for (i = 0; e > i; i += 4)
              t[r + i >>> 2] = n[i >>> 2];
          else
            t.push.apply(t, n);
          return this.sigBytes += e, this;
        },
        clamp: function () {
          var t = this.words, n = this.sigBytes;
          t[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4), t.length = e.ceil(n / 4);
        },
        clone: function () {
          var e = o.clone.call(this);
          return e.words = this.words.slice(0), e;
        },
        random: function (t) {
          for (var n = [], r = 0; t > r; r += 4)
            n.push(0 | 4294967296 * e.random());
          return new a.init(n, t);
        }
      }), s = n.enc = {}, u = s.Hex = {
        stringify: function (e) {
          var t = e.words;
          e = e.sigBytes;
          for (var n = [], r = 0; e > r; r++) {
            var i = 255 & t[r >>> 2] >>> 24 - 8 * (r % 4);
            n.push((i >>> 4).toString(16)), n.push((15 & i).toString(16));
          }
          return n.join('');
        },
        parse: function (e) {
          for (var t = e.length, n = [], r = 0; t > r; r += 2)
            n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - 4 * (r % 8);
          return new a.init(n, t / 2);
        }
      }, l = s.Latin1 = {
        stringify: function (e) {
          var t = e.words;
          e = e.sigBytes;
          for (var n = [], r = 0; e > r; r++)
            n.push(String.fromCharCode(255 & t[r >>> 2] >>> 24 - 8 * (r % 4)));
          return n.join('');
        },
        parse: function (e) {
          for (var t = e.length, n = [], r = 0; t > r; r++)
            n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - 8 * (r % 4);
          return new a.init(n, t);
        }
      }, c = s.Utf8 = {
        stringify: function (e) {
          try {
            return decodeURIComponent(escape(l.stringify(e)));
          } catch (t) {
            throw Error('Malformed UTF-8 data');
          }
        },
        parse: function (e) {
          return l.parse(unescape(encodeURIComponent(e)));
        }
      }, d = r.BufferedBlockAlgorithm = o.extend({
        reset: function () {
          this._data = new a.init(), this._nDataBytes = 0;
        },
        _append: function (e) {
          'string' == typeof e && (e = c.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
        },
        _process: function (t) {
          var n = this._data, r = n.words, i = n.sigBytes, o = this.blockSize, s = i / (4 * o), s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
          if (t = s * o, i = e.min(4 * t, i), t) {
            for (var u = 0; t > u; u += o)
              this._doProcessBlock(r, u);
            u = r.splice(0, t), n.sigBytes -= i;
          }
          return new a.init(u, i);
        },
        clone: function () {
          var e = o.clone.call(this);
          return e._data = this._data.clone(), e;
        },
        _minBufferSize: 0
      });
    r.Hasher = d.extend({
      cfg: o.extend(),
      init: function (e) {
        this.cfg = this.cfg.extend(e), this.reset();
      },
      reset: function () {
        d.reset.call(this), this._doReset();
      },
      update: function (e) {
        return this._append(e), this._process(), this;
      },
      finalize: function (e) {
        return e && this._append(e), this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (e) {
        return function (t, n) {
          return new e.init(n).finalize(t);
        };
      },
      _createHmHelper: function (e) {
        return function (t, n) {
          return new f.Hm.init(e, n).finalize(t);
        };
      }
    });
    var f = n.algo = {};
    return n;
  }(Math);
!function (e) {
  function t(e, t, n, r, i, o, a) {
    return e = e + (t & n | ~t & r) + i + a, (e << o | e >>> 32 - o) + t;
  }
  function n(e, t, n, r, i, o, a) {
    return e = e + (t & r | n & ~r) + i + a, (e << o | e >>> 32 - o) + t;
  }
  function r(e, t, n, r, i, o, a) {
    return e = e + (t ^ n ^ r) + i + a, (e << o | e >>> 32 - o) + t;
  }
  function i(e, t, n, r, i, o, a) {
    return e = e + (n ^ (t | ~r)) + i + a, (e << o | e >>> 32 - o) + t;
  }
  for (var o = Cjs, a = o.lib, s = a.WordArray, u = a.Hasher, a = o.algo, l = [], c = 0; 64 > c; c++)
    l[c] = 0 | 4294967296 * e.abs(e.sin(c + 1));
  a = a.X = u.extend({
    _doReset: function () {
      this._hash = new s.init([
        1732584193,
        4023233417,
        2562383102,
        271733878
      ]);
    },
    _doProcessBlock: function (e, o) {
      for (var a = 0; 16 > a; a++) {
        var s = o + a, u = e[s];
        e[s] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
      }
      var a = this._hash.words, s = e[o + 0], u = e[o + 1], c = e[o + 2], d = e[o + 3], f = e[o + 4], p = e[o + 5], h = e[o + 6], g = e[o + 7], m = e[o + 8], v = e[o + 9], y = e[o + 10], w = e[o + 11], b = e[o + 12], $ = e[o + 13], x = e[o + 14], k = e[o + 15], _ = a[0], T = a[1], S = a[2], C = a[3], _ = t(_, T, S, C, s, 7, l[0]), C = t(C, _, T, S, u, 12, l[1]), S = t(S, C, _, T, c, 17, l[2]), T = t(T, S, C, _, d, 22, l[3]), _ = t(_, T, S, C, f, 7, l[4]), C = t(C, _, T, S, p, 12, l[5]), S = t(S, C, _, T, h, 17, l[6]), T = t(T, S, C, _, g, 22, l[7]), _ = t(_, T, S, C, m, 7, l[8]), C = t(C, _, T, S, v, 12, l[9]), S = t(S, C, _, T, y, 17, l[10]), T = t(T, S, C, _, w, 22, l[11]), _ = t(_, T, S, C, b, 7, l[12]), C = t(C, _, T, S, $, 12, l[13]), S = t(S, C, _, T, x, 17, l[14]), T = t(T, S, C, _, k, 22, l[15]), _ = n(_, T, S, C, u, 5, l[16]), C = n(C, _, T, S, h, 9, l[17]), S = n(S, C, _, T, w, 14, l[18]), T = n(T, S, C, _, s, 20, l[19]), _ = n(_, T, S, C, p, 5, l[20]), C = n(C, _, T, S, y, 9, l[21]), S = n(S, C, _, T, k, 14, l[22]), T = n(T, S, C, _, f, 20, l[23]), _ = n(_, T, S, C, v, 5, l[24]), C = n(C, _, T, S, x, 9, l[25]), S = n(S, C, _, T, d, 14, l[26]), T = n(T, S, C, _, m, 20, l[27]), _ = n(_, T, S, C, $, 5, l[28]), C = n(C, _, T, S, c, 9, l[29]), S = n(S, C, _, T, g, 14, l[30]), T = n(T, S, C, _, b, 20, l[31]), _ = r(_, T, S, C, p, 4, l[32]), C = r(C, _, T, S, m, 11, l[33]), S = r(S, C, _, T, w, 16, l[34]), T = r(T, S, C, _, x, 23, l[35]), _ = r(_, T, S, C, u, 4, l[36]), C = r(C, _, T, S, f, 11, l[37]), S = r(S, C, _, T, g, 16, l[38]), T = r(T, S, C, _, y, 23, l[39]), _ = r(_, T, S, C, $, 4, l[40]), C = r(C, _, T, S, s, 11, l[41]), S = r(S, C, _, T, d, 16, l[42]), T = r(T, S, C, _, h, 23, l[43]), _ = r(_, T, S, C, v, 4, l[44]), C = r(C, _, T, S, b, 11, l[45]), S = r(S, C, _, T, k, 16, l[46]), T = r(T, S, C, _, c, 23, l[47]), _ = i(_, T, S, C, s, 6, l[48]), C = i(C, _, T, S, g, 10, l[49]), S = i(S, C, _, T, x, 15, l[50]), T = i(T, S, C, _, p, 21, l[51]), _ = i(_, T, S, C, b, 6, l[52]), C = i(C, _, T, S, d, 10, l[53]), S = i(S, C, _, T, y, 15, l[54]), T = i(T, S, C, _, u, 21, l[55]), _ = i(_, T, S, C, m, 6, l[56]), C = i(C, _, T, S, k, 10, l[57]), S = i(S, C, _, T, h, 15, l[58]), T = i(T, S, C, _, $, 21, l[59]), _ = i(_, T, S, C, f, 6, l[60]), C = i(C, _, T, S, w, 10, l[61]), S = i(S, C, _, T, c, 15, l[62]), T = i(T, S, C, _, v, 21, l[63]);
      a[0] = 0 | a[0] + _, a[1] = 0 | a[1] + T, a[2] = 0 | a[2] + S, a[3] = 0 | a[3] + C;
    },
    _doFinalize: function () {
      var t = this._data, n = t.words, r = 8 * this._nDataBytes, i = 8 * t.sigBytes;
      n[i >>> 5] |= 128 << 24 - i % 32;
      var o = e.floor(r / 4294967296);
      for (n[(i + 64 >>> 9 << 4) + 15] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), n[(i + 64 >>> 9 << 4) + 14] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), t.sigBytes = 4 * (n.length + 1), this._process(), t = this._hash, n = t.words, r = 0; 4 > r; r++)
        i = n[r], n[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
      return t;
    },
    clone: function () {
      var e = u.clone.call(this);
      return e._hash = this._hash.clone(), e;
    }
  }), o.X = u._createHelper(a), o.hx = u._createHmHelper(a);
}(Math), function () {
  var e = Cjs, t = e.enc.Utf8;
  e.algo.Hm = e.lib.Base.extend({
    init: function (e, n) {
      e = this._hasher = new e.init(), 'string' == typeof n && (n = t.parse(n));
      var r = e.blockSize, i = 4 * r;
      n.sigBytes > i && (n = e.finalize(n)), n.clamp();
      for (var o = this._oKey = n.clone(), a = this._iKey = n.clone(), s = o.words, u = a.words, l = 0; r > l; l++)
        s[l] ^= 1549556828, u[l] ^= 909522486;
      o.sigBytes = a.sigBytes = i, this.reset();
    },
    reset: function () {
      var e = this._hasher;
      e.reset(), e.update(this._iKey);
    },
    update: function (e) {
      return this._hasher.update(e), this;
    },
    finalize: function (e) {
      var t = this._hasher;
      return e = t.finalize(e), t.reset(), t.finalize(this._oKey.clone().concat(e));
    }
  });
}(), function () {
  var e, t, n, r, i, o, a, s, u, l;
  e = window.device, window.device = {}, n = window.document.documentElement, l = window.navigator.userAgent.toLowerCase(), device.ios = function () {
    return device.iphone() || device.ipod() || device.ipad();
  }, device.iphone = function () {
    return r('iphone');
  }, device.ipod = function () {
    return r('ipod');
  }, device.ipad = function () {
    return r('ipad');
  }, device.android = function () {
    return r('android');
  }, device.androidPhone = function () {
    return device.android() && r('mobile');
  }, device.androidTablet = function () {
    return device.android() && !r('mobile');
  }, device.blackberry = function () {
    return r('blackberry') || r('bb10') || r('rim');
  }, device.blackberryPhone = function () {
    return device.blackberry() && !r('tablet');
  }, device.blackberryTablet = function () {
    return device.blackberry() && r('tablet');
  }, device.windows = function () {
    return r('windows');
  }, device.windowsPhone = function () {
    return device.windows() && r('phone');
  }, device.windowsTablet = function () {
    return device.windows() && r('touch');
  }, device.fxos = function () {
    return r('(mobile; rv:') || r('(tablet; rv:');
  }, device.fxosPhone = function () {
    return device.fxos() && r('mobile');
  }, device.fxosTablet = function () {
    return device.fxos() && r('tablet');
  }, device.mobile = function () {
    return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone();
  }, device.tablet = function () {
    return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
  }, device.desktop = function () {
    return !(device.ios() || device.windowsTablet() || device.windowsPhone() || device.blackberry() || device.android() || device.fxos());
  }, device.portrait = function () {
    return 90 !== Math.abs(window.orientation);
  }, device.landscape = function () {
    return 90 === Math.abs(window.orientation);
  }, device.noConflict = function () {
    return window.device = e, this;
  }, r = function (e) {
    return -1 !== l.indexOf(e);
  }, o = function (e) {
    var t;
    return t = new RegExp(e, 'i'), n.className.match(t);
  }, t = function (e) {
    return o(e) ? void 0 : n.className += ' ' + e;
  }, s = function (e) {
    return o(e) ? n.className = n.className.replace(e, '') : void 0;
  }, device.ios() ? device.ipad() ? t('ios ipad tablet') : device.iphone() ? t('ios iphone mobile') : device.ipod() && t('ios ipod mobile') : device.android() ? device.androidTablet() ? t('android tablet') : t('android mobile') : device.blackberry() ? device.blackberryTablet() ? t('blackberry tablet') : t('blackberry mobile') : device.windows() ? device.windowsTablet() ? t('windows tablet') : device.windowsPhone() ? t('windows mobile') : t('desktop') : device.fxos() ? device.fxosTablet() ? t('fxos tablet') : t('fxos mobile') : t('desktop'), i = function () {
    return device.landscape() ? (s('portrait'), t('landscape')) : (s('landscape'), t('portrait'));
  }, u = 'onorientationchange' in window, a = u ? 'orientationchange' : 'resize', window.addEventListener ? window.addEventListener(a, i, !1) : window.attachEvent ? window.attachEvent(a, i) : window[a] = i, i();
}.call(this), function (e, t) {
  function n(e) {
    var t = e.length, n = ot.type(e);
    return ot.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : 'array' === n || 'function' !== n && (0 === t || 'number' == typeof t && t > 0 && t - 1 in e);
  }
  function r(e) {
    var t = ht[e] = {};
    return ot.each(e.match(st) || [], function (e, n) {
      t[n] = !0;
    }), t;
  }
  function i() {
    Object.defineProperty(this.cache = {}, 0, {
      get: function () {
        return {};
      }
    }), this.expando = ot.expando + Math.random();
  }
  function o(e, n, r) {
    var i;
    if (r === t && 1 === e.nodeType)
      if (i = 'data-' + n.replace(yt, '-$1').toLowerCase(), r = e.getAttribute(i), 'string' == typeof r) {
        try {
          r = 'true' === r ? !0 : 'false' === r ? !1 : 'null' === r ? null : +r + '' === r ? +r : vt.test(r) ? JSON.parse(r) : r;
        } catch (o) {
        }
        gt.set(e, n, r);
      } else
        r = t;
    return r;
  }
  function a() {
    return !0;
  }
  function s() {
    return !1;
  }
  function u() {
    try {
      return B.activeElement;
    } catch (e) {
    }
  }
  function l(e, t) {
    for (; (e = e[t]) && 1 !== e.nodeType;);
    return e;
  }
  function c(e, t, n) {
    if (ot.isFunction(t))
      return ot.grep(e, function (e, r) {
        return !!t.call(e, r, e) !== n;
      });
    if (t.nodeType)
      return ot.grep(e, function (e) {
        return e === t !== n;
      });
    if ('string' == typeof t) {
      if (Et.test(t))
        return ot.filter(t, e, n);
      t = ot.filter(t, e);
    }
    return ot.grep(e, function (e) {
      return tt.call(t, e) >= 0 !== n;
    });
  }
  function d(e, t) {
    return ot.nodeName(e, 'table') && ot.nodeName(1 === t.nodeType ? t : t.firstChild, 'tr') ? e.getElementsByTagName('tbody')[0] || e.appendChild(e.ownerDocument.createElement('tbody')) : e;
  }
  function f(e) {
    return e.type = (null !== e.getAttribute('type')) + '/' + e.type, e;
  }
  function p(e) {
    var t = Ft.exec(e.type);
    return t ? e.type = t[1] : e.removeAttribute('type'), e;
  }
  function h(e, t) {
    for (var n = e.length, r = 0; n > r; r++)
      mt.set(e[r], 'globalEval', !t || mt.get(t[r], 'globalEval'));
  }
  function g(e, t) {
    var n, r, i, o, a, s, u, l;
    if (1 === t.nodeType) {
      if (mt.hasData(e) && (o = mt.access(e), a = mt.set(t, o), l = o.events)) {
        delete a.handle, a.events = {};
        for (i in l)
          for (n = 0, r = l[i].length; r > n; n++)
            ot.event.add(t, i, l[i][n]);
      }
      gt.hasData(e) && (s = gt.access(e), u = ot.extend({}, s), gt.set(t, u));
    }
  }
  function m(e, n) {
    var r = e.getElementsByTagName ? e.getElementsByTagName(n || '*') : e.querySelectorAll ? e.querySelectorAll(n || '*') : [];
    return n === t || n && ot.nodeName(e, n) ? ot.merge([e], r) : r;
  }
  function v(e, t) {
    var n = t.nodeName.toLowerCase();
    'input' === n && Lt.test(e.type) ? t.checked = e.checked : ('input' === n || 'textarea' === n) && (t.defaultValue = e.defaultValue);
  }
  function y(e, t) {
    if (t in e)
      return t;
    for (var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = Qt.length; i--;)
      if (t = Qt[i] + n, t in e)
        return t;
    return r;
  }
  function w(e, t) {
    return e = t || e, 'none' === ot.css(e, 'display') || !ot.contains(e.ownerDocument, e);
  }
  function b(t) {
    return e.getComputedStyle(t, null);
  }
  function $(e, t) {
    for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++)
      r = e[a], r.style && (o[a] = mt.get(r, 'olddisplay'), n = r.style.display, t ? (o[a] || 'none' !== n || (r.style.display = ''), '' === r.style.display && w(r) && (o[a] = mt.access(r, 'olddisplay', T(r.nodeName)))) : o[a] || (i = w(r), (n && 'none' !== n || !i) && mt.set(r, 'olddisplay', i ? n : ot.css(r, 'display'))));
    for (a = 0; s > a; a++)
      r = e[a], r.style && (t && 'none' !== r.style.display && '' !== r.style.display || (r.style.display = t ? o[a] || '' : 'none'));
    return e;
  }
  function x(e, t, n) {
    var r = Yt.exec(t);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || 'px') : t;
  }
  function k(e, t, n, r, i) {
    for (var o = n === (r ? 'border' : 'content') ? 4 : 'width' === t ? 1 : 0, a = 0; 4 > o; o += 2)
      'margin' === n && (a += ot.css(e, n + Kt[o], !0, i)), r ? ('content' === n && (a -= ot.css(e, 'padding' + Kt[o], !0, i)), 'margin' !== n && (a -= ot.css(e, 'border' + Kt[o] + 'Width', !0, i))) : (a += ot.css(e, 'padding' + Kt[o], !0, i), 'padding' !== n && (a += ot.css(e, 'border' + Kt[o] + 'Width', !0, i)));
    return a;
  }
  function _(e, t, n) {
    var r = !0, i = 'width' === t ? e.offsetWidth : e.offsetHeight, o = b(e), a = ot.support.boxSizing && 'border-box' === ot.css(e, 'boxSizing', !1, o);
    if (0 >= i || null == i) {
      if (i = Vt(e, t, o), (0 > i || null == i) && (i = e.style[t]), zt.test(i))
        return i;
      r = a && (ot.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0;
    }
    return i + k(e, t, n || (a ? 'border' : 'content'), r, o) + 'px';
  }
  function T(e) {
    var t = B, n = Xt[e];
    return n || (n = S(e, t), 'none' !== n && n || (Ut = (Ut || ot('<iframe frameborder=\'0\' width=\'0\' height=\'0\'/>').css('cssText', 'display:block !important')).appendTo(t.documentElement), t = (Ut[0].contentWindow || Ut[0].contentDocument).document, t.write('<!doctype html><html><body>'), t.close(), n = S(e, t), Ut.detach()), Xt[e] = n), n;
  }
  function S(e, t) {
    var n = ot(t.createElement(e)).appendTo(t.body), r = ot.css(n[0], 'display');
    return n.remove(), r;
  }
  function C(e, t, n, r) {
    var i;
    if (ot.isArray(t))
      ot.each(t, function (t, i) {
        n || tn.test(e) ? r(e, i) : C(e + '[' + ('object' == typeof i ? t : '') + ']', i, n, r);
      });
    else if (n || 'object' !== ot.type(t))
      r(e, t);
    else
      for (i in t)
        C(e + '[' + i + ']', t[i], n, r);
  }
  function E(e) {
    return function (t, n) {
      'string' != typeof t && (n = t, t = '*');
      var r, i = 0, o = t.toLowerCase().match(st) || [];
      if (ot.isFunction(n))
        for (; r = o[i++];)
          '+' === r[0] ? (r = r.slice(1) || '*', (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n);
    };
  }
  function D(e, n, r, i) {
    function o(u) {
      var l;
      return a[u] = !0, ot.each(e[u] || [], function (e, u) {
        var c = u(n, r, i);
        return 'string' != typeof c || s || a[c] ? s ? !(l = c) : t : (n.dataTypes.unshift(c), o(c), !1);
      }), l;
    }
    var a = {}, s = e === wn;
    return o(n.dataTypes[0]) || !a['*'] && o('*');
  }
  function M(e, n) {
    var r, i, o = ot.ajaxSettings.flatOptions || {};
    for (r in n)
      n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
    return i && ot.extend(!0, e, i), e;
  }
  function P(e, n, r) {
    for (var i, o, a, s, u = e.contents, l = e.dataTypes; '*' === l[0];)
      l.shift(), i === t && (i = e.mimeType || n.getResponseHeader('Content-Type'));
    if (i)
      for (o in u)
        if (u[o] && u[o].test(i)) {
          l.unshift(o);
          break;
        }
    if (l[0] in r)
      a = l[0];
    else {
      for (o in r) {
        if (!l[0] || e.converters[o + ' ' + l[0]]) {
          a = o;
          break;
        }
        s || (s = o);
      }
      a = a || s;
    }
    return a ? (a !== l[0] && l.unshift(a), r[a]) : t;
  }
  function A(e, t, n, r) {
    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
    if (c[1])
      for (a in e.converters)
        l[a.toLowerCase()] = e.converters[a];
    for (o = c.shift(); o;)
      if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift())
        if ('*' === o)
          o = u;
        else if ('*' !== u && u !== o) {
          if (a = l[u + ' ' + o] || l['* ' + o], !a)
            for (i in l)
              if (s = i.split(' '), s[1] === o && (a = l[u + ' ' + s[0]] || l['* ' + s[0]])) {
                a === !0 ? a = l[i] : l[i] !== !0 && (o = s[0], c.unshift(s[1]));
                break;
              }
          if (a !== !0)
            if (a && e['throws'])
              t = a(t);
            else
              try {
                t = a(t);
              } catch (d) {
                return {
                  state: 'parsererror',
                  error: a ? d : 'No conversion from ' + u + ' to ' + o
                };
              }
        }
    return {
      state: 'success',
      data: t
    };
  }
  function O() {
    return setTimeout(function () {
      En = t;
    }), En = ot.now();
  }
  function N(e, t, n) {
    for (var r, i = (Nn[t] || []).concat(Nn['*']), o = 0, a = i.length; a > o; o++)
      if (r = i[o].call(n, t, e))
        return r;
  }
  function j(e, t, n) {
    var r, i, o = 0, a = On.length, s = ot.Deferred().always(function () {
        delete u.elem;
      }), u = function () {
        if (i)
          return !1;
        for (var t = En || O(), n = Math.max(0, l.startTime + l.duration - t), r = n / l.duration || 0, o = 1 - r, a = 0, u = l.tweens.length; u > a; a++)
          l.tweens[a].run(o);
        return s.notifyWith(e, [
          l,
          o,
          n
        ]), 1 > o && u ? n : (s.resolveWith(e, [l]), !1);
      }, l = s.promise({
        elem: e,
        props: ot.extend({}, t),
        opts: ot.extend(!0, { specialEasing: {} }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: En || O(),
        duration: n.duration,
        tweens: [],
        createTween: function (t, n) {
          var r = ot.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
          return l.tweens.push(r), r;
        },
        stop: function (t) {
          var n = 0, r = t ? l.tweens.length : 0;
          if (i)
            return this;
          for (i = !0; r > n; n++)
            l.tweens[n].run(1);
          return t ? s.resolveWith(e, [
            l,
            t
          ]) : s.rejectWith(e, [
            l,
            t
          ]), this;
        }
      }), c = l.props;
    for (L(c, l.opts.specialEasing); a > o; o++)
      if (r = On[o].call(l, e, c, l.opts))
        return r;
    return ot.map(c, N, l), ot.isFunction(l.opts.start) && l.opts.start.call(e, l), ot.fx.timer(ot.extend(u, {
      elem: e,
      anim: l,
      queue: l.opts.queue
    })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always);
  }
  function L(e, t) {
    var n, r, i, o, a;
    for (n in e)
      if (r = ot.camelCase(n), i = t[r], o = e[n], ot.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = ot.cssHooks[r], a && 'expand' in a) {
        o = a.expand(o), delete e[r];
        for (n in o)
          n in e || (e[n] = o[n], t[n] = i);
      } else
        t[r] = i;
  }
  function R(e, n, r) {
    var i, o, a, s, u, l, c = this, d = {}, f = e.style, p = e.nodeType && w(e), h = mt.get(e, 'fxshow');
    r.queue || (u = ot._queueHooks(e, 'fx'), null == u.unqueued && (u.unqueued = 0, l = u.empty.fire, u.empty.fire = function () {
      u.unqueued || l();
    }), u.unqueued++, c.always(function () {
      c.always(function () {
        u.unqueued--, ot.queue(e, 'fx').length || u.empty.fire();
      });
    })), 1 === e.nodeType && ('height' in n || 'width' in n) && (r.overflow = [
      f.overflow,
      f.overflowX,
      f.overflowY
    ], 'inline' === ot.css(e, 'display') && 'none' === ot.css(e, 'float') && (f.display = 'inline-block')), r.overflow && (f.overflow = 'hidden', c.always(function () {
      f.overflow = r.overflow[0], f.overflowX = r.overflow[1], f.overflowY = r.overflow[2];
    }));
    for (i in n)
      if (o = n[i], Mn.exec(o)) {
        if (delete n[i], a = a || 'toggle' === o, o === (p ? 'hide' : 'show')) {
          if ('show' !== o || !h || h[i] === t)
            continue;
          p = !0;
        }
        d[i] = h && h[i] || ot.style(e, i);
      }
    if (!ot.isEmptyObject(d)) {
      h ? 'hidden' in h && (p = h.hidden) : h = mt.access(e, 'fxshow', {}), a && (h.hidden = !p), p ? ot(e).show() : c.done(function () {
        ot(e).hide();
      }), c.done(function () {
        var t;
        mt.remove(e, 'fxshow');
        for (t in d)
          ot.style(e, t, d[t]);
      });
      for (i in d)
        s = N(p ? h[i] : 0, i, c), i in h || (h[i] = s.start, p && (s.end = s.start, s.start = 'width' === i || 'height' === i ? 1 : 0));
    }
  }
  function I(e, t, n, r, i) {
    return new I.prototype.init(e, t, n, r, i);
  }
  function F(e, t) {
    var n, r = { height: e }, i = 0;
    for (t = t ? 1 : 0; 4 > i; i += 2 - t)
      n = Kt[i], r['margin' + n] = r['padding' + n] = e;
    return t && (r.opacity = r.width = e), r;
  }
  function H(e) {
    return ot.isWindow(e) ? e : 9 === e.nodeType && e.defaultView;
  }
  var q, V, U = typeof t, W = e.location, B = e.document, Y = B.documentElement, z = e.jQuery, G = e.$, X = {}, J = [], Z = '2.0.3', K = J.concat, Q = J.push, et = J.slice, tt = J.indexOf, nt = X.toString, rt = X.hasOwnProperty, it = Z.trim, ot = function (e, t) {
      return new ot.fn.init(e, t, q);
    }, at = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, st = /\S+/g, ut = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, lt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, ct = /^-ms-/, dt = /-([\da-z])/gi, ft = function (e, t) {
      return t.toUpperCase();
    }, pt = function () {
      B.removeEventListener('DOMContentLoaded', pt, !1), e.removeEventListener('load', pt, !1), ot.ready();
    };
  ot.fn = ot.prototype = {
    jquery: Z,
    constructor: ot,
    init: function (e, n, r) {
      var i, o;
      if (!e)
        return this;
      if ('string' == typeof e) {
        if (i = '<' === e.charAt(0) && '>' === e.charAt(e.length - 1) && e.length >= 3 ? [
            null,
            e,
            null
          ] : ut.exec(e), !i || !i[1] && n)
          return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
        if (i[1]) {
          if (n = n instanceof ot ? n[0] : n, ot.merge(this, ot.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : B, !0)), lt.test(i[1]) && ot.isPlainObject(n))
            for (i in n)
              ot.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
          return this;
        }
        return o = B.getElementById(i[2]), o && o.parentNode && (this.length = 1, this[0] = o), this.context = B, this.selector = e, this;
      }
      return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ot.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), ot.makeArray(e, this));
    },
    selector: '',
    length: 0,
    toArray: function () {
      return et.call(this);
    },
    get: function (e) {
      return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e];
    },
    pushStack: function (e) {
      var t = ot.merge(this.constructor(), e);
      return t.prevObject = this, t.context = this.context, t;
    },
    each: function (e, t) {
      return ot.each(this, e, t);
    },
    ready: function (e) {
      return ot.ready.promise().done(e), this;
    },
    slice: function () {
      return this.pushStack(et.apply(this, arguments));
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    eq: function (e) {
      var t = this.length, n = +e + (0 > e ? t : 0);
      return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
    },
    map: function (e) {
      return this.pushStack(ot.map(this, function (t, n) {
        return e.call(t, n, t);
      }));
    },
    end: function () {
      return this.prevObject || this.constructor(null);
    },
    push: Q,
    sort: [].sort,
    splice: [].splice
  }, ot.fn.init.prototype = ot.fn, ot.extend = ot.fn.extend = function () {
    var e, n, r, i, o, a, s = arguments[0] || {}, u = 1, l = arguments.length, c = !1;
    for ('boolean' == typeof s && (c = s, s = arguments[1] || {}, u = 2), 'object' == typeof s || ot.isFunction(s) || (s = {}), l === u && (s = this, --u); l > u; u++)
      if (null != (e = arguments[u]))
        for (n in e)
          r = s[n], i = e[n], s !== i && (c && i && (ot.isPlainObject(i) || (o = ot.isArray(i))) ? (o ? (o = !1, a = r && ot.isArray(r) ? r : []) : a = r && ot.isPlainObject(r) ? r : {}, s[n] = ot.extend(c, a, i)) : i !== t && (s[n] = i));
    return s;
  }, ot.extend({
    expando: 'jQuery' + (Z + Math.random()).replace(/\D/g, ''),
    noConflict: function (t) {
      return e.$ === ot && (e.$ = G), t && e.jQuery === ot && (e.jQuery = z), ot;
    },
    isReady: !1,
    readyWait: 1,
    holdReady: function (e) {
      e ? ot.readyWait++ : ot.ready(!0);
    },
    ready: function (e) {
      (e === !0 ? --ot.readyWait : ot.isReady) || (ot.isReady = !0, e !== !0 && --ot.readyWait > 0 || (V.resolveWith(B, [ot]), ot.fn.trigger && ot(B).trigger('ready').off('ready')));
    },
    isFunction: function (e) {
      return 'function' === ot.type(e);
    },
    isArray: Array.isArray,
    isWindow: function (e) {
      return null != e && e === e.window;
    },
    isNumeric: function (e) {
      return !isNaN(parseFloat(e)) && isFinite(e);
    },
    type: function (e) {
      return null == e ? e + '' : 'object' == typeof e || 'function' == typeof e ? X[nt.call(e)] || 'object' : typeof e;
    },
    isPlainObject: function (e) {
      if ('object' !== ot.type(e) || e.nodeType || ot.isWindow(e))
        return !1;
      try {
        if (e.constructor && !rt.call(e.constructor.prototype, 'isPrototypeOf'))
          return !1;
      } catch (t) {
        return !1;
      }
      return !0;
    },
    isEmptyObject: function (e) {
      var t;
      for (t in e)
        return !1;
      return !0;
    },
    error: function (e) {
      throw Error(e);
    },
    parseHTML: function (e, t, n) {
      if (!e || 'string' != typeof e)
        return null;
      'boolean' == typeof t && (n = t, t = !1), t = t || B;
      var r = lt.exec(e), i = !n && [];
      return r ? [t.createElement(r[1])] : (r = ot.buildFragment([e], t, i), i && ot(i).remove(), ot.merge([], r.childNodes));
    },
    parseJSON: JSON.parse,
    parseXML: function (e) {
      var n, r;
      if (!e || 'string' != typeof e)
        return null;
      try {
        r = new DOMParser(), n = r.parseFromString(e, 'text/xml');
      } catch (i) {
        n = t;
      }
      return (!n || n.getElementsByTagName('parsererror').length) && ot.error('Invalid XML: ' + e), n;
    },
    noop: function () {
    },
    globalEval: function (e) {
      var t, n = eval;
      e = ot.trim(e), e && (1 === e.indexOf('use strict') ? (t = B.createElement('script'), t.text = e, B.head.appendChild(t).parentNode.removeChild(t)) : n(e));
    },
    camelCase: function (e) {
      return e.replace(ct, 'ms-').replace(dt, ft);
    },
    nodeName: function (e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
    },
    each: function (e, t, r) {
      var i, o = 0, a = e.length, s = n(e);
      if (r) {
        if (s)
          for (; a > o && (i = t.apply(e[o], r), i !== !1); o++);
        else
          for (o in e)
            if (i = t.apply(e[o], r), i === !1)
              break;
      } else if (s)
        for (; a > o && (i = t.call(e[o], o, e[o]), i !== !1); o++);
      else
        for (o in e)
          if (i = t.call(e[o], o, e[o]), i === !1)
            break;
      return e;
    },
    trim: function (e) {
      return null == e ? '' : it.call(e);
    },
    makeArray: function (e, t) {
      var r = t || [];
      return null != e && (n(Object(e)) ? ot.merge(r, 'string' == typeof e ? [e] : e) : Q.call(r, e)), r;
    },
    inArray: function (e, t, n) {
      return null == t ? -1 : tt.call(t, e, n);
    },
    merge: function (e, n) {
      var r = n.length, i = e.length, o = 0;
      if ('number' == typeof r)
        for (; r > o; o++)
          e[i++] = n[o];
      else
        for (; n[o] !== t;)
          e[i++] = n[o++];
      return e.length = i, e;
    },
    grep: function (e, t, n) {
      var r, i = [], o = 0, a = e.length;
      for (n = !!n; a > o; o++)
        r = !!t(e[o], o), n !== r && i.push(e[o]);
      return i;
    },
    map: function (e, t, r) {
      var i, o = 0, a = e.length, s = n(e), u = [];
      if (s)
        for (; a > o; o++)
          i = t(e[o], o, r), null != i && (u[u.length] = i);
      else
        for (o in e)
          i = t(e[o], o, r), null != i && (u[u.length] = i);
      return K.apply([], u);
    },
    guid: 1,
    proxy: function (e, n) {
      var r, i, o;
      return 'string' == typeof n && (r = e[n], n = e, e = r), ot.isFunction(e) ? (i = et.call(arguments, 2), o = function () {
        return e.apply(n || this, i.concat(et.call(arguments)));
      }, o.guid = e.guid = e.guid || ot.guid++, o) : t;
    },
    access: function (e, n, r, i, o, a, s) {
      var u = 0, l = e.length, c = null == r;
      if ('object' === ot.type(r)) {
        o = !0;
        for (u in r)
          ot.access(e, n, u, r[u], !0, a, s);
      } else if (i !== t && (o = !0, ot.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), n = null) : (c = n, n = function (e, t, n) {
          return c.call(ot(e), n);
        })), n))
        for (; l > u; u++)
          n(e[u], r, s ? i : i.call(e[u], u, n(e[u], r)));
      return o ? e : c ? n.call(e) : l ? n(e[0], r) : a;
    },
    now: Date.now,
    swap: function (e, t, n, r) {
      var i, o, a = {};
      for (o in t)
        a[o] = e.style[o], e.style[o] = t[o];
      i = n.apply(e, r || []);
      for (o in t)
        e.style[o] = a[o];
      return i;
    }
  }), ot.ready.promise = function (t) {
    return V || (V = ot.Deferred(), 'complete' === B.readyState ? setTimeout(ot.ready) : (B.addEventListener('DOMContentLoaded', pt, !1), e.addEventListener('load', pt, !1))), V.promise(t);
  }, ot.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (e, t) {
    X['[object ' + t + ']'] = t.toLowerCase();
  }), q = ot(B), function (e, t) {
    function n(e, t, n, r) {
      var i, o, a, s, u, l, c, d, h, g;
      if ((t ? t.ownerDocument || t : H) !== A && P(t), t = t || A, n = n || [], !e || 'string' != typeof e)
        return n;
      if (1 !== (s = t.nodeType) && 9 !== s)
        return [];
      if (N && !r) {
        if (i = wt.exec(e))
          if (a = i[1]) {
            if (9 === s) {
              if (o = t.getElementById(a), !o || !o.parentNode)
                return n;
              if (o.id === a)
                return n.push(o), n;
            } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && I(t, o) && o.id === a)
              return n.push(o), n;
          } else {
            if (i[2])
              return et.apply(n, t.getElementsByTagName(e)), n;
            if ((a = i[3]) && k.getElementsByClassName && t.getElementsByClassName)
              return et.apply(n, t.getElementsByClassName(a)), n;
          }
        if (k.qsa && (!j || !j.test(e))) {
          if (d = c = F, h = t, g = 9 === s && e, 1 === s && 'object' !== t.nodeName.toLowerCase()) {
            for (l = f(e), (c = t.getAttribute('id')) ? d = c.replace(xt, '\\$&') : t.setAttribute('id', d), d = '[id=\'' + d + '\'] ', u = l.length; u--;)
              l[u] = d + p(l[u]);
            h = pt.test(e) && t.parentNode || t, g = l.join(',');
          }
          if (g)
            try {
              return et.apply(n, h.querySelectorAll(g)), n;
            } catch (m) {
            } finally {
              c || t.removeAttribute('id');
            }
        }
      }
      return $(e.replace(ct, '$1'), t, n, r);
    }
    function r() {
      function e(n, r) {
        return t.push(n += ' ') > T.cacheLength && delete e[t.shift()], e[n] = r;
      }
      var t = [];
      return e;
    }
    function i(e) {
      return e[F] = !0, e;
    }
    function o(e) {
      var t = A.createElement('div');
      try {
        return !!e(t);
      } catch (n) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), t = null;
      }
    }
    function a(e, t) {
      for (var n = e.split('|'), r = e.length; r--;)
        T.attrHandle[n[r]] = t;
    }
    function s(e, t) {
      var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || X) - (~e.sourceIndex || X);
      if (r)
        return r;
      if (n)
        for (; n = n.nextSibling;)
          if (n === t)
            return -1;
      return e ? 1 : -1;
    }
    function u(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return 'input' === n && t.type === e;
      };
    }
    function l(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return ('input' === n || 'button' === n) && t.type === e;
      };
    }
    function c(e) {
      return i(function (t) {
        return t = +t, i(function (n, r) {
          for (var i, o = e([], n.length, t), a = o.length; a--;)
            n[i = o[a]] && (n[i] = !(r[i] = n[i]));
        });
      });
    }
    function d() {
    }
    function f(e, t) {
      var r, i, o, a, s, u, l, c = W[e + ' '];
      if (c)
        return t ? 0 : c.slice(0);
      for (s = e, u = [], l = T.preFilter; s;) {
        (!r || (i = dt.exec(s))) && (i && (s = s.slice(i[0].length) || s), u.push(o = [])), r = !1, (i = ft.exec(s)) && (r = i.shift(), o.push({
          value: r,
          type: i[0].replace(ct, ' ')
        }), s = s.slice(r.length));
        for (a in T.filter)
          !(i = vt[a].exec(s)) || l[a] && !(i = l[a](i)) || (r = i.shift(), o.push({
            value: r,
            type: a,
            matches: i
          }), s = s.slice(r.length));
        if (!r)
          break;
      }
      return t ? s.length : s ? n.error(e) : W(e, u).slice(0);
    }
    function p(e) {
      for (var t = 0, n = e.length, r = ''; n > t; t++)
        r += e[t].value;
      return r;
    }
    function h(e, t, n) {
      var r = t.dir, i = n && 'parentNode' === r, o = V++;
      return t.first ? function (t, n, o) {
        for (; t = t[r];)
          if (1 === t.nodeType || i)
            return e(t, n, o);
      } : function (t, n, a) {
        var s, u, l, c = q + ' ' + o;
        if (a) {
          for (; t = t[r];)
            if ((1 === t.nodeType || i) && e(t, n, a))
              return !0;
        } else
          for (; t = t[r];)
            if (1 === t.nodeType || i)
              if (l = t[F] || (t[F] = {}), (u = l[r]) && u[0] === c) {
                if ((s = u[1]) === !0 || s === _)
                  return s === !0;
              } else if (u = l[r] = [c], u[1] = e(t, n, a) || _, u[1] === !0)
                return !0;
      };
    }
    function g(e) {
      return e.length > 1 ? function (t, n, r) {
        for (var i = e.length; i--;)
          if (!e[i](t, n, r))
            return !1;
        return !0;
      } : e[0];
    }
    function m(e, t, n, r, i) {
      for (var o, a = [], s = 0, u = e.length, l = null != t; u > s; s++)
        (o = e[s]) && (!n || n(o, r, i)) && (a.push(o), l && t.push(s));
      return a;
    }
    function v(e, t, n, r, o, a) {
      return r && !r[F] && (r = v(r)), o && !o[F] && (o = v(o, a)), i(function (i, a, s, u) {
        var l, c, d, f = [], p = [], h = a.length, g = i || b(t || '*', s.nodeType ? [s] : s, []), v = !e || !i && t ? g : m(g, f, e, s, u), y = n ? o || (i ? e : h || r) ? [] : a : v;
        if (n && n(v, y, s, u), r)
          for (l = m(y, p), r(l, [], s, u), c = l.length; c--;)
            (d = l[c]) && (y[p[c]] = !(v[p[c]] = d));
        if (i) {
          if (o || e) {
            if (o) {
              for (l = [], c = y.length; c--;)
                (d = y[c]) && l.push(v[c] = d);
              o(null, y = [], l, u);
            }
            for (c = y.length; c--;)
              (d = y[c]) && (l = o ? nt.call(i, d) : f[c]) > -1 && (i[l] = !(a[l] = d));
          }
        } else
          y = m(y === a ? y.splice(h, y.length) : y), o ? o(null, a, y, u) : et.apply(a, y);
      });
    }
    function y(e) {
      for (var t, n, r, i = e.length, o = T.relative[e[0].type], a = o || T.relative[' '], s = o ? 1 : 0, u = h(function (e) {
            return e === t;
          }, a, !0), l = h(function (e) {
            return nt.call(t, e) > -1;
          }, a, !0), c = [function (e, n, r) {
              return !o && (r || n !== D) || ((t = n).nodeType ? u(e, n, r) : l(e, n, r));
            }]; i > s; s++)
        if (n = T.relative[e[s].type])
          c = [h(g(c), n)];
        else {
          if (n = T.filter[e[s].type].apply(null, e[s].matches), n[F]) {
            for (r = ++s; i > r && !T.relative[e[r].type]; r++);
            return v(s > 1 && g(c), s > 1 && p(e.slice(0, s - 1).concat({ value: ' ' === e[s - 2].type ? '*' : '' })).replace(ct, '$1'), n, r > s && y(e.slice(s, r)), i > r && y(e = e.slice(r)), i > r && p(e));
          }
          c.push(n);
        }
      return g(c);
    }
    function w(e, t) {
      var r = 0, o = t.length > 0, a = e.length > 0, s = function (i, s, u, l, c) {
          var d, f, p, h = [], g = 0, v = '0', y = i && [], w = null != c, b = D, $ = i || a && T.find.TAG('*', c && s.parentNode || s), x = q += null == b ? 1 : Math.random() || 0.1;
          for (w && (D = s !== A && s, _ = r); null != (d = $[v]); v++) {
            if (a && d) {
              for (f = 0; p = e[f++];)
                if (p(d, s, u)) {
                  l.push(d);
                  break;
                }
              w && (q = x, _ = ++r);
            }
            o && ((d = !p && d) && g--, i && y.push(d));
          }
          if (g += v, o && v !== g) {
            for (f = 0; p = t[f++];)
              p(y, h, s, u);
            if (i) {
              if (g > 0)
                for (; v--;)
                  y[v] || h[v] || (h[v] = K.call(l));
              h = m(h);
            }
            et.apply(l, h), w && !i && h.length > 0 && g + t.length > 1 && n.uniqueSort(l);
          }
          return w && (q = x, D = b), y;
        };
      return o ? i(s) : s;
    }
    function b(e, t, r) {
      for (var i = 0, o = t.length; o > i; i++)
        n(e, t[i], r);
      return r;
    }
    function $(e, t, n, r) {
      var i, o, a, s, u, l = f(e);
      if (!r && 1 === l.length) {
        if (o = l[0] = l[0].slice(0), o.length > 2 && 'ID' === (a = o[0]).type && k.getById && 9 === t.nodeType && N && T.relative[o[1].type]) {
          if (t = (T.find.ID(a.matches[0].replace(kt, _t), t) || [])[0], !t)
            return n;
          e = e.slice(o.shift().value.length);
        }
        for (i = vt.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !T.relative[s = a.type]);)
          if ((u = T.find[s]) && (r = u(a.matches[0].replace(kt, _t), pt.test(o[0].type) && t.parentNode || t))) {
            if (o.splice(i, 1), e = r.length && p(o), !e)
              return et.apply(n, r), n;
            break;
          }
      }
      return E(e, l)(r, t, !N, n, pt.test(e)), n;
    }
    var x, k, _, T, S, C, E, D, M, P, A, O, N, j, L, R, I, F = 'sizzle' + -new Date(), H = e.document, q = 0, V = 0, U = r(), W = r(), B = r(), Y = !1, z = function (e, t) {
        return e === t ? (Y = !0, 0) : 0;
      }, G = typeof t, X = 1 << 31, J = {}.hasOwnProperty, Z = [], K = Z.pop, Q = Z.push, et = Z.push, tt = Z.slice, nt = Z.indexOf || function (e) {
        for (var t = 0, n = this.length; n > t; t++)
          if (this[t] === e)
            return t;
        return -1;
      }, rt = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped', it = '[\\x20\\t\\r\\n\\f]', at = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+', st = at.replace('w', 'w#'), ut = '\\[' + it + '*(' + at + ')' + it + '*(?:([*^$|!~]?=)' + it + '*(?:([\'"])((?:\\\\.|[^\\\\])*?)\\3|(' + st + ')|)|)' + it + '*\\]', lt = ':(' + at + ')(?:\\((([\'"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|' + ut.replace(3, 8) + ')*)|.*)\\)|)', ct = RegExp('^' + it + '+|((?:^|[^\\\\])(?:\\\\.)*)' + it + '+$', 'g'), dt = RegExp('^' + it + '*,' + it + '*'), ft = RegExp('^' + it + '*([>+~]|' + it + ')' + it + '*'), pt = RegExp(it + '*[+~]'), ht = RegExp('=' + it + '*([^\\]\'"]*)' + it + '*\\]', 'g'), gt = RegExp(lt), mt = RegExp('^' + st + '$'), vt = {
        ID: RegExp('^#(' + at + ')'),
        CLASS: RegExp('^\\.(' + at + ')'),
        TAG: RegExp('^(' + at.replace('w', 'w*') + ')'),
        ATTR: RegExp('^' + ut),
        PSEUDO: RegExp('^' + lt),
        CHILD: RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + it + '*(even|odd|(([+-]|)(\\d*)n|)' + it + '*(?:([+-]|)' + it + '*(\\d+)|))' + it + '*\\)|)', 'i'),
        bool: RegExp('^(?:' + rt + ')$', 'i'),
        needsContext: RegExp('^' + it + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + it + '*((?:-\\d)?\\d*)' + it + '*\\)|)(?=[^-]|$)', 'i')
      }, yt = /^[^{]+\{\s*\[native \w/, wt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, bt = /^(?:input|select|textarea|button)$/i, $t = /^h\d$/i, xt = /'|\\/g, kt = RegExp('\\\\([\\da-f]{1,6}' + it + '?|(' + it + ')|.)', 'ig'), _t = function (e, t, n) {
        var r = '0x' + t - 65536;
        return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r);
      };
    try {
      et.apply(Z = tt.call(H.childNodes), H.childNodes), Z[H.childNodes.length].nodeType;
    } catch (Tt) {
      et = {
        apply: Z.length ? function (e, t) {
          Q.apply(e, tt.call(t));
        } : function (e, t) {
          for (var n = e.length, r = 0; e[n++] = t[r++];);
          e.length = n - 1;
        }
      };
    }
    C = n.isXML = function (e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? 'HTML' !== t.nodeName : !1;
    }, k = n.support = {}, P = n.setDocument = function (e) {
      var n = e ? e.ownerDocument || e : H, r = n.defaultView;
      return n !== A && 9 === n.nodeType && n.documentElement ? (A = n, O = n.documentElement, N = !C(n), r && r.attachEvent && r !== r.top && r.attachEvent('onbeforeunload', function () {
        P();
      }), k.attributes = o(function (e) {
        return e.className = 'i', !e.getAttribute('className');
      }), k.getElementsByTagName = o(function (e) {
        return e.appendChild(n.createComment('')), !e.getElementsByTagName('*').length;
      }), k.getElementsByClassName = o(function (e) {
        return e.innerHTML = '<div class=\'a\'></div><div class=\'a i\'></div>', e.firstChild.className = 'i', 2 === e.getElementsByClassName('i').length;
      }), k.getById = o(function (e) {
        return O.appendChild(e).id = F, !n.getElementsByName || !n.getElementsByName(F).length;
      }), k.getById ? (T.find.ID = function (e, t) {
        if (typeof t.getElementById !== G && N) {
          var n = t.getElementById(e);
          return n && n.parentNode ? [n] : [];
        }
      }, T.filter.ID = function (e) {
        var t = e.replace(kt, _t);
        return function (e) {
          return e.getAttribute('id') === t;
        };
      }) : (delete T.find.ID, T.filter.ID = function (e) {
        var t = e.replace(kt, _t);
        return function (e) {
          var n = typeof e.getAttributeNode !== G && e.getAttributeNode('id');
          return n && n.value === t;
        };
      }), T.find.TAG = k.getElementsByTagName ? function (e, n) {
        return typeof n.getElementsByTagName !== G ? n.getElementsByTagName(e) : t;
      } : function (e, t) {
        var n, r = [], i = 0, o = t.getElementsByTagName(e);
        if ('*' === e) {
          for (; n = o[i++];)
            1 === n.nodeType && r.push(n);
          return r;
        }
        return o;
      }, T.find.CLASS = k.getElementsByClassName && function (e, n) {
        return typeof n.getElementsByClassName !== G && N ? n.getElementsByClassName(e) : t;
      }, L = [], j = [], (k.qsa = yt.test(n.querySelectorAll)) && (o(function (e) {
        e.innerHTML = '<select><option selected=\'\'></option></select>', e.querySelectorAll('[selected]').length || j.push('\\[' + it + '*(?:value|' + rt + ')'), e.querySelectorAll(':checked').length || j.push(':checked');
      }), o(function (e) {
        var t = n.createElement('input');
        t.setAttribute('type', 'hidden'), e.appendChild(t).setAttribute('t', ''), e.querySelectorAll('[t^=\'\']').length && j.push('[*^$]=' + it + '*(?:\'\'|"")'), e.querySelectorAll(':enabled').length || j.push(':enabled', ':disabled'), e.querySelectorAll('*,:x'), j.push(',.*:');
      })), (k.matchesSelector = yt.test(R = O.webkitMatchesSelector || O.mozMatchesSelector || O.oMatchesSelector || O.msMatchesSelector)) && o(function (e) {
        k.disconnectedMatch = R.call(e, 'div'), R.call(e, '[s!=\'\']:x'), L.push('!=', lt);
      }), j = j.length && RegExp(j.join('|')), L = L.length && RegExp(L.join('|')), I = yt.test(O.contains) || O.compareDocumentPosition ? function (e, t) {
        var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
      } : function (e, t) {
        if (t)
          for (; t = t.parentNode;)
            if (t === e)
              return !0;
        return !1;
      }, z = O.compareDocumentPosition ? function (e, t) {
        if (e === t)
          return Y = !0, 0;
        var r = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t);
        return r ? 1 & r || !k.sortDetached && t.compareDocumentPosition(e) === r ? e === n || I(H, e) ? -1 : t === n || I(H, t) ? 1 : M ? nt.call(M, e) - nt.call(M, t) : 0 : 4 & r ? -1 : 1 : e.compareDocumentPosition ? -1 : 1;
      } : function (e, t) {
        var r, i = 0, o = e.parentNode, a = t.parentNode, u = [e], l = [t];
        if (e === t)
          return Y = !0, 0;
        if (!o || !a)
          return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : M ? nt.call(M, e) - nt.call(M, t) : 0;
        if (o === a)
          return s(e, t);
        for (r = e; r = r.parentNode;)
          u.unshift(r);
        for (r = t; r = r.parentNode;)
          l.unshift(r);
        for (; u[i] === l[i];)
          i++;
        return i ? s(u[i], l[i]) : u[i] === H ? -1 : l[i] === H ? 1 : 0;
      }, n) : A;
    }, n.matches = function (e, t) {
      return n(e, null, null, t);
    }, n.matchesSelector = function (e, t) {
      if ((e.ownerDocument || e) !== A && P(e), t = t.replace(ht, '=\'$1\']'), !(!k.matchesSelector || !N || L && L.test(t) || j && j.test(t)))
        try {
          var r = R.call(e, t);
          if (r || k.disconnectedMatch || e.document && 11 !== e.document.nodeType)
            return r;
        } catch (i) {
        }
      return n(t, A, null, [e]).length > 0;
    }, n.contains = function (e, t) {
      return (e.ownerDocument || e) !== A && P(e), I(e, t);
    }, n.attr = function (e, n) {
      (e.ownerDocument || e) !== A && P(e);
      var r = T.attrHandle[n.toLowerCase()], i = r && J.call(T.attrHandle, n.toLowerCase()) ? r(e, n, !N) : t;
      return i === t ? k.attributes || !N ? e.getAttribute(n) : (i = e.getAttributeNode(n)) && i.specified ? i.value : null : i;
    }, n.error = function (e) {
      throw Error('Syntax error, unrecognized expression: ' + e);
    }, n.uniqueSort = function (e) {
      var t, n = [], r = 0, i = 0;
      if (Y = !k.detectDuplicates, M = !k.sortStable && e.slice(0), e.sort(z), Y) {
        for (; t = e[i++];)
          t === e[i] && (r = n.push(i));
        for (; r--;)
          e.splice(n[r], 1);
      }
      return e;
    }, S = n.getText = function (e) {
      var t, n = '', r = 0, i = e.nodeType;
      if (i) {
        if (1 === i || 9 === i || 11 === i) {
          if ('string' == typeof e.textContent)
            return e.textContent;
          for (e = e.firstChild; e; e = e.nextSibling)
            n += S(e);
        } else if (3 === i || 4 === i)
          return e.nodeValue;
      } else
        for (; t = e[r]; r++)
          n += S(t);
      return n;
    }, T = n.selectors = {
      cacheLength: 50,
      createPseudo: i,
      match: vt,
      attrHandle: {},
      find: {},
      relative: {
        '>': {
          dir: 'parentNode',
          first: !0
        },
        ' ': { dir: 'parentNode' },
        '+': {
          dir: 'previousSibling',
          first: !0
        },
        '~': { dir: 'previousSibling' }
      },
      preFilter: {
        ATTR: function (e) {
          return e[1] = e[1].replace(kt, _t), e[3] = (e[4] || e[5] || '').replace(kt, _t), '~=' === e[2] && (e[3] = ' ' + e[3] + ' '), e.slice(0, 4);
        },
        CHILD: function (e) {
          return e[1] = e[1].toLowerCase(), 'nth' === e[1].slice(0, 3) ? (e[3] || n.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ('even' === e[3] || 'odd' === e[3])), e[5] = +(e[7] + e[8] || 'odd' === e[3])) : e[3] && n.error(e[0]), e;
        },
        PSEUDO: function (e) {
          var n, r = !e[5] && e[2];
          return vt.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && gt.test(r) && (n = f(r, !0)) && (n = r.indexOf(')', r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3));
        }
      },
      filter: {
        TAG: function (e) {
          var t = e.replace(kt, _t).toLowerCase();
          return '*' === e ? function () {
            return !0;
          } : function (e) {
            return e.nodeName && e.nodeName.toLowerCase() === t;
          };
        },
        CLASS: function (e) {
          var t = U[e + ' '];
          return t || (t = RegExp('(^|' + it + ')' + e + '(' + it + '|$)')) && U(e, function (e) {
            return t.test('string' == typeof e.className && e.className || typeof e.getAttribute !== G && e.getAttribute('class') || '');
          });
        },
        ATTR: function (e, t, r) {
          return function (i) {
            var o = n.attr(i, e);
            return null == o ? '!=' === t : t ? (o += '', '=' === t ? o === r : '!=' === t ? o !== r : '^=' === t ? r && 0 === o.indexOf(r) : '*=' === t ? r && o.indexOf(r) > -1 : '$=' === t ? r && o.slice(-r.length) === r : '~=' === t ? (' ' + o + ' ').indexOf(r) > -1 : '|=' === t ? o === r || o.slice(0, r.length + 1) === r + '-' : !1) : !0;
          };
        },
        CHILD: function (e, t, n, r, i) {
          var o = 'nth' !== e.slice(0, 3), a = 'last' !== e.slice(-4), s = 'of-type' === t;
          return 1 === r && 0 === i ? function (e) {
            return !!e.parentNode;
          } : function (t, n, u) {
            var l, c, d, f, p, h, g = o !== a ? 'nextSibling' : 'previousSibling', m = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !u && !s;
            if (m) {
              if (o) {
                for (; g;) {
                  for (d = t; d = d[g];)
                    if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType)
                      return !1;
                  h = g = 'only' === e && !h && 'nextSibling';
                }
                return !0;
              }
              if (h = [a ? m.firstChild : m.lastChild], a && y) {
                for (c = m[F] || (m[F] = {}), l = c[e] || [], p = l[0] === q && l[1], f = l[0] === q && l[2], d = p && m.childNodes[p]; d = ++p && d && d[g] || (f = p = 0) || h.pop();)
                  if (1 === d.nodeType && ++f && d === t) {
                    c[e] = [
                      q,
                      p,
                      f
                    ];
                    break;
                  }
              } else if (y && (l = (t[F] || (t[F] = {}))[e]) && l[0] === q)
                f = l[1];
              else
                for (; (d = ++p && d && d[g] || (f = p = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++f || (y && ((d[F] || (d[F] = {}))[e] = [
                    q,
                    f
                  ]), d !== t)););
              return f -= i, f === r || 0 === f % r && f / r >= 0;
            }
          };
        },
        PSEUDO: function (e, t) {
          var r, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || n.error('unsupported pseudo: ' + e);
          return o[F] ? o(t) : o.length > 1 ? (r = [
            e,
            e,
            '',
            t
          ], T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, n) {
            for (var r, i = o(e, t), a = i.length; a--;)
              r = nt.call(e, i[a]), e[r] = !(n[r] = i[a]);
          }) : function (e) {
            return o(e, 0, r);
          }) : o;
        }
      },
      pseudos: {
        not: i(function (e) {
          var t = [], n = [], r = E(e.replace(ct, '$1'));
          return r[F] ? i(function (e, t, n, i) {
            for (var o, a = r(e, null, i, []), s = e.length; s--;)
              (o = a[s]) && (e[s] = !(t[s] = o));
          }) : function (e, i, o) {
            return t[0] = e, r(t, null, o, n), !n.pop();
          };
        }),
        has: i(function (e) {
          return function (t) {
            return n(e, t).length > 0;
          };
        }),
        contains: i(function (e) {
          return function (t) {
            return (t.textContent || t.innerText || S(t)).indexOf(e) > -1;
          };
        }),
        lang: i(function (e) {
          return mt.test(e || '') || n.error('unsupported lang: ' + e), e = e.replace(kt, _t).toLowerCase(), function (t) {
            var n;
            do
              if (n = N ? t.lang : t.getAttribute('xml:lang') || t.getAttribute('lang'))
                return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + '-');
            while ((t = t.parentNode) && 1 === t.nodeType);
            return !1;
          };
        }),
        target: function (t) {
          var n = e.location && e.location.hash;
          return n && n.slice(1) === t.id;
        },
        root: function (e) {
          return e === O;
        },
        focus: function (e) {
          return e === A.activeElement && (!A.hasFocus || A.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
        },
        enabled: function (e) {
          return e.disabled === !1;
        },
        disabled: function (e) {
          return e.disabled === !0;
        },
        checked: function (e) {
          var t = e.nodeName.toLowerCase();
          return 'input' === t && !!e.checked || 'option' === t && !!e.selected;
        },
        selected: function (e) {
          return e.parentNode && e.parentNode.selectedIndex, e.selected === !0;
        },
        empty: function (e) {
          for (e = e.firstChild; e; e = e.nextSibling)
            if (e.nodeName > '@' || 3 === e.nodeType || 4 === e.nodeType)
              return !1;
          return !0;
        },
        parent: function (e) {
          return !T.pseudos.empty(e);
        },
        header: function (e) {
          return $t.test(e.nodeName);
        },
        input: function (e) {
          return bt.test(e.nodeName);
        },
        button: function (e) {
          var t = e.nodeName.toLowerCase();
          return 'input' === t && 'button' === e.type || 'button' === t;
        },
        text: function (e) {
          var t;
          return 'input' === e.nodeName.toLowerCase() && 'text' === e.type && (null == (t = e.getAttribute('type')) || t.toLowerCase() === e.type);
        },
        first: c(function () {
          return [0];
        }),
        last: c(function (e, t) {
          return [t - 1];
        }),
        eq: c(function (e, t, n) {
          return [0 > n ? n + t : n];
        }),
        even: c(function (e, t) {
          for (var n = 0; t > n; n += 2)
            e.push(n);
          return e;
        }),
        odd: c(function (e, t) {
          for (var n = 1; t > n; n += 2)
            e.push(n);
          return e;
        }),
        lt: c(function (e, t, n) {
          for (var r = 0 > n ? n + t : n; --r >= 0;)
            e.push(r);
          return e;
        }),
        gt: c(function (e, t, n) {
          for (var r = 0 > n ? n + t : n; t > ++r;)
            e.push(r);
          return e;
        })
      }
    }, T.pseudos.nth = T.pseudos.eq;
    for (x in {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0
      })
      T.pseudos[x] = u(x);
    for (x in {
        submit: !0,
        reset: !0
      })
      T.pseudos[x] = l(x);
    d.prototype = T.filters = T.pseudos, T.setFilters = new d(), E = n.compile = function (e, t) {
      var n, r = [], i = [], o = B[e + ' '];
      if (!o) {
        for (t || (t = f(e)), n = t.length; n--;)
          o = y(t[n]), o[F] ? r.push(o) : i.push(o);
        o = B(e, w(i, r));
      }
      return o;
    }, k.sortStable = F.split('').sort(z).join('') === F, k.detectDuplicates = Y, P(), k.sortDetached = o(function (e) {
      return 1 & e.compareDocumentPosition(A.createElement('div'));
    }), o(function (e) {
      return e.innerHTML = '<a href=\'#\'></a>', '#' === e.firstChild.getAttribute('href');
    }) || a('type|href|height|width', function (e, n, r) {
      return r ? t : e.getAttribute(n, 'type' === n.toLowerCase() ? 1 : 2);
    }), k.attributes && o(function (e) {
      return e.innerHTML = '<input/>', e.firstChild.setAttribute('value', ''), '' === e.firstChild.getAttribute('value');
    }) || a('value', function (e, n, r) {
      return r || 'input' !== e.nodeName.toLowerCase() ? t : e.defaultValue;
    }), o(function (e) {
      return null == e.getAttribute('disabled');
    }) || a(rt, function (e, n, r) {
      var i;
      return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null;
    }), ot.find = n, ot.expr = n.selectors, ot.expr[':'] = ot.expr.pseudos, ot.unique = n.uniqueSort, ot.text = n.getText, ot.isXMLDoc = n.isXML, ot.contains = n.contains;
  }(e);
  var ht = {};
  ot.Callbacks = function (e) {
    e = 'string' == typeof e ? ht[e] || r(e) : ot.extend({}, e);
    var n, i, o, a, s, u, l = [], c = !e.once && [], d = function (t) {
        for (n = e.memory && t, i = !0, u = a || 0, a = 0, s = l.length, o = !0; l && s > u; u++)
          if (l[u].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
            n = !1;
            break;
          }
        o = !1, l && (c ? c.length && d(c.shift()) : n ? l = [] : f.disable());
      }, f = {
        add: function () {
          if (l) {
            var t = l.length;
            !function r(t) {
              ot.each(t, function (t, n) {
                var i = ot.type(n);
                'function' === i ? e.unique && f.has(n) || l.push(n) : n && n.length && 'string' !== i && r(n);
              });
            }(arguments), o ? s = l.length : n && (a = t, d(n));
          }
          return this;
        },
        remove: function () {
          return l && ot.each(arguments, function (e, t) {
            for (var n; (n = ot.inArray(t, l, n)) > -1;)
              l.splice(n, 1), o && (s >= n && s--, u >= n && u--);
          }), this;
        },
        has: function (e) {
          return e ? ot.inArray(e, l) > -1 : !(!l || !l.length);
        },
        empty: function () {
          return l = [], s = 0, this;
        },
        disable: function () {
          return l = c = n = t, this;
        },
        disabled: function () {
          return !l;
        },
        lock: function () {
          return c = t, n || f.disable(), this;
        },
        locked: function () {
          return !c;
        },
        fireWith: function (e, t) {
          return !l || i && !c || (t = t || [], t = [
            e,
            t.slice ? t.slice() : t
          ], o ? c.push(t) : d(t)), this;
        },
        fire: function () {
          return f.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!i;
        }
      };
    return f;
  }, ot.extend({
    Deferred: function (e) {
      var t = [
          [
            'resolve',
            'done',
            ot.Callbacks('once memory'),
            'resolved'
          ],
          [
            'reject',
            'fail',
            ot.Callbacks('once memory'),
            'rejected'
          ],
          [
            'notify',
            'progress',
            ot.Callbacks('memory')
          ]
        ], n = 'pending', r = {
          state: function () {
            return n;
          },
          always: function () {
            return i.done(arguments).fail(arguments), this;
          },
          then: function () {
            var e = arguments;
            return ot.Deferred(function (n) {
              ot.each(t, function (t, o) {
                var a = o[0], s = ot.isFunction(e[t]) && e[t];
                i[o[1]](function () {
                  var e = s && s.apply(this, arguments);
                  e && ot.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + 'With'](this === r ? n.promise() : this, s ? [e] : arguments);
                });
              }), e = null;
            }).promise();
          },
          promise: function (e) {
            return null != e ? ot.extend(e, r) : r;
          }
        }, i = {};
      return r.pipe = r.then, ot.each(t, function (e, o) {
        var a = o[2], s = o[3];
        r[o[1]] = a.add, s && a.add(function () {
          n = s;
        }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function () {
          return i[o[0] + 'With'](this === i ? r : this, arguments), this;
        }, i[o[0] + 'With'] = a.fireWith;
      }), r.promise(i), e && e.call(i, i), i;
    },
    when: function (e) {
      var t, n, r, i = 0, o = et.call(arguments), a = o.length, s = 1 !== a || e && ot.isFunction(e.promise) ? a : 0, u = 1 === s ? e : ot.Deferred(), l = function (e, n, r) {
          return function (i) {
            n[e] = this, r[e] = arguments.length > 1 ? et.call(arguments) : i, r === t ? u.notifyWith(n, r) : --s || u.resolveWith(n, r);
          };
        };
      if (a > 1)
        for (t = Array(a), n = Array(a), r = Array(a); a > i; i++)
          o[i] && ot.isFunction(o[i].promise) ? o[i].promise().done(l(i, r, o)).fail(u.reject).progress(l(i, n, t)) : --s;
      return s || u.resolveWith(r, o), u.promise();
    }
  }), ot.support = function (t) {
    var n = B.createElement('input'), r = B.createDocumentFragment(), i = B.createElement('div'), o = B.createElement('select'), a = o.appendChild(B.createElement('option'));
    return n.type ? (n.type = 'checkbox', t.checkOn = '' !== n.value, t.optSelected = a.selected, t.reliableMarginRight = !0, t.boxSizingReliable = !0, t.pixelPosition = !1, n.checked = !0, t.noCloneChecked = n.cloneNode(!0).checked, o.disabled = !0, t.optDisabled = !a.disabled, n = B.createElement('input'), n.value = 't', n.type = 'radio', t.radioValue = 't' === n.value, n.setAttribute('checked', 't'), n.setAttribute('name', 't'), r.appendChild(n), t.checkClone = r.cloneNode(!0).cloneNode(!0).lastChild.checked, t.focusinBubbles = 'onfocusin' in e, i.style.backgroundClip = 'content-box', i.cloneNode(!0).style.backgroundClip = '', t.clearCloneStyle = 'content-box' === i.style.backgroundClip, ot(function () {
      var n, r, o = 'padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box', a = B.getElementsByTagName('body')[0];
      a && (n = B.createElement('div'), n.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px', a.appendChild(n).appendChild(i), i.innerHTML = '', i.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%', ot.swap(a, null != a.style.zoom ? { zoom: 1 } : {}, function () {
        t.boxSizing = 4 === i.offsetWidth;
      }), e.getComputedStyle && (t.pixelPosition = '1%' !== (e.getComputedStyle(i, null) || {}).top, t.boxSizingReliable = '4px' === (e.getComputedStyle(i, null) || { width: '4px' }).width, r = i.appendChild(B.createElement('div')), r.style.cssText = i.style.cssText = o, r.style.marginRight = r.style.width = '0', i.style.width = '1px', t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), a.removeChild(n));
    }), t) : t;
  }({});
  var gt, mt, vt = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, yt = /([A-Z])/g;
  i.uid = 1, i.accepts = function (e) {
    return e.nodeType ? 1 === e.nodeType || 9 === e.nodeType : !0;
  }, i.prototype = {
    key: function (e) {
      if (!i.accepts(e))
        return 0;
      var t = {}, n = e[this.expando];
      if (!n) {
        n = i.uid++;
        try {
          t[this.expando] = { value: n }, Object.defineProperties(e, t);
        } catch (r) {
          t[this.expando] = n, ot.extend(e, t);
        }
      }
      return this.cache[n] || (this.cache[n] = {}), n;
    },
    set: function (e, t, n) {
      var r, i = this.key(e), o = this.cache[i];
      if ('string' == typeof t)
        o[t] = n;
      else if (ot.isEmptyObject(o))
        ot.extend(this.cache[i], t);
      else
        for (r in t)
          o[r] = t[r];
      return o;
    },
    get: function (e, n) {
      var r = this.cache[this.key(e)];
      return n === t ? r : r[n];
    },
    access: function (e, n, r) {
      var i;
      return n === t || n && 'string' == typeof n && r === t ? (i = this.get(e, n), i !== t ? i : this.get(e, ot.camelCase(n))) : (this.set(e, n, r), r !== t ? r : n);
    },
    remove: function (e, n) {
      var r, i, o, a = this.key(e), s = this.cache[a];
      if (n === t)
        this.cache[a] = {};
      else {
        ot.isArray(n) ? i = n.concat(n.map(ot.camelCase)) : (o = ot.camelCase(n), n in s ? i = [
          n,
          o
        ] : (i = o, i = i in s ? [i] : i.match(st) || [])), r = i.length;
        for (; r--;)
          delete s[i[r]];
      }
    },
    hasData: function (e) {
      return !ot.isEmptyObject(this.cache[e[this.expando]] || {});
    },
    discard: function (e) {
      e[this.expando] && delete this.cache[e[this.expando]];
    }
  }, gt = new i(), mt = new i(), ot.extend({
    acceptData: i.accepts,
    hasData: function (e) {
      return gt.hasData(e) || mt.hasData(e);
    },
    data: function (e, t, n) {
      return gt.access(e, t, n);
    },
    removeData: function (e, t) {
      gt.remove(e, t);
    },
    _data: function (e, t, n) {
      return mt.access(e, t, n);
    },
    _removeData: function (e, t) {
      mt.remove(e, t);
    }
  }), ot.fn.extend({
    data: function (e, n) {
      var r, i, a = this[0], s = 0, u = null;
      if (e === t) {
        if (this.length && (u = gt.get(a), 1 === a.nodeType && !mt.get(a, 'hasDataAttrs'))) {
          for (r = a.attributes; r.length > s; s++)
            i = r[s].name, 0 === i.indexOf('data-') && (i = ot.camelCase(i.slice(5)), o(a, i, u[i]));
          mt.set(a, 'hasDataAttrs', !0);
        }
        return u;
      }
      return 'object' == typeof e ? this.each(function () {
        gt.set(this, e);
      }) : ot.access(this, function (n) {
        var r, i = ot.camelCase(e);
        if (a && n === t) {
          if (r = gt.get(a, e), r !== t)
            return r;
          if (r = gt.get(a, i), r !== t)
            return r;
          if (r = o(a, i, t), r !== t)
            return r;
        } else
          this.each(function () {
            var r = gt.get(this, i);
            gt.set(this, i, n), -1 !== e.indexOf('-') && r !== t && gt.set(this, e, n);
          });
      }, null, n, arguments.length > 1, null, !0);
    },
    removeData: function (e) {
      return this.each(function () {
        gt.remove(this, e);
      });
    }
  }), ot.extend({
    queue: function (e, n, r) {
      var i;
      return e ? (n = (n || 'fx') + 'queue', i = mt.get(e, n), r && (!i || ot.isArray(r) ? i = mt.access(e, n, ot.makeArray(r)) : i.push(r)), i || []) : t;
    },
    dequeue: function (e, t) {
      t = t || 'fx';
      var n = ot.queue(e, t), r = n.length, i = n.shift(), o = ot._queueHooks(e, t), a = function () {
          ot.dequeue(e, t);
        };
      'inprogress' === i && (i = n.shift(), r--), i && ('fx' === t && n.unshift('inprogress'), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire();
    },
    _queueHooks: function (e, t) {
      var n = t + 'queueHooks';
      return mt.get(e, n) || mt.access(e, n, {
        empty: ot.Callbacks('once memory').add(function () {
          mt.remove(e, [
            t + 'queue',
            n
          ]);
        })
      });
    }
  }), ot.fn.extend({
    queue: function (e, n) {
      var r = 2;
      return 'string' != typeof e && (n = e, e = 'fx', r--), r > arguments.length ? ot.queue(this[0], e) : n === t ? this : this.each(function () {
        var t = ot.queue(this, e, n);
        ot._queueHooks(this, e), 'fx' === e && 'inprogress' !== t[0] && ot.dequeue(this, e);
      });
    },
    dequeue: function (e) {
      return this.each(function () {
        ot.dequeue(this, e);
      });
    },
    delay: function (e, t) {
      return e = ot.fx ? ot.fx.speeds[e] || e : e, t = t || 'fx', this.queue(t, function (t, n) {
        var r = setTimeout(t, e);
        n.stop = function () {
          clearTimeout(r);
        };
      });
    },
    clearQueue: function (e) {
      return this.queue(e || 'fx', []);
    },
    promise: function (e, n) {
      var r, i = 1, o = ot.Deferred(), a = this, s = this.length, u = function () {
          --i || o.resolveWith(a, [a]);
        };
      for ('string' != typeof e && (n = e, e = t), e = e || 'fx'; s--;)
        r = mt.get(a[s], e + 'queueHooks'), r && r.empty && (i++, r.empty.add(u));
      return u(), o.promise(n);
    }
  });
  var wt, bt, $t = /[\t\r\n\f]/g, xt = /\r/g, kt = /^(?:input|select|textarea|button)$/i;
  ot.fn.extend({
    attr: function (e, t) {
      return ot.access(this, ot.attr, e, t, arguments.length > 1);
    },
    removeAttr: function (e) {
      return this.each(function () {
        ot.removeAttr(this, e);
      });
    },
    prop: function (e, t) {
      return ot.access(this, ot.prop, e, t, arguments.length > 1);
    },
    removeProp: function (e) {
      return this.each(function () {
        delete this[ot.propFix[e] || e];
      });
    },
    addClass: function (e) {
      var t, n, r, i, o, a = 0, s = this.length, u = 'string' == typeof e && e;
      if (ot.isFunction(e))
        return this.each(function (t) {
          ot(this).addClass(e.call(this, t, this.className));
        });
      if (u)
        for (t = (e || '').match(st) || []; s > a; a++)
          if (n = this[a], r = 1 === n.nodeType && (n.className ? (' ' + n.className + ' ').replace($t, ' ') : ' ')) {
            for (o = 0; i = t[o++];)
              0 > r.indexOf(' ' + i + ' ') && (r += i + ' ');
            n.className = ot.trim(r);
          }
      return this;
    },
    removeClass: function (e) {
      var t, n, r, i, o, a = 0, s = this.length, u = 0 === arguments.length || 'string' == typeof e && e;
      if (ot.isFunction(e))
        return this.each(function (t) {
          ot(this).removeClass(e.call(this, t, this.className));
        });
      if (u)
        for (t = (e || '').match(st) || []; s > a; a++)
          if (n = this[a], r = 1 === n.nodeType && (n.className ? (' ' + n.className + ' ').replace($t, ' ') : '')) {
            for (o = 0; i = t[o++];)
              for (; r.indexOf(' ' + i + ' ') >= 0;)
                r = r.replace(' ' + i + ' ', ' ');
            n.className = e ? ot.trim(r) : '';
          }
      return this;
    },
    toggleClass: function (e, t) {
      var n = typeof e;
      return 'boolean' == typeof t && 'string' === n ? t ? this.addClass(e) : this.removeClass(e) : ot.isFunction(e) ? this.each(function (n) {
        ot(this).toggleClass(e.call(this, n, this.className, t), t);
      }) : this.each(function () {
        if ('string' === n)
          for (var t, r = 0, i = ot(this), o = e.match(st) || []; t = o[r++];)
            i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
        else
          (n === U || 'boolean' === n) && (this.className && mt.set(this, '__className__', this.className), this.className = this.className || e === !1 ? '' : mt.get(this, '__className__') || '');
      });
    },
    hasClass: function (e) {
      for (var t = ' ' + e + ' ', n = 0, r = this.length; r > n; n++)
        if (1 === this[n].nodeType && (' ' + this[n].className + ' ').replace($t, ' ').indexOf(t) >= 0)
          return !0;
      return !1;
    },
    val: function (e) {
      var n, r, i, o = this[0];
      return arguments.length ? (i = ot.isFunction(e), this.each(function (r) {
        var o;
        1 === this.nodeType && (o = i ? e.call(this, r, ot(this).val()) : e, null == o ? o = '' : 'number' == typeof o ? o += '' : ot.isArray(o) && (o = ot.map(o, function (e) {
          return null == e ? '' : e + '';
        })), n = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()], n && 'set' in n && n.set(this, o, 'value') !== t || (this.value = o));
      })) : o ? (n = ot.valHooks[o.type] || ot.valHooks[o.nodeName.toLowerCase()], n && 'get' in n && (r = n.get(o, 'value')) !== t ? r : (r = o.value, 'string' == typeof r ? r.replace(xt, '') : null == r ? '' : r)) : void 0;
    }
  }), ot.extend({
    valHooks: {
      option: {
        get: function (e) {
          var t = e.attributes.value;
          return !t || t.specified ? e.value : e.text;
        }
      },
      select: {
        get: function (e) {
          for (var t, n, r = e.options, i = e.selectedIndex, o = 'select-one' === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, u = 0 > i ? s : o ? i : 0; s > u; u++)
            if (n = r[u], !(!n.selected && u !== i || (ot.support.optDisabled ? n.disabled : null !== n.getAttribute('disabled')) || n.parentNode.disabled && ot.nodeName(n.parentNode, 'optgroup'))) {
              if (t = ot(n).val(), o)
                return t;
              a.push(t);
            }
          return a;
        },
        set: function (e, t) {
          for (var n, r, i = e.options, o = ot.makeArray(t), a = i.length; a--;)
            r = i[a], (r.selected = ot.inArray(ot(r).val(), o) >= 0) && (n = !0);
          return n || (e.selectedIndex = -1), o;
        }
      }
    },
    attr: function (e, n, r) {
      var i, o, a = e.nodeType;
      return e && 3 !== a && 8 !== a && 2 !== a ? typeof e.getAttribute === U ? ot.prop(e, n, r) : (1 === a && ot.isXMLDoc(e) || (n = n.toLowerCase(), i = ot.attrHooks[n] || (ot.expr.match.bool.test(n) ? bt : wt)), r === t ? i && 'get' in i && null !== (o = i.get(e, n)) ? o : (o = ot.find.attr(e, n), null == o ? t : o) : null !== r ? i && 'set' in i && (o = i.set(e, r, n)) !== t ? o : (e.setAttribute(n, r + ''), r) : (ot.removeAttr(e, n), t)) : void 0;
    },
    removeAttr: function (e, t) {
      var n, r, i = 0, o = t && t.match(st);
      if (o && 1 === e.nodeType)
        for (; n = o[i++];)
          r = ot.propFix[n] || n, ot.expr.match.bool.test(n) && (e[r] = !1), e.removeAttribute(n);
    },
    attrHooks: {
      type: {
        set: function (e, t) {
          if (!ot.support.radioValue && 'radio' === t && ot.nodeName(e, 'input')) {
            var n = e.value;
            return e.setAttribute('type', t), n && (e.value = n), t;
          }
        }
      }
    },
    propFix: {
      'for': 'htmlFor',
      'class': 'className'
    },
    prop: function (e, n, r) {
      var i, o, a, s = e.nodeType;
      return e && 3 !== s && 8 !== s && 2 !== s ? (a = 1 !== s || !ot.isXMLDoc(e), a && (n = ot.propFix[n] || n, o = ot.propHooks[n]), r !== t ? o && 'set' in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && 'get' in o && null !== (i = o.get(e, n)) ? i : e[n]) : void 0;
    },
    propHooks: {
      tabIndex: {
        get: function (e) {
          return e.hasAttribute('tabindex') || kt.test(e.nodeName) || e.href ? e.tabIndex : -1;
        }
      }
    }
  }), bt = {
    set: function (e, t, n) {
      return t === !1 ? ot.removeAttr(e, n) : e.setAttribute(n, n), n;
    }
  }, ot.each(ot.expr.match.bool.source.match(/\w+/g), function (e, n) {
    var r = ot.expr.attrHandle[n] || ot.find.attr;
    ot.expr.attrHandle[n] = function (e, n, i) {
      var o = ot.expr.attrHandle[n], a = i ? t : (ot.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null;
      return ot.expr.attrHandle[n] = o, a;
    };
  }), ot.support.optSelected || (ot.propHooks.selected = {
    get: function (e) {
      var t = e.parentNode;
      return t && t.parentNode && t.parentNode.selectedIndex, null;
    }
  }), ot.each([
    'tabIndex',
    'readOnly',
    'maxLength',
    'cellSpacing',
    'cellPadding',
    'rowSpan',
    'colSpan',
    'useMap',
    'frameBorder',
    'contentEditable'
  ], function () {
    ot.propFix[this.toLowerCase()] = this;
  }), ot.each([
    'radio',
    'checkbox'
  ], function () {
    ot.valHooks[this] = {
      set: function (e, n) {
        return ot.isArray(n) ? e.checked = ot.inArray(ot(e).val(), n) >= 0 : t;
      }
    }, ot.support.checkOn || (ot.valHooks[this].get = function (e) {
      return null === e.getAttribute('value') ? 'on' : e.value;
    });
  });
  var _t = /^key/, Tt = /^(?:mouse|contextmenu)|click/, St = /^(?:focusinfocus|focusoutblur)$/, Ct = /^([^.]*)(?:\.(.+)|)$/;
  ot.event = {
    global: {},
    add: function (e, n, r, i, o) {
      var a, s, u, l, c, d, f, p, h, g, m, v = mt.get(e);
      if (v) {
        for (r.handler && (a = r, r = a.handler, o = a.selector), r.guid || (r.guid = ot.guid++), (l = v.events) || (l = v.events = {}), (s = v.handle) || (s = v.handle = function (e) {
            return typeof ot === U || e && ot.event.triggered === e.type ? t : ot.event.dispatch.apply(s.elem, arguments);
          }, s.elem = e), n = (n || '').match(st) || [''], c = n.length; c--;)
          u = Ct.exec(n[c]) || [], h = m = u[1], g = (u[2] || '').split('.').sort(), h && (f = ot.event.special[h] || {}, h = (o ? f.delegateType : f.bindType) || h, f = ot.event.special[h] || {}, d = ot.extend({
            type: h,
            origType: m,
            data: i,
            handler: r,
            guid: r.guid,
            selector: o,
            needsContext: o && ot.expr.match.needsContext.test(o),
            namespace: g.join('.')
          }, a), (p = l[h]) || (p = l[h] = [], p.delegateCount = 0, f.setup && f.setup.call(e, i, g, s) !== !1 || e.addEventListener && e.addEventListener(h, s, !1)), f.add && (f.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), o ? p.splice(p.delegateCount++, 0, d) : p.push(d), ot.event.global[h] = !0);
        e = null;
      }
    },
    remove: function (e, t, n, r, i) {
      var o, a, s, u, l, c, d, f, p, h, g, m = mt.hasData(e) && mt.get(e);
      if (m && (u = m.events)) {
        for (t = (t || '').match(st) || [''], l = t.length; l--;)
          if (s = Ct.exec(t[l]) || [], p = g = s[1], h = (s[2] || '').split('.').sort(), p) {
            for (d = ot.event.special[p] || {}, p = (r ? d.delegateType : d.bindType) || p, f = u[p] || [], s = s[2] && RegExp('(^|\\.)' + h.join('\\.(?:.*\\.|)') + '(\\.|$)'), a = o = f.length; o--;)
              c = f[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ('**' !== r || !c.selector) || (f.splice(o, 1), c.selector && f.delegateCount--, d.remove && d.remove.call(e, c));
            a && !f.length && (d.teardown && d.teardown.call(e, h, m.handle) !== !1 || ot.removeEvent(e, p, m.handle), delete u[p]);
          } else
            for (p in u)
              ot.event.remove(e, p + t[l], n, r, !0);
        ot.isEmptyObject(u) && (delete m.handle, mt.remove(e, 'events'));
      }
    },
    trigger: function (n, r, i, o) {
      var a, s, u, l, c, d, f, p = [i || B], h = rt.call(n, 'type') ? n.type : n, g = rt.call(n, 'namespace') ? n.namespace.split('.') : [];
      if (s = u = i = i || B, 3 !== i.nodeType && 8 !== i.nodeType && !St.test(h + ot.event.triggered) && (h.indexOf('.') >= 0 && (g = h.split('.'), h = g.shift(), g.sort()), c = 0 > h.indexOf(':') && 'on' + h, n = n[ot.expando] ? n : new ot.Event(h, 'object' == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = g.join('.'), n.namespace_re = n.namespace ? RegExp('(^|\\.)' + g.join('\\.(?:.*\\.|)') + '(\\.|$)') : null, n.result = t, n.target || (n.target = i), r = null == r ? [n] : ot.makeArray(r, [n]), f = ot.event.special[h] || {}, o || !f.trigger || f.trigger.apply(i, r) !== !1)) {
        if (!o && !f.noBubble && !ot.isWindow(i)) {
          for (l = f.delegateType || h, St.test(l + h) || (s = s.parentNode); s; s = s.parentNode)
            p.push(s), u = s;
          u === (i.ownerDocument || B) && p.push(u.defaultView || u.parentWindow || e);
        }
        for (a = 0; (s = p[a++]) && !n.isPropagationStopped();)
          n.type = a > 1 ? l : f.bindType || h, d = (mt.get(s, 'events') || {})[n.type] && mt.get(s, 'handle'), d && d.apply(s, r), d = c && s[c], d && ot.acceptData(s) && d.apply && d.apply(s, r) === !1 && n.preventDefault();
        return n.type = h, o || n.isDefaultPrevented() || f._default && f._default.apply(p.pop(), r) !== !1 || !ot.acceptData(i) || c && ot.isFunction(i[h]) && !ot.isWindow(i) && (u = i[c], u && (i[c] = null), ot.event.triggered = h, i[h](), ot.event.triggered = t, u && (i[c] = u)), n.result;
      }
    },
    dispatch: function (e) {
      e = ot.event.fix(e);
      var n, r, i, o, a, s = [], u = et.call(arguments), l = (mt.get(this, 'events') || {})[e.type] || [], c = ot.event.special[e.type] || {};
      if (u[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
        for (s = ot.event.handlers.call(this, e, l), n = 0; (o = s[n++]) && !e.isPropagationStopped();)
          for (e.currentTarget = o.elem, r = 0; (a = o.handlers[r++]) && !e.isImmediatePropagationStopped();)
            (!e.namespace_re || e.namespace_re.test(a.namespace)) && (e.handleObj = a, e.data = a.data, i = ((ot.event.special[a.origType] || {}).handle || a.handler).apply(o.elem, u), i !== t && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, e), e.result;
      }
    },
    handlers: function (e, n) {
      var r, i, o, a, s = [], u = n.delegateCount, l = e.target;
      if (u && l.nodeType && (!e.button || 'click' !== e.type))
        for (; l !== this; l = l.parentNode || this)
          if (l.disabled !== !0 || 'click' !== e.type) {
            for (i = [], r = 0; u > r; r++)
              a = n[r], o = a.selector + ' ', i[o] === t && (i[o] = a.needsContext ? ot(o, this).index(l) >= 0 : ot.find(o, this, null, [l]).length), i[o] && i.push(a);
            i.length && s.push({
              elem: l,
              handlers: i
            });
          }
      return n.length > u && s.push({
        elem: this,
        handlers: n.slice(u)
      }), s;
    },
    props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function (e, t) {
        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e;
      }
    },
    mouseHooks: {
      props: 'button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
      filter: function (e, n) {
        var r, i, o, a = n.button;
        return null == e.pageX && null != n.clientX && (r = e.target.ownerDocument || B, i = r.documentElement, o = r.body, e.pageX = n.clientX + (i && i.scrollLeft || o && o.scrollLeft || 0) - (i && i.clientLeft || o && o.clientLeft || 0), e.pageY = n.clientY + (i && i.scrollTop || o && o.scrollTop || 0) - (i && i.clientTop || o && o.clientTop || 0)), e.which || a === t || (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e;
      }
    },
    fix: function (e) {
      if (e[ot.expando])
        return e;
      var t, n, r, i = e.type, o = e, a = this.fixHooks[i];
      for (a || (this.fixHooks[i] = a = Tt.test(i) ? this.mouseHooks : _t.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new ot.Event(o), t = r.length; t--;)
        n = r[t], e[n] = o[n];
      return e.target || (e.target = B), 3 === e.target.nodeType && (e.target = e.target.parentNode), a.filter ? a.filter(e, o) : e;
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function () {
          return this !== u() && this.focus ? (this.focus(), !1) : t;
        },
        delegateType: 'focusin'
      },
      blur: {
        trigger: function () {
          return this === u() && this.blur ? (this.blur(), !1) : t;
        },
        delegateType: 'focusout'
      },
      click: {
        trigger: function () {
          return 'checkbox' === this.type && this.click && ot.nodeName(this, 'input') ? (this.click(), !1) : t;
        },
        _default: function (e) {
          return ot.nodeName(e.target, 'a');
        }
      },
      beforeunload: {
        postDispatch: function (e) {
          e.result !== t && (e.originalEvent.returnValue = e.result);
        }
      }
    },
    simulate: function (e, t, n, r) {
      var i = ot.extend(new ot.Event(), n, {
          type: e,
          isSimulated: !0,
          originalEvent: {}
        });
      r ? ot.event.trigger(i, null, t) : ot.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault();
    }
  }, ot.removeEvent = function (e, t, n) {
    e.removeEventListener && e.removeEventListener(t, n, !1);
  }, ot.Event = function (e, n) {
    return this instanceof ot.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.getPreventDefault && e.getPreventDefault() ? a : s) : this.type = e, n && ot.extend(this, n), this.timeStamp = e && e.timeStamp || ot.now(), this[ot.expando] = !0, t) : new ot.Event(e, n);
  }, ot.Event.prototype = {
    isDefaultPrevented: s,
    isPropagationStopped: s,
    isImmediatePropagationStopped: s,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = a, e && e.preventDefault && e.preventDefault();
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = a, e && e.stopPropagation && e.stopPropagation();
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = a, this.stopPropagation();
    }
  }, ot.each({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  }, function (e, t) {
    ot.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function (e) {
        var n, r = this, i = e.relatedTarget, o = e.handleObj;
        return (!i || i !== r && !ot.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n;
      }
    };
  }), ot.support.focusinBubbles || ot.each({
    focus: 'focusin',
    blur: 'focusout'
  }, function (e, t) {
    var n = 0, r = function (e) {
        ot.event.simulate(t, e.target, ot.event.fix(e), !0);
      };
    ot.event.special[t] = {
      setup: function () {
        0 === n++ && B.addEventListener(e, r, !0);
      },
      teardown: function () {
        0 === --n && B.removeEventListener(e, r, !0);
      }
    };
  }), ot.fn.extend({
    on: function (e, n, r, i, o) {
      var a, u;
      if ('object' == typeof e) {
        'string' != typeof n && (r = r || n, n = t);
        for (u in e)
          this.on(u, n, r, e[u], o);
        return this;
      }
      if (null == r && null == i ? (i = n, r = n = t) : null == i && ('string' == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1)
        i = s;
      else if (!i)
        return this;
      return 1 === o && (a = i, i = function (e) {
        return ot().off(e), a.apply(this, arguments);
      }, i.guid = a.guid || (a.guid = ot.guid++)), this.each(function () {
        ot.event.add(this, e, i, r, n);
      });
    },
    one: function (e, t, n, r) {
      return this.on(e, t, n, r, 1);
    },
    off: function (e, n, r) {
      var i, o;
      if (e && e.preventDefault && e.handleObj)
        return i = e.handleObj, ot(e.delegateTarget).off(i.namespace ? i.origType + '.' + i.namespace : i.origType, i.selector, i.handler), this;
      if ('object' == typeof e) {
        for (o in e)
          this.off(o, n, e[o]);
        return this;
      }
      return (n === !1 || 'function' == typeof n) && (r = n, n = t), r === !1 && (r = s), this.each(function () {
        ot.event.remove(this, e, r, n);
      });
    },
    trigger: function (e, t) {
      return this.each(function () {
        ot.event.trigger(e, t, this);
      });
    },
    triggerHandler: function (e, n) {
      var r = this[0];
      return r ? ot.event.trigger(e, n, r, !0) : t;
    }
  });
  var Et = /^.[^:#\[\.,]*$/, Dt = /^(?:parents|prev(?:Until|All))/, Mt = ot.expr.match.needsContext, Pt = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  ot.fn.extend({
    find: function (e) {
      var t, n = [], r = this, i = r.length;
      if ('string' != typeof e)
        return this.pushStack(ot(e).filter(function () {
          for (t = 0; i > t; t++)
            if (ot.contains(r[t], this))
              return !0;
        }));
      for (t = 0; i > t; t++)
        ot.find(e, r[t], n);
      return n = this.pushStack(i > 1 ? ot.unique(n) : n), n.selector = this.selector ? this.selector + ' ' + e : e, n;
    },
    has: function (e) {
      var t = ot(e, this), n = t.length;
      return this.filter(function () {
        for (var e = 0; n > e; e++)
          if (ot.contains(this, t[e]))
            return !0;
      });
    },
    not: function (e) {
      return this.pushStack(c(this, e || [], !0));
    },
    filter: function (e) {
      return this.pushStack(c(this, e || [], !1));
    },
    is: function (e) {
      return !!c(this, 'string' == typeof e && Mt.test(e) ? ot(e) : e || [], !1).length;
    },
    closest: function (e, t) {
      for (var n, r = 0, i = this.length, o = [], a = Mt.test(e) || 'string' != typeof e ? ot(e, t || this.context) : 0; i > r; r++)
        for (n = this[r]; n && n !== t; n = n.parentNode)
          if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && ot.find.matchesSelector(n, e))) {
            n = o.push(n);
            break;
          }
      return this.pushStack(o.length > 1 ? ot.unique(o) : o);
    },
    index: function (e) {
      return e ? 'string' == typeof e ? tt.call(ot(e), this[0]) : tt.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    add: function (e, t) {
      var n = 'string' == typeof e ? ot(e, t) : ot.makeArray(e && e.nodeType ? [e] : e), r = ot.merge(this.get(), n);
      return this.pushStack(ot.unique(r));
    },
    addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  }), ot.each({
    parent: function (e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    parents: function (e) {
      return ot.dir(e, 'parentNode');
    },
    parentsUntil: function (e, t, n) {
      return ot.dir(e, 'parentNode', n);
    },
    next: function (e) {
      return l(e, 'nextSibling');
    },
    prev: function (e) {
      return l(e, 'previousSibling');
    },
    nextAll: function (e) {
      return ot.dir(e, 'nextSibling');
    },
    prevAll: function (e) {
      return ot.dir(e, 'previousSibling');
    },
    nextUntil: function (e, t, n) {
      return ot.dir(e, 'nextSibling', n);
    },
    prevUntil: function (e, t, n) {
      return ot.dir(e, 'previousSibling', n);
    },
    siblings: function (e) {
      return ot.sibling((e.parentNode || {}).firstChild, e);
    },
    children: function (e) {
      return ot.sibling(e.firstChild);
    },
    contents: function (e) {
      return e.contentDocument || ot.merge([], e.childNodes);
    }
  }, function (e, t) {
    ot.fn[e] = function (n, r) {
      var i = ot.map(this, t, n);
      return 'Until' !== e.slice(-5) && (r = n), r && 'string' == typeof r && (i = ot.filter(r, i)), this.length > 1 && (Pt[e] || ot.unique(i), Dt.test(e) && i.reverse()), this.pushStack(i);
    };
  }), ot.extend({
    filter: function (e, t, n) {
      var r = t[0];
      return n && (e = ':not(' + e + ')'), 1 === t.length && 1 === r.nodeType ? ot.find.matchesSelector(r, e) ? [r] : [] : ot.find.matches(e, ot.grep(t, function (e) {
        return 1 === e.nodeType;
      }));
    },
    dir: function (e, n, r) {
      for (var i = [], o = r !== t; (e = e[n]) && 9 !== e.nodeType;)
        if (1 === e.nodeType) {
          if (o && ot(e).is(r))
            break;
          i.push(e);
        }
      return i;
    },
    sibling: function (e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    }
  });
  var At = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Ot = /<([\w:]+)/, Nt = /<|&#?\w+;/, jt = /<(?:script|style|link)/i, Lt = /^(?:checkbox|radio)$/i, Rt = /checked\s*(?:[^=]|=\s*.checked.)/i, It = /^$|\/(?:java|ecma)script/i, Ft = /^true\/(.*)/, Ht = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, qt = {
      option: [
        1,
        '<select multiple=\'multiple\'>',
        '</select>'
      ],
      thead: [
        1,
        '<table>',
        '</table>'
      ],
      col: [
        2,
        '<table><colgroup>',
        '</colgroup></table>'
      ],
      tr: [
        2,
        '<table><tbody>',
        '</tbody></table>'
      ],
      td: [
        3,
        '<table><tbody><tr>',
        '</tr></tbody></table>'
      ],
      _default: [
        0,
        '',
        ''
      ]
    };
  qt.optgroup = qt.option, qt.tbody = qt.tfoot = qt.colgroup = qt.caption = qt.thead, qt.th = qt.td, ot.fn.extend({
    text: function (e) {
      return ot.access(this, function (e) {
        return e === t ? ot.text(this) : this.empty().append((this[0] && this[0].ownerDocument || B).createTextNode(e));
      }, null, e, arguments.length);
    },
    append: function () {
      return this.domManip(arguments, function (e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = d(this, e);
          t.appendChild(e);
        }
      });
    },
    prepend: function () {
      return this.domManip(arguments, function (e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = d(this, e);
          t.insertBefore(e, t.firstChild);
        }
      });
    },
    before: function () {
      return this.domManip(arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this);
      });
    },
    after: function () {
      return this.domManip(arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
      });
    },
    remove: function (e, t) {
      for (var n, r = e ? ot.filter(e, this) : this, i = 0; null != (n = r[i]); i++)
        t || 1 !== n.nodeType || ot.cleanData(m(n)), n.parentNode && (t && ot.contains(n.ownerDocument, n) && h(m(n, 'script')), n.parentNode.removeChild(n));
      return this;
    },
    empty: function () {
      for (var e, t = 0; null != (e = this[t]); t++)
        1 === e.nodeType && (ot.cleanData(m(e, !1)), e.textContent = '');
      return this;
    },
    clone: function (e, t) {
      return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () {
        return ot.clone(this, e, t);
      });
    },
    html: function (e) {
      return ot.access(this, function (e) {
        var n = this[0] || {}, r = 0, i = this.length;
        if (e === t && 1 === n.nodeType)
          return n.innerHTML;
        if ('string' == typeof e && !jt.test(e) && !qt[(Ot.exec(e) || [
            '',
            ''
          ])[1].toLowerCase()]) {
          e = e.replace(At, '<$1></$2>');
          try {
            for (; i > r; r++)
              n = this[r] || {}, 1 === n.nodeType && (ot.cleanData(m(n, !1)), n.innerHTML = e);
            n = 0;
          } catch (o) {
          }
        }
        n && this.empty().append(e);
      }, null, e, arguments.length);
    },
    replaceWith: function () {
      var e = ot.map(this, function (e) {
          return [
            e.nextSibling,
            e.parentNode
          ];
        }), t = 0;
      return this.domManip(arguments, function (n) {
        var r = e[t++], i = e[t++];
        i && (r && r.parentNode !== i && (r = this.nextSibling), ot(this).remove(), i.insertBefore(n, r));
      }, !0), t ? this : this.remove();
    },
    detach: function (e) {
      return this.remove(e, !0);
    },
    domManip: function (e, t, n) {
      e = K.apply([], e);
      var r, i, o, a, s, u, l = 0, c = this.length, d = this, h = c - 1, g = e[0], v = ot.isFunction(g);
      if (v || !(1 >= c || 'string' != typeof g || ot.support.checkClone) && Rt.test(g))
        return this.each(function (r) {
          var i = d.eq(r);
          v && (e[0] = g.call(this, r, i.html())), i.domManip(e, t, n);
        });
      if (c && (r = ot.buildFragment(e, this[0].ownerDocument, !1, !n && this), i = r.firstChild, 1 === r.childNodes.length && (r = i), i)) {
        for (o = ot.map(m(r, 'script'), f), a = o.length; c > l; l++)
          s = r, l !== h && (s = ot.clone(s, !0, !0), a && ot.merge(o, m(s, 'script'))), t.call(this[l], s, l);
        if (a)
          for (u = o[o.length - 1].ownerDocument, ot.map(o, p), l = 0; a > l; l++)
            s = o[l], It.test(s.type || '') && !mt.access(s, 'globalEval') && ot.contains(u, s) && (s.src ? ot._evalUrl(s.src) : ot.globalEval(s.textContent.replace(Ht, '')));
      }
      return this;
    }
  }), ot.each({
    appendTo: 'append',
    prependTo: 'prepend',
    insertBefore: 'before',
    insertAfter: 'after',
    replaceAll: 'replaceWith'
  }, function (e, t) {
    ot.fn[e] = function (e) {
      for (var n, r = [], i = ot(e), o = i.length - 1, a = 0; o >= a; a++)
        n = a === o ? this : this.clone(!0), ot(i[a])[t](n), Q.apply(r, n.get());
      return this.pushStack(r);
    };
  }), ot.extend({
    clone: function (e, t, n) {
      var r, i, o, a, s = e.cloneNode(!0), u = ot.contains(e.ownerDocument, e);
      if (!(ot.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ot.isXMLDoc(e)))
        for (a = m(s), o = m(e), r = 0, i = o.length; i > r; r++)
          v(o[r], a[r]);
      if (t)
        if (n)
          for (o = o || m(e), a = a || m(s), r = 0, i = o.length; i > r; r++)
            g(o[r], a[r]);
        else
          g(e, s);
      return a = m(s, 'script'), a.length > 0 && h(a, !u && m(e, 'script')), s;
    },
    buildFragment: function (e, t, n, r) {
      for (var i, o, a, s, u, l, c = 0, d = e.length, f = t.createDocumentFragment(), p = []; d > c; c++)
        if (i = e[c], i || 0 === i)
          if ('object' === ot.type(i))
            ot.merge(p, i.nodeType ? [i] : i);
          else if (Nt.test(i)) {
            for (o = o || f.appendChild(t.createElement('div')), a = (Ot.exec(i) || [
                '',
                ''
              ])[1].toLowerCase(), s = qt[a] || qt._default, o.innerHTML = s[1] + i.replace(At, '<$1></$2>') + s[2], l = s[0]; l--;)
              o = o.lastChild;
            ot.merge(p, o.childNodes), o = f.firstChild, o.textContent = '';
          } else
            p.push(t.createTextNode(i));
      for (f.textContent = '', c = 0; i = p[c++];)
        if ((!r || -1 === ot.inArray(i, r)) && (u = ot.contains(i.ownerDocument, i), o = m(f.appendChild(i), 'script'), u && h(o), n))
          for (l = 0; i = o[l++];)
            It.test(i.type || '') && n.push(i);
      return f;
    },
    cleanData: function (e) {
      for (var n, r, o, a, s, u, l = ot.event.special, c = 0; (r = e[c]) !== t; c++) {
        if (i.accepts(r) && (s = r[mt.expando], s && (n = mt.cache[s]))) {
          if (o = Object.keys(n.events || {}), o.length)
            for (u = 0; (a = o[u]) !== t; u++)
              l[a] ? ot.event.remove(r, a) : ot.removeEvent(r, a, n.handle);
          mt.cache[s] && delete mt.cache[s];
        }
        delete gt.cache[r[gt.expando]];
      }
    },
    _evalUrl: function (e) {
      return ot.ajax({
        url: e,
        type: 'GET',
        dataType: 'script',
        async: !1,
        global: !1,
        'throws': !0
      });
    }
  }), ot.fn.extend({
    wrapAll: function (e) {
      var t;
      return ot.isFunction(e) ? this.each(function (t) {
        ot(this).wrapAll(e.call(this, t));
      }) : (this[0] && (t = ot(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
        for (var e = this; e.firstElementChild;)
          e = e.firstElementChild;
        return e;
      }).append(this)), this);
    },
    wrapInner: function (e) {
      return ot.isFunction(e) ? this.each(function (t) {
        ot(this).wrapInner(e.call(this, t));
      }) : this.each(function () {
        var t = ot(this), n = t.contents();
        n.length ? n.wrapAll(e) : t.append(e);
      });
    },
    wrap: function (e) {
      var t = ot.isFunction(e);
      return this.each(function (n) {
        ot(this).wrapAll(t ? e.call(this, n) : e);
      });
    },
    unwrap: function () {
      return this.parent().each(function () {
        ot.nodeName(this, 'body') || ot(this).replaceWith(this.childNodes);
      }).end();
    }
  });
  var Vt, Ut, Wt = /^(none|table(?!-c[ea]).+)/, Bt = /^margin/, Yt = RegExp('^(' + at + ')(.*)$', 'i'), zt = RegExp('^(' + at + ')(?!px)[a-z%]+$', 'i'), Gt = RegExp('^([+-])=(' + at + ')', 'i'), Xt = { BODY: 'block' }, Jt = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    }, Zt = {
      letterSpacing: 0,
      fontWeight: 400
    }, Kt = [
      'Top',
      'Right',
      'Bottom',
      'Left'
    ], Qt = [
      'Webkit',
      'O',
      'Moz',
      'ms'
    ];
  ot.fn.extend({
    css: function (e, n) {
      return ot.access(this, function (e, n, r) {
        var i, o, a = {}, s = 0;
        if (ot.isArray(n)) {
          for (i = b(e), o = n.length; o > s; s++)
            a[n[s]] = ot.css(e, n[s], !1, i);
          return a;
        }
        return r !== t ? ot.style(e, n, r) : ot.css(e, n);
      }, e, n, arguments.length > 1);
    },
    show: function () {
      return $(this, !0);
    },
    hide: function () {
      return $(this);
    },
    toggle: function (e) {
      return 'boolean' == typeof e ? e ? this.show() : this.hide() : this.each(function () {
        w(this) ? ot(this).show() : ot(this).hide();
      });
    }
  }), ot.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = Vt(e, 'opacity');
            return '' === n ? '1' : n;
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: { 'float': 'cssFloat' },
    style: function (e, n, r, i) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var o, a, s, u = ot.camelCase(n), l = e.style;
        return n = ot.cssProps[u] || (ot.cssProps[u] = y(l, u)), s = ot.cssHooks[n] || ot.cssHooks[u], r === t ? s && 'get' in s && (o = s.get(e, !1, i)) !== t ? o : l[n] : (a = typeof r, 'string' === a && (o = Gt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(ot.css(e, n)), a = 'number'), null == r || 'number' === a && isNaN(r) || ('number' !== a || ot.cssNumber[u] || (r += 'px'), ot.support.clearCloneStyle || '' !== r || 0 !== n.indexOf('background') || (l[n] = 'inherit'), s && 'set' in s && (r = s.set(e, r, i)) === t || (l[n] = r)), t);
      }
    },
    css: function (e, n, r, i) {
      var o, a, s, u = ot.camelCase(n);
      return n = ot.cssProps[u] || (ot.cssProps[u] = y(e.style, u)), s = ot.cssHooks[n] || ot.cssHooks[u], s && 'get' in s && (o = s.get(e, !0, r)), o === t && (o = Vt(e, n, i)), 'normal' === o && n in Zt && (o = Zt[n]), '' === r || r ? (a = parseFloat(o), r === !0 || ot.isNumeric(a) ? a || 0 : o) : o;
    }
  }), Vt = function (e, n, r) {
    var i, o, a, s = r || b(e), u = s ? s.getPropertyValue(n) || s[n] : t, l = e.style;
    return s && ('' !== u || ot.contains(e.ownerDocument, e) || (u = ot.style(e, n)), zt.test(u) && Bt.test(n) && (i = l.width, o = l.minWidth, a = l.maxWidth, l.minWidth = l.maxWidth = l.width = u, u = s.width, l.width = i, l.minWidth = o, l.maxWidth = a)), u;
  }, ot.each([
    'height',
    'width'
  ], function (e, n) {
    ot.cssHooks[n] = {
      get: function (e, r, i) {
        return r ? 0 === e.offsetWidth && Wt.test(ot.css(e, 'display')) ? ot.swap(e, Jt, function () {
          return _(e, n, i);
        }) : _(e, n, i) : t;
      },
      set: function (e, t, r) {
        var i = r && b(e);
        return x(e, t, r ? k(e, n, r, ot.support.boxSizing && 'border-box' === ot.css(e, 'boxSizing', !1, i), i) : 0);
      }
    };
  }), ot(function () {
    ot.support.reliableMarginRight || (ot.cssHooks.marginRight = {
      get: function (e, n) {
        return n ? ot.swap(e, { display: 'inline-block' }, Vt, [
          e,
          'marginRight'
        ]) : t;
      }
    }), !ot.support.pixelPosition && ot.fn.position && ot.each([
      'top',
      'left'
    ], function (e, n) {
      ot.cssHooks[n] = {
        get: function (e, r) {
          return r ? (r = Vt(e, n), zt.test(r) ? ot(e).position()[n] + 'px' : r) : t;
        }
      };
    });
  }), ot.expr && ot.expr.filters && (ot.expr.filters.hidden = function (e) {
    return 0 >= e.offsetWidth && 0 >= e.offsetHeight;
  }, ot.expr.filters.visible = function (e) {
    return !ot.expr.filters.hidden(e);
  }), ot.each({
    margin: '',
    padding: '',
    border: 'Width'
  }, function (e, t) {
    ot.cssHooks[e + t] = {
      expand: function (n) {
        for (var r = 0, i = {}, o = 'string' == typeof n ? n.split(' ') : [n]; 4 > r; r++)
          i[e + Kt[r] + t] = o[r] || o[r - 2] || o[0];
        return i;
      }
    }, Bt.test(e) || (ot.cssHooks[e + t].set = x);
  });
  var en = /%20/g, tn = /\[\]$/, nn = /\r?\n/g, rn = /^(?:submit|button|image|reset|file)$/i, on = /^(?:input|select|textarea|keygen)/i;
  ot.fn.extend({
    serialize: function () {
      return ot.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        var e = ot.prop(this, 'elements');
        return e ? ot.makeArray(e) : this;
      }).filter(function () {
        var e = this.type;
        return this.name && !ot(this).is(':disabled') && on.test(this.nodeName) && !rn.test(e) && (this.checked || !Lt.test(e));
      }).map(function (e, t) {
        var n = ot(this).val();
        return null == n ? null : ot.isArray(n) ? ot.map(n, function (e) {
          return {
            name: t.name,
            value: e.replace(nn, '\r\n')
          };
        }) : {
          name: t.name,
          value: n.replace(nn, '\r\n')
        };
      }).get();
    }
  }), ot.param = function (e, n) {
    var r, i = [], o = function (e, t) {
        t = ot.isFunction(t) ? t() : null == t ? '' : t, i[i.length] = encodeURIComponent(e) + '=' + encodeURIComponent(t);
      };
    if (n === t && (n = ot.ajaxSettings && ot.ajaxSettings.traditional), ot.isArray(e) || e.jquery && !ot.isPlainObject(e))
      ot.each(e, function () {
        o(this.name, this.value);
      });
    else
      for (r in e)
        C(r, e[r], n, o);
    return i.join('&').replace(en, '+');
  }, ot.each('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(' '), function (e, t) {
    ot.fn[t] = function (e, n) {
      return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
    };
  }), ot.fn.extend({
    hover: function (e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    },
    bind: function (e, t, n) {
      return this.on(e, null, t, n);
    },
    unbind: function (e, t) {
      return this.off(e, null, t);
    },
    delegate: function (e, t, n, r) {
      return this.on(t, e, n, r);
    },
    undelegate: function (e, t, n) {
      return 1 === arguments.length ? this.off(e, '**') : this.off(t, e || '**', n);
    }
  });
  var an, sn, un = ot.now(), ln = /\?/, cn = /#.*$/, dn = /([?&])_=[^&]*/, fn = /^(.*?):[ \t]*([^\r\n]*)$/gm, pn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, hn = /^(?:GET|HEAD)$/, gn = /^\/\//, mn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, vn = ot.fn.load, yn = {}, wn = {}, bn = '*/'.concat('*');
  try {
    sn = W.href;
  } catch ($n) {
    sn = B.createElement('a'), sn.href = '', sn = sn.href;
  }
  an = mn.exec(sn.toLowerCase()) || [], ot.fn.load = function (e, n, r) {
    if ('string' != typeof e && vn)
      return vn.apply(this, arguments);
    var i, o, a, s = this, u = e.indexOf(' ');
    return u >= 0 && (i = e.slice(u), e = e.slice(0, u)), ot.isFunction(n) ? (r = n, n = t) : n && 'object' == typeof n && (o = 'POST'), s.length > 0 && ot.ajax({
      url: e,
      type: o,
      dataType: 'html',
      data: n
    }).done(function (e) {
      a = arguments, s.html(i ? ot('<div>').append(ot.parseHTML(e)).find(i) : e);
    }).complete(r && function (e, t) {
      s.each(r, a || [
        e.responseText,
        t,
        e
      ]);
    }), this;
  }, ot.each([
    'ajaxStart',
    'ajaxStop',
    'ajaxComplete',
    'ajaxError',
    'ajaxSuccess',
    'ajaxSend'
  ], function (e, t) {
    ot.fn[t] = function (e) {
      return this.on(t, e);
    };
  }), ot.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: sn,
      type: 'GET',
      isLocal: pn.test(an[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      accepts: {
        '*': bn,
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript'
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: 'responseXML',
        text: 'responseText',
        json: 'responseJSON'
      },
      converters: {
        '* text': String,
        'text html': !0,
        'text json': ot.parseJSON,
        'text xml': ot.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function (e, t) {
      return t ? M(M(e, ot.ajaxSettings), t) : M(ot.ajaxSettings, e);
    },
    ajaxPrefilter: E(yn),
    ajaxTransport: E(wn),
    ajax: function (e, n) {
      function r(e, n, r, s) {
        var l, d, y, w, $, k = n;
        2 !== b && (b = 2, u && clearTimeout(u), i = t, a = s || '', x.readyState = e > 0 ? 4 : 0, l = e >= 200 && 300 > e || 304 === e, r && (w = P(f, x, r)), w = A(f, w, x, l), l ? (f.ifModified && ($ = x.getResponseHeader('Last-Modified'), $ && (ot.lastModified[o] = $), $ = x.getResponseHeader('etag'), $ && (ot.etag[o] = $)), 204 === e || 'HEAD' === f.type ? k = 'nocontent' : 304 === e ? k = 'notmodified' : (k = w.state, d = w.data, y = w.error, l = !y)) : (y = k, (e || !k) && (k = 'error', 0 > e && (e = 0))), x.status = e, x.statusText = (n || k) + '', l ? g.resolveWith(p, [
          d,
          k,
          x
        ]) : g.rejectWith(p, [
          x,
          k,
          y
        ]), x.statusCode(v), v = t, c && h.trigger(l ? 'ajaxSuccess' : 'ajaxError', [
          x,
          f,
          l ? d : y
        ]), m.fireWith(p, [
          x,
          k
        ]), c && (h.trigger('ajaxComplete', [
          x,
          f
        ]), --ot.active || ot.event.trigger('ajaxStop')));
      }
      'object' == typeof e && (n = e, e = t), n = n || {};
      var i, o, a, s, u, l, c, d, f = ot.ajaxSetup({}, n), p = f.context || f, h = f.context && (p.nodeType || p.jquery) ? ot(p) : ot.event, g = ot.Deferred(), m = ot.Callbacks('once memory'), v = f.statusCode || {}, y = {}, w = {}, b = 0, $ = 'canceled', x = {
          readyState: 0,
          getResponseHeader: function (e) {
            var t;
            if (2 === b) {
              if (!s)
                for (s = {}; t = fn.exec(a);)
                  s[t[1].toLowerCase()] = t[2];
              t = s[e.toLowerCase()];
            }
            return null == t ? null : t;
          },
          getAllResponseHeaders: function () {
            return 2 === b ? a : null;
          },
          setRequestHeader: function (e, t) {
            var n = e.toLowerCase();
            return b || (e = w[n] = w[n] || e, y[e] = t), this;
          },
          overrideMimeType: function (e) {
            return b || (f.mimeType = e), this;
          },
          statusCode: function (e) {
            var t;
            if (e)
              if (2 > b)
                for (t in e)
                  v[t] = [
                    v[t],
                    e[t]
                  ];
              else
                x.always(e[x.status]);
            return this;
          },
          abort: function (e) {
            var t = e || $;
            return i && i.abort(t), r(0, t), this;
          }
        };
      if (g.promise(x).complete = m.add, x.success = x.done, x.error = x.fail, f.url = ((e || f.url || sn) + '').replace(cn, '').replace(gn, an[1] + '//'), f.type = n.method || n.type || f.method || f.type, f.dataTypes = ot.trim(f.dataType || '*').toLowerCase().match(st) || [''], null == f.crossDomain && (l = mn.exec(f.url.toLowerCase()), f.crossDomain = !(!l || l[1] === an[1] && l[2] === an[2] && (l[3] || ('http:' === l[1] ? '80' : '443')) === (an[3] || ('http:' === an[1] ? '80' : '443')))), f.data && f.processData && 'string' != typeof f.data && (f.data = ot.param(f.data, f.traditional)), D(yn, f, n, x), 2 === b)
        return x;
      c = f.global, c && 0 === ot.active++ && ot.event.trigger('ajaxStart'), f.type = f.type.toUpperCase(), f.hasContent = !hn.test(f.type), o = f.url, f.hasContent || (f.data && (o = f.url += (ln.test(o) ? '&' : '?') + f.data, delete f.data), f.cache === !1 && (f.url = dn.test(o) ? o.replace(dn, '$1_=' + un++) : o + (ln.test(o) ? '&' : '?') + '_=' + un++)), f.ifModified && (ot.lastModified[o] && x.setRequestHeader('If-Modified-Since', ot.lastModified[o]), ot.etag[o] && x.setRequestHeader('If-None-Match', ot.etag[o])), (f.data && f.hasContent && f.contentType !== !1 || n.contentType) && x.setRequestHeader('Content-Type', f.contentType), x.setRequestHeader('Accept', f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ('*' !== f.dataTypes[0] ? ', ' + bn + '; q=0.01' : '') : f.accepts['*']);
      for (d in f.headers)
        x.setRequestHeader(d, f.headers[d]);
      if (f.beforeSend && (f.beforeSend.call(p, x, f) === !1 || 2 === b))
        return x.abort();
      $ = 'abort';
      for (d in {
          success: 1,
          error: 1,
          complete: 1
        })
        x[d](f[d]);
      if (i = D(wn, f, n, x)) {
        x.readyState = 1, c && h.trigger('ajaxSend', [
          x,
          f
        ]), f.async && f.timeout > 0 && (u = setTimeout(function () {
          x.abort('timeout');
        }, f.timeout));
        try {
          b = 1, i.send(y, r);
        } catch (k) {
          if (!(2 > b))
            throw k;
          r(-1, k);
        }
      } else
        r(-1, 'No Transport');
      return x;
    },
    getJSON: function (e, t, n) {
      return ot.get(e, t, n, 'json');
    },
    getScript: function (e, n) {
      return ot.get(e, t, n, 'script');
    }
  }), ot.each([
    'get',
    'post'
  ], function (e, n) {
    ot[n] = function (e, r, i, o) {
      return ot.isFunction(r) && (o = o || i, i = r, r = t), ot.ajax({
        url: e,
        type: n,
        dataType: o,
        data: r,
        success: i
      });
    };
  }), ot.ajaxSetup({
    accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
    contents: { script: /(?:java|ecma)script/ },
    converters: {
      'text script': function (e) {
        return ot.globalEval(e), e;
      }
    }
  }), ot.ajaxPrefilter('script', function (e) {
    e.cache === t && (e.cache = !1), e.crossDomain && (e.type = 'GET');
  }), ot.ajaxTransport('script', function (e) {
    if (e.crossDomain) {
      var t, n;
      return {
        send: function (r, i) {
          t = ot('<script>').prop({
            async: !0,
            charset: e.scriptCharset,
            src: e.url
          }).on('load error', n = function (e) {
            t.remove(), n = null, e && i('error' === e.type ? 404 : 200, e.type);
          }), B.head.appendChild(t[0]);
        },
        abort: function () {
          n && n();
        }
      };
    }
  });
  var xn = [], kn = /(=)\?(?=&|$)|\?\?/;
  ot.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function () {
      var e = xn.pop() || ot.expando + '_' + un++;
      return this[e] = !0, e;
    }
  }), ot.ajaxPrefilter('json jsonp', function (n, r, i) {
    var o, a, s, u = n.jsonp !== !1 && (kn.test(n.url) ? 'url' : 'string' == typeof n.data && !(n.contentType || '').indexOf('application/x-www-form-urlencoded') && kn.test(n.data) && 'data');
    return u || 'jsonp' === n.dataTypes[0] ? (o = n.jsonpCallback = ot.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, u ? n[u] = n[u].replace(kn, '$1' + o) : n.jsonp !== !1 && (n.url += (ln.test(n.url) ? '&' : '?') + n.jsonp + '=' + o), n.converters['script json'] = function () {
      return s || ot.error(o + ' was not called'), s[0];
    }, n.dataTypes[0] = 'json', a = e[o], e[o] = function () {
      s = arguments;
    }, i.always(function () {
      e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, xn.push(o)), s && ot.isFunction(a) && a(s[0]), s = a = t;
    }), 'script') : t;
  }), ot.ajaxSettings.xhr = function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {
    }
  };
  var _n = ot.ajaxSettings.xhr(), Tn = {
      0: 200,
      1223: 204
    }, Sn = 0, Cn = {};
  e.ActiveXObject && ot(e).on('unload', function () {
    for (var e in Cn)
      Cn[e]();
    Cn = t;
  }), ot.support.cors = !!_n && 'withCredentials' in _n, ot.support.ajax = _n = !!_n, ot.ajaxTransport(function (e) {
    var n;
    return ot.support.cors || _n && !e.crossDomain ? {
      send: function (r, i) {
        var o, a, s = e.xhr();
        if (s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
          for (o in e.xhrFields)
            s[o] = e.xhrFields[o];
        e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), e.crossDomain || r['X-Requested-With'] || (r['X-Requested-With'] = 'XMLHttpRequest');
        for (o in r)
          s.setRequestHeader(o, r[o]);
        n = function (e) {
          return function () {
            n && (delete Cn[a], n = s.onload = s.onerror = null, 'abort' === e ? s.abort() : 'error' === e ? i(s.status || 404, s.statusText) : i(Tn[s.status] || s.status, s.statusText, 'string' == typeof s.responseText ? { text: s.responseText } : t, s.getAllResponseHeaders()));
          };
        }, s.onload = n(), s.onerror = n('error'), n = Cn[a = Sn++] = n('abort'), s.send(e.hasContent && e.data || null);
      },
      abort: function () {
        n && n();
      }
    } : t;
  });
  var En, Dn, Mn = /^(?:toggle|show|hide)$/, Pn = RegExp('^(?:([+-])=|)(' + at + ')([a-z%]*)$', 'i'), An = /queueHooks$/, On = [R], Nn = {
      '*': [function (e, t) {
          var n = this.createTween(e, t), r = n.cur(), i = Pn.exec(t), o = i && i[3] || (ot.cssNumber[e] ? '' : 'px'), a = (ot.cssNumber[e] || 'px' !== o && +r) && Pn.exec(ot.css(n.elem, e)), s = 1, u = 20;
          if (a && a[3] !== o) {
            o = o || a[3], i = i || [], a = +r || 1;
            do
              s = s || '.5', a /= s, ot.style(n.elem, e, a + o);
            while (s !== (s = n.cur() / r) && 1 !== s && --u);
          }
          return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n;
        }]
    };
  ot.Animation = ot.extend(j, {
    tweener: function (e, t) {
      ot.isFunction(e) ? (t = e, e = ['*']) : e = e.split(' ');
      for (var n, r = 0, i = e.length; i > r; r++)
        n = e[r], Nn[n] = Nn[n] || [], Nn[n].unshift(t);
    },
    prefilter: function (e, t) {
      t ? On.unshift(e) : On.push(e);
    }
  }), ot.Tween = I, I.prototype = {
    constructor: I,
    init: function (e, t, n, r, i, o) {
      this.elem = e, this.prop = n, this.easing = i || 'swing', this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (ot.cssNumber[n] ? '' : 'px');
    },
    cur: function () {
      var e = I.propHooks[this.prop];
      return e && e.get ? e.get(this) : I.propHooks._default.get(this);
    },
    run: function (e) {
      var t, n = I.propHooks[this.prop];
      return this.pos = t = this.options.duration ? ot.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : I.propHooks._default.set(this), this;
    }
  }, I.prototype.init.prototype = I.prototype, I.propHooks = {
    _default: {
      get: function (e) {
        var t;
        return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ot.css(e.elem, e.prop, ''), t && 'auto' !== t ? t : 0) : e.elem[e.prop];
      },
      set: function (e) {
        ot.fx.step[e.prop] ? ot.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ot.cssProps[e.prop]] || ot.cssHooks[e.prop]) ? ot.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now;
      }
    }
  }, I.propHooks.scrollTop = I.propHooks.scrollLeft = {
    set: function (e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, ot.each([
    'toggle',
    'show',
    'hide'
  ], function (e, t) {
    var n = ot.fn[t];
    ot.fn[t] = function (e, r, i) {
      return null == e || 'boolean' == typeof e ? n.apply(this, arguments) : this.animate(F(t, !0), e, r, i);
    };
  }), ot.fn.extend({
    fadeTo: function (e, t, n, r) {
      return this.filter(w).css('opacity', 0).show().end().animate({ opacity: t }, e, n, r);
    },
    animate: function (e, t, n, r) {
      var i = ot.isEmptyObject(e), o = ot.speed(t, n, r), a = function () {
          var t = j(this, ot.extend({}, e), o);
          (i || mt.get(this, 'finish')) && t.stop(!0);
        };
      return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a);
    },
    stop: function (e, n, r) {
      var i = function (e) {
        var t = e.stop;
        delete e.stop, t(r);
      };
      return 'string' != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || 'fx', []), this.each(function () {
        var t = !0, n = null != e && e + 'queueHooks', o = ot.timers, a = mt.get(this);
        if (n)
          a[n] && a[n].stop && i(a[n]);
        else
          for (n in a)
            a[n] && a[n].stop && An.test(n) && i(a[n]);
        for (n = o.length; n--;)
          o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), t = !1, o.splice(n, 1));
        (t || !r) && ot.dequeue(this, e);
      });
    },
    finish: function (e) {
      return e !== !1 && (e = e || 'fx'), this.each(function () {
        var t, n = mt.get(this), r = n[e + 'queue'], i = n[e + 'queueHooks'], o = ot.timers, a = r ? r.length : 0;
        for (n.finish = !0, ot.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;)
          o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
        for (t = 0; a > t; t++)
          r[t] && r[t].finish && r[t].finish.call(this);
        delete n.finish;
      });
    }
  }), ot.each({
    slideDown: F('show'),
    slideUp: F('hide'),
    slideToggle: F('toggle'),
    fadeIn: { opacity: 'show' },
    fadeOut: { opacity: 'hide' },
    fadeToggle: { opacity: 'toggle' }
  }, function (e, t) {
    ot.fn[e] = function (e, n, r) {
      return this.animate(t, e, n, r);
    };
  }), ot.speed = function (e, t, n) {
    var r = e && 'object' == typeof e ? ot.extend({}, e) : {
        complete: n || !n && t || ot.isFunction(e) && e,
        duration: e,
        easing: n && t || t && !ot.isFunction(t) && t
      };
    return r.duration = ot.fx.off ? 0 : 'number' == typeof r.duration ? r.duration : r.duration in ot.fx.speeds ? ot.fx.speeds[r.duration] : ot.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = 'fx'), r.old = r.complete, r.complete = function () {
      ot.isFunction(r.old) && r.old.call(this), r.queue && ot.dequeue(this, r.queue);
    }, r;
  }, ot.easing = {
    linear: function (e) {
      return e;
    },
    swing: function (e) {
      return 0.5 - Math.cos(e * Math.PI) / 2;
    }
  }, ot.timers = [], ot.fx = I.prototype.init, ot.fx.tick = function () {
    var e, n = ot.timers, r = 0;
    for (En = ot.now(); n.length > r; r++)
      e = n[r], e() || n[r] !== e || n.splice(r--, 1);
    n.length || ot.fx.stop(), En = t;
  }, ot.fx.timer = function (e) {
    e() && ot.timers.push(e) && ot.fx.start();
  }, ot.fx.interval = 13, ot.fx.start = function () {
    Dn || (Dn = setInterval(ot.fx.tick, ot.fx.interval));
  }, ot.fx.stop = function () {
    clearInterval(Dn), Dn = null;
  }, ot.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, ot.fx.step = {}, ot.expr && ot.expr.filters && (ot.expr.filters.animated = function (e) {
    return ot.grep(ot.timers, function (t) {
      return e === t.elem;
    }).length;
  }), ot.fn.offset = function (e) {
    if (arguments.length)
      return e === t ? this : this.each(function (t) {
        ot.offset.setOffset(this, e, t);
      });
    var n, r, i = this[0], o = {
        top: 0,
        left: 0
      }, a = i && i.ownerDocument;
    return a ? (n = a.documentElement, ot.contains(n, i) ? (typeof i.getBoundingClientRect !== U && (o = i.getBoundingClientRect()), r = H(a), {
      top: o.top + r.pageYOffset - n.clientTop,
      left: o.left + r.pageXOffset - n.clientLeft
    }) : o) : void 0;
  }, ot.offset = {
    setOffset: function (e, t, n) {
      var r, i, o, a, s, u, l, c = ot.css(e, 'position'), d = ot(e), f = {};
      'static' === c && (e.style.position = 'relative'), s = d.offset(), o = ot.css(e, 'top'), u = ot.css(e, 'left'), l = ('absolute' === c || 'fixed' === c) && (o + u).indexOf('auto') > -1, l ? (r = d.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0), ot.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), 'using' in t ? t.using.call(e, f) : d.css(f);
    }
  }, ot.fn.extend({
    position: function () {
      if (this[0]) {
        var e, t, n = this[0], r = {
            top: 0,
            left: 0
          };
        return 'fixed' === ot.css(n, 'position') ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ot.nodeName(e[0], 'html') || (r = e.offset()), r.top += ot.css(e[0], 'borderTopWidth', !0), r.left += ot.css(e[0], 'borderLeftWidth', !0)), {
          top: t.top - r.top - ot.css(n, 'marginTop', !0),
          left: t.left - r.left - ot.css(n, 'marginLeft', !0)
        };
      }
    },
    offsetParent: function () {
      return this.map(function () {
        for (var e = this.offsetParent || Y; e && !ot.nodeName(e, 'html') && 'static' === ot.css(e, 'position');)
          e = e.offsetParent;
        return e || Y;
      });
    }
  }), ot.each({
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
  }, function (n, r) {
    var i = 'pageYOffset' === r;
    ot.fn[n] = function (o) {
      return ot.access(this, function (n, o, a) {
        var s = H(n);
        return a === t ? s ? s[r] : n[o] : (s ? s.scrollTo(i ? e.pageXOffset : a, i ? a : e.pageYOffset) : n[o] = a, t);
      }, n, o, arguments.length, null);
    };
  }), ot.each({
    Height: 'height',
    Width: 'width'
  }, function (e, n) {
    ot.each({
      padding: 'inner' + e,
      content: n,
      '': 'outer' + e
    }, function (r, i) {
      ot.fn[i] = function (i, o) {
        var a = arguments.length && (r || 'boolean' != typeof i), s = r || (i === !0 || o === !0 ? 'margin' : 'border');
        return ot.access(this, function (n, r, i) {
          var o;
          return ot.isWindow(n) ? n.document.documentElement['client' + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body['scroll' + e], o['scroll' + e], n.body['offset' + e], o['offset' + e], o['client' + e])) : i === t ? ot.css(n, r, s) : ot.style(n, r, i, s);
        }, n, a ? i : t, a, null);
      };
    });
  }), ot.fn.size = function () {
    return this.length;
  }, ot.fn.andSelf = ot.fn.addBack, 'object' == typeof module && module && 'object' == typeof module.exports ? module.exports = ot : 'function' == typeof define && define.amd && define('jquery', [], function () {
    return ot;
  }), 'object' == typeof e && 'object' == typeof e.document && (e.jQuery = e.$ = ot);
}(window), function (e, t) {
  var n, r = e.jQuery || e.Cowboy || (e.Cowboy = {});
  r.throttle = n = function (e, n, i, o) {
    function a() {
      function r() {
        u = +new Date(), i.apply(l, d);
      }
      function a() {
        s = t;
      }
      var l = this, c = +new Date() - u, d = arguments;
      o && !s && r(), s && clearTimeout(s), o === t && c > e ? r() : n !== !0 && (s = setTimeout(o ? a : r, o === t ? e - c : e));
    }
    var s, u = 0;
    return 'boolean' != typeof n && (o = i, i = n, n = t), r.guid && (a.guid = i.guid = i.guid || r.guid++), a;
  }, r.debounce = function (e, r, i) {
    return i === t ? n(e, r, !1) : n(e, i, r !== !1);
  };
}(this), function (e, t) {
  'use strict';
  function n() {
    if (!r.READY) {
      r.event.determineEventTypes();
      for (var e in r.gestures)
        r.gestures.hasOwnProperty(e) && r.detection.register(r.gestures[e]);
      r.event.onTouch(r.DOCUMENT, r.EVENT_MOVE, r.detection.detect), r.event.onTouch(r.DOCUMENT, r.EVENT_END, r.detection.detect), r.READY = !0;
    }
  }
  var r = function (e, t) {
    return new r.Instance(e, t || {});
  };
  r.defaults = {
    stop_browser_behavior: {
      userSelect: 'none',
      touchAction: 'none',
      touchCallout: 'none',
      contentZooming: 'none',
      userDrag: 'none',
      tapHighlightColor: 'rgba(0,0,0,0)'
    }
  }, r.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, r.HAS_TOUCHEVENTS = 'ontouchstart' in e, r.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, r.NO_MOUSEEVENTS = r.HAS_TOUCHEVENTS && navigator.userAgent.match(r.MOBILE_REGEX), r.EVENT_TYPES = {}, r.DIRECTION_DOWN = 'down', r.DIRECTION_LEFT = 'left', r.DIRECTION_UP = 'up', r.DIRECTION_RIGHT = 'right', r.POINTER_MOUSE = 'mouse', r.POINTER_TOUCH = 'touch', r.POINTER_PEN = 'pen', r.EVENT_START = 'start', r.EVENT_MOVE = 'move', r.EVENT_END = 'end', r.DOCUMENT = document, r.plugins = {}, r.READY = !1, r.Instance = function (e, t) {
    var i = this;
    return n(), this.element = e, this.enabled = !0, this.options = r.utils.extend(r.utils.extend({}, r.defaults), t || {}), this.options.stop_browser_behavior && r.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), r.event.onTouch(e, r.EVENT_START, function (e) {
      i.enabled && r.detection.startDetect(i, e);
    }), this;
  }, r.Instance.prototype = {
    on: function (e, t) {
      for (var n = e.split(' '), r = 0; n.length > r; r++)
        this.element.addEventListener(n[r], t, !1);
      return this;
    },
    off: function (e, t) {
      for (var n = e.split(' '), r = 0; n.length > r; r++)
        this.element.removeEventListener(n[r], t, !1);
      return this;
    },
    trigger: function (e, t) {
      var n = r.DOCUMENT.createEvent('Event');
      n.initEvent(e, !0, !0), n.gesture = t;
      var i = this.element;
      return r.utils.hasParent(t.target, i) && (i = t.target), i.dispatchEvent(n), this;
    },
    enable: function (e) {
      return this.enabled = e, this;
    }
  };
  var i = null, o = !1, a = !1;
  r.event = {
    bindDom: function (e, t, n) {
      for (var r = t.split(' '), i = 0; r.length > i; i++)
        e.addEventListener(r[i], n, !1);
    },
    onTouch: function (e, t, n) {
      var s = this;
      this.bindDom(e, r.EVENT_TYPES[t], function (u) {
        var l = u.type.toLowerCase();
        if (!l.match(/mouse/) || !a) {
          (l.match(/touch/) || l.match(/pointerdown/) || l.match(/mouse/) && 1 === u.which) && (o = !0), l.match(/touch|pointer/) && (a = !0);
          var c = 0;
          o && (r.HAS_POINTEREVENTS && t != r.EVENT_END ? c = r.PointerEvent.updatePointer(t, u) : l.match(/touch/) ? c = u.touches.length : a || (c = l.match(/up/) ? 0 : 1), c > 0 && t == r.EVENT_END ? t = r.EVENT_MOVE : c || (t = r.EVENT_END), c || null === i ? i = u : u = i, n.call(r.detection, s.collectEventData(e, t, u)), r.HAS_POINTEREVENTS && t == r.EVENT_END && (c = r.PointerEvent.updatePointer(t, u))), c || (i = null, o = !1, a = !1, r.PointerEvent.reset());
        }
      });
    },
    determineEventTypes: function () {
      var e;
      e = r.HAS_POINTEREVENTS ? r.PointerEvent.getEvents() : r.NO_MOUSEEVENTS ? [
        'touchstart',
        'touchmove',
        'touchend touchcancel'
      ] : [
        'touchstart mousedown',
        'touchmove mousemove',
        'touchend touchcancel mouseup'
      ], r.EVENT_TYPES[r.EVENT_START] = e[0], r.EVENT_TYPES[r.EVENT_MOVE] = e[1], r.EVENT_TYPES[r.EVENT_END] = e[2];
    },
    getTouchList: function (e) {
      return r.HAS_POINTEREVENTS ? r.PointerEvent.getTouchList() : e.touches ? e.touches : [{
          identifier: 1,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target
        }];
    },
    collectEventData: function (e, t, n) {
      var i = this.getTouchList(n, t), o = r.POINTER_TOUCH;
      return (n.type.match(/mouse/) || r.PointerEvent.matchType(r.POINTER_MOUSE, n)) && (o = r.POINTER_MOUSE), {
        center: r.utils.getCenter(i),
        timeStamp: new Date().getTime(),
        target: n.target,
        touches: i,
        eventType: t,
        pointerType: o,
        srcEvent: n,
        preventDefault: function () {
          this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault();
        },
        stopPropagation: function () {
          this.srcEvent.stopPropagation();
        },
        stopDetect: function () {
          return r.detection.stopDetect();
        }
      };
    }
  }, r.PointerEvent = {
    pointers: {},
    getTouchList: function () {
      var e = this, t = [];
      return Object.keys(e.pointers).sort().forEach(function (n) {
        t.push(e.pointers[n]);
      }), t;
    },
    updatePointer: function (e, t) {
      return e == r.EVENT_END ? this.pointers = {} : (t.identifier = t.pointerId, this.pointers[t.pointerId] = t), Object.keys(this.pointers).length;
    },
    matchType: function (e, t) {
      if (!t.pointerType)
        return !1;
      var n = {};
      return n[r.POINTER_MOUSE] = t.pointerType == t.MSPOINTER_TYPE_MOUSE || t.pointerType == r.POINTER_MOUSE, n[r.POINTER_TOUCH] = t.pointerType == t.MSPOINTER_TYPE_TOUCH || t.pointerType == r.POINTER_TOUCH, n[r.POINTER_PEN] = t.pointerType == t.MSPOINTER_TYPE_PEN || t.pointerType == r.POINTER_PEN, n[e];
    },
    getEvents: function () {
      return [
        'pointerdown MSPointerDown',
        'pointermove MSPointerMove',
        'pointerup pointercancel MSPointerUp MSPointerCancel'
      ];
    },
    reset: function () {
      this.pointers = {};
    }
  }, r.utils = {
    extend: function (e, n, r) {
      for (var i in n)
        e[i] !== t && r || (e[i] = n[i]);
      return e;
    },
    hasParent: function (e, t) {
      for (; e;) {
        if (e == t)
          return !0;
        e = e.parentNode;
      }
      return !1;
    },
    getCenter: function (e) {
      for (var t = [], n = [], r = 0, i = e.length; i > r; r++)
        t.push(e[r].pageX), n.push(e[r].pageY);
      return {
        pageX: (Math.min.apply(Math, t) + Math.max.apply(Math, t)) / 2,
        pageY: (Math.min.apply(Math, n) + Math.max.apply(Math, n)) / 2
      };
    },
    getVelocity: function (e, t, n) {
      return {
        x: Math.abs(t / e) || 0,
        y: Math.abs(n / e) || 0
      };
    },
    getAngle: function (e, t) {
      var n = t.pageY - e.pageY, r = t.pageX - e.pageX;
      return 180 * Math.atan2(n, r) / Math.PI;
    },
    getDirection: function (e, t) {
      var n = Math.abs(e.pageX - t.pageX), i = Math.abs(e.pageY - t.pageY);
      return n >= i ? e.pageX - t.pageX > 0 ? r.DIRECTION_LEFT : r.DIRECTION_RIGHT : e.pageY - t.pageY > 0 ? r.DIRECTION_UP : r.DIRECTION_DOWN;
    },
    getDistance: function (e, t) {
      var n = t.pageX - e.pageX, r = t.pageY - e.pageY;
      return Math.sqrt(n * n + r * r);
    },
    getScale: function (e, t) {
      return e.length >= 2 && t.length >= 2 ? this.getDistance(t[0], t[1]) / this.getDistance(e[0], e[1]) : 1;
    },
    getRotation: function (e, t) {
      return e.length >= 2 && t.length >= 2 ? this.getAngle(t[1], t[0]) - this.getAngle(e[1], e[0]) : 0;
    },
    isVertical: function (e) {
      return e == r.DIRECTION_UP || e == r.DIRECTION_DOWN;
    },
    stopDefaultBrowserBehavior: function (e, t) {
      var n, r = [
          'webkit',
          'khtml',
          'moz',
          'ms',
          'o',
          ''
        ];
      if (t && e.style) {
        for (var i = 0; r.length > i; i++)
          for (var o in t)
            t.hasOwnProperty(o) && (n = o, r[i] && (n = r[i] + n.substring(0, 1).toUpperCase() + n.substring(1)), e.style[n] = t[o]);
        'none' == t.userSelect && (e.onselectstart = function () {
          return !1;
        });
      }
    }
  }, r.detection = {
    gestures: [],
    current: null,
    previous: null,
    stopped: !1,
    startDetect: function (e, t) {
      this.current || (this.stopped = !1, this.current = {
        inst: e,
        startEvent: r.utils.extend({}, t),
        lastEvent: !1,
        name: ''
      }, this.detect(t));
    },
    detect: function (e) {
      if (this.current && !this.stopped) {
        e = this.extendEventData(e);
        for (var t = this.current.inst.options, n = 0, i = this.gestures.length; i > n; n++) {
          var o = this.gestures[n];
          if (!this.stopped && t[o.name] !== !1 && o.handler.call(o, e, this.current.inst) === !1) {
            this.stopDetect();
            break;
          }
        }
        return this.current && (this.current.lastEvent = e), e.eventType == r.EVENT_END && !e.touches.length - 1 && this.stopDetect(), e;
      }
    },
    stopDetect: function () {
      this.previous = r.utils.extend({}, this.current), this.current = null, this.stopped = !0;
    },
    extendEventData: function (e) {
      var t = this.current.startEvent;
      if (t && (e.touches.length != t.touches.length || e.touches === t.touches)) {
        t.touches = [];
        for (var n = 0, i = e.touches.length; i > n; n++)
          t.touches.push(r.utils.extend({}, e.touches[n]));
      }
      var o = e.timeStamp - t.timeStamp, a = e.center.pageX - t.center.pageX, s = e.center.pageY - t.center.pageY, u = r.utils.getVelocity(o, a, s);
      return r.utils.extend(e, {
        deltaTime: o,
        deltaX: a,
        deltaY: s,
        velocityX: u.x,
        velocityY: u.y,
        distance: r.utils.getDistance(t.center, e.center),
        angle: r.utils.getAngle(t.center, e.center),
        direction: r.utils.getDirection(t.center, e.center),
        scale: r.utils.getScale(t.touches, e.touches),
        rotation: r.utils.getRotation(t.touches, e.touches),
        startEvent: t
      }), e;
    },
    register: function (e) {
      var n = e.defaults || {};
      return n[e.name] === t && (n[e.name] = !0), r.utils.extend(r.defaults, n, !0), e.index = e.index || 1000, this.gestures.push(e), this.gestures.sort(function (e, t) {
        return e.index < t.index ? -1 : e.index > t.index ? 1 : 0;
      }), this.gestures;
    }
  }, r.gestures = r.gestures || {}, r.gestures.Hold = {
    name: 'hold',
    index: 10,
    defaults: {
      hold_timeout: 500,
      hold_threshold: 1
    },
    timer: null,
    handler: function (e, t) {
      switch (e.eventType) {
      case r.EVENT_START:
        clearTimeout(this.timer), r.detection.current.name = this.name, this.timer = setTimeout(function () {
          'hold' == r.detection.current.name && t.trigger('hold', e);
        }, t.options.hold_timeout);
        break;
      case r.EVENT_MOVE:
        e.distance > t.options.hold_threshold && clearTimeout(this.timer);
        break;
      case r.EVENT_END:
        clearTimeout(this.timer);
      }
    }
  }, r.gestures.Tap = {
    name: 'tap',
    index: 100,
    defaults: {
      tap_max_touchtime: 250,
      tap_max_distance: 10,
      tap_always: !0,
      doubletap_distance: 20,
      doubletap_interval: 300
    },
    handler: function (e, t) {
      if (e.eventType == r.EVENT_END) {
        var n = r.detection.previous, i = !1;
        if (e.deltaTime > t.options.tap_max_touchtime || e.distance > t.options.tap_max_distance)
          return;
        n && 'tap' == n.name && e.timeStamp - n.lastEvent.timeStamp < t.options.doubletap_interval && e.distance < t.options.doubletap_distance && (t.trigger('doubletap', e), i = !0), (!i || t.options.tap_always) && (r.detection.current.name = 'tap', t.trigger(r.detection.current.name, e));
      }
    }
  }, r.gestures.Swipe = {
    name: 'swipe',
    index: 40,
    defaults: {
      swipe_max_touches: 1,
      swipe_velocity: 0.7
    },
    handler: function (e, t) {
      if (e.eventType == r.EVENT_END) {
        if (t.options.swipe_max_touches > 0 && e.touches.length > t.options.swipe_max_touches)
          return;
        (e.velocityX > t.options.swipe_velocity || e.velocityY > t.options.swipe_velocity) && (t.trigger(this.name, e), t.trigger(this.name + e.direction, e));
      }
    }
  }, r.gestures.Drag = {
    name: 'drag',
    index: 50,
    defaults: {
      drag_min_distance: 10,
      drag_max_touches: 1,
      drag_block_horizontal: !1,
      drag_block_vertical: !1,
      drag_lock_to_axis: !1,
      drag_lock_min_distance: 25
    },
    triggered: !1,
    handler: function (e, n) {
      if (r.detection.current.name != this.name && this.triggered)
        return n.trigger(this.name + 'end', e), this.triggered = !1, t;
      if (!(n.options.drag_max_touches > 0 && e.touches.length > n.options.drag_max_touches))
        switch (e.eventType) {
        case r.EVENT_START:
          this.triggered = !1;
          break;
        case r.EVENT_MOVE:
          if (e.distance < n.options.drag_min_distance && r.detection.current.name != this.name)
            return;
          r.detection.current.name = this.name, (r.detection.current.lastEvent.drag_locked_to_axis || n.options.drag_lock_to_axis && n.options.drag_lock_min_distance <= e.distance) && (e.drag_locked_to_axis = !0);
          var i = r.detection.current.lastEvent.direction;
          e.drag_locked_to_axis && i !== e.direction && (e.direction = r.utils.isVertical(i) ? 0 > e.deltaY ? r.DIRECTION_UP : r.DIRECTION_DOWN : 0 > e.deltaX ? r.DIRECTION_LEFT : r.DIRECTION_RIGHT), this.triggered || (n.trigger(this.name + 'start', e), this.triggered = !0), n.trigger(this.name, e), n.trigger(this.name + e.direction, e), (n.options.drag_block_vertical && r.utils.isVertical(e.direction) || n.options.drag_block_horizontal && !r.utils.isVertical(e.direction)) && e.preventDefault();
          break;
        case r.EVENT_END:
          this.triggered && n.trigger(this.name + 'end', e), this.triggered = !1;
        }
    }
  }, r.gestures.Transform = {
    name: 'transform',
    index: 45,
    defaults: {
      transform_min_scale: 0.01,
      transform_min_rotation: 1,
      transform_always_block: !1
    },
    triggered: !1,
    handler: function (e, n) {
      if (r.detection.current.name != this.name && this.triggered)
        return n.trigger(this.name + 'end', e), this.triggered = !1, t;
      if (!(2 > e.touches.length))
        switch (n.options.transform_always_block && e.preventDefault(), e.eventType) {
        case r.EVENT_START:
          this.triggered = !1;
          break;
        case r.EVENT_MOVE:
          var i = Math.abs(1 - e.scale), o = Math.abs(e.rotation);
          if (n.options.transform_min_scale > i && n.options.transform_min_rotation > o)
            return;
          r.detection.current.name = this.name, this.triggered || (n.trigger(this.name + 'start', e), this.triggered = !0), n.trigger(this.name, e), o > n.options.transform_min_rotation && n.trigger('rotate', e), i > n.options.transform_min_scale && (n.trigger('pinch', e), n.trigger('pinch' + (1 > e.scale ? 'in' : 'out'), e));
          break;
        case r.EVENT_END:
          this.triggered && n.trigger(this.name + 'end', e), this.triggered = !1;
        }
    }
  }, r.gestures.Touch = {
    name: 'touch',
    index: -1 / 0,
    defaults: {
      prevent_default: !1,
      prevent_mouseevents: !1
    },
    handler: function (e, n) {
      return n.options.prevent_mouseevents && e.pointerType == r.POINTER_MOUSE ? (e.stopDetect(), t) : (n.options.prevent_default && e.preventDefault(), e.eventType == r.EVENT_START && n.trigger(this.name, e), t);
    }
  }, r.gestures.Release = {
    name: 'release',
    index: 1 / 0,
    handler: function (e, t) {
      e.eventType == r.EVENT_END && t.trigger(this.name, e);
    }
  }, 'object' == typeof module && 'object' == typeof module.exports ? module.exports = r : (e.Hammer = r, 'function' == typeof e.define && e.define.amd && e.define('hammer', [], function () {
    return r;
  }));
}(this), function (e, t) {
  'use strict';
  e !== t && (Hammer.event.bindDom = function (n, r, i) {
    e(n).on(r, function (e) {
      var n = e.originalEvent || e;
      n.pageX === t && (n.pageX = e.pageX, n.pageY = e.pageY), n.target || (n.target = e.target), n.which === t && (n.which = n.button), n.preventDefault || (n.preventDefault = e.preventDefault), n.stopPropagation || (n.stopPropagation = e.stopPropagation), i.call(this, n);
    });
  }, Hammer.Instance.prototype.on = function (t, n) {
    return e(this.element).on(t, n);
  }, Hammer.Instance.prototype.off = function (t, n) {
    return e(this.element).off(t, n);
  }, Hammer.Instance.prototype.trigger = function (t, n) {
    var r = e(this.element);
    return r.has(n.target).length && (r = e(n.target)), r.trigger({
      type: t,
      gesture: n
    });
  }, e.fn.hammer = function (t) {
    return this.each(function () {
      var n = e(this), r = n.data('hammer');
      r ? r && t && Hammer.utils.extend(r.options, t) : n.data('hammer', new Hammer(this, t || {}));
    });
  });
}(window.jQuery || window.Zepto), function (e) {
  'function' == typeof define && define.amd ? define(['jquery'], e) : e(jQuery);
}(function (e) {
  function t(t) {
    return e.isFunction(t) || 'object' == typeof t ? t : {
      top: t,
      left: t
    };
  }
  var n = e.scrollTo = function (t, n, r) {
      return e(window).scrollTo(t, n, r);
    };
  return n.defaults = {
    axis: 'xy',
    duration: parseFloat(e.fn.jquery) >= 1.3 ? 0 : 1,
    limit: !0
  }, n.window = function () {
    return e(window)._scrollable();
  }, e.fn._scrollable = function () {
    return this.map(function () {
      var t = this, n = !t.nodeName || -1 != e.inArray(t.nodeName.toLowerCase(), [
          'iframe',
          '#document',
          'html',
          'body'
        ]);
      if (!n)
        return t;
      var r = (t.contentWindow || t).document || t.ownerDocument || t;
      return /webkit/i.test(navigator.userAgent) || 'BackCompat' == r.compatMode ? r.body : r.documentElement;
    });
  }, e.fn.scrollTo = function (r, i, o) {
    return 'object' == typeof i && (o = i, i = 0), 'function' == typeof o && (o = { onAfter: o }), 'max' == r && (r = 9000000000), o = e.extend({}, n.defaults, o), i = i || o.duration, o.queue = o.queue && o.axis.length > 1, o.queue && (i /= 2), o.offset = t(o.offset), o.over = t(o.over), this._scrollable().each(function () {
      function a(e) {
        l.animate(d, i, o.easing, e && function () {
          e.call(this, c, o);
        });
      }
      if (null != r) {
        var s, u = this, l = e(u), c = r, d = {}, f = l.is('html,body');
        switch (typeof c) {
        case 'number':
        case 'string':
          if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(c)) {
            c = t(c);
            break;
          }
          if (c = e(c, this), !c.length)
            return;
        case 'object':
          (c.is || c.style) && (s = (c = e(c)).offset());
        }
        var p = e.isFunction(o.offset) && o.offset(u, c) || o.offset;
        e.each(o.axis.split(''), function (e, t) {
          var r = 'x' == t ? 'Left' : 'Top', i = r.toLowerCase(), h = 'scroll' + r, g = u[h], m = n.max(u, t);
          if (s)
            d[h] = s[i] + (f ? 0 : g - l.offset()[i]), o.margin && (d[h] -= parseInt(c.css('margin' + r)) || 0, d[h] -= parseInt(c.css('border' + r + 'Width')) || 0), d[h] += p[i] || 0, o.over[i] && (d[h] += c['x' == t ? 'width' : 'height']() * o.over[i]);
          else {
            var v = c[i];
            d[h] = v.slice && '%' == v.slice(-1) ? parseFloat(v) / 100 * m : v;
          }
          o.limit && /^\d+$/.test(d[h]) && (d[h] = d[h] <= 0 ? 0 : Math.min(d[h], m)), !e && o.queue && (g != d[h] && a(o.onAfterFirst), delete d[h]);
        }), a(o.onAfter);
      }
    }).end();
  }, n.max = function (t, n) {
    var r = 'x' == n ? 'Width' : 'Height', i = 'scroll' + r;
    if (!e(t).is('html,body'))
      return t[i] - e(t)[r.toLowerCase()]();
    var o = 'client' + r, a = t.ownerDocument.documentElement, s = t.ownerDocument.body;
    return Math.max(a[i], s[i]) - Math.min(a[o], s[o]);
  }, n;
}), function (e, t, n) {
  'use strict';
  function r(e) {
    return function () {
      var t, n, r = arguments[0], i = '[' + (e ? e + ':' : '') + r + '] ', o = arguments[1], a = arguments, s = function (e) {
          return 'function' == typeof e ? e.toString().replace(/ \{[\s\S]*$/, '') : 'undefined' == typeof e ? 'undefined' : 'string' != typeof e ? JSON.stringify(e) : e;
        };
      for (t = i + o.replace(/\{\d+\}/g, function (e) {
          var t, n = +e.slice(1, -1);
          return n + 2 < a.length ? (t = a[n + 2], 'function' == typeof t ? t.toString().replace(/ ?\{[\s\S]*$/, '') : 'undefined' == typeof t ? 'undefined' : 'string' != typeof t ? V(t) : t) : e;
        }), t = t + '\nhttp://errors.angularjs.org/1.2.12/' + (e ? e + '/' : '') + r, n = 2; n < arguments.length; n++)
        t = t + (2 == n ? '?' : '&') + 'p' + (n - 2) + '=' + encodeURIComponent(s(arguments[n]));
      return new Error(t);
    };
  }
  function i(e) {
    if (null == e || S(e))
      return !1;
    var t = e.length;
    return 1 === e.nodeType && t ? !0 : b(e) || k(e) || 0 === t || 'number' == typeof t && t > 0 && t - 1 in e;
  }
  function o(e, t, n) {
    var r;
    if (e)
      if (_(e))
        for (r in e)
          'prototype' == r || 'length' == r || 'name' == r || e.hasOwnProperty && !e.hasOwnProperty(r) || t.call(n, e[r], r);
      else if (e.forEach && e.forEach !== o)
        e.forEach(t, n);
      else if (i(e))
        for (r = 0; r < e.length; r++)
          t.call(n, e[r], r);
      else
        for (r in e)
          e.hasOwnProperty(r) && t.call(n, e[r], r);
    return e;
  }
  function a(e) {
    var t = [];
    for (var n in e)
      e.hasOwnProperty(n) && t.push(n);
    return t.sort();
  }
  function s(e, t, n) {
    for (var r = a(e), i = 0; i < r.length; i++)
      t.call(n, e[r[i]], r[i]);
    return r;
  }
  function u(e) {
    return function (t, n) {
      e(n, t);
    };
  }
  function l() {
    for (var e, t = br.length; t;) {
      if (t--, e = br[t].charCodeAt(0), 57 == e)
        return br[t] = 'A', br.join('');
      if (90 != e)
        return br[t] = String.fromCharCode(e + 1), br.join('');
      br[t] = '0';
    }
    return br.unshift('0'), br.join('');
  }
  function c(e, t) {
    t ? e.$$hashKey = t : delete e.$$hashKey;
  }
  function d(e) {
    var t = e.$$hashKey;
    return o(arguments, function (t) {
      t !== e && o(t, function (t, n) {
        e[n] = t;
      });
    }), c(e, t), e;
  }
  function f(e) {
    return parseInt(e, 10);
  }
  function p(e, t) {
    return d(new (d(function () {
    }, { prototype: e }))(), t);
  }
  function h() {
  }
  function g(e) {
    return e;
  }
  function m(e) {
    return function () {
      return e;
    };
  }
  function v(e) {
    return 'undefined' == typeof e;
  }
  function y(e) {
    return 'undefined' != typeof e;
  }
  function w(e) {
    return null != e && 'object' == typeof e;
  }
  function b(e) {
    return 'string' == typeof e;
  }
  function $(e) {
    return 'number' == typeof e;
  }
  function x(e) {
    return '[object Date]' === vr.call(e);
  }
  function k(e) {
    return '[object Array]' === vr.call(e);
  }
  function _(e) {
    return 'function' == typeof e;
  }
  function T(e) {
    return '[object RegExp]' === vr.call(e);
  }
  function S(e) {
    return e && e.document && e.location && e.alert && e.setInterval;
  }
  function C(e) {
    return e && e.$evalAsync && e.$watch;
  }
  function E(e) {
    return '[object File]' === vr.call(e);
  }
  function D(e) {
    return !(!e || !(e.nodeName || e.on && e.find));
  }
  function M(e, t, n) {
    var r = [];
    return o(e, function (e, i, o) {
      r.push(t.call(n, e, i, o));
    }), r;
  }
  function P(e, t) {
    return -1 != A(e, t);
  }
  function A(e, t) {
    if (e.indexOf)
      return e.indexOf(t);
    for (var n = 0; n < e.length; n++)
      if (t === e[n])
        return n;
    return -1;
  }
  function O(e, t) {
    var n = A(e, t);
    return n >= 0 && e.splice(n, 1), t;
  }
  function N(e, t) {
    if (S(e) || C(e))
      throw yr('cpws', 'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    if (t) {
      if (e === t)
        throw yr('cpi', 'Can\'t copy! Source and destination are identical.');
      if (k(e)) {
        t.length = 0;
        for (var n = 0; n < e.length; n++)
          t.push(N(e[n]));
      } else {
        var r = t.$$hashKey;
        o(t, function (e, n) {
          delete t[n];
        });
        for (var i in e)
          t[i] = N(e[i]);
        c(t, r);
      }
    } else
      t = e, e && (k(e) ? t = N(e, []) : x(e) ? t = new Date(e.getTime()) : T(e) ? t = new RegExp(e.source) : w(e) && (t = N(e, {})));
    return t;
  }
  function j(e, t) {
    t = t || {};
    for (var n in e)
      !e.hasOwnProperty(n) || '$' === n.charAt(0) && '$' === n.charAt(1) || (t[n] = e[n]);
    return t;
  }
  function L(e, t) {
    if (e === t)
      return !0;
    if (null === e || null === t)
      return !1;
    if (e !== e && t !== t)
      return !0;
    var r, i, o, a = typeof e, s = typeof t;
    if (a == s && 'object' == a) {
      if (!k(e)) {
        if (x(e))
          return x(t) && e.getTime() == t.getTime();
        if (T(e) && T(t))
          return e.toString() == t.toString();
        if (C(e) || C(t) || S(e) || S(t) || k(t))
          return !1;
        o = {};
        for (i in e)
          if ('$' !== i.charAt(0) && !_(e[i])) {
            if (!L(e[i], t[i]))
              return !1;
            o[i] = !0;
          }
        for (i in t)
          if (!o.hasOwnProperty(i) && '$' !== i.charAt(0) && t[i] !== n && !_(t[i]))
            return !1;
        return !0;
      }
      if (!k(t))
        return !1;
      if ((r = e.length) == t.length) {
        for (i = 0; r > i; i++)
          if (!L(e[i], t[i]))
            return !1;
        return !0;
      }
    }
    return !1;
  }
  function R() {
    return t.securityPolicy && t.securityPolicy.isActive || t.querySelector && !(!t.querySelector('[ng-csp]') && !t.querySelector('[data-ng-csp]'));
  }
  function I(e, t, n) {
    return e.concat(gr.call(t, n));
  }
  function F(e, t) {
    return gr.call(e, t || 0);
  }
  function H(e, t) {
    var n = arguments.length > 2 ? F(arguments, 2) : [];
    return !_(t) || t instanceof RegExp ? t : n.length ? function () {
      return arguments.length ? t.apply(e, n.concat(gr.call(arguments, 0))) : t.apply(e, n);
    } : function () {
      return arguments.length ? t.apply(e, arguments) : t.call(e);
    };
  }
  function q(e, r) {
    var i = r;
    return 'string' == typeof e && '$' === e.charAt(0) ? i = n : S(r) ? i = '$WINDOW' : r && t === r ? i = '$DOCUMENT' : C(r) && (i = '$SCOPE'), i;
  }
  function V(e, t) {
    return 'undefined' == typeof e ? n : JSON.stringify(e, q, t ? '  ' : null);
  }
  function U(e) {
    return b(e) ? JSON.parse(e) : e;
  }
  function W(e) {
    if ('function' == typeof e)
      e = !0;
    else if (e && 0 !== e.length) {
      var t = ar('' + e);
      e = !('f' == t || '0' == t || 'false' == t || 'no' == t || 'n' == t || '[]' == t);
    } else
      e = !1;
    return e;
  }
  function B(e) {
    e = dr(e).clone();
    try {
      e.empty();
    } catch (t) {
    }
    var n = 3, r = dr('<div>').append(e).html();
    try {
      return e[0].nodeType === n ? ar(r) : r.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (e, t) {
        return '<' + ar(t);
      });
    } catch (t) {
      return ar(r);
    }
  }
  function Y(e) {
    try {
      return decodeURIComponent(e);
    } catch (t) {
    }
  }
  function z(e) {
    var t, n, r = {};
    return o((e || '').split('&'), function (e) {
      if (e && (t = e.split('='), n = Y(t[0]), y(n))) {
        var i = y(t[1]) ? Y(t[1]) : !0;
        r[n] ? k(r[n]) ? r[n].push(i) : r[n] = [
          r[n],
          i
        ] : r[n] = i;
      }
    }), r;
  }
  function G(e) {
    var t = [];
    return o(e, function (e, n) {
      k(e) ? o(e, function (e) {
        t.push(J(n, !0) + (e === !0 ? '' : '=' + J(e, !0)));
      }) : t.push(J(n, !0) + (e === !0 ? '' : '=' + J(e, !0)));
    }), t.length ? t.join('&') : '';
  }
  function X(e) {
    return J(e, !0).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
  }
  function J(e, t) {
    return encodeURIComponent(e).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, t ? '%20' : '+');
  }
  function Z(e, n) {
    function r(e) {
      e && s.push(e);
    }
    var i, a, s = [e], u = [
        'ng:app',
        'ng-app',
        'x-ng-app',
        'data-ng-app'
      ], l = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
    o(u, function (n) {
      u[n] = !0, r(t.getElementById(n)), n = n.replace(':', '\\:'), e.querySelectorAll && (o(e.querySelectorAll('.' + n), r), o(e.querySelectorAll('.' + n + '\\:'), r), o(e.querySelectorAll('[' + n + ']'), r));
    }), o(s, function (e) {
      if (!i) {
        var t = ' ' + e.className + ' ', n = l.exec(t);
        n ? (i = e, a = (n[2] || '').replace(/\s+/g, ',')) : o(e.attributes, function (t) {
          !i && u[t.name] && (i = e, a = t.value);
        });
      }
    }), i && n(i, a ? [a] : []);
  }
  function K(n, r) {
    var i = function () {
        if (n = dr(n), n.injector()) {
          var e = n[0] === t ? 'document' : B(n);
          throw yr('btstrpd', 'App Already Bootstrapped with this Element \'{0}\'', e);
        }
        r = r || [], r.unshift([
          '$provide',
          function (e) {
            e.value('$rootElement', n);
          }
        ]), r.unshift('ng');
        var i = Mt(r);
        return i.invoke([
          '$rootScope',
          '$rootElement',
          '$compile',
          '$injector',
          '$animate',
          function (e, t, n, r) {
            e.$apply(function () {
              t.data('$injector', r), n(t)(e);
            });
          }
        ]), i;
      }, a = /^NG_DEFER_BOOTSTRAP!/;
    return e && !a.test(e.name) ? i() : (e.name = e.name.replace(a, ''), wr.resumeBootstrap = function (e) {
      o(e, function (e) {
        r.push(e);
      }), i();
    }, void 0);
  }
  function Q(e, t) {
    return t = t || '_', e.replace(xr, function (e, n) {
      return (n ? t : '') + e.toLowerCase();
    });
  }
  function et() {
    fr = e.jQuery, fr ? (dr = fr, d(fr.fn, {
      scope: Ar.scope,
      isolateScope: Ar.isolateScope,
      controller: Ar.controller,
      injector: Ar.injector,
      inheritedData: Ar.inheritedData
    }), ct('remove', !0, !0, !1), ct('empty', !1, !1, !1), ct('html', !1, !1, !0)) : dr = dt, wr.element = dr;
  }
  function tt(e, t, n) {
    if (!e)
      throw yr('areq', 'Argument \'{0}\' is {1}', t || '?', n || 'required');
    return e;
  }
  function nt(e, t, n) {
    return n && k(e) && (e = e[e.length - 1]), tt(_(e), t, 'not a function, got ' + (e && 'object' == typeof e ? e.constructor.name || 'Object' : typeof e)), e;
  }
  function rt(e, t) {
    if ('hasOwnProperty' === e)
      throw yr('badname', 'hasOwnProperty is not a valid {0} name', t);
  }
  function it(e, t, n) {
    if (!t)
      return e;
    for (var r, i = t.split('.'), o = e, a = i.length, s = 0; a > s; s++)
      r = i[s], e && (e = (o = e)[r]);
    return !n && _(e) ? H(o, e) : e;
  }
  function ot(e) {
    var t = e[0], n = e[e.length - 1];
    if (t === n)
      return dr(t);
    var r = t, i = [r];
    do {
      if (r = r.nextSibling, !r)
        break;
      i.push(r);
    } while (r !== n);
    return dr(i);
  }
  function at(e) {
    function t(e, t, n) {
      return e[t] || (e[t] = n());
    }
    var n = r('$injector'), i = r('ng'), o = t(e, 'angular', Object);
    return o.$$minErr = o.$$minErr || r, t(o, 'module', function () {
      var e = {};
      return function (r, o, a) {
        var s = function (e, t) {
          if ('hasOwnProperty' === e)
            throw i('badname', 'hasOwnProperty is not a valid {0} name', t);
        };
        return s(r, 'module'), o && e.hasOwnProperty(r) && (e[r] = null), t(e, r, function () {
          function e(e, n, r) {
            return function () {
              return t[r || 'push']([
                e,
                n,
                arguments
              ]), u;
            };
          }
          if (!o)
            throw n('nomod', 'Module \'{0}\' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.', r);
          var t = [], i = [], s = e('$injector', 'invoke'), u = {
              _invokeQueue: t,
              _runBlocks: i,
              requires: o,
              name: r,
              provider: e('$provide', 'provider'),
              factory: e('$provide', 'factory'),
              service: e('$provide', 'service'),
              value: e('$provide', 'value'),
              constant: e('$provide', 'constant', 'unshift'),
              animation: e('$animateProvider', 'register'),
              filter: e('$filterProvider', 'register'),
              controller: e('$controllerProvider', 'register'),
              directive: e('$compileProvider', 'directive'),
              config: s,
              run: function (e) {
                return i.push(e), this;
              }
            };
          return a && s(a), u;
        });
      };
    });
  }
  function st(t) {
    d(t, {
      bootstrap: K,
      copy: N,
      extend: d,
      equals: L,
      element: dr,
      forEach: o,
      injector: Mt,
      noop: h,
      bind: H,
      toJson: V,
      fromJson: U,
      identity: g,
      isUndefined: v,
      isDefined: y,
      isString: b,
      isFunction: _,
      isObject: w,
      isNumber: $,
      isElement: D,
      isArray: k,
      version: kr,
      isDate: x,
      lowercase: ar,
      uppercase: sr,
      callbacks: { counter: 0 },
      $$minErr: r,
      $$csp: R
    }), pr = at(e);
    try {
      pr('ngLocale');
    } catch (n) {
      pr('ngLocale', []).provider('$locale', Kt);
    }
    pr('ng', ['ngLocale'], [
      '$provide',
      function (e) {
        e.provider({ $$sanitizeUri: Tn }), e.provider('$compile', Lt).directive({
          a: fi,
          input: xi,
          textarea: xi,
          form: mi,
          script: ro,
          select: ao,
          style: uo,
          option: so,
          ngBind: Ni,
          ngBindHtml: Li,
          ngBindTemplate: ji,
          ngClass: Ri,
          ngClassEven: Fi,
          ngClassOdd: Ii,
          ngCloak: Hi,
          ngController: qi,
          ngForm: vi,
          ngHide: Zi,
          ngIf: Ui,
          ngInclude: Wi,
          ngInit: Yi,
          ngNonBindable: zi,
          ngPluralize: Gi,
          ngRepeat: Xi,
          ngShow: Ji,
          ngStyle: Ki,
          ngSwitch: Qi,
          ngSwitchWhen: eo,
          ngSwitchDefault: to,
          ngOptions: oo,
          ngTransclude: no,
          ngModel: Ei,
          ngList: Pi,
          ngChange: Di,
          required: Mi,
          ngRequired: Mi,
          ngValue: Oi
        }).directive({ ngInclude: Bi }).directive(pi).directive(Vi), e.provider({
          $anchorScroll: Pt,
          $animate: qr,
          $browser: Ot,
          $cacheFactory: Nt,
          $controller: Ft,
          $document: Ht,
          $exceptionHandler: qt,
          $filter: Ln,
          $interpolate: Jt,
          $interval: Zt,
          $http: Yt,
          $httpBackend: Gt,
          $location: fn,
          $log: pn,
          $parse: $n,
          $rootScope: _n,
          $q: xn,
          $sce: Mn,
          $sceDelegate: Dn,
          $sniffer: Pn,
          $templateCache: jt,
          $timeout: An,
          $window: jn
        });
      }
    ]);
  }
  function ut() {
    return ++Sr;
  }
  function lt(e) {
    return e.replace(Dr, function (e, t, n, r) {
      return r ? n.toUpperCase() : n;
    }).replace(Mr, 'Moz$1');
  }
  function ct(e, t, n, r) {
    function i(e) {
      var i, a, s, u, l, c, d, f = n && e ? [this.filter(e)] : [this], p = t;
      if (!r || null != e)
        for (; f.length;)
          for (i = f.shift(), a = 0, s = i.length; s > a; a++)
            for (u = dr(i[a]), p ? u.triggerHandler('$destroy') : p = !p, l = 0, c = (d = u.children()).length; c > l; l++)
              f.push(fr(d[l]));
      return o.apply(this, arguments);
    }
    var o = fr.fn[e];
    o = o.$original || o, i.$original = o, fr.fn[e] = i;
  }
  function dt(e) {
    if (e instanceof dt)
      return e;
    if (b(e) && (e = $r(e)), !(this instanceof dt)) {
      if (b(e) && '<' != e.charAt(0))
        throw Pr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
      return new dt(e);
    }
    if (b(e)) {
      var n = t.createElement('div');
      n.innerHTML = '<div>&#160;</div>' + e, n.removeChild(n.firstChild), $t(this, n.childNodes);
      var r = dr(t.createDocumentFragment());
      r.append(this);
    } else
      $t(this, e);
  }
  function ft(e) {
    return e.cloneNode(!0);
  }
  function pt(e) {
    gt(e);
    for (var t = 0, n = e.childNodes || []; t < n.length; t++)
      pt(n[t]);
  }
  function ht(e, t, n, r) {
    if (y(r))
      throw Pr('offargs', 'jqLite#off() does not support the `selector` argument');
    var i = mt(e, 'events'), a = mt(e, 'handle');
    a && (v(t) ? o(i, function (t, n) {
      Er(e, n, t), delete i[n];
    }) : o(t.split(' '), function (t) {
      v(n) ? (Er(e, t, i[t]), delete i[t]) : O(i[t] || [], n);
    }));
  }
  function gt(e, t) {
    var r = e[Tr], i = _r[r];
    if (i) {
      if (t)
        return delete _r[r].data[t], void 0;
      i.handle && (i.events.$destroy && i.handle({}, '$destroy'), ht(e)), delete _r[r], e[Tr] = n;
    }
  }
  function mt(e, t, n) {
    var r = e[Tr], i = _r[r || -1];
    return y(n) ? (i || (e[Tr] = r = ut(), i = _r[r] = {}), i[t] = n, void 0) : i && i[t];
  }
  function vt(e, t, n) {
    var r = mt(e, 'data'), i = y(n), o = !i && y(t), a = o && !w(t);
    if (r || a || mt(e, 'data', r = {}), i)
      r[t] = n;
    else {
      if (!o)
        return r;
      if (a)
        return r && r[t];
      d(r, t);
    }
  }
  function yt(e, t) {
    return e.getAttribute ? (' ' + (e.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + t + ' ') > -1 : !1;
  }
  function wt(e, t) {
    t && e.setAttribute && o(t.split(' '), function (t) {
      e.setAttribute('class', $r((' ' + (e.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + $r(t) + ' ', ' ')));
    });
  }
  function bt(e, t) {
    if (t && e.setAttribute) {
      var n = (' ' + (e.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
      o(t.split(' '), function (e) {
        e = $r(e), -1 === n.indexOf(' ' + e + ' ') && (n += e + ' ');
      }), e.setAttribute('class', $r(n));
    }
  }
  function $t(e, t) {
    if (t) {
      t = t.nodeName || !y(t.length) || S(t) ? [t] : t;
      for (var n = 0; n < t.length; n++)
        e.push(t[n]);
    }
  }
  function xt(e, t) {
    return kt(e, '$' + (t || 'ngController') + 'Controller');
  }
  function kt(e, t, r) {
    e = dr(e), 9 == e[0].nodeType && (e = e.find('html'));
    for (var i = k(t) ? t : [t]; e.length;) {
      for (var o = 0, a = i.length; a > o; o++)
        if ((r = e.data(i[o])) !== n)
          return r;
      e = e.parent();
    }
  }
  function _t(e) {
    for (var t = 0, n = e.childNodes; t < n.length; t++)
      pt(n[t]);
    for (; e.firstChild;)
      e.removeChild(e.firstChild);
  }
  function Tt(e, t) {
    var n = Or[t.toLowerCase()];
    return n && Nr[e.nodeName] && n;
  }
  function St(e, n) {
    var r = function (r, i) {
      if (r.preventDefault || (r.preventDefault = function () {
          r.returnValue = !1;
        }), r.stopPropagation || (r.stopPropagation = function () {
          r.cancelBubble = !0;
        }), r.target || (r.target = r.srcElement || t), v(r.defaultPrevented)) {
        var a = r.preventDefault;
        r.preventDefault = function () {
          r.defaultPrevented = !0, a.call(r);
        }, r.defaultPrevented = !1;
      }
      r.isDefaultPrevented = function () {
        return r.defaultPrevented || r.returnValue === !1;
      };
      var s = j(n[i || r.type] || []);
      o(s, function (t) {
        t.call(e, r);
      }), 8 >= cr ? (r.preventDefault = null, r.stopPropagation = null, r.isDefaultPrevented = null) : (delete r.preventDefault, delete r.stopPropagation, delete r.isDefaultPrevented);
    };
    return r.elem = e, r;
  }
  function Ct(e) {
    var t, r = typeof e;
    return 'object' == r && null !== e ? 'function' == typeof (t = e.$$hashKey) ? t = e.$$hashKey() : t === n && (t = e.$$hashKey = l()) : t = e, r + ':' + t;
  }
  function Et(e) {
    o(e, this.put, this);
  }
  function Dt(e) {
    var t, n, r, i;
    return 'function' == typeof e ? (t = e.$inject) || (t = [], e.length && (n = e.toString().replace(Ir, ''), r = n.match(jr), o(r[1].split(Lr), function (e) {
      e.replace(Rr, function (e, n, r) {
        t.push(r);
      });
    })), e.$inject = t) : k(e) ? (i = e.length - 1, nt(e[i], 'fn'), t = e.slice(0, i)) : nt(e, 'fn', !0), t;
  }
  function Mt(e) {
    function t(e) {
      return function (t, n) {
        return w(t) ? (o(t, u(e)), void 0) : e(t, n);
      };
    }
    function n(e, t) {
      if (rt(e, 'service'), (_(t) || k(t)) && (t = $.instantiate(t)), !t.$get)
        throw Fr('pget', 'Provider \'{0}\' must define $get factory method.', e);
      return y[e + p] = t;
    }
    function r(e, t) {
      return n(e, { $get: t });
    }
    function i(e, t) {
      return r(e, [
        '$injector',
        function (e) {
          return e.instantiate(t);
        }
      ]);
    }
    function a(e, t) {
      return r(e, m(t));
    }
    function s(e, t) {
      rt(e, 'constant'), y[e] = t, x[e] = t;
    }
    function l(e, t) {
      var n = $.get(e + p), r = n.$get;
      n.$get = function () {
        var e = T.invoke(r, n);
        return T.invoke(t, null, { $delegate: e });
      };
    }
    function c(e) {
      var t, n, r, i, a = [];
      return o(e, function (e) {
        if (!v.get(e)) {
          v.put(e, !0);
          try {
            if (b(e))
              for (t = pr(e), a = a.concat(c(t.requires)).concat(t._runBlocks), n = t._invokeQueue, r = 0, i = n.length; i > r; r++) {
                var o = n[r], s = $.get(o[0]);
                s[o[1]].apply(s, o[2]);
              }
            else
              _(e) ? a.push($.invoke(e)) : k(e) ? a.push($.invoke(e)) : nt(e, 'module');
          } catch (u) {
            throw k(e) && (e = e[e.length - 1]), u.message && u.stack && -1 == u.stack.indexOf(u.message) && (u = u.message + '\n' + u.stack), Fr('modulerr', 'Failed to instantiate module {0} due to:\n{1}', e, u.stack || u.message || u);
          }
        }
      }), a;
    }
    function d(e, t) {
      function n(n) {
        if (e.hasOwnProperty(n)) {
          if (e[n] === f)
            throw Fr('cdep', 'Circular dependency found: {0}', g.join(' <- '));
          return e[n];
        }
        try {
          return g.unshift(n), e[n] = f, e[n] = t(n);
        } catch (r) {
          throw e[n] === f && delete e[n], r;
        } finally {
          g.shift();
        }
      }
      function r(e, t, r) {
        var i, o, a, s = [], u = Dt(e);
        for (o = 0, i = u.length; i > o; o++) {
          if (a = u[o], 'string' != typeof a)
            throw Fr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', a);
          s.push(r && r.hasOwnProperty(a) ? r[a] : n(a));
        }
        return e.$inject || (e = e[i]), e.apply(t, s);
      }
      function i(e, t) {
        var n, i, o = function () {
          };
        return o.prototype = (k(e) ? e[e.length - 1] : e).prototype, n = new o(), i = r(e, n, t), w(i) || _(i) ? i : n;
      }
      return {
        invoke: r,
        instantiate: i,
        get: n,
        annotate: Dt,
        has: function (t) {
          return y.hasOwnProperty(t + p) || e.hasOwnProperty(t);
        }
      };
    }
    var f = {}, p = 'Provider', g = [], v = new Et(), y = {
        $provide: {
          provider: t(n),
          factory: t(r),
          service: t(i),
          value: t(a),
          constant: t(s),
          decorator: l
        }
      }, $ = y.$injector = d(y, function () {
        throw Fr('unpr', 'Unknown provider: {0}', g.join(' <- '));
      }), x = {}, T = x.$injector = d(x, function (e) {
        var t = $.get(e + p);
        return T.invoke(t.$get, t);
      });
    return o(c(e), function (e) {
      T.invoke(e || h);
    }), T;
  }
  function Pt() {
    var e = !0;
    this.disableAutoScrolling = function () {
      e = !1;
    }, this.$get = [
      '$window',
      '$location',
      '$rootScope',
      function (t, n, r) {
        function i(e) {
          var t = null;
          return o(e, function (e) {
            t || 'a' !== ar(e.nodeName) || (t = e);
          }), t;
        }
        function a() {
          var e, r = n.hash();
          r ? (e = s.getElementById(r)) ? e.scrollIntoView() : (e = i(s.getElementsByName(r))) ? e.scrollIntoView() : 'top' === r && t.scrollTo(0, 0) : t.scrollTo(0, 0);
        }
        var s = t.document;
        return e && r.$watch(function () {
          return n.hash();
        }, function () {
          r.$evalAsync(a);
        }), a;
      }
    ];
  }
  function At(e, t, r, i) {
    function a(e) {
      try {
        e.apply(null, F(arguments, 1));
      } finally {
        if (y--, 0 === y)
          for (; w.length;)
            try {
              w.pop()();
            } catch (t) {
              r.error(t);
            }
      }
    }
    function s(e, t) {
      !function n() {
        o(x, function (e) {
          e();
        }), $ = t(n, e);
      }();
    }
    function u() {
      T = null, k != l.url() && (k = l.url(), o(S, function (e) {
        e(l.url());
      }));
    }
    var l = this, c = t[0], d = e.location, f = e.history, p = e.setTimeout, g = e.clearTimeout, m = {};
    l.isMock = !1;
    var y = 0, w = [];
    l.$$completeOutstandingRequest = a, l.$$incOutstandingRequestCount = function () {
      y++;
    }, l.notifyWhenNoOutstandingRequests = function (e) {
      o(x, function (e) {
        e();
      }), 0 === y ? e() : w.push(e);
    };
    var $, x = [];
    l.addPollFn = function (e) {
      return v($) && s(100, p), x.push(e), e;
    };
    var k = d.href, _ = t.find('base'), T = null;
    l.url = function (t, n) {
      if (d !== e.location && (d = e.location), f !== e.history && (f = e.history), t) {
        if (k == t)
          return;
        return k = t, i.history ? n ? f.replaceState(null, '', t) : (f.pushState(null, '', t), _.attr('href', _.attr('href'))) : (T = t, n ? d.replace(t) : d.href = t), l;
      }
      return T || d.href.replace(/%27/g, '\'');
    };
    var S = [], C = !1;
    l.onUrlChange = function (t) {
      return C || (i.history && dr(e).on('popstate', u), i.hashchange ? dr(e).on('hashchange', u) : l.addPollFn(u), C = !0), S.push(t), t;
    }, l.baseHref = function () {
      var e = _.attr('href');
      return e ? e.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    };
    var E = {}, D = '', M = l.baseHref();
    l.cookies = function (e, t) {
      var i, o, a, s, u;
      if (!e) {
        if (c.cookie !== D)
          for (D = c.cookie, o = D.split('; '), E = {}, s = 0; s < o.length; s++)
            a = o[s], u = a.indexOf('='), u > 0 && (e = unescape(a.substring(0, u)), E[e] === n && (E[e] = unescape(a.substring(u + 1))));
        return E;
      }
      t === n ? c.cookie = escape(e) + '=;path=' + M + ';expires=Thu, 01 Jan 1970 00:00:00 GMT' : b(t) && (i = (c.cookie = escape(e) + '=' + escape(t) + ';path=' + M).length + 1, i > 4096 && r.warn('Cookie \'' + e + '\' possibly not set or overflowed because it was too large (' + i + ' > 4096 bytes)!'));
    }, l.defer = function (e, t) {
      var n;
      return y++, n = p(function () {
        delete m[n], a(e);
      }, t || 0), m[n] = !0, n;
    }, l.defer.cancel = function (e) {
      return m[e] ? (delete m[e], g(e), a(h), !0) : !1;
    };
  }
  function Ot() {
    this.$get = [
      '$window',
      '$log',
      '$sniffer',
      '$document',
      function (e, t, n, r) {
        return new At(e, r, t, n);
      }
    ];
  }
  function Nt() {
    this.$get = function () {
      function e(e, n) {
        function i(e) {
          e != f && (p ? p == e && (p = e.n) : p = e, o(e.n, e.p), o(e, f), f = e, f.n = null);
        }
        function o(e, t) {
          e != t && (e && (e.p = t), t && (t.n = e));
        }
        if (e in t)
          throw r('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', e);
        var a = 0, s = d({}, n, { id: e }), u = {}, l = n && n.capacity || Number.MAX_VALUE, c = {}, f = null, p = null;
        return t[e] = {
          put: function (e, t) {
            var n = c[e] || (c[e] = { key: e });
            return i(n), v(t) ? void 0 : (e in u || a++, u[e] = t, a > l && this.remove(p.key), t);
          },
          get: function (e) {
            var t = c[e];
            if (t)
              return i(t), u[e];
          },
          remove: function (e) {
            var t = c[e];
            t && (t == f && (f = t.p), t == p && (p = t.n), o(t.n, t.p), delete c[e], delete u[e], a--);
          },
          removeAll: function () {
            u = {}, a = 0, c = {}, f = p = null;
          },
          destroy: function () {
            u = null, s = null, c = null, delete t[e];
          },
          info: function () {
            return d({}, s, { size: a });
          }
        };
      }
      var t = {};
      return e.info = function () {
        var e = {};
        return o(t, function (t, n) {
          e[n] = t.info();
        }), e;
      }, e.get = function (e) {
        return t[e];
      }, e;
    };
  }
  function jt() {
    this.$get = [
      '$cacheFactory',
      function (e) {
        return e('templates');
      }
    ];
  }
  function Lt(e, r) {
    var i = {}, a = 'Directive', s = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, l = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, c = /^(on[a-z]+|formaction)$/;
    this.directive = function f(t, n) {
      return rt(t, 'directive'), b(t) ? (tt(n, 'directiveFactory'), i.hasOwnProperty(t) || (i[t] = [], e.factory(t + a, [
        '$injector',
        '$exceptionHandler',
        function (e, n) {
          var r = [];
          return o(i[t], function (i, o) {
            try {
              var a = e.invoke(i);
              _(a) ? a = { compile: m(a) } : !a.compile && a.link && (a.compile = m(a.link)), a.priority = a.priority || 0, a.index = o, a.name = a.name || t, a.require = a.require || a.controller && a.name, a.restrict = a.restrict || 'A', r.push(a);
            } catch (s) {
              n(s);
            }
          }), r;
        }
      ])), i[t].push(n)) : o(t, u(f)), this;
    }, this.aHrefSanitizationWhitelist = function (e) {
      return y(e) ? (r.aHrefSanitizationWhitelist(e), this) : r.aHrefSanitizationWhitelist();
    }, this.imgSrcSanitizationWhitelist = function (e) {
      return y(e) ? (r.imgSrcSanitizationWhitelist(e), this) : r.imgSrcSanitizationWhitelist();
    }, this.$get = [
      '$injector',
      '$interpolate',
      '$exceptionHandler',
      '$http',
      '$templateCache',
      '$parse',
      '$controller',
      '$rootScope',
      '$document',
      '$sce',
      '$animate',
      '$$sanitizeUri',
      function (e, r, u, f, h, v, y, $, x, T, S, C) {
        function E(e, t, n, r, i) {
          e instanceof dr || (e = dr(e)), o(e, function (t, n) {
            3 == t.nodeType && t.nodeValue.match(/\S+/) && (e[n] = t = dr(t).wrap('<span></span>').parent()[0]);
          });
          var a = M(e, t, e, n, r, i);
          return D(e, 'ng-scope'), function (t, n, r) {
            tt(t, 'scope');
            var i = n ? Ar.clone.call(e) : e;
            o(r, function (e, t) {
              i.data('$' + t + 'Controller', e);
            });
            for (var s = 0, u = i.length; u > s; s++) {
              var l = i[s], c = l.nodeType;
              (1 === c || 9 === c) && i.eq(s).data('$scope', t);
            }
            return n && n(i, t), a && a(t, i, i), i;
          };
        }
        function D(e, t) {
          try {
            e.addClass(t);
          } catch (n) {
          }
        }
        function M(e, t, r, i, o, a) {
          function s(e, r, i, o) {
            var a, s, u, l, c, d, f, p, g, m = r.length, v = new Array(m);
            for (f = 0; m > f; f++)
              v[f] = r[f];
            for (f = 0, g = 0, p = h.length; p > f; g++)
              u = v[g], a = h[f++], s = h[f++], l = dr(u), a ? (a.scope ? (c = e.$new(), l.data('$scope', c)) : c = e, d = a.transclude, d || !o && t ? a(s, c, u, i, P(e, d || t)) : a(s, c, u, i, o)) : s && s(e, u.childNodes, n, o);
          }
          for (var u, l, c, d, f, p, h = [], g = 0; g < e.length; g++)
            u = new K(), l = A(e[g], [], u, 0 === g ? i : n, o), c = l.length ? R(l, e[g], u, t, r, null, [], [], a) : null, c && c.scope && D(dr(e[g]), 'ng-scope'), f = c && c.terminal || !(d = e[g].childNodes) || !d.length ? null : M(d, c ? c.transclude : t), h.push(c, f), p = p || c || f, a = null;
          return p ? s : null;
        }
        function P(e, t) {
          return function (n, r, i) {
            var o = !1;
            n || (n = e.$new(), n.$$transcluded = !0, o = !0);
            var a = t(n, r, i);
            return o && a.on('$destroy', H(n, n.$destroy)), a;
          };
        }
        function A(e, t, n, r, i) {
          var o, a, u = e.nodeType, c = n.$attr;
          switch (u) {
          case 1:
            q(t, Rt(hr(e).toLowerCase()), 'E', r, i);
            for (var d, f, p, h, g, m = e.attributes, v = 0, y = m && m.length; y > v; v++) {
              var w = !1, $ = !1;
              if (d = m[v], !cr || cr >= 8 || d.specified) {
                f = d.name, h = Rt(f), it.test(h) && (f = Q(h.substr(6), '-'));
                var x = h.replace(/(Start|End)$/, '');
                h === x + 'Start' && (w = f, $ = f.substr(0, f.length - 5) + 'end', f = f.substr(0, f.length - 6)), p = Rt(f.toLowerCase()), c[p] = f, n[p] = g = $r(d.value), Tt(e, p) && (n[p] = !0), X(e, t, g, p), q(t, p, 'A', r, i, w, $);
              }
            }
            if (a = e.className, b(a) && '' !== a)
              for (; o = l.exec(a);)
                p = Rt(o[2]), q(t, p, 'C', r, i) && (n[p] = $r(o[3])), a = a.substr(o.index + o[0].length);
            break;
          case 3:
            z(t, e.nodeValue);
            break;
          case 8:
            try {
              o = s.exec(e.nodeValue), o && (p = Rt(o[1]), q(t, p, 'M', r, i) && (n[p] = $r(o[2])));
            } catch (k) {
            }
          }
          return t.sort(W), t;
        }
        function O(e, t, n) {
          var r = [], i = 0;
          if (t && e.hasAttribute && e.hasAttribute(t)) {
            do {
              if (!e)
                throw Vr('uterdir', 'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.', t, n);
              1 == e.nodeType && (e.hasAttribute(t) && i++, e.hasAttribute(n) && i--), r.push(e), e = e.nextSibling;
            } while (i > 0);
          } else
            r.push(e);
          return dr(r);
        }
        function N(e, t, n) {
          return function (r, i, o, a, s) {
            return i = O(i[0], t, n), e(r, i, o, a, s);
          };
        }
        function R(e, i, a, s, l, c, d, f, p) {
          function h(e, t, n, r) {
            e && (n && (e = N(e, n, r)), e.require = x.require, (H === x || x.$$isolateScope) && (e = Z(e, { isolateScope: !0 })), d.push(e)), t && (n && (t = N(t, n, r)), t.require = x.require, (H === x || x.$$isolateScope) && (t = Z(t, { isolateScope: !0 })), f.push(t));
          }
          function g(e, t, n) {
            var r, i = 'data', a = !1;
            if (b(e)) {
              for (; '^' == (r = e.charAt(0)) || '?' == r;)
                e = e.substr(1), '^' == r && (i = 'inheritedData'), a = a || '?' == r;
              if (r = null, n && 'data' === i && (r = n[e]), r = r || t[i]('$' + e + 'Controller'), !r && !a)
                throw Vr('ctreq', 'Controller \'{0}\', required by directive \'{1}\', can\'t be found!', e, T);
              return r;
            }
            return k(e) && (r = [], o(e, function (e) {
              r.push(g(e, t, n));
            })), r;
          }
          function m(e, t, s, l, c) {
            function p(e, t) {
              var r;
              return arguments.length < 2 && (t = e, e = n), G && (r = T), c(e, t, r);
            }
            var h, m, w, b, $, x, k, _, T = {};
            if (h = i === s ? a : j(a, new K(dr(s), a.$attr)), m = h.$$element, H) {
              var S = /^\s*([@=&])(\??)\s*(\w*)\s*$/, C = dr(s);
              k = t.$new(!0), q && q === H.$$originalDirective ? C.data('$isolateScope', k) : C.data('$isolateScopeNoTemplate', k), D(C, 'ng-isolate-scope'), o(H.scope, function (e, n) {
                var i, o, a, s, u = e.match(S) || [], l = u[3] || n, c = '?' == u[2], d = u[1];
                switch (k.$$isolateBindings[n] = d + l, d) {
                case '@':
                  h.$observe(l, function (e) {
                    k[n] = e;
                  }), h.$$observers[l].$$scope = t, h[l] && (k[n] = r(h[l])(t));
                  break;
                case '=':
                  if (c && !h[l])
                    return;
                  o = v(h[l]), s = o.literal ? L : function (e, t) {
                    return e === t;
                  }, a = o.assign || function () {
                    throw i = k[n] = o(t), Vr('nonassign', 'Expression \'{0}\' used with directive \'{1}\' is non-assignable!', h[l], H.name);
                  }, i = k[n] = o(t), k.$watch(function () {
                    var e = o(t);
                    return s(e, k[n]) || (s(e, i) ? a(t, e = k[n]) : k[n] = e), i = e;
                  }, null, o.literal);
                  break;
                case '&':
                  o = v(h[l]), k[n] = function (e) {
                    return o(t, e);
                  };
                  break;
                default:
                  throw Vr('iscp', 'Invalid isolate scope definition for directive \'{0}\'. Definition: {... {1}: \'{2}\' ...}', H.name, n, e);
                }
              });
            }
            for (_ = c && p, R && o(R, function (e) {
                var n, r = {
                    $scope: e === H || e.$$isolateScope ? k : t,
                    $element: m,
                    $attrs: h,
                    $transclude: _
                  };
                x = e.controller, '@' == x && (x = h[e.name]), n = y(x, r), T[e.name] = n, G || m.data('$' + e.name + 'Controller', n), e.controllerAs && (r.$scope[e.controllerAs] = n);
              }), w = 0, b = d.length; b > w; w++)
              try {
                $ = d[w], $($.isolateScope ? k : t, m, h, $.require && g($.require, m, T), _);
              } catch (E) {
                u(E, B(m));
              }
            var M = t;
            for (H && (H.template || null === H.templateUrl) && (M = k), e && e(M, s.childNodes, n, c), w = f.length - 1; w >= 0; w--)
              try {
                $ = f[w], $($.isolateScope ? k : t, m, h, $.require && g($.require, m, T), _);
              } catch (E) {
                u(E, B(m));
              }
          }
          p = p || {};
          for (var $, x, T, S, C, M, P = -Number.MAX_VALUE, R = p.controllerDirectives, H = p.newIsolateScopeDirective, q = p.templateDirective, W = p.nonTlbTranscludeDirective, z = !1, G = !1, X = a.$$element = dr(i), Q = c, et = s, tt = 0, nt = e.length; nt > tt; tt++) {
            x = e[tt];
            var it = x.$$start, ot = x.$$end;
            if (it && (X = O(i, it, ot)), S = n, P > x.priority)
              break;
            if ((M = x.scope) && ($ = $ || x, x.templateUrl || (Y('new/isolated scope', H, x, X), w(M) && (H = x))), T = x.name, !x.templateUrl && x.controller && (M = x.controller, R = R || {}, Y('\'' + T + '\' controller', R[T], x, X), R[T] = x), (M = x.transclude) && (z = !0, x.$$tlb || (Y('transclusion', W, x, X), W = x), 'element' == M ? (G = !0, P = x.priority, S = O(i, it, ot), X = a.$$element = dr(t.createComment(' ' + T + ': ' + a[T] + ' ')), i = X[0], J(l, dr(F(S)), i), et = E(S, s, P, Q && Q.name, { nonTlbTranscludeDirective: W })) : (S = dr(ft(i)).contents(), X.empty(), et = E(S, s))), x.template)
              if (Y('template', q, x, X), q = x, M = _(x.template) ? x.template(X, a) : x.template, M = rt(M), x.replace) {
                if (Q = x, S = dr('<div>' + $r(M) + '</div>').contents(), i = S[0], 1 != S.length || 1 !== i.nodeType)
                  throw Vr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', T, '');
                J(l, X, i);
                var at = { $attr: {} }, st = A(i, [], at), ut = e.splice(tt + 1, e.length - (tt + 1));
                H && I(st), e = e.concat(st).concat(ut), V(a, at), nt = e.length;
              } else
                X.html(M);
            if (x.templateUrl)
              Y('template', q, x, X), q = x, x.replace && (Q = x), m = U(e.splice(tt, e.length - tt), X, a, l, et, d, f, {
                controllerDirectives: R,
                newIsolateScopeDirective: H,
                templateDirective: q,
                nonTlbTranscludeDirective: W
              }), nt = e.length;
            else if (x.compile)
              try {
                C = x.compile(X, a, et), _(C) ? h(null, C, it, ot) : C && h(C.pre, C.post, it, ot);
              } catch (lt) {
                u(lt, B(X));
              }
            x.terminal && (m.terminal = !0, P = Math.max(P, x.priority));
          }
          return m.scope = $ && $.scope === !0, m.transclude = z && et, m;
        }
        function I(e) {
          for (var t = 0, n = e.length; n > t; t++)
            e[t] = p(e[t], { $$isolateScope: !0 });
        }
        function q(t, r, o, s, l, c, d) {
          if (r === l)
            return null;
          var f = null;
          if (i.hasOwnProperty(r))
            for (var h, g = e.get(r + a), m = 0, v = g.length; v > m; m++)
              try {
                h = g[m], (s === n || s > h.priority) && -1 != h.restrict.indexOf(o) && (c && (h = p(h, {
                  $$start: c,
                  $$end: d
                })), t.push(h), f = h);
              } catch (y) {
                u(y);
              }
          return f;
        }
        function V(e, t) {
          var n = t.$attr, r = e.$attr, i = e.$$element;
          o(e, function (r, i) {
            '$' != i.charAt(0) && (t[i] && (r += ('style' === i ? ';' : ' ') + t[i]), e.$set(i, r, !0, n[i]));
          }), o(t, function (t, o) {
            'class' == o ? (D(i, t), e['class'] = (e['class'] ? e['class'] + ' ' : '') + t) : 'style' == o ? (i.attr('style', i.attr('style') + ';' + t), e.style = (e.style ? e.style + ';' : '') + t) : '$' == o.charAt(0) || e.hasOwnProperty(o) || (e[o] = t, r[o] = n[o]);
          });
        }
        function U(e, t, n, r, i, a, s, u) {
          var l, c, p = [], g = t[0], m = e.shift(), v = d({}, m, {
              templateUrl: null,
              transclude: null,
              replace: null,
              $$originalDirective: m
            }), y = _(m.templateUrl) ? m.templateUrl(t, n) : m.templateUrl;
          return t.empty(), f.get(T.getTrustedResourceUrl(y), { cache: h }).success(function (d) {
            var f, h, b, $;
            if (d = rt(d), m.replace) {
              if (b = dr('<div>' + $r(d) + '</div>').contents(), f = b[0], 1 != b.length || 1 !== f.nodeType)
                throw Vr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', m.name, y);
              h = { $attr: {} }, J(r, t, f);
              var x = A(f, [], h);
              w(m.scope) && I(x), e = x.concat(e), V(n, h);
            } else
              f = g, t.html(d);
            for (e.unshift(v), l = R(e, f, n, i, t, m, a, s, u), o(r, function (e, n) {
                e == f && (r[n] = t[0]);
              }), c = M(t[0].childNodes, i); p.length;) {
              var k = p.shift(), _ = p.shift(), T = p.shift(), S = p.shift(), C = t[0];
              if (_ !== g) {
                var E = _.className;
                C = ft(f), J(T, dr(_), C), D(dr(C), E);
              }
              $ = l.transclude ? P(k, l.transclude) : S, l(c, k, C, r, $);
            }
            p = null;
          }).error(function (e, t, n, r) {
            throw Vr('tpload', 'Failed to load template: {0}', r.url);
          }), function (e, t, n, r, i) {
            p ? (p.push(t), p.push(n), p.push(r), p.push(i)) : l(c, t, n, r, i);
          };
        }
        function W(e, t) {
          var n = t.priority - e.priority;
          return 0 !== n ? n : e.name !== t.name ? e.name < t.name ? -1 : 1 : e.index - t.index;
        }
        function Y(e, t, n, r) {
          if (t)
            throw Vr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', t.name, n.name, e, B(r));
        }
        function z(e, t) {
          var n = r(t, !0);
          n && e.push({
            priority: 0,
            compile: m(function (e, t) {
              var r = t.parent(), i = r.data('$binding') || [];
              i.push(n), D(r.data('$binding', i), 'ng-binding'), e.$watch(n, function (e) {
                t[0].nodeValue = e;
              });
            })
          });
        }
        function G(e, t) {
          if ('srcdoc' == t)
            return T.HTML;
          var n = hr(e);
          return 'xlinkHref' == t || 'FORM' == n && 'action' == t || 'IMG' != n && ('src' == t || 'ngSrc' == t) ? T.RESOURCE_URL : void 0;
        }
        function X(e, t, n, i) {
          var o = r(n, !0);
          if (o) {
            if ('multiple' === i && 'SELECT' === hr(e))
              throw Vr('selmulti', 'Binding to the \'multiple\' attribute is not supported. Element: {0}', B(e));
            t.push({
              priority: 100,
              compile: function () {
                return {
                  pre: function (t, n, a) {
                    var s = a.$$observers || (a.$$observers = {});
                    if (c.test(i))
                      throw Vr('nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.');
                    o = r(a[i], !0, G(e, i)), o && (a[i] = o(t), (s[i] || (s[i] = [])).$$inter = !0, (a.$$observers && a.$$observers[i].$$scope || t).$watch(o, function (e, t) {
                      'class' === i && e != t ? a.$updateClass(e, t) : a.$set(i, e);
                    }));
                  }
                };
              }
            });
          }
        }
        function J(e, n, r) {
          var i, o, a = n[0], s = n.length, u = a.parentNode;
          if (e)
            for (i = 0, o = e.length; o > i; i++)
              if (e[i] == a) {
                e[i++] = r;
                for (var l = i, c = l + s - 1, d = e.length; d > l; l++, c++)
                  d > c ? e[l] = e[c] : delete e[l];
                e.length -= s - 1;
                break;
              }
          u && u.replaceChild(r, a);
          var f = t.createDocumentFragment();
          f.appendChild(a), r[dr.expando] = a[dr.expando];
          for (var p = 1, h = n.length; h > p; p++) {
            var g = n[p];
            dr(g).remove(), f.appendChild(g), delete n[p];
          }
          n[0] = r, n.length = 1;
        }
        function Z(e, t) {
          return d(function () {
            return e.apply(null, arguments);
          }, e, t);
        }
        var K = function (e, t) {
          this.$$element = e, this.$attr = t || {};
        };
        K.prototype = {
          $normalize: Rt,
          $addClass: function (e) {
            e && e.length > 0 && S.addClass(this.$$element, e);
          },
          $removeClass: function (e) {
            e && e.length > 0 && S.removeClass(this.$$element, e);
          },
          $updateClass: function (e, t) {
            this.$removeClass(It(t, e)), this.$addClass(It(e, t));
          },
          $set: function (e, t, r, i) {
            var a, s = Tt(this.$$element[0], e);
            s && (this.$$element.prop(e, t), i = s), this[e] = t, i ? this.$attr[e] = i : (i = this.$attr[e], i || (this.$attr[e] = i = Q(e, '-'))), a = hr(this.$$element), ('A' === a && 'href' === e || 'IMG' === a && 'src' === e) && (this[e] = t = C(t, 'src' === e)), r !== !1 && (null === t || t === n ? this.$$element.removeAttr(i) : this.$$element.attr(i, t));
            var l = this.$$observers;
            l && o(l[e], function (e) {
              try {
                e(t);
              } catch (n) {
                u(n);
              }
            });
          },
          $observe: function (e, t) {
            var n = this, r = n.$$observers || (n.$$observers = {}), i = r[e] || (r[e] = []);
            return i.push(t), $.$evalAsync(function () {
              i.$$inter || t(n[e]);
            }), t;
          }
        };
        var et = r.startSymbol(), nt = r.endSymbol(), rt = '{{' == et || '}}' == nt ? g : function (e) {
            return e.replace(/\{\{/g, et).replace(/}}/g, nt);
          }, it = /^ngAttr[A-Z]/;
        return E;
      }
    ];
  }
  function Rt(e) {
    return lt(e.replace(Ur, ''));
  }
  function It(e, t) {
    var n = '', r = e.split(/\s+/), i = t.split(/\s+/);
    e:
      for (var o = 0; o < r.length; o++) {
        for (var a = r[o], s = 0; s < i.length; s++)
          if (a == i[s])
            continue e;
        n += (n.length > 0 ? ' ' : '') + a;
      }
    return n;
  }
  function Ft() {
    var e = {}, t = /^(\S+)(\s+as\s+(\w+))?$/;
    this.register = function (t, n) {
      rt(t, 'controller'), w(t) ? d(e, t) : e[t] = n;
    }, this.$get = [
      '$injector',
      '$window',
      function (n, i) {
        return function (o, a) {
          var s, u, l, c;
          if (b(o) && (u = o.match(t), l = u[1], c = u[3], o = e.hasOwnProperty(l) ? e[l] : it(a.$scope, l, !0) || it(i, l, !0), nt(o, l, !0)), s = n.instantiate(o, a), c) {
            if (!a || 'object' != typeof a.$scope)
              throw r('$controller')('noscp', 'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.', l || o.name, c);
            a.$scope[c] = s;
          }
          return s;
        };
      }
    ];
  }
  function Ht() {
    this.$get = [
      '$window',
      function (e) {
        return dr(e.document);
      }
    ];
  }
  function qt() {
    this.$get = [
      '$log',
      function (e) {
        return function () {
          e.error.apply(e, arguments);
        };
      }
    ];
  }
  function Vt(e) {
    var t, n, r, i = {};
    return e ? (o(e.split('\n'), function (e) {
      r = e.indexOf(':'), t = ar($r(e.substr(0, r))), n = $r(e.substr(r + 1)), t && (i[t] ? i[t] += ', ' + n : i[t] = n);
    }), i) : i;
  }
  function Ut(e) {
    var t = w(e) ? e : n;
    return function (n) {
      return t || (t = Vt(e)), n ? t[ar(n)] || null : t;
    };
  }
  function Wt(e, t, n) {
    return _(n) ? n(e, t) : (o(n, function (n) {
      e = n(e, t);
    }), e);
  }
  function Bt(e) {
    return e >= 200 && 300 > e;
  }
  function Yt() {
    var e = /^\s*(\[|\{[^\{])/, t = /[\}\]]\s*$/, r = /^\)\]\}',?\n/, i = { 'Content-Type': 'application/json;charset=utf-8' }, a = this.defaults = {
        transformResponse: [function (n) {
            return b(n) && (n = n.replace(r, ''), e.test(n) && t.test(n) && (n = U(n))), n;
          }],
        transformRequest: [function (e) {
            return w(e) && !E(e) ? V(e) : e;
          }],
        headers: {
          common: { Accept: 'application/json, text/plain, */*' },
          post: N(i),
          put: N(i),
          patch: N(i)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
      }, u = this.interceptors = [], l = this.responseInterceptors = [];
    this.$get = [
      '$httpBackend',
      '$browser',
      '$cacheFactory',
      '$rootScope',
      '$q',
      '$injector',
      function (e, t, r, i, c, f) {
        function p(e) {
          function r(e) {
            var t = d({}, e, { data: Wt(e.data, e.headers, s.transformResponse) });
            return Bt(e.status) ? t : c.reject(t);
          }
          function i(e) {
            function t(e) {
              var t;
              o(e, function (n, r) {
                _(n) && (t = n(), null != t ? e[r] = t : delete e[r]);
              });
            }
            var n, r, i, s = a.headers, u = d({}, e.headers);
            s = d({}, s.common, s[ar(e.method)]), t(s), t(u);
            e:
              for (n in s) {
                r = ar(n);
                for (i in u)
                  if (ar(i) === r)
                    continue e;
                u[n] = s[n];
              }
            return u;
          }
          var s = {
              transformRequest: a.transformRequest,
              transformResponse: a.transformResponse
            }, u = i(e);
          d(s, e), s.headers = u, s.method = sr(s.method);
          var l = Nn(s.url) ? t.cookies()[s.xsrfCookieName || a.xsrfCookieName] : n;
          l && (u[s.xsrfHeaderName || a.xsrfHeaderName] = l);
          var f = function (e) {
              u = e.headers;
              var t = Wt(e.data, Ut(u), e.transformRequest);
              return v(e.data) && o(u, function (e, t) {
                'content-type' === ar(t) && delete u[t];
              }), v(e.withCredentials) && !v(a.withCredentials) && (e.withCredentials = a.withCredentials), m(e, t, u).then(r, r);
            }, p = [
              f,
              n
            ], h = c.when(s);
          for (o(T, function (e) {
              (e.request || e.requestError) && p.unshift(e.request, e.requestError), (e.response || e.responseError) && p.push(e.response, e.responseError);
            }); p.length;) {
            var g = p.shift(), y = p.shift();
            h = h.then(g, y);
          }
          return h.success = function (e) {
            return h.then(function (t) {
              e(t.data, t.status, t.headers, s);
            }), h;
          }, h.error = function (e) {
            return h.then(null, function (t) {
              e(t.data, t.status, t.headers, s);
            }), h;
          }, h;
        }
        function h() {
          o(arguments, function (e) {
            p[e] = function (t, n) {
              return p(d(n || {}, {
                method: e,
                url: t
              }));
            };
          });
        }
        function g() {
          o(arguments, function (e) {
            p[e] = function (t, n, r) {
              return p(d(r || {}, {
                method: e,
                url: t,
                data: n
              }));
            };
          });
        }
        function m(t, n, r) {
          function o(e, t, n) {
            l && (Bt(e) ? l.put(g, [
              e,
              t,
              Vt(n)
            ]) : l.remove(g)), s(t, e, n), i.$$phase || i.$apply();
          }
          function s(e, n, r) {
            n = Math.max(n, 0), (Bt(n) ? f.resolve : f.reject)({
              data: e,
              status: n,
              headers: Ut(r),
              config: t
            });
          }
          function u() {
            var e = A(p.pendingRequests, t);
            -1 !== e && p.pendingRequests.splice(e, 1);
          }
          var l, d, f = c.defer(), h = f.promise, g = $(t.url, t.params);
          if (p.pendingRequests.push(t), h.then(u, u), (t.cache || a.cache) && t.cache !== !1 && 'GET' == t.method && (l = w(t.cache) ? t.cache : w(a.cache) ? a.cache : x), l)
            if (d = l.get(g), y(d)) {
              if (d.then)
                return d.then(u, u), d;
              k(d) ? s(d[1], d[0], N(d[2])) : s(d, 200, {});
            } else
              l.put(g, h);
          return v(d) && e(t.method, g, n, o, r, t.timeout, t.withCredentials, t.responseType), h;
        }
        function $(e, t) {
          if (!t)
            return e;
          var n = [];
          return s(t, function (e, t) {
            null === e || v(e) || (k(e) || (e = [e]), o(e, function (e) {
              w(e) && (e = V(e)), n.push(J(t) + '=' + J(e));
            }));
          }), e + (-1 == e.indexOf('?') ? '?' : '&') + n.join('&');
        }
        var x = r('$http'), T = [];
        return o(u, function (e) {
          T.unshift(b(e) ? f.get(e) : f.invoke(e));
        }), o(l, function (e, t) {
          var n = b(e) ? f.get(e) : f.invoke(e);
          T.splice(t, 0, {
            response: function (e) {
              return n(c.when(e));
            },
            responseError: function (e) {
              return n(c.reject(e));
            }
          });
        }), p.pendingRequests = [], h('get', 'delete', 'head', 'jsonp'), g('post', 'put'), p.defaults = a, p;
      }
    ];
  }
  function zt(t) {
    if (8 >= cr && (!t.match(/^(get|post|head|put|delete|options)$/i) || !e.XMLHttpRequest))
      return new e.ActiveXObject('Microsoft.XMLHTTP');
    if (e.XMLHttpRequest)
      return new e.XMLHttpRequest();
    throw r('$httpBackend')('noxhr', 'This browser does not support XMLHttpRequest.');
  }
  function Gt() {
    this.$get = [
      '$browser',
      '$window',
      '$document',
      function (e, t, n) {
        return Xt(e, zt, e.defer, t.angular.callbacks, n[0]);
      }
    ];
  }
  function Xt(e, t, n, r, i) {
    function a(e, t) {
      var n = i.createElement('script'), r = function () {
          n.onreadystatechange = n.onload = n.onerror = null, i.body.removeChild(n), t && t();
        };
      return n.type = 'text/javascript', n.src = e, cr && 8 >= cr ? n.onreadystatechange = function () {
        /loaded|complete/.test(n.readyState) && r();
      } : n.onload = n.onerror = function () {
        r();
      }, i.body.appendChild(n), r;
    }
    var s = -1;
    return function (i, u, l, c, d, f, p, g) {
      function m() {
        w = s, $ && $(), x && x.abort();
      }
      function v(t, r, i, o) {
        _ && n.cancel(_), $ = x = null, r = 0 === r ? i ? 200 : 404 : r, r = 1223 == r ? 204 : r, t(r, i, o), e.$$completeOutstandingRequest(h);
      }
      var w;
      if (e.$$incOutstandingRequestCount(), u = u || e.url(), 'jsonp' == ar(i)) {
        var b = '_' + (r.counter++).toString(36);
        r[b] = function (e) {
          r[b].data = e;
        };
        var $ = a(u.replace('JSON_CALLBACK', 'angular.callbacks.' + b), function () {
            r[b].data ? v(c, 200, r[b].data) : v(c, w || -2), r[b] = wr.noop;
          });
      } else {
        var x = t(i);
        if (x.open(i, u, !0), o(d, function (e, t) {
            y(e) && x.setRequestHeader(t, e);
          }), x.onreadystatechange = function () {
            if (x && 4 == x.readyState) {
              var e = null, t = null;
              w !== s && (e = x.getAllResponseHeaders(), t = 'response' in x ? x.response : x.responseText), v(c, w || x.status, t, e);
            }
          }, p && (x.withCredentials = !0), g)
          try {
            x.responseType = g;
          } catch (k) {
            if ('json' !== g)
              throw k;
          }
        x.send(l || null);
      }
      if (f > 0)
        var _ = n(m, f);
      else
        f && f.then && f.then(m);
    };
  }
  function Jt() {
    var e = '{{', t = '}}';
    this.startSymbol = function (t) {
      return t ? (e = t, this) : e;
    }, this.endSymbol = function (e) {
      return e ? (t = e, this) : t;
    }, this.$get = [
      '$parse',
      '$exceptionHandler',
      '$sce',
      function (n, r, i) {
        function o(o, u, l) {
          for (var c, d, f, p, h = 0, g = [], m = o.length, y = !1, w = []; m > h;)
            -1 != (c = o.indexOf(e, h)) && -1 != (d = o.indexOf(t, c + a)) ? (h != c && g.push(o.substring(h, c)), g.push(f = n(p = o.substring(c + a, d))), f.exp = p, h = d + s, y = !0) : (h != m && g.push(o.substring(h)), h = m);
          if ((m = g.length) || (g.push(''), m = 1), l && g.length > 1)
            throw Wr('noconcat', 'Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce', o);
          return !u || y ? (w.length = m, f = function (e) {
            try {
              for (var t, n = 0, a = m; a > n; n++)
                'function' == typeof (t = g[n]) && (t = t(e), t = l ? i.getTrusted(l, t) : i.valueOf(t), null === t || v(t) ? t = '' : 'string' != typeof t && (t = V(t))), w[n] = t;
              return w.join('');
            } catch (s) {
              var u = Wr('interr', 'Can\'t interpolate: {0}\n{1}', o, s.toString());
              r(u);
            }
          }, f.exp = o, f.parts = g, f) : void 0;
        }
        var a = e.length, s = t.length;
        return o.startSymbol = function () {
          return e;
        }, o.endSymbol = function () {
          return t;
        }, o;
      }
    ];
  }
  function Zt() {
    this.$get = [
      '$rootScope',
      '$window',
      '$q',
      function (e, t, n) {
        function r(r, o, a, s) {
          var u = t.setInterval, l = t.clearInterval, c = n.defer(), d = c.promise, f = 0, p = y(s) && !s;
          return a = y(a) ? a : 0, d.then(null, null, r), d.$$intervalId = u(function () {
            c.notify(f++), a > 0 && f >= a && (c.resolve(f), l(d.$$intervalId), delete i[d.$$intervalId]), p || e.$apply();
          }, o), i[d.$$intervalId] = c, d;
        }
        var i = {};
        return r.cancel = function (e) {
          return e && e.$$intervalId in i ? (i[e.$$intervalId].reject('canceled'), clearInterval(e.$$intervalId), delete i[e.$$intervalId], !0) : !1;
        }, r;
      }
    ];
  }
  function Kt() {
    this.$get = function () {
      return {
        id: 'en-us',
        NUMBER_FORMATS: {
          DECIMAL_SEP: '.',
          GROUP_SEP: ',',
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            },
            {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\xa4',
              posSuf: '',
              negPre: '(\xa4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }
          ],
          CURRENCY_SYM: '$'
        },
        DATETIME_FORMATS: {
          MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
          DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
          SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
          AMPMS: [
            'AM',
            'PM'
          ],
          medium: 'MMM d, y h:mm:ss a',
          'short': 'M/d/yy h:mm a',
          fullDate: 'EEEE, MMMM d, y',
          longDate: 'MMMM d, y',
          mediumDate: 'MMM d, y',
          shortDate: 'M/d/yy',
          mediumTime: 'h:mm:ss a',
          shortTime: 'h:mm a'
        },
        pluralCat: function (e) {
          return 1 === e ? 'one' : 'other';
        }
      };
    };
  }
  function Qt(e) {
    for (var t = e.split('/'), n = t.length; n--;)
      t[n] = X(t[n]);
    return t.join('/');
  }
  function en(e, t, n) {
    var r = On(e, n);
    t.$$protocol = r.protocol, t.$$host = r.hostname, t.$$port = f(r.port) || Yr[r.protocol] || null;
  }
  function tn(e, t, n) {
    var r = '/' !== e.charAt(0);
    r && (e = '/' + e);
    var i = On(e, n);
    t.$$path = decodeURIComponent(r && '/' === i.pathname.charAt(0) ? i.pathname.substring(1) : i.pathname), t.$$search = z(i.search), t.$$hash = decodeURIComponent(i.hash), t.$$path && '/' != t.$$path.charAt(0) && (t.$$path = '/' + t.$$path);
  }
  function nn(e, t) {
    return 0 === t.indexOf(e) ? t.substr(e.length) : void 0;
  }
  function rn(e) {
    var t = e.indexOf('#');
    return -1 == t ? e : e.substr(0, t);
  }
  function on(e) {
    return e.substr(0, rn(e).lastIndexOf('/') + 1);
  }
  function an(e) {
    return e.substring(0, e.indexOf('/', e.indexOf('//') + 2));
  }
  function sn(e, t) {
    this.$$html5 = !0, t = t || '';
    var r = on(e);
    en(e, this, e), this.$$parse = function (t) {
      var n = nn(r, t);
      if (!b(n))
        throw zr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', t, r);
      tn(n, this, e), this.$$path || (this.$$path = '/'), this.$$compose();
    }, this.$$compose = function () {
      var e = G(this.$$search), t = this.$$hash ? '#' + X(this.$$hash) : '';
      this.$$url = Qt(this.$$path) + (e ? '?' + e : '') + t, this.$$absUrl = r + this.$$url.substr(1);
    }, this.$$rewrite = function (i) {
      var o, a;
      return (o = nn(e, i)) !== n ? (a = o, (o = nn(t, o)) !== n ? r + (nn('/', o) || o) : e + a) : (o = nn(r, i)) !== n ? r + o : r == i + '/' ? r : void 0;
    };
  }
  function un(e, t) {
    var n = on(e);
    en(e, this, e), this.$$parse = function (r) {
      function i(e, t, n) {
        var r, i = /^\/?.*?:(\/.*)/;
        return 0 === t.indexOf(n) && (t = t.replace(n, '')), i.exec(t) ? e : (r = i.exec(e), r ? r[1] : e);
      }
      var o = nn(e, r) || nn(n, r), a = '#' == o.charAt(0) ? nn(t, o) : this.$$html5 ? o : '';
      if (!b(a))
        throw zr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', r, t);
      tn(a, this, e), this.$$path = i(this.$$path, a, e), this.$$compose();
    }, this.$$compose = function () {
      var n = G(this.$$search), r = this.$$hash ? '#' + X(this.$$hash) : '';
      this.$$url = Qt(this.$$path) + (n ? '?' + n : '') + r, this.$$absUrl = e + (this.$$url ? t + this.$$url : '');
    }, this.$$rewrite = function (t) {
      return rn(e) == rn(t) ? t : void 0;
    };
  }
  function ln(e, t) {
    this.$$html5 = !0, un.apply(this, arguments);
    var n = on(e);
    this.$$rewrite = function (r) {
      var i;
      return e == rn(r) ? r : (i = nn(n, r)) ? e + t + i : n === r + '/' ? n : void 0;
    };
  }
  function cn(e) {
    return function () {
      return this[e];
    };
  }
  function dn(e, t) {
    return function (n) {
      return v(n) ? this[e] : (this[e] = t(n), this.$$compose(), this);
    };
  }
  function fn() {
    var t = '', n = !1;
    this.hashPrefix = function (e) {
      return y(e) ? (t = e, this) : t;
    }, this.html5Mode = function (e) {
      return y(e) ? (n = e, this) : n;
    }, this.$get = [
      '$rootScope',
      '$browser',
      '$sniffer',
      '$rootElement',
      function (r, i, o, a) {
        function s(e) {
          r.$broadcast('$locationChangeSuccess', u.absUrl(), e);
        }
        var u, l, c, d = i.baseHref(), f = i.url();
        n ? (c = an(f) + (d || '/'), l = o.history ? sn : ln) : (c = rn(f), l = un), u = new l(c, '#' + t), u.$$parse(u.$$rewrite(f)), a.on('click', function (t) {
          if (!t.ctrlKey && !t.metaKey && 2 != t.which) {
            for (var n = dr(t.target); 'a' !== ar(n[0].nodeName);)
              if (n[0] === a[0] || !(n = n.parent())[0])
                return;
            var o = n.prop('href');
            w(o) && '[object SVGAnimatedString]' === o.toString() && (o = On(o.animVal).href);
            var s = u.$$rewrite(o);
            o && !n.attr('target') && s && !t.isDefaultPrevented() && (t.preventDefault(), s != i.url() && (u.$$parse(s), r.$apply(), e.angular['ff-684208-preventDefault'] = !0));
          }
        }), u.absUrl() != f && i.url(u.absUrl(), !0), i.onUrlChange(function (e) {
          u.absUrl() != e && (r.$evalAsync(function () {
            var t = u.absUrl();
            u.$$parse(e), r.$broadcast('$locationChangeStart', e, t).defaultPrevented ? (u.$$parse(t), i.url(t)) : s(t);
          }), r.$$phase || r.$digest());
        });
        var p = 0;
        return r.$watch(function () {
          var e = i.url(), t = u.$$replace;
          return p && e == u.absUrl() || (p++, r.$evalAsync(function () {
            r.$broadcast('$locationChangeStart', u.absUrl(), e).defaultPrevented ? u.$$parse(e) : (i.url(u.absUrl(), t), s(e));
          })), u.$$replace = !1, p;
        }), u;
      }
    ];
  }
  function pn() {
    var e = !0, t = this;
    this.debugEnabled = function (t) {
      return y(t) ? (e = t, this) : e;
    }, this.$get = [
      '$window',
      function (n) {
        function r(e) {
          return e instanceof Error && (e.stack ? e = e.message && -1 === e.stack.indexOf(e.message) ? 'Error: ' + e.message + '\n' + e.stack : e.stack : e.sourceURL && (e = e.message + '\n' + e.sourceURL + ':' + e.line)), e;
        }
        function i(e) {
          var t = n.console || {}, i = t[e] || t.log || h, a = !1;
          try {
            a = !!i.apply;
          } catch (s) {
          }
          return a ? function () {
            var e = [];
            return o(arguments, function (t) {
              e.push(r(t));
            }), i.apply(t, e);
          } : function (e, t) {
            i(e, null == t ? '' : t);
          };
        }
        return {
          log: i('log'),
          info: i('info'),
          warn: i('warn'),
          error: i('error'),
          debug: function () {
            var n = i('debug');
            return function () {
              e && n.apply(t, arguments);
            };
          }()
        };
      }
    ];
  }
  function hn(e, t) {
    if ('constructor' === e)
      throw Xr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', t);
    return e;
  }
  function gn(e, t) {
    if (e) {
      if (e.constructor === e)
        throw Xr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', t);
      if (e.document && e.location && e.alert && e.setInterval)
        throw Xr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', t);
      if (e.children && (e.nodeName || e.on && e.find))
        throw Xr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', t);
    }
    return e;
  }
  function mn(e, t, r, i, o) {
    o = o || {};
    for (var a, s = t.split('.'), u = 0; s.length > 1; u++) {
      a = hn(s.shift(), i);
      var l = e[a];
      l || (l = {}, e[a] = l), e = l, e.then && o.unwrapPromises && (Gr(i), '$$v' in e || function (e) {
        e.then(function (t) {
          e.$$v = t;
        });
      }(e), e.$$v === n && (e.$$v = {}), e = e.$$v);
    }
    return a = hn(s.shift(), i), e[a] = r, r;
  }
  function vn(e, t, r, i, o, a, s) {
    return hn(e, a), hn(t, a), hn(r, a), hn(i, a), hn(o, a), s.unwrapPromises ? function (s, u) {
      var l, c = u && u.hasOwnProperty(e) ? u : s;
      return null == c ? c : (c = c[e], c && c.then && (Gr(a), '$$v' in c || (l = c, l.$$v = n, l.then(function (e) {
        l.$$v = e;
      })), c = c.$$v), t ? null == c ? n : (c = c[t], c && c.then && (Gr(a), '$$v' in c || (l = c, l.$$v = n, l.then(function (e) {
        l.$$v = e;
      })), c = c.$$v), r ? null == c ? n : (c = c[r], c && c.then && (Gr(a), '$$v' in c || (l = c, l.$$v = n, l.then(function (e) {
        l.$$v = e;
      })), c = c.$$v), i ? null == c ? n : (c = c[i], c && c.then && (Gr(a), '$$v' in c || (l = c, l.$$v = n, l.then(function (e) {
        l.$$v = e;
      })), c = c.$$v), o ? null == c ? n : (c = c[o], c && c.then && (Gr(a), '$$v' in c || (l = c, l.$$v = n, l.then(function (e) {
        l.$$v = e;
      })), c = c.$$v), c) : c) : c) : c) : c);
    } : function (a, s) {
      var u = s && s.hasOwnProperty(e) ? s : a;
      return null == u ? u : (u = u[e], t ? null == u ? n : (u = u[t], r ? null == u ? n : (u = u[r], i ? null == u ? n : (u = u[i], o ? null == u ? n : u = u[o] : u) : u) : u) : u);
    };
  }
  function yn(e, t) {
    return hn(e, t), function (t, r) {
      return null == t ? n : (r && r.hasOwnProperty(e) ? r : t)[e];
    };
  }
  function wn(e, t, r) {
    return hn(e, r), hn(t, r), function (r, i) {
      return null == r ? n : (r = (i && i.hasOwnProperty(e) ? i : r)[e], null == r ? n : r[t]);
    };
  }
  function bn(e, t, r) {
    if (ti.hasOwnProperty(e))
      return ti[e];
    var i, a = e.split('.'), s = a.length;
    if (t.unwrapPromises || 1 !== s)
      if (t.unwrapPromises || 2 !== s)
        if (t.csp)
          i = 6 > s ? vn(a[0], a[1], a[2], a[3], a[4], r, t) : function (e, i) {
            var o, u = 0;
            do
              o = vn(a[u++], a[u++], a[u++], a[u++], a[u++], r, t)(e, i), i = n, e = o;
            while (s > u);
            return o;
          };
        else {
          var u = 'var p;\n';
          o(a, function (e, n) {
            hn(e, r), u += 'if(s == null) return undefined;\ns=' + (n ? 's' : '((k&&k.hasOwnProperty("' + e + '"))?k:s)') + '["' + e + '"]' + ';\n' + (t.unwrapPromises ? 'if (s && s.then) {\n pw("' + r.replace(/(["\r\n])/g, '\\$1') + '");\n' + ' if (!("$$v" in s)) {\n' + ' p=s;\n' + ' p.$$v = undefined;\n' + ' p.then(function(v) {p.$$v=v;});\n' + '}\n' + ' s=s.$$v\n' + '}\n' : '');
          }), u += 'return s;';
          var l = new Function('s', 'k', 'pw', u);
          l.toString = m(u), i = t.unwrapPromises ? function (e, t) {
            return l(e, t, Gr);
          } : l;
        }
      else
        i = wn(a[0], a[1], r);
    else
      i = yn(a[0], r);
    return 'hasOwnProperty' !== e && (ti[e] = i), i;
  }
  function $n() {
    var e = {}, t = {
        csp: !1,
        unwrapPromises: !1,
        logPromiseWarnings: !0
      };
    this.unwrapPromises = function (e) {
      return y(e) ? (t.unwrapPromises = !!e, this) : t.unwrapPromises;
    }, this.logPromiseWarnings = function (e) {
      return y(e) ? (t.logPromiseWarnings = e, this) : t.logPromiseWarnings;
    }, this.$get = [
      '$filter',
      '$sniffer',
      '$log',
      function (n, r, i) {
        return t.csp = r.csp, Gr = function (e) {
          t.logPromiseWarnings && !Jr.hasOwnProperty(e) && (Jr[e] = !0, i.warn('[$parse] Promise found in the expression `' + e + '`. ' + 'Automatic unwrapping of promises in Angular expressions is deprecated.'));
        }, function (r) {
          var i;
          switch (typeof r) {
          case 'string':
            if (e.hasOwnProperty(r))
              return e[r];
            var o = new Qr(t), a = new ei(o, n, t);
            return i = a.parse(r, !1), 'hasOwnProperty' !== r && (e[r] = i), i;
          case 'function':
            return r;
          default:
            return h;
          }
        };
      }
    ];
  }
  function xn() {
    this.$get = [
      '$rootScope',
      '$exceptionHandler',
      function (e, t) {
        return kn(function (t) {
          e.$evalAsync(t);
        }, t);
      }
    ];
  }
  function kn(e, t) {
    function r(e) {
      return e;
    }
    function i(e) {
      return l(e);
    }
    function a(e) {
      var t = s(), n = 0, r = k(e) ? [] : {};
      return o(e, function (e, i) {
        n++, u(e).then(function (e) {
          r.hasOwnProperty(i) || (r[i] = e, --n || t.resolve(r));
        }, function (e) {
          r.hasOwnProperty(i) || t.reject(e);
        });
      }), 0 === n && t.resolve(r), t.promise;
    }
    var s = function () {
        var o, a, l = [];
        return a = {
          resolve: function (t) {
            if (l) {
              var r = l;
              l = n, o = u(t), r.length && e(function () {
                for (var e, t = 0, n = r.length; n > t; t++)
                  e = r[t], o.then(e[0], e[1], e[2]);
              });
            }
          },
          reject: function (e) {
            a.resolve(c(e));
          },
          notify: function (t) {
            if (l) {
              var n = l;
              l.length && e(function () {
                for (var e, r = 0, i = n.length; i > r; r++)
                  e = n[r], e[2](t);
              });
            }
          },
          promise: {
            then: function (e, n, a) {
              var u = s(), c = function (n) {
                  try {
                    u.resolve((_(e) ? e : r)(n));
                  } catch (i) {
                    u.reject(i), t(i);
                  }
                }, d = function (e) {
                  try {
                    u.resolve((_(n) ? n : i)(e));
                  } catch (r) {
                    u.reject(r), t(r);
                  }
                }, f = function (e) {
                  try {
                    u.notify((_(a) ? a : r)(e));
                  } catch (n) {
                    t(n);
                  }
                };
              return l ? l.push([
                c,
                d,
                f
              ]) : o.then(c, d, f), u.promise;
            },
            'catch': function (e) {
              return this.then(null, e);
            },
            'finally': function (e) {
              function t(e, t) {
                var n = s();
                return t ? n.resolve(e) : n.reject(e), n.promise;
              }
              function n(n, i) {
                var o = null;
                try {
                  o = (e || r)();
                } catch (a) {
                  return t(a, !1);
                }
                return o && _(o.then) ? o.then(function () {
                  return t(n, i);
                }, function (e) {
                  return t(e, !1);
                }) : t(n, i);
              }
              return this.then(function (e) {
                return n(e, !0);
              }, function (e) {
                return n(e, !1);
              });
            }
          }
        };
      }, u = function (t) {
        return t && _(t.then) ? t : {
          then: function (n) {
            var r = s();
            return e(function () {
              r.resolve(n(t));
            }), r.promise;
          }
        };
      }, l = function (e) {
        var t = s();
        return t.reject(e), t.promise;
      }, c = function (n) {
        return {
          then: function (r, o) {
            var a = s();
            return e(function () {
              try {
                a.resolve((_(o) ? o : i)(n));
              } catch (e) {
                a.reject(e), t(e);
              }
            }), a.promise;
          }
        };
      }, d = function (n, o, a, c) {
        var d, f = s(), p = function (e) {
            try {
              return (_(o) ? o : r)(e);
            } catch (n) {
              return t(n), l(n);
            }
          }, h = function (e) {
            try {
              return (_(a) ? a : i)(e);
            } catch (n) {
              return t(n), l(n);
            }
          }, g = function (e) {
            try {
              return (_(c) ? c : r)(e);
            } catch (n) {
              t(n);
            }
          };
        return e(function () {
          u(n).then(function (e) {
            d || (d = !0, f.resolve(u(e).then(p, h, g)));
          }, function (e) {
            d || (d = !0, f.resolve(h(e)));
          }, function (e) {
            d || f.notify(g(e));
          });
        }), f.promise;
      };
    return {
      defer: s,
      reject: l,
      when: d,
      all: a
    };
  }
  function _n() {
    var e = 10, t = r('$rootScope'), n = null;
    this.digestTtl = function (t) {
      return arguments.length && (e = t), e;
    }, this.$get = [
      '$injector',
      '$exceptionHandler',
      '$parse',
      '$browser',
      function (r, a, s, u) {
        function c() {
          this.$id = l(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this['this'] = this.$root = this, this.$$destroyed = !1, this.$$asyncQueue = [], this.$$postDigestQueue = [], this.$$listeners = {}, this.$$listenerCount = {}, this.$$isolateBindings = {};
        }
        function d(e) {
          if (v.$$phase)
            throw t('inprog', '{0} already in progress', v.$$phase);
          v.$$phase = e;
        }
        function f() {
          v.$$phase = null;
        }
        function p(e, t) {
          var n = s(e);
          return nt(n, t), n;
        }
        function g(e, t, n) {
          do
            e.$$listenerCount[n] -= t, 0 === e.$$listenerCount[n] && delete e.$$listenerCount[n];
          while (e = e.$parent);
        }
        function m() {
        }
        c.prototype = {
          constructor: c,
          $new: function (e) {
            var t, n;
            return e ? (n = new c(), n.$root = this.$root, n.$$asyncQueue = this.$$asyncQueue, n.$$postDigestQueue = this.$$postDigestQueue) : (t = function () {
            }, t.prototype = this, n = new t(), n.$id = l()), n['this'] = n, n.$$listeners = {}, n.$$listenerCount = {}, n.$parent = this, n.$$watchers = n.$$nextSibling = n.$$childHead = n.$$childTail = null, n.$$prevSibling = this.$$childTail, this.$$childHead ? (this.$$childTail.$$nextSibling = n, this.$$childTail = n) : this.$$childHead = this.$$childTail = n, n;
          },
          $watch: function (e, t, r) {
            var i = this, o = p(e, 'watch'), a = i.$$watchers, s = {
                fn: t,
                last: m,
                get: o,
                exp: e,
                eq: !!r
              };
            if (n = null, !_(t)) {
              var u = p(t || h, 'listener');
              s.fn = function (e, t, n) {
                u(n);
              };
            }
            if ('string' == typeof e && o.constant) {
              var l = s.fn;
              s.fn = function (e, t, n) {
                l.call(this, e, t, n), O(a, s);
              };
            }
            return a || (a = i.$$watchers = []), a.unshift(s), function () {
              O(a, s), n = null;
            };
          },
          $watchCollection: function (e, t) {
            function n() {
              a = c(u);
              var e, t;
              if (w(a))
                if (i(a)) {
                  o !== d && (o = d, p = o.length = 0, l++), e = a.length, p !== e && (l++, o.length = p = e);
                  for (var n = 0; e > n; n++)
                    o[n] !== a[n] && (l++, o[n] = a[n]);
                } else {
                  o !== f && (o = f = {}, p = 0, l++), e = 0;
                  for (t in a)
                    a.hasOwnProperty(t) && (e++, o.hasOwnProperty(t) ? o[t] !== a[t] && (l++, o[t] = a[t]) : (p++, o[t] = a[t], l++));
                  if (p > e) {
                    l++;
                    for (t in o)
                      o.hasOwnProperty(t) && !a.hasOwnProperty(t) && (p--, delete o[t]);
                  }
                }
              else
                o !== a && (o = a, l++);
              return l;
            }
            function r() {
              t(a, o, u);
            }
            var o, a, u = this, l = 0, c = s(e), d = [], f = {}, p = 0;
            return this.$watch(n, r);
          },
          $digest: function () {
            var r, i, o, s, u, l, c, p, h, g, v, y = this.$$asyncQueue, w = this.$$postDigestQueue, b = e, $ = this, x = [];
            d('$digest'), n = null;
            do {
              for (l = !1, p = $; y.length;) {
                try {
                  v = y.shift(), v.scope.$eval(v.expression);
                } catch (k) {
                  f(), a(k);
                }
                n = null;
              }
              e:
                do {
                  if (s = p.$$watchers)
                    for (u = s.length; u--;)
                      try {
                        if (r = s[u])
                          if ((i = r.get(p)) === (o = r.last) || (r.eq ? L(i, o) : 'number' == typeof i && 'number' == typeof o && isNaN(i) && isNaN(o))) {
                            if (r === n) {
                              l = !1;
                              break e;
                            }
                          } else
                            l = !0, n = r, r.last = r.eq ? N(i) : i, r.fn(i, o === m ? i : o, p), 5 > b && (h = 4 - b, x[h] || (x[h] = []), g = _(r.exp) ? 'fn: ' + (r.exp.name || r.exp.toString()) : r.exp, g += '; newVal: ' + V(i) + '; oldVal: ' + V(o), x[h].push(g));
                      } catch (k) {
                        f(), a(k);
                      }
                  if (!(c = p.$$childHead || p !== $ && p.$$nextSibling))
                    for (; p !== $ && !(c = p.$$nextSibling);)
                      p = p.$parent;
                } while (p = c);
              if ((l || y.length) && !b--)
                throw f(), t('infdig', '{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}', e, V(x));
            } while (l || y.length);
            for (f(); w.length;)
              try {
                w.shift()();
              } catch (k) {
                a(k);
              }
          },
          $destroy: function () {
            if (!this.$$destroyed) {
              var e = this.$parent;
              this.$broadcast('$destroy'), this.$$destroyed = !0, this !== v && (o(this.$$listenerCount, H(null, g, this)), e.$$childHead == this && (e.$$childHead = this.$$nextSibling), e.$$childTail == this && (e.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null);
            }
          },
          $eval: function (e, t) {
            return s(e)(this, t);
          },
          $evalAsync: function (e) {
            v.$$phase || v.$$asyncQueue.length || u.defer(function () {
              v.$$asyncQueue.length && v.$digest();
            }), this.$$asyncQueue.push({
              scope: this,
              expression: e
            });
          },
          $$postDigest: function (e) {
            this.$$postDigestQueue.push(e);
          },
          $apply: function (e) {
            try {
              return d('$apply'), this.$eval(e);
            } catch (t) {
              a(t);
            } finally {
              f();
              try {
                v.$digest();
              } catch (t) {
                throw a(t), t;
              }
            }
          },
          $on: function (e, t) {
            var n = this.$$listeners[e];
            n || (this.$$listeners[e] = n = []), n.push(t);
            var r = this;
            do
              r.$$listenerCount[e] || (r.$$listenerCount[e] = 0), r.$$listenerCount[e]++;
            while (r = r.$parent);
            var i = this;
            return function () {
              n[A(n, t)] = null, g(i, 1, e);
            };
          },
          $emit: function (e) {
            var t, n, r, i = [], o = this, s = !1, u = {
                name: e,
                targetScope: o,
                stopPropagation: function () {
                  s = !0;
                },
                preventDefault: function () {
                  u.defaultPrevented = !0;
                },
                defaultPrevented: !1
              }, l = I([u], arguments, 1);
            do {
              for (t = o.$$listeners[e] || i, u.currentScope = o, n = 0, r = t.length; r > n; n++)
                if (t[n])
                  try {
                    t[n].apply(null, l);
                  } catch (c) {
                    a(c);
                  }
                else
                  t.splice(n, 1), n--, r--;
              if (s)
                return u;
              o = o.$parent;
            } while (o);
            return u;
          },
          $broadcast: function (e) {
            for (var t, n, r, i = this, o = i, s = i, u = {
                  name: e,
                  targetScope: i,
                  preventDefault: function () {
                    u.defaultPrevented = !0;
                  },
                  defaultPrevented: !1
                }, l = I([u], arguments, 1); o = s;) {
              for (u.currentScope = o, t = o.$$listeners[e] || [], n = 0, r = t.length; r > n; n++)
                if (t[n])
                  try {
                    t[n].apply(null, l);
                  } catch (c) {
                    a(c);
                  }
                else
                  t.splice(n, 1), n--, r--;
              if (!(s = o.$$listenerCount[e] && o.$$childHead || o !== i && o.$$nextSibling))
                for (; o !== i && !(s = o.$$nextSibling);)
                  o = o.$parent;
            }
            return u;
          }
        };
        var v = new c();
        return v;
      }
    ];
  }
  function Tn() {
    var e = /^\s*(https?|ftp|mailto|tel|file):/, t = /^\s*(https?|ftp|file):|data:image\//;
    this.aHrefSanitizationWhitelist = function (t) {
      return y(t) ? (e = t, this) : e;
    }, this.imgSrcSanitizationWhitelist = function (e) {
      return y(e) ? (t = e, this) : t;
    }, this.$get = function () {
      return function (n, r) {
        var i, o = r ? t : e;
        return cr && !(cr >= 8) || (i = On(n).href, '' === i || i.match(o)) ? n : 'unsafe:' + i;
      };
    };
  }
  function Sn(e) {
    return e.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  }
  function Cn(e) {
    if ('self' === e)
      return e;
    if (b(e)) {
      if (e.indexOf('***') > -1)
        throw ni('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', e);
      return e = Sn(e).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*'), new RegExp('^' + e + '$');
    }
    if (T(e))
      return new RegExp('^' + e.source + '$');
    throw ni('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
  }
  function En(e) {
    var t = [];
    return y(e) && o(e, function (e) {
      t.push(Cn(e));
    }), t;
  }
  function Dn() {
    this.SCE_CONTEXTS = ri;
    var e = ['self'], t = [];
    this.resourceUrlWhitelist = function (t) {
      return arguments.length && (e = En(t)), e;
    }, this.resourceUrlBlacklist = function (e) {
      return arguments.length && (t = En(e)), t;
    }, this.$get = [
      '$injector',
      function (r) {
        function i(e, t) {
          return 'self' === e ? Nn(t) : !!e.exec(t.href);
        }
        function o(n) {
          var r, o, a = On(n.toString()), s = !1;
          for (r = 0, o = e.length; o > r; r++)
            if (i(e[r], a)) {
              s = !0;
              break;
            }
          if (s)
            for (r = 0, o = t.length; o > r; r++)
              if (i(t[r], a)) {
                s = !1;
                break;
              }
          return s;
        }
        function a(e) {
          var t = function (e) {
            this.$$unwrapTrustedValue = function () {
              return e;
            };
          };
          return e && (t.prototype = new e()), t.prototype.valueOf = function () {
            return this.$$unwrapTrustedValue();
          }, t.prototype.toString = function () {
            return this.$$unwrapTrustedValue().toString();
          }, t;
        }
        function s(e, t) {
          var r = f.hasOwnProperty(e) ? f[e] : null;
          if (!r)
            throw ni('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', e, t);
          if (null === t || t === n || '' === t)
            return t;
          if ('string' != typeof t)
            throw ni('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', e);
          return new r(t);
        }
        function u(e) {
          return e instanceof d ? e.$$unwrapTrustedValue() : e;
        }
        function l(e, t) {
          if (null === t || t === n || '' === t)
            return t;
          var r = f.hasOwnProperty(e) ? f[e] : null;
          if (r && t instanceof r)
            return t.$$unwrapTrustedValue();
          if (e === ri.RESOURCE_URL) {
            if (o(t))
              return t;
            throw ni('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', t.toString());
          }
          if (e === ri.HTML)
            return c(t);
          throw ni('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        var c = function () {
          throw ni('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        r.has('$sanitize') && (c = r.get('$sanitize'));
        var d = a(), f = {};
        return f[ri.HTML] = a(d), f[ri.CSS] = a(d), f[ri.URL] = a(d), f[ri.JS] = a(d), f[ri.RESOURCE_URL] = a(f[ri.URL]), {
          trustAs: s,
          getTrusted: l,
          valueOf: u
        };
      }
    ];
  }
  function Mn() {
    var e = !0;
    this.enabled = function (t) {
      return arguments.length && (e = !!t), e;
    }, this.$get = [
      '$parse',
      '$sniffer',
      '$sceDelegate',
      function (t, n, r) {
        if (e && n.msie && n.msieDocumentMode < 8)
          throw ni('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        var i = N(ri);
        i.isEnabled = function () {
          return e;
        }, i.trustAs = r.trustAs, i.getTrusted = r.getTrusted, i.valueOf = r.valueOf, e || (i.trustAs = i.getTrusted = function (e, t) {
          return t;
        }, i.valueOf = g), i.parseAs = function (e, n) {
          var r = t(n);
          return r.literal && r.constant ? r : function (t, n) {
            return i.getTrusted(e, r(t, n));
          };
        };
        var a = i.parseAs, s = i.getTrusted, u = i.trustAs;
        return o(ri, function (e, t) {
          var n = ar(t);
          i[lt('parse_as_' + n)] = function (t) {
            return a(e, t);
          }, i[lt('get_trusted_' + n)] = function (t) {
            return s(e, t);
          }, i[lt('trust_as_' + n)] = function (t) {
            return u(e, t);
          };
        }), i;
      }
    ];
  }
  function Pn() {
    this.$get = [
      '$window',
      '$document',
      function (e, t) {
        var n, r, i = {}, o = f((/android (\d+)/.exec(ar((e.navigator || {}).userAgent)) || [])[1]), a = /Boxee/i.test((e.navigator || {}).userAgent), s = t[0] || {}, u = s.documentMode, l = /^(Moz|webkit|O|ms)(?=[A-Z])/, c = s.body && s.body.style, d = !1, p = !1;
        if (c) {
          for (var h in c)
            if (r = l.exec(h)) {
              n = r[0], n = n.substr(0, 1).toUpperCase() + n.substr(1);
              break;
            }
          n || (n = 'WebkitOpacity' in c && 'webkit'), d = !!('transition' in c || n + 'Transition' in c), p = !!('animation' in c || n + 'Animation' in c), !o || d && p || (d = b(s.body.style.webkitTransition), p = b(s.body.style.webkitAnimation));
        }
        return {
          history: !(!e.history || !e.history.pushState || 4 > o || a),
          hashchange: 'onhashchange' in e && (!u || u > 7),
          hasEvent: function (e) {
            if ('input' == e && 9 == cr)
              return !1;
            if (v(i[e])) {
              var t = s.createElement('div');
              i[e] = 'on' + e in t;
            }
            return i[e];
          },
          csp: R(),
          vendorPrefix: n,
          transitions: d,
          animations: p,
          android: o,
          msie: cr,
          msieDocumentMode: u
        };
      }
    ];
  }
  function An() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$q',
      '$exceptionHandler',
      function (e, t, n, r) {
        function i(i, a, s) {
          var u, l = n.defer(), c = l.promise, d = y(s) && !s;
          return u = t.defer(function () {
            try {
              l.resolve(i());
            } catch (t) {
              l.reject(t), r(t);
            } finally {
              delete o[c.$$timeoutId];
            }
            d || e.$apply();
          }, a), c.$$timeoutId = u, o[u] = l, c;
        }
        var o = {};
        return i.cancel = function (e) {
          return e && e.$$timeoutId in o ? (o[e.$$timeoutId].reject('canceled'), delete o[e.$$timeoutId], t.defer.cancel(e.$$timeoutId)) : !1;
        }, i;
      }
    ];
  }
  function On(e) {
    var t = e;
    return cr && (ii.setAttribute('href', t), t = ii.href), ii.setAttribute('href', t), {
      href: ii.href,
      protocol: ii.protocol ? ii.protocol.replace(/:$/, '') : '',
      host: ii.host,
      search: ii.search ? ii.search.replace(/^\?/, '') : '',
      hash: ii.hash ? ii.hash.replace(/^#/, '') : '',
      hostname: ii.hostname,
      port: ii.port,
      pathname: '/' === ii.pathname.charAt(0) ? ii.pathname : '/' + ii.pathname
    };
  }
  function Nn(e) {
    var t = b(e) ? On(e) : e;
    return t.protocol === oi.protocol && t.host === oi.host;
  }
  function jn() {
    this.$get = m(e);
  }
  function Ln(e) {
    function t(r, i) {
      if (w(r)) {
        var a = {};
        return o(r, function (e, n) {
          a[n] = t(n, e);
        }), a;
      }
      return e.factory(r + n, i);
    }
    var n = 'Filter';
    this.register = t, this.$get = [
      '$injector',
      function (e) {
        return function (t) {
          return e.get(t + n);
        };
      }
    ], t('currency', In), t('date', Yn), t('filter', Rn), t('json', zn), t('limitTo', Gn), t('lowercase', ci), t('number', Fn), t('orderBy', Xn), t('uppercase', di);
  }
  function Rn() {
    return function (e, t, n) {
      if (!k(e))
        return e;
      var r = typeof n, i = [];
      i.check = function (e) {
        for (var t = 0; t < i.length; t++)
          if (!i[t](e))
            return !1;
        return !0;
      }, 'function' !== r && (n = 'boolean' === r && n ? function (e, t) {
        return wr.equals(e, t);
      } : function (e, t) {
        return t = ('' + t).toLowerCase(), ('' + e).toLowerCase().indexOf(t) > -1;
      });
      var o = function (e, t) {
        if ('string' == typeof t && '!' === t.charAt(0))
          return !o(e, t.substr(1));
        switch (typeof e) {
        case 'boolean':
        case 'number':
        case 'string':
          return n(e, t);
        case 'object':
          switch (typeof t) {
          case 'object':
            return n(e, t);
          default:
            for (var r in e)
              if ('$' !== r.charAt(0) && o(e[r], t))
                return !0;
          }
          return !1;
        case 'array':
          for (var i = 0; i < e.length; i++)
            if (o(e[i], t))
              return !0;
          return !1;
        default:
          return !1;
        }
      };
      switch (typeof t) {
      case 'boolean':
      case 'number':
      case 'string':
        t = { $: t };
      case 'object':
        for (var a in t)
          !function (e) {
            'undefined' != typeof t[e] && i.push(function (n) {
              return o('$' == e ? n : n && n[e], t[e]);
            });
          }(a);
        break;
      case 'function':
        i.push(t);
        break;
      default:
        return e;
      }
      for (var s = [], u = 0; u < e.length; u++) {
        var l = e[u];
        i.check(l) && s.push(l);
      }
      return s;
    };
  }
  function In(e) {
    var t = e.NUMBER_FORMATS;
    return function (e, n) {
      return v(n) && (n = t.CURRENCY_SYM), Hn(e, t.PATTERNS[1], t.GROUP_SEP, t.DECIMAL_SEP, 2).replace(/\u00A4/g, n);
    };
  }
  function Fn(e) {
    var t = e.NUMBER_FORMATS;
    return function (e, n) {
      return Hn(e, t.PATTERNS[0], t.GROUP_SEP, t.DECIMAL_SEP, n);
    };
  }
  function Hn(e, t, n, r, i) {
    if (isNaN(e) || !isFinite(e))
      return '';
    var o = 0 > e;
    e = Math.abs(e);
    var a = e + '', s = '', u = [], l = !1;
    if (-1 !== a.indexOf('e')) {
      var c = a.match(/([\d\.]+)e(-?)(\d+)/);
      c && '-' == c[2] && c[3] > i + 1 ? a = '0' : (s = a, l = !0);
    }
    if (l)
      i > 0 && e > -1 && 1 > e && (s = e.toFixed(i));
    else {
      var d = (a.split(ai)[1] || '').length;
      v(i) && (i = Math.min(Math.max(t.minFrac, d), t.maxFrac));
      var f = Math.pow(10, i);
      e = Math.round(e * f) / f;
      var p = ('' + e).split(ai), h = p[0];
      p = p[1] || '';
      var g, m = 0, y = t.lgSize, w = t.gSize;
      if (h.length >= y + w)
        for (m = h.length - y, g = 0; m > g; g++)
          0 === (m - g) % w && 0 !== g && (s += n), s += h.charAt(g);
      for (g = m; g < h.length; g++)
        0 === (h.length - g) % y && 0 !== g && (s += n), s += h.charAt(g);
      for (; p.length < i;)
        p += '0';
      i && '0' !== i && (s += r + p.substr(0, i));
    }
    return u.push(o ? t.negPre : t.posPre), u.push(s), u.push(o ? t.negSuf : t.posSuf), u.join('');
  }
  function qn(e, t, n) {
    var r = '';
    for (0 > e && (r = '-', e = -e), e = '' + e; e.length < t;)
      e = '0' + e;
    return n && (e = e.substr(e.length - t)), r + e;
  }
  function Vn(e, t, n, r) {
    return n = n || 0, function (i) {
      var o = i['get' + e]();
      return (n > 0 || o > -n) && (o += n), 0 === o && -12 == n && (o = 12), qn(o, t, r);
    };
  }
  function Un(e, t) {
    return function (n, r) {
      var i = n['get' + e](), o = sr(t ? 'SHORT' + e : e);
      return r[o][i];
    };
  }
  function Wn(e) {
    var t = -1 * e.getTimezoneOffset(), n = t >= 0 ? '+' : '';
    return n += qn(Math[t > 0 ? 'floor' : 'ceil'](t / 60), 2) + qn(Math.abs(t % 60), 2);
  }
  function Bn(e, t) {
    return e.getHours() < 12 ? t.AMPMS[0] : t.AMPMS[1];
  }
  function Yn(e) {
    function t(e) {
      var t;
      if (t = e.match(n)) {
        var r = new Date(0), i = 0, o = 0, a = t[8] ? r.setUTCFullYear : r.setFullYear, s = t[8] ? r.setUTCHours : r.setHours;
        t[9] && (i = f(t[9] + t[10]), o = f(t[9] + t[11])), a.call(r, f(t[1]), f(t[2]) - 1, f(t[3]));
        var u = f(t[4] || 0) - i, l = f(t[5] || 0) - o, c = f(t[6] || 0), d = Math.round(1000 * parseFloat('0.' + (t[7] || 0)));
        return s.call(r, u, l, c, d), r;
      }
      return e;
    }
    var n = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    return function (n, r) {
      var i, a, s = '', u = [];
      if (r = r || 'mediumDate', r = e.DATETIME_FORMATS[r] || r, b(n) && (n = li.test(n) ? f(n) : t(n)), $(n) && (n = new Date(n)), !x(n))
        return n;
      for (; r;)
        a = ui.exec(r), a ? (u = I(u, a, 1), r = u.pop()) : (u.push(r), r = null);
      return o(u, function (t) {
        i = si[t], s += i ? i(n, e.DATETIME_FORMATS) : t.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      }), s;
    };
  }
  function zn() {
    return function (e) {
      return V(e, !0);
    };
  }
  function Gn() {
    return function (e, t) {
      if (!k(e) && !b(e))
        return e;
      if (t = f(t), b(e))
        return t ? t >= 0 ? e.slice(0, t) : e.slice(t, e.length) : '';
      var n, r, i = [];
      for (t > e.length ? t = e.length : t < -e.length && (t = -e.length), t > 0 ? (n = 0, r = t) : (n = e.length + t, r = e.length); r > n; n++)
        i.push(e[n]);
      return i;
    };
  }
  function Xn(e) {
    return function (t, n, r) {
      function i(e, t) {
        for (var r = 0; r < n.length; r++) {
          var i = n[r](e, t);
          if (0 !== i)
            return i;
        }
        return 0;
      }
      function o(e, t) {
        return W(t) ? function (t, n) {
          return e(n, t);
        } : e;
      }
      function a(e, t) {
        var n = typeof e, r = typeof t;
        return n == r ? ('string' == n && (e = e.toLowerCase(), t = t.toLowerCase()), e === t ? 0 : t > e ? -1 : 1) : r > n ? -1 : 1;
      }
      if (!k(t))
        return t;
      if (!n)
        return t;
      n = k(n) ? n : [n], n = M(n, function (t) {
        var n = !1, r = t || g;
        return b(t) && (('+' == t.charAt(0) || '-' == t.charAt(0)) && (n = '-' == t.charAt(0), t = t.substring(1)), r = e(t)), o(function (e, t) {
          return a(r(e), r(t));
        }, n);
      });
      for (var s = [], u = 0; u < t.length; u++)
        s.push(t[u]);
      return s.sort(o(i, r));
    };
  }
  function Jn(e) {
    return _(e) && (e = { link: e }), e.restrict = e.restrict || 'AC', m(e);
  }
  function Zn(e, t) {
    function n(t, n) {
      n = n ? '-' + Q(n, '-') : '', e.removeClass((t ? _i : ki) + n).addClass((t ? ki : _i) + n);
    }
    var r = this, i = e.parent().controller('form') || hi, a = 0, s = r.$error = {}, u = [];
    r.$name = t.name || t.ngForm, r.$dirty = !1, r.$pristine = !0, r.$valid = !0, r.$invalid = !1, i.$addControl(r), e.addClass(Ti), n(!0), r.$addControl = function (e) {
      rt(e.$name, 'input'), u.push(e), e.$name && (r[e.$name] = e);
    }, r.$removeControl = function (e) {
      e.$name && r[e.$name] === e && delete r[e.$name], o(s, function (t, n) {
        r.$setValidity(n, !0, e);
      }), O(u, e);
    }, r.$setValidity = function (e, t, o) {
      var u = s[e];
      if (t)
        u && (O(u, o), u.length || (a--, a || (n(t), r.$valid = !0, r.$invalid = !1), s[e] = !1, n(!0, e), i.$setValidity(e, !0, r)));
      else {
        if (a || n(t), u) {
          if (P(u, o))
            return;
        } else
          s[e] = u = [], a++, n(!1, e), i.$setValidity(e, !1, r);
        u.push(o), r.$valid = !1, r.$invalid = !0;
      }
    }, r.$setDirty = function () {
      e.removeClass(Ti).addClass(Si), r.$dirty = !0, r.$pristine = !1, i.$setDirty();
    }, r.$setPristine = function () {
      e.removeClass(Si).addClass(Ti), r.$dirty = !1, r.$pristine = !0, o(u, function (e) {
        e.$setPristine();
      });
    };
  }
  function Kn(e, t, r, i) {
    return e.$setValidity(t, r), r ? i : n;
  }
  function Qn(e, t, n, i, o, a) {
    if (!o.android) {
      var s = !1;
      t.on('compositionstart', function () {
        s = !0;
      }), t.on('compositionend', function () {
        s = !1;
      });
    }
    var u = function () {
      if (!s) {
        var r = t.val();
        W(n.ngTrim || 'T') && (r = $r(r)), i.$viewValue !== r && (e.$$phase ? i.$setViewValue(r) : e.$apply(function () {
          i.$setViewValue(r);
        }));
      }
    };
    if (o.hasEvent('input'))
      t.on('input', u);
    else {
      var l, c = function () {
          l || (l = a.defer(function () {
            u(), l = null;
          }));
        };
      t.on('keydown', function (e) {
        var t = e.keyCode;
        91 === t || t > 15 && 19 > t || t >= 37 && 40 >= t || c();
      }), o.hasEvent('paste') && t.on('paste cut', c);
    }
    t.on('change', u), i.$render = function () {
      t.val(i.$isEmpty(i.$viewValue) ? '' : i.$viewValue);
    };
    var d, p, h = n.ngPattern;
    if (h) {
      var g = function (e, t) {
        return Kn(i, 'pattern', i.$isEmpty(t) || e.test(t), t);
      };
      p = h.match(/^\/(.*)\/([gim]*)$/), p ? (h = new RegExp(p[1], p[2]), d = function (e) {
        return g(h, e);
      }) : d = function (n) {
        var i = e.$eval(h);
        if (!i || !i.test)
          throw r('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', h, i, B(t));
        return g(i, n);
      }, i.$formatters.push(d), i.$parsers.push(d);
    }
    if (n.ngMinlength) {
      var m = f(n.ngMinlength), v = function (e) {
          return Kn(i, 'minlength', i.$isEmpty(e) || e.length >= m, e);
        };
      i.$parsers.push(v), i.$formatters.push(v);
    }
    if (n.ngMaxlength) {
      var y = f(n.ngMaxlength), w = function (e) {
          return Kn(i, 'maxlength', i.$isEmpty(e) || e.length <= y, e);
        };
      i.$parsers.push(w), i.$formatters.push(w);
    }
  }
  function er(e, t, r, i, o, a) {
    if (Qn(e, t, r, i, o, a), i.$parsers.push(function (e) {
        var t = i.$isEmpty(e);
        return t || bi.test(e) ? (i.$setValidity('number', !0), '' === e ? null : t ? e : parseFloat(e)) : (i.$setValidity('number', !1), n);
      }), i.$formatters.push(function (e) {
        return i.$isEmpty(e) ? '' : '' + e;
      }), r.min) {
      var s = function (e) {
        var t = parseFloat(r.min);
        return Kn(i, 'min', i.$isEmpty(e) || e >= t, e);
      };
      i.$parsers.push(s), i.$formatters.push(s);
    }
    if (r.max) {
      var u = function (e) {
        var t = parseFloat(r.max);
        return Kn(i, 'max', i.$isEmpty(e) || t >= e, e);
      };
      i.$parsers.push(u), i.$formatters.push(u);
    }
    i.$formatters.push(function (e) {
      return Kn(i, 'number', i.$isEmpty(e) || $(e), e);
    });
  }
  function tr(e, t, n, r, i, o) {
    Qn(e, t, n, r, i, o);
    var a = function (e) {
      return Kn(r, 'url', r.$isEmpty(e) || yi.test(e), e);
    };
    r.$formatters.push(a), r.$parsers.push(a);
  }
  function nr(e, t, n, r, i, o) {
    Qn(e, t, n, r, i, o);
    var a = function (e) {
      return Kn(r, 'email', r.$isEmpty(e) || wi.test(e), e);
    };
    r.$formatters.push(a), r.$parsers.push(a);
  }
  function rr(e, t, n, r) {
    v(n.name) && t.attr('name', l()), t.on('click', function () {
      t[0].checked && e.$apply(function () {
        r.$setViewValue(n.value);
      });
    }), r.$render = function () {
      var e = n.value;
      t[0].checked = e == r.$viewValue;
    }, n.$observe('value', r.$render);
  }
  function ir(e, t, n, r) {
    var i = n.ngTrueValue, o = n.ngFalseValue;
    b(i) || (i = !0), b(o) || (o = !1), t.on('click', function () {
      e.$apply(function () {
        r.$setViewValue(t[0].checked);
      });
    }), r.$render = function () {
      t[0].checked = r.$viewValue;
    }, r.$isEmpty = function (e) {
      return e !== i;
    }, r.$formatters.push(function (e) {
      return e === i;
    }), r.$parsers.push(function (e) {
      return e ? i : o;
    });
  }
  function or(e, t) {
    return e = 'ngClass' + e, function () {
      return {
        restrict: 'AC',
        link: function (n, r, i) {
          function a(e) {
            if (t === !0 || n.$index % 2 === t) {
              var r = s(e || '');
              u ? L(e, u) || i.$updateClass(r, s(u)) : i.$addClass(r);
            }
            u = N(e);
          }
          function s(e) {
            if (k(e))
              return e.join(' ');
            if (w(e)) {
              var t = [];
              return o(e, function (e, n) {
                e && t.push(n);
              }), t.join(' ');
            }
            return e;
          }
          var u;
          n.$watch(i[e], a, !0), i.$observe('class', function () {
            a(n.$eval(i[e]));
          }), 'ngClass' !== e && n.$watch('$index', function (r, o) {
            var a = 1 & r;
            if (1 & a !== o) {
              var u = s(n.$eval(i[e]));
              a === t ? i.$addClass(u) : i.$removeClass(u);
            }
          });
        }
      };
    };
  }
  var ar = function (e) {
      return b(e) ? e.toLowerCase() : e;
    }, sr = function (e) {
      return b(e) ? e.toUpperCase() : e;
    }, ur = function (e) {
      return b(e) ? e.replace(/[A-Z]/g, function (e) {
        return String.fromCharCode(32 | e.charCodeAt(0));
      }) : e;
    }, lr = function (e) {
      return b(e) ? e.replace(/[a-z]/g, function (e) {
        return String.fromCharCode(-33 & e.charCodeAt(0));
      }) : e;
    };
  'i' !== 'I'.toLowerCase() && (ar = ur, sr = lr);
  var cr, dr, fr, pr, hr, gr = [].slice, mr = [].push, vr = Object.prototype.toString, yr = r('ng'), wr = (e.angular, e.angular || (e.angular = {})), br = [
      '0',
      '0',
      '0'
    ];
  cr = f((/msie (\d+)/.exec(ar(navigator.userAgent)) || [])[1]), isNaN(cr) && (cr = f((/trident\/.*; rv:(\d+)/.exec(ar(navigator.userAgent)) || [])[1])), h.$inject = [], g.$inject = [];
  var $r = function () {
      return String.prototype.trim ? function (e) {
        return b(e) ? e.trim() : e;
      } : function (e) {
        return b(e) ? e.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : e;
      };
    }();
  hr = 9 > cr ? function (e) {
    return e = e.nodeName ? e : e[0], e.scopeName && 'HTML' != e.scopeName ? sr(e.scopeName + ':' + e.nodeName) : e.nodeName;
  } : function (e) {
    return e.nodeName ? e.nodeName : e[0].nodeName;
  };
  var xr = /[A-Z]/g, kr = {
      full: '1.2.12',
      major: 1,
      minor: 2,
      dot: 12,
      codeName: 'cauliflower-eradication'
    }, _r = dt.cache = {}, Tr = dt.expando = 'ng-' + new Date().getTime(), Sr = 1, Cr = e.document.addEventListener ? function (e, t, n) {
      e.addEventListener(t, n, !1);
    } : function (e, t, n) {
      e.attachEvent('on' + t, n);
    }, Er = e.document.removeEventListener ? function (e, t, n) {
      e.removeEventListener(t, n, !1);
    } : function (e, t, n) {
      e.detachEvent('on' + t, n);
    }, Dr = /([\:\-\_]+(.))/g, Mr = /^moz([A-Z])/, Pr = r('jqLite'), Ar = dt.prototype = {
      ready: function (n) {
        function r() {
          i || (i = !0, n());
        }
        var i = !1;
        'complete' === t.readyState ? setTimeout(r) : (this.on('DOMContentLoaded', r), dt(e).on('load', r));
      },
      toString: function () {
        var e = [];
        return o(this, function (t) {
          e.push('' + t);
        }), '[' + e.join(', ') + ']';
      },
      eq: function (e) {
        return e >= 0 ? dr(this[e]) : dr(this[this.length + e]);
      },
      length: 0,
      push: mr,
      sort: [].sort,
      splice: [].splice
    }, Or = {};
  o('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (e) {
    Or[ar(e)] = e;
  });
  var Nr = {};
  o('input,select,option,textarea,button,form,details'.split(','), function (e) {
    Nr[sr(e)] = !0;
  }), o({
    data: vt,
    inheritedData: kt,
    scope: function (e) {
      return dr(e).data('$scope') || kt(e.parentNode || e, [
        '$isolateScope',
        '$scope'
      ]);
    },
    isolateScope: function (e) {
      return dr(e).data('$isolateScope') || dr(e).data('$isolateScopeNoTemplate');
    },
    controller: xt,
    injector: function (e) {
      return kt(e, '$injector');
    },
    removeAttr: function (e, t) {
      e.removeAttribute(t);
    },
    hasClass: yt,
    css: function (e, t, r) {
      if (t = lt(t), !y(r)) {
        var i;
        return 8 >= cr && (i = e.currentStyle && e.currentStyle[t], '' === i && (i = 'auto')), i = i || e.style[t], 8 >= cr && (i = '' === i ? n : i), i;
      }
      e.style[t] = r;
    },
    attr: function (e, t, r) {
      var i = ar(t);
      if (Or[i]) {
        if (!y(r))
          return e[t] || (e.attributes.getNamedItem(t) || h).specified ? i : n;
        r ? (e[t] = !0, e.setAttribute(t, i)) : (e[t] = !1, e.removeAttribute(i));
      } else if (y(r))
        e.setAttribute(t, r);
      else if (e.getAttribute) {
        var o = e.getAttribute(t, 2);
        return null === o ? n : o;
      }
    },
    prop: function (e, t, n) {
      return y(n) ? (e[t] = n, void 0) : e[t];
    },
    text: function () {
      function e(e, n) {
        var r = t[e.nodeType];
        return v(n) ? r ? e[r] : '' : (e[r] = n, void 0);
      }
      var t = [];
      return 9 > cr ? (t[1] = 'innerText', t[3] = 'nodeValue') : t[1] = t[3] = 'textContent', e.$dv = '', e;
    }(),
    val: function (e, t) {
      if (v(t)) {
        if ('SELECT' === hr(e) && e.multiple) {
          var n = [];
          return o(e.options, function (e) {
            e.selected && n.push(e.value || e.text);
          }), 0 === n.length ? null : n;
        }
        return e.value;
      }
      e.value = t;
    },
    html: function (e, t) {
      if (v(t))
        return e.innerHTML;
      for (var n = 0, r = e.childNodes; n < r.length; n++)
        pt(r[n]);
      e.innerHTML = t;
    },
    empty: _t
  }, function (e, t) {
    dt.prototype[t] = function (t, r) {
      var i, o;
      if (e !== _t && (2 == e.length && e !== yt && e !== xt ? t : r) === n) {
        if (w(t)) {
          for (i = 0; i < this.length; i++)
            if (e === vt)
              e(this[i], t);
            else
              for (o in t)
                e(this[i], o, t[o]);
          return this;
        }
        for (var a = e.$dv, s = a === n ? Math.min(this.length, 1) : this.length, u = 0; s > u; u++) {
          var l = e(this[u], t, r);
          a = a ? a + l : l;
        }
        return a;
      }
      for (i = 0; i < this.length; i++)
        e(this[i], t, r);
      return this;
    };
  }), o({
    removeData: gt,
    dealoc: pt,
    on: function lo(e, n, r, i) {
      if (y(i))
        throw Pr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
      var a = mt(e, 'events'), s = mt(e, 'handle');
      a || mt(e, 'events', a = {}), s || mt(e, 'handle', s = St(e, a)), o(n.split(' '), function (n) {
        var i = a[n];
        if (!i) {
          if ('mouseenter' == n || 'mouseleave' == n) {
            var o = t.body.contains || t.body.compareDocumentPosition ? function (e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
              } : function (e, t) {
                if (t)
                  for (; t = t.parentNode;)
                    if (t === e)
                      return !0;
                return !1;
              };
            a[n] = [];
            var u = {
                mouseleave: 'mouseout',
                mouseenter: 'mouseover'
              };
            lo(e, u[n], function (e) {
              var t = this, r = e.relatedTarget;
              (!r || r !== t && !o(t, r)) && s(e, n);
            });
          } else
            Cr(e, n, s), a[n] = [];
          i = a[n];
        }
        i.push(r);
      });
    },
    off: ht,
    one: function (e, t, n) {
      e = dr(e), e.on(t, function r() {
        e.off(t, n), e.off(t, r);
      }), e.on(t, n);
    },
    replaceWith: function (e, t) {
      var n, r = e.parentNode;
      pt(e), o(new dt(t), function (t) {
        n ? r.insertBefore(t, n.nextSibling) : r.replaceChild(t, e), n = t;
      });
    },
    children: function (e) {
      var t = [];
      return o(e.childNodes, function (e) {
        1 === e.nodeType && t.push(e);
      }), t;
    },
    contents: function (e) {
      return e.childNodes || [];
    },
    append: function (e, t) {
      o(new dt(t), function (t) {
        (1 === e.nodeType || 11 === e.nodeType) && e.appendChild(t);
      });
    },
    prepend: function (e, t) {
      if (1 === e.nodeType) {
        var n = e.firstChild;
        o(new dt(t), function (t) {
          e.insertBefore(t, n);
        });
      }
    },
    wrap: function (e, t) {
      t = dr(t)[0];
      var n = e.parentNode;
      n && n.replaceChild(t, e), t.appendChild(e);
    },
    remove: function (e) {
      pt(e);
      var t = e.parentNode;
      t && t.removeChild(e);
    },
    after: function (e, t) {
      var n = e, r = e.parentNode;
      o(new dt(t), function (e) {
        r.insertBefore(e, n.nextSibling), n = e;
      });
    },
    addClass: bt,
    removeClass: wt,
    toggleClass: function (e, t, n) {
      v(n) && (n = !yt(e, t)), (n ? bt : wt)(e, t);
    },
    parent: function (e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    next: function (e) {
      if (e.nextElementSibling)
        return e.nextElementSibling;
      for (var t = e.nextSibling; null != t && 1 !== t.nodeType;)
        t = t.nextSibling;
      return t;
    },
    find: function (e, t) {
      return e.getElementsByTagName ? e.getElementsByTagName(t) : [];
    },
    clone: ft,
    triggerHandler: function (e, t, n) {
      var r = (mt(e, 'events') || {})[t];
      n = n || [];
      var i = [{
            preventDefault: h,
            stopPropagation: h
          }];
      o(r, function (t) {
        t.apply(e, i.concat(n));
      });
    }
  }, function (e, t) {
    dt.prototype[t] = function (t, n, r) {
      for (var i, o = 0; o < this.length; o++)
        v(i) ? (i = e(this[o], t, n, r), y(i) && (i = dr(i))) : $t(i, e(this[o], t, n, r));
      return y(i) ? i : this;
    }, dt.prototype.bind = dt.prototype.on, dt.prototype.unbind = dt.prototype.off;
  }), Et.prototype = {
    put: function (e, t) {
      this[Ct(e)] = t;
    },
    get: function (e) {
      return this[Ct(e)];
    },
    remove: function (e) {
      var t = this[e = Ct(e)];
      return delete this[e], t;
    }
  };
  var jr = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, Lr = /,/, Rr = /^\s*(_?)(\S+?)\1\s*$/, Ir = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, Fr = r('$injector'), Hr = r('$animate'), qr = [
      '$provide',
      function (e) {
        this.$$selectors = {}, this.register = function (t, n) {
          var r = t + '-animation';
          if (t && '.' != t.charAt(0))
            throw Hr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', t);
          this.$$selectors[t.substr(1)] = r, e.factory(r, n);
        }, this.classNameFilter = function (e) {
          return 1 === arguments.length && (this.$$classNameFilter = e instanceof RegExp ? e : null), this.$$classNameFilter;
        }, this.$get = [
          '$timeout',
          function (e) {
            return {
              enter: function (t, n, r, i) {
                r ? r.after(t) : (n && n[0] || (n = r.parent()), n.append(t)), i && e(i, 0, !1);
              },
              leave: function (t, n) {
                t.remove(), n && e(n, 0, !1);
              },
              move: function (e, t, n, r) {
                this.enter(e, t, n, r);
              },
              addClass: function (t, n, r) {
                n = b(n) ? n : k(n) ? n.join(' ') : '', o(t, function (e) {
                  bt(e, n);
                }), r && e(r, 0, !1);
              },
              removeClass: function (t, n, r) {
                n = b(n) ? n : k(n) ? n.join(' ') : '', o(t, function (e) {
                  wt(e, n);
                }), r && e(r, 0, !1);
              },
              enabled: h
            };
          }
        ];
      }
    ], Vr = r('$compile');
  Lt.$inject = [
    '$provide',
    '$$sanitizeUriProvider'
  ];
  var Ur = /^(x[\:\-_]|data[\:\-_])/i, Wr = r('$interpolate'), Br = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, Yr = {
      http: 80,
      https: 443,
      ftp: 21
    }, zr = r('$location');
  ln.prototype = un.prototype = sn.prototype = {
    $$html5: !1,
    $$replace: !1,
    absUrl: cn('$$absUrl'),
    url: function (e, t) {
      if (v(e))
        return this.$$url;
      var n = Br.exec(e);
      return n[1] && this.path(decodeURIComponent(n[1])), (n[2] || n[1]) && this.search(n[3] || ''), this.hash(n[5] || '', t), this;
    },
    protocol: cn('$$protocol'),
    host: cn('$$host'),
    port: cn('$$port'),
    path: dn('$$path', function (e) {
      return '/' == e.charAt(0) ? e : '/' + e;
    }),
    search: function (e, t) {
      switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (b(e))
          this.$$search = z(e);
        else {
          if (!w(e))
            throw zr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
          this.$$search = e;
        }
        break;
      default:
        v(t) || null === t ? delete this.$$search[e] : this.$$search[e] = t;
      }
      return this.$$compose(), this;
    },
    hash: dn('$$hash', g),
    replace: function () {
      return this.$$replace = !0, this;
    }
  };
  var Gr, Xr = r('$parse'), Jr = {}, Zr = {
      'null': function () {
        return null;
      },
      'true': function () {
        return !0;
      },
      'false': function () {
        return !1;
      },
      undefined: h,
      '+': function (e, t, r, i) {
        return r = r(e, t), i = i(e, t), y(r) ? y(i) ? r + i : r : y(i) ? i : n;
      },
      '-': function (e, t, n, r) {
        return n = n(e, t), r = r(e, t), (y(n) ? n : 0) - (y(r) ? r : 0);
      },
      '*': function (e, t, n, r) {
        return n(e, t) * r(e, t);
      },
      '/': function (e, t, n, r) {
        return n(e, t) / r(e, t);
      },
      '%': function (e, t, n, r) {
        return n(e, t) % r(e, t);
      },
      '^': function (e, t, n, r) {
        return n(e, t) ^ r(e, t);
      },
      '=': h,
      '===': function (e, t, n, r) {
        return n(e, t) === r(e, t);
      },
      '!==': function (e, t, n, r) {
        return n(e, t) !== r(e, t);
      },
      '==': function (e, t, n, r) {
        return n(e, t) == r(e, t);
      },
      '!=': function (e, t, n, r) {
        return n(e, t) != r(e, t);
      },
      '<': function (e, t, n, r) {
        return n(e, t) < r(e, t);
      },
      '>': function (e, t, n, r) {
        return n(e, t) > r(e, t);
      },
      '<=': function (e, t, n, r) {
        return n(e, t) <= r(e, t);
      },
      '>=': function (e, t, n, r) {
        return n(e, t) >= r(e, t);
      },
      '&&': function (e, t, n, r) {
        return n(e, t) && r(e, t);
      },
      '||': function (e, t, n, r) {
        return n(e, t) || r(e, t);
      },
      '&': function (e, t, n, r) {
        return n(e, t) & r(e, t);
      },
      '|': function (e, t, n, r) {
        return r(e, t)(e, t, n(e, t));
      },
      '!': function (e, t, n) {
        return !n(e, t);
      }
    }, Kr = {
      n: '\n',
      f: '\f',
      r: '\r',
      t: '\t',
      v: '\x0B',
      '\'': '\'',
      '"': '"'
    }, Qr = function (e) {
      this.options = e;
    };
  Qr.prototype = {
    constructor: Qr,
    lex: function (e) {
      this.text = e, this.index = 0, this.ch = n, this.lastCh = ':', this.tokens = [];
      for (var t, r = []; this.index < this.text.length;) {
        if (this.ch = this.text.charAt(this.index), this.is('"\''))
          this.readString(this.ch);
        else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek()))
          this.readNumber();
        else if (this.isIdent(this.ch))
          this.readIdent(), this.was('{,') && '{' === r[0] && (t = this.tokens[this.tokens.length - 1]) && (t.json = -1 === t.text.indexOf('.'));
        else if (this.is('(){}[].,;:?'))
          this.tokens.push({
            index: this.index,
            text: this.ch,
            json: this.was(':[,') && this.is('{[') || this.is('}]:,')
          }), this.is('{[') && r.unshift(this.ch), this.is('}]') && r.shift(), this.index++;
        else {
          if (this.isWhitespace(this.ch)) {
            this.index++;
            continue;
          }
          var i = this.ch + this.peek(), o = i + this.peek(2), a = Zr[this.ch], s = Zr[i], u = Zr[o];
          u ? (this.tokens.push({
            index: this.index,
            text: o,
            fn: u
          }), this.index += 3) : s ? (this.tokens.push({
            index: this.index,
            text: i,
            fn: s
          }), this.index += 2) : a ? (this.tokens.push({
            index: this.index,
            text: this.ch,
            fn: a,
            json: this.was('[,:') && this.is('+-')
          }), this.index += 1) : this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
        this.lastCh = this.ch;
      }
      return this.tokens;
    },
    is: function (e) {
      return -1 !== e.indexOf(this.ch);
    },
    was: function (e) {
      return -1 !== e.indexOf(this.lastCh);
    },
    peek: function (e) {
      var t = e || 1;
      return this.index + t < this.text.length ? this.text.charAt(this.index + t) : !1;
    },
    isNumber: function (e) {
      return e >= '0' && '9' >= e;
    },
    isWhitespace: function (e) {
      return ' ' === e || '\r' === e || '\t' === e || '\n' === e || '\x0B' === e || '\xa0' === e;
    },
    isIdent: function (e) {
      return e >= 'a' && 'z' >= e || e >= 'A' && 'Z' >= e || '_' === e || '$' === e;
    },
    isExpOperator: function (e) {
      return '-' === e || '+' === e || this.isNumber(e);
    },
    throwError: function (e, t, n) {
      n = n || this.index;
      var r = y(t) ? 's ' + t + '-' + this.index + ' [' + this.text.substring(t, n) + ']' : ' ' + n;
      throw Xr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', e, r, this.text);
    },
    readNumber: function () {
      for (var e = '', t = this.index; this.index < this.text.length;) {
        var n = ar(this.text.charAt(this.index));
        if ('.' == n || this.isNumber(n))
          e += n;
        else {
          var r = this.peek();
          if ('e' == n && this.isExpOperator(r))
            e += n;
          else if (this.isExpOperator(n) && r && this.isNumber(r) && 'e' == e.charAt(e.length - 1))
            e += n;
          else {
            if (!this.isExpOperator(n) || r && this.isNumber(r) || 'e' != e.charAt(e.length - 1))
              break;
            this.throwError('Invalid exponent');
          }
        }
        this.index++;
      }
      e = 1 * e, this.tokens.push({
        index: t,
        text: e,
        json: !0,
        fn: function () {
          return e;
        }
      });
    },
    readIdent: function () {
      for (var e, t, n, r, i = this, o = '', a = this.index; this.index < this.text.length && (r = this.text.charAt(this.index), '.' === r || this.isIdent(r) || this.isNumber(r));)
        '.' === r && (e = this.index), o += r, this.index++;
      if (e)
        for (t = this.index; t < this.text.length;) {
          if (r = this.text.charAt(t), '(' === r) {
            n = o.substr(e - a + 1), o = o.substr(0, e - a), this.index = t;
            break;
          }
          if (!this.isWhitespace(r))
            break;
          t++;
        }
      var s = {
          index: a,
          text: o
        };
      if (Zr.hasOwnProperty(o))
        s.fn = Zr[o], s.json = Zr[o];
      else {
        var u = bn(o, this.options, this.text);
        s.fn = d(function (e, t) {
          return u(e, t);
        }, {
          assign: function (e, t) {
            return mn(e, o, t, i.text, i.options);
          }
        });
      }
      this.tokens.push(s), n && (this.tokens.push({
        index: e,
        text: '.',
        json: !1
      }), this.tokens.push({
        index: e + 1,
        text: n,
        json: !1
      }));
    },
    readString: function (e) {
      var t = this.index;
      this.index++;
      for (var n = '', r = e, i = !1; this.index < this.text.length;) {
        var o = this.text.charAt(this.index);
        if (r += o, i) {
          if ('u' === o) {
            var a = this.text.substring(this.index + 1, this.index + 5);
            a.match(/[\da-f]{4}/i) || this.throwError('Invalid unicode escape [\\u' + a + ']'), this.index += 4, n += String.fromCharCode(parseInt(a, 16));
          } else {
            var s = Kr[o];
            n += s ? s : o;
          }
          i = !1;
        } else if ('\\' === o)
          i = !0;
        else {
          if (o === e)
            return this.index++, this.tokens.push({
              index: t,
              text: r,
              string: n,
              json: !0,
              fn: function () {
                return n;
              }
            }), void 0;
          n += o;
        }
        this.index++;
      }
      this.throwError('Unterminated quote', t);
    }
  };
  var ei = function (e, t, n) {
    this.lexer = e, this.$filter = t, this.options = n;
  };
  ei.ZERO = function () {
    return 0;
  }, ei.prototype = {
    constructor: ei,
    parse: function (e, t) {
      this.text = e, this.json = t, this.tokens = this.lexer.lex(e), t && (this.assignment = this.logicalOR, this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
        this.throwError('is not valid json', {
          text: e,
          index: 0
        });
      });
      var n = t ? this.primary() : this.statements();
      return 0 !== this.tokens.length && this.throwError('is an unexpected token', this.tokens[0]), n.literal = !!n.literal, n.constant = !!n.constant, n;
    },
    primary: function () {
      var e;
      if (this.expect('('))
        e = this.filterChain(), this.consume(')');
      else if (this.expect('['))
        e = this.arrayDeclaration();
      else if (this.expect('{'))
        e = this.object();
      else {
        var t = this.expect();
        e = t.fn, e || this.throwError('not a primary expression', t), t.json && (e.constant = !0, e.literal = !0);
      }
      for (var n, r; n = this.expect('(', '[', '.');)
        '(' === n.text ? (e = this.functionCall(e, r), r = null) : '[' === n.text ? (r = e, e = this.objectIndex(e)) : '.' === n.text ? (r = e, e = this.fieldAccess(e)) : this.throwError('IMPOSSIBLE');
      return e;
    },
    throwError: function (e, t) {
      throw Xr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', t.text, e, t.index + 1, this.text, this.text.substring(t.index));
    },
    peekToken: function () {
      if (0 === this.tokens.length)
        throw Xr('ueoe', 'Unexpected end of expression: {0}', this.text);
      return this.tokens[0];
    },
    peek: function (e, t, n, r) {
      if (this.tokens.length > 0) {
        var i = this.tokens[0], o = i.text;
        if (o === e || o === t || o === n || o === r || !e && !t && !n && !r)
          return i;
      }
      return !1;
    },
    expect: function (e, t, n, r) {
      var i = this.peek(e, t, n, r);
      return i ? (this.json && !i.json && this.throwError('is not valid json', i), this.tokens.shift(), i) : !1;
    },
    consume: function (e) {
      this.expect(e) || this.throwError('is unexpected, expecting [' + e + ']', this.peek());
    },
    unaryFn: function (e, t) {
      return d(function (n, r) {
        return e(n, r, t);
      }, { constant: t.constant });
    },
    ternaryFn: function (e, t, n) {
      return d(function (r, i) {
        return e(r, i) ? t(r, i) : n(r, i);
      }, { constant: e.constant && t.constant && n.constant });
    },
    binaryFn: function (e, t, n) {
      return d(function (r, i) {
        return t(r, i, e, n);
      }, { constant: e.constant && n.constant });
    },
    statements: function () {
      for (var e = [];;)
        if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']') && e.push(this.filterChain()), !this.expect(';'))
          return 1 === e.length ? e[0] : function (t, n) {
            for (var r, i = 0; i < e.length; i++) {
              var o = e[i];
              o && (r = o(t, n));
            }
            return r;
          };
    },
    filterChain: function () {
      for (var e, t = this.expression();;) {
        if (!(e = this.expect('|')))
          return t;
        t = this.binaryFn(t, e.fn, this.filter());
      }
    },
    filter: function () {
      for (var e = this.expect(), t = this.$filter(e.text), n = [];;) {
        if (!(e = this.expect(':'))) {
          var r = function (e, r, i) {
            for (var o = [i], a = 0; a < n.length; a++)
              o.push(n[a](e, r));
            return t.apply(e, o);
          };
          return function () {
            return r;
          };
        }
        n.push(this.expression());
      }
    },
    expression: function () {
      return this.assignment();
    },
    assignment: function () {
      var e, t, n = this.ternary();
      return (t = this.expect('=')) ? (n.assign || this.throwError('implies assignment but [' + this.text.substring(0, t.index) + '] can not be assigned to', t), e = this.ternary(), function (t, r) {
        return n.assign(t, e(t, r), r);
      }) : n;
    },
    ternary: function () {
      var e, t, n = this.logicalOR();
      return (t = this.expect('?')) ? (e = this.ternary(), (t = this.expect(':')) ? this.ternaryFn(n, e, this.ternary()) : (this.throwError('expected :', t), void 0)) : n;
    },
    logicalOR: function () {
      for (var e, t = this.logicalAND();;) {
        if (!(e = this.expect('||')))
          return t;
        t = this.binaryFn(t, e.fn, this.logicalAND());
      }
    },
    logicalAND: function () {
      var e, t = this.equality();
      return (e = this.expect('&&')) && (t = this.binaryFn(t, e.fn, this.logicalAND())), t;
    },
    equality: function () {
      var e, t = this.relational();
      return (e = this.expect('==', '!=', '===', '!==')) && (t = this.binaryFn(t, e.fn, this.equality())), t;
    },
    relational: function () {
      var e, t = this.additive();
      return (e = this.expect('<', '>', '<=', '>=')) && (t = this.binaryFn(t, e.fn, this.relational())), t;
    },
    additive: function () {
      for (var e, t = this.multiplicative(); e = this.expect('+', '-');)
        t = this.binaryFn(t, e.fn, this.multiplicative());
      return t;
    },
    multiplicative: function () {
      for (var e, t = this.unary(); e = this.expect('*', '/', '%');)
        t = this.binaryFn(t, e.fn, this.unary());
      return t;
    },
    unary: function () {
      var e;
      return this.expect('+') ? this.primary() : (e = this.expect('-')) ? this.binaryFn(ei.ZERO, e.fn, this.unary()) : (e = this.expect('!')) ? this.unaryFn(e.fn, this.unary()) : this.primary();
    },
    fieldAccess: function (e) {
      var t = this, n = this.expect().text, r = bn(n, this.options, this.text);
      return d(function (t, n, i) {
        return r(i || e(t, n));
      }, {
        assign: function (r, i, o) {
          return mn(e(r, o), n, i, t.text, t.options);
        }
      });
    },
    objectIndex: function (e) {
      var t = this, r = this.expression();
      return this.consume(']'), d(function (i, o) {
        var a, s, u = e(i, o), l = r(i, o);
        return u ? (a = gn(u[l], t.text), a && a.then && t.options.unwrapPromises && (s = a, '$$v' in a || (s.$$v = n, s.then(function (e) {
          s.$$v = e;
        })), a = a.$$v), a) : n;
      }, {
        assign: function (n, i, o) {
          var a = r(n, o), s = gn(e(n, o), t.text);
          return s[a] = i;
        }
      });
    },
    functionCall: function (e, t) {
      var n = [];
      if (')' !== this.peekToken().text)
        do
          n.push(this.expression());
        while (this.expect(','));
      this.consume(')');
      var r = this;
      return function (i, o) {
        for (var a = [], s = t ? t(i, o) : i, u = 0; u < n.length; u++)
          a.push(n[u](i, o));
        var l = e(i, o, s) || h;
        gn(s, r.text), gn(l, r.text);
        var c = l.apply ? l.apply(s, a) : l(a[0], a[1], a[2], a[3], a[4]);
        return gn(c, r.text);
      };
    },
    arrayDeclaration: function () {
      var e = [], t = !0;
      if (']' !== this.peekToken().text)
        do {
          var n = this.expression();
          e.push(n), n.constant || (t = !1);
        } while (this.expect(','));
      return this.consume(']'), d(function (t, n) {
        for (var r = [], i = 0; i < e.length; i++)
          r.push(e[i](t, n));
        return r;
      }, {
        literal: !0,
        constant: t
      });
    },
    object: function () {
      var e = [], t = !0;
      if ('}' !== this.peekToken().text)
        do {
          var n = this.expect(), r = n.string || n.text;
          this.consume(':');
          var i = this.expression();
          e.push({
            key: r,
            value: i
          }), i.constant || (t = !1);
        } while (this.expect(','));
      return this.consume('}'), d(function (t, n) {
        for (var r = {}, i = 0; i < e.length; i++) {
          var o = e[i];
          r[o.key] = o.value(t, n);
        }
        return r;
      }, {
        literal: !0,
        constant: t
      });
    }
  };
  var ti = {}, ni = r('$sce'), ri = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    }, ii = t.createElement('a'), oi = On(e.location.href, !0);
  Ln.$inject = ['$provide'], In.$inject = ['$locale'], Fn.$inject = ['$locale'];
  var ai = '.', si = {
      yyyy: Vn('FullYear', 4),
      yy: Vn('FullYear', 2, 0, !0),
      y: Vn('FullYear', 1),
      MMMM: Un('Month'),
      MMM: Un('Month', !0),
      MM: Vn('Month', 2, 1),
      M: Vn('Month', 1, 1),
      dd: Vn('Date', 2),
      d: Vn('Date', 1),
      HH: Vn('Hours', 2),
      H: Vn('Hours', 1),
      hh: Vn('Hours', 2, -12),
      h: Vn('Hours', 1, -12),
      mm: Vn('Minutes', 2),
      m: Vn('Minutes', 1),
      ss: Vn('Seconds', 2),
      s: Vn('Seconds', 1),
      sss: Vn('Milliseconds', 3),
      EEEE: Un('Day'),
      EEE: Un('Day', !0),
      a: Bn,
      Z: Wn
    }, ui = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, li = /^\-?\d+$/;
  Yn.$inject = ['$locale'];
  var ci = m(ar), di = m(sr);
  Xn.$inject = ['$parse'];
  var fi = m({
      restrict: 'E',
      compile: function (e, n) {
        return 8 >= cr && (n.href || n.name || n.$set('href', ''), e.append(t.createComment('IE fix'))), n.href || n.xlinkHref || n.name ? void 0 : function (e, t) {
          var n = '[object SVGAnimatedString]' === vr.call(t.prop('href')) ? 'xlink:href' : 'href';
          t.on('click', function (e) {
            t.attr(n) || e.preventDefault();
          });
        };
      }
    }), pi = {};
  o(Or, function (e, t) {
    if ('multiple' != e) {
      var n = Rt('ng-' + t);
      pi[n] = function () {
        return {
          priority: 100,
          link: function (e, r, i) {
            e.$watch(i[n], function (e) {
              i.$set(t, !!e);
            });
          }
        };
      };
    }
  }), o([
    'src',
    'srcset',
    'href'
  ], function (e) {
    var t = Rt('ng-' + e);
    pi[t] = function () {
      return {
        priority: 99,
        link: function (n, r, i) {
          i.$observe(t, function (t) {
            t && (i.$set(e, t), cr && r.prop(e, i[e]));
          });
        }
      };
    };
  });
  var hi = {
      $addControl: h,
      $removeControl: h,
      $setValidity: h,
      $setDirty: h,
      $setPristine: h
    };
  Zn.$inject = [
    '$element',
    '$attrs',
    '$scope'
  ];
  var gi = function (e) {
      return [
        '$timeout',
        function (t) {
          var r = {
              name: 'form',
              restrict: e ? 'EAC' : 'E',
              controller: Zn,
              compile: function () {
                return {
                  pre: function (e, r, i, o) {
                    if (!i.action) {
                      var a = function (e) {
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
                      };
                      Cr(r[0], 'submit', a), r.on('$destroy', function () {
                        t(function () {
                          Er(r[0], 'submit', a);
                        }, 0, !1);
                      });
                    }
                    var s = r.parent().controller('form'), u = i.name || i.ngForm;
                    u && mn(e, u, o, u), s && r.on('$destroy', function () {
                      s.$removeControl(o), u && mn(e, u, n, u), d(o, hi);
                    });
                  }
                };
              }
            };
          return r;
        }
      ];
    }, mi = gi(), vi = gi(!0), yi = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, wi = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i, bi = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, $i = {
      text: Qn,
      number: er,
      url: tr,
      email: nr,
      radio: rr,
      checkbox: ir,
      hidden: h,
      button: h,
      submit: h,
      reset: h
    }, xi = [
      '$browser',
      '$sniffer',
      function (e, t) {
        return {
          restrict: 'E',
          require: '?ngModel',
          link: function (n, r, i, o) {
            o && ($i[ar(i.type)] || $i.text)(n, r, i, o, t, e);
          }
        };
      }
    ], ki = 'ng-valid', _i = 'ng-invalid', Ti = 'ng-pristine', Si = 'ng-dirty', Ci = [
      '$scope',
      '$exceptionHandler',
      '$attrs',
      '$element',
      '$parse',
      function (e, t, n, i, a) {
        function s(e, t) {
          t = t ? '-' + Q(t, '-') : '', i.removeClass((e ? _i : ki) + t).addClass((e ? ki : _i) + t);
        }
        this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$name = n.name;
        var u = a(n.ngModel), l = u.assign;
        if (!l)
          throw r('ngModel')('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}', n.ngModel, B(i));
        this.$render = h, this.$isEmpty = function (e) {
          return v(e) || '' === e || null === e || e !== e;
        };
        var c = i.inheritedData('$formController') || hi, d = 0, f = this.$error = {};
        i.addClass(Ti), s(!0), this.$setValidity = function (e, t) {
          f[e] !== !t && (t ? (f[e] && d--, d || (s(!0), this.$valid = !0, this.$invalid = !1)) : (s(!1), this.$invalid = !0, this.$valid = !1, d++), f[e] = !t, s(t, e), c.$setValidity(e, t, this));
        }, this.$setPristine = function () {
          this.$dirty = !1, this.$pristine = !0, i.removeClass(Si).addClass(Ti);
        }, this.$setViewValue = function (n) {
          this.$viewValue = n, this.$pristine && (this.$dirty = !0, this.$pristine = !1, i.removeClass(Ti).addClass(Si), c.$setDirty()), o(this.$parsers, function (e) {
            n = e(n);
          }), this.$modelValue !== n && (this.$modelValue = n, l(e, n), o(this.$viewChangeListeners, function (e) {
            try {
              e();
            } catch (n) {
              t(n);
            }
          }));
        };
        var p = this;
        e.$watch(function () {
          var t = u(e);
          if (p.$modelValue !== t) {
            var n = p.$formatters, r = n.length;
            for (p.$modelValue = t; r--;)
              t = n[r](t);
            p.$viewValue !== t && (p.$viewValue = t, p.$render());
          }
          return t;
        });
      }
    ], Ei = function () {
      return {
        require: [
          'ngModel',
          '^?form'
        ],
        controller: Ci,
        link: function (e, t, n, r) {
          var i = r[0], o = r[1] || hi;
          o.$addControl(i), e.$on('$destroy', function () {
            o.$removeControl(i);
          });
        }
      };
    }, Di = m({
      require: 'ngModel',
      link: function (e, t, n, r) {
        r.$viewChangeListeners.push(function () {
          e.$eval(n.ngChange);
        });
      }
    }), Mi = function () {
      return {
        require: '?ngModel',
        link: function (e, t, n, r) {
          if (r) {
            n.required = !0;
            var i = function (e) {
              return n.required && r.$isEmpty(e) ? (r.$setValidity('required', !1), void 0) : (r.$setValidity('required', !0), e);
            };
            r.$formatters.push(i), r.$parsers.unshift(i), n.$observe('required', function () {
              i(r.$viewValue);
            });
          }
        }
      };
    }, Pi = function () {
      return {
        require: 'ngModel',
        link: function (e, t, r, i) {
          var a = /\/(.*)\//.exec(r.ngList), s = a && new RegExp(a[1]) || r.ngList || ',', u = function (e) {
              if (!v(e)) {
                var t = [];
                return e && o(e.split(s), function (e) {
                  e && t.push($r(e));
                }), t;
              }
            };
          i.$parsers.push(u), i.$formatters.push(function (e) {
            return k(e) ? e.join(', ') : n;
          }), i.$isEmpty = function (e) {
            return !e || !e.length;
          };
        }
      };
    }, Ai = /^(true|false|\d+)$/, Oi = function () {
      return {
        priority: 100,
        compile: function (e, t) {
          return Ai.test(t.ngValue) ? function (e, t, n) {
            n.$set('value', e.$eval(n.ngValue));
          } : function (e, t, n) {
            e.$watch(n.ngValue, function (e) {
              n.$set('value', e);
            });
          };
        }
      };
    }, Ni = Jn(function (e, t, r) {
      t.addClass('ng-binding').data('$binding', r.ngBind), e.$watch(r.ngBind, function (e) {
        t.text(e == n ? '' : e);
      });
    }), ji = [
      '$interpolate',
      function (e) {
        return function (t, n, r) {
          var i = e(n.attr(r.$attr.ngBindTemplate));
          n.addClass('ng-binding').data('$binding', i), r.$observe('ngBindTemplate', function (e) {
            n.text(e);
          });
        };
      }
    ], Li = [
      '$sce',
      '$parse',
      function (e, t) {
        return function (n, r, i) {
          function o() {
            return (a(n) || '').toString();
          }
          r.addClass('ng-binding').data('$binding', i.ngBindHtml);
          var a = t(i.ngBindHtml);
          n.$watch(o, function () {
            r.html(e.getTrustedHtml(a(n)) || '');
          });
        };
      }
    ], Ri = or('', !0), Ii = or('Odd', 0), Fi = or('Even', 1), Hi = Jn({
      compile: function (e, t) {
        t.$set('ngCloak', n), e.removeClass('ng-cloak');
      }
    }), qi = [function () {
        return {
          scope: !0,
          controller: '@',
          priority: 500
        };
      }], Vi = {};
  o('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function (e) {
    var t = Rt('ng-' + e);
    Vi[t] = [
      '$parse',
      function (n) {
        return {
          compile: function (r, i) {
            var o = n(i[t]);
            return function (t, n) {
              n.on(ar(e), function (e) {
                t.$apply(function () {
                  o(t, { $event: e });
                });
              });
            };
          }
        };
      }
    ];
  });
  var Ui = [
      '$animate',
      function (e) {
        return {
          transclude: 'element',
          priority: 600,
          terminal: !0,
          restrict: 'A',
          $$tlb: !0,
          link: function (n, r, i, o, a) {
            var s, u;
            n.$watch(i.ngIf, function (o) {
              W(o) ? u || (u = n.$new(), a(u, function (n) {
                n[n.length++] = t.createComment(' end ngIf: ' + i.ngIf + ' '), s = { clone: n }, e.enter(n, r.parent(), r);
              })) : (u && (u.$destroy(), u = null), s && (e.leave(ot(s.clone)), s = null));
            });
          }
        };
      }
    ], Wi = [
      '$http',
      '$templateCache',
      '$anchorScroll',
      '$animate',
      '$sce',
      function (e, t, n, r, i) {
        return {
          restrict: 'ECA',
          priority: 400,
          terminal: !0,
          transclude: 'element',
          controller: wr.noop,
          compile: function (o, a) {
            var s = a.ngInclude || a.src, u = a.onload || '', l = a.autoscroll;
            return function (o, a, c, d, f) {
              var p, h, g = 0, m = function () {
                  p && (p.$destroy(), p = null), h && (r.leave(h), h = null);
                };
              o.$watch(i.parseAsResourceUrl(s), function (i) {
                var s = function () {
                    !y(l) || l && !o.$eval(l) || n();
                  }, c = ++g;
                i ? (e.get(i, { cache: t }).success(function (e) {
                  if (c === g) {
                    var t = o.$new();
                    d.template = e;
                    var n = f(t, function (e) {
                        m(), r.enter(e, null, a, s);
                      });
                    p = t, h = n, p.$emit('$includeContentLoaded'), o.$eval(u);
                  }
                }).error(function () {
                  c === g && m();
                }), o.$emit('$includeContentRequested')) : (m(), d.template = null);
              });
            };
          }
        };
      }
    ], Bi = [
      '$compile',
      function (e) {
        return {
          restrict: 'ECA',
          priority: -400,
          require: 'ngInclude',
          link: function (t, n, r, i) {
            n.html(i.template), e(n.contents())(t);
          }
        };
      }
    ], Yi = Jn({
      priority: 450,
      compile: function () {
        return {
          pre: function (e, t, n) {
            e.$eval(n.ngInit);
          }
        };
      }
    }), zi = Jn({
      terminal: !0,
      priority: 1000
    }), Gi = [
      '$locale',
      '$interpolate',
      function (e, t) {
        var n = /{}/g;
        return {
          restrict: 'EA',
          link: function (r, i, a) {
            var s = a.count, u = a.$attr.when && i.attr(a.$attr.when), l = a.offset || 0, c = r.$eval(u) || {}, d = {}, f = t.startSymbol(), p = t.endSymbol(), h = /^when(Minus)?(.+)$/;
            o(a, function (e, t) {
              h.test(t) && (c[ar(t.replace('when', '').replace('Minus', '-'))] = i.attr(a.$attr[t]));
            }), o(c, function (e, r) {
              d[r] = t(e.replace(n, f + s + '-' + l + p));
            }), r.$watch(function () {
              var t = parseFloat(r.$eval(s));
              return isNaN(t) ? '' : (t in c || (t = e.pluralCat(t - l)), d[t](r, i, !0));
            }, function (e) {
              i.text(e);
            });
          }
        };
      }
    ], Xi = [
      '$parse',
      '$animate',
      function (e, n) {
        function a(e) {
          return e.clone[0];
        }
        function s(e) {
          return e.clone[e.clone.length - 1];
        }
        var u = '$$NG_REMOVED', l = r('ngRepeat');
        return {
          transclude: 'element',
          priority: 1000,
          terminal: !0,
          $$tlb: !0,
          link: function (r, c, d, f, p) {
            var h, g, m, v, y, w, b, $, x, k = d.ngRepeat, _ = k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), T = { $id: Ct };
            if (!_)
              throw l('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', k);
            if (w = _[1], b = _[2], h = _[3], h ? (g = e(h), m = function (e, t, n) {
                return x && (T[x] = e), T[$] = t, T.$index = n, g(r, T);
              }) : (v = function (e, t) {
                return Ct(t);
              }, y = function (e) {
                return e;
              }), _ = w.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !_)
              throw l('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.', w);
            $ = _[3] || _[1], x = _[2];
            var S = {};
            r.$watchCollection(b, function (e) {
              var d, f, h, g, w, b, _, T, C, E, D, M, P = c[0], A = {}, O = [];
              if (i(e))
                E = e, C = m || v;
              else {
                C = m || y, E = [];
                for (b in e)
                  e.hasOwnProperty(b) && '$' != b.charAt(0) && E.push(b);
                E.sort();
              }
              for (g = E.length, f = O.length = E.length, d = 0; f > d; d++)
                if (b = e === E ? d : E[d], _ = e[b], T = C(b, _, d), rt(T, '`track by` id'), S.hasOwnProperty(T))
                  D = S[T], delete S[T], A[T] = D, O[d] = D;
                else {
                  if (A.hasOwnProperty(T))
                    throw o(O, function (e) {
                      e && e.scope && (S[e.id] = e);
                    }), l('dupes', 'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}', k, T);
                  O[d] = { id: T }, A[T] = !1;
                }
              for (b in S)
                S.hasOwnProperty(b) && (D = S[b], M = ot(D.clone), n.leave(M), o(M, function (e) {
                  e[u] = !0;
                }), D.scope.$destroy());
              for (d = 0, f = E.length; f > d; d++) {
                if (b = e === E ? d : E[d], _ = e[b], D = O[d], O[d - 1] && (P = s(O[d - 1])), D.scope) {
                  w = D.scope, h = P;
                  do
                    h = h.nextSibling;
                  while (h && h[u]);
                  a(D) != h && n.move(ot(D.clone), null, dr(P)), P = s(D);
                } else
                  w = r.$new();
                w[$] = _, x && (w[x] = b), w.$index = d, w.$first = 0 === d, w.$last = d === g - 1, w.$middle = !(w.$first || w.$last), w.$odd = !(w.$even = 0 === (1 & d)), D.scope || p(w, function (e) {
                  e[e.length++] = t.createComment(' end ngRepeat: ' + k + ' '), n.enter(e, null, dr(P)), P = e, D.scope = w, D.clone = e, A[D.id] = D;
                });
              }
              S = A;
            });
          }
        };
      }
    ], Ji = [
      '$animate',
      function (e) {
        return function (t, n, r) {
          t.$watch(r.ngShow, function (t) {
            e[W(t) ? 'removeClass' : 'addClass'](n, 'ng-hide');
          });
        };
      }
    ], Zi = [
      '$animate',
      function (e) {
        return function (t, n, r) {
          t.$watch(r.ngHide, function (t) {
            e[W(t) ? 'addClass' : 'removeClass'](n, 'ng-hide');
          });
        };
      }
    ], Ki = Jn(function (e, t, n) {
      e.$watch(n.ngStyle, function (e, n) {
        n && e !== n && o(n, function (e, n) {
          t.css(n, '');
        }), e && t.css(e);
      }, !0);
    }), Qi = [
      '$animate',
      function (e) {
        return {
          restrict: 'EA',
          require: 'ngSwitch',
          controller: [
            '$scope',
            function () {
              this.cases = {};
            }
          ],
          link: function (t, n, r, i) {
            var a, s, u = r.ngSwitch || r.on, l = [];
            t.$watch(u, function (n) {
              for (var u = 0, c = l.length; c > u; u++)
                l[u].$destroy(), e.leave(s[u]);
              s = [], l = [], (a = i.cases['!' + n] || i.cases['?']) && (t.$eval(r.change), o(a, function (n) {
                var r = t.$new();
                l.push(r), n.transclude(r, function (t) {
                  var r = n.element;
                  s.push(t), e.enter(t, r.parent(), r);
                });
              }));
            });
          }
        };
      }
    ], eo = Jn({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (e, t, n, r, i) {
        r.cases['!' + n.ngSwitchWhen] = r.cases['!' + n.ngSwitchWhen] || [], r.cases['!' + n.ngSwitchWhen].push({
          transclude: i,
          element: t
        });
      }
    }), to = Jn({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function (e, t, n, r, i) {
        r.cases['?'] = r.cases['?'] || [], r.cases['?'].push({
          transclude: i,
          element: t
        });
      }
    }), no = Jn({
      controller: [
        '$element',
        '$transclude',
        function (e, t) {
          if (!t)
            throw r('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}', B(e));
          this.$transclude = t;
        }
      ],
      link: function (e, t, n, r) {
        r.$transclude(function (e) {
          t.empty(), t.append(e);
        });
      }
    }), ro = [
      '$templateCache',
      function (e) {
        return {
          restrict: 'E',
          terminal: !0,
          compile: function (t, n) {
            if ('text/ng-template' == n.type) {
              var r = n.id, i = t[0].text;
              e.put(r, i);
            }
          }
        };
      }
    ], io = r('ngOptions'), oo = m({ terminal: !0 }), ao = [
      '$compile',
      '$parse',
      function (e, r) {
        var i = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, s = { $setViewValue: h };
        return {
          restrict: 'E',
          require: [
            'select',
            '?ngModel'
          ],
          controller: [
            '$element',
            '$scope',
            '$attrs',
            function (e, t, n) {
              var r, i, o = this, a = {}, u = s;
              o.databound = n.ngModel, o.init = function (e, t, n) {
                u = e, r = t, i = n;
              }, o.addOption = function (t) {
                rt(t, '"option value"'), a[t] = !0, u.$viewValue == t && (e.val(t), i.parent() && i.remove());
              }, o.removeOption = function (e) {
                this.hasOption(e) && (delete a[e], u.$viewValue == e && this.renderUnknownOption(e));
              }, o.renderUnknownOption = function (t) {
                var n = '? ' + Ct(t) + ' ?';
                i.val(n), e.prepend(i), e.val(n), i.prop('selected', !0);
              }, o.hasOption = function (e) {
                return a.hasOwnProperty(e);
              }, t.$on('$destroy', function () {
                o.renderUnknownOption = h;
              });
            }
          ],
          link: function (s, u, l, c) {
            function d(e, t, n, r) {
              n.$render = function () {
                var e = n.$viewValue;
                r.hasOption(e) ? (T.parent() && T.remove(), t.val(e), '' === e && h.prop('selected', !0)) : v(e) && h ? t.val('') : r.renderUnknownOption(e);
              }, t.on('change', function () {
                e.$apply(function () {
                  T.parent() && T.remove(), n.$setViewValue(t.val());
                });
              });
            }
            function f(e, t, n) {
              var r;
              n.$render = function () {
                var e = new Et(n.$viewValue);
                o(t.find('option'), function (t) {
                  t.selected = y(e.get(t.value));
                });
              }, e.$watch(function () {
                L(r, n.$viewValue) || (r = N(n.$viewValue), n.$render());
              }), t.on('change', function () {
                e.$apply(function () {
                  var e = [];
                  o(t.find('option'), function (t) {
                    t.selected && e.push(t.value);
                  }), n.$setViewValue(e);
                });
              });
            }
            function p(t, o, s) {
              function u() {
                var e, n, r, i, u, l, m, b, S, C, E, D, M, P, A, O = { '': [] }, N = [''], j = s.$modelValue, L = g(t) || [], R = f ? a(L) : L, I = {}, F = !1;
                if (w)
                  if (v && k(j)) {
                    F = new Et([]);
                    for (var H = 0; H < j.length; H++)
                      I[d] = j[H], F.put(v(t, I), j[H]);
                  } else
                    F = new Et(j);
                for (E = 0; S = R.length, S > E; E++) {
                  if (m = E, f) {
                    if (m = R[E], '$' === m.charAt(0))
                      continue;
                    I[f] = m;
                  }
                  if (I[d] = L[m], e = p(t, I) || '', (n = O[e]) || (n = O[e] = [], N.push(e)), w)
                    D = y(F.remove(v ? v(t, I) : h(t, I)));
                  else {
                    if (v) {
                      var q = {};
                      q[d] = j, D = v(t, q) === v(t, I);
                    } else
                      D = j === h(t, I);
                    F = F || D;
                  }
                  A = c(t, I), A = y(A) ? A : '', n.push({
                    id: v ? v(t, I) : f ? R[E] : E,
                    label: A,
                    selected: D
                  });
                }
                for (w || ($ || null === j ? O[''].unshift({
                    id: '',
                    label: '',
                    selected: !F
                  }) : F || O[''].unshift({
                    id: '?',
                    label: '',
                    selected: !0
                  })), C = 0, b = N.length; b > C; C++) {
                  for (e = N[C], n = O[e], T.length <= C ? (i = {
                      element: _.clone().attr('label', e),
                      label: n.label
                    }, u = [i], T.push(u), o.append(i.element)) : (u = T[C], i = u[0], i.label != e && i.element.attr('label', i.label = e)), M = null, E = 0, S = n.length; S > E; E++)
                    r = n[E], (l = u[E + 1]) ? (M = l.element, l.label !== r.label && M.text(l.label = r.label), l.id !== r.id && M.val(l.id = r.id), M[0].selected !== r.selected && M.prop('selected', l.selected = r.selected)) : ('' === r.id && $ ? P = $ : (P = x.clone()).val(r.id).attr('selected', r.selected).text(r.label), u.push(l = {
                      element: P,
                      label: r.label,
                      id: r.id,
                      selected: r.selected
                    }), M ? M.after(P) : i.element.append(P), M = P);
                  for (E++; u.length > E;)
                    u.pop().element.remove();
                }
                for (; T.length > C;)
                  T.pop()[0].element.remove();
              }
              var l;
              if (!(l = b.match(i)))
                throw io('iexp', 'Expected expression in form of \'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\' but got \'{0}\'. Element: {1}', b, B(o));
              var c = r(l[2] || l[1]), d = l[4] || l[6], f = l[5], p = r(l[3] || ''), h = r(l[2] ? l[1] : d), g = r(l[7]), m = l[8], v = m ? r(l[8]) : null, T = [[{
                      element: o,
                      label: ''
                    }]];
              $ && (e($)(t), $.removeClass('ng-scope'), $.remove()), o.empty(), o.on('change', function () {
                t.$apply(function () {
                  var e, r, i, a, u, l, c, p, m, y = g(t) || [], b = {};
                  if (w) {
                    for (i = [], l = 0, p = T.length; p > l; l++)
                      for (e = T[l], u = 1, c = e.length; c > u; u++)
                        if ((a = e[u].element)[0].selected) {
                          if (r = a.val(), f && (b[f] = r), v)
                            for (m = 0; m < y.length && (b[d] = y[m], v(t, b) != r); m++);
                          else
                            b[d] = y[r];
                          i.push(h(t, b));
                        }
                  } else if (r = o.val(), '?' == r)
                    i = n;
                  else if ('' === r)
                    i = null;
                  else if (v) {
                    for (m = 0; m < y.length; m++)
                      if (b[d] = y[m], v(t, b) == r) {
                        i = h(t, b);
                        break;
                      }
                  } else
                    b[d] = y[r], f && (b[f] = r), i = h(t, b);
                  s.$setViewValue(i);
                });
              }), s.$render = u, t.$watch(u);
            }
            if (c[1]) {
              for (var h, g = c[0], m = c[1], w = l.multiple, b = l.ngOptions, $ = !1, x = dr(t.createElement('option')), _ = dr(t.createElement('optgroup')), T = x.clone(), S = 0, C = u.children(), E = C.length; E > S; S++)
                if ('' === C[S].value) {
                  h = $ = C.eq(S);
                  break;
                }
              g.init(m, $, T), w && (m.$isEmpty = function (e) {
                return !e || 0 === e.length;
              }), b ? p(s, u, m) : w ? f(s, u, m) : d(s, u, m, g);
            }
          }
        };
      }
    ], so = [
      '$interpolate',
      function (e) {
        var t = {
            addOption: h,
            removeOption: h
          };
        return {
          restrict: 'E',
          priority: 100,
          compile: function (n, r) {
            if (v(r.value)) {
              var i = e(n.text(), !0);
              i || r.$set('value', n.text());
            }
            return function (e, n, r) {
              var o = '$selectController', a = n.parent(), s = a.data(o) || a.parent().data(o);
              s && s.databound ? n.prop('selected', !1) : s = t, i ? e.$watch(i, function (e, t) {
                r.$set('value', e), e !== t && s.removeOption(t), s.addOption(e);
              }) : s.addOption(r.value), n.on('$destroy', function () {
                s.removeOption(r.value);
              });
            };
          }
        };
      }
    ], uo = m({
      restrict: 'E',
      terminal: !0
    });
  et(), st(wr), dr(t).ready(function () {
    Z(t, K);
  });
}(window, document), !angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
var AngularFire, AngularFireAuth;
angular.module('firebase', []).value('Firebase', Firebase), angular.module('firebase').factory('$firebase', [
  '$q',
  '$parse',
  '$timeout',
  function (e, t, n) {
    return function (r) {
      var i = new AngularFire(e, t, n, r);
      return i.construct();
    };
  }
]), angular.module('firebase').filter('orderByPriority', function () {
  return function (e) {
    if (!e.$getIndex || 'function' != typeof e.$getIndex) {
      var t = Object.prototype.toString.call(e);
      if ('object' == typeof e && '[object Object]' == t) {
        var n = [];
        for (var r in e)
          e.hasOwnProperty(r) && n.push(e[r]);
        return n;
      }
      return e;
    }
    var i = [], o = e.$getIndex();
    if (o.length <= 0)
      return e;
    for (var a = 0; a < o.length; a++) {
      var s = e[o[a]];
      s && (s.$id = o[a], i.push(s));
    }
    return i;
  };
}), AngularFire = function (e, t, n, r) {
  if (this._q = e, this._bound = !1, this._loaded = !1, this._parse = t, this._timeout = n, this._index = [], this._onChange = [], this._onLoaded = [], 'string' == typeof r)
    throw new Error('Please provide a Firebase reference instead of a URL, eg: new Firebase(url)');
  this._fRef = r;
}, AngularFire.prototype = {
  construct: function () {
    var e = this, t = {};
    return t.$bind = function (t, n) {
      return e._bind(t, n);
    }, t.$add = function (t, n) {
      var r;
      return r = 'object' == typeof t ? e._fRef.ref().push(e._parseObject(t), n) : e._fRef.ref().push(t, n);
    }, t.$save = function (t) {
      t ? e._fRef.ref().child(t).set(e._parseObject(e._object[t])) : e._fRef.ref().set(e._parseObject(e._object));
    }, t.$set = function (t) {
      e._fRef.ref().set(t);
    }, t.$remove = function (t) {
      t ? e._fRef.ref().child(t).remove() : e._fRef.ref().remove();
    }, t.$child = function (t) {
      var n = new AngularFire(e._q, e._parse, e._timeout, e._fRef.ref().child(t));
      return n.construct();
    }, t.$on = function (t, n) {
      switch (t) {
      case 'change':
        e._onChange.push(n);
        break;
      case 'loaded':
        e._onLoaded.push(n);
        break;
      default:
        throw new Error('Invalid event type ' + t + ' specified');
      }
    }, t.$getIndex = function () {
      return angular.copy(e._index);
    }, e._object = t, e._getInitialValue(), e._object;
  },
  _getInitialValue: function () {
    var e = this, t = function (n) {
        var r = n.val();
        if (null === r && e._bound) {
          var i = e._parseObject(e._parse(e._name)(e._scope));
          switch (typeof i) {
          case 'string':
          case 'undefined':
            r = '';
            break;
          case 'number':
            r = 0;
            break;
          case 'boolean':
            r = !1;
          }
        }
        switch (typeof r) {
        case 'string':
        case 'number':
        case 'boolean':
          e._updatePrimitive(r);
          break;
        case 'object':
          e._getChildValues(), e._fRef.off('value', t);
          break;
        default:
          throw new Error('Unexpected type from remote data ' + typeof r);
        }
        e._loaded = !0, e._broadcastEvent('loaded', r);
      };
    e._fRef.on('value', t);
  },
  _getChildValues: function () {
    function e(e, n) {
      var r = e.name(), i = e.val(), o = t._index.indexOf(r);
      if (-1 !== o && t._index.splice(o, 1), n) {
        var a = t._index.indexOf(n);
        t._index.splice(a + 1, 0, r);
      } else
        t._index.unshift(r);
      null !== e.getPriority() && (i.$priority = e.getPriority()), t._updateModel(r, i);
    }
    var t = this;
    t._fRef.on('child_added', e), t._fRef.on('child_moved', e), t._fRef.on('child_changed', e), t._fRef.on('child_removed', function (e) {
      var n = e.name(), r = t._index.indexOf(n);
      t._index.splice(r, 1), t._updateModel(n, null);
    });
  },
  _updateModel: function (e, t) {
    var n = this;
    n._timeout(function () {
      if (null == t ? delete n._object[e] : n._object[e] = t, n._broadcastEvent('change'), n._bound) {
        var r = n._object, i = n._parse(n._name)(n._scope);
        angular.equals(r, i) || n._parse(n._name).assign(n._scope, angular.copy(r));
      }
    });
  },
  _updatePrimitive: function (e) {
    var t = this;
    t._timeout(function () {
      if (t._object.$value && angular.equals(t._object.$value, e) || (t._object.$value = e), t._broadcastEvent('change'), t._bound) {
        var n = t._parseObject(t._parse(t._name)(t._scope));
        angular.equals(n, e) || t._parse(t._name).assign(t._scope, e);
      }
    });
  },
  _broadcastEvent: function (e, t) {
    var n;
    switch (e) {
    case 'change':
      n = this._onChange;
      break;
    case 'loaded':
      n = this._onLoaded;
      break;
    default:
      n = [];
    }
    if (n.length > 0)
      for (var r = 0; r < n.length; r++)
        'function' == typeof n[r] && n[r](t);
  },
  _bind: function (e, t) {
    var n = this, r = n._q.defer();
    n._name = t, n._bound = !0, n._scope = e;
    var i = n._parse(t)(e);
    void 0 !== i && 'object' == typeof i && n._fRef.update(n._parseObject(i));
    var o = e.$watch(t, function () {
        var r = n._parseObject(n._parse(t)(e));
        n._object.$value && angular.equals(r, n._object.$value) || angular.equals(r, n._object) || void 0 !== r && n._loaded && (n._fRef.set ? n._fRef.set(r) : n._fRef.ref().update(r));
      }, !0);
    return e.$on('$destroy', function () {
      o();
    }), n._fRef.once('value', function () {
      r.resolve(o);
    }), r.promise;
  },
  _parseObject: function (e) {
    function t(e) {
      for (var n in e)
        e.hasOwnProperty(n) && ('$priority' == n ? (e['.priority'] = e.$priority, delete e.$priority) : 'object' == typeof e[n] && t(e[n]));
      return e;
    }
    var n = t(angular.copy(e));
    return angular.fromJson(angular.toJson(n));
  }
}, angular.module('firebase').factory('$firebaseAuth', [
  '$q',
  '$timeout',
  '$injector',
  '$rootScope',
  '$location',
  function (e, t, n, r, i) {
    return function (o, a) {
      var s = new AngularFireAuth(e, t, n, r, i, o, a);
      return s.construct();
    };
  }
]), AngularFireAuth = function (e, t, n, r, i, o, a) {
  if (this._q = e, this._timeout = t, this._injector = n, this._location = i, this._rootScope = r, this._route = null, this._injector.has('$route') && (this._route = this._injector.get('$route')), this._cb = function () {
    }, this._options = a || {}, this._options.callback && 'function' == typeof this._options.callback && (this._cb = a.callback), this._deferred = null, this._redirectTo = null, this._authenticated = !1, 'string' == typeof o)
    throw new Error('Please provide a Firebase reference instead of a URL, eg: new Firebase(url)');
  this._fRef = o;
}, AngularFireAuth.prototype = {
  construct: function () {
    var e = this, t = {
        user: null,
        $login: e.login.bind(e),
        $logout: e.logout.bind(e),
        $createUser: e.createUser.bind(e)
      };
    if (e._options.path && null !== e._route && (e._route.current && e._authRequiredRedirect(e._route.current, e._options.path), e._rootScope.$on('$routeChangeStart', function (t, n) {
        e._authRequiredRedirect(n, e._options.path);
      })), e._object = t, e._options.simple !== !1) {
      if (!window.FirebaseSimpleLogin) {
        var n = new Error('FirebaseSimpleLogin undefined, did you include firebase-simple-login.js?');
        return e._rootScope.$broadcast('$firebaseAuth:error', n), void 0;
      }
      var r = new FirebaseSimpleLogin(e._fRef, function (t, n) {
          e._cb(t, n), t ? (e._deferred && (e._deferred.reject(t), e._deferred = null), e._rootScope.$broadcast('$firebaseAuth:error', t)) : n ? (e._deferred && (e._deferred.resolve(n), e._deferred = null), e._loggedIn(n)) : e._loggedOut();
        });
      return e._authClient = r, e._object;
    }
  },
  login: function (e, t) {
    var n = this, r = n._q.defer();
    switch (e) {
    case 'github':
    case 'persona':
    case 'twitter':
    case 'facebook':
    case 'password':
    case 'anonymous':
      if (n._authClient)
        n._deferred = r, n._authClient.login(e, t);
      else {
        var i = new Error('Simple Login not initialized');
        r.reject(i), n._rootScope.$broadcast('$firebaseAuth:error', i);
      }
      break;
    default:
      try {
        var o = n._deconstructJWT(e);
        n._fRef.auth(e, function (e) {
          e ? (r.reject(e), n._rootScope.$broadcast('$firebaseAuth:error', e)) : (n._deferred = r, n._loggedIn(o));
        });
      } catch (a) {
        r.reject(a), n._rootScope.$broadcast('$firebaseAuth:error', a);
      }
    }
    return r.promise;
  },
  logout: function () {
    this._authClient ? this._authClient.logout() : (this._fRef.unauth(), this._loggedOut());
  },
  createUser: function (e, t, n, r) {
    var i = this;
    i._authClient.createUser(e, t, function (o, a) {
      try {
        o ? i._rootScope.$broadcast('$firebaseAuth:error', o) : r || i.login('password', {
          email: e,
          password: t
        });
      } catch (s) {
        i._rootScope.$broadcast('$firebaseAuth:error', s);
      }
      n && i._timeout(function () {
        n(o, a);
      });
    });
  },
  changePassword: function (e, t, n, r) {
    var i = this;
    i._authClient.changePassword(e, t, n, function (e, t) {
      e && i._rootScope.$broadcast('$firebaseAuth:error', e), r && i._timeout(function () {
        r(e, t);
      });
    });
  },
  _loggedIn: function (e) {
    var t = this;
    t._timeout(function () {
      t._object.user = e, t._authenticated = !0, t._rootScope.$broadcast('$firebaseAuth:login', e), t._redirectTo && (t._location.replace(), t._location.path(t._redirectTo), t._redirectTo = null);
    });
  },
  _loggedOut: function () {
    var e = this;
    e._timeout(function () {
      e._object.user = null, e._authenticated = !1, e._rootScope.$broadcast('$firebaseAuth:logout');
    });
  },
  _authRequiredRedirect: function (e, t) {
    e.authRequired && !this._authenticated && (this._redirectTo = void 0 === e.pathTo ? this._location.path() : e.pathTo === t ? '/' : e.pathTo, this._location.replace(), this._location.path(t));
  },
  _decodeBase64: function (e) {
    for (var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', n = '', r = '', i = 8, o = 0; o < e.length && '=' != e[o]; ++o) {
      var a = t.indexOf(e.charAt(o));
      if (-1 == a)
        throw new Error('Not base64.');
      for (var s = a.toString(2); s.length < 6;)
        s = '0' + s;
      for (r += s; r.length >= i;) {
        var u = r.slice(0, i);
        r = r.slice(i), n += String.fromCharCode(parseInt(u, 2));
      }
    }
    return n;
  },
  _deconstructJWT: function (e) {
    var t = e.split('.');
    if (!t instanceof Array || 3 !== t.length)
      throw new Error('Invalid JWT');
    var n = '', r = t[1];
    return n = window.atob ? window.atob(r) : this._decodeBase64(r), JSON.parse(decodeURIComponent(escape(n)));
  }
}, !function (e) {
  'use strict';
  var t = window.angulartics || (window.angulartics = {});
  t.waitForVendorApi = function (e, n, r) {
    Object.prototype.hasOwnProperty.call(window, e) ? r(window[e]) : setTimeout(function () {
      t.waitForVendorApi(e, n, r);
    }, n);
  }, e.module('angulartics', []).provider('$analytics', function () {
    var t = {
        pageTracking: {
          autoTrackFirstPage: !0,
          autoTrackVirtualPages: !0,
          trackRelativePath: !1,
          basePath: '',
          bufferFlushDelay: 1000
        },
        eventTracking: { bufferFlushDelay: 1000 }
      }, n = {
        pageviews: [],
        events: []
      }, r = function (e) {
        n.pageviews.push(e);
      }, i = function (e, t) {
        n.events.push({
          name: e,
          properties: t
        });
      }, o = {
        settings: t,
        pageTrack: r,
        eventTrack: i
      }, a = function (r) {
        o.pageTrack = r, e.forEach(n.pageviews, function (e, n) {
          setTimeout(function () {
            o.pageTrack(e);
          }, n * t.pageTracking.bufferFlushDelay);
        });
      }, s = function (r) {
        o.eventTrack = r, e.forEach(n.events, function (e, n) {
          setTimeout(function () {
            o.eventTrack(e.name, e.properties);
          }, n * t.eventTracking.bufferFlushDelay);
        });
      };
    return {
      $get: function () {
        return o;
      },
      settings: t,
      virtualPageviews: function (e) {
        this.settings.pageTracking.autoTrackVirtualPages = e;
      },
      firstPageview: function (e) {
        this.settings.pageTracking.autoTrackFirstPage = e;
      },
      withBase: function (t) {
        this.settings.pageTracking.basePath = t ? e.element('base').attr('href').slice(0, -1) : '';
      },
      registerPageTrack: a,
      registerEventTrack: s
    };
  }).run([
    '$rootScope',
    '$location',
    '$analytics',
    '$injector',
    function (e, t, n, r) {
      n.settings.pageTracking.autoTrackFirstPage && n.pageTrack(n.settings.trackRelativePath ? t.url() : t.absUrl()), n.settings.pageTracking.autoTrackVirtualPages && (r.has('$route') && e.$on('$routeChangeSuccess', function (e, r) {
        if (!r || !(r.$$route || r).redirectTo) {
          var i = n.settings.pageTracking.basePath + t.url();
          n.pageTrack(i);
        }
      }), r.has('$state') && e.$on('$stateChangeSuccess', function () {
        var e = n.settings.pageTracking.basePath + t.url();
        n.pageTrack(e);
      }));
    }
  ]).directive('analyticsOn', [
    '$analytics',
    function (t) {
      function n(e) {
        return [
          'a:',
          'button:',
          'button:button',
          'button:submit',
          'input:button',
          'input:submit'
        ].indexOf(e.tagName.toLowerCase() + ':' + (e.type || '')) >= 0;
      }
      function r(e) {
        return n(e) ? 'click' : 'click';
      }
      function i(e) {
        return n(e) ? e.innerText || e.value : e.id || e.name || e.tagName;
      }
      function o(e) {
        return 'analytics' === e.substr(0, 9) && -1 === [
          'On',
          'Event'
        ].indexOf(e.substr(9));
      }
      return {
        restrict: 'A',
        scope: !1,
        link: function (n, a, s) {
          var u = s.analyticsOn || r(a[0]);
          e.element(a[0]).bind(u, function () {
            var n = s.analyticsEvent || i(a[0]), r = {};
            e.forEach(s.$attr, function (e, t) {
              o(t) && (r[t.slice(9).toLowerCase()] = s[t]);
            }), t.eventTrack(n, r);
          });
        }
      };
    }
  ]);
}(angular), !function (e) {
  'use strict';
  e.module('angulartics.google.analytics', ['angulartics']).config([
    '$analyticsProvider',
    function (e) {
      e.settings.trackRelativePath = !0, e.registerPageTrack(function (e) {
        window._gaq && _gaq.push([
          '_trackPageview',
          e
        ]), window.ga && ga('send', 'pageview', e);
      }), e.registerEventTrack(function (e, t) {
        if (t.value) {
          var n = parseInt(t.value, 10);
          t.value = isNaN(n) ? 0 : n;
        }
        window._gaq ? _gaq.push([
          '_trackEvent',
          t.category,
          e,
          t.label,
          t.value,
          t.noninteraction
        ]) : window.ga && (t.noninteraction ? ga('send', 'event', t.category, e, t.label, t.value, { nonInteraction: 1 }) : ga('send', 'event', t.category, e, t.label, t.value));
      });
    }
  ]);
}(angular), !function (e) {
  'use strict';
  e.module('angulartics.google.analytics.cordova', ['angulartics']).provider('googleAnalyticsCordova', function () {
    var t = [
        '$q',
        '$log',
        'ready',
        'debug',
        'trackingId',
        'period',
        function (e, t, n, r, i, o) {
          function a() {
            r && t.info(arguments);
          }
          function s(e) {
            r && t.error(e);
          }
          var u = e.defer(), l = !1;
          window.addEventListener('deviceReady', function () {
            l = !0, u.resolve();
          }), setTimeout(function () {
            l || u.resolve();
          }, 3000), this.init = function () {
            return u.promise.then(function () {
              var e = window.plugins && window.plugins.gaPlugin;
              e ? e.init(function () {
                n(e, a, s);
              }, s, i, o || 10) : r && t.error('Google Analytics for Cordova is not available');
            });
          };
        }
      ];
    return {
      $get: [
        '$injector',
        function (n) {
          return n.instantiate(t, {
            ready: this._ready || e.noop,
            debug: this.debug,
            trackingId: this.trackingId,
            period: this.period
          });
        }
      ],
      ready: function (e) {
        this._ready = e;
      }
    };
  }).config([
    '$analyticsProvider',
    'googleAnalyticsCordovaProvider',
    function (e, t) {
      t.ready(function (t, n, r) {
        e.registerPageTrack(function (e) {
          t.trackPage(n, r, e);
        }), e.registerEventTrack(function (e, i) {
          t.trackEvent(n, r, i.category, e, i.label, i.value);
        });
      });
    }
  ]).run([
    'googleAnalyticsCordova',
    function (e) {
      e.init();
    }
  ]);
}(angular), 'undefined' != typeof module && 'undefined' != typeof exports && module.exports === exports && (module.exports = 'ui.router'), function (e, t, n) {
  'use strict';
  function r(e, t) {
    return M(new (M(function () {
    }, { prototype: e }))(), t);
  }
  function i(e) {
    return D(arguments, function (t) {
      t !== e && D(t, function (t, n) {
        e.hasOwnProperty(n) || (e[n] = t);
      });
    }), e;
  }
  function o(e, t) {
    var n = [];
    for (var r in e.path)
      if ('' !== e.path[r]) {
        if (!t.path[r])
          break;
        n.push(e.path[r]);
      }
    return n;
  }
  function a(e, t) {
    if (Array.prototype.indexOf)
      return e.indexOf(t, Number(arguments[2]) || 0);
    var n = e.length >>> 0, r = Number(arguments[2]) || 0;
    for (r = 0 > r ? Math.ceil(r) : Math.floor(r), 0 > r && (r += n); n > r; r++)
      if (r in e && e[r] === t)
        return r;
    return -1;
  }
  function s(e, t, n, r) {
    var i, s = o(n, r), u = {}, l = [];
    for (var c in s)
      if (s[c].params && s[c].params.length) {
        i = s[c].params;
        for (var d in i)
          a(l, i[d]) >= 0 || (l.push(i[d]), u[i[d]] = e[i[d]]);
      }
    return M({}, u, t);
  }
  function u(e, t) {
    var n = {};
    return D(e, function (e) {
      var r = t[e];
      n[e] = null != r ? String(r) : null;
    }), n;
  }
  function l(e, t, n) {
    if (!n) {
      n = [];
      for (var r in e)
        n.push(r);
    }
    for (var i = 0; i < n.length; i++) {
      var o = n[i];
      if (e[o] != t[o])
        return !1;
    }
    return !0;
  }
  function c(e, t) {
    var n = {};
    return D(e, function (e) {
      n[e] = t[e];
    }), n;
  }
  function d(e, t) {
    var r = 1, o = 2, a = {}, s = [], u = a, l = M(e.when(a), {
        $$promises: a,
        $$values: a
      });
    this.study = function (a) {
      function c(e, n) {
        if (h[n] !== o) {
          if (p.push(n), h[n] === r)
            throw p.splice(0, p.indexOf(n)), new Error('Cyclic dependency: ' + p.join(' -> '));
          if (h[n] = r, S(e))
            f.push(n, [function () {
                return t.get(e);
              }], s);
          else {
            var i = t.annotate(e);
            D(i, function (e) {
              e !== n && a.hasOwnProperty(e) && c(a[e], e);
            }), f.push(n, e, i);
          }
          p.pop(), h[n] = o;
        }
      }
      function d(e) {
        return C(e) && e.then && e.$$promises;
      }
      if (!C(a))
        throw new Error('\'invocables\' must be an object');
      var f = [], p = [], h = {};
      return D(a, c), a = p = h = null, function (r, o, a) {
        function s() {
          --y || (w || i(v, o.$$values), g.$$values = v, g.$$promises = !0, h.resolve(v));
        }
        function c(e) {
          g.$$failure = e, h.reject(e);
        }
        function p(n, i, o) {
          function u(e) {
            d.reject(e), c(e);
          }
          function l() {
            if (!_(g.$$failure))
              try {
                d.resolve(t.invoke(i, a, v)), d.promise.then(function (e) {
                  v[n] = e, s();
                }, u);
              } catch (e) {
                u(e);
              }
          }
          var d = e.defer(), f = 0;
          D(o, function (e) {
            m.hasOwnProperty(e) && !r.hasOwnProperty(e) && (f++, m[e].then(function (t) {
              v[e] = t, --f || l();
            }, u));
          }), f || l(), m[n] = d.promise;
        }
        if (d(r) && a === n && (a = o, o = r, r = null), r) {
          if (!C(r))
            throw new Error('\'locals\' must be an object');
        } else
          r = u;
        if (o) {
          if (!d(o))
            throw new Error('\'parent\' must be a promise returned by $resolve.resolve()');
        } else
          o = l;
        var h = e.defer(), g = h.promise, m = g.$$promises = {}, v = M({}, r), y = 1 + f.length / 3, w = !1;
        if (_(o.$$failure))
          return c(o.$$failure), g;
        o.$$values ? (w = i(v, o.$$values), s()) : (M(m, o.$$promises), o.then(s, c));
        for (var b = 0, $ = f.length; $ > b; b += 3)
          r.hasOwnProperty(f[b]) ? s() : p(f[b], f[b + 1], f[b + 2]);
        return g;
      };
    }, this.resolve = function (e, t, n, r) {
      return this.study(e)(t, n, r);
    };
  }
  function f(e, t, n) {
    this.fromConfig = function (e, t, n) {
      return _(e.template) ? this.fromString(e.template, t) : _(e.templateUrl) ? this.fromUrl(e.templateUrl, t) : _(e.templateProvider) ? this.fromProvider(e.templateProvider, t, n) : null;
    }, this.fromString = function (e, t) {
      return T(e) ? e(t) : e;
    }, this.fromUrl = function (n, r) {
      return T(n) && (n = n(r)), null == n ? null : e.get(n, { cache: t }).then(function (e) {
        return e.data;
      });
    }, this.fromProvider = function (e, t, r) {
      return n.invoke(e, null, r || { params: t });
    };
  }
  function p(e) {
    function t(t) {
      if (!/^\w+(-+\w+)*$/.test(t))
        throw new Error('Invalid parameter name \'' + t + '\' in pattern \'' + e + '\'');
      if (o[t])
        throw new Error('Duplicate parameter name \'' + t + '\' in pattern \'' + e + '\'');
      o[t] = !0, l.push(t);
    }
    function n(e) {
      return e.replace(/[\\\[\]\^$*+?.()|{}]/g, '\\$&');
    }
    var r, i = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g, o = {}, a = '^', s = 0, u = this.segments = [], l = this.params = [];
    this.source = e;
    for (var c, d, f; (r = i.exec(e)) && (c = r[2] || r[3], d = r[4] || ('*' == r[1] ? '.*' : '[^/]*'), f = e.substring(s, r.index), !(f.indexOf('?') >= 0));)
      a += n(f) + '(' + d + ')', t(c), u.push(f), s = i.lastIndex;
    f = e.substring(s);
    var p = f.indexOf('?');
    if (p >= 0) {
      var h = this.sourceSearch = f.substring(p);
      f = f.substring(0, p), this.sourcePath = e.substring(0, s + p), D(h.substring(1).split(/[&?]/), t);
    } else
      this.sourcePath = e, this.sourceSearch = '';
    a += n(f) + '$', u.push(f), this.regexp = new RegExp(a), this.prefix = u[0];
  }
  function h() {
    this.compile = function (e) {
      return new p(e);
    }, this.isMatcher = function (e) {
      return C(e) && T(e.exec) && T(e.format) && T(e.concat);
    }, this.$get = function () {
      return this;
    };
  }
  function g(e) {
    function t(e) {
      var t = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(e.source);
      return null != t ? t[1].replace(/\\(.)/g, '$1') : '';
    }
    function n(e, t) {
      return e.replace(/\$(\$|\d{1,2})/, function (e, n) {
        return t['$' === n ? 0 : Number(n)];
      });
    }
    function r(e, t, n) {
      if (!n)
        return !1;
      var r = e.invoke(t, t, { $match: n });
      return _(r) ? r : !0;
    }
    var i = [], o = null;
    this.rule = function (e) {
      if (!T(e))
        throw new Error('\'rule\' must be a function');
      return i.push(e), this;
    }, this.otherwise = function (e) {
      if (S(e)) {
        var t = e;
        e = function () {
          return t;
        };
      } else if (!T(e))
        throw new Error('\'rule\' must be a function');
      return o = e, this;
    }, this.when = function (i, o) {
      var a, s = S(o);
      if (S(i) && (i = e.compile(i)), !s && !T(o) && !E(o))
        throw new Error('invalid \'handler\' in when()');
      var u = {
          matcher: function (t, n) {
            return s && (a = e.compile(n), n = [
              '$match',
              function (e) {
                return a.format(e);
              }
            ]), M(function (e, i) {
              return r(e, n, t.exec(i.path(), i.search()));
            }, { prefix: S(t.prefix) ? t.prefix : '' });
          },
          regex: function (e, i) {
            if (e.global || e.sticky)
              throw new Error('when() RegExp must not be global or sticky');
            return s && (a = i, i = [
              '$match',
              function (e) {
                return n(a, e);
              }
            ]), M(function (t, n) {
              return r(t, i, e.exec(n.path()));
            }, { prefix: t(e) });
          }
        }, l = {
          matcher: e.isMatcher(i),
          regex: i instanceof RegExp
        };
      for (var c in l)
        if (l[c])
          return this.rule(u[c](i, o));
      throw new Error('invalid \'what\' in when()');
    }, this.$get = [
      '$location',
      '$rootScope',
      '$injector',
      function (e, t, n) {
        function r(t) {
          function r(t) {
            var r = t(n, e);
            return r ? (S(r) && e.replace().url(r), !0) : !1;
          }
          if (!t || !t.defaultPrevented) {
            var a, s = i.length;
            for (a = 0; s > a; a++)
              if (r(i[a]))
                return;
            o && r(o);
          }
        }
        return t.$on('$locationChangeSuccess', r), {
          sync: function () {
            r();
          }
        };
      }
    ];
  }
  function m(e, i, o) {
    function a(e) {
      return 0 === e.indexOf('.') || 0 === e.indexOf('^');
    }
    function d(e, t) {
      var r = S(e), i = r ? e : e.name, o = a(i);
      if (o) {
        if (!t)
          throw new Error('No reference point given for path \'' + i + '\'');
        for (var s = i.split('.'), u = 0, l = s.length, c = t; l > u; u++)
          if ('' !== s[u] || 0 !== u) {
            if ('^' !== s[u])
              break;
            if (!c.parent)
              throw new Error('Path \'' + i + '\' not valid for state \'' + t.name + '\'');
            c = c.parent;
          } else
            c = t;
        s = s.slice(u).join('.'), i = c.name + (c.name && s ? '.' : '') + s;
      }
      var d = b[i];
      return !d || !r && (r || d !== e && d.self !== e) ? n : d;
    }
    function f(e, t) {
      $[e] || ($[e] = []), $[e].push(t);
    }
    function p(t) {
      t = r(t, {
        self: t,
        resolve: t.resolve || {},
        toString: function () {
          return this.name;
        }
      });
      var n = t.name;
      if (!S(n) || n.indexOf('@') >= 0)
        throw new Error('State must have a valid name');
      if (b.hasOwnProperty(n))
        throw new Error('State \'' + n + '\'\' is already defined');
      var i = -1 !== n.indexOf('.') ? n.substring(0, n.lastIndexOf('.')) : S(t.parent) ? t.parent : '';
      if (i && !b[i])
        return f(i, t.self);
      for (var o in k)
        T(k[o]) && (t[o] = k[o](t, k.$delegates[o]));
      if (b[n] = t, !t[x] && t.url && e.when(t.url, [
          '$match',
          '$stateParams',
          function (e, n) {
            w.$current.navigable == t && l(e, n) || w.transitionTo(t, e, { location: !1 });
          }
        ]), $[n])
        for (var a = 0; a < $[n].length; a++)
          p($[n][a]);
      return t;
    }
    function h(e, t) {
      return S(e) && !_(t) ? k[e] : T(t) && S(e) ? (k[e] && !k.$delegates[e] && (k.$delegates[e] = k[e]), k[e] = t, this) : this;
    }
    function g(e, t) {
      return C(e) ? t = e : t.name = e, p(t), this;
    }
    function m(e, i, a, f, p, h, g) {
      function m() {
        g.url() !== O && (g.url(O), g.replace());
      }
      function $(e, n, r, o, s) {
        var u = r ? n : c(e.params, n), l = { $stateParams: u };
        s.resolve = p.resolve(e.resolve, l, s.resolve, e);
        var d = [s.resolve.then(function (e) {
              s.globals = e;
            })];
        return o && d.push(o), D(e.views, function (n, r) {
          var i = n.resolve && n.resolve !== e.resolve ? n.resolve : {};
          i.$template = [function () {
              return a.load(r, {
                view: n,
                locals: l,
                params: u,
                notify: !1
              }) || '';
            }], d.push(p.resolve(i, l, s.resolve, e).then(function (o) {
            if (T(n.controllerProvider) || E(n.controllerProvider)) {
              var a = t.extend({}, i, l);
              o.$$controller = f.invoke(n.controllerProvider, null, a);
            } else
              o.$$controller = n.controller;
            o.$$state = e, s[r] = o;
          }));
        }), i.all(d).then(function () {
          return s;
        });
      }
      var k = i.reject(new Error('transition superseded')), S = i.reject(new Error('transition prevented')), C = i.reject(new Error('transition aborted')), A = i.reject(new Error('transition failed')), O = g.url();
      return y.locals = {
        resolve: null,
        globals: { $stateParams: {} }
      }, w = {
        params: {},
        current: y.self,
        $current: y,
        transition: null
      }, w.reload = function () {
        w.transitionTo(w.current, h, {
          reload: !0,
          inherit: !1,
          notify: !1
        });
      }, w.go = function (e, t, n) {
        return this.transitionTo(e, t, M({
          inherit: !0,
          relative: w.$current
        }, n));
      }, w.transitionTo = function (t, n, o) {
        n = n || {}, o = M({
          location: !0,
          inherit: !1,
          relative: null,
          notify: !0,
          reload: !1,
          $retry: !1
        }, o || {});
        var a, c = w.$current, p = w.params, b = c.path, T = d(t, o.relative);
        if (!_(T)) {
          var E = {
              to: t,
              toParams: n,
              options: o
            };
          if (a = e.$broadcast('$stateNotFound', E, c.self, p), a.defaultPrevented)
            return m(), C;
          if (a.retry) {
            if (o.$retry)
              return m(), A;
            var D = w.transition = i.when(a.retry);
            return D.then(function () {
              return D !== w.transition ? k : (E.options.$retry = !0, w.transitionTo(E.to, E.toParams, E.options));
            }, function () {
              return C;
            }), m(), D;
          }
          if (t = E.to, n = E.toParams, o = E.options, T = d(t, o.relative), !_(T)) {
            if (o.relative)
              throw new Error('Could not resolve \'' + t + '\' from state \'' + o.relative + '\'');
            throw new Error('No such state \'' + t + '\'');
          }
        }
        if (T[x])
          throw new Error('Cannot transition to abstract state \'' + t + '\'');
        o.inherit && (n = s(h, n || {}, w.$current, T)), t = T;
        var N, j, L = t.path, R = y.locals, I = [];
        for (N = 0, j = L[N]; j && j === b[N] && l(n, p, j.ownParams) && !o.reload; N++, j = L[N])
          R = I[N] = j.locals;
        if (v(t, c, R, o))
          return t.self.reloadOnSearch !== !1 && m(), w.transition = null, i.when(w.current);
        if (n = u(t.params, n || {}), o.notify && (a = e.$broadcast('$stateChangeStart', t.self, n, c.self, p), a.defaultPrevented))
          return m(), S;
        for (var F = i.when(R), H = N; H < L.length; H++, j = L[H])
          R = I[H] = r(R), F = $(j, n, j === t, F, R);
        var q = w.transition = F.then(function () {
            var r, i, a;
            if (w.transition !== q)
              return k;
            for (r = b.length - 1; r >= N; r--)
              a = b[r], a.self.onExit && f.invoke(a.self.onExit, a.self, a.locals.globals), a.locals = null;
            for (r = N; r < L.length; r++)
              i = L[r], i.locals = I[r], i.self.onEnter && f.invoke(i.self.onEnter, i.self, i.locals.globals);
            if (w.transition !== q)
              return k;
            w.$current = t, w.current = t.self, w.params = n, P(w.params, h), w.transition = null;
            var s = t.navigable;
            return o.location && s && (g.url(s.url.format(s.locals.globals.$stateParams)), 'replace' === o.location && g.replace()), o.notify && e.$broadcast('$stateChangeSuccess', t.self, n, c.self, p), O = g.url(), w.current;
          }, function (r) {
            return w.transition !== q ? k : (w.transition = null, e.$broadcast('$stateChangeError', t.self, n, c.self, p, r), m(), i.reject(r));
          });
        return q;
      }, w.is = function (e, r) {
        var i = d(e);
        return _(i) ? w.$current !== i ? !1 : _(r) ? t.equals(h, r) : !0 : n;
      }, w.includes = function (e, r) {
        var i = d(e);
        if (!_(i))
          return n;
        if (!_(w.$current.includes[i.name]))
          return !1;
        var o = !0;
        return t.forEach(r, function (e, t) {
          _(h[t]) && h[t] === e || (o = !1);
        }), o;
      }, w.href = function (e, t, n) {
        n = M({
          lossy: !0,
          inherit: !1,
          absolute: !1,
          relative: w.$current
        }, n || {});
        var r = d(e, n.relative);
        if (!_(r))
          return null;
        t = s(h, t || {}, w.$current, r);
        var i = r && n.lossy ? r.navigable : r, a = i && i.url ? i.url.format(u(r.params, t || {})) : null;
        return !o.html5Mode() && a && (a = '#' + o.hashPrefix() + a), n.absolute && a && (a = g.protocol() + '://' + g.host() + (80 == g.port() || 443 == g.port() ? '' : ':' + g.port()) + (!o.html5Mode() && a ? '/' : '') + a), a;
      }, w.get = function (e, t) {
        if (!_(e)) {
          var n = [];
          return D(b, function (e) {
            n.push(e.self);
          }), n;
        }
        var r = d(e, t);
        return r && r.self ? r.self : null;
      }, w;
    }
    function v(e, t, n, r) {
      return e !== t || (n !== t.locals || r.reload) && e.self.reloadOnSearch !== !1 ? void 0 : !0;
    }
    var y, w, b = {}, $ = {}, x = 'abstract', k = {
        parent: function (e) {
          if (_(e.parent) && e.parent)
            return d(e.parent);
          var t = /^(.+)\.[^.]+$/.exec(e.name);
          return t ? d(t[1]) : y;
        },
        data: function (e) {
          return e.parent && e.parent.data && (e.data = e.self.data = M({}, e.parent.data, e.data)), e.data;
        },
        url: function (e) {
          var t = e.url;
          if (S(t))
            return '^' == t.charAt(0) ? i.compile(t.substring(1)) : (e.parent.navigable || y).url.concat(t);
          if (i.isMatcher(t) || null == t)
            return t;
          throw new Error('Invalid url \'' + t + '\' in state \'' + e + '\'');
        },
        navigable: function (e) {
          return e.url ? e : e.parent ? e.parent.navigable : null;
        },
        params: function (e) {
          if (!e.params)
            return e.url ? e.url.parameters() : e.parent.params;
          if (!E(e.params))
            throw new Error('Invalid params in state \'' + e + '\'');
          if (e.url)
            throw new Error('Both params and url specicified in state \'' + e + '\'');
          return e.params;
        },
        views: function (e) {
          var t = {};
          return D(_(e.views) ? e.views : { '': e }, function (n, r) {
            r.indexOf('@') < 0 && (r += '@' + e.parent.name), t[r] = n;
          }), t;
        },
        ownParams: function (e) {
          if (!e.parent)
            return e.params;
          var t = {};
          D(e.params, function (e) {
            t[e] = !0;
          }), D(e.parent.params, function (n) {
            if (!t[n])
              throw new Error('Missing required parameter \'' + n + '\' in state \'' + e.name + '\'');
            t[n] = !1;
          });
          var n = [];
          return D(t, function (e, t) {
            e && n.push(t);
          }), n;
        },
        path: function (e) {
          return e.parent ? e.parent.path.concat(e) : [];
        },
        includes: function (e) {
          var t = e.parent ? M({}, e.parent.includes) : {};
          return t[e.name] = !0, t;
        },
        $delegates: {}
      };
    y = p({
      name: '',
      url: '^',
      views: null,
      'abstract': !0
    }), y.navigable = null, this.decorator = h, this.state = g, this.$get = m, m.$inject = [
      '$rootScope',
      '$q',
      '$view',
      '$injector',
      '$resolve',
      '$stateParams',
      '$location',
      '$urlRouter'
    ];
  }
  function v() {
    function e(e, t) {
      return {
        load: function (n, r) {
          var i, o = {
              template: null,
              controller: null,
              view: null,
              locals: null,
              notify: !0,
              async: !0,
              params: {}
            };
          return r = M(o, r), r.view && (i = t.fromConfig(r.view, r.params, r.locals)), i && r.notify && e.$broadcast('$viewContentLoading', r), i;
        }
      };
    }
    this.$get = e, e.$inject = [
      '$rootScope',
      '$templateFactory'
    ];
  }
  function y(e, n, r, i, o) {
    var a = i.has('$animator') ? i.get('$animator') : !1, s = !1, u = {
        restrict: 'ECA',
        terminal: !0,
        priority: 1000,
        transclude: !0,
        compile: function (i, l, c) {
          return function (i, l, d) {
            function f(t) {
              var a = e.$current && e.$current.locals[g];
              if (a !== h) {
                var s = w(v && t);
                if (s.remove(l), p && (p.$destroy(), p = null), !a)
                  return h = null, $.state = null, s.restore(y, l);
                h = a, $.state = a.$$state;
                var u = n(s.populate(a.$template, l));
                if (p = i.$new(), a.$$controller) {
                  a.$scope = p;
                  var c = r(a.$$controller, a);
                  l.children().data('$ngControllerController', c);
                }
                u(p), p.$emit('$viewContentLoaded'), m && p.$eval(m), o();
              }
            }
            var p, h, g = d[u.name] || d.name || '', m = d.onload || '', v = a && a(i, d), y = c(i), w = function (e) {
                return {
                  'true': {
                    remove: function (e) {
                      v.leave(e.contents(), e);
                    },
                    restore: function (e, t) {
                      v.enter(e, t);
                    },
                    populate: function (e, n) {
                      var r = t.element('<div></div>').html(e).contents();
                      return v.enter(r, n), r;
                    }
                  },
                  'false': {
                    remove: function (e) {
                      e.html('');
                    },
                    restore: function (e, t) {
                      t.append(e);
                    },
                    populate: function (e, t) {
                      return t.html(e), t.contents();
                    }
                  }
                }[e.toString()];
              };
            l.append(y);
            var b = l.parent().inheritedData('$uiView');
            g.indexOf('@') < 0 && (g = g + '@' + (b ? b.state.name : ''));
            var $ = {
                name: g,
                state: null
              };
            l.data('$uiView', $);
            var x = function () {
              if (!s) {
                s = !0;
                try {
                  f(!0);
                } catch (e) {
                  throw s = !1, e;
                }
                s = !1;
              }
            };
            i.$on('$stateChangeSuccess', x), i.$on('$viewContentLoading', x), f(!1);
          };
        }
      };
    return u;
  }
  function w(e) {
    var t = e.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/);
    if (!t || 4 !== t.length)
      throw new Error('Invalid state ref \'' + e + '\'');
    return {
      state: t[1],
      paramExpr: t[3] || null
    };
  }
  function b(e) {
    var t = e.parent().inheritedData('$uiView');
    return t && t.state && t.state.name ? t.state : void 0;
  }
  function $(e, t) {
    return {
      restrict: 'A',
      require: '?^uiSrefActive',
      link: function (n, r, i, o) {
        var a = w(i.uiSref), s = null, u = b(r) || e.$current, l = 'FORM' === r[0].nodeName, c = l ? 'action' : 'href', d = !0, f = function (t) {
            if (t && (s = t), d) {
              var n = e.href(a.state, s, { relative: u });
              if (!n)
                return d = !1, !1;
              r[0][c] = n, o && o.$$setStateInfo(a.state, s);
            }
          };
        a.paramExpr && (n.$watch(a.paramExpr, function (e) {
          e !== s && f(e);
        }, !0), s = n.$eval(a.paramExpr)), f(), l || r.bind('click', function (r) {
          var i = r.which || r.button;
          0 !== i && 1 != i || r.ctrlKey || r.metaKey || r.shiftKey || (t(function () {
            n.$apply(function () {
              e.go(a.state, s, { relative: u });
            });
          }), r.preventDefault());
        });
      }
    };
  }
  function x(e, t, n) {
    return {
      restrict: 'A',
      controller: [
        '$scope',
        '$element',
        '$attrs',
        function (r, i, o) {
          function a() {
            e.$current.self === u && s() ? i.addClass(d) : i.removeClass(d);
          }
          function s() {
            return !c || l(c, t);
          }
          var u, c, d;
          d = n(o.uiSrefActive || '', !1)(r), this.$$setStateInfo = function (t, n) {
            u = e.get(t, b(i)), c = n, a();
          }, r.$on('$stateChangeSuccess', a);
        }
      ]
    };
  }
  function k(e, t) {
    function i(e) {
      this.locals = e.locals.globals, this.params = this.locals.$stateParams;
    }
    function o() {
      this.locals = null, this.params = null;
    }
    function a(n, a) {
      if (null != a.redirectTo) {
        var s, l = a.redirectTo;
        if (S(l))
          s = l;
        else {
          if (!T(l))
            throw new Error('Invalid \'redirectTo\' in when()');
          s = function (e, t) {
            return l(e, t.path(), t.search());
          };
        }
        t.when(n, s);
      } else
        e.state(r(a, {
          parent: null,
          name: 'route:' + encodeURIComponent(n),
          url: n,
          onEnter: i,
          onExit: o
        }));
      return u.push(a), this;
    }
    function s(e, t, r) {
      function i(e) {
        return '' !== e.name ? e : n;
      }
      var o = {
          routes: u,
          params: r,
          current: n
        };
      return t.$on('$stateChangeStart', function (e, n, r, o) {
        t.$broadcast('$routeChangeStart', i(n), i(o));
      }), t.$on('$stateChangeSuccess', function (e, n, r, a) {
        o.current = i(n), t.$broadcast('$routeChangeSuccess', i(n), i(a)), P(r, o.params);
      }), t.$on('$stateChangeError', function (e, n, r, o, a, s) {
        t.$broadcast('$routeChangeError', i(n), i(o), s);
      }), o;
    }
    var u = [];
    i.$inject = ['$$state'], this.when = a, this.$get = s, s.$inject = [
      '$state',
      '$rootScope',
      '$routeParams'
    ];
  }
  var _ = t.isDefined, T = t.isFunction, S = t.isString, C = t.isObject, E = t.isArray, D = t.forEach, M = t.extend, P = t.copy;
  t.module('ui.router.util', ['ng']), t.module('ui.router.router', ['ui.router.util']), t.module('ui.router.state', [
    'ui.router.router',
    'ui.router.util'
  ]), t.module('ui.router', ['ui.router.state']), t.module('ui.router.compat', ['ui.router']), d.$inject = [
    '$q',
    '$injector'
  ], t.module('ui.router.util').service('$resolve', d), f.$inject = [
    '$http',
    '$templateCache',
    '$injector'
  ], t.module('ui.router.util').service('$templateFactory', f), p.prototype.concat = function (e) {
    return new p(this.sourcePath + e + this.sourceSearch);
  }, p.prototype.toString = function () {
    return this.source;
  }, p.prototype.exec = function (e, t) {
    var n = this.regexp.exec(e);
    if (!n)
      return null;
    var r, i = this.params, o = i.length, a = this.segments.length - 1, s = {};
    if (a !== n.length - 1)
      throw new Error('Unbalanced capture group in route \'' + this.source + '\'');
    for (r = 0; a > r; r++)
      s[i[r]] = n[r + 1];
    for (; o > r; r++)
      s[i[r]] = t[i[r]];
    return s;
  }, p.prototype.parameters = function () {
    return this.params;
  }, p.prototype.format = function (e) {
    var t = this.segments, n = this.params;
    if (!e)
      return t.join('');
    var r, i, o, a = t.length - 1, s = n.length, u = t[0];
    for (r = 0; a > r; r++)
      o = e[n[r]], null != o && (u += encodeURIComponent(o)), u += t[r + 1];
    for (; s > r; r++)
      o = e[n[r]], null != o && (u += (i ? '&' : '?') + n[r] + '=' + encodeURIComponent(o), i = !0);
    return u;
  }, t.module('ui.router.util').provider('$urlMatcherFactory', h), g.$inject = ['$urlMatcherFactoryProvider'], t.module('ui.router.router').provider('$urlRouter', g), m.$inject = [
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$locationProvider'
  ], t.module('ui.router.state').value('$stateParams', {}).provider('$state', m), v.$inject = [], t.module('ui.router.state').provider('$view', v), y.$inject = [
    '$state',
    '$compile',
    '$controller',
    '$injector',
    '$anchorScroll'
  ], t.module('ui.router.state').directive('uiView', y), $.$inject = [
    '$state',
    '$timeout'
  ], x.$inject = [
    '$state',
    '$stateParams',
    '$interpolate'
  ], t.module('ui.router.state').directive('uiSref', $).directive('uiSrefActive', x), k.$inject = [
    '$stateProvider',
    '$urlRouterProvider'
  ], t.module('ui.router.compat').provider('$route', k).directive('ngView', y);
}(window, window.angular), angular.module('ui.alias', []).config([
  '$compileProvider',
  'uiAliasConfig',
  function (e, t) {
    t = t || {}, angular.forEach(t, function (t, n) {
      angular.isString(t) && (t = {
        replace: !0,
        template: t
      }), e.directive(n, function () {
        return t;
      });
    });
  }
]), angular.module('ui.event', []).directive('uiEvent', [
  '$parse',
  function (e) {
    return function (t, n, r) {
      var i = t.$eval(r.uiEvent);
      angular.forEach(i, function (r, i) {
        var o = e(r);
        n.bind(i, function (e) {
          var n = Array.prototype.slice.call(arguments);
          n = n.splice(1), o(t, {
            $event: e,
            $params: n
          }), t.$$phase || t.$apply();
        });
      });
    };
  }
]), angular.module('ui.format', []).filter('format', function () {
  return function (e, t) {
    var n = e;
    if (angular.isString(n) && void 0 !== t)
      if (angular.isArray(t) || angular.isObject(t) || (t = [t]), angular.isArray(t)) {
        var r = t.length, i = function (e, n) {
            return n = parseInt(n, 10), n >= 0 && r > n ? t[n] : e;
          };
        n = n.replace(/\$([0-9]+)/g, i);
      } else
        angular.forEach(t, function (e, t) {
          n = n.split(':' + t).join(e);
        });
    return n;
  };
}), angular.module('ui.highlight', []).filter('highlight', function () {
  return function (e, t, n) {
    return t || angular.isNumber(t) ? (e = e.toString(), t = t.toString(), n ? e.split(t).join('<span class="ui-match">' + t + '</span>') : e.replace(new RegExp(t, 'gi'), '<span class="ui-match">$&</span>')) : e;
  };
}), angular.module('ui.include', []).directive('uiInclude', [
  '$http',
  '$templateCache',
  '$anchorScroll',
  '$compile',
  function (e, t, n, r) {
    return {
      restrict: 'ECA',
      terminal: !0,
      compile: function (i, o) {
        var a = o.uiInclude || o.src, s = o.fragment || '', u = o.onload || '', l = o.autoscroll;
        return function (i, o) {
          function c() {
            var c = ++f, h = i.$eval(a), g = i.$eval(s);
            h ? e.get(h, { cache: t }).success(function (e) {
              if (c === f) {
                d && d.$destroy(), d = i.$new();
                var t;
                t = g ? angular.element('<div/>').html(e).find(g) : angular.element('<div/>').html(e).contents(), o.html(t), r(t)(d), !angular.isDefined(l) || l && !i.$eval(l) || n(), d.$emit('$includeContentLoaded'), i.$eval(u);
              }
            }).error(function () {
              c === f && p();
            }) : p();
          }
          var d, f = 0, p = function () {
              d && (d.$destroy(), d = null), o.html('');
            };
          i.$watch(s, c), i.$watch(a, c);
        };
      }
    };
  }
]), angular.module('ui.indeterminate', []).directive('uiIndeterminate', [function () {
    return {
      compile: function (e, t) {
        return t.type && 'checkbox' === t.type.toLowerCase() ? function (e, t, n) {
          e.$watch(n.uiIndeterminate, function (e) {
            t[0].indeterminate = !!e;
          });
        } : angular.noop;
      }
    };
  }]), angular.module('ui.inflector', []).filter('inflector', function () {
  function e(e) {
    return e.replace(/^([a-z])|\s+([a-z])/g, function (e) {
      return e.toUpperCase();
    });
  }
  function t(e, t) {
    return e.replace(/[A-Z]/g, function (e) {
      return t + e;
    });
  }
  var n = {
      humanize: function (n) {
        return e(t(n, ' ').split('_').join(' '));
      },
      underscore: function (e) {
        return e.substr(0, 1).toLowerCase() + t(e.substr(1), '_').toLowerCase().split(' ').join('_');
      },
      variable: function (t) {
        return t = t.substr(0, 1).toLowerCase() + e(t.split('_').join(' ')).substr(1).split(' ').join('');
      }
    };
  return function (e, t) {
    return t !== !1 && angular.isString(e) ? (t = t || 'humanize', n[t](e)) : e;
  };
}), angular.module('ui.jq', []).value('uiJqConfig', {}).directive('uiJq', [
  'uiJqConfig',
  '$timeout',
  function (e) {
    return {
      restrict: 'A',
      compile: function (t, n) {
        if (!angular.isFunction(t[n.uiJq]))
          throw new Error('ui-jq: The "' + n.uiJq + '" function does not exist');
        var r = e && e[n.uiJq];
        return function (e, t, n) {
          function i() {
            t[n.uiJq].apply(t, o);
          }
          var o = [];
          n.uiOptions ? (o = e.$eval('[' + n.uiOptions + ']'), angular.isObject(r) && angular.isObject(o[0]) && (o[0] = angular.extend({}, r, o[0]))) : r && (o = [r]), n.ngModel && t.is('select,input,textarea') && t.bind('change', function () {
            t.trigger('input');
          }), n.uiRefresh && e.$watch(n.uiRefresh, function () {
            i();
          }), i();
        };
      }
    };
  }
]), angular.module('ui.keypress', []).factory('keypressHelper', [
  '$parse',
  function (e) {
    var t = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'insert',
        46: 'delete'
      }, n = function (e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
      };
    return function (r, i, o, a) {
      var s, u = [];
      s = i.$eval(a['ui' + n(r)]), angular.forEach(s, function (t, n) {
        var r, i;
        i = e(t), angular.forEach(n.split(' '), function (e) {
          r = {
            expression: i,
            keys: {}
          }, angular.forEach(e.split('-'), function (e) {
            r.keys[e] = !0;
          }), u.push(r);
        });
      }), o.bind(r, function (e) {
        var n = !(!e.metaKey || e.ctrlKey), o = !!e.altKey, a = !!e.ctrlKey, s = !!e.shiftKey, l = e.keyCode;
        'keypress' === r && !s && l >= 97 && 122 >= l && (l -= 32), angular.forEach(u, function (r) {
          var u = r.keys[t[l]] || r.keys[l.toString()], c = !!r.keys.meta, d = !!r.keys.alt, f = !!r.keys.ctrl, p = !!r.keys.shift;
          u && c === n && d === o && f === a && p === s && i.$apply(function () {
            r.expression(i, { $event: e });
          });
        });
      });
    };
  }
]), angular.module('ui.keypress').directive('uiKeydown', [
  'keypressHelper',
  function (e) {
    return {
      link: function (t, n, r) {
        e('keydown', t, n, r);
      }
    };
  }
]), angular.module('ui.keypress').directive('uiKeypress', [
  'keypressHelper',
  function (e) {
    return {
      link: function (t, n, r) {
        e('keypress', t, n, r);
      }
    };
  }
]), angular.module('ui.keypress').directive('uiKeyup', [
  'keypressHelper',
  function (e) {
    return {
      link: function (t, n, r) {
        e('keyup', t, n, r);
      }
    };
  }
]), angular.module('ui.mask', []).value('uiMaskConfig', {
  maskDefinitions: {
    9: /\d/,
    A: /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/
  }
}).directive('uiMask', [
  'uiMaskConfig',
  function (e) {
    return {
      priority: 100,
      require: 'ngModel',
      restrict: 'A',
      compile: function () {
        var t = e;
        return function (e, n, r, i) {
          function o(e) {
            return angular.isDefined(e) ? (y(e), F ? (c(), d(), !0) : l()) : l();
          }
          function a(e) {
            angular.isDefined(e) && (D = e, F && x());
          }
          function s(e) {
            return F ? (A = h(e || ''), N = p(A), i.$setValidity('mask', N), N && A.length ? g(A) : void 0) : e;
          }
          function u(e) {
            return F ? (A = h(e || ''), N = p(A), i.$viewValue = A.length ? g(A) : '', i.$setValidity('mask', N), '' === A && void 0 !== i.$error.required && i.$setValidity('required', !1), N ? A : void 0) : e;
          }
          function l() {
            return F = !1, f(), angular.isDefined(q) ? n.attr('placeholder', q) : n.removeAttr('placeholder'), angular.isDefined(V) ? n.attr('maxlength', V) : n.removeAttr('maxlength'), n.val(i.$modelValue), i.$viewValue = i.$modelValue, !1;
          }
          function c() {
            A = L = h(i.$modelValue || ''), O = j = g(A), N = p(A);
            var e = N && A.length ? O : '';
            r.maxlength && n.attr('maxlength', 2 * C[C.length - 1]), n.attr('placeholder', D), n.val(e), i.$viewValue = e;
          }
          function d() {
            H || (n.bind('blur', w), n.bind('mousedown mouseup', b), n.bind('input keyup click focus', x), H = !0);
          }
          function f() {
            H && (n.unbind('blur', w), n.unbind('mousedown', b), n.unbind('mouseup', b), n.unbind('input', x), n.unbind('keyup', x), n.unbind('click', x), n.unbind('focus', x), H = !1);
          }
          function p(e) {
            return e.length ? e.length >= P : !0;
          }
          function h(e) {
            var t = '', n = E.slice();
            return e = e.toString(), angular.forEach(M, function (t) {
              e = e.replace(t, '');
            }), angular.forEach(e.split(''), function (e) {
              n.length && n[0].test(e) && (t += e, n.shift());
            }), t;
          }
          function g(e) {
            var t = '', n = C.slice();
            return angular.forEach(D.split(''), function (r, i) {
              e.length && i === n[0] ? (t += e.charAt(0) || '_', e = e.substr(1), n.shift()) : t += r;
            }), t;
          }
          function m(e) {
            var t = r.placeholder;
            return 'undefined' != typeof t && t[e] ? t[e] : '_';
          }
          function v() {
            return D.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
          }
          function y(e) {
            var t = 0;
            if (C = [], E = [], D = '', 'string' == typeof e) {
              P = 0;
              var n = !1, r = e.split('');
              angular.forEach(r, function (e, r) {
                U.maskDefinitions[e] ? (C.push(t), D += m(r), E.push(U.maskDefinitions[e]), t++, n || P++) : '?' === e ? n = !0 : (D += e, t++);
              });
            }
            C.push(C.slice().pop() + 1), M = v(), F = C.length > 1 ? !0 : !1;
          }
          function w() {
            R = 0, I = 0, N && 0 !== A.length || (O = '', n.val(''), e.$apply(function () {
              i.$setViewValue('');
            }));
          }
          function b(e) {
            'mousedown' === e.type ? n.bind('mouseout', $) : n.unbind('mouseout', $);
          }
          function $() {
            I = S(this), n.unbind('mouseout', $);
          }
          function x(t) {
            t = t || {};
            var r = t.which, o = t.type;
            if (16 !== r && 91 !== r) {
              var a, s = n.val(), u = j, l = h(s), c = L, d = !1, f = _(this) || 0, p = R || 0, m = f - p, v = C[0], y = C[l.length] || C.slice().shift(), w = I || 0, b = S(this) > 0, $ = w > 0, x = s.length > u.length || w && s.length > u.length - w, E = s.length < u.length || w && s.length === u.length - w, D = r >= 37 && 40 >= r && t.shiftKey, M = 37 === r, P = 8 === r || 'keyup' !== o && E && -1 === m, A = 46 === r || 'keyup' !== o && E && 0 === m && !$, O = (M || P || 'click' === o) && f > v;
              if (I = S(this), !D && (!b || 'click' !== o && 'keyup' !== o)) {
                if ('input' === o && E && !$ && l === c) {
                  for (; P && f > v && !k(f);)
                    f--;
                  for (; A && y > f && -1 === C.indexOf(f);)
                    f++;
                  var N = C.indexOf(f);
                  l = l.substring(0, N) + l.substring(N + 1), d = !0;
                }
                for (a = g(l), j = a, L = l, n.val(a), d && e.$apply(function () {
                    i.$setViewValue(l);
                  }), x && v >= f && (f = v + 1), O && f--, f = f > y ? y : v > f ? v : f; !k(f) && f > v && y > f;)
                  f += O ? -1 : 1;
                (O && y > f || x && !k(p)) && f++, R = f, T(this, f);
              }
            }
          }
          function k(e) {
            return C.indexOf(e) > -1;
          }
          function _(e) {
            if (!e)
              return 0;
            if (void 0 !== e.selectionStart)
              return e.selectionStart;
            if (document.selection) {
              e.focus();
              var t = document.selection.createRange();
              return t.moveStart('character', -e.value.length), t.text.length;
            }
            return 0;
          }
          function T(e, t) {
            if (!e)
              return 0;
            if (0 !== e.offsetWidth && 0 !== e.offsetHeight)
              if (e.setSelectionRange)
                e.focus(), e.setSelectionRange(t, t);
              else if (e.createTextRange) {
                var n = e.createTextRange();
                n.collapse(!0), n.moveEnd('character', t), n.moveStart('character', t), n.select();
              }
          }
          function S(e) {
            return e ? void 0 !== e.selectionStart ? e.selectionEnd - e.selectionStart : document.selection ? document.selection.createRange().text.length : 0 : 0;
          }
          var C, E, D, M, P, A, O, N, j, L, R, I, F = !1, H = !1, q = r.placeholder, V = r.maxlength, U = {};
          r.uiOptions ? (U = e.$eval('[' + r.uiOptions + ']'), angular.isObject(U[0]) && (U = function (e, t) {
            for (var n in e)
              Object.prototype.hasOwnProperty.call(e, n) && (t[n] ? angular.extend(t[n], e[n]) : t[n] = angular.copy(e[n]));
            return t;
          }(t, U[0]))) : U = t, r.$observe('uiMask', o), r.$observe('placeholder', a), i.$formatters.push(s), i.$parsers.push(u), n.bind('mousedown mouseup', b), Array.prototype.indexOf || (Array.prototype.indexOf = function (e) {
            if (null === this)
              throw new TypeError();
            var t = Object(this), n = t.length >>> 0;
            if (0 === n)
              return -1;
            var r = 0;
            if (arguments.length > 1 && (r = Number(arguments[1]), r !== r ? r = 0 : 0 !== r && 1 / 0 !== r && r !== -1 / 0 && (r = (r > 0 || -1) * Math.floor(Math.abs(r)))), r >= n)
              return -1;
            for (var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0); n > i; i++)
              if (i in t && t[i] === e)
                return i;
            return -1;
          });
        };
      }
    };
  }
]), angular.module('ui.reset', []).value('uiResetConfig', null).directive('uiReset', [
  'uiResetConfig',
  function (e) {
    var t = null;
    return void 0 !== e && (t = e), {
      require: 'ngModel',
      link: function (e, n, r, i) {
        var o;
        o = angular.element('<a class="ui-reset" />'), n.wrap('<span class="ui-resetwrap" />').after(o), o.bind('click', function (n) {
          n.preventDefault(), e.$apply(function () {
            r.uiReset ? i.$setViewValue(e.$eval(r.uiReset)) : i.$setViewValue(t), i.$render();
          });
        });
      }
    };
  }
]), angular.module('ui.route', []).directive('uiRoute', [
  '$location',
  '$parse',
  function (e, t) {
    return {
      restrict: 'AC',
      scope: !0,
      compile: function (n, r) {
        var i;
        if (r.uiRoute)
          i = 'uiRoute';
        else if (r.ngHref)
          i = 'ngHref';
        else {
          if (!r.href)
            throw new Error('uiRoute missing a route or href property on ' + n[0]);
          i = 'href';
        }
        return function (n, r, o) {
          function a(t) {
            var r = t.indexOf('#');
            r > -1 && (t = t.substr(r + 1)), l = function () {
              u(n, e.path().indexOf(t) > -1);
            }, l();
          }
          function s(t) {
            var r = t.indexOf('#');
            r > -1 && (t = t.substr(r + 1)), l = function () {
              var r = new RegExp('^' + t + '$', ['i']);
              u(n, r.test(e.path()));
            }, l();
          }
          var u = t(o.ngModel || o.routeModel || '$uiRoute').assign, l = angular.noop;
          switch (i) {
          case 'uiRoute':
            o.uiRoute ? s(o.uiRoute) : o.$observe('uiRoute', s);
            break;
          case 'ngHref':
            o.ngHref ? a(o.ngHref) : o.$observe('ngHref', a);
            break;
          case 'href':
            a(o.href);
          }
          n.$on('$routeChangeSuccess', function () {
            l();
          }), n.$on('$stateChangeSuccess', function () {
            l();
          });
        };
      }
    };
  }
]), angular.module('ui.scroll.jqlite', ['ui.scroll']).service('jqLiteExtras', [
  '$log',
  '$window',
  function (e, t) {
    return {
      registerFor: function (e) {
        var n, r, i, o, a, s, u;
        return r = angular.element.prototype.css, e.prototype.css = function (e, t) {
          var n, i;
          return i = this, n = i[0], n && 3 !== n.nodeType && 8 !== n.nodeType && n.style ? r.call(i, e, t) : void 0;
        }, s = function (e) {
          return e && e.document && e.location && e.alert && e.setInterval;
        }, u = function (e, t, n) {
          var r, i, o, a, u;
          return r = e[0], u = {
            top: [
              'scrollTop',
              'pageYOffset',
              'scrollLeft'
            ],
            left: [
              'scrollLeft',
              'pageXOffset',
              'scrollTop'
            ]
          }[t], i = u[0], a = u[1], o = u[2], s(r) ? angular.isDefined(n) ? r.scrollTo(e[o].call(e), n) : a in r ? r[a] : r.document.documentElement[i] : angular.isDefined(n) ? r[i] = n : r[i];
        }, t.getComputedStyle ? (o = function (e) {
          return t.getComputedStyle(e, null);
        }, n = function (e, t) {
          return parseFloat(t);
        }) : (o = function (e) {
          return e.currentStyle;
        }, n = function (e, t) {
          var n, r, i, o, a, s, u;
          return n = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, o = new RegExp('^(' + n + ')(?!px)[a-z%]+$', 'i'), o.test(t) ? (u = e.style, r = u.left, a = e.runtimeStyle, s = a && a.left, a && (a.left = u.left), u.left = t, i = u.pixelLeft, u.left = r, s && (a.left = s), i) : parseFloat(t);
        }), i = function (e, t) {
          var r, i, a, u, l, c, d, f, p, h, g, m, v;
          return s(e) ? (r = document.documentElement[{
            height: 'clientHeight',
            width: 'clientWidth'
          }[t]], {
            base: r,
            padding: 0,
            border: 0,
            margin: 0
          }) : (v = {
            width: [
              e.offsetWidth,
              'Left',
              'Right'
            ],
            height: [
              e.offsetHeight,
              'Top',
              'Bottom'
            ]
          }[t], r = v[0], d = v[1], f = v[2], c = o(e), g = n(e, c['padding' + d]) || 0, m = n(e, c['padding' + f]) || 0, i = n(e, c['border' + d + 'Width']) || 0, a = n(e, c['border' + f + 'Width']) || 0, u = c['margin' + d], l = c['margin' + f], p = n(e, u) || 0, h = n(e, l) || 0, {
            base: r,
            padding: g + m,
            border: i + a,
            margin: p + h
          });
        }, a = function (e, t, n) {
          var r, a, s;
          return a = i(e, t), a.base > 0 ? {
            base: a.base - a.padding - a.border,
            outer: a.base,
            outerfull: a.base + a.margin
          }[n] : (r = o(e), s = r[t], (0 > s || null === s) && (s = e.style[t] || 0), s = parseFloat(s) || 0, {
            base: s - a.padding - a.border,
            outer: s,
            outerfull: s + a.padding + a.border + a.margin
          }[n]);
        }, angular.forEach({
          before: function (e) {
            var t, n, r, i, o, a, s;
            if (o = this, n = o[0], i = o.parent(), t = i.contents(), t[0] === n)
              return i.prepend(e);
            for (r = a = 1, s = t.length - 1; s >= 1 ? s >= a : a >= s; r = s >= 1 ? ++a : --a)
              if (t[r] === n)
                return angular.element(t[r - 1]).after(e), void 0;
            throw new Error('invalid DOM structure ' + n.outerHTML);
          },
          height: function (e) {
            var t;
            return t = this, angular.isDefined(e) ? (angular.isNumber(e) && (e += 'px'), r.call(t, 'height', e)) : a(this[0], 'height', 'base');
          },
          outerHeight: function (e) {
            return a(this[0], 'height', e ? 'outerfull' : 'outer');
          },
          offset: function (e) {
            var t, n, r, i, o, a;
            return o = this, arguments.length ? void 0 === e ? o : e : (t = {
              top: 0,
              left: 0
            }, i = o[0], (n = i && i.ownerDocument) ? (r = n.documentElement, i.getBoundingClientRect && (t = i.getBoundingClientRect()), a = n.defaultView || n.parentWindow, {
              top: t.top + (a.pageYOffset || r.scrollTop) - (r.clientTop || 0),
              left: t.left + (a.pageXOffset || r.scrollLeft) - (r.clientLeft || 0)
            }) : void 0);
          },
          scrollTop: function (e) {
            return u(this, 'top', e);
          },
          scrollLeft: function (e) {
            return u(this, 'left', e);
          }
        }, function (t, n) {
          return e.prototype[n] ? void 0 : e.prototype[n] = t;
        });
      }
    };
  }
]).run([
  '$log',
  '$window',
  'jqLiteExtras',
  function (e, t, n) {
    return t.jQuery ? void 0 : n.registerFor(angular.element);
  }
]), angular.module('ui.scroll', []).directive('ngScrollViewport', [
  '$log',
  function () {
    return {
      controller: [
        '$scope',
        '$element',
        function (e, t) {
          return t;
        }
      ]
    };
  }
]).directive('ngScroll', [
  '$log',
  '$injector',
  '$rootScope',
  '$timeout',
  function (e, t, n, r) {
    return {
      require: ['?^ngScrollViewport'],
      transclude: 'element',
      priority: 1000,
      terminal: !0,
      compile: function (i, o, a) {
        return function (o, s, u, l) {
          var c, d, f, p, h, g, m, v, y, w, b, $, x, k, _, T, S, C, E, D, M, P, A, O, N, j, L, R, I, F, H, q, V, U, W, B;
          if (O = u.ngScroll.match(/^\s*(\w+)\s+in\s+(\w+)\s*$/), !O)
            throw new Error('Expected ngScroll in form of "item_ in _datasource_" but got "' + u.ngScroll + '"');
          if (P = O[1], $ = O[2], D = function (e) {
              return angular.isObject(e) && e.get && angular.isFunction(e.get);
            }, b = o[$], !D(b) && (b = t.get($), !D(b)))
            throw new Error($ + ' is not a valid datasource');
          return v = Math.max(3, +u.bufferSize || 10), m = function () {
            return B.height() * Math.max(0.1, +u.padding || 0.1);
          }, H = function (e) {
            return e[0].scrollHeight || e[0].document.documentElement.scrollHeight;
          }, c = null, a(U = o.$new(), function (e) {
            var t, n, r, o, a, s;
            if (o = e[0].localName, 'dl' === o)
              throw new Error('ng-scroll directive does not support <' + e[0].localName + '> as a repeating tag: ' + e[0].outerHTML);
            return 'li' !== o && 'tr' !== o && (o = 'div'), s = l[0] || angular.element(window), s.css({
              'overflow-y': 'auto',
              display: 'block'
            }), r = function (e) {
              var t, n, r;
              switch (e) {
              case 'tr':
                return r = angular.element('<table><tr><td><div></div></td></tr></table>'), t = r.find('div'), n = r.find('tr'), n.paddingHeight = function () {
                  return t.height.apply(t, arguments);
                }, n;
              default:
                return n = angular.element('<' + e + '></' + e + '>'), n.paddingHeight = n.height, n;
              }
            }, n = function (e, t, n) {
              return t[{
                top: 'before',
                bottom: 'after'
              }[n]](e), {
                paddingHeight: function () {
                  return e.paddingHeight.apply(e, arguments);
                },
                insert: function (t) {
                  return e[{
                    top: 'after',
                    bottom: 'before'
                  }[n]](t);
                }
              };
            }, a = n(r(o), i, 'top'), t = n(r(o), i, 'bottom'), U.$destroy(), c = {
              viewport: s,
              topPadding: a.paddingHeight,
              bottomPadding: t.paddingHeight,
              append: t.insert,
              prepend: a.insert,
              bottomDataPos: function () {
                return H(s) - t.paddingHeight();
              },
              topDataPos: function () {
                return a.paddingHeight();
              }
            };
          }), B = c.viewport, C = 1, N = 1, g = [], j = [], k = !1, p = !1, A = b.loading || function () {
          }, M = !1, R = function (e, t) {
            var n, r;
            for (n = r = e; t >= e ? t > r : r > t; n = t >= e ? ++r : --r)
              g[n].scope.$destroy(), g[n].element.remove();
            return g.splice(e, t - e);
          }, L = function () {
            return C = 1, N = 1, R(0, g.length), c.topPadding(0), c.bottomPadding(0), j = [], k = !1, p = !1, d(!1);
          }, h = function () {
            return B.scrollTop() + B.height();
          }, W = function () {
            return B.scrollTop();
          }, q = function () {
            return !k && c.bottomDataPos() < h() + m();
          }, y = function () {
            var t, n, r, i, o, a;
            for (t = 0, i = 0, n = o = a = g.length - 1; (0 >= a ? 0 >= o : o >= 0) && (r = g[n].element.outerHeight(!0), c.bottomDataPos() - t - r > h() + m()); n = 0 >= a ? ++o : --o)
              t += r, i++, k = !1;
            return i > 0 ? (c.bottomPadding(c.bottomPadding() + t), R(g.length - i, g.length), N -= i, e.log('clipped off bottom ' + i + ' bottom padding ' + c.bottomPadding())) : void 0;
          }, V = function () {
            return !p && c.topDataPos() > W() - m();
          }, w = function () {
            var t, n, r, i, o, a;
            for (i = 0, r = 0, o = 0, a = g.length; a > o && (t = g[o], n = t.element.outerHeight(!0), c.topDataPos() + i + n < W() - m()); o++)
              i += n, r++, p = !1;
            return r > 0 ? (c.topPadding(c.topPadding() + i), R(0, r), C += r, e.log('clipped off top ' + r + ' top padding ' + c.topPadding())) : void 0;
          }, x = function (e, t) {
            return M || (M = !0, A(!0)), 1 === j.push(e) ? T(t) : void 0;
          }, E = function (e, t) {
            var n, r, i;
            return n = o.$new(), n[P] = t, r = e > C, n.$index = e, r && n.$index--, i = { scope: n }, a(n, function (t) {
              return i.element = t, r ? e === N ? (c.append(t), g.push(i)) : (g[e - C].element.after(t), g.splice(e - C + 1, 0, i)) : (c.prepend(t), g.unshift(i));
            }), {
              appended: r,
              wrapper: i
            };
          }, f = function (e, t) {
            var n;
            return e ? c.bottomPadding(Math.max(0, c.bottomPadding() - t.element.outerHeight(!0))) : (n = c.topPadding() - t.element.outerHeight(!0), n >= 0 ? c.topPadding(n) : B.scrollTop(B.scrollTop() + t.element.outerHeight(!0)));
          }, d = function (t, n, i) {
            var o;
            return o = function () {
              return e.log('top {actual=' + c.topDataPos() + ' visible from=' + W() + ' bottom {visible through=' + h() + ' actual=' + c.bottomDataPos() + '}'), q() ? x(!0, t) : V() && x(!1, t), i ? i() : void 0;
            }, n ? r(function () {
              var e, t, r;
              for (t = 0, r = n.length; r > t; t++)
                e = n[t], f(e.appended, e.wrapper);
              return o();
            }) : o();
          }, S = function (e, t) {
            return d(e, t, function () {
              return j.shift(), 0 === j.length ? (M = !1, A(!1)) : T(e);
            });
          }, T = function (t) {
            var n;
            return n = j[0], n ? g.length && !q() ? S(t) : b.get(N, v, function (n) {
              var r, i, o, a;
              if (i = [], 0 === n.length)
                k = !0, c.bottomPadding(0), e.log('appended: requested ' + v + ' records starting from ' + N + ' recieved: eof');
              else {
                for (w(), o = 0, a = n.length; a > o; o++)
                  r = n[o], i.push(E(++N, r));
                e.log('appended: requested ' + v + ' received ' + n.length + ' buffer size ' + g.length + ' first ' + C + ' next ' + N);
              }
              return S(t, i);
            }) : g.length && !V() ? S(t) : b.get(C - v, v, function (n) {
              var r, i, o, a;
              if (i = [], 0 === n.length)
                p = !0, c.topPadding(0), e.log('prepended: requested ' + v + ' records starting from ' + (C - v) + ' recieved: bof');
              else {
                for (y(), r = o = a = n.length - 1; 0 >= a ? 0 >= o : o >= 0; r = 0 >= a ? ++o : --o)
                  i.unshift(E(--C, n[r]));
                e.log('prepended: requested ' + v + ' received ' + n.length + ' buffer size ' + g.length + ' first ' + C + ' next ' + N);
              }
              return S(t, i);
            });
          }, I = function () {
            return n.$$phase || M ? void 0 : (d(!1), o.$apply());
          }, B.bind('resize', I), F = function () {
            return n.$$phase || M ? void 0 : (d(!0), o.$apply());
          }, B.bind('scroll', F), o.$watch(b.revision, function () {
            return L();
          }), _ = b.scope ? b.scope.$new() : o.$new(), o.$on('$destroy', function () {
            return _.$destroy(), B.unbind('resize', I), B.unbind('scroll', F);
          }), _.$on('update.items', function (e, t, n) {
            var r, i, o, a, s;
            if (angular.isFunction(t))
              for (i = function (e) {
                  return t(e.scope);
                }, o = 0, a = g.length; a > o; o++)
                r = g[o], i(r);
            else
              0 <= (s = t - C - 1) && s < g.length && (g[t - C - 1].scope[P] = n);
            return null;
          }), _.$on('delete.items', function (e, t) {
            var n, r, i, o, a, s, u, l, c, f, p, h;
            if (angular.isFunction(t)) {
              for (i = [], s = 0, c = g.length; c > s; s++)
                r = g[s], i.unshift(r);
              for (a = function (e) {
                  return t(e.scope) ? (R(i.length - 1 - n, i.length - n), N--) : void 0;
                }, n = u = 0, f = i.length; f > u; n = ++u)
                o = i[n], a(o);
            } else
              0 <= (h = t - C - 1) && h < g.length && (R(t - C - 1, t - C), N--);
            for (n = l = 0, p = g.length; p > l; n = ++l)
              r = g[n], r.scope.$index = C + n;
            return d(!1);
          }), _.$on('insert.item', function (e, t, n) {
            var r, i, o, a, s, u, l, c, f, p, h, m;
            if (i = [], angular.isFunction(t)) {
              for (o = [], u = 0, f = g.length; f > u; u++)
                n = g[u], o.unshift(n);
              for (s = function (e) {
                  var o, a, s, u, l;
                  if (a = t(e.scope)) {
                    if (E = function (e, t) {
                        return E(e, t), N++;
                      }, angular.isArray(a)) {
                      for (l = [], o = s = 0, u = a.length; u > s; o = ++s)
                        n = a[o], l.push(i.push(E(r + o, n)));
                      return l;
                    }
                    return i.push(E(r, a));
                  }
                }, r = l = 0, p = o.length; p > l; r = ++l)
                a = o[r], s(a);
            } else
              0 <= (m = t - C - 1) && m < g.length && (i.push(E(t, n)), N++);
            for (r = c = 0, h = g.length; h > c; r = ++c)
              n = g[r], n.scope.$index = C + r;
            return d(!1, i);
          });
        };
      }
    };
  }
]), angular.module('ui.scrollfix', []).directive('uiScrollfix', [
  '$window',
  function (e) {
    return {
      require: '^?uiScrollfixTarget',
      link: function (t, n, r, i) {
        function o() {
          var t;
          if (angular.isDefined(e.pageYOffset))
            t = e.pageYOffset;
          else {
            var i = document.compatMode && 'BackCompat' !== document.compatMode ? document.documentElement : document.body;
            t = i.scrollTop;
          }
          !n.hasClass('ui-scrollfix') && t > r.uiScrollfix ? n.addClass('ui-scrollfix') : n.hasClass('ui-scrollfix') && t < r.uiScrollfix && n.removeClass('ui-scrollfix');
        }
        var a = n[0].offsetTop, s = i && i.$element || angular.element(e);
        r.uiScrollfix ? 'string' == typeof r.uiScrollfix && ('-' === r.uiScrollfix.charAt(0) ? r.uiScrollfix = a - parseFloat(r.uiScrollfix.substr(1)) : '+' === r.uiScrollfix.charAt(0) && (r.uiScrollfix = a + parseFloat(r.uiScrollfix.substr(1)))) : r.uiScrollfix = a, s.on('scroll', o), t.$on('$destroy', function () {
          s.off('scroll', o);
        });
      }
    };
  }
]).directive('uiScrollfixTarget', [function () {
    return {
      controller: [
        '$element',
        function (e) {
          this.$element = e;
        }
      ]
    };
  }]), angular.module('ui.showhide', []).directive('uiShow', [function () {
    return function (e, t, n) {
      e.$watch(n.uiShow, function (e) {
        e ? t.addClass('ui-show') : t.removeClass('ui-show');
      });
    };
  }]).directive('uiHide', [function () {
    return function (e, t, n) {
      e.$watch(n.uiHide, function (e) {
        e ? t.addClass('ui-hide') : t.removeClass('ui-hide');
      });
    };
  }]).directive('uiToggle', [function () {
    return function (e, t, n) {
      e.$watch(n.uiToggle, function (e) {
        e ? t.removeClass('ui-hide').addClass('ui-show') : t.removeClass('ui-show').addClass('ui-hide');
      });
    };
  }]), angular.module('ui.unique', []).filter('unique', [
  '$parse',
  function (e) {
    return function (t, n) {
      if (n === !1)
        return t;
      if ((n || angular.isUndefined(n)) && angular.isArray(t)) {
        var r = [], i = angular.isString(n) ? e(n) : function (e) {
            return e;
          }, o = function (e) {
            return angular.isObject(e) ? i(e) : e;
          };
        angular.forEach(t, function (e) {
          for (var t = !1, n = 0; n < r.length; n++)
            if (angular.equals(o(r[n]), o(e))) {
              t = !0;
              break;
            }
          t || r.push(e);
        }), t = r;
      }
      return t;
    };
  }
]), angular.module('ui.validate', []).directive('uiValidate', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (e, t, n, r) {
      function i(t) {
        return angular.isString(t) ? (e.$watch(t, function () {
          angular.forEach(a, function (e) {
            e(r.$modelValue);
          });
        }), void 0) : angular.isArray(t) ? (angular.forEach(t, function (t) {
          e.$watch(t, function () {
            angular.forEach(a, function (e) {
              e(r.$modelValue);
            });
          });
        }), void 0) : (angular.isObject(t) && angular.forEach(t, function (t, n) {
          angular.isString(t) && e.$watch(t, function () {
            a[n](r.$modelValue);
          }), angular.isArray(t) && angular.forEach(t, function (t) {
            e.$watch(t, function () {
              a[n](r.$modelValue);
            });
          });
        }), void 0);
      }
      var o, a = {}, s = e.$eval(n.uiValidate);
      s && (angular.isString(s) && (s = { validator: s }), angular.forEach(s, function (t, n) {
        o = function (i) {
          var o = e.$eval(t, { $value: i });
          return angular.isObject(o) && angular.isFunction(o.then) ? (o.then(function () {
            r.$setValidity(n, !0);
          }, function () {
            r.$setValidity(n, !1);
          }), i) : o ? (r.$setValidity(n, !0), i) : (r.$setValidity(n, !1), void 0);
        }, a[n] = o, r.$formatters.push(o), r.$parsers.push(o);
      }), n.uiValidateWatch && i(e.$eval(n.uiValidateWatch)));
    }
  };
}), angular.module('ui.utils', [
  'ui.event',
  'ui.format',
  'ui.highlight',
  'ui.include',
  'ui.indeterminate',
  'ui.inflector',
  'ui.jq',
  'ui.keypress',
  'ui.mask',
  'ui.reset',
  'ui.route',
  'ui.scrollfix',
  'ui.scroll',
  'ui.scroll.jqlite',
  'ui.showhide',
  'ui.unique',
  'ui.validate'
]), angular.module('storage', []).factory('storage', [
  '$parse',
  '$window',
  '$log',
  function (e, t) {
    var n = 'undefined' == typeof t.localStorage ? void 0 : t.localStorage, r = 'ng-', i = {
        set: function (e, i) {
          if ('undefined' != typeof i) {
            var o = t.JSON.stringify(i);
            n.setItem(r + e, o);
          }
          return i;
        },
        get: function (e) {
          var i = n.getItem(r + e);
          return 'undefined' != i ? t.JSON.parse(i) : void 0;
        },
        remove: function (e) {
          return n.removeItem(r + e), !0;
        },
        bind: function (t, n, r) {
          var o = {
              defaultValue: '',
              storeName: ''
            };
          r = angular.isString(r) ? angular.extend({}, o, { defaultValue: r }) : angular.isUndefined(r) ? o : angular.extend(o, r);
          var a = r.storeName || n;
          return i.get(a) || i.set(a, r.defaultValue), e(n).assign(t, i.get(a)), t.$watch(n, function (e) {
            angular.isDefined(e) && i.set(a, e);
          }, !0), i.get(a);
        },
        unbind: function (t, n, r) {
          r = r || n, e(n).assign(t, null), t.$watch(n, function () {
          }), i.remove(r);
        },
        clearAll: function () {
          n.clear();
        },
        setPrefix: function (e) {
          r = e;
        }
      };
    return i;
  }
]), window.cache = {}, angular.module('cache', [
  'ng',
  'storage'
]).value('cache-download-delay', 100).value('cache-hash', murmurhash).factory('cache-fs', [
  '$q',
  function () {
    var e;
    return e = $.Deferred(), 'undefined' != typeof cordova ? $(document).on('deviceready', function () {
      return console.log('Requesting FileSytem...'), window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, e.resolve, e.reject);
    }) : e.reject(), e.done(function (e) {
      var t;
      return t = function () {
        return console.log('.nomedia created');
      }, device.android() && dir.getFile('.nomedia', {
        create: !0,
        exclusive: !1
      }, t), window.cache.fs = e;
    }), e;
  }
]).factory('cache-dir', [
  '$q',
  'cache-fs',
  'storage',
  function (e, t) {
    return t;
  }
]).factory('cache-download', [
  'cache-dir',
  '$q',
  'cache-download-delay',
  function (e) {
    var t;
    return t = $.Deferred(), window.cache.previousDownload = t, t.resolve(), function (n, r) {
      var i, o;
      return i = $.Deferred(), cordova ? (o = function (e) {
        return null != e.setMetadata && e.setMetadata(function () {
        }, function () {
        }, { 'com.apple.MobileBackup': 1 }), i.resolve();
      }, e.done(function (e) {
        var a;
        return n = encodeURI(n), t.always(function () {
          var t, a;
          return a = new FileTransfer(), t = function (e) {
            return r = e.toURL(), console.log('Downloading', n, r), a.download(n, r, o, i.reject, !0);
          }, e.getFile(r, {
            create: !0,
            exclusive: !1
          }, t, i.reject);
        }), t = i, a = i, window.cache.previousDownload = t;
      }), i) : (i.reject(), i);
    };
  }
]).filter('cache', [
  'cache-hash',
  'storage',
  'cache-dir',
  'cache-download',
  function (e, t, n, r) {
    var i, o, a;
    return i = t.get('cache-version') || {}, a = '.cache', o = t.get('cache-dir') || null, null == o && n.done(function (e) {
      return t.set('cache-dir', e.fullPath), o = e.fullPath, angular.forEach(i(function (e, n) {
        var r, a;
        return r = function () {
          return console.log('file is invalid!', n), i = {}, t.set('cache-version', i);
        }, a = function (r) {
          return 'downloading' === e ? (console.log('removing interupted download', n), r.remove(), i[n] = null, t.set('cache-version', i)) : void 0;
        }, o.getFile(n, {
          create: !1,
          exclusive: !1
        }, a, r);
      }));
    }), window.cache.init = angular.copy(i), window.cache.cache = i, function (n, s, u) {
      var l, c;
      if (!n)
        return '';
      if (c = e(n), null == s && (s = c + a), null == u && (u = c), 'remove' === u && (console.log('removing', s, 'from cache'), i[s] = null), null != o) {
        if (l = function () {
            return console.log('download queue', s, u), i[s] = 'downloading', r(n, s).done(function () {
              return console.log('download ready', s), i[s] = u, t.set('cache-version', i);
            }).fail(function () {
              return console.log('download fail', s), i[s] = null, t.set('cache-version', i);
            });
          }, i[s] === u)
          return o + '/' + s;
        'downloading' !== i[s] && l();
      }
      return n;
    };
  }
]), angular.module('databind', [
  'firebase',
  'storage'
]).value('databind-config', {
  url: '',
  storage: !0,
  firebase: !0,
  sync: 1000
}).factory('databind', [
  '$firebase',
  'databind-config',
  'storage',
  '$http',
  '$timeout',
  function (e, t, n) {
    var r, i, o, a, s, u, l, c, d, f;
    return o = {
      storage: !0,
      firebase: !0,
      sync: 1000
    }, angular.extend(o, t), f = function (e) {
      return /(number|string)/.test(typeof e) ? { $value: e } : angular.copy(e);
    }, d = function (e) {
      return (null != e ? e.$value : void 0) ? e.$value : angular.copy(e);
    }, s = function (e) {
      return e.replace('http:', 'https:').replace(/(|\/)$/, '/');
    }, c = n.get(o.url) || {}, l = function (e, t) {
      var r, i, a, s, u, l;
      for (t = d(t), r = c, a = e.split('/'), i = a.pop(), u = 0, l = a.length; l > u; u++)
        s = a[u], '' !== s && (null == r[s] && (r[s] = {}), r = r[s]);
      return r[i] !== t ? (r[i] = t, $.throttle(o.sync, function () {
        return n.set(o.url, c);
      })()) : void 0;
    }, u = function (e) {
      var t, n, r, i, o;
      for (t = c, o = e.split('/'), r = 0, i = o.length; i > r; r++)
        n = o[r], null != t && '' !== n && (t = t[n]);
      return f(t);
    }, r = function (e, t, n) {
      return e.$watch(t, function (e) {
        return console.log('watch save', t, e), l(n, e);
      }, !0);
    }, a = function (e) {
      var t, n;
      for (t in e)
        n = e[t], e[t] = null, delete e[t];
      return null;
    }, i = function (t, n) {
      var o, c, p, h, g, m, v, y;
      return n = angular.extend({}, i.config, n), p = $.Deferred(), m = null, g = null, o = new Promise(function (e, t) {
        var n;
        return m = e, n = t;
      }), n.firebase ? (h = new Firebase(s(n.url) + t), c = e(h), n.storage && h.once('value', function (e) {
        var n, r, i;
        r = e.val();
        for (n in c)
          i = c[n], '$' !== n[0] && null == r[n] && delete c[n];
        return l(t, c);
      }), c.$destroy = a, c.$promise = o, c.$loaded = !1, h.once('value', function (e) {
        return c.$loaded = !0, m(e.val()), p.resolveWith(e.val());
      })) : (c = {
        $loaded: !1,
        $destroy: a,
        $promise: p.promise(),
        $set: function (e) {
          return angular.extend(c, f(e)), n.storage ? l(t, c) : void 0;
        },
        $get: function () {
          var e, r, i;
          return e = function (e) {
            return console.error('DataBind Error', t, e);
          }, i = function (e) {
            return angular.extend(c, e), p.resolveWith(e), m(e), c.$loaded = !0, n.storage ? l(t, e) : void 0;
          }, r = new Promise(function (e, r) {
            return $.ajax({
              url: s(n.url) + t + '.json',
              dataType: 'jsonp'
            }).done(e).fail(r);
          }), r.then(i)['catch'](e);
        },
        $bind: function (e, i) {
          return n.storage && r(e, i, t), e[i] = d(c), c;
        },
        $save: function (e) {
          return n.storage && e ? l('' + t + '/' + e, c[e]) : n.storage ? l(t, c) : void 0;
        }
      }, c.$get()), n.storage && (v = u(t), angular.extend(c, v), c.$loaded = !$.isEmptyObject(v), n.firebase && (y = c.$bind, c.$bind = function (e, t) {
        return e.$on('$destroy', c.$destroy), e[t] = d(c), y(e, t);
      }, c.$on('change', function () {
        return l(t, c);
      }))), c;
    }, window.databind = angular.extend(i, {
      save: l,
      load: u,
      wrap: f,
      unwrap: d,
      config: o
    }), i;
  }
]), angular.module('jqHttp', []).factory('jqHttp', [
  '$http',
  '$q',
  function (e, t) {
    var n;
    return n = function (e) {
      var n, r;
      return n = t.defer(), r = {
        url: e.url,
        type: e.method,
        timeout: e.timeout,
        contentType: 'application/json;charset=UTF-8',
        data: angular.toJson(e.data)
      }, console.log('ajax', r), $.ajax(r).done(function (t, r, i) {
        return n.resolve({
          data: t,
          config: e,
          headers: function () {
          },
          status: i.status,
          jqXHR: i
        });
      }).fail(function (t) {
        return n.reject({
          data: t.responseJSON,
          config: e,
          headers: function () {
          },
          status: t.status,
          jqXHR: t
        });
      }), n.promise;
    }, angular.forEach([
      'get',
      'head',
      'post',
      'put',
      'delete',
      'jsonp'
    ], function (e) {
      return n[e] = function (t, r, i) {
        return null == i && (i = {}), i.method = e, i.url = t, i.data = r, n(i);
      };
    }), n;
  }
]), angular.module('video', ['ui.bootstrap.modal']).factory('parseVideoUrl', [
  '$http',
  function () {
    var e;
    return e = function (e, t) {
      var n, r, i;
      e = angular.extend({}, t, e), n = [];
      for (r in e)
        i = e[r], n.push(r + '=' + i);
      return n.join('&');
    }, function (t, n, r, i) {
      var o, a, s;
      return null == (null != t ? t.match : void 0) ? null : (null == r && (r = !1), null == i && (i = !1), o = $.Deferred(), s = {}, a = t.match(/^(http:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)(.{4,12})/), null != (null != a ? a[4] : void 0) ? (n = e(n, {
        rel: 0,
        showinfo: 0,
        autohide: 1,
        color: 'white',
        autoplay: 1,
        controls: 0
      }), s = {
        id: a[4],
        isYoutube: !0,
        isVimeo: !1,
        request: o,
        title: '',
        img: 'http://img.youtube.com/vi/' + a[4] + '/0.jpg',
        embed: 'http://www.youtube.com/embed/' + a[4] + '?' + n,
        url: 'http://www.youtube.com/watch?v=' + a[4]
      }, i === !0 ? $.ajax('https://gdata.youtube.com/feeds/api/videos/' + a[4] + '?v=2&alt=json', { dataType: 'JSONP' }).done(function (e) {
        var t, n;
        return s.title = null != e ? null != (t = e.entry) ? null != (n = t.title) ? n.$t : void 0 : void 0 : void 0, o.resolve();
      }).fail(function () {
        return o.reject();
      }) : o.resolve(), s) : (a = t.match(/^(http:\/\/)?(www\.)?vimeo\.com\/([0-9]{5,10})$/), null != (null != a ? a[3] : void 0) ? (n = e(n, {
        byline: 0,
        color: 'ffffff',
        autoplay: 1
      }), s = {
        id: a[3],
        isYoutube: !1,
        isVimeo: !0,
        request: o,
        title: '',
        img: '',
        embed: 'http://player.vimeo.com/video/' + a[3] + '?' + n,
        url: 'http://vimeo.com/' + a[3]
      }, i === !0 || r === !0 ? $.ajax('http://vimeo.com/api/v2/video/' + a[3] + '.json', { dataType: 'JSONP' }).done(function (e) {
        var t, n;
        return s.img = null != e ? null != (t = e[0]) ? t.thumbnail_large : void 0 : void 0, s.title = null != e ? null != (n = e[0]) ? n.title : void 0 : void 0, o.resolve();
      }).fail(function () {
        return o.reject();
      }) : o.resolve(), s) : void 0));
    };
  }
]).directive('video', [
  '$http',
  '$modal',
  'parseVideoUrl',
  function (e, t, n) {
    var r;
    return r = 0, {
      restrict: 'A',
      priority: 100,
      link: function (e, t, i) {
        var o, a, s, u, l, c, d, f, p, h, g, m;
        return d = null != i.popup ? e.$eval(i.popup) : !device.desktop(), c = !1, u = 1, f = e.$eval(i.title) || null, p = e.$eval(i.video), o = $(t), m = i.width || '100%', l = i.height || o.height(), r++, o.attr('id', 'video' + r), g = '#video' + r, h = n(p, { autoplay: u }, !0, !1), null == h ? (o.remove(), void 0) : ((d || 1 === u) && o.html('<div class="marked"><h2 class="mark">' + f + '</h2></div><div class="play video-play-button"><div class="inner"></div></div>'), h.request.then(function () {
          return $(g).find('h2').text(f || h.title), $(g).css('background-image', 'url(' + h.img + ')'), $(g).attr('title', f || h.title);
        }), o.css({
          'background-color': 'black',
          'background-position': 'center',
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          width: m + 'px',
          height: l + 'px',
          display: 'block',
          position: 'relative'
        }), s = {
          target: device.android() || h.isYoutube ? '_system' : '_blank',
          params: device.android() ? 'location=yes' : 'location=no,toolbar=yes,enableViewportScale=yes,presentationstyle=formsheet',
          url: c || !d ? h.embed : h.url,
          popup: d ? 'true' : 'false'
        }, o.attr(s), d ? (o.find('.inner').hammer().on('tap', function (e) {
          return window.open(s.url, s.target, s.params), e.gesture.stopPropagation();
        }), e.$on('$detroy', function () {
          return o.find('.inner').hammer().off('tap');
        })) : (a = function (e, t) {
          var n, r;
          return null == e && (e = o), null == t && (t = !1), r = '<iframe style="position: absolute; top:0;bottom:0;left:0;right:0;"frameborder="0" src="' + h.embed + '" width="' + m + '" height="' + l + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>', n = $(r), $(e).append(n);
        }, 1 === u ? o.find('.inner').hammer().one('tap', function () {
          return a($(g));
        }) : a()));
      }
    };
  }
]).directive('videoClickDelegate', [function () {
    return {
      link: function (e, t) {
        return $(t).hammer().on('tap', '.swiper-slide', function (e) {
          var t, n, r, i, o, a, s, u, l;
          return t = $(e.currentTarget), 'false' === t.attr('popup') ? (o = t.attr('url'), l = t.width(), r = t.height(), s = '<iframe style="position: absolute; top:0;bottom:0;left:0;right:0;"frameborder="0" src="' + o + '" width="' + l + '" height="' + r + '" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>', n = $(s), t.append(n)) : (u = t.attr('url') || '', a = t.attr('target') || '_system', i = t.attr('params') || '', u.length > 0 ? window.open(u, a, i) : void 0);
        }), e.$on('$detroy', function () {
          return $(t).hammer().off('tap');
        });
      }
    };
  }]), angular.module('email', [
  'angular-gestures',
  'storage'
]).directive('email', [
  '$http',
  function (e) {
    return {
      scope: {
        subjects: '=subject',
        msg: '&message',
        placeholder: '=placeholder',
        to: '=to'
      },
      templateUrl: 'toolbelt/angular/angular-email.jade',
      controller: [
        '$scope',
        '$http',
        'storage',
        function (e, t, n) {
          return n.bind(e, 'email'), e.message || (e.message = ''), e.subjects ? e.subject = e.subjects.split('\n')[0] : void 0;
        }
      ],
      link: function (t, n, r) {
        var i;
        return i = r.send ? r.send : 'Send', t.msgs = {
          send: '' + i + ' \xbb',
          sending: 'Sending...',
          sent: 'Done!',
          error: 'Error, Try again \xbb'
        }, r.rows && angular.element('.email-msg').attr('rows', r.rows), r.send && angular.element('.email-send').val(r.send), t.status = 'send', t.send = function () {
          var r, i, o;
          if (('send' === t.status || 'error' === t.status) && (angular.element(n).find('.email-msg,input').removeClass('ng-pristine').addClass('ng-dirty'), !t.emailForm.$invalid))
            return t.status = 'sending', r = {
              subject: t.subject || '',
              from: t.email.from,
              fromName: t.email.fromName,
              to: t.to,
              message: t.msg || t.placeholder,
              firebase: 'https://goodmusic.firebaseio.com/1-0-0/email.json'
            }, i = null != (o = t.to) ? o.match(/^([^<]+) <(.+@.+\..+)>$/) : void 0, i && (r.to = i[2], r.toName = i[1]), console.log('Sending mail: ', r), e.post('http://goodmusic.madebymark.nl/1.1.5/api/email/email.php', r)['catch'](function () {
              return t.status = 'error';
            }).then(function (e) {
              return t.status = null == (null != e ? e.data : void 0) || e.data.error ? 'error' : 'sent';
            });
        }, t.enable = function () {
          return 'sent' === t.status ? t.status = 'send' : void 0;
        };
      }
    };
  }
]), angular.module('opener', []).factory('opener', [function () {
    var e;
    return e = window, function (t, n) {
      var r, i;
      return null == n && (n = '_blank'), r = /\.pdf/.test(t), i = 'location=yes', r && device.android() && (t = 'https://docs.google.com/viewer?embedded=true&url=' + t), r && device.ios() && (i = 'location=no,toolbar=yes,enableViewportScale=yes,presentationstyle=formsheet'), e.open(t, n, i);
    };
  }]).directive('open', [
  '$parse',
  '$window',
  'opener',
  function (e, t, n) {
    return {
      priority: 10,
      scope: !0,
      link: function (t, r, i) {
        var o, a;
        return a = window, o = e(i.open), 'undefined' != typeof cordova && cordova ? (null == i.hmTap && console.log('No hm-tap attribute found to open \'' + i.open + '\''), i.hmTap = 'launch()', $(r).hammer().on('tap', function () {
          var e, r;
          return r = o(t), e = i.target || '_blank', n(r, e);
        })) : t.$watch(i.open, function (e) {
          return $(r).attr({
            href: e ? e : null,
            target: '_blank'
          });
        });
      }
    };
  }
]);
var __bind = function (e, t) {
  return function () {
    return e.apply(t, arguments);
  };
};
!function () {
  var e, t;
  return 'undefined' != typeof soundManager && null !== soundManager && soundManager.setup({
    url: window.BASE_URL + '',
    defaultOptions: { autoLoad: !0 }
  }), t = $.Deferred(), console.log('Audio Tag Sound Engine'), e = function () {
    function e(e, t, n, r) {
      this.url = e, t = t || function () {
      }, n = n || function () {
      }, r = r || function () {
      }, window.AUDIO_PLAYER = window.AUDIO_PLAYER || document.createElement('audio'), this.audio = window.AUDIO_PLAYER, r(1), this.audio.oncanplaythrough = function () {
        return this.buffering = !1;
      }, this.audio.onplaying = function () {
        return r(2);
      }, this.audio.onpause = function () {
        return r(3);
      }, this.audio.onended = function () {
        return r(4);
      }, this.audio.onerror = function () {
        return n();
      }, this.buffering = !0, this.audio.setAttribute('preload', !0), this.audio.currentTime = 0;
    }
    return e.MEDIA_NONE = 0, e.MEDIA_STARTING = 1, e.MEDIA_RUNNING = 2, e.MEDIA_PAUSED = 3, e.MEDIA_STOPPED = 4, e.prototype.play = function () {
      return this.audio.setAttribute('src', this.url), this.audio.load(), this.audio.play();
    }, e.prototype.pause = function () {
      return this.audio.pause();
    }, e.prototype.stop = function () {
      return this.audio.currentTime = 0, this.audio.play();
    }, e.prototype.getCurrentPosition = function (e) {
      return 'function' == typeof e && e(this.audio.currentTime), this.audio.currentTime;
    }, e.prototype.seekTo = function (e) {
      return this.audio.currentTime = e;
    }, e.prototype.getDuration = function () {
      return this.audio.duration;
    }, e.prototype.release = function () {
      return this.audio.setAttribute('src', '');
    }, e.prototype.setVolume = function (e) {
      return this.audio.volume = e;
    }, e.prototype.isBuffering = function () {
      return this.buffered;
    }, window.Media = window.AngularMedia = e, t.resolve(), e;
  }(), t.fail(function () {
    return console.log('no sound engine available');
  }), angular.module('audio', []).factory('createAudio', [
    '$rootScope',
    'streamUrl',
    function (e, t) {
      var n, r;
      return n = function (e) {
        var t;
        return t = Math.floor(e / 60), e = Math.floor(e % 60), 10 > e && (e = '0' + e), '' + t + ':' + e;
      }, r = 0, function (i, o, a, s) {
        var u, l, c, d, f;
        return clearInterval(r), o = o || function () {
        }, a = a || function () {
        }, 'string' == typeof i ? (f = i, i = { url: f }) : null != (null != i ? i.url : void 0) ? f = i.url : null != (null != i ? i.artist : void 0) && null != (null != i ? i.track : void 0) ? (f = t(i.artist, i.track), i.url = f) : console.log('createAudio error: invalid data/url', i), l = null, c = 0, d = function () {
          return null != l ? l.getCurrentPosition(function (t) {
            var r;
            return c = (null != l ? l.percent : void 0) || 0, r = (null != l ? l.getDuration() : void 0) || 60, (null != l ? l._preloading : void 0) === !0 && t > 0 && (l._preloading = !1, l.setVolume(100), l.pause()), null != l && (l.percent = 100 * (t / r)), null != l && (l.durationText = n(r)), null != l && (l.positionText = n(t)), e.$broadcast('media.playing', l);
          }) : void 0;
        }, u = function (t) {
          return s && s(t), 2 === t ? r = setInterval(d, 500) : (3 !== t && null != l && (l.percent = 0), clearInterval(r)), e.$broadcast('media.status', l, t);
        }, l = new window.AngularMedia(f, o, a, u), l.url = f, l.meta = i, l;
      };
    }
  ]).factory('streamUrl', [function () {
      var e, t, n, r;
      return r = '1-0-0', t = 10000, n = navigator.userAgent, device.android() && (n = 'android'), device.ios() && (n = 'ios'), e = 'secretJazz', function (i, o) {
        var a, s, u, l, c;
        return s = (Math.random() + '').substr(2, 8), u = new Date().getTime() / 1000, l = Math.floor(u / t), a = [
          r,
          i,
          o,
          s,
          n,
          l
        ].join('|'), c = Cjs.hx(a, e).toString(), 'http://goodmusic.madebymark.nl/1.1.5/api/music/stream.php?version=' + r + '&artist=' + i + '&track=' + o + '&id=' + s + '&token=' + c;
      };
    }]).factory('playlist', [
    'streamUrl',
    'createAudio',
    function (e, t) {
      var n;
      return n = function () {
        function e() {
          this.setPlaylist = __bind(this.setPlaylist, this), this.queue = __bind(this.queue, this), this.createOnStatus = __bind(this.createOnStatus, this), this.createOnError = __bind(this.createOnError, this), this.createOnDone = __bind(this.createOnDone, this), this.setTrack = __bind(this.setTrack, this), this.prev = __bind(this.prev, this), this.next = __bind(this.next, this), this.stop = __bind(this.stop, this), this.release = __bind(this.release, this), this.getCurrentMedia = __bind(this.getCurrentMedia, this), this.getCurrentIndex = __bind(this.getCurrentIndex, this), this.isPlaying = __bind(this.isPlaying, this), this.isBuffering = __bind(this.isBuffering, this), this.pause = __bind(this.pause, this), this.play = __bind(this.play, this), this._index = 0, this._loop = !1, this._playlist = [], this._media = [];
        }
        return e.prototype.play = function (e) {
          return null == e && (e = !1), this._playing && !e || null == this._media[this._index] ? void 0 : (e && this.stop(), this._playing = !0, this._media[this._index].play());
        }, e.prototype.pause = function () {
          var e;
          return this._playing = !1, null != (e = this._media[this._index]) ? e.pause() : void 0;
        }, e.prototype.isBuffering = function () {
          var e;
          return null != (e = this._media[this._index]) ? e.isBuffering() : void 0;
        }, e.prototype.isPlaying = function (e) {
          return null == e && (e = null), null != e ? this._playing && this._index === e : this._playing;
        }, e.prototype.getCurrentIndex = function () {
          return this._index;
        }, e.prototype.getCurrentMedia = function () {
          return this._media[this._index];
        }, e.prototype.release = function () {
          var e, t, n, r, i;
          for (r = this._media, i = [], t = 0, n = r.length; n > t; t++)
            e = r[t], i.push(e.release());
          return i;
        }, e.prototype.stop = function () {
          var e;
          return this._playing = !1, null != (e = this._media[this._index]) ? e.stop() : void 0;
        }, e.prototype.next = function (e) {
          var t;
          return t = this._index + 1, t >= this._playlist.length && this._loop && (t = 0), this.setTrack(t, e);
        }, e.prototype.prev = function (e) {
          var t;
          return t = this._index - 1, 0 > t && this._loop && (t = this._playlist.length - 1), this.setTrack(t, e);
        }, e.prototype.setLoop = function (e) {
          return this._loop = e;
        }, e.prototype.setTrack = function (e, t) {
          var n;
          return n = this._playing || t, e !== this._index && this.stop(), e >= -1 && e <= this._media.length && (this._index = e), n ? this.play(!0) : void 0;
        }, e.prototype.createOnDone = function (e) {
          var t = this;
          return function () {
            return e === t._index && t._playing ? t.next(!0) : void 0;
          };
        }, e.prototype.createOnError = function (e) {
          var t = this;
          return function () {
            return e === t._index ? (console.log('audio error', arguments), t._playing = !1) : void 0;
          };
        }, e.prototype.createOnStatus = function (e) {
          var t = this;
          return function (n) {
            return e === t._index ? (console.log('audio status', n), t._playing = 2 === n) : void 0;
          };
        }, e.prototype.queue = function (e) {
          var n, r;
          return n = this._playlist.length, this._playlist.push(e), r = t(e, this.createOnDone(n), this.createOnError(n), this.createOnStatus(n)), this._media.push(r);
        }, e.prototype.setPlaylist = function (e) {
          var t, n, r;
          if (!angular.equals(this._playlist, e)) {
            for (this.release(), this._media = [], this._playlist = [], this._index = 0, n = 0, r = e.length; r > n; n++)
              t = e[n], this.queue(t);
            if (this._playing)
              return this.play(!0);
          }
        }, e;
      }(), new n();
    }
  ]).directive('artistPlaylist', [
    'playlist',
    function (e) {
      return {
        scope: !0,
        controller: function () {
        },
        link: function (t, n, r) {
          var i, o, a, s, u, l, c, d, f;
          d = t.$eval(r.tracks), i = t.$eval(r.artistPlaylist), u = t.$eval(r.loop), e.setLoop(u), s = [];
          for (a in d)
            if (o = d[a], '$' !== a[0]) {
              if (l = {}, 'object' == typeof o) {
                for (c in o)
                  f = o[c], '$' !== a[0] && (l[c] = f);
                l.artist = i, l.track = a;
              } else
                l = {
                  artist: i,
                  track: a
                };
              s.push(l);
            }
          return t.playlist = s;
        }
      };
    }
  ]).directive('artistTrack', [
    '$rootScope',
    'playlist',
    function (e, t) {
      return window.p = t, {
        scope: !0,
        require: '^artistPlaylist',
        link: function (n, r, i) {
          var o, a, s, u, l, c, d;
          return s = n.$eval(i.artistTrack), l = null != (c = n.playlist) ? null != (d = c[s]) ? d.track : void 0 : void 0, o = !1, n.percent = 0, e.$on('media.playing', function (e, t) {
            return o || (n.percent = (null != t ? t.percent : void 0) || 0, '$digest' === n.$$phase) ? void 0 : n.$apply();
          }), n.play = function () {
            return n.percent = 0, t.setPlaylist(n.playlist), t.setTrack(s), t.play();
          }, u = function () {
            var e, n;
            return (null != (e = t.getCurrentMedia()) ? null != (n = e.meta) ? n.track : void 0 : void 0) === l;
          }, n.isPlaying = function () {
            return t.isPlaying() && u();
          }, n.pause = function () {
            return t.pause();
          }, n.isBuffering = function () {
            return n.isPlaying() && t.isBuffering();
          }, a = $(r).find('.seeker').hammer(), a.on('drag', function (e) {
            var r, i, a, s, u, l, c;
            return o = !0, n.isPlaying() && (null != (u = t.getCurrentMedia()) ? u.getDuration() : void 0) > 0 ? (r = $(e.target), a = (null != (l = r.offset()) ? l.left : void 0) || 0, i = (null != (c = e.gesture.touches[0]) ? c.pageX : void 0) || 0, s = r.width(), n.percent = 100 * (i - a) / s) : void 0;
          }), a.on('dragend', function () {
            var e, r;
            return t.isPlaying() && o && (e = t.getCurrentMedia(), r = 0.01 * n.percent * (null != e ? e.getDuration() : void 0), null != e && e.seekTo(r)), o = !1;
          });
        }
      };
    }
  ]);
}(), angular.module('collapser', []).directive('collapser', [function () {
    return {
      restrict: 'A',
      transclude: !0,
      template: '<div class="collapser-content" ng-transclude></div>',
      link: function (e, t, n) {
        var r, i, o;
        return r = angular.element(t), r.addClass('collapser'), i = !0, o = !0, e.$watch(n.collapser, function (e) {
          return !i && o && (r.addClass('collapser-animate'), o = !1), i = !1, e ? r.removeClass('collapser-open') : r.addClass('collapser-open');
        });
      }
    };
  }]), angular.module('scroll', []).constant('scrollTo', window.scrollTo = function (e, t, n) {
  var r, i, o;
  return null == t && (t = 350), null == n && (n = -55), r = $(e), 0 !== r.length ? (i = r.offset(), o = i.top + n, $('html,body').animate({ scrollTop: o }, t)) : void 0;
}), angular.module('angular-gestures', []);
var HGESTURES = {
    hmDoubleTap: 'doubletap',
    hmDragStart: 'dragstart',
    hmDrag: 'drag',
    hmDragUp: 'dragup',
    hmDragDown: 'dragdown',
    hmDragLeft: 'dragleft',
    hmDragRight: 'dragright',
    hmDragEnd: 'dragend',
    hmHold: 'hold',
    hmPinch: 'pinch',
    hmPinchIn: 'pinchin',
    hmPinchOut: 'pinchout',
    hmRelease: 'release',
    hmRotate: 'rotate',
    hmSwipe: 'swipe',
    hmSwipeUp: 'swipeup',
    hmSwipeDown: 'swipedown',
    hmSwipeLeft: 'swipeleft',
    hmSwipeRight: 'swiperight',
    hmTap: 'tap',
    hmTouch: 'touch',
    hmTransformStart: 'transformstart',
    hmTransform: 'transform',
    hmTransformEnd: 'transformend'
  };
angular.forEach(HGESTURES, function (e, t) {
  angular.module('angular-gestures').directive(t, [
    '$parse',
    '$log',
    function (n) {
      return function (r, i, o) {
        var a, s;
        o.$observe(t, function (u) {
          var l = n(u), c = n(o[t + 'Opts'])(r, {});
          a = new Hammer(i[0], c), s = function (e) {
            r.$apply(function () {
              l(r, { $event: e });
            });
          }, a.on(e, s);
        }), r.$on('$destroy', function () {
          a.off(e, s);
        });
      };
    }
  ]);
}), angular.module('debounce', []).factory('debounce', [
  '$timeout',
  function (e) {
    return function (t, n, r) {
      t = angular.isUndefined(t) ? 0 : t, r = angular.isUndefined(r) ? !0 : r;
      var i = 0;
      return function () {
        var o = this, a = arguments;
        i++;
        var s = function (e) {
            return function () {
              return e === i ? n.apply(o, a) : void 0;
            };
          }(i);
        return e(s, t, r);
      };
    };
  }
]), angular.module('hm-sref', ['ui.router']).value('parseStateRef', function (e) {
  var t;
  if (t = e.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/), !t || 4 !== t.length)
    throw new Error('Invalid state ref \'' + e + '\'');
  return {
    state: t[1],
    paramExpr: t[3] || null
  };
}).directive('hmSref', [
  '$parse',
  '$log',
  '$state',
  'parseStateRef',
  function (e, t, n, r) {
    return {
      restrict: 'A',
      require: '?^uiSrefActive',
      link: function (t, i, o, a) {
        var s, u, l, c, d, f;
        return d = r(o.hmSref || ''), f = d.state, c = t.$eval(d.paramExpr), l = e(o.hmSrefOpts)(t, {}), s = new Hammer(i[0], l), u = function () {
          return n.go(f, c, { reload: null != o.hmSrefReload });
        }, s.on('tap', u), t.$on('$destroy', function () {
          return s.off('tap', u);
        }), null != a ? a.$$setStateInfo(f, c) : void 0;
      }
    };
  }
]).directive('hmSrefDelegate', [
  '$rootScope',
  '$location',
  '$state',
  'parseStateRef',
  function (e, t, n, r) {
    return {
      link: function (e, t) {
        var i;
        return i = function (t) {
          var i, o, a, s, u;
          return a = $(t.currentTarget).attr('hm-sref'), o = null != $(t.currentTarget).attr('hm-sref-reload'), s = r(a), u = s.state, i = e.$eval(s.paramExpr), n.go(u, i);
        }, $(t).hammer().on('tap', 'a[hm-sref]', i), e.$on('$destroy', function () {
          return $(t).hammer().off('tap');
        });
      }
    };
  }
]), function (e, t, n) {
  'use strict';
  function r(e, t, i, o, a) {
    function s() {
      d && d();
    }
    var u = e.$eval(i[o]), l = (i.onceWaitFor ? e.$eval(i.onceWaitFor) : u) !== n;
    if (l)
      return a(t, u);
    var c = i.onceWaitFor || i[o], d = e.$watch(c, function (u) {
        return u != n ? (s(), r(e, t, i, o, a)) : void 0;
      });
    e.$on('$destroy', s);
  }
  function i(e) {
    o.directive(e.name, function () {
      return {
        restrict: 'A',
        priority: 100,
        link: function (t, n, i) {
          r(t, n, i, e.name, e.binding);
        }
      };
    });
  }
  var o = t.module('once', []), a = [
      {
        name: 'onceText',
        binding: function (e, t) {
          e.text(t);
        }
      },
      {
        name: 'onceHtml',
        binding: function (e, t) {
          e.html(t);
        }
      },
      {
        name: 'onceSrc',
        binding: function (e, t) {
          e.attr('src', t);
        }
      },
      {
        name: 'onceHref',
        binding: function (e, t) {
          e.attr('href', t);
        }
      },
      {
        name: 'onceTitle',
        binding: function (e, t) {
          e.attr('title', t);
        }
      },
      {
        name: 'onceAlt',
        binding: function (e, t) {
          e.attr('alt', t);
        }
      },
      {
        name: 'onceId',
        binding: function (e, t) {
          e.attr('id', t);
        }
      },
      {
        name: 'onceIf',
        binding: function (e, t) {
          t || e.remove();
        }
      },
      {
        name: 'onceClass',
        binding: function (e, n) {
          if (t.isObject(n) && !t.isArray(n)) {
            var r = [];
            t.forEach(n, function (e, t) {
              e && r.push(t);
            }), n = r;
          }
          n && e.addClass(t.isArray(n) ? n.join(' ') : n);
        }
      },
      {
        name: 'onceStyle',
        binding: function (e, t) {
          e.css(t);
        }
      },
      {
        name: 'onceShow',
        binding: function (e, t) {
          t ? e.css('display', '') : e.css('display', 'none');
        }
      },
      {
        name: 'onceHide',
        binding: function (e, t) {
          t ? e.css('display', 'none') : e.css('display', '');
        }
      }
    ];
  t.forEach(a, i), o.directive('once', function () {
    return {
      restrict: 'A',
      priority: 100,
      link: function (e, n, i) {
        t.forEach(i, function (t, o) {
          if (/^once(Css|Attr)[A-Z]/.test(o)) {
            var a = function (e, t) {
              var n = o.replace(/[A-Z]/g, function (e) {
                  return '-' + e.toLowerCase();
                });
              if ('Css' === o.substring(4, 7)) {
                var r = n.substr(9);
                e.css(r, t);
              } else {
                var r = n.substr(10);
                e.attr(r, t);
              }
            };
            r(e, n, i, o, a);
          }
        });
      }
    };
  });
}(window, window.angular), angular.module('history', []).factory('history', [
  '$rootScope',
  '$state',
  function (e, t) {
    var n, r;
    return r = [], n = !1, {
      init: function () {
        return e.$on('$stateChangeSuccess', function (e, t, i, o, a) {
          return n || null == t.templateUrl || r.push([
            o.name,
            a
          ]), n = !1;
        }), e.back = function () {
          var e, i, o;
          return o = r.pop(), e = o[0], i = o[1], n = !0, t.go(e, i);
        }, e.canGoBack = function () {
          return r.length > 1;
        };
      }
    };
  }
]), angular.module('ui.bootstrap', [
  'ui.bootstrap.tpls',
  'ui.bootstrap.transition',
  'ui.bootstrap.collapse',
  'ui.bootstrap.accordion',
  'ui.bootstrap.alert',
  'ui.bootstrap.bindHtml',
  'ui.bootstrap.buttons',
  'ui.bootstrap.position',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.dropdownToggle',
  'ui.bootstrap.modal',
  'ui.bootstrap.pagination',
  'ui.bootstrap.tooltip',
  'ui.bootstrap.popover',
  'ui.bootstrap.progressbar',
  'ui.bootstrap.tabs',
  'ui.bootstrap.timepicker',
  'ui.bootstrap.typeahead'
]), angular.module('ui.bootstrap.tpls', [
  'template/accordion/accordion-group.html',
  'template/accordion/accordion.html',
  'template/alert/alert.html',
  'template/datepicker/datepicker.html',
  'template/datepicker/popup.html',
  'template/modal/backdrop.html',
  'template/modal/window.html',
  'template/pagination/pager.html',
  'template/pagination/pagination.html',
  'template/tooltip/tooltip-html-unsafe-popup.html',
  'template/tooltip/tooltip-popup.html',
  'template/popover/popover.html',
  'template/progressbar/bar.html',
  'template/progressbar/progress.html',
  'template/progressbar/progressbar.html',
  'template/tabs/tab.html',
  'template/tabs/tabset.html',
  'template/timepicker/timepicker.html',
  'template/typeahead/typeahead-match.html',
  'template/typeahead/typeahead-popup.html'
]), angular.module('ui.bootstrap.transition', []).factory('$transition', [
  '$q',
  '$timeout',
  '$rootScope',
  function (e, t, n) {
    function r(e) {
      for (var t in e)
        if (void 0 !== o.style[t])
          return e[t];
    }
    var i = function (r, o, a) {
        a = a || {};
        var s = e.defer(), u = i[a.animation ? 'animationEndEventName' : 'transitionEndEventName'], l = function () {
            n.$apply(function () {
              r.unbind(u, l), s.resolve(r);
            });
          };
        return u && r.bind(u, l), t(function () {
          angular.isString(o) ? r.addClass(o) : angular.isFunction(o) ? o(r) : angular.isObject(o) && r.css(o), u || s.resolve(r);
        }), s.promise.cancel = function () {
          u && r.unbind(u, l), s.reject('Transition cancelled');
        }, s.promise;
      }, o = document.createElement('trans'), a = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd',
        transition: 'transitionend'
      }, s = {
        WebkitTransition: 'webkitAnimationEnd',
        MozTransition: 'animationend',
        OTransition: 'oAnimationEnd',
        transition: 'animationend'
      };
    return i.transitionEndEventName = r(a), i.animationEndEventName = r(s), i;
  }
]), angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition']).directive('collapse', [
  '$transition',
  '$timeout',
  function (e) {
    return {
      link: function (t, n, r) {
        function i(t) {
          function r() {
            l === i && (l = void 0);
          }
          var i = e(n, t);
          return l && l.cancel(), l = i, i.then(r, r), i;
        }
        function o() {
          c ? (c = !1, a()) : (n.removeClass('collapse').addClass('collapsing'), i({ height: n[0].scrollHeight + 'px' }).then(a));
        }
        function a() {
          n.removeClass('collapsing'), n.addClass('collapse in'), n.css({ height: 'auto' });
        }
        function s() {
          c ? (c = !1, u(), n.css({ height: 0 })) : (n.css({ height: n[0].scrollHeight + 'px' }), n[0].offsetWidth, n.removeClass('collapse in').addClass('collapsing'), i({ height: 0 }).then(u));
        }
        function u() {
          n.removeClass('collapsing'), n.addClass('collapse');
        }
        var l, c = !0;
        t.$watch(r.collapse, function (e) {
          e ? s() : o();
        });
      }
    };
  }
]), angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse']).constant('accordionConfig', { closeOthers: !0 }).controller('AccordionController', [
  '$scope',
  '$attrs',
  'accordionConfig',
  function (e, t, n) {
    this.groups = [], this.closeOthers = function (r) {
      var i = angular.isDefined(t.closeOthers) ? e.$eval(t.closeOthers) : n.closeOthers;
      i && angular.forEach(this.groups, function (e) {
        e !== r && (e.isOpen = !1);
      });
    }, this.addGroup = function (e) {
      var t = this;
      this.groups.push(e), e.$on('$destroy', function () {
        t.removeGroup(e);
      });
    }, this.removeGroup = function (e) {
      var t = this.groups.indexOf(e);
      -1 !== t && this.groups.splice(this.groups.indexOf(e), 1);
    };
  }
]).directive('accordion', function () {
  return {
    restrict: 'EA',
    controller: 'AccordionController',
    transclude: !0,
    replace: !1,
    templateUrl: 'template/accordion/accordion.html'
  };
}).directive('accordionGroup', [
  '$parse',
  function (e) {
    return {
      require: '^accordion',
      restrict: 'EA',
      transclude: !0,
      replace: !0,
      templateUrl: 'template/accordion/accordion-group.html',
      scope: { heading: '@' },
      controller: function () {
        this.setHeading = function (e) {
          this.heading = e;
        };
      },
      link: function (t, n, r, i) {
        var o, a;
        i.addGroup(t), t.isOpen = !1, r.isOpen && (o = e(r.isOpen), a = o.assign, t.$parent.$watch(o, function (e) {
          t.isOpen = !!e;
        })), t.$watch('isOpen', function (e) {
          e && i.closeOthers(t), a && a(t.$parent, e);
        });
      }
    };
  }
]).directive('accordionHeading', function () {
  return {
    restrict: 'EA',
    transclude: !0,
    template: '',
    replace: !0,
    require: '^accordionGroup',
    compile: function (e, t, n) {
      return function (e, t, r, i) {
        i.setHeading(n(e, function () {
        }));
      };
    }
  };
}).directive('accordionTransclude', function () {
  return {
    require: '^accordionGroup',
    link: function (e, t, n, r) {
      e.$watch(function () {
        return r[n.accordionTransclude];
      }, function (e) {
        e && (t.html(''), t.append(e));
      });
    }
  };
}), angular.module('ui.bootstrap.alert', []).controller('AlertController', [
  '$scope',
  '$attrs',
  function (e, t) {
    e.closeable = 'close' in t;
  }
]).directive('alert', function () {
  return {
    restrict: 'EA',
    controller: 'AlertController',
    templateUrl: 'template/alert/alert.html',
    transclude: !0,
    replace: !0,
    scope: {
      type: '=',
      close: '&'
    }
  };
}), angular.module('ui.bootstrap.bindHtml', []).directive('bindHtmlUnsafe', function () {
  return function (e, t, n) {
    t.addClass('ng-binding').data('$binding', n.bindHtmlUnsafe), e.$watch(n.bindHtmlUnsafe, function (e) {
      t.html(e || '');
    });
  };
}), angular.module('ui.bootstrap.buttons', []).constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
}).controller('ButtonsController', [
  'buttonConfig',
  function (e) {
    this.activeClass = e.activeClass || 'active', this.toggleEvent = e.toggleEvent || 'click';
  }
]).directive('btnRadio', function () {
  return {
    require: [
      'btnRadio',
      'ngModel'
    ],
    controller: 'ButtonsController',
    link: function (e, t, n, r) {
      var i = r[0], o = r[1];
      o.$render = function () {
        t.toggleClass(i.activeClass, angular.equals(o.$modelValue, e.$eval(n.btnRadio)));
      }, t.bind(i.toggleEvent, function () {
        t.hasClass(i.activeClass) || e.$apply(function () {
          o.$setViewValue(e.$eval(n.btnRadio)), o.$render();
        });
      });
    }
  };
}).directive('btnCheckbox', function () {
  return {
    require: [
      'btnCheckbox',
      'ngModel'
    ],
    controller: 'ButtonsController',
    link: function (e, t, n, r) {
      function i() {
        return a(n.btnCheckboxTrue, !0);
      }
      function o() {
        return a(n.btnCheckboxFalse, !1);
      }
      function a(t, n) {
        var r = e.$eval(t);
        return angular.isDefined(r) ? r : n;
      }
      var s = r[0], u = r[1];
      u.$render = function () {
        t.toggleClass(s.activeClass, angular.equals(u.$modelValue, i()));
      }, t.bind(s.toggleEvent, function () {
        e.$apply(function () {
          u.$setViewValue(t.hasClass(s.activeClass) ? o() : i()), u.$render();
        });
      });
    }
  };
}), angular.module('ui.bootstrap.position', []).factory('$position', [
  '$document',
  '$window',
  function (e, t) {
    function n(e, n) {
      return e.currentStyle ? e.currentStyle[n] : t.getComputedStyle ? t.getComputedStyle(e)[n] : e.style[n];
    }
    function r(e) {
      return 'static' === (n(e, 'position') || 'static');
    }
    var i = function (t) {
      for (var n = e[0], i = t.offsetParent || n; i && i !== n && r(i);)
        i = i.offsetParent;
      return i || n;
    };
    return {
      position: function (t) {
        var n = this.offset(t), r = {
            top: 0,
            left: 0
          }, o = i(t[0]);
        o != e[0] && (r = this.offset(angular.element(o)), r.top += o.clientTop - o.scrollTop, r.left += o.clientLeft - o.scrollLeft);
        var a = t[0].getBoundingClientRect();
        return {
          width: a.width || t.prop('offsetWidth'),
          height: a.height || t.prop('offsetHeight'),
          top: n.top - r.top,
          left: n.left - r.left
        };
      },
      offset: function (n) {
        var r = n[0].getBoundingClientRect();
        return {
          width: r.width || n.prop('offsetWidth'),
          height: r.height || n.prop('offsetHeight'),
          top: r.top + (t.pageYOffset || e[0].body.scrollTop || e[0].documentElement.scrollTop),
          left: r.left + (t.pageXOffset || e[0].body.scrollLeft || e[0].documentElement.scrollLeft)
        };
      }
    };
  }
]), angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position']).constant('datepickerConfig', {
  dayFormat: 'dd',
  monthFormat: 'MMMM',
  yearFormat: 'yyyy',
  dayHeaderFormat: 'EEE',
  dayTitleFormat: 'MMMM yyyy',
  monthTitleFormat: 'yyyy',
  showWeeks: !0,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null
}).controller('DatepickerController', [
  '$scope',
  '$attrs',
  'dateFilter',
  'datepickerConfig',
  function (e, t, n, r) {
    function i(t, n) {
      return angular.isDefined(t) ? e.$parent.$eval(t) : n;
    }
    function o(e, t) {
      return new Date(e, t, 0).getDate();
    }
    function a(e, t) {
      for (var n = new Array(t), r = e, i = 0; t > i;)
        n[i++] = new Date(r), r.setDate(r.getDate() + 1);
      return n;
    }
    function s(e, t, r, i) {
      return {
        date: e,
        label: n(e, t),
        selected: !!r,
        secondary: !!i
      };
    }
    var u = {
        day: i(t.dayFormat, r.dayFormat),
        month: i(t.monthFormat, r.monthFormat),
        year: i(t.yearFormat, r.yearFormat),
        dayHeader: i(t.dayHeaderFormat, r.dayHeaderFormat),
        dayTitle: i(t.dayTitleFormat, r.dayTitleFormat),
        monthTitle: i(t.monthTitleFormat, r.monthTitleFormat)
      }, l = i(t.startingDay, r.startingDay), c = i(t.yearRange, r.yearRange);
    this.minDate = r.minDate ? new Date(r.minDate) : null, this.maxDate = r.maxDate ? new Date(r.maxDate) : null, this.modes = [
      {
        name: 'day',
        getVisibleDates: function (e, t) {
          var r = e.getFullYear(), i = e.getMonth(), c = new Date(r, i, 1), d = l - c.getDay(), f = d > 0 ? 7 - d : -d, p = new Date(c), h = 0;
          f > 0 && (p.setDate(-f + 1), h += f), h += o(r, i + 1), h += (7 - h % 7) % 7;
          for (var g = a(p, h), m = new Array(7), v = 0; h > v; v++) {
            var y = new Date(g[v]);
            g[v] = s(y, u.day, t && t.getDate() === y.getDate() && t.getMonth() === y.getMonth() && t.getFullYear() === y.getFullYear(), y.getMonth() !== i);
          }
          for (var w = 0; 7 > w; w++)
            m[w] = n(g[w].date, u.dayHeader);
          return {
            objects: g,
            title: n(e, u.dayTitle),
            labels: m
          };
        },
        compare: function (e, t) {
          return new Date(e.getFullYear(), e.getMonth(), e.getDate()) - new Date(t.getFullYear(), t.getMonth(), t.getDate());
        },
        split: 7,
        step: { months: 1 }
      },
      {
        name: 'month',
        getVisibleDates: function (e, t) {
          for (var r = new Array(12), i = e.getFullYear(), o = 0; 12 > o; o++) {
            var a = new Date(i, o, 1);
            r[o] = s(a, u.month, t && t.getMonth() === o && t.getFullYear() === i);
          }
          return {
            objects: r,
            title: n(e, u.monthTitle)
          };
        },
        compare: function (e, t) {
          return new Date(e.getFullYear(), e.getMonth()) - new Date(t.getFullYear(), t.getMonth());
        },
        split: 3,
        step: { years: 1 }
      },
      {
        name: 'year',
        getVisibleDates: function (e, t) {
          for (var n = new Array(c), r = e.getFullYear(), i = parseInt((r - 1) / c, 10) * c + 1, o = 0; c > o; o++) {
            var a = new Date(i + o, 0, 1);
            n[o] = s(a, u.year, t && t.getFullYear() === a.getFullYear());
          }
          return {
            objects: n,
            title: [
              n[0].label,
              n[c - 1].label
            ].join(' - ')
          };
        },
        compare: function (e, t) {
          return e.getFullYear() - t.getFullYear();
        },
        split: 5,
        step: { years: c }
      }
    ], this.isDisabled = function (t, n) {
      var r = this.modes[n || 0];
      return this.minDate && r.compare(t, this.minDate) < 0 || this.maxDate && r.compare(t, this.maxDate) > 0 || e.dateDisabled && e.dateDisabled({
        date: t,
        mode: r.name
      });
    };
  }
]).directive('datepicker', [
  'dateFilter',
  '$parse',
  'datepickerConfig',
  '$log',
  function (e, t, n, r) {
    return {
      restrict: 'EA',
      replace: !0,
      templateUrl: 'template/datepicker/datepicker.html',
      scope: { dateDisabled: '&' },
      require: [
        'datepicker',
        '?^ngModel'
      ],
      controller: 'DatepickerController',
      link: function (e, i, o, a) {
        function s() {
          e.showWeekNumbers = 0 === h && m;
        }
        function u(e, t) {
          for (var n = []; e.length > 0;)
            n.push(e.splice(0, t));
          return n;
        }
        function l(t) {
          var n = null, i = !0;
          p.$modelValue && (n = new Date(p.$modelValue), isNaN(n) ? (i = !1, r.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : t && (g = n)), p.$setValidity('date', i);
          var o = f.modes[h], a = o.getVisibleDates(g, n);
          angular.forEach(a.objects, function (e) {
            e.disabled = f.isDisabled(e.date, h);
          }), p.$setValidity('date-disabled', !n || !f.isDisabled(n)), e.rows = u(a.objects, o.split), e.labels = a.labels || [], e.title = a.title;
        }
        function c(e) {
          h = e, s(), l();
        }
        function d(e) {
          var t = new Date(e);
          t.setDate(t.getDate() + 4 - (t.getDay() || 7));
          var n = t.getTime();
          return t.setMonth(0), t.setDate(1), Math.floor(Math.round((n - t) / 86400000) / 7) + 1;
        }
        var f = a[0], p = a[1];
        if (p) {
          var h = 0, g = new Date(), m = n.showWeeks;
          o.showWeeks ? e.$parent.$watch(t(o.showWeeks), function (e) {
            m = !!e, s();
          }) : s(), o.min && e.$parent.$watch(t(o.min), function (e) {
            f.minDate = e ? new Date(e) : null, l();
          }), o.max && e.$parent.$watch(t(o.max), function (e) {
            f.maxDate = e ? new Date(e) : null, l();
          }), p.$render = function () {
            l(!0);
          }, e.select = function (e) {
            if (0 === h) {
              var t = p.$modelValue ? new Date(p.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
              t.setFullYear(e.getFullYear(), e.getMonth(), e.getDate()), p.$setViewValue(t), l(!0);
            } else
              g = e, c(h - 1);
          }, e.move = function (e) {
            var t = f.modes[h].step;
            g.setMonth(g.getMonth() + e * (t.months || 0)), g.setFullYear(g.getFullYear() + e * (t.years || 0)), l();
          }, e.toggleMode = function () {
            c((h + 1) % f.modes.length);
          }, e.getWeekNumber = function (t) {
            return 0 === h && e.showWeekNumbers && 7 === t.length ? d(t[0].date) : null;
          };
        }
      }
    };
  }
]).constant('datepickerPopupConfig', {
  dateFormat: 'yyyy-MM-dd',
  currentText: 'Today',
  toggleWeeksText: 'Weeks',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: !0,
  appendToBody: !1,
  showButtonBar: !0
}).directive('datepickerPopup', [
  '$compile',
  '$parse',
  '$document',
  '$position',
  'dateFilter',
  'datepickerPopupConfig',
  'datepickerConfig',
  function (e, t, n, r, i, o, a) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      link: function (s, u, l, c) {
        function d(e) {
          b ? b(s, !!e) : m.isOpen = !!e;
        }
        function f(e) {
          if (e) {
            if (angular.isDate(e))
              return c.$setValidity('date', !0), e;
            if (angular.isString(e)) {
              var t = new Date(e);
              return isNaN(t) ? (c.$setValidity('date', !1), void 0) : (c.$setValidity('date', !0), t);
            }
            return c.$setValidity('date', !1), void 0;
          }
          return c.$setValidity('date', !0), null;
        }
        function p(e, n, r) {
          e && (s.$watch(t(e), function (e) {
            m[n] = e;
          }), _.attr(r || n, n));
        }
        function h() {
          m.position = y ? r.offset(u) : r.position(u), m.position.top = m.position.top + u.prop('offsetHeight');
        }
        var g, m = s.$new(), v = angular.isDefined(l.closeOnDateSelection) ? s.$eval(l.closeOnDateSelection) : o.closeOnDateSelection, y = angular.isDefined(l.datepickerAppendToBody) ? s.$eval(l.datepickerAppendToBody) : o.appendToBody;
        l.$observe('datepickerPopup', function (e) {
          g = e || o.dateFormat, c.$render();
        }), m.showButtonBar = angular.isDefined(l.showButtonBar) ? s.$eval(l.showButtonBar) : o.showButtonBar, s.$on('$destroy', function () {
          C.remove(), m.$destroy();
        }), l.$observe('currentText', function (e) {
          m.currentText = angular.isDefined(e) ? e : o.currentText;
        }), l.$observe('toggleWeeksText', function (e) {
          m.toggleWeeksText = angular.isDefined(e) ? e : o.toggleWeeksText;
        }), l.$observe('clearText', function (e) {
          m.clearText = angular.isDefined(e) ? e : o.clearText;
        }), l.$observe('closeText', function (e) {
          m.closeText = angular.isDefined(e) ? e : o.closeText;
        });
        var w, b;
        l.isOpen && (w = t(l.isOpen), b = w.assign, s.$watch(w, function (e) {
          m.isOpen = !!e;
        })), m.isOpen = w ? w(s) : !1;
        var $ = function (e) {
            m.isOpen && e.target !== u[0] && m.$apply(function () {
              d(!1);
            });
          }, x = function () {
            m.$apply(function () {
              d(!0);
            });
          }, k = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
        k.attr({
          'ng-model': 'date',
          'ng-change': 'dateSelection()'
        });
        var _ = angular.element(k.children()[0]);
        l.datepickerOptions && _.attr(angular.extend({}, s.$eval(l.datepickerOptions))), c.$parsers.unshift(f), m.dateSelection = function (e) {
          angular.isDefined(e) && (m.date = e), c.$setViewValue(m.date), c.$render(), v && d(!1);
        }, u.bind('input change keyup', function () {
          m.$apply(function () {
            m.date = c.$modelValue;
          });
        }), c.$render = function () {
          var e = c.$viewValue ? i(c.$viewValue, g) : '';
          u.val(e), m.date = c.$modelValue;
        }, p(l.min, 'min'), p(l.max, 'max'), l.showWeeks ? p(l.showWeeks, 'showWeeks', 'show-weeks') : (m.showWeeks = a.showWeeks, _.attr('show-weeks', 'showWeeks')), l.dateDisabled && _.attr('date-disabled', l.dateDisabled);
        var T = !1, S = !1;
        m.$watch('isOpen', function (e) {
          e ? (h(), n.bind('click', $), S && u.unbind('focus', x), u[0].focus(), T = !0) : (T && n.unbind('click', $), u.bind('focus', x), S = !0), b && b(s, e);
        }), m.today = function () {
          m.dateSelection(new Date());
        }, m.clear = function () {
          m.dateSelection(null);
        };
        var C = e(k)(m);
        y ? n.find('body').append(C) : u.after(C);
      }
    };
  }
]).directive('datepickerPopupWrap', function () {
  return {
    restrict: 'EA',
    replace: !0,
    transclude: !0,
    templateUrl: 'template/datepicker/popup.html',
    link: function (e, t) {
      t.bind('click', function (e) {
        e.preventDefault(), e.stopPropagation();
      });
    }
  };
}), angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', [
  '$document',
  '$location',
  function (e) {
    var t = null, n = angular.noop;
    return {
      restrict: 'CA',
      link: function (r, i) {
        r.$watch('$location.path', function () {
          n();
        }), i.parent().bind('click', function () {
          n();
        }), i.bind('click', function (r) {
          var o = i === t;
          r.preventDefault(), r.stopPropagation(), t && n(), o || i.hasClass('disabled') || i.prop('disabled') || (i.parent().addClass('open'), t = i, n = function (r) {
            r && (r.preventDefault(), r.stopPropagation()), e.unbind('click', n), i.parent().removeClass('open'), n = angular.noop, t = null;
          }, e.bind('click', n));
        });
      }
    };
  }
]), angular.module('ui.bootstrap.modal', []).factory('$$stackedMap', function () {
  return {
    createNew: function () {
      var e = [];
      return {
        add: function (t, n) {
          e.push({
            key: t,
            value: n
          });
        },
        get: function (t) {
          for (var n = 0; n < e.length; n++)
            if (t == e[n].key)
              return e[n];
        },
        keys: function () {
          for (var t = [], n = 0; n < e.length; n++)
            t.push(e[n].key);
          return t;
        },
        top: function () {
          return e[e.length - 1];
        },
        remove: function (t) {
          for (var n = -1, r = 0; r < e.length; r++)
            if (t == e[r].key) {
              n = r;
              break;
            }
          return e.splice(n, 1)[0];
        },
        removeTop: function () {
          return e.splice(e.length - 1, 1)[0];
        },
        length: function () {
          return e.length;
        }
      };
    }
  };
}).directive('modalBackdrop', [
  '$timeout',
  function (e) {
    return {
      restrict: 'EA',
      replace: !0,
      templateUrl: 'template/modal/backdrop.html',
      link: function (t) {
        t.animate = !1, e(function () {
          t.animate = !0;
        });
      }
    };
  }
]).directive('modalWindow', [
  '$modalStack',
  '$timeout',
  function (e, t) {
    return {
      restrict: 'EA',
      scope: { index: '@' },
      replace: !0,
      transclude: !0,
      templateUrl: 'template/modal/window.html',
      link: function (n, r, i) {
        n.windowClass = i.windowClass || '', t(function () {
          n.animate = !0, r[0].focus();
        }), n.close = function (t) {
          var n = e.getTop();
          n && n.value.backdrop && 'static' != n.value.backdrop && t.target === t.currentTarget && (t.preventDefault(), t.stopPropagation(), e.dismiss(n.key, 'backdrop click'));
        };
      }
    };
  }
]).factory('$modalStack', [
  '$document',
  '$compile',
  '$rootScope',
  '$$stackedMap',
  function (e, t, n, r) {
    function i() {
      for (var e = -1, t = c.keys(), n = 0; n < t.length; n++)
        c.get(t[n]).value.backdrop && (e = n);
      return e;
    }
    function o(t) {
      var n = e.find('body').eq(0), r = c.get(t).value;
      c.remove(t), r.modalDomEl.remove(), n.toggleClass(u, c.length() > 0), s && -1 == i() && (s.remove(), s = void 0), r.modalScope.$destroy();
    }
    var a, s, u = 'modal-open', l = n.$new(!0), c = r.createNew(), d = {};
    return n.$watch(i, function (e) {
      l.index = e;
    }), e.bind('keydown', function (e) {
      var t;
      27 === e.which && (t = c.top(), t && t.value.keyboard && n.$apply(function () {
        d.dismiss(t.key);
      }));
    }), d.open = function (n, r) {
      c.add(n, {
        deferred: r.deferred,
        modalScope: r.scope,
        backdrop: r.backdrop,
        keyboard: r.keyboard
      });
      var o = e.find('body').eq(0);
      i() >= 0 && !s && (a = angular.element('<div modal-backdrop></div>'), s = t(a)(l), o.append(s));
      var d = angular.element('<div modal-window></div>');
      d.attr('window-class', r.windowClass), d.attr('index', c.length() - 1), d.html(r.content);
      var f = t(d)(r.scope);
      c.top().value.modalDomEl = f, o.append(f), o.addClass(u);
    }, d.close = function (e, t) {
      var n = c.get(e).value;
      n && (n.deferred.resolve(t), o(e));
    }, d.dismiss = function (e, t) {
      var n = c.get(e).value;
      n && (n.deferred.reject(t), o(e));
    }, d.getTop = function () {
      return c.top();
    }, d;
  }
]).provider('$modal', function () {
  var e = {
      options: {
        backdrop: !0,
        keyboard: !0
      },
      $get: [
        '$injector',
        '$rootScope',
        '$q',
        '$http',
        '$templateCache',
        '$controller',
        '$modalStack',
        function (t, n, r, i, o, a, s) {
          function u(e) {
            return e.template ? r.when(e.template) : i.get(e.templateUrl, { cache: o }).then(function (e) {
              return e.data;
            });
          }
          function l(e) {
            var n = [];
            return angular.forEach(e, function (e) {
              (angular.isFunction(e) || angular.isArray(e)) && n.push(r.when(t.invoke(e)));
            }), n;
          }
          var c = {};
          return c.open = function (t) {
            var i = r.defer(), o = r.defer(), c = {
                result: i.promise,
                opened: o.promise,
                close: function (e) {
                  s.close(c, e);
                },
                dismiss: function (e) {
                  s.dismiss(c, e);
                }
              };
            if (t = angular.extend({}, e.options, t), t.resolve = t.resolve || {}, !t.template && !t.templateUrl)
              throw new Error('One of template or templateUrl options is required.');
            var d = r.all([u(t)].concat(l(t.resolve)));
            return d.then(function (e) {
              var r = (t.scope || n).$new();
              r.$close = c.close, r.$dismiss = c.dismiss;
              var o, u = {}, l = 1;
              t.controller && (u.$scope = r, u.$modalInstance = c, angular.forEach(t.resolve, function (t, n) {
                u[n] = e[l++];
              }), o = a(t.controller, u)), s.open(c, {
                scope: r,
                deferred: i,
                content: e[0],
                backdrop: t.backdrop,
                keyboard: t.keyboard,
                windowClass: t.windowClass
              });
            }, function (e) {
              i.reject(e);
            }), d.then(function () {
              o.resolve(!0);
            }, function () {
              o.reject(!1);
            }), c;
          }, c;
        }
      ]
    };
  return e;
}), angular.module('ui.bootstrap.pagination', []).controller('PaginationController', [
  '$scope',
  '$attrs',
  '$parse',
  '$interpolate',
  function (e, t, n, r) {
    var i = this, o = t.numPages ? n(t.numPages).assign : angular.noop;
    this.init = function (r) {
      t.itemsPerPage ? e.$parent.$watch(n(t.itemsPerPage), function (t) {
        i.itemsPerPage = parseInt(t, 10), e.totalPages = i.calculateTotalPages();
      }) : this.itemsPerPage = r;
    }, this.noPrevious = function () {
      return 1 === this.page;
    }, this.noNext = function () {
      return this.page === e.totalPages;
    }, this.isActive = function (e) {
      return this.page === e;
    }, this.calculateTotalPages = function () {
      var t = this.itemsPerPage < 1 ? 1 : Math.ceil(e.totalItems / this.itemsPerPage);
      return Math.max(t || 0, 1);
    }, this.getAttributeValue = function (t, n, i) {
      return angular.isDefined(t) ? i ? r(t)(e.$parent) : e.$parent.$eval(t) : n;
    }, this.render = function () {
      this.page = parseInt(e.page, 10) || 1, this.page > 0 && this.page <= e.totalPages && (e.pages = this.getPages(this.page, e.totalPages));
    }, e.selectPage = function (t) {
      !i.isActive(t) && t > 0 && t <= e.totalPages && (e.page = t, e.onSelectPage({ page: t }));
    }, e.$watch('page', function () {
      i.render();
    }), e.$watch('totalItems', function () {
      e.totalPages = i.calculateTotalPages();
    }), e.$watch('totalPages', function (t) {
      o(e.$parent, t), i.page > t ? e.selectPage(t) : i.render();
    });
  }
]).constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: !1,
  directionLinks: !0,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: !0
}).directive('pagination', [
  '$parse',
  'paginationConfig',
  function (e, t) {
    return {
      restrict: 'EA',
      scope: {
        page: '=',
        totalItems: '=',
        onSelectPage: ' &'
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pagination.html',
      replace: !0,
      link: function (n, r, i, o) {
        function a(e, t, n, r) {
          return {
            number: e,
            text: t,
            active: n,
            disabled: r
          };
        }
        var s, u = o.getAttributeValue(i.boundaryLinks, t.boundaryLinks), l = o.getAttributeValue(i.directionLinks, t.directionLinks), c = o.getAttributeValue(i.firstText, t.firstText, !0), d = o.getAttributeValue(i.previousText, t.previousText, !0), f = o.getAttributeValue(i.nextText, t.nextText, !0), p = o.getAttributeValue(i.lastText, t.lastText, !0), h = o.getAttributeValue(i.rotate, t.rotate);
        o.init(t.itemsPerPage), i.maxSize && n.$parent.$watch(e(i.maxSize), function (e) {
          s = parseInt(e, 10), o.render();
        }), o.getPages = function (e, t) {
          var n = [], r = 1, i = t, g = angular.isDefined(s) && t > s;
          g && (h ? (r = Math.max(e - Math.floor(s / 2), 1), i = r + s - 1, i > t && (i = t, r = i - s + 1)) : (r = (Math.ceil(e / s) - 1) * s + 1, i = Math.min(r + s - 1, t)));
          for (var m = r; i >= m; m++) {
            var v = a(m, m, o.isActive(m), !1);
            n.push(v);
          }
          if (g && !h) {
            if (r > 1) {
              var y = a(r - 1, '...', !1, !1);
              n.unshift(y);
            }
            if (t > i) {
              var w = a(i + 1, '...', !1, !1);
              n.push(w);
            }
          }
          if (l) {
            var b = a(e - 1, d, !1, o.noPrevious());
            n.unshift(b);
            var $ = a(e + 1, f, !1, o.noNext());
            n.push($);
          }
          if (u) {
            var x = a(1, c, !1, o.noPrevious());
            n.unshift(x);
            var k = a(t, p, !1, o.noNext());
            n.push(k);
          }
          return n;
        };
      }
    };
  }
]).constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '\xab Previous',
  nextText: 'Next \xbb',
  align: !0
}).directive('pager', [
  'pagerConfig',
  function (e) {
    return {
      restrict: 'EA',
      scope: {
        page: '=',
        totalItems: '=',
        onSelectPage: ' &'
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pager.html',
      replace: !0,
      link: function (t, n, r, i) {
        function o(e, t, n, r, i) {
          return {
            number: e,
            text: t,
            disabled: n,
            previous: u && r,
            next: u && i
          };
        }
        var a = i.getAttributeValue(r.previousText, e.previousText, !0), s = i.getAttributeValue(r.nextText, e.nextText, !0), u = i.getAttributeValue(r.align, e.align);
        i.init(e.itemsPerPage), i.getPages = function (e) {
          return [
            o(e - 1, a, i.noPrevious(), !0, !1),
            o(e + 1, s, i.noNext(), !1, !0)
          ];
        };
      }
    };
  }
]), angular.module('ui.bootstrap.tooltip', [
  'ui.bootstrap.position',
  'ui.bootstrap.bindHtml'
]).provider('$tooltip', function () {
  function e(e) {
    var t = /[A-Z]/g, n = '-';
    return e.replace(t, function (e, t) {
      return (t ? n : '') + e.toLowerCase();
    });
  }
  var t = {
      placement: 'top',
      animation: !0,
      popupDelay: 0
    }, n = {
      mouseenter: 'mouseleave',
      click: 'click',
      focus: 'blur'
    }, r = {};
  this.options = function (e) {
    angular.extend(r, e);
  }, this.setTriggers = function (e) {
    angular.extend(n, e);
  }, this.$get = [
    '$window',
    '$compile',
    '$timeout',
    '$parse',
    '$document',
    '$position',
    '$interpolate',
    function (i, o, a, s, u, l, c) {
      return function (i, d, f) {
        function p(e) {
          var t = e || h.trigger || f, r = n[t] || t;
          return {
            show: t,
            hide: r
          };
        }
        var h = angular.extend({}, t, r), g = e(i), m = c.startSymbol(), v = c.endSymbol(), y = '<div ' + g + '-popup ' + 'title="' + m + 'tt_title' + v + '" ' + 'content="' + m + 'tt_content' + v + '" ' + 'placement="' + m + 'tt_placement' + v + '" ' + 'animation="tt_animation" ' + 'is-open="tt_isOpen"' + '>' + '</div>';
        return {
          restrict: 'EA',
          scope: !0,
          link: function (e, t, n) {
            function r() {
              e.tt_isOpen ? f() : c();
            }
            function c() {
              (!_ || e.$eval(n[d + 'Enable'])) && (e.tt_popupDelay ? (w = a(g, e.tt_popupDelay), w.then(function (e) {
                e();
              })) : e.$apply(g)());
            }
            function f() {
              e.$apply(function () {
                m();
              });
            }
            function g() {
              return e.tt_content ? (v && a.cancel(v), b.css({
                top: 0,
                left: 0,
                display: 'block'
              }), $ ? u.find('body').append(b) : t.after(b), T(), e.tt_isOpen = !0, T) : angular.noop;
            }
            function m() {
              e.tt_isOpen = !1, a.cancel(w), e.tt_animation ? v = a(function () {
                b.remove();
              }, 500) : b.remove();
            }
            var v, w, b = o(y)(e), $ = angular.isDefined(h.appendToBody) ? h.appendToBody : !1, x = p(void 0), k = !1, _ = angular.isDefined(n[d + 'Enable']), T = function () {
                var n, r, i, o;
                switch (n = $ ? l.offset(t) : l.position(t), r = b.prop('offsetWidth'), i = b.prop('offsetHeight'), e.tt_placement) {
                case 'right':
                  o = {
                    top: n.top + n.height / 2 - i / 2,
                    left: n.left + n.width
                  };
                  break;
                case 'bottom':
                  o = {
                    top: n.top + n.height,
                    left: n.left + n.width / 2 - r / 2
                  };
                  break;
                case 'left':
                  o = {
                    top: n.top + n.height / 2 - i / 2,
                    left: n.left - r
                  };
                  break;
                default:
                  o = {
                    top: n.top - i,
                    left: n.left + n.width / 2 - r / 2
                  };
                }
                o.top += 'px', o.left += 'px', b.css(o);
              };
            e.tt_isOpen = !1, n.$observe(i, function (t) {
              e.tt_content = t, !t && e.tt_isOpen && m();
            }), n.$observe(d + 'Title', function (t) {
              e.tt_title = t;
            }), n.$observe(d + 'Placement', function (t) {
              e.tt_placement = angular.isDefined(t) ? t : h.placement;
            }), n.$observe(d + 'PopupDelay', function (t) {
              var n = parseInt(t, 10);
              e.tt_popupDelay = isNaN(n) ? h.popupDelay : n;
            });
            var S = function () {
              k && (t.unbind(x.show, c), t.unbind(x.hide, f));
            };
            n.$observe(d + 'Trigger', function (e) {
              S(), x = p(e), x.show === x.hide ? t.bind(x.show, r) : (t.bind(x.show, c), t.bind(x.hide, f)), k = !0;
            });
            var C = e.$eval(n[d + 'Animation']);
            e.tt_animation = angular.isDefined(C) ? !!C : h.animation, n.$observe(d + 'AppendToBody', function (t) {
              $ = angular.isDefined(t) ? s(t)(e) : $;
            }), $ && e.$on('$locationChangeSuccess', function () {
              e.tt_isOpen && m();
            }), e.$on('$destroy', function () {
              a.cancel(v), a.cancel(w), S(), b.remove(), b.unbind(), b = null;
            });
          }
        };
      };
    }
  ];
}).directive('tooltipPopup', function () {
  return {
    restrict: 'EA',
    replace: !0,
    scope: {
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
}).directive('tooltip', [
  '$tooltip',
  function (e) {
    return e('tooltip', 'tooltip', 'mouseenter');
  }
]).directive('tooltipHtmlUnsafePopup', function () {
  return {
    restrict: 'EA',
    replace: !0,
    scope: {
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
  };
}).directive('tooltipHtmlUnsafe', [
  '$tooltip',
  function (e) {
    return e('tooltipHtmlUnsafe', 'tooltip', 'mouseenter');
  }
]), angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip']).directive('popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: !0,
    scope: {
      title: '@',
      content: '@',
      placement: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'template/popover/popover.html'
  };
}).directive('popover', [
  '$compile',
  '$timeout',
  '$parse',
  '$window',
  '$tooltip',
  function (e, t, n, r, i) {
    return i('popover', 'popover', 'click');
  }
]), angular.module('ui.bootstrap.progressbar', ['ui.bootstrap.transition']).constant('progressConfig', {
  animate: !0,
  max: 100
}).controller('ProgressController', [
  '$scope',
  '$attrs',
  'progressConfig',
  '$transition',
  function (e, t, n, r) {
    var i = this, o = [], a = angular.isDefined(t.max) ? e.$parent.$eval(t.max) : n.max, s = angular.isDefined(t.animate) ? e.$parent.$eval(t.animate) : n.animate;
    this.addBar = function (e, t) {
      var n = 0, r = e.$parent.$index;
      angular.isDefined(r) && o[r] && (n = o[r].value), o.push(e), this.update(t, e.value, n), e.$watch('value', function (e, n) {
        e !== n && i.update(t, e, n);
      }), e.$on('$destroy', function () {
        i.removeBar(e);
      });
    }, this.update = function (e, t, n) {
      var i = this.getPercentage(t);
      s ? (e.css('width', this.getPercentage(n) + '%'), r(e, { width: i + '%' })) : e.css({
        transition: 'none',
        width: i + '%'
      });
    }, this.removeBar = function (e) {
      o.splice(o.indexOf(e), 1);
    }, this.getPercentage = function (e) {
      return Math.round(100 * e / a);
    };
  }
]).directive('progress', function () {
  return {
    restrict: 'EA',
    replace: !0,
    transclude: !0,
    controller: 'ProgressController',
    require: 'progress',
    scope: {},
    template: '<div class="progress" ng-transclude></div>'
  };
}).directive('bar', function () {
  return {
    restrict: 'EA',
    replace: !0,
    transclude: !0,
    require: '^progress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'template/progressbar/bar.html',
    link: function (e, t, n, r) {
      r.addBar(e, t);
    }
  };
}).directive('progressbar', function () {
  return {
    restrict: 'EA',
    replace: !0,
    transclude: !0,
    controller: 'ProgressController',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'template/progressbar/progressbar.html',
    link: function (e, t, n, r) {
      r.addBar(e, angular.element(t.children()[0]));
    }
  };
}), angular.module('ui.bootstrap.tabs', []).controller('TabsetController', [
  '$scope',
  function (e) {
    var t = this, n = t.tabs = e.tabs = [];
    t.select = function (e) {
      angular.forEach(n, function (e) {
        e.active = !1;
      }), e.active = !0;
    }, t.addTab = function (e) {
      n.push(e), (1 === n.length || e.active) && t.select(e);
    }, t.removeTab = function (e) {
      var r = n.indexOf(e);
      if (e.active && n.length > 1) {
        var i = r == n.length - 1 ? r - 1 : r + 1;
        t.select(n[i]);
      }
      n.splice(r, 1);
    };
  }
]).directive('tabset', function () {
  return {
    restrict: 'EA',
    transclude: !0,
    replace: !0,
    scope: {},
    controller: 'TabsetController',
    templateUrl: 'template/tabs/tabset.html',
    link: function (e, t, n) {
      e.vertical = angular.isDefined(n.vertical) ? e.$parent.$eval(n.vertical) : !1, e.justified = angular.isDefined(n.justified) ? e.$parent.$eval(n.justified) : !1, e.type = angular.isDefined(n.type) ? e.$parent.$eval(n.type) : 'tabs';
    }
  };
}).directive('tab', [
  '$parse',
  function (e) {
    return {
      require: '^tabset',
      restrict: 'EA',
      replace: !0,
      templateUrl: 'template/tabs/tab.html',
      transclude: !0,
      scope: {
        heading: '@',
        onSelect: '&select',
        onDeselect: '&deselect'
      },
      controller: function () {
      },
      compile: function (t, n, r) {
        return function (t, n, i, o) {
          var a, s;
          i.active ? (a = e(i.active), s = a.assign, t.$parent.$watch(a, function (e, n) {
            e !== n && (t.active = !!e);
          }), t.active = a(t.$parent)) : s = a = angular.noop, t.$watch('active', function (e) {
            s(t.$parent, e), e ? (o.select(t), t.onSelect()) : t.onDeselect();
          }), t.disabled = !1, i.disabled && t.$parent.$watch(e(i.disabled), function (e) {
            t.disabled = !!e;
          }), t.select = function () {
            t.disabled || (t.active = !0);
          }, o.addTab(t), t.$on('$destroy', function () {
            o.removeTab(t);
          }), t.$transcludeFn = r;
        };
      }
    };
  }
]).directive('tabHeadingTransclude', [function () {
    return {
      restrict: 'A',
      require: '^tab',
      link: function (e, t) {
        e.$watch('headingElement', function (e) {
          e && (t.html(''), t.append(e));
        });
      }
    };
  }]).directive('tabContentTransclude', function () {
  function e(e) {
    return e.tagName && (e.hasAttribute('tab-heading') || e.hasAttribute('data-tab-heading') || 'tab-heading' === e.tagName.toLowerCase() || 'data-tab-heading' === e.tagName.toLowerCase());
  }
  return {
    restrict: 'A',
    require: '^tabset',
    link: function (t, n, r) {
      var i = t.$eval(r.tabContentTransclude);
      i.$transcludeFn(i.$parent, function (t) {
        angular.forEach(t, function (t) {
          e(t) ? i.headingElement = t : n.append(t);
        });
      });
    }
  };
}), angular.module('ui.bootstrap.timepicker', []).constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: !0,
  meridians: null,
  readonlyInput: !1,
  mousewheel: !0
}).directive('timepicker', [
  '$parse',
  '$log',
  'timepickerConfig',
  '$locale',
  function (e, t, n, r) {
    return {
      restrict: 'EA',
      require: '?^ngModel',
      replace: !0,
      scope: {},
      templateUrl: 'template/timepicker/timepicker.html',
      link: function (i, o, a, s) {
        function u() {
          var e = parseInt(i.hours, 10), t = i.showMeridian ? e > 0 && 13 > e : e >= 0 && 24 > e;
          return t ? (i.showMeridian && (12 === e && (e = 0), i.meridian === m[1] && (e += 12)), e) : void 0;
        }
        function l() {
          var e = parseInt(i.minutes, 10);
          return e >= 0 && 60 > e ? e : void 0;
        }
        function c(e) {
          return angular.isDefined(e) && e.toString().length < 2 ? '0' + e : e;
        }
        function d(e) {
          f(), s.$setViewValue(new Date(g)), p(e);
        }
        function f() {
          s.$setValidity('time', !0), i.invalidHours = !1, i.invalidMinutes = !1;
        }
        function p(e) {
          var t = g.getHours(), n = g.getMinutes();
          i.showMeridian && (t = 0 === t || 12 === t ? 12 : t % 12), i.hours = 'h' === e ? t : c(t), i.minutes = 'm' === e ? n : c(n), i.meridian = g.getHours() < 12 ? m[0] : m[1];
        }
        function h(e) {
          var t = new Date(g.getTime() + 60000 * e);
          g.setHours(t.getHours(), t.getMinutes()), d();
        }
        if (s) {
          var g = new Date(), m = angular.isDefined(a.meridians) ? i.$parent.$eval(a.meridians) : n.meridians || r.DATETIME_FORMATS.AMPMS, v = n.hourStep;
          a.hourStep && i.$parent.$watch(e(a.hourStep), function (e) {
            v = parseInt(e, 10);
          });
          var y = n.minuteStep;
          a.minuteStep && i.$parent.$watch(e(a.minuteStep), function (e) {
            y = parseInt(e, 10);
          }), i.showMeridian = n.showMeridian, a.showMeridian && i.$parent.$watch(e(a.showMeridian), function (e) {
            if (i.showMeridian = !!e, s.$error.time) {
              var t = u(), n = l();
              angular.isDefined(t) && angular.isDefined(n) && (g.setHours(t), d());
            } else
              p();
          });
          var w = o.find('input'), b = w.eq(0), $ = w.eq(1), x = angular.isDefined(a.mousewheel) ? i.$eval(a.mousewheel) : n.mousewheel;
          if (x) {
            var k = function (e) {
              e.originalEvent && (e = e.originalEvent);
              var t = e.wheelDelta ? e.wheelDelta : -e.deltaY;
              return e.detail || t > 0;
            };
            b.bind('mousewheel wheel', function (e) {
              i.$apply(k(e) ? i.incrementHours() : i.decrementHours()), e.preventDefault();
            }), $.bind('mousewheel wheel', function (e) {
              i.$apply(k(e) ? i.incrementMinutes() : i.decrementMinutes()), e.preventDefault();
            });
          }
          if (i.readonlyInput = angular.isDefined(a.readonlyInput) ? i.$eval(a.readonlyInput) : n.readonlyInput, i.readonlyInput)
            i.updateHours = angular.noop, i.updateMinutes = angular.noop;
          else {
            var _ = function (e, t) {
              s.$setViewValue(null), s.$setValidity('time', !1), angular.isDefined(e) && (i.invalidHours = e), angular.isDefined(t) && (i.invalidMinutes = t);
            };
            i.updateHours = function () {
              var e = u();
              angular.isDefined(e) ? (g.setHours(e), d('h')) : _(!0);
            }, b.bind('blur', function () {
              !i.validHours && i.hours < 10 && i.$apply(function () {
                i.hours = c(i.hours);
              });
            }), i.updateMinutes = function () {
              var e = l();
              angular.isDefined(e) ? (g.setMinutes(e), d('m')) : _(void 0, !0);
            }, $.bind('blur', function () {
              !i.invalidMinutes && i.minutes < 10 && i.$apply(function () {
                i.minutes = c(i.minutes);
              });
            });
          }
          s.$render = function () {
            var e = s.$modelValue ? new Date(s.$modelValue) : null;
            isNaN(e) ? (s.$setValidity('time', !1), t.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (e && (g = e), f(), p());
          }, i.incrementHours = function () {
            h(60 * v);
          }, i.decrementHours = function () {
            h(60 * -v);
          }, i.incrementMinutes = function () {
            h(y);
          }, i.decrementMinutes = function () {
            h(-y);
          }, i.toggleMeridian = function () {
            h(720 * (g.getHours() < 12 ? 1 : -1));
          };
        }
      }
    };
  }
]), angular.module('ui.bootstrap.typeahead', [
  'ui.bootstrap.position',
  'ui.bootstrap.bindHtml'
]).factory('typeaheadParser', [
  '$parse',
  function (e) {
    var t = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
    return {
      parse: function (n) {
        var r = n.match(t);
        if (!r)
          throw new Error('Expected typeahead specification in form of \'_modelValue_ (as _label_)? for _item_ in _collection_\' but got \'' + n + '\'.');
        return {
          itemName: r[3],
          source: e(r[4]),
          viewMapper: e(r[2] || r[1]),
          modelMapper: e(r[1])
        };
      }
    };
  }
]).directive('typeahead', [
  '$compile',
  '$parse',
  '$q',
  '$timeout',
  '$document',
  '$position',
  'typeaheadParser',
  function (e, t, n, r, i, o, a) {
    var s = [
        9,
        13,
        27,
        38,
        40
      ];
    return {
      require: 'ngModel',
      link: function (u, l, c, d) {
        var f, p = u.$eval(c.typeaheadMinLength) || 1, h = u.$eval(c.typeaheadWaitMs) || 0, g = u.$eval(c.typeaheadEditable) !== !1, m = t(c.typeaheadLoading).assign || angular.noop, v = t(c.typeaheadOnSelect), y = c.typeaheadInputFormatter ? t(c.typeaheadInputFormatter) : void 0, w = c.typeaheadAppendToBody ? t(c.typeaheadAppendToBody) : !1, b = t(c.ngModel).assign, $ = a.parse(c.typeahead), x = angular.element('<div typeahead-popup></div>');
        x.attr({
          matches: 'matches',
          active: 'activeIdx',
          select: 'select(activeIdx)',
          query: 'query',
          position: 'position'
        }), angular.isDefined(c.typeaheadTemplateUrl) && x.attr('template-url', c.typeaheadTemplateUrl);
        var k = u.$new();
        u.$on('$destroy', function () {
          k.$destroy();
        });
        var _ = function () {
            k.matches = [], k.activeIdx = -1;
          }, T = function (e) {
            var t = { $viewValue: e };
            m(u, !0), n.when($.source(u, t)).then(function (n) {
              if (e === d.$viewValue && f) {
                if (n.length > 0) {
                  k.activeIdx = 0, k.matches.length = 0;
                  for (var r = 0; r < n.length; r++)
                    t[$.itemName] = n[r], k.matches.push({
                      label: $.viewMapper(k, t),
                      model: n[r]
                    });
                  k.query = e, k.position = w ? o.offset(l) : o.position(l), k.position.top = k.position.top + l.prop('offsetHeight');
                } else
                  _();
                m(u, !1);
              }
            }, function () {
              _(), m(u, !1);
            });
          };
        _(), k.query = void 0;
        var S;
        d.$parsers.unshift(function (e) {
          return f = !0, e && e.length >= p ? h > 0 ? (S && r.cancel(S), S = r(function () {
            T(e);
          }, h)) : T(e) : (m(u, !1), _()), g ? e : e ? (d.$setValidity('editable', !1), void 0) : (d.$setValidity('editable', !0), e);
        }), d.$formatters.push(function (e) {
          var t, n, r = {};
          return y ? (r.$model = e, y(u, r)) : (r[$.itemName] = e, t = $.viewMapper(u, r), r[$.itemName] = void 0, n = $.viewMapper(u, r), t !== n ? t : e);
        }), k.select = function (e) {
          var t, n, r = {};
          r[$.itemName] = n = k.matches[e].model, t = $.modelMapper(u, r), b(u, t), d.$setValidity('editable', !0), v(u, {
            $item: n,
            $model: t,
            $label: $.viewMapper(u, r)
          }), _(), l[0].focus();
        }, l.bind('keydown', function (e) {
          0 !== k.matches.length && -1 !== s.indexOf(e.which) && (e.preventDefault(), 40 === e.which ? (k.activeIdx = (k.activeIdx + 1) % k.matches.length, k.$digest()) : 38 === e.which ? (k.activeIdx = (k.activeIdx ? k.activeIdx : k.matches.length) - 1, k.$digest()) : 13 === e.which || 9 === e.which ? k.$apply(function () {
            k.select(k.activeIdx);
          }) : 27 === e.which && (e.stopPropagation(), _(), k.$digest()));
        }), l.bind('blur', function () {
          f = !1;
        });
        var C = function (e) {
          l[0] !== e.target && (_(), k.$digest());
        };
        i.bind('click', C), u.$on('$destroy', function () {
          i.unbind('click', C);
        });
        var E = e(x)(k);
        w ? i.find('body').append(E) : l.after(E);
      }
    };
  }
]).directive('typeaheadPopup', function () {
  return {
    restrict: 'EA',
    scope: {
      matches: '=',
      query: '=',
      active: '=',
      position: '=',
      select: '&'
    },
    replace: !0,
    templateUrl: 'template/typeahead/typeahead-popup.html',
    link: function (e, t, n) {
      e.templateUrl = n.templateUrl, e.isOpen = function () {
        return e.matches.length > 0;
      }, e.isActive = function (t) {
        return e.active == t;
      }, e.selectActive = function (t) {
        e.active = t;
      }, e.selectMatch = function (t) {
        e.select({ activeIdx: t });
      };
    }
  };
}).directive('typeaheadMatch', [
  '$http',
  '$templateCache',
  '$compile',
  '$parse',
  function (e, t, n, r) {
    return {
      restrict: 'EA',
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link: function (i, o, a) {
        var s = r(a.templateUrl)(i.$parent) || 'template/typeahead/typeahead-match.html';
        e.get(s, { cache: t }).success(function (e) {
          o.replaceWith(n(e.trim())(i));
        });
      }
    };
  }
]).filter('typeaheadHighlight', function () {
  function e(e) {
    return e.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
  return function (t, n) {
    return n ? t.replace(new RegExp(e(n), 'gi'), '<strong>$&</strong>') : t;
  };
}), angular.module('template/accordion/accordion-group.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/accordion/accordion-group.html', '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n\t  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>');
  }
]), angular.module('template/accordion/accordion.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/accordion/accordion.html', '<div class="panel-group" ng-transclude></div>');
  }
]), angular.module('template/alert/alert.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/alert/alert.html', '<div class=\'alert\' ng-class=\'"alert-" + (type || "warning")\'>\n    <button ng-show=\'closeable\' type=\'button\' class=\'close\' ng-click=\'close()\'>&times;</button>\n    <div ng-transclude></div>\n</div>\n');
  }
]), angular.module('template/datepicker/datepicker.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/datepicker/datepicker.html', '<table>\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button type="button" class="btn btn-default btn-sm btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr ng-show="labels.length > 0" class="h6">\n      <th ng-show="showWeekNumbers" class="text-center">#</th>\n      <th ng-repeat="label in labels" class="text-center">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{\'text-muted\': dt.secondary}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
  }
]), angular.module('template/datepicker/popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/datepicker/popup.html', '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n\t<li ng-transclude></li>\n\t<li ng-show="showButtonBar" style="padding:10px 9px 2px">\n\t\t<span class="btn-group">\n\t\t\t<button type="button" class="btn btn-sm btn-info" ng-click="today()">{{currentText}}</button>\n\t\t\t<button type="button" class="btn btn-sm btn-default" ng-click="showWeeks = ! showWeeks" ng-class="{active: showWeeks}">{{toggleWeeksText}}</button>\n\t\t\t<button type="button" class="btn btn-sm btn-danger" ng-click="clear()">{{clearText}}</button>\n\t\t</span>\n\t\t<button type="button" class="btn btn-sm btn-success pull-right" ng-click="isOpen = false">{{closeText}}</button>\n\t</li>\n</ul>\n');
  }
]), angular.module('template/modal/backdrop.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/modal/backdrop.html', '<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}"></div>');
  }
]), angular.module('template/modal/window.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/modal/window.html', '<div tabindex="-1" class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog"><div class="modal-content" ng-transclude></div></div>\n</div>');
  }
]), angular.module('template/pagination/pager.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/pagination/pager.html', '<ul class="pager">\n  <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>');
  }
]), angular.module('template/pagination/pagination.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/pagination/pagination.html', '<ul class="pagination">\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>');
  }
]), angular.module('template/tooltip/tooltip-html-unsafe-popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tooltip/tooltip-html-unsafe-popup.html', '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n');
  }
]), angular.module('template/tooltip/tooltip-popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tooltip/tooltip-popup.html', '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n');
  }
]), angular.module('template/popover/popover.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/popover/popover.html', '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n');
  }
]), angular.module('template/progressbar/bar.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/progressbar/bar.html', '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude></div>');
  }
]), angular.module('template/progressbar/progress.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/progressbar/progress.html', '<div class="progress" ng-transclude></div>');
  }
]), angular.module('template/progressbar/progressbar.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/progressbar/progressbar.html', '<div class="progress"><div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude></div></div>');
  }
]), angular.module('template/tabs/pane.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/pane.html', '<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>\n');
  }
]), angular.module('template/tabs/tab.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tab.html', '<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n');
  }
]), angular.module('template/tabs/tabs.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tabs.html', '<div class="tabbable">\n  <ul class="nav nav-tabs">\n    <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">\n      <a ng-click="select(pane)">{{pane.heading}}</a>\n    </li>\n  </ul>\n  <div class="tab-content" ng-transclude></div>\n</div>\n');
  }
]), angular.module('template/tabs/tabset-titles.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tabset-titles.html', '<ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical}">\n</ul>\n');
  }
]), angular.module('template/tabs/tabset.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/tabs/tabset.html', '\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n');
  }
]), angular.module('template/timepicker/timepicker.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/timepicker/timepicker.html', '<table>\n\t<tbody>\n\t\t<tr class="text-center">\n\t\t\t<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n\t\t\t<td ng-show="showMeridian"></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n\t\t\t\t<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n\t\t\t</td>\n\t\t\t<td>:</td>\n\t\t\t<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n\t\t\t\t<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n\t\t\t</td>\n\t\t\t<td ng-show="showMeridian"><button class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n\t\t</tr>\n\t\t<tr class="text-center">\n\t\t\t<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n\t\t\t<td ng-show="showMeridian"></td>\n\t\t</tr>\n\t</tbody>\n</table>\n');
  }
]), angular.module('template/typeahead/typeahead-match.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/typeahead/typeahead-match.html', '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>');
  }
]), angular.module('template/typeahead/typeahead-popup.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/typeahead/typeahead-popup.html', '<ul class="dropdown-menu" ng-style="{display: isOpen()&&\'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>');
  }
]), angular.module('template/typeahead/typeahead.html', []).run([
  '$templateCache',
  function (e) {
    e.put('template/typeahead/typeahead.html', '<ul class="typeahead dropdown-menu" ng-style="{display: isOpen()&&\'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)">\n        <a tabindex="-1" ng-click="selectMatch($index)" ng-bind-html-unsafe="match.label | typeaheadHighlight:query"></a>\n    </li>\n</ul>');
  }
]), angular.module('swiper', []).directive('swiperContainer', [function () {
    return {
      restrict: 'C',
      priority: 100,
      controller: function () {
      },
      scope: !0,
      link: function (e, t, n) {
        var r, i, o;
        return r = {
          loop: !0,
          grabCursor: !0,
          initialSlide: n.swiperSlide || 0
        }, o = e.$eval(n.swiperOptions), o = angular.extend({}, r, o), e.swiperAddedSlidesDefer = $.Deferred(), $(t).addClass('init'), i = e.$eval(n.swiper), null == (null != i ? i.promise : void 0) && (i = $.Deferred(), i.resolve()), $.when(i, e.swiperAddedSlidesDefer).done(function () {
          var n;
          for (console.log('Swiper Init'), o.initialSlide = $(t).attr('swiper-slide') || o.initialSlide, $(t).find('.swiper-slide-duplicate').remove(), e.swiper = $(t).swiper(o), n = e.$parent; n && n.swiper;)
            n.swiper = e.swiper, n = n.$parent;
          return t = e.swiper.container, $(t).removeClass('init');
        });
      }
    };
  }]).directive('swiperSlide', [
  '$timeout',
  '$compile',
  function (e) {
    return {
      restrict: 'C',
      require: '^?swiperContainer',
      link: function (t) {
        var n;
        return t.$last ? (n = function () {
          return t.$last ? t.swiperAddedSlidesDefer.resolve() : void 0;
        }, e(n, 100, !1)) : void 0;
      }
    };
  }
]).directive('swipe', [function () {
    return {
      restrict: 'C',
      controller: function () {
      },
      scope: !0,
      link: function (e, t) {
        return e.swipeAddedSlidesDefer = $.Deferred(), e.swipeAddedSlidesDefer.done(function () {
          var n;
          return console.log('Swipe.js init', t), n = {
            disableScroll: !1,
            stopPropagation: !1
          }, e.swiper = Swipe(t.get(0), n);
        });
      }
    };
  }]).directive('swipeSlide', [function () {
    return {
      restrict: 'C',
      require: '^swipe',
      link: function (e) {
        var t;
        return e.$last ? (t = function () {
          return e.$last ? e.swipeAddedSlidesDefer.resolve() : void 0;
        }, setTimeout(t, 100)) : void 0;
      }
    };
  }]);
var Swiper = function (e, t) {
  'use strict';
  function n(e, t) {
    return document.querySelectorAll ? (t || document).querySelectorAll(e) : jQuery(e, t);
  }
  function r(e) {
    return '[object Array]' === Object.prototype.toString.apply(e) ? !0 : !1;
  }
  function i() {
    var e = P - N;
    return t.freeMode && (e = P - N), t.slidesPerView > E.slides.length && !t.centeredSlides && (e = 0), 0 > e && (e = 0), e;
  }
  function o() {
    function e(e) {
      var n = new Image();
      n.onload = function () {
        E && void 0 !== E.imagesLoaded && E.imagesLoaded++, E.imagesLoaded === E.imagesToLoad.length && (E.reInit(), t.onImagesReady && E.fireCallback(t.onImagesReady, E));
      }, n.src = e;
    }
    var r = E.h.addEventListener, i = 'wrapper' === t.eventTarget ? E.wrapper : E.container;
    if (E.browser.ie10 || E.browser.ie11 ? (r(i, E.touchEvents.touchStart, g), r(document, E.touchEvents.touchMove, m), r(document, E.touchEvents.touchEnd, v)) : (E.support.touch && (r(i, 'touchstart', g), r(i, 'touchmove', m), r(i, 'touchend', v)), t.simulateTouch && (r(i, 'mousedown', g), r(document, 'mousemove', m), r(document, 'mouseup', v))), t.autoResize && r(window, 'resize', E.resizeFix), a(), E._wheelEvent = !1, t.mousewheelControl) {
      if (void 0 !== document.onmousewheel && (E._wheelEvent = 'mousewheel'), !E._wheelEvent)
        try {
          new WheelEvent('wheel'), E._wheelEvent = 'wheel';
        } catch (o) {
        }
      E._wheelEvent || (E._wheelEvent = 'DOMMouseScroll'), E._wheelEvent && r(E.container, E._wheelEvent, l);
    }
    if (t.keyboardControl && r(document, 'keydown', u), t.updateOnImagesReady) {
      E.imagesToLoad = n('img', E.container);
      for (var s = 0; s < E.imagesToLoad.length; s++)
        e(E.imagesToLoad[s].getAttribute('src'));
    }
  }
  function a() {
    var e, r = E.h.addEventListener;
    if (t.preventLinks) {
      var i = n('a', E.container);
      for (e = 0; e < i.length; e++)
        r(i[e], 'click', p);
    }
    if (t.releaseFormElements) {
      var o = n('input, textarea, select', E.container);
      for (e = 0; e < o.length; e++)
        r(o[e], E.touchEvents.touchStart, h, !0);
    }
    if (t.onSlideClick)
      for (e = 0; e < E.slides.length; e++)
        r(E.slides[e], 'click', c);
    if (t.onSlideTouch)
      for (e = 0; e < E.slides.length; e++)
        r(E.slides[e], E.touchEvents.touchStart, d);
  }
  function s() {
    var e, r = E.h.removeEventListener;
    if (t.onSlideClick)
      for (e = 0; e < E.slides.length; e++)
        r(E.slides[e], 'click', c);
    if (t.onSlideTouch)
      for (e = 0; e < E.slides.length; e++)
        r(E.slides[e], E.touchEvents.touchStart, d);
    if (t.releaseFormElements) {
      var i = n('input, textarea, select', E.container);
      for (e = 0; e < i.length; e++)
        r(i[e], E.touchEvents.touchStart, h, !0);
    }
    if (t.preventLinks) {
      var o = n('a', E.container);
      for (e = 0; e < o.length; e++)
        r(o[e], 'click', p);
    }
  }
  function u(e) {
    var t = e.keyCode || e.charCode;
    if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)) {
      if (37 === t || 39 === t || 38 === t || 40 === t) {
        for (var n = !1, r = E.h.getOffset(E.container), i = E.h.windowScroll().left, o = E.h.windowScroll().top, a = E.h.windowWidth(), s = E.h.windowHeight(), u = [
              [
                r.left,
                r.top
              ],
              [
                r.left + E.width,
                r.top
              ],
              [
                r.left,
                r.top + E.height
              ],
              [
                r.left + E.width,
                r.top + E.height
              ]
            ], l = 0; l < u.length; l++) {
          var c = u[l];
          c[0] >= i && c[0] <= i + a && c[1] >= o && c[1] <= o + s && (n = !0);
        }
        if (!n)
          return;
      }
      I ? ((37 === t || 39 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 39 === t && E.swipeNext(), 37 === t && E.swipePrev()) : ((38 === t || 40 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === t && E.swipeNext(), 38 === t && E.swipePrev());
    }
  }
  function l(e) {
    var n = E._wheelEvent, r = 0;
    if (e.detail)
      r = -e.detail;
    else if ('mousewheel' === n)
      if (t.mousewheelControlForceToAxis)
        if (I) {
          if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)))
            return;
          r = e.wheelDeltaX;
        } else {
          if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)))
            return;
          r = e.wheelDeltaY;
        }
      else
        r = e.wheelDelta;
    else if ('DOMMouseScroll' === n)
      r = -e.detail;
    else if ('wheel' === n)
      if (t.mousewheelControlForceToAxis)
        if (I) {
          if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY)))
            return;
          r = -e.deltaX;
        } else {
          if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX)))
            return;
          r = -e.deltaY;
        }
      else
        r = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX : -e.deltaY;
    if (t.freeMode) {
      var o = E.getWrapperTranslate() + r;
      if (o > 0 && (o = 0), o < -i() && (o = -i()), E.setWrapperTransition(0), E.setWrapperTranslate(o), E.updateActiveSlide(o), 0 === o || o === -i())
        return;
    } else
      new Date().getTime() - Y > 60 && (0 > r ? E.swipeNext() : E.swipePrev()), Y = new Date().getTime();
    return t.autoplay && E.stopAutoplay(!0), e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1;
  }
  function c(e) {
    E.allowSlideClick && (f(e), E.fireCallback(t.onSlideClick, E, e));
  }
  function d(e) {
    f(e), E.fireCallback(t.onSlideTouch, E, e);
  }
  function f(e) {
    if (e.currentTarget)
      E.clickedSlide = e.currentTarget;
    else {
      var n = e.srcElement;
      do {
        if (n.className.indexOf(t.slideClass) > -1)
          break;
        n = n.parentNode;
      } while (n);
      E.clickedSlide = n;
    }
    E.clickedSlideIndex = E.slides.indexOf(E.clickedSlide), E.clickedSlideLoopIndex = E.clickedSlideIndex - (E.loopedSlides || 0);
  }
  function p(e) {
    return E.allowLinks ? void 0 : (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.preventLinksPropagation && 'stopPropagation' in e && e.stopPropagation(), !1);
  }
  function h(e) {
    return e.stopPropagation ? e.stopPropagation() : e.returnValue = !1, !1;
  }
  function g(e) {
    if (t.preventLinks && (E.allowLinks = !0), E.isTouched || t.onlyExternal)
      return !1;
    if (t.noSwiping && (e.target || e.srcElement) && y(e.target || e.srcElement))
      return !1;
    if (K = !1, E.isTouched = !0, Z = 'touchstart' === e.type, !Z || 1 === e.targetTouches.length) {
      E.callPlugins('onTouchStartBegin'), Z || E.isAndroid || (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
      var n = Z ? e.targetTouches[0].pageX : e.pageX || e.clientX, r = Z ? e.targetTouches[0].pageY : e.pageY || e.clientY;
      E.touches.startX = E.touches.currentX = n, E.touches.startY = E.touches.currentY = r, E.touches.start = E.touches.current = I ? n : r, E.setWrapperTransition(0), E.positions.start = E.positions.current = E.getWrapperTranslate(), E.setWrapperTranslate(E.positions.start), E.times.start = new Date().getTime(), O = void 0, t.moveStartThreshold > 0 && (G = !1), t.onTouchStart && E.fireCallback(t.onTouchStart, E), E.callPlugins('onTouchStartEnd');
    }
  }
  function m(e) {
    if (E.isTouched && !t.onlyExternal && (!Z || 'mousemove' !== e.type)) {
      var n = Z ? e.targetTouches[0].pageX : e.pageX || e.clientX, r = Z ? e.targetTouches[0].pageY : e.pageY || e.clientY;
      if ('undefined' == typeof O && I && (O = !!(O || Math.abs(r - E.touches.startY) > Math.abs(n - E.touches.startX))), 'undefined' != typeof O || I || (O = !!(O || Math.abs(r - E.touches.startY) < Math.abs(n - E.touches.startX))), O)
        return void (E.isTouched = !1);
      if (e.assignedToSwiper)
        return void (E.isTouched = !1);
      if (e.assignedToSwiper = !0, t.preventLinks && (E.allowLinks = !1), t.onSlideClick && (E.allowSlideClick = !1), t.autoplay && E.stopAutoplay(!0), !Z || 1 === e.touches.length) {
        if (E.isMoved || (E.callPlugins('onTouchMoveStart'), t.loop && (E.fixLoop(), E.positions.start = E.getWrapperTranslate()), t.onTouchMoveStart && E.fireCallback(t.onTouchMoveStart, E)), E.isMoved = !0, e.preventDefault ? e.preventDefault() : e.returnValue = !1, E.touches.current = I ? n : r, E.positions.current = (E.touches.current - E.touches.start) * t.touchRatio + E.positions.start, E.positions.current > 0 && t.onResistanceBefore && E.fireCallback(t.onResistanceBefore, E, E.positions.current), E.positions.current < -i() && t.onResistanceAfter && E.fireCallback(t.onResistanceAfter, E, Math.abs(E.positions.current + i())), t.resistance && '100%' !== t.resistance) {
          var o;
          if (E.positions.current > 0 && (o = 1 - E.positions.current / N / 2, E.positions.current = 0.5 > o ? N / 2 : E.positions.current * o), E.positions.current < -i()) {
            var a = (E.touches.current - E.touches.start) * t.touchRatio + (i() + E.positions.start);
            o = (N + a) / N;
            var s = E.positions.current - a * (1 - o) / 2, u = -i() - N / 2;
            E.positions.current = u > s || 0 >= o ? u : s;
          }
        }
        if (t.resistance && '100%' === t.resistance && (E.positions.current > 0 && (!t.freeMode || t.freeModeFluid) && (E.positions.current = 0), E.positions.current < -i() && (!t.freeMode || t.freeModeFluid) && (E.positions.current = -i())), !t.followFinger)
          return;
        if (t.moveStartThreshold)
          if (Math.abs(E.touches.current - E.touches.start) > t.moveStartThreshold || G) {
            if (!G)
              return G = !0, void (E.touches.start = E.touches.current);
            E.setWrapperTranslate(E.positions.current);
          } else
            E.positions.current = E.positions.start;
        else
          E.setWrapperTranslate(E.positions.current);
        return (t.freeMode || t.watchActiveIndex) && E.updateActiveSlide(E.positions.current), t.grabCursor && (E.container.style.cursor = 'move', E.container.style.cursor = 'grabbing', E.container.style.cursor = '-moz-grabbin', E.container.style.cursor = '-webkit-grabbing'), X || (X = E.touches.current), J || (J = new Date().getTime()), E.velocity = (E.touches.current - X) / (new Date().getTime() - J) / 2, Math.abs(E.touches.current - X) < 2 && (E.velocity = 0), X = E.touches.current, J = new Date().getTime(), E.callPlugins('onTouchMoveEnd'), t.onTouchMove && E.fireCallback(t.onTouchMove, E), !1;
      }
    }
  }
  function v() {
    if (O && E.swipeReset(), !t.onlyExternal && E.isTouched) {
      E.isTouched = !1, t.grabCursor && (E.container.style.cursor = 'move', E.container.style.cursor = 'grab', E.container.style.cursor = '-moz-grab', E.container.style.cursor = '-webkit-grab'), E.positions.current || 0 === E.positions.current || (E.positions.current = E.positions.start), t.followFinger && E.setWrapperTranslate(E.positions.current), E.times.end = new Date().getTime(), E.touches.diff = E.touches.current - E.touches.start, E.touches.abs = Math.abs(E.touches.diff), E.positions.diff = E.positions.current - E.positions.start, E.positions.abs = Math.abs(E.positions.diff);
      var e = E.positions.diff, n = E.positions.abs, r = E.times.end - E.times.start;
      5 > n && 300 > r && E.allowLinks === !1 && (t.freeMode || 0 === n || E.swipeReset(), t.preventLinks && (E.allowLinks = !0), t.onSlideClick && (E.allowSlideClick = !0)), setTimeout(function () {
        t.preventLinks && (E.allowLinks = !0), t.onSlideClick && (E.allowSlideClick = !0);
      }, 100);
      var o = i();
      if (!E.isMoved && t.freeMode)
        return E.isMoved = !1, t.onTouchEnd && E.fireCallback(t.onTouchEnd, E), void E.callPlugins('onTouchEnd');
      if (!E.isMoved || E.positions.current > 0 || E.positions.current < -o)
        return E.swipeReset(), t.onTouchEnd && E.fireCallback(t.onTouchEnd, E), void E.callPlugins('onTouchEnd');
      if (E.isMoved = !1, t.freeMode) {
        if (t.freeModeFluid) {
          var a, s = 1000 * t.momentumRatio, u = E.velocity * s, l = E.positions.current + u, c = !1, d = 20 * Math.abs(E.velocity) * t.momentumBounceRatio;
          -o > l && (t.momentumBounce && E.support.transitions ? (-d > l + o && (l = -o - d), a = -o, c = !0, K = !0) : l = -o), l > 0 && (t.momentumBounce && E.support.transitions ? (l > d && (l = d), a = 0, c = !0, K = !0) : l = 0), 0 !== E.velocity && (s = Math.abs((l - E.positions.current) / E.velocity)), E.setWrapperTranslate(l), E.setWrapperTransition(s), t.momentumBounce && c && E.wrapperTransitionEnd(function () {
            K && (t.onMomentumBounce && E.fireCallback(t.onMomentumBounce, E), E.callPlugins('onMomentumBounce'), E.setWrapperTranslate(a), E.setWrapperTransition(300));
          }), E.updateActiveSlide(l);
        }
        return (!t.freeModeFluid || r >= 300) && E.updateActiveSlide(E.positions.current), t.onTouchEnd && E.fireCallback(t.onTouchEnd, E), void E.callPlugins('onTouchEnd');
      }
      A = 0 > e ? 'toNext' : 'toPrev', 'toNext' === A && 300 >= r && (30 > n || !t.shortSwipes ? E.swipeReset() : E.swipeNext(!0)), 'toPrev' === A && 300 >= r && (30 > n || !t.shortSwipes ? E.swipeReset() : E.swipePrev(!0));
      var f = 0;
      if ('auto' === t.slidesPerView) {
        for (var p, h = Math.abs(E.getWrapperTranslate()), g = 0, m = 0; m < E.slides.length; m++)
          if (p = I ? E.slides[m].getWidth(!0, t.roundLengths) : E.slides[m].getHeight(!0, t.roundLengths), g += p, g > h) {
            f = p;
            break;
          }
        f > N && (f = N);
      } else
        f = M * t.slidesPerView;
      'toNext' === A && r > 300 && (n >= f * t.longSwipesRatio ? E.swipeNext(!0) : E.swipeReset()), 'toPrev' === A && r > 300 && (n >= f * t.longSwipesRatio ? E.swipePrev(!0) : E.swipeReset()), t.onTouchEnd && E.fireCallback(t.onTouchEnd, E), E.callPlugins('onTouchEnd');
    }
  }
  function y(e) {
    var n = !1;
    do
      e.className.indexOf(t.noSwipingClass) > -1 && (n = !0), e = e.parentElement;
    while (!n && e.parentElement && -1 === e.className.indexOf(t.wrapperClass));
    return !n && e.className.indexOf(t.wrapperClass) > -1 && e.className.indexOf(t.noSwipingClass) > -1 && (n = !0), n;
  }
  function w(e, t) {
    var n, r = document.createElement('div');
    return r.innerHTML = t, n = r.firstChild, n.className += ' ' + e, n.outerHTML;
  }
  function b(e, n, r) {
    function i() {
      var o = +new Date(), d = o - a;
      s += u * d / (1000 / 60), c = 'toNext' === l ? s > e : e > s, c ? (E.setWrapperTranslate(Math.round(s)), E._DOMAnimating = !0, window.setTimeout(function () {
        i();
      }, 1000 / 60)) : (t.onSlideChangeEnd && ('to' === n ? r.runCallbacks === !0 && E.fireCallback(t.onSlideChangeEnd, E) : E.fireCallback(t.onSlideChangeEnd, E)), E.setWrapperTranslate(e), E._DOMAnimating = !1);
    }
    var o = 'to' === n && r.speed >= 0 ? r.speed : t.speed, a = +new Date();
    if (E.support.transitions || !t.DOMAnimation)
      E.setWrapperTranslate(e), E.setWrapperTransition(o);
    else {
      var s = E.getWrapperTranslate(), u = Math.ceil((e - s) / o * (1000 / 60)), l = s > e ? 'toNext' : 'toPrev', c = 'toNext' === l ? s > e : e > s;
      if (E._DOMAnimating)
        return;
      i();
    }
    E.updateActiveSlide(e), t.onSlideNext && 'next' === n && E.fireCallback(t.onSlideNext, E, e), t.onSlidePrev && 'prev' === n && E.fireCallback(t.onSlidePrev, E, e), t.onSlideReset && 'reset' === n && E.fireCallback(t.onSlideReset, E, e), ('next' === n || 'prev' === n || 'to' === n && r.runCallbacks === !0) && $(n);
  }
  function $(e) {
    if (E.callPlugins('onSlideChangeStart'), t.onSlideChangeStart)
      if (t.queueStartCallbacks && E.support.transitions) {
        if (E._queueStartCallbacks)
          return;
        E._queueStartCallbacks = !0, E.fireCallback(t.onSlideChangeStart, E, e), E.wrapperTransitionEnd(function () {
          E._queueStartCallbacks = !1;
        });
      } else
        E.fireCallback(t.onSlideChangeStart, E, e);
    if (t.onSlideChangeEnd)
      if (E.support.transitions)
        if (t.queueEndCallbacks) {
          if (E._queueEndCallbacks)
            return;
          E._queueEndCallbacks = !0, E.wrapperTransitionEnd(function (n) {
            E.fireCallback(t.onSlideChangeEnd, n, e);
          });
        } else
          E.wrapperTransitionEnd(function (n) {
            E.fireCallback(t.onSlideChangeEnd, n, e);
          });
      else
        t.DOMAnimation || setTimeout(function () {
          E.fireCallback(t.onSlideChangeEnd, E, e);
        }, 10);
  }
  function x() {
    var e = E.paginationButtons;
    if (e)
      for (var t = 0; t < e.length; t++)
        E.h.removeEventListener(e[t], 'click', _);
  }
  function k() {
    var e = E.paginationButtons;
    if (e)
      for (var t = 0; t < e.length; t++)
        E.h.addEventListener(e[t], 'click', _);
  }
  function _(e) {
    for (var t, n = e.target || e.srcElement, r = E.paginationButtons, i = 0; i < r.length; i++)
      n === r[i] && (t = i);
    E.swipeTo(t);
  }
  function T() {
    Q = setTimeout(function () {
      t.loop ? (E.fixLoop(), E.swipeNext(!0)) : E.swipeNext(!0) || (t.autoplayStopOnLast ? (clearTimeout(Q), Q = void 0) : E.swipeTo(0)), E.wrapperTransitionEnd(function () {
        'undefined' != typeof Q && T();
      });
    }, t.autoplay);
  }
  function S() {
    E.calcSlides(), t.loader.slides.length > 0 && 0 === E.slides.length && E.loadSlides(), t.loop && E.createLoop(), E.init(), o(), t.pagination && E.createPagination(!0), t.loop || t.initialSlide > 0 ? E.swipeTo(t.initialSlide, 0, !1) : E.updateActiveSlide(0), t.autoplay && E.startAutoplay(), E.centerIndex = E.activeIndex, t.onSwiperCreated && E.fireCallback(t.onSwiperCreated, E), E.callPlugins('onSwiperCreated');
  }
  if (document.body.__defineGetter__ && HTMLElement) {
    var C = HTMLElement.prototype;
    C.__defineGetter__ && C.__defineGetter__('outerHTML', function () {
      return new XMLSerializer().serializeToString(this);
    });
  }
  if (window.getComputedStyle || (window.getComputedStyle = function (e) {
      return this.el = e, this.getPropertyValue = function (t) {
        var n = /(\-([a-z]){1})/g;
        return 'float' === t && (t = 'styleFloat'), n.test(t) && (t = t.replace(n, function () {
          return arguments[2].toUpperCase();
        })), e.currentStyle[t] ? e.currentStyle[t] : null;
      }, this;
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function (e, t) {
      for (var n = t || 0, r = this.length; r > n; n++)
        if (this[n] === e)
          return n;
      return -1;
    }), (document.querySelectorAll || window.jQuery) && 'undefined' != typeof e && (e.nodeType || 0 !== n(e).length)) {
    var E = this;
    E.touches = {
      start: 0,
      startX: 0,
      startY: 0,
      current: 0,
      currentX: 0,
      currentY: 0,
      diff: 0,
      abs: 0
    }, E.positions = {
      start: 0,
      abs: 0,
      diff: 0,
      current: 0
    }, E.times = {
      start: 0,
      end: 0
    }, E.id = new Date().getTime(), E.container = e.nodeType ? e : n(e)[0], E.isTouched = !1, E.isMoved = !1, E.activeIndex = 0, E.centerIndex = 0, E.activeLoaderIndex = 0, E.activeLoopIndex = 0, E.previousIndex = null, E.velocity = 0, E.snapGrid = [], E.slidesGrid = [], E.imagesToLoad = [], E.imagesLoaded = 0, E.wrapperLeft = 0, E.wrapperRight = 0, E.wrapperTop = 0, E.wrapperBottom = 0, E.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;
    var D, M, P, A, O, N, j = {
        eventTarget: 'wrapper',
        mode: 'horizontal',
        touchRatio: 1,
        speed: 300,
        freeMode: !1,
        freeModeFluid: !1,
        momentumRatio: 1,
        momentumBounce: !0,
        momentumBounceRatio: 1,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerViewFit: !0,
        simulateTouch: !0,
        followFinger: !0,
        shortSwipes: !0,
        longSwipesRatio: 0.5,
        moveStartThreshold: !1,
        onlyExternal: !1,
        createPagination: !0,
        pagination: !1,
        paginationElement: 'span',
        paginationClickable: !1,
        paginationAsRange: !0,
        resistance: !0,
        scrollContainer: !1,
        preventLinks: !0,
        preventLinksPropagation: !1,
        noSwiping: !1,
        noSwipingClass: 'swiper-no-swiping',
        initialSlide: 0,
        keyboardControl: !1,
        mousewheelControl: !1,
        mousewheelControlForceToAxis: !1,
        useCSS3Transforms: !0,
        autoplay: !1,
        autoplayDisableOnInteraction: !0,
        autoplayStopOnLast: !1,
        loop: !1,
        loopAdditionalSlides: 0,
        roundLengths: !1,
        calculateHeight: !1,
        cssWidthAndHeight: !1,
        updateOnImagesReady: !0,
        releaseFormElements: !0,
        watchActiveIndex: !1,
        visibilityFullFit: !1,
        offsetPxBefore: 0,
        offsetPxAfter: 0,
        offsetSlidesBefore: 0,
        offsetSlidesAfter: 0,
        centeredSlides: !1,
        queueStartCallbacks: !1,
        queueEndCallbacks: !1,
        autoResize: !0,
        resizeReInit: !1,
        DOMAnimation: !0,
        loader: {
          slides: [],
          slidesHTMLType: 'inner',
          surroundGroups: 1,
          logic: 'reload',
          loadAllSlides: !1
        },
        slideElement: 'div',
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        wrapperClass: 'swiper-wrapper',
        paginationElementClass: 'swiper-pagination-switch',
        paginationActiveClass: 'swiper-active-switch',
        paginationVisibleClass: 'swiper-visible-switch'
      };
    t = t || {};
    for (var L in j)
      if (L in t && 'object' == typeof t[L])
        for (var R in j[L])
          R in t[L] || (t[L][R] = j[L][R]);
      else
        L in t || (t[L] = j[L]);
    E.params = t, t.scrollContainer && (t.freeMode = !0, t.freeModeFluid = !0), t.loop && (t.resistance = '100%');
    var I = 'horizontal' === t.mode, F = [
        'mousedown',
        'mousemove',
        'mouseup'
      ];
    E.browser.ie10 && (F = [
      'MSPointerDown',
      'MSPointerMove',
      'MSPointerUp'
    ]), E.browser.ie11 && (F = [
      'pointerdown',
      'pointermove',
      'pointerup'
    ]), E.touchEvents = {
      touchStart: E.support.touch || !t.simulateTouch ? 'touchstart' : F[0],
      touchMove: E.support.touch || !t.simulateTouch ? 'touchmove' : F[1],
      touchEnd: E.support.touch || !t.simulateTouch ? 'touchend' : F[2]
    };
    for (var H = E.container.childNodes.length - 1; H >= 0; H--)
      if (E.container.childNodes[H].className)
        for (var q = E.container.childNodes[H].className.split(/\s+/), V = 0; V < q.length; V++)
          q[V] === t.wrapperClass && (D = E.container.childNodes[H]);
    E.wrapper = D, E._extendSwiperSlide = function (e) {
      return e.append = function () {
        return t.loop ? e.insertAfter(E.slides.length - E.loopedSlides) : (E.wrapper.appendChild(e), E.reInit()), e;
      }, e.prepend = function () {
        return t.loop ? (E.wrapper.insertBefore(e, E.slides[E.loopedSlides]), E.removeLoopedSlides(), E.calcSlides(), E.createLoop()) : E.wrapper.insertBefore(e, E.wrapper.firstChild), E.reInit(), e;
      }, e.insertAfter = function (n) {
        if ('undefined' == typeof n)
          return !1;
        var r;
        return t.loop ? (r = E.slides[n + 1 + E.loopedSlides], r ? E.wrapper.insertBefore(e, r) : E.wrapper.appendChild(e), E.removeLoopedSlides(), E.calcSlides(), E.createLoop()) : (r = E.slides[n + 1], E.wrapper.insertBefore(e, r)), E.reInit(), e;
      }, e.clone = function () {
        return E._extendSwiperSlide(e.cloneNode(!0));
      }, e.remove = function () {
        E.wrapper.removeChild(e), E.reInit();
      }, e.html = function (t) {
        return 'undefined' == typeof t ? e.innerHTML : (e.innerHTML = t, e);
      }, e.index = function () {
        for (var t, n = E.slides.length - 1; n >= 0; n--)
          e === E.slides[n] && (t = n);
        return t;
      }, e.isActive = function () {
        return e.index() === E.activeIndex ? !0 : !1;
      }, e.swiperSlideDataStorage || (e.swiperSlideDataStorage = {}), e.getData = function (t) {
        return e.swiperSlideDataStorage[t];
      }, e.setData = function (t, n) {
        return e.swiperSlideDataStorage[t] = n, e;
      }, e.data = function (t, n) {
        return 'undefined' == typeof n ? e.getAttribute('data-' + t) : (e.setAttribute('data-' + t, n), e);
      }, e.getWidth = function (t, n) {
        return E.h.getWidth(e, t, n);
      }, e.getHeight = function (t, n) {
        return E.h.getHeight(e, t, n);
      }, e.getOffset = function () {
        return E.h.getOffset(e);
      }, e;
    }, E.calcSlides = function (e) {
      var n = E.slides ? E.slides.length : !1;
      E.slides = [], E.displaySlides = [];
      for (var r = 0; r < E.wrapper.childNodes.length; r++)
        if (E.wrapper.childNodes[r].className)
          for (var i = E.wrapper.childNodes[r].className, o = i.split(/\s+/), u = 0; u < o.length; u++)
            o[u] === t.slideClass && E.slides.push(E.wrapper.childNodes[r]);
      for (r = E.slides.length - 1; r >= 0; r--)
        E._extendSwiperSlide(E.slides[r]);
      n !== !1 && (n !== E.slides.length || e) && (s(), a(), E.updateActiveSlide(), E.params.pagination && E.createPagination(), E.callPlugins('numberOfSlidesChanged'));
    }, E.createSlide = function (e, n, r) {
      n = n || E.params.slideClass, r = r || t.slideElement;
      var i = document.createElement(r);
      return i.innerHTML = e || '', i.className = n, E._extendSwiperSlide(i);
    }, E.appendSlide = function (e, t, n) {
      return e ? e.nodeType ? E._extendSwiperSlide(e).append() : E.createSlide(e, t, n).append() : void 0;
    }, E.prependSlide = function (e, t, n) {
      return e ? e.nodeType ? E._extendSwiperSlide(e).prepend() : E.createSlide(e, t, n).prepend() : void 0;
    }, E.insertSlideAfter = function (e, t, n, r) {
      return 'undefined' == typeof e ? !1 : t.nodeType ? E._extendSwiperSlide(t).insertAfter(e) : E.createSlide(t, n, r).insertAfter(e);
    }, E.removeSlide = function (e) {
      if (E.slides[e]) {
        if (t.loop) {
          if (!E.slides[e + E.loopedSlides])
            return !1;
          E.slides[e + E.loopedSlides].remove(), E.removeLoopedSlides(), E.calcSlides(), E.createLoop();
        } else
          E.slides[e].remove();
        return !0;
      }
      return !1;
    }, E.removeLastSlide = function () {
      return E.slides.length > 0 ? (t.loop ? (E.slides[E.slides.length - 1 - E.loopedSlides].remove(), E.removeLoopedSlides(), E.calcSlides(), E.createLoop()) : E.slides[E.slides.length - 1].remove(), !0) : !1;
    }, E.removeAllSlides = function () {
      for (var e = E.slides.length - 1; e >= 0; e--)
        E.slides[e].remove();
    }, E.getSlide = function (e) {
      return E.slides[e];
    }, E.getLastSlide = function () {
      return E.slides[E.slides.length - 1];
    }, E.getFirstSlide = function () {
      return E.slides[0];
    }, E.activeSlide = function () {
      return E.slides[E.activeIndex];
    }, E.fireCallback = function () {
      var e = arguments[0];
      if ('[object Array]' === Object.prototype.toString.call(e))
        for (var n = 0; n < e.length; n++)
          'function' == typeof e[n] && e[n](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      else
        '[object String]' === Object.prototype.toString.call(e) ? t['on' + e] && E.fireCallback(t['on' + e]) : e(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }, E.addCallback = function (e, t) {
      var n, i = this;
      return i.params['on' + e] ? r(this.params['on' + e]) ? this.params['on' + e].push(t) : 'function' == typeof this.params['on' + e] ? (n = this.params['on' + e], this.params['on' + e] = [], this.params['on' + e].push(n), this.params['on' + e].push(t)) : void 0 : (this.params['on' + e] = [], this.params['on' + e].push(t));
    }, E.removeCallbacks = function (e) {
      E.params['on' + e] && (E.params['on' + e] = null);
    };
    var U = [];
    for (var W in E.plugins)
      if (t[W]) {
        var B = E.plugins[W](E, t[W]);
        B && U.push(B);
      }
    E.callPlugins = function (e, t) {
      t || (t = {});
      for (var n = 0; n < U.length; n++)
        e in U[n] && U[n][e](t);
    }, !E.browser.ie10 && !E.browser.ie11 || t.onlyExternal || E.wrapper.classList.add('swiper-wp8-' + (I ? 'horizontal' : 'vertical')), t.freeMode && (E.container.className += ' swiper-free-mode'), E.initialized = !1, E.init = function (e, n) {
      var r = E.h.getWidth(E.container, !1, t.roundLengths), i = E.h.getHeight(E.container, !1, t.roundLengths);
      if (r !== E.width || i !== E.height || e) {
        E.width = r, E.height = i;
        var o, a, s, u, l, c, d;
        N = I ? r : i;
        var f = E.wrapper;
        if (e && E.calcSlides(n), 'auto' === t.slidesPerView) {
          var p = 0, h = 0;
          t.slidesOffset > 0 && (f.style.paddingLeft = '', f.style.paddingRight = '', f.style.paddingTop = '', f.style.paddingBottom = ''), f.style.width = '', f.style.height = '', t.offsetPxBefore > 0 && (I ? E.wrapperLeft = t.offsetPxBefore : E.wrapperTop = t.offsetPxBefore), t.offsetPxAfter > 0 && (I ? E.wrapperRight = t.offsetPxAfter : E.wrapperBottom = t.offsetPxAfter), t.centeredSlides && (I ? (E.wrapperLeft = (N - this.slides[0].getWidth(!0, t.roundLengths)) / 2, E.wrapperRight = (N - E.slides[E.slides.length - 1].getWidth(!0, t.roundLengths)) / 2) : (E.wrapperTop = (N - E.slides[0].getHeight(!0, t.roundLengths)) / 2, E.wrapperBottom = (N - E.slides[E.slides.length - 1].getHeight(!0, t.roundLengths)) / 2)), I ? (E.wrapperLeft >= 0 && (f.style.paddingLeft = E.wrapperLeft + 'px'), E.wrapperRight >= 0 && (f.style.paddingRight = E.wrapperRight + 'px')) : (E.wrapperTop >= 0 && (f.style.paddingTop = E.wrapperTop + 'px'), E.wrapperBottom >= 0 && (f.style.paddingBottom = E.wrapperBottom + 'px')), c = 0;
          var g = 0;
          for (E.snapGrid = [], E.slidesGrid = [], s = 0, d = 0; d < E.slides.length; d++) {
            o = E.slides[d].getWidth(!0, t.roundLengths), a = E.slides[d].getHeight(!0, t.roundLengths), t.calculateHeight && (s = Math.max(s, a));
            var m = I ? o : a;
            if (t.centeredSlides) {
              var v = d === E.slides.length - 1 ? 0 : E.slides[d + 1].getWidth(!0, t.roundLengths), y = d === E.slides.length - 1 ? 0 : E.slides[d + 1].getHeight(!0, t.roundLengths), w = I ? v : y;
              if (m > N) {
                if (t.slidesPerViewFit)
                  E.snapGrid.push(c + E.wrapperLeft), E.snapGrid.push(c + m - N + E.wrapperLeft);
                else
                  for (var b = 0; b <= Math.floor(m / (N + E.wrapperLeft)); b++)
                    E.snapGrid.push(0 === b ? c + E.wrapperLeft : c + E.wrapperLeft + N * b);
                E.slidesGrid.push(c + E.wrapperLeft);
              } else
                E.snapGrid.push(g), E.slidesGrid.push(g);
              g += m / 2 + w / 2;
            } else {
              if (m > N)
                if (t.slidesPerViewFit)
                  E.snapGrid.push(c), E.snapGrid.push(c + m - N);
                else if (0 !== N)
                  for (var $ = 0; $ <= Math.floor(m / N); $++)
                    E.snapGrid.push(c + N * $);
                else
                  E.snapGrid.push(c);
              else
                E.snapGrid.push(c);
              E.slidesGrid.push(c);
            }
            c += m, p += o, h += a;
          }
          t.calculateHeight && (E.height = s), I ? (P = p + E.wrapperRight + E.wrapperLeft, f.style.width = p + 'px', f.style.height = E.height + 'px') : (P = h + E.wrapperTop + E.wrapperBottom, f.style.width = E.width + 'px', f.style.height = h + 'px');
        } else if (t.scrollContainer)
          f.style.width = '', f.style.height = '', u = E.slides[0].getWidth(!0, t.roundLengths), l = E.slides[0].getHeight(!0, t.roundLengths), P = I ? u : l, f.style.width = u + 'px', f.style.height = l + 'px', M = I ? u : l;
        else {
          if (t.calculateHeight) {
            for (s = 0, l = 0, I || (E.container.style.height = ''), f.style.height = '', d = 0; d < E.slides.length; d++)
              E.slides[d].style.height = '', s = Math.max(E.slides[d].getHeight(!0), s), I || (l += E.slides[d].getHeight(!0));
            a = s, E.height = a, I ? l = a : (N = a, E.container.style.height = N + 'px');
          } else
            a = I ? E.height : E.height / t.slidesPerView, t.roundLengths && (a = Math.round(a)), l = I ? E.height : E.slides.length * a;
          for (o = I ? E.width / t.slidesPerView : E.width, t.roundLengths && (o = Math.round(o)), u = I ? E.slides.length * o : E.width, M = I ? o : a, t.offsetSlidesBefore > 0 && (I ? E.wrapperLeft = M * t.offsetSlidesBefore : E.wrapperTop = M * t.offsetSlidesBefore), t.offsetSlidesAfter > 0 && (I ? E.wrapperRight = M * t.offsetSlidesAfter : E.wrapperBottom = M * t.offsetSlidesAfter), t.offsetPxBefore > 0 && (I ? E.wrapperLeft = t.offsetPxBefore : E.wrapperTop = t.offsetPxBefore), t.offsetPxAfter > 0 && (I ? E.wrapperRight = t.offsetPxAfter : E.wrapperBottom = t.offsetPxAfter), t.centeredSlides && (I ? (E.wrapperLeft = (N - M) / 2, E.wrapperRight = (N - M) / 2) : (E.wrapperTop = (N - M) / 2, E.wrapperBottom = (N - M) / 2)), I ? (E.wrapperLeft > 0 && (f.style.paddingLeft = E.wrapperLeft + 'px'), E.wrapperRight > 0 && (f.style.paddingRight = E.wrapperRight + 'px')) : (E.wrapperTop > 0 && (f.style.paddingTop = E.wrapperTop + 'px'), E.wrapperBottom > 0 && (f.style.paddingBottom = E.wrapperBottom + 'px')), P = I ? u + E.wrapperRight + E.wrapperLeft : l + E.wrapperTop + E.wrapperBottom, t.cssWidthAndHeight || (parseFloat(u) > 0 && (f.style.width = u + 'px'), parseFloat(l) > 0 && (f.style.height = l + 'px')), c = 0, E.snapGrid = [], E.slidesGrid = [], d = 0; d < E.slides.length; d++)
            E.snapGrid.push(c), E.slidesGrid.push(c), c += M, t.cssWidthAndHeight || (parseFloat(o) > 0 && (E.slides[d].style.width = o + 'px'), parseFloat(a) > 0 && (E.slides[d].style.height = a + 'px'));
        }
        E.initialized ? (E.callPlugins('onInit'), t.onInit && E.fireCallback(t.onInit, E)) : (E.callPlugins('onFirstInit'), t.onFirstInit && E.fireCallback(t.onFirstInit, E)), E.initialized = !0;
      }
    }, E.reInit = function (e) {
      E.init(!0, e);
    }, E.resizeFix = function (e) {
      E.callPlugins('beforeResizeFix'), E.init(t.resizeReInit || e), t.freeMode ? E.getWrapperTranslate() < -i() && (E.setWrapperTransition(0), E.setWrapperTranslate(-i())) : (E.swipeTo(t.loop ? E.activeLoopIndex : E.activeIndex, 0, !1), t.autoplay && (E.support.transitions && 'undefined' != typeof Q ? 'undefined' != typeof Q && (clearTimeout(Q), Q = void 0, E.startAutoplay()) : 'undefined' != typeof et && (clearInterval(et), et = void 0, E.startAutoplay()))), E.callPlugins('afterResizeFix');
    }, E.destroy = function () {
      var e = E.h.removeEventListener, n = 'wrapper' === t.eventTarget ? E.wrapper : E.container;
      E.browser.ie10 || E.browser.ie11 ? (e(n, E.touchEvents.touchStart, g), e(document, E.touchEvents.touchMove, m), e(document, E.touchEvents.touchEnd, v)) : (E.support.touch && (e(n, 'touchstart', g), e(n, 'touchmove', m), e(n, 'touchend', v)), t.simulateTouch && (e(n, 'mousedown', g), e(document, 'mousemove', m), e(document, 'mouseup', v))), t.autoResize && e(window, 'resize', E.resizeFix), s(), t.paginationClickable && x(), t.mousewheelControl && E._wheelEvent && e(E.container, E._wheelEvent, l), t.keyboardControl && e(document, 'keydown', u), t.autoplay && E.stopAutoplay(), E.callPlugins('onDestroy'), E = null;
    }, E.disableKeyboardControl = function () {
      t.keyboardControl = !1, E.h.removeEventListener(document, 'keydown', u);
    }, E.enableKeyboardControl = function () {
      t.keyboardControl = !0, E.h.addEventListener(document, 'keydown', u);
    };
    var Y = new Date().getTime();
    if (t.grabCursor) {
      var z = E.container.style;
      z.cursor = 'move', z.cursor = 'grab', z.cursor = '-moz-grab', z.cursor = '-webkit-grab';
    }
    E.allowSlideClick = !0, E.allowLinks = !0;
    var G, X, J, Z = !1, K = !0;
    E.swipeNext = function (e) {
      !e && t.loop && E.fixLoop(), !e && t.autoplay && E.stopAutoplay(!0), E.callPlugins('onSwipeNext');
      var n = E.getWrapperTranslate(), r = n;
      if ('auto' === t.slidesPerView) {
        for (var o = 0; o < E.snapGrid.length; o++)
          if (-n >= E.snapGrid[o] && -n < E.snapGrid[o + 1]) {
            r = -E.snapGrid[o + 1];
            break;
          }
      } else {
        var a = M * t.slidesPerGroup;
        r = -(Math.floor(Math.abs(n) / Math.floor(a)) * a + a);
      }
      return r < -i() && (r = -i()), r === n ? !1 : (b(r, 'next'), !0);
    }, E.swipePrev = function (e) {
      !e && t.loop && E.fixLoop(), !e && t.autoplay && E.stopAutoplay(!0), E.callPlugins('onSwipePrev');
      var n, r = Math.ceil(E.getWrapperTranslate());
      if ('auto' === t.slidesPerView) {
        n = 0;
        for (var i = 1; i < E.snapGrid.length; i++) {
          if (-r === E.snapGrid[i]) {
            n = -E.snapGrid[i - 1];
            break;
          }
          if (-r > E.snapGrid[i] && -r < E.snapGrid[i + 1]) {
            n = -E.snapGrid[i];
            break;
          }
        }
      } else {
        var o = M * t.slidesPerGroup;
        n = -(Math.ceil(-r / o) - 1) * o;
      }
      return n > 0 && (n = 0), n === r ? !1 : (b(n, 'prev'), !0);
    }, E.swipeReset = function () {
      E.callPlugins('onSwipeReset');
      var e, n = E.getWrapperTranslate(), r = M * t.slidesPerGroup;
      if (-i(), 'auto' === t.slidesPerView) {
        e = 0;
        for (var o = 0; o < E.snapGrid.length; o++) {
          if (-n === E.snapGrid[o])
            return;
          if (-n >= E.snapGrid[o] && -n < E.snapGrid[o + 1]) {
            e = E.positions.diff > 0 ? -E.snapGrid[o + 1] : -E.snapGrid[o];
            break;
          }
        }
        -n >= E.snapGrid[E.snapGrid.length - 1] && (e = -E.snapGrid[E.snapGrid.length - 1]), n <= -i() && (e = -i());
      } else
        e = 0 > n ? Math.round(n / r) * r : 0;
      return t.scrollContainer && (e = 0 > n ? n : 0), e < -i() && (e = -i()), t.scrollContainer && N > M && (e = 0), e === n ? !1 : (b(e, 'reset'), !0);
    }, E.swipeTo = function (e, n, r) {
      e = parseInt(e, 10), E.callPlugins('onSwipeTo', {
        index: e,
        speed: n
      }), t.loop && (e += E.loopedSlides);
      var o = E.getWrapperTranslate();
      if (!(e > E.slides.length - 1 || 0 > e)) {
        var a;
        return a = 'auto' === t.slidesPerView ? -E.slidesGrid[e] : -e * M, a < -i() && (a = -i()), a === o ? !1 : (r = r === !1 ? !1 : !0, b(a, 'to', {
          index: e,
          speed: n,
          runCallbacks: r
        }), !0);
      }
    }, E._queueStartCallbacks = !1, E._queueEndCallbacks = !1, E.updateActiveSlide = function (e) {
      if (E.initialized && 0 !== E.slides.length) {
        E.previousIndex = E.activeIndex, 'undefined' == typeof e && (e = E.getWrapperTranslate()), e > 0 && (e = 0);
        var n;
        if ('auto' === t.slidesPerView) {
          if (E.activeIndex = E.slidesGrid.indexOf(-e), E.activeIndex < 0) {
            for (n = 0; n < E.slidesGrid.length - 1 && !(-e > E.slidesGrid[n] && -e < E.slidesGrid[n + 1]); n++);
            var r = Math.abs(E.slidesGrid[n] + e), i = Math.abs(E.slidesGrid[n + 1] + e);
            E.activeIndex = i >= r ? n : n + 1;
          }
        } else
          E.activeIndex = Math[t.visibilityFullFit ? 'ceil' : 'round'](-e / M);
        if (E.activeIndex === E.slides.length && (E.activeIndex = E.slides.length - 1), E.activeIndex < 0 && (E.activeIndex = 0), E.slides[E.activeIndex]) {
          if (E.calcVisibleSlides(e), E.support.classList) {
            var o;
            for (n = 0; n < E.slides.length; n++)
              o = E.slides[n], o.classList.remove(t.slideActiveClass), E.visibleSlides.indexOf(o) >= 0 ? o.classList.add(t.slideVisibleClass) : o.classList.remove(t.slideVisibleClass);
            E.slides[E.activeIndex].classList.add(t.slideActiveClass);
          } else {
            var a = new RegExp('\\s*' + t.slideActiveClass), s = new RegExp('\\s*' + t.slideVisibleClass);
            for (n = 0; n < E.slides.length; n++)
              E.slides[n].className = E.slides[n].className.replace(a, '').replace(s, ''), E.visibleSlides.indexOf(E.slides[n]) >= 0 && (E.slides[n].className += ' ' + t.slideVisibleClass);
            E.slides[E.activeIndex].className += ' ' + t.slideActiveClass;
          }
          if (t.loop) {
            var u = E.loopedSlides;
            E.activeLoopIndex = E.activeIndex - u, E.activeLoopIndex >= E.slides.length - 2 * u && (E.activeLoopIndex = E.slides.length - 2 * u - E.activeLoopIndex), E.activeLoopIndex < 0 && (E.activeLoopIndex = E.slides.length - 2 * u + E.activeLoopIndex), E.activeLoopIndex < 0 && (E.activeLoopIndex = 0);
          } else
            E.activeLoopIndex = E.activeIndex;
          t.pagination && E.updatePagination(e);
        }
      }
    }, E.createPagination = function (e) {
      if (t.paginationClickable && E.paginationButtons && x(), E.paginationContainer = t.pagination.nodeType ? t.pagination : n(t.pagination)[0], t.createPagination) {
        var r = '', i = E.slides.length, o = i;
        t.loop && (o -= 2 * E.loopedSlides);
        for (var a = 0; o > a; a++)
          r += '<' + t.paginationElement + ' class="' + t.paginationElementClass + '"></' + t.paginationElement + '>';
        E.paginationContainer.innerHTML = r;
      }
      E.paginationButtons = n('.' + t.paginationElementClass, E.paginationContainer), e || E.updatePagination(), E.callPlugins('onCreatePagination'), t.paginationClickable && k();
    }, E.updatePagination = function (e) {
      if (t.pagination && !(E.slides.length < 1)) {
        var r = n('.' + t.paginationActiveClass, E.paginationContainer);
        if (r) {
          var i = E.paginationButtons;
          if (0 !== i.length) {
            for (var o = 0; o < i.length; o++)
              i[o].className = t.paginationElementClass;
            var a = t.loop ? E.loopedSlides : 0;
            if (t.paginationAsRange) {
              E.visibleSlides || E.calcVisibleSlides(e);
              var s, u = [];
              for (s = 0; s < E.visibleSlides.length; s++) {
                var l = E.slides.indexOf(E.visibleSlides[s]) - a;
                t.loop && 0 > l && (l = E.slides.length - 2 * E.loopedSlides + l), t.loop && l >= E.slides.length - 2 * E.loopedSlides && (l = E.slides.length - 2 * E.loopedSlides - l, l = Math.abs(l)), u.push(l);
              }
              for (s = 0; s < u.length; s++)
                i[u[s]] && (i[u[s]].className += ' ' + t.paginationVisibleClass);
              t.loop ? void 0 !== i[E.activeLoopIndex] && (i[E.activeLoopIndex].className += ' ' + t.paginationActiveClass) : i[E.activeIndex].className += ' ' + t.paginationActiveClass;
            } else
              t.loop ? i[E.activeLoopIndex] && (i[E.activeLoopIndex].className += ' ' + t.paginationActiveClass + ' ' + t.paginationVisibleClass) : i[E.activeIndex].className += ' ' + t.paginationActiveClass + ' ' + t.paginationVisibleClass;
          }
        }
      }
    }, E.calcVisibleSlides = function (e) {
      var n = [], r = 0, i = 0, o = 0;
      I && E.wrapperLeft > 0 && (e += E.wrapperLeft), !I && E.wrapperTop > 0 && (e += E.wrapperTop);
      for (var a = 0; a < E.slides.length; a++) {
        r += i, i = 'auto' === t.slidesPerView ? I ? E.h.getWidth(E.slides[a], !0, t.roundLengths) : E.h.getHeight(E.slides[a], !0, t.roundLengths) : M, o = r + i;
        var s = !1;
        t.visibilityFullFit ? (r >= -e && -e + N >= o && (s = !0), -e >= r && o >= -e + N && (s = !0)) : (o > -e && -e + N >= o && (s = !0), r >= -e && -e + N > r && (s = !0), -e > r && o > -e + N && (s = !0)), s && n.push(E.slides[a]);
      }
      0 === n.length && (n = [E.slides[E.activeIndex]]), E.visibleSlides = n;
    };
    var Q, et;
    E.startAutoplay = function () {
      if (E.support.transitions) {
        if ('undefined' != typeof Q)
          return !1;
        if (!t.autoplay)
          return;
        E.callPlugins('onAutoplayStart'), t.onAutoplayStart && E.fireCallback(t.onAutoplayStart, E), T();
      } else {
        if ('undefined' != typeof et)
          return !1;
        if (!t.autoplay)
          return;
        E.callPlugins('onAutoplayStart'), t.onAutoplayStart && E.fireCallback(t.onAutoplayStart, E), et = setInterval(function () {
          t.loop ? (E.fixLoop(), E.swipeNext(!0)) : E.swipeNext(!0) || (t.autoplayStopOnLast ? (clearInterval(et), et = void 0) : E.swipeTo(0));
        }, t.autoplay);
      }
    }, E.stopAutoplay = function (e) {
      if (E.support.transitions) {
        if (!Q)
          return;
        Q && clearTimeout(Q), Q = void 0, e && !t.autoplayDisableOnInteraction && E.wrapperTransitionEnd(function () {
          T();
        }), E.callPlugins('onAutoplayStop'), t.onAutoplayStop && E.fireCallback(t.onAutoplayStop, E);
      } else
        et && clearInterval(et), et = void 0, E.callPlugins('onAutoplayStop'), t.onAutoplayStop && E.fireCallback(t.onAutoplayStop, E);
    }, E.loopCreated = !1, E.removeLoopedSlides = function () {
      if (E.loopCreated)
        for (var e = 0; e < E.slides.length; e++)
          E.slides[e].getData('looped') === !0 && E.wrapper.removeChild(E.slides[e]);
    }, E.createLoop = function () {
      if (0 !== E.slides.length) {
        E.loopedSlides = 'auto' === t.slidesPerView ? t.loopedSlides || 1 : t.slidesPerView + t.loopAdditionalSlides, E.loopedSlides > E.slides.length && (E.loopedSlides = E.slides.length);
        var e, n = '', r = '', i = '', o = E.slides.length, a = Math.floor(E.loopedSlides / o), s = E.loopedSlides % o;
        for (e = 0; a * o > e; e++) {
          var u = e;
          if (e >= o) {
            var l = Math.floor(e / o);
            u = e - o * l;
          }
          i += E.slides[u].outerHTML;
        }
        for (e = 0; s > e; e++)
          r += w(t.slideDuplicateClass, E.slides[e].outerHTML);
        for (e = o - s; o > e; e++)
          n += w(t.slideDuplicateClass, E.slides[e].outerHTML);
        var c = n + i + D.innerHTML + i + r;
        for (D.innerHTML = c, E.loopCreated = !0, E.calcSlides(), e = 0; e < E.slides.length; e++)
          (e < E.loopedSlides || e >= E.slides.length - E.loopedSlides) && E.slides[e].setData('looped', !0);
        E.callPlugins('onCreateLoop');
      }
    }, E.fixLoop = function () {
      var e;
      E.activeIndex < E.loopedSlides ? (e = E.slides.length - 3 * E.loopedSlides + E.activeIndex, E.swipeTo(e, 0, !1)) : ('auto' === t.slidesPerView && E.activeIndex >= 2 * E.loopedSlides || E.activeIndex > E.slides.length - 2 * t.slidesPerView) && (e = -E.slides.length + E.activeIndex + E.loopedSlides, E.swipeTo(e, 0, !1));
    }, E.loadSlides = function () {
      var e = '';
      E.activeLoaderIndex = 0;
      for (var n = t.loader.slides, r = t.loader.loadAllSlides ? n.length : t.slidesPerView * (1 + t.loader.surroundGroups), i = 0; r > i; i++)
        e += 'outer' === t.loader.slidesHTMLType ? n[i] : '<' + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + i + '">' + n[i] + '</' + t.slideElement + '>';
      E.wrapper.innerHTML = e, E.calcSlides(!0), t.loader.loadAllSlides || E.wrapperTransitionEnd(E.reloadSlides, !0);
    }, E.reloadSlides = function () {
      var e = t.loader.slides, n = parseInt(E.activeSlide().data('swiperindex'), 10);
      if (!(0 > n || n > e.length - 1)) {
        E.activeLoaderIndex = n;
        var r = Math.max(0, n - t.slidesPerView * t.loader.surroundGroups), i = Math.min(n + t.slidesPerView * (1 + t.loader.surroundGroups) - 1, e.length - 1);
        if (n > 0) {
          var o = -M * (n - r);
          E.setWrapperTranslate(o), E.setWrapperTransition(0);
        }
        var a;
        if ('reload' === t.loader.logic) {
          E.wrapper.innerHTML = '';
          var s = '';
          for (a = r; i >= a; a++)
            s += 'outer' === t.loader.slidesHTMLType ? e[a] : '<' + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + a + '">' + e[a] + '</' + t.slideElement + '>';
          E.wrapper.innerHTML = s;
        } else {
          var u = 1000, l = 0;
          for (a = 0; a < E.slides.length; a++) {
            var c = E.slides[a].data('swiperindex');
            r > c || c > i ? E.wrapper.removeChild(E.slides[a]) : (u = Math.min(c, u), l = Math.max(c, l));
          }
          for (a = r; i >= a; a++) {
            var d;
            u > a && (d = document.createElement(t.slideElement), d.className = t.slideClass, d.setAttribute('data-swiperindex', a), d.innerHTML = e[a], E.wrapper.insertBefore(d, E.wrapper.firstChild)), a > l && (d = document.createElement(t.slideElement), d.className = t.slideClass, d.setAttribute('data-swiperindex', a), d.innerHTML = e[a], E.wrapper.appendChild(d));
          }
        }
        E.reInit(!0);
      }
    }, S();
  }
};
Swiper.prototype = {
  plugins: {},
  wrapperTransitionEnd: function (e, t) {
    'use strict';
    function n() {
      if (e(i), i.params.queueEndCallbacks && (i._queueEndCallbacks = !1), !t)
        for (r = 0; r < a.length; r++)
          i.h.removeEventListener(o, a[r], n);
    }
    var r, i = this, o = i.wrapper, a = [
        'webkitTransitionEnd',
        'transitionend',
        'oTransitionEnd',
        'MSTransitionEnd',
        'msTransitionEnd'
      ];
    if (e)
      for (r = 0; r < a.length; r++)
        i.h.addEventListener(o, a[r], n);
  },
  getWrapperTranslate: function (e) {
    'use strict';
    var t, n, r, i, o = this.wrapper;
    return 'undefined' == typeof e && (e = 'horizontal' === this.params.mode ? 'x' : 'y'), this.support.transforms && this.params.useCSS3Transforms ? (r = window.getComputedStyle(o, null), window.WebKitCSSMatrix ? i = new WebKitCSSMatrix(r.webkitTransform) : (i = r.MozTransform || r.OTransform || r.MsTransform || r.msTransform || r.transform || r.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,'), t = i.toString().split(',')), 'x' === e && (n = window.WebKitCSSMatrix ? i.m41 : parseFloat(16 === t.length ? t[12] : t[4])), 'y' === e && (n = window.WebKitCSSMatrix ? i.m42 : parseFloat(16 === t.length ? t[13] : t[5]))) : ('x' === e && (n = parseFloat(o.style.left, 10) || 0), 'y' === e && (n = parseFloat(o.style.top, 10) || 0)), n || 0;
  },
  setWrapperTranslate: function (e, t, n) {
    'use strict';
    var r, i = this.wrapper.style, o = {
        x: 0,
        y: 0,
        z: 0
      };
    3 === arguments.length ? (o.x = e, o.y = t, o.z = n) : ('undefined' == typeof t && (t = 'horizontal' === this.params.mode ? 'x' : 'y'), o[t] = e), this.support.transforms && this.params.useCSS3Transforms ? (r = this.support.transforms3d ? 'translate3d(' + o.x + 'px, ' + o.y + 'px, ' + o.z + 'px)' : 'translate(' + o.x + 'px, ' + o.y + 'px)', i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = r) : (i.left = o.x + 'px', i.top = o.y + 'px'), this.callPlugins('onSetWrapperTransform', o), this.params.onSetWrapperTransform && this.fireCallback(this.params.onSetWrapperTransform, this, o);
  },
  setWrapperTransition: function (e) {
    'use strict';
    var t = this.wrapper.style;
    t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e / 1000 + 's', this.callPlugins('onSetWrapperTransition', { duration: e }), this.params.onSetWrapperTransition && this.fireCallback(this.params.onSetWrapperTransition, this, e);
  },
  h: {
    getWidth: function (e, t, n) {
      'use strict';
      var r = window.getComputedStyle(e, null).getPropertyValue('width'), i = parseFloat(r);
      return (isNaN(i) || r.indexOf('%') > 0) && (i = e.offsetWidth - parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-right'))), t && (i += parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-right'))), n ? Math.round(i) : i;
    },
    getHeight: function (e, t, n) {
      'use strict';
      if (t)
        return e.offsetHeight;
      var r = window.getComputedStyle(e, null).getPropertyValue('height'), i = parseFloat(r);
      return (isNaN(i) || r.indexOf('%') > 0) && (i = e.offsetHeight - parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-bottom'))), t && (i += parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(e, null).getPropertyValue('padding-bottom'))), n ? Math.round(i) : i;
    },
    getOffset: function (e) {
      'use strict';
      var t = e.getBoundingClientRect(), n = document.body, r = e.clientTop || n.clientTop || 0, i = e.clientLeft || n.clientLeft || 0, o = window.pageYOffset || e.scrollTop, a = window.pageXOffset || e.scrollLeft;
      return document.documentElement && !window.pageYOffset && (o = document.documentElement.scrollTop, a = document.documentElement.scrollLeft), {
        top: t.top + o - r,
        left: t.left + a - i
      };
    },
    windowWidth: function () {
      'use strict';
      return window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : void 0;
    },
    windowHeight: function () {
      'use strict';
      return window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : void 0;
    },
    windowScroll: function () {
      'use strict';
      return 'undefined' != typeof pageYOffset ? {
        left: window.pageXOffset,
        top: window.pageYOffset
      } : document.documentElement ? {
        left: document.documentElement.scrollLeft,
        top: document.documentElement.scrollTop
      } : void 0;
    },
    addEventListener: function (e, t, n, r) {
      'use strict';
      'undefined' == typeof r && (r = !1), e.addEventListener ? e.addEventListener(t, n, r) : e.attachEvent && e.attachEvent('on' + t, n);
    },
    removeEventListener: function (e, t, n, r) {
      'use strict';
      'undefined' == typeof r && (r = !1), e.removeEventListener ? e.removeEventListener(t, n, r) : e.detachEvent && e.detachEvent('on' + t, n);
    }
  },
  setTransform: function (e, t) {
    'use strict';
    var n = e.style;
    n.webkitTransform = n.MsTransform = n.msTransform = n.MozTransform = n.OTransform = n.transform = t;
  },
  setTranslate: function (e, t) {
    'use strict';
    var n = e.style, r = {
        x: t.x || 0,
        y: t.y || 0,
        z: t.z || 0
      }, i = this.support.transforms3d ? 'translate3d(' + r.x + 'px,' + r.y + 'px,' + r.z + 'px)' : 'translate(' + r.x + 'px,' + r.y + 'px)';
    n.webkitTransform = n.MsTransform = n.msTransform = n.MozTransform = n.OTransform = n.transform = i, this.support.transforms || (n.left = r.x + 'px', n.top = r.y + 'px');
  },
  setTransition: function (e, t) {
    'use strict';
    var n = e.style;
    n.webkitTransitionDuration = n.MsTransitionDuration = n.msTransitionDuration = n.MozTransitionDuration = n.OTransitionDuration = n.transitionDuration = t + 'ms';
  },
  support: {
    touch: window.Modernizr && Modernizr.touch === !0 || function () {
      'use strict';
      return !!('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
    }(),
    transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function () {
      'use strict';
      var e = document.createElement('div').style;
      return 'webkitPerspective' in e || 'MozPerspective' in e || 'OPerspective' in e || 'MsPerspective' in e || 'perspective' in e;
    }(),
    transforms: window.Modernizr && Modernizr.csstransforms === !0 || function () {
      'use strict';
      var e = document.createElement('div').style;
      return 'transform' in e || 'WebkitTransform' in e || 'MozTransform' in e || 'msTransform' in e || 'MsTransform' in e || 'OTransform' in e;
    }(),
    transitions: window.Modernizr && Modernizr.csstransitions === !0 || function () {
      'use strict';
      var e = document.createElement('div').style;
      return 'transition' in e || 'WebkitTransition' in e || 'MozTransition' in e || 'msTransition' in e || 'MsTransition' in e || 'OTransition' in e;
    }(),
    classList: function () {
      'use strict';
      var e = document.createElement('div').style;
      return 'classList' in e;
    }()
  },
  browser: {
    ie8: function () {
      'use strict';
      var e = -1;
      if ('Microsoft Internet Explorer' === navigator.appName) {
        var t = navigator.userAgent, n = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
        null !== n.exec(t) && (e = parseFloat(RegExp.$1));
      }
      return -1 !== e && 9 > e;
    }(),
    ie10: window.navigator.msPointerEnabled,
    ie11: window.navigator.pointerEnabled
  }
}, (window.jQuery || window.Zepto) && !function (e) {
  'use strict';
  e.fn.swiper = function (t) {
    var n = new Swiper(e(this)[0], t);
    return e(this).data('swiper', n), n;
  };
}(window.jQuery || window.Zepto), 'undefined' != typeof module && (module.exports = Swiper), 'function' == typeof define && define.amd && define([], function () {
  'use strict';
  return Swiper;
}), function (e) {
  function t() {
    return {
      empty: !1,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: !1,
      invalidMonth: null,
      invalidFormat: !1,
      userInvalidated: !1,
      iso: !1
    };
  }
  function n(e, t) {
    return function (n) {
      return c(e.call(this, n), t);
    };
  }
  function r(e, t) {
    return function (n) {
      return this.lang().ordinal(e.call(this, n), t);
    };
  }
  function i() {
  }
  function o(e) {
    x(e), s(this, e);
  }
  function a(e) {
    var t = m(e), n = t.year || 0, r = t.month || 0, i = t.week || 0, o = t.day || 0, a = t.hour || 0, s = t.minute || 0, u = t.second || 0, l = t.millisecond || 0;
    this._milliseconds = +l + 1000 * u + 60000 * s + 3600000 * a, this._days = +o + 7 * i, this._months = +r + 12 * n, this._data = {}, this._bubble();
  }
  function s(e, t) {
    for (var n in t)
      t.hasOwnProperty(n) && (e[n] = t[n]);
    return t.hasOwnProperty('toString') && (e.toString = t.toString), t.hasOwnProperty('valueOf') && (e.valueOf = t.valueOf), e;
  }
  function u(e) {
    var t, n = {};
    for (t in e)
      e.hasOwnProperty(t) && mt.hasOwnProperty(t) && (n[t] = e[t]);
    return n;
  }
  function l(e) {
    return 0 > e ? Math.ceil(e) : Math.floor(e);
  }
  function c(e, t, n) {
    for (var r = '' + Math.abs(e), i = e >= 0; r.length < t;)
      r = '0' + r;
    return (i ? n ? '+' : '' : '-') + r;
  }
  function d(e, t, n, r) {
    var i, o, a = t._milliseconds, s = t._days, u = t._months;
    a && e._d.setTime(+e._d + a * n), (s || u) && (i = e.minute(), o = e.hour()), s && e.date(e.date() + s * n), u && e.month(e.month() + u * n), a && !r && rt.updateOffset(e), (s || u) && (e.minute(i), e.hour(o));
  }
  function f(e) {
    return '[object Array]' === Object.prototype.toString.call(e);
  }
  function p(e) {
    return '[object Date]' === Object.prototype.toString.call(e) || e instanceof Date;
  }
  function h(e, t, n) {
    var r, i = Math.min(e.length, t.length), o = Math.abs(e.length - t.length), a = 0;
    for (r = 0; i > r; r++)
      (n && e[r] !== t[r] || !n && y(e[r]) !== y(t[r])) && a++;
    return a + o;
  }
  function g(e) {
    if (e) {
      var t = e.toLowerCase().replace(/(.)s$/, '$1');
      e = Bt[e] || Yt[t] || t;
    }
    return e;
  }
  function m(e) {
    var t, n, r = {};
    for (n in e)
      e.hasOwnProperty(n) && (t = g(n), t && (r[t] = e[n]));
    return r;
  }
  function v(t) {
    var n, r;
    if (0 === t.indexOf('week'))
      n = 7, r = 'day';
    else {
      if (0 !== t.indexOf('month'))
        return;
      n = 12, r = 'month';
    }
    rt[t] = function (i, o) {
      var a, s, u = rt.fn._lang[t], l = [];
      if ('number' == typeof i && (o = i, i = e), s = function (e) {
          var t = rt().utc().set(r, e);
          return u.call(rt.fn._lang, t, i || '');
        }, null != o)
        return s(o);
      for (a = 0; n > a; a++)
        l.push(s(a));
      return l;
    };
  }
  function y(e) {
    var t = +e, n = 0;
    return 0 !== t && isFinite(t) && (n = t >= 0 ? Math.floor(t) : Math.ceil(t)), n;
  }
  function w(e, t) {
    return new Date(Date.UTC(e, t + 1, 0)).getUTCDate();
  }
  function b(e) {
    return $(e) ? 366 : 365;
  }
  function $(e) {
    return 0 === e % 4 && 0 !== e % 100 || 0 === e % 400;
  }
  function x(e) {
    var t;
    e._a && -2 === e._pf.overflow && (t = e._a[lt] < 0 || e._a[lt] > 11 ? lt : e._a[ct] < 1 || e._a[ct] > w(e._a[ut], e._a[lt]) ? ct : e._a[dt] < 0 || e._a[dt] > 23 ? dt : e._a[ft] < 0 || e._a[ft] > 59 ? ft : e._a[pt] < 0 || e._a[pt] > 59 ? pt : e._a[ht] < 0 || e._a[ht] > 999 ? ht : -1, e._pf._overflowDayOfYear && (ut > t || t > ct) && (t = ct), e._pf.overflow = t);
  }
  function k(e) {
    return null == e._isValid && (e._isValid = !isNaN(e._d.getTime()) && e._pf.overflow < 0 && !e._pf.empty && !e._pf.invalidMonth && !e._pf.nullInput && !e._pf.invalidFormat && !e._pf.userInvalidated, e._strict && (e._isValid = e._isValid && 0 === e._pf.charsLeftOver && 0 === e._pf.unusedTokens.length)), e._isValid;
  }
  function _(e) {
    return e ? e.toLowerCase().replace('_', '-') : e;
  }
  function T(e, t) {
    return t._isUTC ? rt(e).zone(t._offset || 0) : rt(e).local();
  }
  function S(e, t) {
    return t.abbr = e, gt[e] || (gt[e] = new i()), gt[e].set(t), gt[e];
  }
  function C(e) {
    delete gt[e];
  }
  function E(e) {
    var t, n, r, i, o = 0, a = function (e) {
        if (!gt[e] && vt)
          try {
            require('./lang/' + e);
          } catch (t) {
          }
        return gt[e];
      };
    if (!e)
      return rt.fn._lang;
    if (!f(e)) {
      if (n = a(e))
        return n;
      e = [e];
    }
    for (; o < e.length;) {
      for (i = _(e[o]).split('-'), t = i.length, r = _(e[o + 1]), r = r ? r.split('-') : null; t > 0;) {
        if (n = a(i.slice(0, t).join('-')))
          return n;
        if (r && r.length >= t && h(i, r, !0) >= t - 1)
          break;
        t--;
      }
      o++;
    }
    return rt.fn._lang;
  }
  function D(e) {
    return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, '') : e.replace(/\\/g, '');
  }
  function M(e) {
    var t, n, r = e.match($t);
    for (t = 0, n = r.length; n > t; t++)
      r[t] = Jt[r[t]] ? Jt[r[t]] : D(r[t]);
    return function (i) {
      var o = '';
      for (t = 0; n > t; t++)
        o += r[t] instanceof Function ? r[t].call(i, e) : r[t];
      return o;
    };
  }
  function P(e, t) {
    return e.isValid() ? (t = A(t, e.lang()), zt[t] || (zt[t] = M(t)), zt[t](e)) : e.lang().invalidDate();
  }
  function A(e, t) {
    function n(e) {
      return t.longDateFormat(e) || e;
    }
    var r = 5;
    for (xt.lastIndex = 0; r >= 0 && xt.test(e);)
      e = e.replace(xt, n), xt.lastIndex = 0, r -= 1;
    return e;
  }
  function O(e, t) {
    var n, r = t._strict;
    switch (e) {
    case 'DDDD':
      return Nt;
    case 'YYYY':
    case 'GGGG':
    case 'gggg':
      return r ? jt : Tt;
    case 'Y':
    case 'G':
    case 'g':
      return Rt;
    case 'YYYYYY':
    case 'YYYYY':
    case 'GGGGG':
    case 'ggggg':
      return r ? Lt : St;
    case 'S':
      if (r)
        return At;
    case 'SS':
      if (r)
        return Ot;
    case 'SSS':
      if (r)
        return Nt;
    case 'DDD':
      return _t;
    case 'MMM':
    case 'MMMM':
    case 'dd':
    case 'ddd':
    case 'dddd':
      return Et;
    case 'a':
    case 'A':
      return E(t._l)._meridiemParse;
    case 'X':
      return Pt;
    case 'Z':
    case 'ZZ':
      return Dt;
    case 'T':
      return Mt;
    case 'SSSS':
      return Ct;
    case 'MM':
    case 'DD':
    case 'YY':
    case 'GG':
    case 'gg':
    case 'HH':
    case 'hh':
    case 'mm':
    case 'ss':
    case 'ww':
    case 'WW':
      return r ? Ot : kt;
    case 'M':
    case 'D':
    case 'd':
    case 'H':
    case 'h':
    case 'm':
    case 's':
    case 'w':
    case 'W':
    case 'e':
    case 'E':
      return kt;
    default:
      return n = new RegExp(q(H(e.replace('\\', '')), 'i'));
    }
  }
  function N(e) {
    e = e || '';
    var t = e.match(Dt) || [], n = t[t.length - 1] || [], r = (n + '').match(Vt) || [
        '-',
        0,
        0
      ], i = +(60 * r[1]) + y(r[2]);
    return '+' === r[0] ? -i : i;
  }
  function j(e, t, n) {
    var r, i = n._a;
    switch (e) {
    case 'M':
    case 'MM':
      null != t && (i[lt] = y(t) - 1);
      break;
    case 'MMM':
    case 'MMMM':
      r = E(n._l).monthsParse(t), null != r ? i[lt] = r : n._pf.invalidMonth = t;
      break;
    case 'D':
    case 'DD':
      null != t && (i[ct] = y(t));
      break;
    case 'DDD':
    case 'DDDD':
      null != t && (n._dayOfYear = y(t));
      break;
    case 'YY':
      i[ut] = y(t) + (y(t) > 68 ? 1900 : 2000);
      break;
    case 'YYYY':
    case 'YYYYY':
    case 'YYYYYY':
      i[ut] = y(t);
      break;
    case 'a':
    case 'A':
      n._isPm = E(n._l).isPM(t);
      break;
    case 'H':
    case 'HH':
    case 'h':
    case 'hh':
      i[dt] = y(t);
      break;
    case 'm':
    case 'mm':
      i[ft] = y(t);
      break;
    case 's':
    case 'ss':
      i[pt] = y(t);
      break;
    case 'S':
    case 'SS':
    case 'SSS':
    case 'SSSS':
      i[ht] = y(1000 * ('0.' + t));
      break;
    case 'X':
      n._d = new Date(1000 * parseFloat(t));
      break;
    case 'Z':
    case 'ZZ':
      n._useUTC = !0, n._tzm = N(t);
      break;
    case 'w':
    case 'ww':
    case 'W':
    case 'WW':
    case 'd':
    case 'dd':
    case 'ddd':
    case 'dddd':
    case 'e':
    case 'E':
      e = e.substr(0, 1);
    case 'gg':
    case 'gggg':
    case 'GG':
    case 'GGGG':
    case 'GGGGG':
      e = e.substr(0, 2), t && (n._w = n._w || {}, n._w[e] = t);
    }
  }
  function L(e) {
    var t, n, r, i, o, a, s, u, l, c, d = [];
    if (!e._d) {
      for (r = I(e), e._w && null == e._a[ct] && null == e._a[lt] && (o = function (t) {
          var n = parseInt(t, 10);
          return t ? t.length < 3 ? n > 68 ? 1900 + n : 2000 + n : n : null == e._a[ut] ? rt().weekYear() : e._a[ut];
        }, a = e._w, null != a.GG || null != a.W || null != a.E ? s = Z(o(a.GG), a.W || 1, a.E, 4, 1) : (u = E(e._l), l = null != a.d ? z(a.d, u) : null != a.e ? parseInt(a.e, 10) + u._week.dow : 0, c = parseInt(a.w, 10) || 1, null != a.d && l < u._week.dow && c++, s = Z(o(a.gg), c, l, u._week.doy, u._week.dow)), e._a[ut] = s.year, e._dayOfYear = s.dayOfYear), e._dayOfYear && (i = null == e._a[ut] ? r[ut] : e._a[ut], e._dayOfYear > b(i) && (e._pf._overflowDayOfYear = !0), n = Y(i, 0, e._dayOfYear), e._a[lt] = n.getUTCMonth(), e._a[ct] = n.getUTCDate()), t = 0; 3 > t && null == e._a[t]; ++t)
        e._a[t] = d[t] = r[t];
      for (; 7 > t; t++)
        e._a[t] = d[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
      d[dt] += y((e._tzm || 0) / 60), d[ft] += y((e._tzm || 0) % 60), e._d = (e._useUTC ? Y : B).apply(null, d);
    }
  }
  function R(e) {
    var t;
    e._d || (t = m(e._i), e._a = [
      t.year,
      t.month,
      t.day,
      t.hour,
      t.minute,
      t.second,
      t.millisecond
    ], L(e));
  }
  function I(e) {
    var t = new Date();
    return e._useUTC ? [
      t.getUTCFullYear(),
      t.getUTCMonth(),
      t.getUTCDate()
    ] : [
      t.getFullYear(),
      t.getMonth(),
      t.getDate()
    ];
  }
  function F(e) {
    e._a = [], e._pf.empty = !0;
    var t, n, r, i, o, a = E(e._l), s = '' + e._i, u = s.length, l = 0;
    for (r = A(e._f, a).match($t) || [], t = 0; t < r.length; t++)
      i = r[t], n = (s.match(O(i, e)) || [])[0], n && (o = s.substr(0, s.indexOf(n)), o.length > 0 && e._pf.unusedInput.push(o), s = s.slice(s.indexOf(n) + n.length), l += n.length), Jt[i] ? (n ? e._pf.empty = !1 : e._pf.unusedTokens.push(i), j(i, n, e)) : e._strict && !n && e._pf.unusedTokens.push(i);
    e._pf.charsLeftOver = u - l, s.length > 0 && e._pf.unusedInput.push(s), e._isPm && e._a[dt] < 12 && (e._a[dt] += 12), e._isPm === !1 && 12 === e._a[dt] && (e._a[dt] = 0), L(e), x(e);
  }
  function H(e) {
    return e.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, n, r, i) {
      return t || n || r || i;
    });
  }
  function q(e) {
    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  function V(e) {
    var n, r, i, o, a;
    if (0 === e._f.length)
      return e._pf.invalidFormat = !0, e._d = new Date(0 / 0), void 0;
    for (o = 0; o < e._f.length; o++)
      a = 0, n = s({}, e), n._pf = t(), n._f = e._f[o], F(n), k(n) && (a += n._pf.charsLeftOver, a += 10 * n._pf.unusedTokens.length, n._pf.score = a, (null == i || i > a) && (i = a, r = n));
    s(e, r || n);
  }
  function U(e) {
    var t, n, r = e._i, i = It.exec(r);
    if (i) {
      for (e._pf.iso = !0, t = 0, n = Ht.length; n > t; t++)
        if (Ht[t][1].exec(r)) {
          e._f = Ht[t][0] + (i[6] || ' ');
          break;
        }
      for (t = 0, n = qt.length; n > t; t++)
        if (qt[t][1].exec(r)) {
          e._f += qt[t][0];
          break;
        }
      r.match(Dt) && (e._f += 'Z'), F(e);
    } else
      e._d = new Date(r);
  }
  function W(t) {
    var n = t._i, r = yt.exec(n);
    n === e ? t._d = new Date() : r ? t._d = new Date(+r[1]) : 'string' == typeof n ? U(t) : f(n) ? (t._a = n.slice(0), L(t)) : p(n) ? t._d = new Date(+n) : 'object' == typeof n ? R(t) : t._d = new Date(n);
  }
  function B(e, t, n, r, i, o, a) {
    var s = new Date(e, t, n, r, i, o, a);
    return 1970 > e && s.setFullYear(e), s;
  }
  function Y(e) {
    var t = new Date(Date.UTC.apply(null, arguments));
    return 1970 > e && t.setUTCFullYear(e), t;
  }
  function z(e, t) {
    if ('string' == typeof e)
      if (isNaN(e)) {
        if (e = t.weekdaysParse(e), 'number' != typeof e)
          return null;
      } else
        e = parseInt(e, 10);
    return e;
  }
  function G(e, t, n, r, i) {
    return i.relativeTime(t || 1, !!n, e, r);
  }
  function X(e, t, n) {
    var r = st(Math.abs(e) / 1000), i = st(r / 60), o = st(i / 60), a = st(o / 24), s = st(a / 365), u = 45 > r && [
        's',
        r
      ] || 1 === i && ['m'] || 45 > i && [
        'mm',
        i
      ] || 1 === o && ['h'] || 22 > o && [
        'hh',
        o
      ] || 1 === a && ['d'] || 25 >= a && [
        'dd',
        a
      ] || 45 >= a && ['M'] || 345 > a && [
        'MM',
        st(a / 30)
      ] || 1 === s && ['y'] || [
        'yy',
        s
      ];
    return u[2] = t, u[3] = e > 0, u[4] = n, G.apply({}, u);
  }
  function J(e, t, n) {
    var r, i = n - t, o = n - e.day();
    return o > i && (o -= 7), i - 7 > o && (o += 7), r = rt(e).add('d', o), {
      week: Math.ceil(r.dayOfYear() / 7),
      year: r.year()
    };
  }
  function Z(e, t, n, r, i) {
    var o, a, s = Y(e, 0, 1).getUTCDay();
    return n = null != n ? n : i, o = i - s + (s > r ? 7 : 0) - (i > s ? 7 : 0), a = 7 * (t - 1) + (n - i) + o + 1, {
      year: a > 0 ? e : e - 1,
      dayOfYear: a > 0 ? a : b(e - 1) + a
    };
  }
  function K(e) {
    var t = e._i, n = e._f;
    return null === t ? rt.invalid({ nullInput: !0 }) : ('string' == typeof t && (e._i = t = E().preparse(t)), rt.isMoment(t) ? (e = u(t), e._d = new Date(+t._d)) : n ? f(n) ? V(e) : F(e) : W(e), new o(e));
  }
  function Q(e, t) {
    rt.fn[e] = rt.fn[e + 's'] = function (e) {
      var n = this._isUTC ? 'UTC' : '';
      return null != e ? (this._d['set' + n + t](e), rt.updateOffset(this), this) : this._d['get' + n + t]();
    };
  }
  function et(e) {
    rt.duration.fn[e] = function () {
      return this._data[e];
    };
  }
  function tt(e, t) {
    rt.duration.fn['as' + e] = function () {
      return +this / t;
    };
  }
  function nt(e) {
    var t = !1, n = rt;
    'undefined' == typeof ender && (e ? (at.moment = function () {
      return !t && console && console.warn && (t = !0, console.warn('Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.')), n.apply(null, arguments);
    }, s(at.moment, n)) : at.moment = rt);
  }
  for (var rt, it, ot = '2.5.1', at = this, st = Math.round, ut = 0, lt = 1, ct = 2, dt = 3, ft = 4, pt = 5, ht = 6, gt = {}, mt = {
        _isAMomentObject: null,
        _i: null,
        _f: null,
        _l: null,
        _strict: null,
        _isUTC: null,
        _offset: null,
        _pf: null,
        _lang: null
      }, vt = 'undefined' != typeof module && module.exports && 'undefined' != typeof require, yt = /^\/?Date\((\-?\d+)/i, wt = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, bt = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, $t = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, xt = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, kt = /\d\d?/, _t = /\d{1,3}/, Tt = /\d{1,4}/, St = /[+\-]?\d{1,6}/, Ct = /\d+/, Et = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Dt = /Z|[\+\-]\d\d:?\d\d/gi, Mt = /T/i, Pt = /[\+\-]?\d+(\.\d{1,3})?/, At = /\d/, Ot = /\d\d/, Nt = /\d{3}/, jt = /\d{4}/, Lt = /[+-]?\d{6}/, Rt = /[+-]?\d+/, It = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Ft = 'YYYY-MM-DDTHH:mm:ssZ', Ht = [
        [
          'YYYYYY-MM-DD',
          /[+-]\d{6}-\d{2}-\d{2}/
        ],
        [
          'YYYY-MM-DD',
          /\d{4}-\d{2}-\d{2}/
        ],
        [
          'GGGG-[W]WW-E',
          /\d{4}-W\d{2}-\d/
        ],
        [
          'GGGG-[W]WW',
          /\d{4}-W\d{2}/
        ],
        [
          'YYYY-DDD',
          /\d{4}-\d{3}/
        ]
      ], qt = [
        [
          'HH:mm:ss.SSSS',
          /(T| )\d\d:\d\d:\d\d\.\d{1,3}/
        ],
        [
          'HH:mm:ss',
          /(T| )\d\d:\d\d:\d\d/
        ],
        [
          'HH:mm',
          /(T| )\d\d:\d\d/
        ],
        [
          'HH',
          /(T| )\d\d/
        ]
      ], Vt = /([\+\-]|\d\d)/gi, Ut = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'), Wt = {
        Milliseconds: 1,
        Seconds: 1000,
        Minutes: 60000,
        Hours: 3600000,
        Days: 86400000,
        Months: 2592000000,
        Years: 31536000000
      }, Bt = {
        ms: 'millisecond',
        s: 'second',
        m: 'minute',
        h: 'hour',
        d: 'day',
        D: 'date',
        w: 'week',
        W: 'isoWeek',
        M: 'month',
        y: 'year',
        DDD: 'dayOfYear',
        e: 'weekday',
        E: 'isoWeekday',
        gg: 'weekYear',
        GG: 'isoWeekYear'
      }, Yt = {
        dayofyear: 'dayOfYear',
        isoweekday: 'isoWeekday',
        isoweek: 'isoWeek',
        weekyear: 'weekYear',
        isoweekyear: 'isoWeekYear'
      }, zt = {}, Gt = 'DDD w W M D d'.split(' '), Xt = 'M D H h m s w W'.split(' '), Jt = {
        M: function () {
          return this.month() + 1;
        },
        MMM: function (e) {
          return this.lang().monthsShort(this, e);
        },
        MMMM: function (e) {
          return this.lang().months(this, e);
        },
        D: function () {
          return this.date();
        },
        DDD: function () {
          return this.dayOfYear();
        },
        d: function () {
          return this.day();
        },
        dd: function (e) {
          return this.lang().weekdaysMin(this, e);
        },
        ddd: function (e) {
          return this.lang().weekdaysShort(this, e);
        },
        dddd: function (e) {
          return this.lang().weekdays(this, e);
        },
        w: function () {
          return this.week();
        },
        W: function () {
          return this.isoWeek();
        },
        YY: function () {
          return c(this.year() % 100, 2);
        },
        YYYY: function () {
          return c(this.year(), 4);
        },
        YYYYY: function () {
          return c(this.year(), 5);
        },
        YYYYYY: function () {
          var e = this.year(), t = e >= 0 ? '+' : '-';
          return t + c(Math.abs(e), 6);
        },
        gg: function () {
          return c(this.weekYear() % 100, 2);
        },
        gggg: function () {
          return c(this.weekYear(), 4);
        },
        ggggg: function () {
          return c(this.weekYear(), 5);
        },
        GG: function () {
          return c(this.isoWeekYear() % 100, 2);
        },
        GGGG: function () {
          return c(this.isoWeekYear(), 4);
        },
        GGGGG: function () {
          return c(this.isoWeekYear(), 5);
        },
        e: function () {
          return this.weekday();
        },
        E: function () {
          return this.isoWeekday();
        },
        a: function () {
          return this.lang().meridiem(this.hours(), this.minutes(), !0);
        },
        A: function () {
          return this.lang().meridiem(this.hours(), this.minutes(), !1);
        },
        H: function () {
          return this.hours();
        },
        h: function () {
          return this.hours() % 12 || 12;
        },
        m: function () {
          return this.minutes();
        },
        s: function () {
          return this.seconds();
        },
        S: function () {
          return y(this.milliseconds() / 100);
        },
        SS: function () {
          return c(y(this.milliseconds() / 10), 2);
        },
        SSS: function () {
          return c(this.milliseconds(), 3);
        },
        SSSS: function () {
          return c(this.milliseconds(), 3);
        },
        Z: function () {
          var e = -this.zone(), t = '+';
          return 0 > e && (e = -e, t = '-'), t + c(y(e / 60), 2) + ':' + c(y(e) % 60, 2);
        },
        ZZ: function () {
          var e = -this.zone(), t = '+';
          return 0 > e && (e = -e, t = '-'), t + c(y(e / 60), 2) + c(y(e) % 60, 2);
        },
        z: function () {
          return this.zoneAbbr();
        },
        zz: function () {
          return this.zoneName();
        },
        X: function () {
          return this.unix();
        },
        Q: function () {
          return this.quarter();
        }
      }, Zt = [
        'months',
        'monthsShort',
        'weekdays',
        'weekdaysShort',
        'weekdaysMin'
      ]; Gt.length;)
    it = Gt.pop(), Jt[it + 'o'] = r(Jt[it], it);
  for (; Xt.length;)
    it = Xt.pop(), Jt[it + it] = n(Jt[it], 2);
  for (Jt.DDDD = n(Jt.DDD, 3), s(i.prototype, {
      set: function (e) {
        var t, n;
        for (n in e)
          t = e[n], 'function' == typeof t ? this[n] = t : this['_' + n] = t;
      },
      _months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
      months: function (e) {
        return this._months[e.month()];
      },
      _monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
      monthsShort: function (e) {
        return this._monthsShort[e.month()];
      },
      monthsParse: function (e) {
        var t, n, r;
        for (this._monthsParse || (this._monthsParse = []), t = 0; 12 > t; t++)
          if (this._monthsParse[t] || (n = rt.utc([
              2000,
              t
            ]), r = '^' + this.months(n, '') + '|^' + this.monthsShort(n, ''), this._monthsParse[t] = new RegExp(r.replace('.', ''), 'i')), this._monthsParse[t].test(e))
            return t;
      },
      _weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      weekdays: function (e) {
        return this._weekdays[e.day()];
      },
      _weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
      weekdaysShort: function (e) {
        return this._weekdaysShort[e.day()];
      },
      _weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
      weekdaysMin: function (e) {
        return this._weekdaysMin[e.day()];
      },
      weekdaysParse: function (e) {
        var t, n, r;
        for (this._weekdaysParse || (this._weekdaysParse = []), t = 0; 7 > t; t++)
          if (this._weekdaysParse[t] || (n = rt([
              2000,
              1
            ]).day(t), r = '^' + this.weekdays(n, '') + '|^' + this.weekdaysShort(n, '') + '|^' + this.weekdaysMin(n, ''), this._weekdaysParse[t] = new RegExp(r.replace('.', ''), 'i')), this._weekdaysParse[t].test(e))
            return t;
      },
      _longDateFormat: {
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D YYYY',
        LLL: 'MMMM D YYYY LT',
        LLLL: 'dddd, MMMM D YYYY LT'
      },
      longDateFormat: function (e) {
        var t = this._longDateFormat[e];
        return !t && this._longDateFormat[e.toUpperCase()] && (t = this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (e) {
          return e.slice(1);
        }), this._longDateFormat[e] = t), t;
      },
      isPM: function (e) {
        return 'p' === (e + '').toLowerCase().charAt(0);
      },
      _meridiemParse: /[ap]\.?m?\.?/i,
      meridiem: function (e, t, n) {
        return e > 11 ? n ? 'pm' : 'PM' : n ? 'am' : 'AM';
      },
      _calendar: {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
      },
      calendar: function (e, t) {
        var n = this._calendar[e];
        return 'function' == typeof n ? n.apply(t) : n;
      },
      _relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      },
      relativeTime: function (e, t, n, r) {
        var i = this._relativeTime[n];
        return 'function' == typeof i ? i(e, t, n, r) : i.replace(/%d/i, e);
      },
      pastFuture: function (e, t) {
        var n = this._relativeTime[e > 0 ? 'future' : 'past'];
        return 'function' == typeof n ? n(t) : n.replace(/%s/i, t);
      },
      ordinal: function (e) {
        return this._ordinal.replace('%d', e);
      },
      _ordinal: '%d',
      preparse: function (e) {
        return e;
      },
      postformat: function (e) {
        return e;
      },
      week: function (e) {
        return J(e, this._week.dow, this._week.doy).week;
      },
      _week: {
        dow: 0,
        doy: 6
      },
      _invalidDate: 'Invalid date',
      invalidDate: function () {
        return this._invalidDate;
      }
    }), rt = function (n, r, i, o) {
      var a;
      return 'boolean' == typeof i && (o = i, i = e), a = {}, a._isAMomentObject = !0, a._i = n, a._f = r, a._l = i, a._strict = o, a._isUTC = !1, a._pf = t(), K(a);
    }, rt.utc = function (n, r, i, o) {
      var a;
      return 'boolean' == typeof i && (o = i, i = e), a = {}, a._isAMomentObject = !0, a._useUTC = !0, a._isUTC = !0, a._l = i, a._i = n, a._f = r, a._strict = o, a._pf = t(), K(a).utc();
    }, rt.unix = function (e) {
      return rt(1000 * e);
    }, rt.duration = function (e, t) {
      var n, r, i, o = e, s = null;
      return rt.isDuration(e) ? o = {
        ms: e._milliseconds,
        d: e._days,
        M: e._months
      } : 'number' == typeof e ? (o = {}, t ? o[t] = e : o.milliseconds = e) : (s = wt.exec(e)) ? (n = '-' === s[1] ? -1 : 1, o = {
        y: 0,
        d: y(s[ct]) * n,
        h: y(s[dt]) * n,
        m: y(s[ft]) * n,
        s: y(s[pt]) * n,
        ms: y(s[ht]) * n
      }) : (s = bt.exec(e)) && (n = '-' === s[1] ? -1 : 1, i = function (e) {
        var t = e && parseFloat(e.replace(',', '.'));
        return (isNaN(t) ? 0 : t) * n;
      }, o = {
        y: i(s[2]),
        M: i(s[3]),
        d: i(s[4]),
        h: i(s[5]),
        m: i(s[6]),
        s: i(s[7]),
        w: i(s[8])
      }), r = new a(o), rt.isDuration(e) && e.hasOwnProperty('_lang') && (r._lang = e._lang), r;
    }, rt.version = ot, rt.defaultFormat = Ft, rt.updateOffset = function () {
    }, rt.lang = function (e, t) {
      var n;
      return e ? (t ? S(_(e), t) : null === t ? (C(e), e = 'en') : gt[e] || E(e), n = rt.duration.fn._lang = rt.fn._lang = E(e), n._abbr) : rt.fn._lang._abbr;
    }, rt.langData = function (e) {
      return e && e._lang && e._lang._abbr && (e = e._lang._abbr), E(e);
    }, rt.isMoment = function (e) {
      return e instanceof o || null != e && e.hasOwnProperty('_isAMomentObject');
    }, rt.isDuration = function (e) {
      return e instanceof a;
    }, it = Zt.length - 1; it >= 0; --it)
    v(Zt[it]);
  for (rt.normalizeUnits = function (e) {
      return g(e);
    }, rt.invalid = function (e) {
      var t = rt.utc(0 / 0);
      return null != e ? s(t._pf, e) : t._pf.userInvalidated = !0, t;
    }, rt.parseZone = function (e) {
      return rt(e).parseZone();
    }, s(rt.fn = o.prototype, {
      clone: function () {
        return rt(this);
      },
      valueOf: function () {
        return +this._d + 60000 * (this._offset || 0);
      },
      unix: function () {
        return Math.floor(+this / 1000);
      },
      toString: function () {
        return this.clone().lang('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
      },
      toDate: function () {
        return this._offset ? new Date(+this) : this._d;
      },
      toISOString: function () {
        var e = rt(this).utc();
        return 0 < e.year() && e.year() <= 9999 ? P(e, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]') : P(e, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      },
      toArray: function () {
        var e = this;
        return [
          e.year(),
          e.month(),
          e.date(),
          e.hours(),
          e.minutes(),
          e.seconds(),
          e.milliseconds()
        ];
      },
      isValid: function () {
        return k(this);
      },
      isDSTShifted: function () {
        return this._a ? this.isValid() && h(this._a, (this._isUTC ? rt.utc(this._a) : rt(this._a)).toArray()) > 0 : !1;
      },
      parsingFlags: function () {
        return s({}, this._pf);
      },
      invalidAt: function () {
        return this._pf.overflow;
      },
      utc: function () {
        return this.zone(0);
      },
      local: function () {
        return this.zone(0), this._isUTC = !1, this;
      },
      format: function (e) {
        var t = P(this, e || rt.defaultFormat);
        return this.lang().postformat(t);
      },
      add: function (e, t) {
        var n;
        return n = 'string' == typeof e ? rt.duration(+t, e) : rt.duration(e, t), d(this, n, 1), this;
      },
      subtract: function (e, t) {
        var n;
        return n = 'string' == typeof e ? rt.duration(+t, e) : rt.duration(e, t), d(this, n, -1), this;
      },
      diff: function (e, t, n) {
        var r, i, o = T(e, this), a = 60000 * (this.zone() - o.zone());
        return t = g(t), 'year' === t || 'month' === t ? (r = 43200000 * (this.daysInMonth() + o.daysInMonth()), i = 12 * (this.year() - o.year()) + (this.month() - o.month()), i += (this - rt(this).startOf('month') - (o - rt(o).startOf('month'))) / r, i -= 60000 * (this.zone() - rt(this).startOf('month').zone() - (o.zone() - rt(o).startOf('month').zone())) / r, 'year' === t && (i /= 12)) : (r = this - o, i = 'second' === t ? r / 1000 : 'minute' === t ? r / 60000 : 'hour' === t ? r / 3600000 : 'day' === t ? (r - a) / 86400000 : 'week' === t ? (r - a) / 604800000 : r), n ? i : l(i);
      },
      from: function (e, t) {
        return rt.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!t);
      },
      fromNow: function (e) {
        return this.from(rt(), e);
      },
      calendar: function () {
        var e = T(rt(), this).startOf('day'), t = this.diff(e, 'days', !0), n = -6 > t ? 'sameElse' : -1 > t ? 'lastWeek' : 0 > t ? 'lastDay' : 1 > t ? 'sameDay' : 2 > t ? 'nextDay' : 7 > t ? 'nextWeek' : 'sameElse';
        return this.format(this.lang().calendar(n, this));
      },
      isLeapYear: function () {
        return $(this.year());
      },
      isDST: function () {
        return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone();
      },
      day: function (e) {
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != e ? (e = z(e, this.lang()), this.add({ d: e - t })) : t;
      },
      month: function (e) {
        var t, n = this._isUTC ? 'UTC' : '';
        return null != e ? 'string' == typeof e && (e = this.lang().monthsParse(e), 'number' != typeof e) ? this : (t = this.date(), this.date(1), this._d['set' + n + 'Month'](e), this.date(Math.min(t, this.daysInMonth())), rt.updateOffset(this), this) : this._d['get' + n + 'Month']();
      },
      startOf: function (e) {
        switch (e = g(e)) {
        case 'year':
          this.month(0);
        case 'month':
          this.date(1);
        case 'week':
        case 'isoWeek':
        case 'day':
          this.hours(0);
        case 'hour':
          this.minutes(0);
        case 'minute':
          this.seconds(0);
        case 'second':
          this.milliseconds(0);
        }
        return 'week' === e ? this.weekday(0) : 'isoWeek' === e && this.isoWeekday(1), this;
      },
      endOf: function (e) {
        return e = g(e), this.startOf(e).add('isoWeek' === e ? 'week' : e, 1).subtract('ms', 1);
      },
      isAfter: function (e, t) {
        return t = 'undefined' != typeof t ? t : 'millisecond', +this.clone().startOf(t) > +rt(e).startOf(t);
      },
      isBefore: function (e, t) {
        return t = 'undefined' != typeof t ? t : 'millisecond', +this.clone().startOf(t) < +rt(e).startOf(t);
      },
      isSame: function (e, t) {
        return t = t || 'ms', +this.clone().startOf(t) === +T(e, this).startOf(t);
      },
      min: function (e) {
        return e = rt.apply(null, arguments), this > e ? this : e;
      },
      max: function (e) {
        return e = rt.apply(null, arguments), e > this ? this : e;
      },
      zone: function (e) {
        var t = this._offset || 0;
        return null == e ? this._isUTC ? t : this._d.getTimezoneOffset() : ('string' == typeof e && (e = N(e)), Math.abs(e) < 16 && (e = 60 * e), this._offset = e, this._isUTC = !0, t !== e && d(this, rt.duration(t - e, 'm'), 1, !0), this);
      },
      zoneAbbr: function () {
        return this._isUTC ? 'UTC' : '';
      },
      zoneName: function () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
      },
      parseZone: function () {
        return this._tzm ? this.zone(this._tzm) : 'string' == typeof this._i && this.zone(this._i), this;
      },
      hasAlignedHourOffset: function (e) {
        return e = e ? rt(e).zone() : 0, 0 === (this.zone() - e) % 60;
      },
      daysInMonth: function () {
        return w(this.year(), this.month());
      },
      dayOfYear: function (e) {
        var t = st((rt(this).startOf('day') - rt(this).startOf('year')) / 86400000) + 1;
        return null == e ? t : this.add('d', e - t);
      },
      quarter: function () {
        return Math.ceil((this.month() + 1) / 3);
      },
      weekYear: function (e) {
        var t = J(this, this.lang()._week.dow, this.lang()._week.doy).year;
        return null == e ? t : this.add('y', e - t);
      },
      isoWeekYear: function (e) {
        var t = J(this, 1, 4).year;
        return null == e ? t : this.add('y', e - t);
      },
      week: function (e) {
        var t = this.lang().week(this);
        return null == e ? t : this.add('d', 7 * (e - t));
      },
      isoWeek: function (e) {
        var t = J(this, 1, 4).week;
        return null == e ? t : this.add('d', 7 * (e - t));
      },
      weekday: function (e) {
        var t = (this.day() + 7 - this.lang()._week.dow) % 7;
        return null == e ? t : this.add('d', e - t);
      },
      isoWeekday: function (e) {
        return null == e ? this.day() || 7 : this.day(this.day() % 7 ? e : e - 7);
      },
      get: function (e) {
        return e = g(e), this[e]();
      },
      set: function (e, t) {
        return e = g(e), 'function' == typeof this[e] && this[e](t), this;
      },
      lang: function (t) {
        return t === e ? this._lang : (this._lang = E(t), this);
      }
    }), it = 0; it < Ut.length; it++)
    Q(Ut[it].toLowerCase().replace(/s$/, ''), Ut[it]);
  Q('year', 'FullYear'), rt.fn.days = rt.fn.day, rt.fn.months = rt.fn.month, rt.fn.weeks = rt.fn.week, rt.fn.isoWeeks = rt.fn.isoWeek, rt.fn.toJSON = rt.fn.toISOString, s(rt.duration.fn = a.prototype, {
    _bubble: function () {
      var e, t, n, r, i = this._milliseconds, o = this._days, a = this._months, s = this._data;
      s.milliseconds = i % 1000, e = l(i / 1000), s.seconds = e % 60, t = l(e / 60), s.minutes = t % 60, n = l(t / 60), s.hours = n % 24, o += l(n / 24), s.days = o % 30, a += l(o / 30), s.months = a % 12, r = l(a / 12), s.years = r;
    },
    weeks: function () {
      return l(this.days() / 7);
    },
    valueOf: function () {
      return this._milliseconds + 86400000 * this._days + 2592000000 * (this._months % 12) + 31536000000 * y(this._months / 12);
    },
    humanize: function (e) {
      var t = +this, n = X(t, !e, this.lang());
      return e && (n = this.lang().pastFuture(t, n)), this.lang().postformat(n);
    },
    add: function (e, t) {
      var n = rt.duration(e, t);
      return this._milliseconds += n._milliseconds, this._days += n._days, this._months += n._months, this._bubble(), this;
    },
    subtract: function (e, t) {
      var n = rt.duration(e, t);
      return this._milliseconds -= n._milliseconds, this._days -= n._days, this._months -= n._months, this._bubble(), this;
    },
    get: function (e) {
      return e = g(e), this[e.toLowerCase() + 's']();
    },
    as: function (e) {
      return e = g(e), this['as' + e.charAt(0).toUpperCase() + e.slice(1) + 's']();
    },
    lang: rt.fn.lang,
    toIsoString: function () {
      var e = Math.abs(this.years()), t = Math.abs(this.months()), n = Math.abs(this.days()), r = Math.abs(this.hours()), i = Math.abs(this.minutes()), o = Math.abs(this.seconds() + this.milliseconds() / 1000);
      return this.asSeconds() ? (this.asSeconds() < 0 ? '-' : '') + 'P' + (e ? e + 'Y' : '') + (t ? t + 'M' : '') + (n ? n + 'D' : '') + (r || i || o ? 'T' : '') + (r ? r + 'H' : '') + (i ? i + 'M' : '') + (o ? o + 'S' : '') : 'P0D';
    }
  });
  for (it in Wt)
    Wt.hasOwnProperty(it) && (tt(it, Wt[it]), et(it.toLowerCase()));
  tt('Weeks', 604800000), rt.duration.fn.asMonths = function () {
    return (+this - 31536000000 * this.years()) / 2592000000 + 12 * this.years();
  }, rt.lang('en', {
    ordinal: function (e) {
      var t = e % 10, n = 1 === y(e % 100 / 10) ? 'th' : 1 === t ? 'st' : 2 === t ? 'nd' : 3 === t ? 'rd' : 'th';
      return e + n;
    }
  }), vt ? (module.exports = rt, nt(!0)) : 'function' == typeof define && define.amd ? define('moment', function (t, n, r) {
    return r.config && r.config() && r.config().noGlobal !== !0 && nt(r.config().noGlobal === e), rt;
  }) : nt();
}.call(this), angular.module('views', []), $(function () {
  window.weinre = !1;
}), angular.module('filters', ['cache']).filter('thumbnail', function () {
  return function (e, t, n) {
    return null == t && (t = 75), null == n && (n = 'fit_one_and_overflow'), null != (null != e ? e.replace : void 0) ? e.replace(/\?.*$/, '?bounding_box=' + t + '&fit=' + n) : e;
  };
}).filter('timthumb', [
  '$window',
  function (e) {
    var t;
    return t = e.devicePixelRatio || 1, function (e, n, r, i) {
      return null == (null != e ? e.replace : void 0) ? '' : (e = e.replace(/&/g, '%26').replace(/\?/g, '%3F'), n = (n || 0) * t, r = (r || 0) * t, 'http://goodmusic.madebymark.nl/1.1.5/api/image/timthumb.php?src=' + e + '&w=' + n + '&h=' + r + '&' + i);
    };
  }
]).filter('cssurl', [function () {
    return function (e) {
      return 'url(\'' + e + '\')';
    };
  }]).filter('cssloader', [function () {
    return function (e) {
      return 'url(\'' + e + '\'), url(window.BASE_URL + \'images/load-white.gif\')';
    };
  }]).filter('line', [function () {
    return function (e, t) {
      var n;
      return null == t && (t = 0), null != (null != e ? e.split : void 0) ? (n = e.split('\n'), t < n.length ? n[t] : '') : e;
    };
  }]).directive('autoFocus', [function () {
    return function (e, t, n) {
      var r;
      return r = function () {
        return $(t).focus();
      }, e.$watch(n.autoFocus, function (e) {
        return e ? setTimeout(r, 0) : void 0;
      });
    };
  }]).directive('autoSelect', [function () {
    return function (e, t) {
      var n;
      return n = function () {
        return $(t)[0].select();
      }, $(t).focus(function () {
        return setTimeout(n, 0);
      });
    };
  }]).directive('backgroundImage', [
  'cacheFilter',
  function (e) {
    var t;
    return t = 0, {
      link: function (n, r, i) {
        var o, a;
        return a = r.id || 'bgimg' + t++, r.attr('id', a), o = '#' + a, $(o).css({
          'background-image': 'url(window.BASE_URL + \'images/load-white.gif\')',
          'background-size': 'auto'
        }), n.$watch(i.waitFor, function (t) {
          var r, a, s, u, l;
          return t && (l = n.$eval(i.backgroundImage), r = n.$eval(i.cacheKey), s = n.$eval(i.cacheValue), a = e(l, r, s), $(o).css('background-image', 'url(\'' + a + '\')'), $(o).css('background-size', ''), l !== a) ? (u = new Image(), $(u).error(function () {
            return e(l, r, 'remove'), $(o).css('background-image', 'url(\'' + l + '\')');
          }), console.log('attempt to load cache src', a), u.src = a) : void 0;
        });
      }
    };
  }
]).filter('toArray', [function () {
    return function (e) {
      var t;
      return 'object' == typeof e ? (t = [], angular.forEach(e, function (e, n) {
        return '$' !== n[0] ? (e.$key = n, t.push(e)) : void 0;
      }), t) : e;
    };
  }]), function (e) {
  function t() {
  }
  function n(e, t) {
    return function () {
      e.apply(t, arguments);
    };
  }
  function r(e) {
    if ('object' != typeof this)
      throw new TypeError('Promises must be constructed via new');
    if ('function' != typeof e)
      throw new TypeError('not a function');
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], l(e, this);
  }
  function i(e, t) {
    for (; 3 === e._state;)
      e = e._value;
    return 0 === e._state ? (e._deferreds.push(t), void 0) : (e._handled = !0, r._immediateFn(function () {
      var n = 1 === e._state ? t.onFulfilled : t.onRejected;
      if (null === n)
        return (1 === e._state ? o : a)(t.promise, e._value), void 0;
      var r;
      try {
        r = n(e._value);
      } catch (i) {
        return a(t.promise, i), void 0;
      }
      o(t.promise, r);
    }), void 0);
  }
  function o(e, t) {
    try {
      if (t === e)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (t && ('object' == typeof t || 'function' == typeof t)) {
        var i = t.then;
        if (t instanceof r)
          return e._state = 3, e._value = t, s(e), void 0;
        if ('function' == typeof i)
          return l(n(i, t), e), void 0;
      }
      e._state = 1, e._value = t, s(e);
    } catch (o) {
      a(e, o);
    }
  }
  function a(e, t) {
    e._state = 2, e._value = t, s(e);
  }
  function s(e) {
    2 === e._state && 0 === e._deferreds.length && r._immediateFn(function () {
      e._handled || r._unhandledRejectionFn(e._value);
    });
    for (var t = 0, n = e._deferreds.length; n > t; t++)
      i(e, e._deferreds[t]);
    e._deferreds = null;
  }
  function u(e, t, n) {
    this.onFulfilled = 'function' == typeof e ? e : null, this.onRejected = 'function' == typeof t ? t : null, this.promise = n;
  }
  function l(e, t) {
    var n = !1;
    try {
      e(function (e) {
        n || (n = !0, o(t, e));
      }, function (e) {
        n || (n = !0, a(t, e));
      });
    } catch (r) {
      if (n)
        return;
      n = !0, a(t, r);
    }
  }
  var c = setTimeout;
  r.prototype['catch'] = function (e) {
    return this.then(null, e);
  }, r.prototype.then = function (e, n) {
    var r = new this.constructor(t);
    return i(this, new u(e, n, r)), r;
  }, r.all = function (e) {
    var t = Array.prototype.slice.call(e);
    return new r(function (e, n) {
      function r(o, a) {
        try {
          if (a && ('object' == typeof a || 'function' == typeof a)) {
            var s = a.then;
            if ('function' == typeof s)
              return s.call(a, function (e) {
                r(o, e);
              }, n), void 0;
          }
          t[o] = a, 0 === --i && e(t);
        } catch (u) {
          n(u);
        }
      }
      if (0 === t.length)
        return e([]);
      for (var i = t.length, o = 0; o < t.length; o++)
        r(o, t[o]);
    });
  }, r.resolve = function (e) {
    return e && 'object' == typeof e && e.constructor === r ? e : new r(function (t) {
      t(e);
    });
  }, r.reject = function (e) {
    return new r(function (t, n) {
      n(e);
    });
  }, r.race = function (e) {
    return new r(function (t, n) {
      for (var r = 0, i = e.length; i > r; r++)
        e[r].then(t, n);
    });
  }, r._immediateFn = 'function' == typeof setImmediate && function (e) {
    setImmediate(e);
  } || function (e) {
    c(e, 0);
  }, r._unhandledRejectionFn = function (e) {
    'undefined' != typeof console && console && console.warn('Possible Unhandled Promise Rejection:', e);
  }, r._setImmediateFn = function (e) {
    r._immediateFn = e;
  }, r._setUnhandledRejectionFn = function (e) {
    r._unhandledRejectionFn = e;
  }, 'undefined' != typeof module && module.exports ? module.exports = r : e.Promise || (e.Promise = r);
}(this);