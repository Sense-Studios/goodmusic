!function (e) {
  function t(i) {
    if (o[i])
      return o[i].exports;
    var n = o[i] = {
        exports: {},
        id: i,
        loaded: !1
      };
    return e[i].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports;
  }
  var o = {};
  return t.m = e, t.c = o, t.p = '', t(0);
}([
  function (e, t, o) {
    window.CordovaAppLoader = o(1), window.CordovaFileCache = o(2), window.CordovaPromiseFS = o(4), window.Promise = o(5), window.setImmediate = window.setTimeout;
  },
  function (e, t, o) {
    function i(e) {
      var t = Object.keys(e);
      t.sort();
      var o = '';
      return t.forEach(function (t) {
        e[t] && e[t].version, o += '@' + e[t].version;
      }), r.hash(o) + '';
    }
    function n(e) {
      if (!e)
        throw new Error('CordovaAppLoader has no options!');
      if (!e.fs)
        throw new Error('CordovaAppLoader has no "fs" option (cordova-promise-fs)');
      if (!e.serverRoot)
        throw new Error('CordovaAppLoader has no "serverRoot" option.');
      if (!window.pegasus || !window.Manifest)
        throw new Error('CordovaAppLoader bootstrap.js is missing.');
      this.allowServerRootFromManifest = e.allowServerRootFromManifest === !0, a = e.fs.Promise, this.manifest = window.Manifest, this.newManifest = null, this.bundledManifest = null, this.preventAutoUpdateLoop = e.preventAutoUpdateLoop === !0, this._lastUpdateFiles = localStorage.getItem('last_update_files'), 1 * localStorage.getItem('last_update_time'), Date.now() - this._lastUpdateTime > 60000 && (this.preventAutoUpdateLoop = !1), e.serverRoot = e.serverRoot || '', e.serverRoot && '/' !== e.serverRoot[e.serverRoot.length - 1] && (e.serverRoot += '/'), this.newManifestUrl = e.manifestUrl || e.serverRoot + (e.manifest || 'manifest.json'), e.mode && (e.mode = 'mirror'), this.cache = new r(e), this.corruptNewManifest = !1, this._toBeCopied = [], this._toBeDeleted = [], this._toBeDownloaded = [], this._updateReady = !1, this._checkTimeout = e.checkTimeout || 10000;
    }
    var r = o(2);
    o(4);
    var a = null, s = location.href.replace(location.hash, '');
    s = s.substr(0, s.lastIndexOf('/') + 1), /ip(hone|ad|od)/i.test(navigator.userAgent) && (s = location.pathname.substr(location.pathname.indexOf('/www/')), s = s.substr(0, s.lastIndexOf('/') + 1), s = 'cdvfile://localhost/bundle' + s), n.prototype._createFilemap = function (e) {
      var t = {}, o = this.cache._fs.normalize;
      return Object.keys(e || []).forEach(function (i) {
        e[i].filename = o(e[i].filename), t[e[i].filename] = e[i];
      }), t;
    }, n.prototype.copyFromBundle = function (e) {
      var t = s + e;
      return this.cache._fs.download(t, this.cache.localRoot + e);
    }, n.prototype.getBundledManifest = function () {
      var e = this, t = document.querySelector('script[manifest]'), o = (t ? t.getAttribute('manifest') : null) || 'manifest.json';
      return new a(function (t, i) {
        e.bundledManifest ? t(e.bundledManifest) : (pegasus(o).then(function (o) {
          e.bundledManifest = o, t(o);
        }, i), setTimeout(function () {
          i(new Error('bundled manifest timeout'));
        }, e._checkTimeout));
      });
    }, n.prototype.check = function (e) {
      var t = this, o = this.manifest;
      'string' == typeof e && (t.newManifestUrl = e, e = void 0);
      var n = new a(function (o, i) {
          if ('object' == typeof e)
            o(e);
          else {
            var n = t.cache._cacheBuster ? t.newManifestUrl + '?' + Date.now() : t.newManifestUrl;
            pegasus(n).then(o, i), setTimeout(function () {
              i(new Error('new manifest timeout'));
            }, t._checkTimeout);
          }
        });
      return new a(function (e, r) {
        a.all([
          n,
          t.getBundledManifest(),
          t.cache.list()
        ]).then(function (n) {
          var a = n[0], s = n[1], c = i(a.files);
          if (t.preventAutoUpdateLoop === !0 && c === t._lastUpdateFiles) {
            var l = i(Manifest.files);
            return t._lastUpdateFiles !== l && (console.warn('New manifest available, but an earlier update attempt failed. Will not download.'), t.corruptNewManifest = !0, e(null)), e(!1), void 0;
          }
          if (!a.files)
            return r(new Error('Downloaded Manifest has no "files" attribute.')), void 0;
          var d = n[2], u = t._createFilemap(o.files), c = t._createFilemap(a.files), p = t._createFilemap(s.files);
          t._toBeDownloaded = [], t._toBeCopied = [], t._toBeDeleted = [];
          var h = t.cache._fs.isCordova, f = 0;
          Object.keys(c).filter(function (e) {
            return !u[e] || u[e].version !== c[e].version || !t.cache.isCached(e);
          }).forEach(function (e) {
            h && p[e] && p[e].version === c[e].version ? t._toBeCopied.push(e) : t._toBeDownloaded.push(e), p[e] && p[e].version === c[e].version || f++;
          }), t._toBeDeleted = d.map(function (e) {
            return e.substr(t.cache.localRoot.length);
          }).filter(function (e) {
            return !c[e] || t._toBeDownloaded.indexOf(e) >= 0 || t._toBeCopied.indexOf(e) >= 0;
          }), f += t._toBeDeleted.length, f > 0 ? (t.newManifest = a, t.newManifest.root = t.cache.localUrl, e(!0)) : e(!1);
        }, function (e) {
          r(e);
        });
      });
    }, n.prototype.canDownload = function () {
      return !!this.newManifest && !this._updateReady;
    }, n.prototype.canUpdate = function () {
      return this._updateReady;
    }, n.prototype.download = function (e, t) {
      var o = this;
      return o.canDownload() ? (localStorage.removeItem('manifest'), this.manifest.files = Manifest.files = {}, o.cache.remove(o._toBeDeleted, !0).then(function () {
        return a.all(o._toBeCopied.map(function (e) {
          return o.cache._fs.download(s + e, o.cache.localRoot + e);
        }));
      }).then(function () {
        return o.allowServerRootFromManifest && o.newManifest.serverRoot && (o.cache.serverRoot = o.newManifest.serverRoot), o.cache.add(o._toBeDownloaded), o.cache.download(e, t);
      }).then(function () {
        return o._toBeDeleted = [], o._toBeDownloaded = [], o._updateReady = !0, o.newManifest;
      })) : new a(function (e) {
        e(null);
      });
    }, n.prototype.update = function (e) {
      return this._updateReady ? (localStorage.setItem('manifest', JSON.stringify(this.newManifest)), localStorage.setItem('last_update_files', i(this.newManifest.files)), localStorage.setItem('last_update_time', Date.now()), e !== !1 && location.reload(), !0) : !1;
    }, n.prototype.clear = function () {
      return localStorage.removeItem('last_update_files'), localStorage.removeItem('manifest'), this.cache.clear();
    }, n.prototype.reset = function () {
      return this.clear().then(function () {
        location.reload();
      }, function () {
        location.reload();
      });
    }, e.exports = n;
  },
  function (e, t, o) {
    function i(e) {
      var t = this;
      if (this._fs = e.fs, !this._fs)
        throw new Error('Missing required option "fs". Add an instance of cordova-promise-fs.');
      r = this._fs.Promise, this._mirrorMode = 'hash' !== e.mode, this._retry = e.retry || [
        500,
        1500,
        8000
      ], this._cacheBuster = !!e.cacheBuster, this.localRoot = this._fs.normalize(e.localRoot || 'data'), this.serverRoot = this._fs.normalize(e.serverRoot || ''), this._downloading = [], this._added = [], this._cached = {}, this.ready = this._fs.ensure(this.localRoot).then(function (e) {
        return t.localInternalURL = e.toInternalURL ? e.toInternalURL() : e.toURL(), t.localUrl = e.toURL(), t.list();
      });
    }
    var n = o(3), r = null;
    i.hash = n, i.prototype.list = function () {
      var e = this;
      return new r(function (t) {
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
    }, i.prototype.add = function (e) {
      e || (e = []), 'string' == typeof e && (e = [e]);
      var t = this;
      return e.forEach(function (e) {
        e = t.toServerURL(e), -1 === t._added.indexOf(e) && t._added.push(e);
      }), t.isDirty();
    }, i.prototype.remove = function (e, t) {
      e || (e = []);
      var o = [];
      'string' == typeof e && (e = [e]);
      var i = this;
      return e.forEach(function (e) {
        var t = i._added.indexOf(i.toServerURL(e));
        t >= 0 && i._added.splice(t, 1);
        var n = i.toPath(e);
        o.push(i._fs.remove(n)), delete i._cached[n];
      }), t ? r.all(o) : i.isDirty();
    }, i.prototype.getDownloadQueue = function () {
      var e = this, t = e._added.filter(function (t) {
          return !e.isCached(t);
        });
      return t;
    }, i.prototype.getAdded = function () {
      return this._added;
    }, i.prototype.isDirty = function () {
      return this.getDownloadQueue().length > 0;
    }, i.prototype.download = function (e, t) {
      var o = this._fs, i = this;
      return t = t || !1, i.abort(), new r(function (n, r) {
        o.ensure(i.localRoot).then(function () {
          return i.list();
        }).then(function () {
          if (!i.isDirty())
            return n(i), void 0;
          var a = i.getDownloadQueue(), s = i._downloading.length, c = i._downloading.length + a.length, l = 0, d = [];
          a.forEach(function (a) {
            var u = i.toPath(a);
            console.log(a, u);
            var p;
            'function' == typeof e && (p = function (t) {
              t.queueIndex = s, t.queueSize = c, t.url = a, t.path = u, t.percentage = s / c, t.loaded > 0 && t.total > 0 && s !== c && (t.percentage += t.loaded / t.total / c), t.percentage = Math.max(l, t.percentage), l = t.percentage, e(t);
            });
            var h = function () {
                s++, p && p(new ProgressEvent()), s === c && (i._downloading = [], i.list().then(function () {
                  p && p(new ProgressEvent()), i.isDirty() ? r(d) : n(i);
                }, r));
              }, f = function (e) {
                e && e.target && e.target.error && (e = e.target.error), d.push(e), h();
              }, v = a;
            i._cacheBuster && (v += '?' + Date.now());
            var m = o.download(v, u, { retry: i._retry }, t ? p : void 0);
            m.then(h, f), i._downloading.push(m);
          });
        }, r);
      });
    }, i.prototype.abort = function () {
      this._downloading.forEach(function (e) {
        e.abort();
      }), this._downloading = [];
    }, i.prototype.isCached = function (e) {
      return e = this.toPath(e), !!this._cached[e];
    }, i.prototype.clear = function () {
      var e = this;
      return this._cached = {}, this._fs.removeDir(this.localRoot).then(function () {
        return e._fs.ensure(e.localRoot);
      });
    }, i.prototype.toInternalURL = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toInternalURL : e;
    }, i.prototype.get = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toURL : this.toServerURL(e);
    }, i.prototype.toDataURL = function (e) {
      return this._fs.toDataURL(this.toPath(e));
    }, i.prototype.toURL = function (e) {
      var t = this.toPath(e);
      return this._cached[t] ? this._cached[t].toURL : e;
    }, i.prototype.toServerURL = function (e) {
      var e = this._fs.normalize(e);
      return e.indexOf('://') < 0 ? this.serverRoot + e : e;
    }, i.prototype.toPath = function (e) {
      if (this._mirrorMode) {
        var t = e.indexOf('?');
        t > -1 && (e = e.substr(0, t)), e = this._fs.normalize(e || '');
        var o = this.serverRoot.length;
        return e.substr(0, o) !== this.serverRoot ? this.localRoot + e : this.localRoot + e.substr(o);
      }
      var i = e.match(/\.[a-z]{1,}/g);
      return i = i ? i[i.length - 1] : '.txt', this.localRoot + n(e) + i;
    }, e.exports = i;
  },
  function (e) {
    function t(e, t) {
      var o, i, n, r, a, s, c, l;
      for (o = 3 & e.length, i = e.length - o, n = t, a = 3432918353, s = 461845907, l = 0; i > l;)
        c = 255 & e.charCodeAt(l) | (255 & e.charCodeAt(++l)) << 8 | (255 & e.charCodeAt(++l)) << 16 | (255 & e.charCodeAt(++l)) << 24, ++l, c = 4294967295 & (65535 & c) * a + ((65535 & (c >>> 16) * a) << 16), c = c << 15 | c >>> 17, c = 4294967295 & (65535 & c) * s + ((65535 & (c >>> 16) * s) << 16), n ^= c, n = n << 13 | n >>> 19, r = 4294967295 & 5 * (65535 & n) + ((65535 & 5 * (n >>> 16)) << 16), n = (65535 & r) + 27492 + ((65535 & (r >>> 16) + 58964) << 16);
      switch (c = 0, o) {
      case 3:
        c ^= (255 & e.charCodeAt(l + 2)) << 16;
      case 2:
        c ^= (255 & e.charCodeAt(l + 1)) << 8;
      case 1:
        c ^= 255 & e.charCodeAt(l), c = 4294967295 & (65535 & c) * a + ((65535 & (c >>> 16) * a) << 16), c = c << 15 | c >>> 17, c = 4294967295 & (65535 & c) * s + ((65535 & (c >>> 16) * s) << 16), n ^= c;
      }
      return n ^= e.length, n ^= n >>> 16, n = 4294967295 & 2246822507 * (65535 & n) + ((65535 & 2246822507 * (n >>> 16)) << 16), n ^= n >>> 13, n = 4294967295 & 3266489909 * (65535 & n) + ((65535 & 3266489909 * (n >>> 16)) << 16), n ^= n >>> 16, n >>> 0;
    }
    e.exports = t;
  },
  function (e) {
    function t(e, o, i, n) {
      e.getDirectory(o[0], { create: !0 }, function (e) {
        o.length > 1 ? t(e, o.slice(1), i, n) : i(e);
      }, n);
    }
    function o(e) {
      return e = e.substr(0, e.lastIndexOf('/') + 1), '/' === e[0] && (e = e.substr(1)), e;
    }
    function i(e) {
      return e.substr(e.lastIndexOf('/') + 1);
    }
    function n(e) {
      e = e || '', '/' === e[0] && (e = e.substr(1));
      for (var t = e.split('/'), o = t[0], i = 1; i < t.length; i++)
        o = t[i], '..' === t[i] ? (t.splice(i - 1, 2), i -= 2) : '.' === t[i] && (t.splice(i, 1), i--);
      return e = t.join('/'), './' === e ? e = '' : o && o.indexOf('.') < 0 && '/' != e[e.length - 1] && (e += '/'), e;
    }
    var r = [], a = 0;
    e.exports = function (e) {
      function s(e) {
        return new D(function (t) {
          return t(e);
        });
      }
      function c(e) {
        return new D(function (o, i) {
          return E.then(function (n) {
            e ? (e = e.split('/').filter(function (e) {
              return e && e.length > 0 && '.' !== e && '..' !== e;
            }), t(n.root, e, o, i)) : o(n.root);
          }, i);
        });
      }
      function l(e, t) {
        return new D(function (o, i) {
          return 'object' == typeof e ? o(e) : (e = n(e), t = t || {}, E.then(function (n) {
            n.root.getFile(e, t, o, i);
          }, i));
        });
      }
      function d(e, t) {
        return e = n(e), t = t || {}, new D(function (o, i) {
          return E.then(function (n) {
            e && '/' !== e ? n.root.getDirectory(e, t, o, i) : o(n.root);
          }, i);
        });
      }
      function u(e, t) {
        t = t || '';
        var o = t.indexOf('r') > -1, i = t.indexOf('e') > -1, n = t.indexOf('f') > -1, r = t.indexOf('d') > -1;
        return n && r && (n = !1, r = !1), new D(function (t, a) {
          return d(e).then(function (e) {
            var c = e.createReader();
            c.readEntries(function (e) {
              var c = [s(e)];
              o && e.filter(function (e) {
                return e.isDirectory;
              }).forEach(function (e) {
                c.push(u(e.fullPath, 're'));
              }), D.all(c).then(function (e) {
                var o = [];
                o = o.concat.apply(o, e), n && (o = o.filter(function (e) {
                  return e.isFile;
                })), r && (o = o.filter(function (e) {
                  return e.isDirectory;
                })), i || (o = o.map(function (e) {
                  return e.fullPath;
                })), t(o);
              }, a);
            }, a);
          }, a);
        });
      }
      function p(e) {
        return new D(function (t, o) {
          l(e).then(function (e) {
            t(e);
          }, function (e) {
            1 === e.code ? t(!1) : o(e);
          });
        });
      }
      function h(e) {
        return new D(function (t, o) {
          d(e).then(function (e) {
            t(e);
          }, function (e) {
            1 === e.code ? t(!1) : o(e);
          });
        });
      }
      function f(e) {
        return c(o(e)).then(function () {
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
          return new D(function (o, i) {
            e.file(function (e) {
              var i = new FileReader();
              i.onloadend = function () {
                o(this.result);
              }, i[t](e);
            }, i);
          });
        });
      }
      function g(e) {
        return m(e, 'readAsDataURL');
      }
      function w(e) {
        return m(e).then(JSON.parse);
      }
      function b(e, t, i) {
        return c(o(e)).then(function () {
          return l(e, { create: !0 });
        }).then(function (e) {
          return new D(function (o, n) {
            e.createWriter(function (e) {
              e.onwriteend = o, e.onerror = n, 'string' == typeof t ? t = y([t], i || 'text/plain') : t instanceof Blob != !0 && (t = y([JSON.stringify(t, null, 4)], i || 'application/json')), e.write(t);
            }, n);
          });
        });
      }
      function y(e, t) {
        var o, i;
        try {
          return new Blob(e, { type: t });
        } catch (n) {
          if (o = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)
            return i = new o(), i.append(e), i.getBlob(t);
          throw new Error('Unable to create blob');
        }
      }
      function k(e, t) {
        return c(o(t)).then(function (o) {
          return l(e).then(function (e) {
            return new D(function (n, r) {
              e.moveTo(o, i(t), n, r);
            });
          });
        });
      }
      function _(e, t) {
        return e = e.replace(/\/$/, ''), t = t.replace(/\/$/, ''), c(o(t)).then(function (o) {
          return d(e).then(function (e) {
            return new D(function (n, r) {
              e.moveTo(o, i(t), n, r);
            });
          });
        });
      }
      function x(e, t) {
        return c(o(t)).then(function (o) {
          return l(e).then(function (e) {
            return new D(function (n, r) {
              e.copyTo(o, i(t), n, r);
            });
          });
        });
      }
      function R(e, t) {
        var o = t ? l : p;
        return new D(function (t, i) {
          o(e).then(function (e) {
            e !== !1 ? e.remove(t, i) : t(1);
          }, i);
        }).then(function (e) {
          return 1 === e ? !1 : !0;
        });
      }
      function $(e) {
        return d(e).then(function (e) {
          return new D(function (t, o) {
            e.removeRecursively(t, o);
          });
        });
      }
      function C() {
        for (; r.length > 0 && a < e.concurrency;) {
          a++;
          var t = r.pop(), o = t.fileTransfer, i = t.isDownload, n = t.serverUrl, s = t.localPath, c = t.trustAllHosts, l = t.transferOptions, d = t.win, u = t.fail;
          o._aborted ? a-- : i ? (o.download.call(o, n, s, d, u, c, l), o.onprogress && o.onprogress(new ProgressEvent())) : o.upload.call(o, s, n, d, u, l, c);
        }
      }
      function S(e) {
        return a--, C(), e;
      }
      function T(t, o, n, s, c) {
        'function' == typeof s && (c = s, s = {}), P && n.indexOf('://') < 0 && (n = I(n)), s = s || {}, s.retry && s.retry.length || (s.retry = e.retry), s.retry = s.retry.concat(), s.file || t || (s.fileName = i(n));
        var l = new FileTransfer();
        c = c || s.onprogress, 'function' == typeof c && (l.onprogress = c);
        var d = new D(function (i, c) {
            var d = function (a) {
              if (0 === s.retry.length)
                e.debug && console.log('FileTransfer Error: ' + o, a), c(a);
              else {
                var u = {
                    fileTransfer: l,
                    isDownload: t,
                    serverUrl: o,
                    localPath: n,
                    trustAllHosts: s.trustAllHosts || !1,
                    transferOptions: s,
                    win: i,
                    fail: d
                  };
                r.unshift(u);
                var p = s.retry.shift();
                p > 0 ? setTimeout(S, p) : S();
              }
            };
            s.retry.unshift(0), a++, d();
          });
        return d.then(S, S), d.progress = function (e) {
          return l.onprogress = e, d;
        }, d.abort = function () {
          return l._aborted = !0, l.abort(), d;
        }, d;
      }
      function L(e, t, o, i) {
        return T(!0, e, t, o, i);
      }
      function A(e, t, o, i) {
        return T(!1, t, e, o, i);
      }
      var D = e.Promise || window.Promise;
      if (!D)
        throw new Error('No Promise library given in options.Promise');
      e = e || {}, e.persistent = void 0 !== e.persistent ? e.persistent : !0, e.storageSize = e.storageSize || 20971520, e.concurrency = e.concurrency || 3, e.retry = e.retry || [], e.debug = !!e.debug;
      var U, P = 'undefined' != typeof cordova;
      P ? U = new D(function (e, t) {
        document.addEventListener('deviceready', e, !1), setTimeout(function () {
          t(new Error('deviceready has not fired after 5 seconds.'));
        }, 5100);
      }) : (U = s(!0), 'undefined' != typeof webkitRequestFileSystem ? (window.requestFileSystem = webkitRequestFileSystem, window.FileTransfer = function () {
      }, FileTransfer.prototype.download = function (e, t, o, i) {
        var n = new XMLHttpRequest();
        return n.open('GET', e), n.responseType = 'blob', n.onreadystatechange = function () {
          4 == n.readyState && (200 !== n.status || this._aborted ? i(n.status) : b(t, n.response).then(o, i));
        }, n.send(), n;
      }, FileTransfer.prototype.abort = function () {
        this._aborted = !0;
      }, window.ProgressEvent = function () {
      }, window.FileEntry = function () {
      }) : window.requestFileSystem = function (e, t, o, i) {
        i(new Error('requestFileSystem not supported!'));
      });
      var E = new D(function (t, o) {
          U.then(function () {
            var i = e.persistent ? 1 : 0;
            e.fileSystem && P && (i = e.fileSystem), !P && 1 === i && navigator.webkitPersistentStorage ? navigator.webkitPersistentStorage.requestQuota(e.storageSize, function (e) {
              window.requestFileSystem(i, e, t, o);
            }, o) : isNaN(i) ? window.resolveLocalFileSystemURL(i, function (e) {
              t(e.filesystem);
            }, o) : window.requestFileSystem(i, e.storageSize, t, o), setTimeout(function () {
              o(new Error('Could not retrieve FileSystem after 5 seconds.'));
            }, 5100);
          }, o);
        });
      E.then(function (e) {
        F = e.root.toURL(), B = P ? e.root.toInternalURL() : F, window.__fs = e;
      }, function (e) {
        console.error('Could not get Cordova FileSystem:', e);
      });
      var M, j, I, B = 'cdvfile://localhost/' + (e.persistent ? 'persistent/' : 'temporary/'), F = '';
      return P ? (j = function (e) {
        return e = n(e), e.indexOf('://') < 0 ? B + e : e;
      }, I = function (e) {
        return e = n(e), e.indexOf('://') < 0 ? F + e : e;
      }, M = function (e) {
        return l(e).then(function (e) {
          return e.toInternalURL();
        });
      }) : (j = function (t) {
        return t = n(t), 'filesystem:' + location.origin + (e.persistent ? '/persistent/' : '/temporary/') + t;
      }, M = function (e) {
        return l(e).then(function (e) {
          return e.toURL();
        });
      }, I = j), {
        fs: E,
        normalize: n,
        file: l,
        filename: i,
        dir: d,
        dirname: o,
        create: f,
        read: m,
        readJSON: w,
        write: b,
        move: k,
        moveDir: _,
        copy: x,
        remove: R,
        removeDir: $,
        list: u,
        ensure: c,
        exists: p,
        existsDir: h,
        download: L,
        upload: A,
        toURL: v,
        toURLSync: I,
        isCordova: P,
        toInternalURLSync: j,
        toInternalURL: M,
        toDataURL: g,
        deviceready: U,
        options: e,
        Promise: D
      };
    };
  },
  function (e, t, o) {
    !function (t) {
      !function (o, i) {
        function n(e, t) {
          return (typeof t)[0] == e;
        }
        function r(e, t) {
          return t = function s(c, l, d, u, p, h) {
            function f(e) {
              return function (t) {
                p && (p = 0, s(n, e, t));
              };
            }
            if (u = s.q, c != n)
              return r(function (e, t) {
                u.push({
                  p: this,
                  r: e,
                  j: t,
                  1: c,
                  0: l
                });
              });
            if (d && n(o, d) | n(i, d))
              try {
                p = d.then;
              } catch (v) {
                l = 0, d = v;
              }
            if (n(o, p))
              try {
                p.call(d, f(1), l = f(0));
              } catch (v) {
                l(v);
              }
            else
              for (t = function (t, i) {
                  return n(o, t = l ? t : i) ? r(function (e, o) {
                    a(this, e, o, d, t);
                  }) : e;
                }, h = 0; h < u.length;)
                p = u[h++], n(o, c = p[l]) ? a(p.p, p.r, p.j, d, c) : (l ? p.r : p.j)(d);
          }, t.q = [], e.call(e = {
            then: function (e, o) {
              return t(e, o);
            },
            'catch': function (e) {
              return t(0, e);
            }
          }, function (e) {
            t(n, 1, e);
          }, function (e) {
            t(n, 0, e);
          }), e;
        }
        function a(e, r, a, s, c) {
          t(function () {
            try {
              s = c(s), c = s && n(i, s) | n(o, s) && s.then, n(o, c) ? s == e ? a(TypeError()) : c.call(s, r, a) : r(s);
            } catch (t) {
              a(t);
            }
          });
        }
        function s(e) {
          return r(function (t) {
            t(e);
          });
        }
        e.exports = r, r.resolve = s, r.reject = function (e) {
          return r(function (t, o) {
            o(e);
          });
        }, r.all = function (e) {
          return r(function (t, o, i, n) {
            n = [], i = e.length || t(n), e.map(function (e, r) {
              s(e).then(function (e) {
                n[r] = e, --i || t(n);
              }, o);
            });
          });
        };
      }('f', 'o');
    }.call(t, o(6).setImmediate);
  },
  function (e, t, o) {
    !function (e, i) {
      function n(e, t) {
        this._id = e, this._clearFn = t;
      }
      var r = o(7).nextTick, a = Function.prototype.apply, s = Array.prototype.slice, c = {}, l = 0;
      t.setTimeout = function () {
        return new n(a.call(setTimeout, window, arguments), clearTimeout);
      }, t.setInterval = function () {
        return new n(a.call(setInterval, window, arguments), clearInterval);
      }, t.clearTimeout = t.clearInterval = function (e) {
        e.close();
      }, n.prototype.unref = n.prototype.ref = function () {
      }, n.prototype.close = function () {
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
        var o = l++, i = arguments.length < 2 ? !1 : s.call(arguments, 1);
        return c[o] = !0, r(function () {
          c[o] && (i ? e.apply(null, i) : e.call(null), t.clearImmediate(o));
        }), o;
      }, t.clearImmediate = 'function' == typeof i ? i : function (e) {
        delete c[e];
      };
    }.call(t, o(6).setImmediate, o(6).clearImmediate);
  },
  function (e) {
    function t() {
      c = !1, r.length ? s = r.concat(s) : l = -1, s.length && o();
    }
    function o() {
      if (!c) {
        var e = setTimeout(t);
        c = !0;
        for (var o = s.length; o;) {
          for (r = s, s = []; ++l < o;)
            r && r[l].run();
          l = -1, o = s.length;
        }
        r = null, c = !1, clearTimeout(e);
      }
    }
    function i(e, t) {
      this.fun = e, this.array = t;
    }
    function n() {
    }
    var r, a = e.exports = {}, s = [], c = !1, l = -1;
    a.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
      s.push(new i(e, t)), 1 !== s.length || c || setTimeout(o, 0);
    }, i.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, a.title = 'browser', a.browser = !0, a.env = {}, a.argv = [], a.version = '', a.versions = {}, a.on = n, a.addListener = n, a.once = n, a.off = n, a.removeListener = n, a.removeAllListeners = n, a.emit = n, a.binding = function () {
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
    console.log('AppLoader: checking...'), i.check().then(function (e) {
      return console.log('AppLoader.check(): ', e), i.download();
    }).then(function (e) {
      return console.log('AppLoader.download(): ', e), i.update();
    }).then(function (e) {
      console.log('AppLoader.update(): ', e);
    }, function (e) {
      console.error('AppLoader error:', e);
    });
  }
  function t() {
    document.webkitHidden || e();
  }
  var o, i, n, r, a = 'undefined' != typeof cordova;
  if (n = document.querySelector('script[server]'), n && (r = n.getAttribute('server')), !r)
    throw new Error('Add a "server" attribute to the bootstrap.js script!');
  o = new CordovaPromiseFS({
    persistent: !0,
    fileSystem: a ? cordova.file.cacheDirectory : void 0,
    Promise: Promise
  }), i = new CordovaAppLoader({
    fs: o,
    localRoot: 'app',
    serverRoot: r,
    mode: 'mirror',
    cacheBuster: !0
  }), window.RELOADING_FOR_IOS10_BUGFIX || e(), o.deviceready.then(function () {
    document.addEventListener('resume', e);
  }), document.addEventListener('webkitvisibilitychange', t, !1), window.loader = i;
}();