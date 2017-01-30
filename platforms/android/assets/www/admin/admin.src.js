!function () {
  var e = function (t) {
    this.type = t || e.OPEN_URI, this.size = null, this.file = null;
  };
  if (e.OPEN_FILE = 1, e.OPEN_URI = 2, e.OPEN_LOCAL = 3, 'function' == typeof require)
    var t = require('fs');
  e.prototype.open = function (n, r) {
    this.file = n;
    var i = this;
    switch (this.type) {
    case e.OPEN_LOCAL:
      t.stat(this.file, function (e, n) {
        return e ? r(e) : (i.size = n.size, t.open(i.file, 'r', function (e, t) {
          return e ? r(e) : (i.fd = t, r(), void 0);
        }), void 0);
      });
      break;
    case e.OPEN_FILE:
      this.size = this.file.size, r();
      break;
    default:
      this.ajax({
        uri: this.file,
        type: 'HEAD'
      }, function (e, t, n) {
        return e ? r(e) : (i.size = parseInt(n.getResponseHeader('Content-Length')), r(), void 0);
      });
    }
  }, e.prototype.close = function () {
    this.type === e.OPEN_LOCAL && t.close(this.fd);
  }, e.prototype.read = function (t, n, r) {
    'function' == typeof n && (r = n, n = 0), this.type === e.OPEN_LOCAL ? this.readLocal(t, n, r) : this.type === e.OPEN_FILE ? this.readFile(t, n, r) : this.readUri(t, n, r);
  }, e.prototype.readBlob = function (e, t, n, r) {
    'function' == typeof t ? (r = t, t = 0) : 'function' == typeof n && (r = n, n = 'application/octet-stream'), this.read(e, t, function (e, t) {
      return e ? (r(e), void 0) : (r(null, new Blob([t], { type: n })), void 0);
    });
  }, e.prototype.readLocal = function (e, n, r) {
    var i = new Buffer(e);
    t.read(this.fd, i, 0, e, n, function (e, t, n) {
      if (e)
        return r(e);
      for (var i = new ArrayBuffer(n.length), o = new Uint8Array(i), a = 0; a < n.length; a++)
        o[a] = n[a];
      r(null, i);
    });
  }, e.prototype.ajax = function (e, t) {
    var n = {
        type: 'GET',
        uri: null,
        responseType: 'text'
      };
    'string' == typeof e && (e = { uri: e });
    for (var r in e)
      n[r] = e[r];
    var i = new XMLHttpRequest();
    i.onreadystatechange = function () {
      return 4 === i.readyState ? 200 !== i.status && 206 !== i.status ? t('Received non-200/206 response (' + i.status + ')') : (t(null, i.response, i), void 0) : void 0;
    }, i.responseType = n.responseType, i.open(n.type, n.uri, !0), n.range && (n.range = [].concat(n.range), 2 === n.range.length ? i.setRequestHeader('Range', 'bytes=' + n.range[0] + '-' + n.range[1]) : i.setRequestHeader('Range', 'bytes=' + n.range[0])), i.send();
  }, e.prototype.readUri = function (e, t, n) {
    this.ajax({
      uri: this.file,
      type: 'GET',
      responseType: 'arraybuffer',
      range: [
        t,
        t + e - 1
      ]
    }, function (e, t) {
      return e ? n(e) : n(null, t);
    });
  }, e.prototype.readFile = function (e, t, n) {
    var r = this.file.slice(t, t + e), i = new FileReader();
    i.onload = function (e) {
      n(null, e.target.result);
    }, i.onerror = function () {
      n('File read failed');
    }, i.readAsArrayBuffer(r);
  }, DataView.prototype.getString = function (e, t, n) {
    t = t || 0, e = e || this.byteLength - t, 0 > e && (e += this.byteLength);
    var r = '';
    if ('undefined' != typeof Buffer) {
      for (var i = [], o = t; t + e > o; o++)
        i.push(this.getUint8(o));
      return new Buffer(i).toString();
    }
    for (var o = t; t + e > o; o++)
      r += String.fromCharCode(this.getUint8(o));
    return n ? r : decodeURIComponent(escape(r));
  }, DataView.prototype.getStringUtf16 = function (e, t, n) {
    t = t || 0, e = e || this.byteLength - t;
    var r = !1, i = '', o = !1;
    if ('undefined' != typeof Buffer && (i = [], o = !0), 0 > e && (e += this.byteLength), n) {
      var a = this.getUint16(t);
      65534 === a && (r = !0), t += 2, e -= 2;
    }
    for (var s = t; t + e > s; s += 2) {
      var u = this.getUint16(s, r);
      u >= 0 && 55295 >= u || u >= 57344 && 65535 >= u ? o ? i.push(u) : i += String.fromCharCode(u) : u >= 65536 && 1114111 >= u && (u -= 65536, o ? (i.push(((1047552 & u) >> 10) + 55296), i.push((1023 & u) + 56320)) : i += String.fromCharCode(((1047552 & u) >> 10) + 55296) + String.fromCharCode((1023 & u) + 56320));
    }
    return o ? new Buffer(i).toString() : decodeURIComponent(escape(i));
  }, DataView.prototype.getSynch = function (e) {
    for (var t = 0, n = 2130706432; n;)
      t >>= 1, t |= e & n, n >>= 8;
    return t;
  }, DataView.prototype.getUint8Synch = function (e) {
    return this.getSynch(this.getUint8(e));
  }, DataView.prototype.getUint32Synch = function (e) {
    return this.getSynch(this.getUint32(e));
  }, DataView.prototype.getUint24 = function (e, t) {
    return t ? this.getUint8(e) + (this.getUint8(e + 1) << 8) + (this.getUint8(e + 2) << 16) : this.getUint8(e + 2) + (this.getUint8(e + 1) << 8) + (this.getUint8(e) << 16);
  };
  var n = function (t, r) {
    var i = { type: n.OPEN_URI };
    'string' == typeof t ? t = {
      file: t,
      type: n.OPEN_URI
    } : 'undefined' != typeof window && window.File && t instanceof window.File && (t = {
      file: t,
      type: n.OPEN_FILE
    });
    for (var o in t)
      i[o] = t[o];
    if (!i.file)
      return r('No file was set');
    if (i.type === n.OPEN_FILE) {
      if ('undefined' == typeof window || !window.File || !window.FileReader || 'undefined' == typeof ArrayBuffer)
        return r('Browser does not have support for the File API and/or ArrayBuffers');
    } else if (i.type === n.OPEN_LOCAL && 'function' != typeof require)
      return r('Local paths may not be read within a browser');
    var a = [
        'Blues',
        'Classic Rock',
        'Country',
        'Dance',
        'Disco',
        'Funk',
        'Grunge',
        'Hip-Hop',
        'Jazz',
        'Metal',
        'New Age',
        'Oldies',
        'Other',
        'Pop',
        'R&B',
        'Rap',
        'Reggae',
        'Rock',
        'Techno',
        'Industrial',
        'Alternative',
        'Ska',
        'Death Metal',
        'Pranks',
        'Soundtrack',
        'Euro-Techno',
        'Ambient',
        'Trip-Hop',
        'Vocal',
        'Jazz+Funk',
        'Fusion',
        'Trance',
        'Classical',
        'Instrumental',
        'Acid',
        'House',
        'Game',
        'Sound Clip',
        'Gospel',
        'Noise',
        'AlternRock',
        'Bass',
        'Soul',
        'Punk',
        'Space',
        'Meditative',
        'Instrumental Pop',
        'Instrumental Rock',
        'Ethnic',
        'Gothic',
        'Darkwave',
        'Techno-Industrial',
        'Electronic',
        'Pop-Folk',
        'Eurodance',
        'Dream',
        'Southern Rock',
        'Comedy',
        'Cult',
        'Gangsta Rap',
        'Top 40',
        'Christian Rap',
        'Pop / Funk',
        'Jungle',
        'Native American',
        'Cabaret',
        'New Wave',
        'Psychedelic',
        'Rave',
        'Showtunes',
        'Trailer',
        'Lo-Fi',
        'Tribal',
        'Acid Punk',
        'Acid Jazz',
        'Polka',
        'Retro',
        'Musical',
        'Rock & Roll',
        'Hard Rock',
        'Folk',
        'Folk-Rock',
        'National Folk',
        'Swing',
        'Fast  Fusion',
        'Bebob',
        'Latin',
        'Revival',
        'Celtic',
        'Bluegrass',
        'Avantgarde',
        'Gothic Rock',
        'Progressive Rock',
        'Psychedelic Rock',
        'Symphonic Rock',
        'Slow Rock',
        'Big Band',
        'Chorus',
        'Easy Listening',
        'Acoustic',
        'Humour',
        'Speech',
        'Chanson',
        'Opera',
        'Chamber Music',
        'Sonata',
        'Symphony',
        'Booty Bass',
        'Primus',
        'Porn Groove',
        'Satire',
        'Slow Jam',
        'Club',
        'Tango',
        'Samba',
        'Folklore',
        'Ballad',
        'Power Ballad',
        'Rhythmic Soul',
        'Freestyle',
        'Duet',
        'Punk Rock',
        'Drum Solo',
        'A Cappella',
        'Euro-House',
        'Dance Hall',
        'Goa',
        'Drum & Bass',
        'Club-House',
        'Hardcore',
        'Terror',
        'Indie',
        'BritPop',
        'Negerpunk',
        'Polsk Punk',
        'Beat',
        'Christian Gangsta Rap',
        'Heavy Metal',
        'Black Metal',
        'Crossover',
        'Contemporary Christian',
        'Christian Rock',
        'Merengue',
        'Salsa',
        'Thrash Metal',
        'Anime',
        'JPop',
        'Synthpop',
        'Rock/Pop'
      ], s = {};
    s.types = {
      TALB: 'album',
      TBPM: 'bpm',
      TCOM: 'composer',
      TCON: 'genre',
      TCOP: 'copyright',
      TDEN: 'encoding-time',
      TDLY: 'playlist-delay',
      TDOR: 'original-release-time',
      TDRC: 'recording-time',
      TDRL: 'release-time',
      TDTG: 'tagging-time',
      TENC: 'encoder',
      TEXT: 'writer',
      TFLT: 'file-type',
      TIPL: 'involved-people',
      TIT1: 'content-group',
      TIT2: 'title',
      TIT3: 'subtitle',
      TKEY: 'initial-key',
      TLAN: 'language',
      TLEN: 'length',
      TMCL: 'credits',
      TMED: 'media-type',
      TMOO: 'mood',
      TOAL: 'original-album',
      TOFN: 'original-filename',
      TOLY: 'original-writer',
      TOPE: 'original-artist',
      TOWN: 'owner',
      TPE1: 'artist',
      TPE2: 'band',
      TPE3: 'conductor',
      TPE4: 'remixer',
      TPOS: 'set-part',
      TPRO: 'produced-notice',
      TPUB: 'publisher',
      TRCK: 'track',
      TRSN: 'radio-name',
      TRSO: 'radio-owner',
      TSOA: 'album-sort',
      TSOP: 'performer-sort',
      TSOT: 'title-sort',
      TSRC: 'isrc',
      TSSE: 'encoder-settings',
      TSST: 'set-subtitle',
      TAL: 'album',
      TBP: 'bpm',
      TCM: 'composer',
      TCO: 'genre',
      TCR: 'copyright',
      TDY: 'playlist-delay',
      TEN: 'encoder',
      TFT: 'file-type',
      TKE: 'initial-key',
      TLA: 'language',
      TLE: 'length',
      TMT: 'media-type',
      TOA: 'original-artist',
      TOF: 'original-filename',
      TOL: 'original-writer',
      TOT: 'original-album',
      TP1: 'artist',
      TP2: 'band',
      TP3: 'conductor',
      TP4: 'remixer',
      TPA: 'set-part',
      TPB: 'publisher',
      TRC: 'isrc',
      TRK: 'track',
      TSS: 'encoder-settings',
      TT1: 'content-group',
      TT2: 'title',
      TT3: 'subtitle',
      TXT: 'writer',
      WCOM: 'url-commercial',
      WCOP: 'url-legal',
      WOAF: 'url-file',
      WOAR: 'url-artist',
      WOAS: 'url-source',
      WORS: 'url-radio',
      WPAY: 'url-payment',
      WPUB: 'url-publisher',
      WAF: 'url-file',
      WAR: 'url-artist',
      WAS: 'url-source',
      WCM: 'url-commercial',
      WCP: 'url-copyright',
      WPB: 'url-publisher',
      COMM: 'comments',
      APIC: 'image',
      PIC: 'image'
    }, s.imageTypes = [
      'other',
      'file-icon',
      'icon',
      'cover-front',
      'cover-back',
      'leaflet',
      'media',
      'artist-lead',
      'artist',
      'conductor',
      'band',
      'composer',
      'writer',
      'location',
      'during-recording',
      'during-performance',
      'screen',
      'fish',
      'illustration',
      'logo-band',
      'logo-publisher'
    ], s.parse = function (e, t, n) {
      n = n || 0, t = t || 4;
      var r = {
          tag: null,
          value: null
        }, i = new DataView(e);
      if (3 > t)
        return s.parseLegacy(e);
      var o = {
          id: i.getString(4),
          type: i.getString(1),
          size: i.getUint32Synch(4),
          flags: [
            i.getUint8(8),
            i.getUint8(9)
          ]
        };
      if (0 !== o.flags[1])
        return !1;
      if (!o.id in s.types)
        return !1;
      if (r.tag = s.types[o.id], 'T' === o.type) {
        var u = i.getUint8(10);
        if (0 === u || 3 === u)
          r.value = i.getString(-11, 11);
        else if (1 === u)
          r.value = i.getStringUtf16(-11, 11, !0);
        else {
          if (2 !== u)
            return !1;
          r.value = i.getStringUtf16(-11, 11);
        }
        'TCON' === o.id && parseInt(r.value) && (r.value = a[parseInt(r.value)]);
      } else if ('W' === o.type)
        r.value = i.getString(-10, 10);
      else if ('COMM' === o.id) {
        for (var u = i.getUint8(10), l = 14, c = 0, d = l;; d++)
          if (1 === u || 2 === u) {
            if (0 === i.getUint16(d)) {
              l = d + 2;
              break;
            }
            d++;
          } else if (0 === i.getUint8(d)) {
            l = d + 1;
            break;
          }
        if (0 === u || 3 === u)
          r.value = i.getString(-1 * l, l);
        else if (1 === u)
          r.value = i.getStringUtf16(-1 * l, l, !0);
        else {
          if (2 !== u)
            return !1;
          r.value = i.getStringUtf16(-1 * l, l);
        }
      } else if ('APIC' === o.id) {
        for (var u = i.getUint8(10), f = {
              type: null,
              mime: null,
              description: null,
              data: null
            }, l = 11, c = 0, d = l;; d++)
          if (0 === i.getUint8(d)) {
            c = d - l;
            break;
          }
        f.mime = i.getString(c, l), f.type = s.imageTypes[i.getUint8(l + c + 1)] || 'other', l += c + 2, c = 0;
        for (var d = l;; d++)
          if (0 === i.getUint8(d)) {
            c = d - l;
            break;
          }
        f.description = 0 === c ? null : i.getString(c, l), f.data = e.slice(l + 1), r.value = f;
      }
      return r.tag ? r : !1;
    }, s.parseLegacy = function (e) {
      var t = {
          tag: null,
          value: null
        }, n = new DataView(e), r = {
          id: n.getString(3),
          type: n.getString(1),
          size: n.getUint24(3)
        };
      if (!r.id in s.types)
        return !1;
      if (t.tag = s.types[r.id], 'T' === r.type)
        n.getUint8(7), t.value = n.getString(-7, 7), 'TCO' === r.id && parseInt(t.value) && (t.value = a[parseInt(t.value)]);
      else if ('W' === r.type)
        t.value = n.getString(-7, 7);
      else if ('COM' === r.id)
        n.getUint8(6), t.value = n.getString(-10, 10), -1 !== t.value.indexOf('\0') && (t.value = t.value.substr(t.value.indexOf('\0') + 1));
      else if ('PIC' === r.id) {
        var i = (n.getUint8(6), {
            type: null,
            mime: 'image/' + n.getString(3, 7).toLowerCase(),
            description: null,
            data: null
          });
        i.type = s.imageTypes[n.getUint8(11)] || 'other';
        for (var o = 11, u = 0, l = o;; l++)
          if (0 === n.getUint8(l)) {
            u = l - o;
            break;
          }
        i.description = 0 === u ? null : n.getString(u, o), i.data = e.slice(o + 1), t.value = i;
      }
      return t.tag ? t : !1;
    };
    var u = {};
    u.parse = function (e, t) {
      var n = {
          title: null,
          album: null,
          artist: null,
          year: null,
          v1: {
            title: null,
            artist: null,
            album: null,
            year: null,
            comment: null,
            track: null,
            version: 1
          },
          v2: {
            version: [
              null,
              null
            ]
          }
        }, r = {
          v1: !1,
          v2: !1
        }, i = function (e) {
          r.v1 && r.v2 && (n.title = n.v2.title || n.v1.title, n.album = n.v2.album || n.v1.album, n.artist = n.v2.artist || n.v1.artist, n.year = n.v1.year, t(e, n));
        };
      e.read(128, e.size - 128, function (e, t) {
        if (e)
          return i('Could not read file');
        var o = new DataView(t);
        return 128 !== t.byteLength || 'TAG' !== o.getString(3, null, !0) ? (r.v1 = !0, i()) : (n.v1.title = o.getString(30, 3).replace(/(^\s+|\s+$)/, '') || null, n.v1.artist = o.getString(30, 33).replace(/(^\s+|\s+$)/, '') || null, n.v1.album = o.getString(30, 63).replace(/(^\s+|\s+$)/, '') || null, n.v1.year = o.getString(4, 93).replace(/(^\s+|\s+$)/, '') || null, 0 === o.getUint8(125) ? (n.v1.comment = o.getString(28, 97).replace(/(^\s+|\s+$)/, ''), n.v1.version = 1.1, n.v1.track = o.getUint8(126)) : n.v1.comment = o.getString(30, 97).replace(/(^\s+|\s+$)/, ''), n.v1.genre = a[o.getUint8(127)] || null, r.v1 = !0, i(), void 0);
      }), e.read(14, 0, function (t, o) {
        if (t)
          return i('Could not read file');
        var a, u = new DataView(o), l = 10, c = 0;
        return 14 !== o.byteLength || 'ID3' !== u.getString(3, null, !0) || u.getUint8(3) > 4 ? (r.v2 = !0, i()) : (n.v2.version = [
          u.getUint8(3),
          u.getUint8(4)
        ], a = u.getUint8(5), 0 !== (128 & a) ? (r.v2 = !0, i()) : (0 !== (64 & a) && (l += u.getUint32Synch(11)), c += u.getUint32Synch(6), e.read(c, l, function (e, t) {
          if (e)
            return r.v2 = !0, i();
          for (var o = new DataView(t), a = 0; a < t.byteLength;) {
            for (var u, l, c, d = !0, f = 0; 3 > f; f++)
              c = o.getUint8(a + f), (65 > c || c > 90) && (48 > c || c > 57) && (d = !1);
            if (!d)
              break;
            l = n.v2.version[0] < 3 ? t.slice(a, a + 6 + o.getUint24(a + 3)) : t.slice(a, a + 10 + o.getUint32Synch(a + 4)), u = s.parse(l, n.v2.version[0]), u && (n.v2[u.tag] = u.value), a += l.byteLength;
          }
          r.v2 = !0, i();
        }), void 0));
      });
    };
    var l = new e(i.type);
    l.open(i.file, function (e) {
      return e ? r('Could not open specified file') : (u.parse(l, function (e, t) {
        r(e, t), l.close();
      }), void 0);
    });
  };
  n.OPEN_FILE = e.OPEN_FILE, n.OPEN_URI = e.OPEN_URI, n.OPEN_LOCAL = e.OPEN_LOCAL, 'undefined' != typeof module && module.exports ? module.exports = n : 'function' == typeof define && define.amd ? define('id3', [], function () {
    return n;
  }) : window.id3 = n;
}(), angular.module('firebase-auth', [
  'ui.router',
  'ui.keypress'
]).value('auth-config', {
  url: 'https://goodmusic.firebaseio.com/1-0-0/',
  home: 'home',
  login: 'login',
  init: 'init'
}).factory('auth', [
  'auth-config',
  '$firebaseAuth',
  '$rootScope',
  '$state',
  function (e, t, n, r) {
    var i, o;
    return o = new Firebase(e.url), i = t(o), n.loggedIn = i.loggedIn = !1, window.state = r, null != localStorage.getItem('firebaseSession') ? r.go(e.init) : r.go(e.login), n.$on('$firebaseAuth:login', function () {
      var t;
      return i.loggedIn = n.loggedIn = !0, (t = r.current.name) === e.login || t === e.init ? r.go(e.home) : void 0;
    }), n.$on('$firebaseAuth:logout', function () {
      return i.loggedIn = n.loggedIn = !1, r.current.name !== e.login ? r.go(e.login) : void 0;
    }), n.$on('$stateChangeStart', function (t, i) {
      var o;
      return n.loggedIn || (o = !i.name) !== e.login && o !== e.init || (t.preventDefault(), r.go(e.login)), n.loggedIn && i.name === e.login ? (t.preventDefault(), r.go(e.home)) : void 0;
    }), window.auth = i;
  }
]).controller('LoginCtrl', [
  '$scope',
  '$http',
  '$state',
  'auth-config',
  'auth',
  function (e, t, n, r, i) {
    return e.init = function () {
      return n.current.name === r.init;
    }, e.login = function (t, n) {
      return e.busy = !0, e.error = null, i.$login('password', {
        email: t,
        password: n
      })['catch'](function (t) {
        return e.busy = !1, e.error = t;
      });
    };
  }
]), angular.module('dropbox', []).value('dropbox-config', {
  sucess: function () {
  },
  cancel: function () {
  },
  linkType: 'preview',
  convertToDirect: !0,
  multiselect: !1
}).directive('dropboxChoose', [
  '$parse',
  'dropbox-config',
  function (e, t) {
    return {
      restrict: 'AC',
      scope: !0,
      link: function (n, r, i) {
        var o, a, s;
        return a = e(i.dropboxChoose), o = null != (s = i.dropboxExt) ? s.split('|') : void 0, n.dropbox = function (e) {
          var r;
          return r = {
            success: function (e) {
              var r, i, o;
              for (i = 0, o = e.length; o > i; i++)
                r = e[i], t.convertToDirect && (r.link = r.link.replace('www.dropbox', 'dl.dropboxusercontent'), r.time = new Date().getTime());
              return n.$apply(function () {
                return 'function' == typeof a.assign ? a.assign(n, e[0]) : void 0;
              });
            }
          }, console.log('ext', o), o && (r.extensions = o), e = angular.extend({}, t, r, e), Dropbox.choose(e);
        };
      }
    };
  }
]);