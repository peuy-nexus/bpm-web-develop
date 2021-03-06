/*
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
/* eslint-disable */
var CryptoJS =
  CryptoJS ||
  (function(g, l) {
    var e = {},
      d = (e.lib = {}),
      m = function() {},
      k = (d.Base = {
        extend: function(a) {
          m.prototype = this;
          let c = new m();
          a && c.mixIn(a);
          c.hasOwnProperty("init") ||
            (c.init = function() {
              c.$super.init.apply(this, arguments);
            });
          c.init.prototype = c;
          c.$super = this;
          return c;
        },
        create: function() {
          let a = this.extend();
          a.init.apply(a, arguments);
          return a;
        },
        init: function() {},
        mixIn: function(a) {
          for (let c in a) {
            a.hasOwnProperty(c) && (this[c] = a[c]);
          }
          a.hasOwnProperty("toString") && (this.toString = a.toString);
        },
        clone: function() {
          return this.init.prototype.extend(this);
        },
      }),
      p = (d.WordArray = k.extend({
        init: function(a, c) {
          a = this.words = a || [];
          this.sigBytes = c != l ? c : 4 * a.length;
        },
        toString: function(a) {
          return (a || n).stringify(this);
        },
        concat: function(a) {
          let c = this.words,
            q = a.words,
            f = this.sigBytes;
          a = a.sigBytes;
          this.clamp();
          if (f % 4) {
            for (var b = 0; b < a; b++) {
              c[(f + b) >>> 2] |= ((q[b >>> 2] >>> (24 - 8 * (b % 4))) & 255) << (24 - 8 * ((f + b) % 4));
            }
          } else if (65535 < q.length) {
            for (b = 0; b < a; b += 4) {
              c[(f + b) >>> 2] = q[b >>> 2];
            }
          } else {
            c.push.apply(c, q);
          }
          this.sigBytes += a;
          return this;
        },
        clamp: function() {
          let a = this.words,
            c = this.sigBytes;
          a[c >>> 2] &= 4294967295 << (32 - 8 * (c % 4));
          a.length = g.ceil(c / 4);
        },
        clone: function() {
          let a = k.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function(a) {
          for (var c = [], b = 0; b < a; b += 4) {
            c.push((4294967296 * g.random()) | 0);
          }
          return new p.init(c, a);
        },
      })),
      b = (e.enc = {}),
      n = (b.Hex = {
        stringify: function(a) {
          let c = a.words;
          a = a.sigBytes;
          for (var b = [], f = 0; f < a; f++) {
            let d = (c[f >>> 2] >>> (24 - 8 * (f % 4))) & 255;
            b.push((d >>> 4).toString(16));
            b.push((d & 15).toString(16));
          }
          return b.join("");
        },
        parse: function(a) {
          for (var c = a.length, b = [], f = 0; f < c; f += 2) {
            b[f >>> 3] |= parseInt(a.substr(f, 2), 16) << (24 - 4 * (f % 8));
          }
          return new p.init(b, c / 2);
        },
      }),
      j = (b.Latin1 = {
        stringify: function(a) {
          let c = a.words;
          a = a.sigBytes;
          for (var b = [], f = 0; f < a; f++) {
            b.push(String.fromCharCode((c[f >>> 2] >>> (24 - 8 * (f % 4))) & 255));
          }
          return b.join("");
        },
        parse: function(a) {
          for (var c = a.length, b = [], f = 0; f < c; f++) {
            b[f >>> 2] |= (a.charCodeAt(f) & 255) << (24 - 8 * (f % 4));
          }
          return new p.init(b, c);
        },
      }),
      h = (b.Utf8 = {
        stringify: function(a) {
          try {
            return decodeURIComponent(escape(j.stringify(a)));
          } catch (c) {
            throw Error("Malformed UTF-8 data");
          }
        },
        parse: function(a) {
          return j.parse(unescape(encodeURIComponent(a)));
        },
      }),
      r = (d.BufferedBlockAlgorithm = k.extend({
        reset: function() {
          this._data = new p.init();
          this._nDataBytes = 0;
        },
        _append: function(a) {
          "string" === typeof a && (a = h.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function(a) {
          var c = this._data,
            b = c.words,
            f = c.sigBytes,
            d = this.blockSize,
            e = f / (4 * d),
            e = a ? g.ceil(e) : g.max((e | 0) - this._minBufferSize, 0);
          a = e * d;
          f = g.min(4 * a, f);
          if (a) {
            for (var k = 0; k < a; k += d) {
              this._doProcessBlock(b, k);
            }
            k = b.splice(0, a);
            c.sigBytes -= f;
          }
          return new p.init(k, f);
        },
        clone: function() {
          let a = k.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0,
      }));
    d.Hasher = r.extend({
      cfg: k.extend(),
      init: function(a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      },
      reset: function() {
        r.reset.call(this);
        this._doReset();
      },
      update: function(a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function(a) {
        a && this._append(a);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function(a) {
        return function(b, d) {
          return new a.init(d).finalize(b);
        };
      },
      _createHmacHelper: function(a) {
        return function(b, d) {
          return new s.HMAC.init(a, d).finalize(b);
        };
      },
    });
    var s = (e.algo = {});
    return e;
  })(Math);
(function() {
  var g = CryptoJS,
    l = g.lib,
    e = l.WordArray,
    d = l.Hasher,
    m = [],
    l = (g.algo.SHA1 = d.extend({
      _doReset: function() {
        this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      },
      _doProcessBlock: function(d, e) {
        for (var b = this._hash.words, n = b[0], j = b[1], h = b[2], g = b[3], l = b[4], a = 0; 80 > a; a++) {
          if (16 > a) {
            m[a] = d[e + a] | 0;
          } else {
            var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16];
            m[a] = (c << 1) | (c >>> 31);
          }
          c = ((n << 5) | (n >>> 27)) + l + m[a];
          c =
            20 > a
              ? c + (((j & h) | (~j & g)) + 1518500249)
              : 40 > a
              ? c + ((j ^ h ^ g) + 1859775393)
              : 60 > a
              ? c + (((j & h) | (j & g) | (h & g)) - 1894007588)
              : c + ((j ^ h ^ g) - 899497514);
          l = g;
          g = h;
          h = (j << 30) | (j >>> 2);
          j = n;
          n = c;
        }
        b[0] = (b[0] + n) | 0;
        b[1] = (b[1] + j) | 0;
        b[2] = (b[2] + h) | 0;
        b[3] = (b[3] + g) | 0;
        b[4] = (b[4] + l) | 0;
      },
      _doFinalize: function() {
        let d = this._data,
          e = d.words,
          b = 8 * this._nDataBytes,
          g = 8 * d.sigBytes;
        e[g >>> 5] |= 128 << (24 - (g % 32));
        e[(((g + 64) >>> 9) << 4) + 14] = Math.floor(b / 4294967296);
        e[(((g + 64) >>> 9) << 4) + 15] = b;
        d.sigBytes = 4 * e.length;
        this._process();
        return this._hash;
      },
      clone: function() {
        let e = d.clone.call(this);
        e._hash = this._hash.clone();
        return e;
      },
    }));
  g.SHA1 = d._createHelper(l);
  g.HmacSHA1 = d._createHmacHelper(l);
})();
(function() {
  let g = CryptoJS,
    l = g.enc.Utf8;
  g.algo.HMAC = g.lib.Base.extend({
    init: function(e, d) {
      e = this._hasher = new e.init();
      "string" === typeof d && (d = l.parse(d));
      let g = e.blockSize,
        k = 4 * g;
      d.sigBytes > k && (d = e.finalize(d));
      d.clamp();
      for (
        var p = (this._oKey = d.clone()), b = (this._iKey = d.clone()), n = p.words, j = b.words, h = 0;
        h < g;
        h++
      ) {
        (n[h] ^= 1549556828), (j[h] ^= 909522486);
      }
      p.sigBytes = b.sigBytes = k;
      this.reset();
    },
    reset: function() {
      let e = this._hasher;
      e.reset();
      e.update(this._iKey);
    },
    update: function(e) {
      this._hasher.update(e);
      return this;
    },
    finalize: function(e) {
      let d = this._hasher;
      e = d.finalize(e);
      d.reset();
      return d.finalize(this._oKey.clone().concat(e));
    },
  });
})();

// CryptoJS Base
(function() {
  let C = CryptoJS;
  let C_lib = C.lib;
  let WordArray = C_lib.WordArray;
  let C_enc = C.enc;
  C_enc.Base64 = {
    stringify: function(wordArray) {
      let words = wordArray.words;
      let sigBytes = wordArray.sigBytes;
      let map = this._map;
      wordArray.clamp();
      let base64Chars = [];
      for (let i = 0; i < sigBytes; i += 3) {
        let byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        let byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
        let byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
        let triplet = (byte1 << 16) | (byte2 << 8) | byte3;
        for (let j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
          base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
        }
      }
      let paddingChar = map.charAt(64);
      if (paddingChar) {
        while (base64Chars.length % 4) {
          base64Chars.push(paddingChar);
        }
      }
      return base64Chars.join("");
    },
    parse: function(base64Str) {
      let base64StrLength = base64Str.length;
      let map = this._map;
      let paddingChar = map.charAt(64);
      if (paddingChar) {
        let paddingIndex = base64Str.indexOf(paddingChar);
        if (paddingIndex != -1) {
          base64StrLength = paddingIndex;
        }
      }
      let words = [];
      let nBytes = 0;
      for (let i = 0; i < base64StrLength; i++) {
        if (i % 4) {
          let bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
          let bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
          words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
          nBytes++;
        }
      }
      return WordArray.create(words, nBytes);
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  };
})();

// ??? cam ??????????????? url encode
function camSafeUrlEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

// v4 ??????
let CosAuthV4 = function(opt) {
  let pathname = opt.Pathname || "/";
  let expires = opt.Expires;

  let ShortBucketName = "";
  let AppId = "";
  let match = opt.Bucket.match(/^(.+)-(\d+)$/);
  if (match) {
    ShortBucketName = match[1];
    AppId = match[2];
  }

  let random = parseInt(Math.random() * Math.pow(2, 32));
  let now = parseInt(Date.now() / 1000);
  let e = now + (expires === undefined ? 900 : Number(expires) || 0); // ??????????????????????????????????????? + 900s
  let path = "/" + AppId + "/" + ShortBucketName + encodeURIComponent(pathname).replace(/%2F/g, "/"); //????????????????????????
  let plainText =
    "a=" +
    AppId +
    "&b=" +
    ShortBucketName +
    "&k=" +
    opt.SecretId +
    "&e=" +
    e +
    "&t=" +
    now +
    "&r=" +
    random +
    "&f=" +
    path;
  let sha1Res = CryptoJS.HmacSHA1(plainText, opt.SecretKey);
  let strWordArray = CryptoJS.enc.Utf8.parse(plainText);
  let resWordArray = sha1Res.concat(strWordArray);
  let sign = resWordArray.toString(CryptoJS.enc.Base64);

  return sign;
};

// v5 ??????
let CosAuth = function(opt) {
  if (!opt.SecretId) {
    return console.error("missing param SecretId");
  }
  if (!opt.SecretKey) {
    return console.error("missing param SecretKey");
  }

  if (opt.Version === "4.0") {
    return CosAuthV4(opt);
  }

  opt = opt || {};

  let SecretId = opt.SecretId;
  let SecretKey = opt.SecretKey;
  let method = (opt.Method || "get").toLowerCase();
  let query = opt.Query || {};
  let headers = opt.Headers || {};
  let pathname = opt.Pathname || "/";
  let expires = opt.Expires;

  let getObjectKeys = function(obj) {
    let list = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        list.push(key);
      }
    }
    return list.sort(function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      return a === b ? 0 : a > b ? 1 : -1;
    });
  };

  let obj2str = function(obj) {
    let i, key, val;
    let list = [];
    let keyList = getObjectKeys(obj);
    for (i = 0; i < keyList.length; i++) {
      key = keyList[i];
      val = obj[key] === undefined || obj[key] === null ? "" : String(obj[key]);
      key = key.toLowerCase();
      key = camSafeUrlEncode(key);
      val = camSafeUrlEncode(val) || "";
      list.push(key + "=" + val);
    }
    return list.join("&");
  };

  // ????????????????????????
  let now = parseInt(new Date().getTime() / 1000) - 1;
  let exp = now + (expires === undefined ? 900 : Number(expires) || 0); // ??????????????????????????????????????? + 900s

  // ???????????? Authorization ????????????
  let qSignAlgorithm = "sha1";
  let qAk = SecretId;
  let qSignTime = now + ";" + exp;
  let qKeyTime = now + ";" + exp;
  let qHeaderList = getObjectKeys(headers)
    .join(";")
    .toLowerCase();
  let qUrlParamList = getObjectKeys(query)
    .join(";")
    .toLowerCase();

  // ???????????????????????????https://www.qcloud.com/document/product/436/7778
  // ?????????????????? SignKey
  let signKey = CryptoJS.HmacSHA1(qKeyTime, SecretKey).toString();

  // ?????????????????? FormatString
  let formatString = [method, pathname, obj2str(query), obj2str(headers), ""].join("\n");

  // ?????????????????? StringToSign
  let stringToSign = ["sha1", qSignTime, CryptoJS.SHA1(formatString).toString(), ""].join("\n");

  // ?????????????????? Signature
  let qSignature = CryptoJS.HmacSHA1(stringToSign, signKey).toString();

  // ?????????????????? Authorization
  let authorization = [
    "q-sign-algorithm=" + qSignAlgorithm,
    "q-ak=" + qAk,
    "q-sign-time=" + qSignTime,
    "q-key-time=" + qKeyTime,
    "q-header-list=" + qHeaderList,
    "q-url-param-list=" + qUrlParamList,
    "q-signature=" + qSignature,
  ].join("&");

  return authorization;
};

export { CosAuth };
