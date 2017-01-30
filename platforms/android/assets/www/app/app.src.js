function initPushwoosh() {
  var e = cordova.require('pushwoosh-cordova-plugin.PushNotification'), t = localStorage.PUSH_DEV ? '6073F-8EF0D' : 'FC27D-FD9F6';
  e.onDeviceReady({
    alert: !0,
    badge: !0,
    sound: !0,
    appid: t,
    pw_appid: t,
    appname: 'Good Music App',
    projectid: '337146349308'
  }), e.registerDevice(function (e) {
    console.log('registerDevice: ' + JSON.stringify(e));
  }, function (e) {
    console.log('failed to register : ' + JSON.stringify(e));
  }), e.setApplicationIconBadgeNumber(0), document.addEventListener('push-notification', function (t) {
    var o = t.notification;
    if (console.log('received push', JSON.stringify(o)), navigator.notification && navigator.notification.alert) {
      var n = o.aps ? o.aps.alert : o.title;
      navigator.notification.alert(n, function () {
      }, 'Push notification');
    }
    e.setApplicationIconBadgeNumber(0);
  }), document.addEventListener('resume', function () {
    e.setApplicationIconBadgeNumber(0);
  }, !1);
}
!function (e) {
  function t(n) {
    if (o[n])
      return o[n].exports;
    var r = o[n] = {
        exports: {},
        id: n,
        loaded: !1
      };
    return e[n].call(r.exports, r, r.exports, t), r.loaded = !0, r.exports;
  }
  var o = {};
  return t.m = e, t.c = o, t.p = '', t(0);
}([
  function (e, t, o) {
    window.CordovaAppLoader = o(1), window.CordovaFileCache = o(2), window.CordovaPromiseFS = o(4), window.Promise = o(5), window.setImmediate = window.setTimeout;
  },
  function (e, t, o) {
    function n(e) {
      var t = Object.keys(e);
      t.sort();
      var o = '';
      return t.forEach(function (t) {
        e[t] && e[t].version, o += '@' + e[t].version;
      }), i.hash(o) + '';
    }
    function r(e) {
      if (!e)
        throw new Error('CordovaAppLoader has no options!');
      if (!e.fs)
        throw new Error('CordovaAppLoader has no "fs" option (cordova-promise-fs)');
      if (!e.serverRoot)
        throw new Error('CordovaAppLoader has no "serverRoot" option.');
      if (!window.pegasus || !window.Manifest)
        throw new Error('CordovaAppLoader bootstrap.js is missing.');
      this.allowServerRootFromManifest = e.allowServerRootFromManifest === !0, a = e.fs.Promise, this.manifest = window.Manifest, this.newManifest = null, this.bundledManifest = null, this.preventAutoUpdateLoop = e.preventAutoUpdateLoop === !0, this._lastUpdateFiles = localStorage.getItem('last_update_files'), 1 * localStorage.getItem('last_update_time'), Date.now() - this._lastUpdateTime > 60000 && (this.preventAutoUpdateLoop = !1), e.serverRoot = e.serverRoot || '', e.serverRoot && '/' !== e.serverRoot[e.serverRoot.length - 1] && (e.serverRoot += '/'), this.newManifestUrl = e.manifestUrl || e.serverRoot + (e.manifest || 'manifest.json'), e.mode && (e.mode = 'mirror'), this.cache = new i(e), this.corruptNewManifest = !1, this._toBeCopied = [], this._toBeDeleted = [], this._toBeDownloaded = [], this._updateReady = !1, this._checkTimeout = e.checkTimeout || 10000;
    }
    var i = o(2);
    o(4);
    var a = null, c = location.href.replace(location.hash, '');
    c = c.substr(0, c.lastIndexOf('/') + 1), /ip(hone|ad|od)/i.test(navigator.userAgent) && (c = location.pathname.substr(location.pathname.indexOf('/www/')), c = c.substr(0, c.lastIndexOf('/') + 1), c = 'cdvfile://localhost/bundle' + c), r.prototype._createFilemap = function (e) {
      var t = {}, o = this.cache._fs.normalize;
      return Object.keys(e || []).forEach(function (n) {
        e[n].filename = o(e[n].filename), t[e[n].filename] = e[n];
      }), t;
    }, r.prototype.copyFromBundle = function (e) {
      var t = c + e;
      return this.cache._fs.download(t, this.cache.localRoot + e);
    }, r.prototype.getBundledManifest = function () {
      var e = this, t = document.querySelector('script[manifest]'), o = (t ? t.getAttribute('manifest') : null) || 'manifest.json';
      return new a(function (t, n) {
        e.bundledManifest ? t(e.bundledManifest) : (pegasus(o).then(function (o) {
          e.bundledManifest = o, t(o);
        }, n), setTimeout(function () {
          n(new Error('bundled manifest timeout'));
        }, e._checkTimeout));
      });
    }, r.prototype.check = function (e) {
      var t = this, o = this.manifest;
      'string' == typeof e && (t.newManifestUrl = e, e = void 0);
      var r = new a(function (o, n) {
          if ('object' == typeof e)
            o(e);
          else {
            var r = t.cache._cacheBuster ? t.newManifestUrl + '?' + Date.now() : t.newManifestUrl;
            pegasus(r).then(o, n), setTimeout(function () {
              n(new Error('new manifest timeout'));
            }, t._checkTimeout);
          }
        });
      return new a(function (e, i) {
        a.all([
          r,
          t.getBundledManifest(),
          t.cache.list()
        ]).then(function (r) {
          var a = r[0], c = r[1], s = n(a.files);
          if (t.preventAutoUpdateLoop === !0 && s === t._lastUpdateFiles) {
            var l = n(Manifest.files);
            return t._lastUpdateFiles !== l && (console.warn('New manifest available, but an earlier update attempt failed. Will not download.'), t.corruptNewManifest = !0, e(null)), e(!1), void 0;
          }
          if (!a.files)
            return i(new Error('Downloaded Manifest has no "files" attribute.')), void 0;
          var u = r[2], d = t._createFilemap(o.files), s = t._createFilemap(a.files), f = t._createFilemap(c.files);
          t._toBeDownloaded = [], t._toBeCopied = [], t._toBeDeleted = [];
          var p = t.cache._fs.isCordova, h = 0;
          Object.keys(s).filter(function (e) {
            return !d[e] || d[e].version !== s[e].version || !t.cache.isCached(e);
          }).forEach(function (e) {
            p && f[e] && f[e].version === s[e].version ? t._toBeCopied.push(e) : t._toBeDownloaded.push(e), f[e] && f[e].version === s[e].version || h++;
          }), t._toBeDeleted = u.map(function (e) {
            return e.substr(t.cache.localRoot.length);
          }).filter(function (e) {
            return !s[e] || t._toBeDownloaded.indexOf(e) >= 0 || t._toBeCopied.indexOf(e) >= 0;
          }), h += t._toBeDeleted.length, h > 0 ? (t.newManifest = a, t.newManifest.root = t.cache.localUrl, e(!0)) : e(!1);
        }, function (e) {
          i(e);
        });
      });
    }, r.prototype.canDownload = function () {
      return !!this.newManifest && !this._updateReady;
    }, r.prototype.canUpdate = function () {
      return this._updateReady;
    }, r.prototype.download = function (e, t) {
      var o = this;
      return o.canDownload() ? (localStorage.removeItem('manifest'), this.manifest.files = Manifest.files = {}, o.cache.remove(o._toBeDeleted, !0).then(function () {
        return a.all(o._toBeCopied.map(function (e) {
          return o.cache._fs.download(c + e, o.cache.localRoot + e);
        }));
      }).then(function () {
        return o.allowServerRootFromManifest && o.newManifest.serverRoot && (o.cache.serverRoot = o.newManifest.serverRoot), o.cache.add(o._toBeDownloaded), o.cache.download(e, t);
      }).then(function () {
        return o._toBeDeleted = [], o._toBeDownloaded = [], o._updateReady = !0, o.newManifest;
      })) : new a(function (e) {
        e(null);
      });
    }, r.prototype.update = function (e) {
      return this._updateReady ? (localStorage.setItem('manifest', JSON.stringify(this.newManifest)), localStorage.setItem('last_update_files', n(this.newManifest.files)), localStorage.setItem('last_update_time', Date.now()), e !== !1 && location.reload(), !0) : !1;
    }, r.prototype.clear = function () {
      return localStorage.removeItem('last_update_files'), localStorage.removeItem('manifest'), this.cache.clear();
    }, r.prototype.reset = function () {
      return this.clear().then(function () {
        location.reload();
      }, function () {
        location.reload();
      });
    }, e.exports = r;
  },
  function (e, t, o) {
    function n(e) {
      var t = this;
      if (this._fs = e.fs, !this._fs)
        throw new Error('Missing required option "fs". Add an instance of cordova-promise-fs.');
      i = this._fs.Promise, this._mirrorMode = 'hash' !== e.mode, this._retry = e.retry || [
        500,
        1500,
        8000
      ], this._cacheBuster = !!e.cacheBuster, this.localRoot = this._fs.normalize(e.localRoot || 'data'), this.serverRoot = this._fs.normalize(e.serverRoot || ''), this._downloading = [], this._added = [], this._cached = {}, this.ready = this._fs.ensure(this.localRoot).then(function (e) {
        return t.localInternalURL = e.toInternalURL ? e.toInternalURL() : e.toURL(), t.localUrl = e.toURL(), t.list();
      });
    }
    var r = o(3), i = null;
    n.hash = r, n.prototype.list = function () {
      var e = this;
      return new i(function (t) {
        e._fs.list(e.localRoot, 'rfe').then(function (o) {
          e._cached = {}, o = o.map(function (t) {
            var o = e._fs.normalize(t.fullPath);
            return e._cached[o] = {
              toInternalURL: t.toInternalURL ? t.toInternalURL() : t.toURL(),
              toURL: t.toURL()
            }, o;
          }), t(o);
        }, function () {
          t([]);
        });
      });
    }, n.prototype.add = function (e) {
      e || (e = []), 'string' == typeof e && (e = [e]);
      var t = this;
      return e.forEach(function (e) {
        e = t.toServerURL(e), -1 === t._added.indexOf(e) && t._added.push(e);
      }), t.isDirty();
    }, n.prototype.remove = function (e, t) {
      e || (e = []);
      var o = [];
      'string' == typeof e && (e = [e]);
      var n = this;
      return e.forEach(function (e) {
        var t = n._added.indexOf(n.toServerURL(e));
        t >= 0 && n._added.splice(t, 1);
        var r = n.toPath(e);
        o.push(n._fs.remove(r)), delete n._cached[r];
      }), t ? i.all(o) : n.isDirty();
    }, n.prototype.getDownloadQueue = function () {
      var e = this, t = e._added.filter(function (t) {
          return !e.isCached(t);
        });
      return t;
    }, n.prototype.getAdded = function () {
      return this._added;
    }, n.prototype.isDirty = function () {
      return this.getDownloadQueue().length > 0;
    }, n.prototype.download = function (e, t) {
      var o = this._fs, n = this;
      return t = t || !1, n.abort(), new i(function (r, i) {
        o.ensure(n.localRoot).then(function () {
          return n.list();
        }).then(function () {
          if (!n.isDirty())
            return r(n), void 0;
          var a = n.getDownloadQueue(), c = n._downloading.length, s = n._downloading.length + a.length, l = 0, u = [];
          a.forEach(function (a) {
            var d = n.toPath(a);
            console.log(a, d);
            var f;
            'function' == typeof e && (f = function (t) {
              t.queueIndex = c, t.queueSize = s, t.url = a, t.path = d, t.percentage = c / s, t.loaded > 0 && t.total > 0 && c !== s && (t.percentage += t.loaded / t.total / s), t.percentage = Math.max(l, t.percentage), l = t.percentage, e(t);
            });
            var p = function () {
                c++, f && f(new ProgressEvent()), c === s && (n._downloading = [], n.list().then(function () {
                  f && f(new ProgressEvent()), n.isDirty() ? i(u) : r(n);
                }, i));
              }, h = function (e) {
                e && e.target && e.target.error && (e = e.target.error), u.push(e), p();
              }, v = a;
            n._cacheBuster && (v += '?' + Date.now());
            var m = o.download(v, d, { retry: n._retry }, t ? f : void 0);
            m.then(p, h), n._downloading.push(m);
          });
        }, i);
      });
    }, n.prototype.abort = function () {
      this._downloading.forEach(function (e) {
        e.abort();
      }), this._downloading = [];
    }, n.prototype.isCached = function (e) {
      return e = this.toPath(e), !!this._cached[e];
    }, n.prototype.clear = function () {
      var e = this;
      return this._cached = {}, this._fs.removeDir(this.localRoot).then(function () {
        return e._fs.ensure(e.localRoot);
      });
    }, n.prototype.toInternalURL = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toInternalURL : e;
    }, n.prototype.get = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toURL : this.toServerURL(e);
    }, n.prototype.toDataURL = function (e) {
      return this._fs.toDataURL(this.toPath(e));
    }, n.prototype.toURL = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toURL : e;
    }, n.prototype.toServerURL = function (e) {
      var e = this._fs.normalize(e);
      return e.indexOf('://') < 0 ? this.serverRoot + e : e;
    }, n.prototype.toPath = function (e) {
      if (this._mirrorMode) {
        var t = e.indexOf('?');
        t > -1 && (e = e.substr(0, t)), e = this._fs.normalize(e || '');
        var o = this.serverRoot.length;
        return e.substr(0, o) !== this.serverRoot ? this.localRoot + e : this.localRoot + e.substr(o);
      }
      var n = e.match(/\.[a-z]{1,}/g);
      return n = n ? n[n.length - 1] : '.txt', this.localRoot + r(e) + n;
    }, e.exports = n;
  },
  function (e) {
    function t(e, t) {
      var o, n, r, i, a, c, s, l;
      for (o = 3 & e.length, n = e.length - o, r = t, a = 3432918353, c = 461845907, l = 0; n > l;)
        s = 255 & e.charCodeAt(l) | (255 & e.charCodeAt(++l)) << 8 | (255 & e.charCodeAt(++l)) << 16 | (255 & e.charCodeAt(++l)) << 24, ++l, s = 4294967295 & (65535 & s) * a + ((65535 & (s >>> 16) * a) << 16), s = s << 15 | s >>> 17, s = 4294967295 & (65535 & s) * c + ((65535 & (s >>> 16) * c) << 16), r ^= s, r = r << 13 | r >>> 19, i = 4294967295 & 5 * (65535 & r) + ((65535 & 5 * (r >>> 16)) << 16), r = (65535 & i) + 27492 + ((65535 & (i >>> 16) + 58964) << 16);
      switch (s = 0, o) {
      case 3:
        s ^= (255 & e.charCodeAt(l + 2)) << 16;
      case 2:
        s ^= (255 & e.charCodeAt(l + 1)) << 8;
      case 1:
        s ^= 255 & e.charCodeAt(l), s = 4294967295 & (65535 & s) * a + ((65535 & (s >>> 16) * a) << 16), s = s << 15 | s >>> 17, s = 4294967295 & (65535 & s) * c + ((65535 & (s >>> 16) * c) << 16), r ^= s;
      }
      return r ^= e.length, r ^= r >>> 16, r = 4294967295 & 2246822507 * (65535 & r) + ((65535 & 2246822507 * (r >>> 16)) << 16), r ^= r >>> 13, r = 4294967295 & 3266489909 * (65535 & r) + ((65535 & 3266489909 * (r >>> 16)) << 16), r ^= r >>> 16, r >>> 0;
    }
    e.exports = t;
  },
  function (e) {
    function t(e, o, n, r) {
      e.getDirectory(o[0], { create: !0 }, function (e) {
        o.length > 1 ? t(e, o.slice(1), n, r) : n(e);
      }, r);
    }
    function o(e) {
      return e = e.substr(0, e.lastIndexOf('/') + 1), '/' === e[0] && (e = e.substr(1)), e;
    }
    function n(e) {
      return e.substr(e.lastIndexOf('/') + 1);
    }
    function r(e) {
      e = e || '', '/' === e[0] && (e = e.substr(1));
      for (var t = e.split('/'), o = t[0], n = 1; n < t.length; n++)
        o = t[n], '..' === t[n] ? (t.splice(n - 1, 2), n -= 2) : '.' === t[n] && (t.splice(n, 1), n--);
      return e = t.join('/'), './' === e ? e = '' : o && o.indexOf('.') < 0 && '/' != e[e.length - 1] && (e += '/'), e;
    }
    var i = [], a = 0;
    e.exports = function (e) {
      function c(e) {
        return new A(function (t) {
          return t(e);
        });
      }
      function s(e) {
        return new A(function (o, n) {
          return E.then(function (r) {
            e ? (e = e.split('/').filter(function (e) {
              return e && e.length > 0 && '.' !== e && '..' !== e;
            }), t(r.root, e, o, n)) : o(r.root);
          }, n);
        });
      }
      function l(e, t) {
        return new A(function (o, n) {
          return 'object' == typeof e ? o(e) : (e = r(e), t = t || {}, E.then(function (r) {
            r.root.getFile(e, t, o, n);
          }, n));
        });
      }
      function u(e, t) {
        return e = r(e), t = t || {}, new A(function (o, n) {
          return E.then(function (r) {
            e && '/' !== e ? r.root.getDirectory(e, t, o, n) : o(r.root);
          }, n);
        });
      }
      function d(e, t) {
        t = t || '';
        var o = t.indexOf('r') > -1, n = t.indexOf('e') > -1, r = t.indexOf('f') > -1, i = t.indexOf('d') > -1;
        return r && i && (r = !1, i = !1), new A(function (t, a) {
          return u(e).then(function (e) {
            var s = e.createReader();
            s.readEntries(function (e) {
              var s = [c(e)];
              o && e.filter(function (e) {
                return e.isDirectory;
              }).forEach(function (e) {
                s.push(d(e.fullPath, 're'));
              }), A.all(s).then(function (e) {
                var o = [];
                o = o.concat.apply(o, e), r && (o = o.filter(function (e) {
                  return e.isFile;
                })), i && (o = o.filter(function (e) {
                  return e.isDirectory;
                })), n || (o = o.map(function (e) {
                  return e.fullPath;
                })), t(o);
              }, a);
            }, a);
          }, a);
        });
      }
      function f(e) {
        return new A(function (t, o) {
          l(e).then(function (e) {
            t(e);
          }, function (e) {
            1 === e.code ? t(!1) : o(e);
          });
        });
      }
      function p(e) {
        return new A(function (t, o) {
          u(e).then(function (e) {
            t(e);
          }, function (e) {
            1 === e.code ? t(!1) : o(e);
          });
        });
      }
      function h(e) {
        return s(o(e)).then(function () {
          return l(e, { create: !0 });
        });
      }
      function v(e) {
        return l(e).then(function (e) {
          return e.toURL();
        });
      }
      function m(e, t) {
        return t = t || 'readAsText', l(e).then(function (e) {
          return new A(function (o, n) {
            e.file(function (e) {
              var n = new FileReader();
              n.onloadend = function () {
                o(this.result);
              }, n[t](e);
            }, n);
          });
        });
      }
      function w(e) {
        return m(e, 'readAsDataURL');
      }
      function g(e) {
        return m(e).then(JSON.parse);
      }
      function k(e, t, n) {
        return s(o(e)).then(function () {
          return l(e, { create: !0 });
        }).then(function (e) {
          return new A(function (o, r) {
            e.createWriter(function (e) {
              e.onwriteend = o, e.onerror = r, 'string' == typeof t ? t = y([t], n || 'text/plain') : t instanceof Blob != !0 && (t = y([JSON.stringify(t, null, 4)], n || 'application/json')), e.write(t);
            }, r);
          });
        });
      }
      function y(e, t) {
        var o, n;
        try {
          return new Blob(e, { type: t });
        } catch (r) {
          if (o = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)
            return n = new o(), n.append(e), n.getBlob(t);
          throw new Error('Unable to create blob');
        }
      }
      function b(e, t) {
        return s(o(t)).then(function (o) {
          return l(e).then(function (e) {
            return new A(function (r, i) {
              e.moveTo(o, n(t), r, i);
            });
          });
        });
      }
      function _(e, t) {
        return e = e.replace(/\/$/, ''), t = t.replace(/\/$/, ''), s(o(t)).then(function (o) {
          return u(e).then(function (e) {
            return new A(function (r, i) {
              e.moveTo(o, n(t), r, i);
            });
          });
        });
      }
      function $(e, t) {
        return s(o(t)).then(function (o) {
          return l(e).then(function (e) {
            return new A(function (r, i) {
              e.copyTo(o, n(t), r, i);
            });
          });
        });
      }
      function S(e, t) {
        var o = t ? l : f;
        return new A(function (t, n) {
          o(e).then(function (e) {
            e !== !1 ? e.remove(t, n) : t(1);
          }, n);
        }).then(function (e) {
          return 1 === e ? !1 : !0;
        });
      }
      function R(e) {
        return u(e).then(function (e) {
          return new A(function (t, o) {
            e.removeRecursively(t, o);
          });
        });
      }
      function D() {
        for (; i.length > 0 && a < e.concurrency;) {
          a++;
          var t = i.pop(), o = t.fileTransfer, n = t.isDownload, r = t.serverUrl, c = t.localPath, s = t.trustAllHosts, l = t.transferOptions, u = t.win, d = t.fail;
          o._aborted ? a-- : n ? (o.download.call(o, r, c, u, d, s, l), o.onprogress && o.onprogress(new ProgressEvent())) : o.upload.call(o, c, r, u, d, l, s);
        }
      }
      function T(e) {
        return a--, D(), e;
      }
      function x(t, o, r, c, s) {
        'function' == typeof c && (s = c, c = {}), U && r.indexOf('://') < 0 && (r = O(r)), c = c || {}, c.retry && c.retry.length || (c.retry = e.retry), c.retry = c.retry.concat(), c.file || t || (c.fileName = n(r));
        var l = new FileTransfer();
        s = s || c.onprogress, 'function' == typeof s && (l.onprogress = s);
        var u = new A(function (n, s) {
            var u = function (a) {
              if (0 === c.retry.length)
                e.debug && console.log('FileTransfer Error: ' + o, a), s(a);
              else {
                var d = {
                    fileTransfer: l,
                    isDownload: t,
                    serverUrl: o,
                    localPath: r,
                    trustAllHosts: c.trustAllHosts || !1,
                    transferOptions: c,
                    win: n,
                    fail: u
                  };
                i.unshift(d);
                var f = c.retry.shift();
                f > 0 ? setTimeout(T, f) : T();
              }
            };
            c.retry.unshift(0), a++, u();
          });
        return u.then(T, T), u.progress = function (e) {
          return l.onprogress = e, u;
        }, u.abort = function () {
          return l._aborted = !0, l.abort(), u;
        }, u;
      }
      function L(e, t, o, n) {
        return x(!0, e, t, o, n);
      }
      function C(e, t, o, n) {
        return x(!1, t, e, o, n);
      }
      var A = e.Promise || window.Promise;
      if (!A)
        throw new Error('No Promise library given in options.Promise');
      e = e || {}, e.persistent = void 0 !== e.persistent ? e.persistent : !0, e.storageSize = e.storageSize || 20971520, e.concurrency = e.concurrency || 3, e.retry = e.retry || [], e.debug = !!e.debug;
      var P, U = 'undefined' != typeof cordova;
      U ? P = new A(function (e, t) {
        document.addEventListener('deviceready', e, !1), setTimeout(function () {
          t(new Error('deviceready has not fired after 5 seconds.'));
        }, 5100);
      }) : (P = c(!0), 'undefined' != typeof webkitRequestFileSystem ? (window.requestFileSystem = webkitRequestFileSystem, window.FileTransfer = function () {
      }, FileTransfer.prototype.download = function (e, t, o, n) {
        var r = new XMLHttpRequest();
        return r.open('GET', e), r.responseType = 'blob', r.onreadystatechange = function () {
          4 == r.readyState && (200 !== r.status || this._aborted ? n(r.status) : k(t, r.response).then(o, n));
        }, r.send(), r;
      }, FileTransfer.prototype.abort = function () {
        this._aborted = !0;
      }, window.ProgressEvent = function () {
      }, window.FileEntry = function () {
      }) : window.requestFileSystem = function (e, t, o, n) {
        n(new Error('requestFileSystem not supported!'));
      });
      var E = new A(function (t, o) {
          P.then(function () {
            var n = e.persistent ? 1 : 0;
            e.fileSystem && U && (n = e.fileSystem), !U && 1 === n && navigator.webkitPersistentStorage ? navigator.webkitPersistentStorage.requestQuota(e.storageSize, function (e) {
              window.requestFileSystem(n, e, t, o);
            }, o) : isNaN(n) ? window.resolveLocalFileSystemURL(n, function (e) {
              t(e.filesystem);
            }, o) : window.requestFileSystem(n, e.storageSize, t, o), setTimeout(function () {
              o(new Error('Could not retrieve FileSystem after 5 seconds.'));
            }, 5100);
          }, o);
        });
      E.then(function (e) {
        F = e.root.toURL(), M = U ? e.root.toInternalURL() : F, window.__fs = e;
      }, function (e) {
        console.error('Could not get Cordova FileSystem:', e);
      });
      var I, B, O, M = 'cdvfile://localhost/' + (e.persistent ? 'persistent/' : 'temporary/'), F = '';
      return U ? (B = function (e) {
        return e = r(e), e.indexOf('://') < 0 ? M + e : e;
      }, O = function (e) {
        return e = r(e), e.indexOf('://') < 0 ? F + e : e;
      }, I = function (e) {
        return l(e).then(function (e) {
          return e.toInternalURL();
        });
      }) : (B = function (t) {
        return t = r(t), 'filesystem:' + location.origin + (e.persistent ? '/persistent/' : '/temporary/') + t;
      }, I = function (e) {
        return l(e).then(function (e) {
          return e.toURL();
        });
      }, O = B), {
        fs: E,
        normalize: r,
        file: l,
        filename: n,
        dir: u,
        dirname: o,
        create: h,
        read: m,
        readJSON: g,
        write: k,
        move: b,
        moveDir: _,
        copy: $,
        remove: S,
        removeDir: R,
        list: d,
        ensure: s,
        exists: f,
        existsDir: p,
        download: L,
        upload: C,
        toURL: v,
        toURLSync: O,
        isCordova: U,
        toInternalURLSync: B,
        toInternalURL: I,
        toDataURL: w,
        deviceready: P,
        options: e,
        Promise: A
      };
    };
  },
  function (e, t, o) {
    !function (t) {
      !function (o, n) {
        function r(e, t) {
          return (typeof t)[0] == e;
        }
        function i(e, t) {
          return t = function c(s, l, u, d, f, p) {
            function h(e) {
              return function (t) {
                f && (f = 0, c(r, e, t));
              };
            }
            if (d = c.q, s != r)
              return i(function (e, t) {
                d.push({
                  p: this,
                  r: e,
                  j: t,
                  1: s,
                  0: l
                });
              });
            if (u && r(o, u) | r(n, u))
              try {
                f = u.then;
              } catch (v) {
                l = 0, u = v;
              }
            if (r(o, f))
              try {
                f.call(u, h(1), l = h(0));
              } catch (v) {
                l(v);
              }
            else
              for (t = function (t, n) {
                  return r(o, t = l ? t : n) ? i(function (e, o) {
                    a(this, e, o, u, t);
                  }) : e;
                }, p = 0; p < d.length;)
                f = d[p++], r(o, s = f[l]) ? a(f.p, f.r, f.j, u, s) : (l ? f.r : f.j)(u);
          }, t.q = [], e.call(e = {
            then: function (e, o) {
              return t(e, o);
            },
            'catch': function (e) {
              return t(0, e);
            }
          }, function (e) {
            t(r, 1, e);
          }, function (e) {
            t(r, 0, e);
          }), e;
        }
        function a(e, i, a, c, s) {
          t(function () {
            try {
              c = s(c), s = c && r(n, c) | r(o, c) && c.then, r(o, s) ? c == e ? a(TypeError()) : s.call(c, i, a) : i(c);
            } catch (t) {
              a(t);
            }
          });
        }
        function c(e) {
          return i(function (t) {
            t(e);
          });
        }
        e.exports = i, i.resolve = c, i.reject = function (e) {
          return i(function (t, o) {
            o(e);
          });
        }, i.all = function (e) {
          return i(function (t, o, n, r) {
            r = [], n = e.length || t(r), e.map(function (e, i) {
              c(e).then(function (e) {
                r[i] = e, --n || t(r);
              }, o);
            });
          });
        };
      }('f', 'o');
    }.call(t, o(6).setImmediate);
  },
  function (e, t, o) {
    !function (e, n) {
      function r(e, t) {
        this._id = e, this._clearFn = t;
      }
      var i = o(7).nextTick, a = Function.prototype.apply, c = Array.prototype.slice, s = {}, l = 0;
      t.setTimeout = function () {
        return new r(a.call(setTimeout, window, arguments), clearTimeout);
      }, t.setInterval = function () {
        return new r(a.call(setInterval, window, arguments), clearInterval);
      }, t.clearTimeout = t.clearInterval = function (e) {
        e.close();
      }, r.prototype.unref = r.prototype.ref = function () {
      }, r.prototype.close = function () {
        this._clearFn.call(window, this._id);
      }, t.enroll = function (e, t) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
      }, t.unenroll = function (e) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
      }, t._unrefActive = t.active = function (e) {
        clearTimeout(e._idleTimeoutId);
        var t = e._idleTimeout;
        t >= 0 && (e._idleTimeoutId = setTimeout(function () {
          e._onTimeout && e._onTimeout();
        }, t));
      }, t.setImmediate = 'function' == typeof e ? e : function (e) {
        var o = l++, n = arguments.length < 2 ? !1 : c.call(arguments, 1);
        return s[o] = !0, i(function () {
          s[o] && (n ? e.apply(null, n) : e.call(null), t.clearImmediate(o));
        }), o;
      }, t.clearImmediate = 'function' == typeof n ? n : function (e) {
        delete s[e];
      };
    }.call(t, o(6).setImmediate, o(6).clearImmediate);
  },
  function (e) {
    function t() {
      s = !1, i.length ? c = i.concat(c) : l = -1, c.length && o();
    }
    function o() {
      if (!s) {
        var e = setTimeout(t);
        s = !0;
        for (var o = c.length; o;) {
          for (i = c, c = []; ++l < o;)
            i && i[l].run();
          l = -1, o = c.length;
        }
        i = null, s = !1, clearTimeout(e);
      }
    }
    function n(e, t) {
      this.fun = e, this.array = t;
    }
    function r() {
    }
    var i, a = e.exports = {}, c = [], s = !1, l = -1;
    a.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var r = 1; r < arguments.length; r++)
          t[r - 1] = arguments[r];
      c.push(new n(e, t)), 1 !== c.length || s || setTimeout(o, 0);
    }, n.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, a.title = 'browser', a.browser = !0, a.env = {}, a.argv = [], a.version = '', a.versions = {}, a.on = r, a.addListener = r, a.once = r, a.off = r, a.removeListener = r, a.removeAllListeners = r, a.emit = r, a.binding = function () {
      throw new Error('process.binding is not supported');
    }, a.cwd = function () {
      return '/';
    }, a.chdir = function () {
      throw new Error('process.chdir is not supported');
    }, a.umask = function () {
      return 0;
    };
  }
]), function () {
  function e() {
    console.log('AppLoader: checking...'), n.check().then(function (e) {
      return console.log('AppLoader.check(): ', e), n.download();
    }).then(function (e) {
      return console.log('AppLoader.download(): ', e), n.update();
    }).then(function (e) {
      console.log('AppLoader.update(): ', e);
    }, function (e) {
      console.error('AppLoader error:', e);
    });
  }
  function t() {
    document.webkitHidden || e();
  }
  var o, n, r, i, a = 'undefined' != typeof cordova;
  if (r = document.querySelector('script[server]'), r && (i = r.getAttribute('server')), !i)
    throw new Error('Add a "server" attribute to the bootstrap.js script!');
  o = new CordovaPromiseFS({
    persistent: !0,
    fileSystem: a ? cordova.file.cacheDirectory : void 0,
    Promise: Promise
  }), n = new CordovaAppLoader({
    fs: o,
    localRoot: 'app',
    serverRoot: i,
    mode: 'mirror',
    cacheBuster: !0
  }), window.RELOADING_FOR_IOS10_BUGFIX || e(), o.deviceready.then(function () {
    document.addEventListener('resume', e);
  }), document.addEventListener('webkitvisibilitychange', t, !1), window.loader = n;
}(), device.ios() && !localStorage.ios10bugfix && (console.log('first load after install, reloading to fix ios10 bug with http-request not working'), localStorage.ios10bugfix = 'yes', location.reload()), function (e) {
  'function' == typeof define && define.amd ? define(['jquery'], e) : 'object' == typeof exports ? e(require('jquery')) : e(jQuery);
}(function (e) {
  function t(e) {
    return c.raw ? e : encodeURIComponent(e);
  }
  function o(e) {
    return c.raw ? e : decodeURIComponent(e);
  }
  function n(e) {
    return t(c.json ? JSON.stringify(e) : String(e));
  }
  function r(e) {
    0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    try {
      return e = decodeURIComponent(e.replace(a, ' ')), c.json ? JSON.parse(e) : e;
    } catch (t) {
    }
  }
  function i(t, o) {
    var n = c.raw ? t : r(t);
    return e.isFunction(o) ? o(n) : n;
  }
  var a = /\+/g, c = e.cookie = function (r, a, s) {
      if (void 0 !== a && !e.isFunction(a)) {
        if (s = e.extend({}, c.defaults, s), 'number' == typeof s.expires) {
          var l = s.expires, u = s.expires = new Date();
          u.setTime(+u + 86400000 * l);
        }
        return document.cookie = [
          t(r),
          '=',
          n(a),
          s.expires ? '; expires=' + s.expires.toUTCString() : '',
          s.path ? '; path=' + s.path : '',
          s.domain ? '; domain=' + s.domain : '',
          s.secure ? '; secure' : ''
        ].join('');
      }
      for (var d = r ? void 0 : {}, f = document.cookie ? document.cookie.split('; ') : [], p = 0, h = f.length; h > p; p++) {
        var v = f[p].split('='), m = o(v.shift()), w = v.join('=');
        if (r && r === m) {
          d = i(w, a);
          break;
        }
        r || void 0 === (w = i(w)) || (d[m] = w);
      }
      return d;
    };
  c.defaults = {}, e.removeCookie = function (t, o) {
    return void 0 === e.cookie(t) ? !1 : (e.cookie(t, '', e.extend({}, o, { expires: -1 })), !e.cookie(t));
  };
}), function (e) {
  e.cookieCuttr = function (t) {
    var o = {
        cookieCutter: !1,
        cookieCutterDeclineOnly: !1,
        cookieAnalytics: !0,
        cookieDeclineButton: !1,
        cookieAcceptButton: !0,
        cookieResetButton: !1,
        cookieOverlayEnabled: !1,
        cookiePolicyLink: '/privacy-policy/',
        cookieMessage: 'We use cookies on this website, you can <a href="{{cookiePolicyLink}}" title="read about our cookies">read about them here</a>. To use the website as intended please...',
        cookieAnalyticsMessage: 'We use cookies, just to track visits to our website, we store no personal details.',
        cookieErrorMessage: 'We\'re sorry, this feature places cookies in your browser and has been disabled. <br>To continue using this functionality, please',
        cookieWhatAreTheyLink: 'http://www.allaboutcookies.org/',
        cookieDisable: '',
        cookieExpires: 365,
        cookieAcceptButtonText: 'ACCEPT COOKIES',
        cookieDeclineButtonText: 'DECLINE COOKIES',
        cookieResetButtonText: 'RESET COOKIES FOR THIS WEBSITE',
        cookieWhatAreLinkText: 'What are cookies?',
        cookieNotificationLocationBottom: !1,
        cookiePolicyPage: !1,
        cookiePolicyPageMessage: 'Please read the information below and then choose from the following options',
        cookieDiscreetLink: !1,
        cookieDiscreetReset: !1,
        cookieDiscreetLinkText: 'Cookies?',
        cookieDiscreetPosition: 'topleft',
        cookieNoMessage: !1,
        cookieDomain: ''
      }, t = e.extend(o, t), n = o.cookieMessage.replace('{{cookiePolicyLink}}', o.cookiePolicyLink);
    o.cookieMessage = 'We use cookies on this website, you can <a href="' + o.cookiePolicyLink + '" title="read about our cookies">read about them here</a>. To use the website as intended please...';
    var r = t.cookiePolicyLink, i = t.cookieCutter, a = t.cookieCutterDeclineOnly, c = t.cookieAnalytics, s = t.cookieDeclineButton, l = t.cookieAcceptButton, u = t.cookieResetButton, d = t.cookieOverlayEnabled;
    t.cookiePolicyLink;
    var f = n, p = t.cookieAnalyticsMessage, h = t.cookieErrorMessage, v = t.cookieDisable, m = t.cookieWhatAreTheyLink, w = t.cookieExpires, g = t.cookieAcceptButtonText, k = t.cookieDeclineButtonText, y = t.cookieResetButtonText, b = t.cookieWhatAreLinkText, _ = t.cookieNotificationLocationBottom, $ = t.cookiePolicyPage, S = t.cookiePolicyPageMessage, R = t.cookieDiscreetLink, D = t.cookieDiscreetReset, T = t.cookieDiscreetLinkText, x = t.cookieDiscreetPosition, L = t.cookieNoMessage, C = 'cc_cookie_accept' == e.cookie('cc_cookie_accept');
    e.cookieAccepted = function () {
      return C;
    };
    var A = 'cc_cookie_decline' == e.cookie('cc_cookie_decline');
    if (e.cookieDeclined = function () {
        return A;
      }, l)
      var P = ' <a href="#accept" class="cc-cookie-accept">' + g + '</a> ';
    else
      var P = '';
    if (s)
      var U = ' <a href="#decline" class="cc-cookie-decline">' + k + '</a> ';
    else
      var U = '';
    if (d)
      var E = 'cc-overlay';
    else
      var E = '';
    if (_ || 'bottomright' == x || 'bottomleft' == x)
      var I = !0;
    else
      var I = !1;
    if (C || A)
      if (u && D)
        I ? e('body').append('<div class="cc-cookies cc-discreet"><a class="cc-cookie-reset" href="#" title="' + y + '">' + y + '</a></div>') : e('body').prepend('<div class="cc-cookies cc-discreet"><a class="cc-cookie-reset" href="#" title="' + y + '">' + y + '</a></div>'), 'topleft' == x && (e('div.cc-cookies').css('top', '0'), e('div.cc-cookies').css('left', '0')), 'topright' == x && (e('div.cc-cookies').css('top', '0'), e('div.cc-cookies').css('right', '0')), 'bottomleft' == x && (e('div.cc-cookies').css('bottom', '0'), e('div.cc-cookies').css('left', '0')), 'bottomright' == x && (e('div.cc-cookies').css('bottom', '0'), e('div.cc-cookies').css('right', '0'));
      else if (u)
        I ? e('body').append('<div class="cc-cookies"><a href="#" class="cc-cookie-reset">' + y + '</a></div>') : e('body').prepend('<div class="cc-cookies"><a href="#" class="cc-cookie-reset">' + y + '</a></div>');
      else
        var u = '';
    else
      L && !$ || (R && !$ ? (I ? e('body').append('<div class="cc-cookies cc-discreet"><a href="' + r + '" title="' + T + '">' + T + '</a></div>') : e('body').prepend('<div class="cc-cookies cc-discreet"><a href="' + r + '" title="' + T + '">' + T + '</a></div>'), 'topleft' == x && (e('div.cc-cookies').css('top', '0'), e('div.cc-cookies').css('left', '0')), 'topright' == x && (e('div.cc-cookies').css('top', '0'), e('div.cc-cookies').css('right', '0')), 'bottomleft' == x && (e('div.cc-cookies').css('bottom', '0'), e('div.cc-cookies').css('left', '0')), 'bottomright' == x && (e('div.cc-cookies').css('bottom', '0'), e('div.cc-cookies').css('right', '0'))) : c && (I ? e('body').append('<div class="cc-cookies ' + E + '">' + p + P + U + '<a href="' + m + '" title="Visit All about cookies (External link)">' + b + '</a></div>') : e('body').prepend('<div class="cc-cookies ' + E + '">' + p + P + U + '<a href="' + m + '" title="Visit All about cookies (External link)">' + b + '</a></div>'))), $ ? I ? e('body').append('<div class="cc-cookies ' + E + '">' + S + ' ' + ' <a href="#accept" class="cc-cookie-accept">' + g + '</a> ' + ' <a href="#decline" class="cc-cookie-decline">' + k + '</a> ' + '</div>') : e('body').prepend('<div class="cc-cookies ' + E + '">' + S + ' ' + ' <a href="#accept" class="cc-cookie-accept">' + g + '</a> ' + ' <a href="#decline" class="cc-cookie-decline">' + k + '</a> ' + '</div>') : c || R || (I ? e('body').append('<div class="cc-cookies ' + E + '">' + f + P + U + '</div>') : e('body').prepend('<div class="cc-cookies ' + E + '">' + f + P + U + '</div>'));
    !i || a || !A && C || e(v).html('<div class="cc-cookies-error">' + h + ' <a href="#accept" class="cc-cookie-accept">' + g + '</a> ' + '</div>'), i && a && A && e(v).html('<div class="cc-cookies-error">' + h + ' <a href="#accept" class="cc-cookie-accept">' + g + '</a> ' + '</div>'), _ && !R && (e('div.cc-cookies').css('top', 'auto'), e('div.cc-cookies').css('bottom', '0')), _ && R && $ && (e('div.cc-cookies').css('top', 'auto'), e('div.cc-cookies').css('bottom', '0')), e('.cc-cookie-accept, .cc-cookie-decline').click(function (o) {
      o.preventDefault(), e(this).is('[href$=#decline]') ? (e.cookie('cc_cookie_accept', null, { path: '/' }), e.cookie('cc_cookie_decline', 'cc_cookie_decline', {
        expires: w,
        path: '/'
      }), t.cookieDomain && (e.cookie('__utma', null, {
        domain: '.' + t.cookieDomain,
        path: '/'
      }), e.cookie('__utmb', null, {
        domain: '.' + t.cookieDomain,
        path: '/'
      }), e.cookie('__utmc', null, {
        domain: '.' + t.cookieDomain,
        path: '/'
      }), e.cookie('__utmz', null, {
        domain: '.' + t.cookieDomain,
        path: '/'
      }))) : (e.cookie('cc_cookie_decline', null, { path: '/' }), e.cookie('cc_cookie_accept', 'cc_cookie_accept', {
        expires: w,
        path: '/'
      })), e('.cc-cookies').fadeOut(function () {
        location.reload();
      });
    }), e('a.cc-cookie-reset').click(function (t) {
      t.preventDefault(), e.cookie('cc_cookie_accept', null, { path: '/' }), e.cookie('cc_cookie_decline', null, { path: '/' }), e('.cc-cookies').fadeOut(function () {
        location.reload();
      });
    }), e('.cc-cookies-error a.cc-cookie-accept').click(function (t) {
      t.preventDefault(), e.cookie('cc_cookie_accept', 'cc_cookie_accept', {
        expires: w,
        path: '/'
      }), e.cookie('cc_cookie_decline', null, { path: '/' }), location.reload();
    });
  };
}(jQuery), function (e) {
  device.desktop() && e(document).ready(function () {
    e.cookieCuttr({ cookieWhatAreTheyLink: 'http://www.theeucookielaw.com/' });
  }), 'cc_cookie_accept' == jQuery.cookie('cc_cookie_accept') && (function (e, t, o, n, r, i, a) {
    e.GoogleAnalyticsObject = r, e[r] = e[r] || function () {
      (e[r].q = e[r].q || []).push(arguments);
    }, e[r].l = 1 * new Date(), i = t.createElement(o), a = t.getElementsByTagName(o)[0], i.async = 1, i.src = n, a.parentNode.insertBefore(i, a);
  }(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'), ga('create', 'UA-51393931-1', 'auto', { allowLinker: !0 }), ga('require', 'linker'), 'goodmusiccompany.com' != location.hostname && ga('linker:autoLink', ['goodmusiccompany.com']));
}(jQuery), window.BASE_URL = './' !== Manifest.root ? Manifest.root : '', angular.module('app', [
  'ui.router',
  'history',
  'opener',
  'databind',
  'firebase',
  'angular-gestures',
  'ui.bootstrap',
  'debounce',
  'collapser',
  'hm-sref',
  'ui.jq',
  'views',
  'swiper',
  'download',
  'filters',
  'cache',
  'email',
  'video',
  'audio',
  'once',
  'scroll',
  'angulartics',
  'angulartics.google.analytics'
]).value('databind-config', {
  url: 'https://goodmusic.firebaseio.com/1-0-0/',
  storage: !0,
  firebase: !1
}).config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$compileProvider',
  '$httpProvider',
  function (e, t, o, n, r) {
    var i, a, c, s;
    return './' === Manifest.root && 'undefined' == typeof cordova && (console.log('html5-mode'), o.html5Mode(!0)), n.aHrefSanitizationWhitelist(/.*/), n.imgSrcSanitizationWhitelist(/.*/), console.log('Version: 1.6.2'), t.otherwise('/', 'app.browser'), c = device.desktop() || device.tablet(), (window.location.href.indexOf('wide=false') > -1 || 'true' === localStorage.getItem('mobile')) && (localStorage.setItem('mobile', 'true'), c = !1), s = c ? '.wide' : '', c && $('html').addClass('wide'), a = '1.6.2', i = '1-0-0', $.ajaxSetup({ headers: { 'X-Version': a } }), r.defaults.headers.common['X-Version'] = a, r.defaults.headers.common['X-FirebaseVersion'] = i, e.state('app', {
      'abstract': !0,
      url: '/',
      views: {
        menu: {
          templateUrl: 'app/menu/menu' + s + '.jade',
          controller: 'MenuCtrl'
        },
        content: { template: '<ui-view/>' },
        footer: {
          templateUrl: 'app/footer/footer.jade',
          controller: 'FooterCtrl'
        }
      }
    }).state('app.browser', {
      url: '',
      data: { title: 'Home' },
      resolve: {
        size: [
          '$rootScope',
          'size',
          '$q',
          function (e, t, o) {
            return o.all(t.$promise, e.firstDataLoad.promise);
          }
        ]
      },
      templateUrl: 'app/browser/browser.jade',
      controller: 'BrowserCtrl'
    }).state('app.list', {
      url: 'artist',
      data: { title: 'Artists' },
      controller: 'ArtistListCtrl',
      templateUrl: 'app/list/list' + s + '.jade'
    }).state('app.info', {
      url: 'info',
      data: { title: 'Info' },
      controller: 'InfoCtrl',
      templateUrl: 'app/info/info' + s + '.jade'
    }).state('app.info.about', { url: '/aboutus' }).state('app.info.contact', { url: '/contact' }).state('app.info.mail', { url: '/mail' }).state('app.artist', {
      url: 'artist/:url',
      data: { title: 'Artist' },
      controller: 'ArtistCtrl',
      templateUrl: 'app/artist/artist' + s + '.jade',
      resolve: {
        size: [
          '$rootScope',
          'size',
          function (e, t) {
            return e.wide ? t.$promise : !0;
          }
        ]
      }
    }).state('app.artist.bio', { url: '/biography' }).state('app.artist.music', { url: '/music' }).state('app.artist.videos', { url: '/videos' }).state('app.artist.book', { url: '/book' }).state('app.artist.concerts', { url: '/concerts' }).state('app.artist.rider', { url: '/riders' });
  }
]).run([
  '$rootScope',
  '$state',
  'databind',
  'history',
  'cacheFilter',
  'size',
  '$q',
  function (e, t, o, n, r, i, a) {
    var c, s, l, u;
    return n.init(), window.$rootScope = e, e.baseUrl = window.BASE_URL, e.firstDataLoad = a.defer(), l = !1, u = function () {
      return console.log('Data request...'), e.artists = o('artists'), e.info = o('info'), Promise.all([
        e.artists.$promise,
        e.info.$promise
      ]).then(function () {
        return console.log('Data updated!'), l = !0, e.firstDataLoad.resolve(), window.BOOTSTRAP_OK = !0;
      }), '$digest' !== e.$$phase ? e.$apply() : void 0;
    }, window.RELOADING_FOR_IOS10_BUGFIX || u(), e.title = 'Home', e.$on('$stateChangeStart', function (t, o, n, r) {
      var i, a, c, s;
      return console.log(null != (c = o.data) ? c.title : void 0), 'app.artist' !== o.name.substr(0, 10) && (e.title = null != (s = o.data) ? s.title : void 0), 'app.browser' === o.name && u(), i = r.name.replace(/\./, '-'), a = o.name.replace(/\./, '-'), $('html').removeClass(i).addClass(a);
    }), e.$on('$stateChangeSuccess', function (t, o, n, r) {
      return r.name && (e.welcome = { hide: !0 }), $.scrollTo(0, 0);
    }), e.wide = $('html').hasClass('wide'), e.welcome = { hide: !1 }, s = function () {
      return setTimeout(function () {
        return $('html,body').removeClass('loading');
      }, 1000);
    }, e.artists.$loaded ? i.done(s) : $.when(i, e.artists.$promise).done(s), device.ios() && ($('body').on('focus', 'input,textarea,select', function () {
      return $('html').addClass('focus');
    }), $('body').on('blur', 'input,textarea,select', function () {
      return $('html').removeClass('focus'), $(window).trigger('scroll');
    }), $('html,body').on('touchstart', function () {
    })), e.wide && ($('body').on('mouseenter touchstart', '.sidebar', function (e) {
      return e.currentTarget.scrollHeight > $(e.currentTarget).height() ? $('body').css('overflow', 'hidden') : void 0;
    }), $('body').on('mouseleave', '.sidebar', function () {
      return $('body').css('overflow', 'inherit');
    }), $('body').on('touchstart', '.content', function () {
      return $('body').css('overflow', 'inherit');
    })), c = $('body'), $(window).on('scroll', function () {
      var e;
      return e = 55, c.scrollTop() > e ? $('.toolbar').addClass('mini') : $('.toolbar').removeClass('mini');
    });
  }
]), angular.module('app').controller('ArtistCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$rootScope',
  'databind',
  'scrollTo',
  '$timeout',
  'downloader',
  'size',
  function (e, t, o, n, r, i, a, c) {
    var s, l;
    return n.title = null != (l = n.artists[o.url]) ? l.name : void 0, e.artist = r('artists/' + o.url), e.url = o.url, s = $.Deferred(), e.getPhotos = function () {
      var t;
      return t = [], t.push(e.artist.cover), angular.forEach(e.artist.photos, function (e) {
        return void 0 !== e.time ? t.push(e) : void 0;
      }), t;
    }, e.downloadPhotos = function (t) {
      var o, n, r, i, a;
      for (o = [], a = e.getPhotos(), r = 0, i = a.length; i > r; r++)
        n = a[r], o.push(n.link + '?dl=1');
      return device.desktop() && (o = [o[t || e.swiper.activeLoopIndex]]), e.artist.$promise.done(function () {
        return c({
          artistname: e.artist.name,
          type: 'photo',
          attachments: o,
          title: 'Download photo\'s',
          message: 'Send photo\'s to your e-mail:',
          buttons: [
            'Cancel',
            'Send'
          ],
          open: !1
        });
      });
    }, e.artist.$promise.done(function () {
      var o, n, r, i;
      return e.newsPopup = {
        artistname: e.artist.name,
        type: 'news',
        url: null != (o = e.artist) ? null != (n = o.newspdf) ? n.link : void 0 : void 0,
        attachments: [null != (r = e.artist) ? null != (i = r.newspdf) ? i.link : void 0 : void 0],
        link: device.desktop(),
        title: 'Download news',
        message: 'Send news to your e-mail:'
      }, e.artist.name ? void 0 : t.go('app.browser');
    }), e.swiper = e.artist.$promise, n.swiperSlide = Object.keys(n.artists).sort().filter(function (e) {
      return '$' !== e[0];
    }).indexOf(e.url), e.collapse = {}, function () {
      var t, o, n, r, i, a, c;
      return c = encodeURIComponent('http://www.goodmusiccompany.com/artist/' + e.url), i = e.info.share, o = encodeURIComponent(i), t = $(document), n = 0.5 * (window.screen.width - 550), a = 0.5 * (window.screen.height - 420), r = 'status=no,width=550,height=420,top=' + a + ',left=' + n, e.share = function () {
        return 'undefined' != typeof navigator && null !== navigator ? 'function' == typeof navigator.share ? navigator.share('' + i + ' http://www.goodmusiccompany.com/artist/' + e.url, 'Share artist') : void 0 : void 0;
      }, e.facebook = function () {
        var e;
        return e = 'http://www.facebook.com/sharer.php?u=' + c + '&t=' + o, window.open(e, '_blank', r), null;
      }, e.tweet = function () {
        var e;
        return e = 'http://twitter.com/intent/tweet?url=' + c + '&text=' + o, window.open(e, '_blank', r), null;
      };
    }(), e.goto = function (t) {
      var o;
      return e.wide ? o = device.ios() ? -130 : -110 : (e.collapse[t] = !1, o = -55), i('#' + t, 350, o), !0;
    }, e.toggle = function (t, o) {
      return e.collapse[o] = !e.collapse[o], t.gesture.stopPropagation(), t.gesture.preventDefault(), t.stopPropagation(), t.preventDefault();
    }, $.each('bio,music,videos,book,concerts,rider'.split(','), function (o, n) {
      var r;
      return r = 'app.artist.' + n, e.collapse[n] = t.$current.name !== r, !0;
    });
  }
]).directive('fixHeight', [
  '$rootScope',
  'size',
  function (e, t) {
    return {
      link: function (o, n) {
        var r;
        return t.then(function () {
          var t, o;
          return t = $(n).find('.section-content,.bio-content').height() + 100 || 0, o = Math.max(e.size.artistH, t), $(n).css('height', o);
        }), r = function () {
          var e, t;
          return e = $(n), t = e.find('.section-content,.bio-content').height(), e.height() < t ? (e.find('.section-content').css({
            top: 0,
            transform: 'none',
            'margin-top': 50
          }), e.css('height', t + 100)) : void 0;
        }, setTimeout(r, 0);
      }
    };
  }
]).directive('autoScroll', [function () {
    var e, t, o, n, r, i, a;
    return device.ios ? function () {
    } : (e = $('body'), r = 110, o = [], a = 0, t = function () {
      var t, n, i, a, c, s, l;
      for (a = e.scrollTop(), s = 0, l = o.length; l > s; s++)
        if (t = o[s], i = 0.2 * $(t).height(), c = $(t).offset().top - r - i, n = c + 2 * i, a > c && n > a)
          return $.scrollTo(t, 200, { offset: -r }), void 0;
    }, n = 'scroll', i = device.desktop() ? 500 : 200, $(window).on(n, function () {
      return clearTimeout(a), a = setTimeout(t, i);
    }), {
      link: function (e, t) {
        return o.push(t);
      }
    });
  }]), angular.module('app').controller('ArtistBioCtrl', [
  '$scope',
  'cacheFilter',
  function (e) {
    return e.artist.$promise.done(function () {
      var t, o, n, r, i, a, c, s, l, u, d, f;
      return e.bioEn = {
        artistname: e.artist.name || '',
        type: 'bio',
        attachments: [
          null != (t = e.artist) ? null != (o = t.bio) ? null != (i = o.en) ? i.link : void 0 : void 0 : void 0,
          null != (a = e.artist) ? null != (c = a.bio) ? null != (s = c.nl) ? s.link : void 0 : void 0 : void 0
        ],
        title: 'Biography',
        link: device.desktop(),
        url: null != (l = e.artist) ? null != (u = l.bio) ? null != (d = u.en) ? d.link : void 0 : void 0 : void 0,
        message: 'Send biography to your e-mail:'
      }, e.bioNl = angular.extend({}, e.bioEn, { url: null != (f = e.artist) ? null != (n = f.bio) ? null != (r = n.nl) ? r.link : void 0 : void 0 : void 0 });
    });
  }
]), angular.module('app').controller('ArtistBookCtrl', [
  '$scope',
  function (e) {
    return e.getSubject = function (e, t) {
      var o, n;
      return null == t ? '' : (o = null != (n = t.lines) ? 'function' == typeof n.split ? n.split('\n') : void 0 : void 0, o ? (delete o[2], o = o.join(' / ')) : o = t.lines, 'BOOK ' + e.name + ': ' + o);
    }, e.index = { $value: null };
  }
]).controller('ArtistSingleBookCtrl', [
  '$scope',
  function () {
  }
]), angular.module('app').controller('ArtistMusicCtrl', [
  '$scope',
  function () {
  }
]), angular.module('app').controller('ArtistRiderCtrl', [
  '$scope',
  function (e) {
    return e.artist.$promise.done(function () {
      var t, o, n, r, i, a, c, s, l, u, d, f;
      return e.riderTech = {
        artistname: e.artist.name || '',
        type: 'rider',
        attachments: [
          null != (t = e.artist) ? null != (o = t.rider) ? null != (i = o.tech) ? i.link : void 0 : void 0 : void 0,
          null != (a = e.artist) ? null != (c = a.rider) ? null != (s = c.hosp) ? s.link : void 0 : void 0 : void 0
        ],
        title: 'Riders',
        openOnCancel: !0,
        link: device.desktop(),
        url: null != (l = e.artist) ? null != (u = l.rider) ? null != (d = u.tech) ? d.link : void 0 : void 0 : void 0,
        message: 'Send riders to your e-mail:'
      }, e.riderHosp = angular.extend({}, e.riderTech, { url: null != (f = e.artist) ? null != (n = f.rider) ? null != (r = n.hosp) ? r.link : void 0 : void 0 : void 0 });
    });
  }
]), angular.module('app').controller('ArtistVideoCtrl', [
  '$scope',
  function (e) {
    return e.swiper = e.artist.$promise;
  }
]), angular.module('app').controller('BrowserCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  'databind',
  '$timeout',
  'size',
  '$q',
  function (e, t) {
    var o;
    return e.hasFooter = function () {
      return t.hasFooter;
    }, o = $.Deferred(), e.swiper = o, t.firstDataLoad.promise.then(function () {
      var e;
      return null == t.swiperSlide && (t.swiperSlide = Object.keys(t.artists).filter(function (e) {
        return '$' !== e[0];
      }).sort().indexOf(null != (e = t.info) ? e.featured : void 0)), setTimeout(o.resolve, 0);
    }), e.getFilter = function (e) {
      return e === t.info.featured ? '' : 'f=2';
    };
  }
]), angular.module('download', [
  'storage',
  'databind'
]).factory('download', [function () {
    return function (e, t, o) {
      var n, r, i;
      return null == t && (t = 100), null == o && (o = 10000), n = $('<iframe style="display:none;"></iframe>'), n.attr('src', e), r = function () {
        return $('body').append(n);
      }, i = function () {
        return n.remove();
      }, setTimeout(r, t), setTimeout(i, o);
    };
  }]).factory('downloader', [
  '$http',
  'storage',
  'databind',
  'download',
  'opener',
  function (e, t, o, n, r) {
    var i, a, c, s, l;
    return s = o('info/email', { firebase: !1 }), c = t.get('email') || { from: '' }, l = function (e) {
      return c.from = e, t.set('email', c), c;
    }, i = {
      open: 1,
      link: !1,
      artistname: '',
      type: '',
      attachments: [],
      download: device.desktop(),
      title: '',
      message: '',
      buttons: [
        'Preview',
        'Send e-mail'
      ],
      buttons2: [
        'Cancel',
        'Send e-mail'
      ]
    }, a = function (t) {
      var o, a, u, d, f, p, h;
      if (d = $.Deferred(), a = function (e) {
          var o, n, r;
          return null != ('undefined' != typeof navigator && null !== navigator ? null != (r = navigator.notification) ? r.prompt : void 0 : void 0) ? navigator.notification.prompt(t.message, u, t.title, e, c.from) : (n = prompt(t.title, c.from), o = n ? t.buttons.length : 0, u({
            buttonIndex: o,
            input1: n
          }));
        }, u = function (o) {
          var n, i, u, f, p, h, v;
          return o.buttonIndex !== t.buttons.length ? (null != t.callback && t.callback(o), t.open === o.buttonIndex && null != t.url && (i = r(t.url), i.addEventListener('exit', function () {
            return t.open = !1, a(t.buttons2);
          })), void 0) : (l(o.input1), u = null != (f = s[t.type]) ? null != (p = f.subject) ? 'function' == typeof p.replace ? p.replace(/ARTISTNAME/g, t.artistname) : void 0 : void 0 : void 0, n = null != (h = s[t.type]) ? null != (v = h.message) ? 'function' == typeof v.replace ? v.replace(/ARTISTNAME/g, t.artistname) : void 0 : void 0 : void 0, u || (u = t.artistname + ': ' + t.type), n || (n = 'See attachment.'), e.post('http://goodmusic.madebymark.nl/1.1.5/api/email/email.php', {
            to: c.from,
            toName: c.fromName || c.from,
            from: s.to,
            subject: u,
            message: n,
            attachments: t.attachments
          }).then(function (e) {
            return e.data.error ? d.reject()['catch'](function () {
              return d.reject();
            }) : d.resolve();
          }));
        }, t = angular.extend({}, i, t), t.download) {
        for (h = t.attachments, f = 0, p = h.length; p > f; f++)
          o = h[f], n(o);
        return d;
      }
      return a(t.buttons), d;
    };
  }
]).directive('emailPopup', [
  'downloader',
  function (e) {
    return {
      link: function (t, o, n) {
        return t.$watch(n.emailPopup, function (e) {
          return (null != e ? e.link : void 0) === !0 && null != (null != e ? e.url : void 0) ? $(o).attr({
            href: e.url,
            target: '_blank'
          }) : void 0;
        }), $(o).hammer().on('tap', function () {
          var o;
          return o = t.$eval(n.emailPopup), null == o || (null != o ? o.link : void 0) ? void 0 : e(o);
        });
      }
    };
  }
]), angular.module('app').controller('FooterCtrl', [
  '$scope',
  'playlist',
  '$state',
  'size',
  '$rootScope',
  function (e, t, o, n, r) {
    var i, a;
    return r.hasFooter = !1, e.prev = function () {
      return t.prev(!0);
    }, e.next = function () {
      return t.next(!0);
    }, e.isPlaying = function () {
      return t.isPlaying();
    }, e.play = function () {
      return t.play();
    }, e.pause = function () {
      return t.pause();
    }, e.info = '', i = { to: 'app.home' }, a = {}, e.w = 90, e.$on('size', function (t, o) {
      var n;
      return e.w = o.w, e.$apply === (n = e.$$phase) && '$digest' !== n;
    }), e.goto = function () {
      return o.go(i, a);
    }, e.close = function () {
      return t.stop(), r.hasFooter = !1;
    }, e.$on('media.status', function (n, c, s) {
      var l, u;
      return 2 === s ? (i = o.current, a = o.params, r.hasFooter = !0, e.info = null != (l = t.getCurrentMedia()) ? null != (u = l.meta) ? u.lines : void 0 : void 0) : void 0;
    });
  }
]), angular.module('app').controller('InfoCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$rootScope',
  'databind',
  'scrollTo',
  function (e, t, o, n, r, i) {
    return e.collapse = {}, e.goto = function (o) {
      return e.collapse[o] = !1, t.go('app.info.' + o), i('#' + o), !0;
    }, e.toggle = function (t, o) {
      return e.collapse[o] = !e.collapse[o], t.gesture.stopPropagation(), t.gesture.preventDefault(), t.stopPropagation(), t.preventDefault();
    }, e.index = { $value: 'about' }, $.each('about,contact,mail'.split(','), function (o, n) {
      var r;
      return r = 'app.info.' + n, e.collapse[n] = t.$current.name !== r, e.collapse[n] ? void 0 : e.goto(n);
    });
  }
]), angular.module('app').controller('ArtistListCtrl', [
  '$scope',
  function (e) {
    return e.clearFilter = function () {
      return e.month = -1, e.day = -1, e.query = '', e.filter.$value = !1;
    }, e.getHighlight = function (e) {
      var t;
      return (null != (t = $rootScope.info) ? t.featured : void 0) === e ? '' : 'f=2';
    };
  }
]).filter('filterArtist', [function () {
    var e, t;
    return t = function (e, t, o, n) {
      var r, i;
      return e > t && (r = [
        t,
        e
      ], e = r[0], t = r[1]), o > n && (i = [
        n,
        o
      ], o = i[0], n = i[1]), n >= e && t >= o;
    }, e = function (e) {
      var t;
      return t = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ], t[e];
    }, function (o, n, r, i) {
      var a, c, s;
      return null == n && (n = ''), null == r && (r = -1), null == i && (i = -1), angular.isObject(o) ? (n = ('' + n).toLowerCase(), c = {}, a = new Date(), r = '' === r ? -1 : 1 * r, s = a.getUTCFullYear(), r < a.getMonth() && (s += 1), i = 1 * i, angular.forEach(o, function (o, a) {
        var l, u, d, f;
        if ('$' !== a[0] && (d = ('' + o.name).toLowerCase(), -1 !== d.indexOf(n)))
          return r > -1 && i > -1 ? (f = new Date(s, r, i), l = new Date(s, r, i + 1)) : r > -1 && (f = new Date(s, r, 1), l = new Date(s, r, e(r))), -1 === r && (u = !0), r > -1 && (u = !1, f = f.getTime(), l = l.getTime(), angular.forEach(o.bookings, function (e) {
            return u = u || t(f, l, e.startdate, e.enddate);
          })), u ? c[a] = o : void 0;
      }), c) : [];
    };
  }]), angular.module('app').controller('MenuCtrl', [
  '$scope',
  '$rootScope',
  'debounce',
  '$state',
  'scrollTo',
  function (e, t, o, n) {
    return e.hideMenu = !0, e.toggleMenu = o(100, function () {
      return e.hideMenu = !e.hideMenu;
    }), t.filter = { $value: !1 }, e.showFilter = function () {
      return $('body').scrollTop(0), e.filter.$value = !0;
    }, e.isListView = function () {
      return 'app.list' === n.current.name;
    }, t.$on('$stateChangeStart', function () {
      return e.hideMenu = !0;
    });
  }
]), $(document).on('deviceready', initPushwoosh), angular.module('app').factory('size', [
  '$window',
  '$rootScope',
  '$q',
  function (e, t, o) {
    var n, r, i, a;
    return n = $.Deferred(), r = o.defer(), n.$promise = r.promise, n.then(function () {
      return r.resolve();
    }), t.size = {
      h: 0,
      w: 0
    }, i = 0, $(function () {
      var e, t;
      return t = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'), e = t.children(), i = e.innerWidth() - e.height(99).innerWidth(), t.remove();
    }), a = function () {
      var o, r, a, c;
      return t.size.h = a = angular.element(e).height(), t.size.w = c = angular.element(e).width(), $(document).height() > $(e).height() && (t.size.w += i), o = t.wide ? 55 : 110, r = device.ios() ? 20 : 0, t.size.imgH = a - o - r, t.size.imgW = c + i, t.size.ttH = device.desktop() ? 0 : t.size.imgH, t.size.ttW = device.desktop() ? 0 : t.size.imgW, t.size.artistH = t.size.imgH, t.wide && (t.size.artistH -= 55), t.$broadcast('size', t.size), n.resolveWith(t.size), console.log('Window ' + t.size.w + 'x' + t.size.h);
    }, angular.element(window).on('ready', function () {
      return setTimeout(a, 100);
    }), angular.element(window).on('orientationchange', a), n;
  }
]);