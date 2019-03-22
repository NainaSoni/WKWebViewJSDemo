/*
 2010-2017 BigTinCan Mobile Pty Ltd
 @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
*/
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (e) { return typeof e } : function (e) { return e && "function" === typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e }, _createClass = function () { function e(a, b) { for (var c = 0; c < b.length; c++) { var d = b[c]; d.enumerable = d.enumerable || !1; d.configurable = !0; "value" in d && (d.writable = !0); Object.defineProperty(a, d.key, d) } } return function (a, b, c) { b && e(a.prototype, b); c && e(a, c); return a } }();
function _classCallCheck(e, a) { if (!(e instanceof a)) throw new TypeError("Cannot call a class as a function"); }
var BTCAClient = function () {
    function e(a) {
        _classCallCheck(this, e); a.handle || console.warn("Please set a `handle` for your BTCA."); this.logBanner = "######### BTCJSBridge 3.0 Message #########:  \n"; this.btcjsapiRequestSchema = "btcjsapi://"; this.btcjsapiOperations = []; this.cache = !1; this.callbackActionPrefix = "BTCA_CB_"; this.disableEvents = !1; this.jsListeners = {}; this.handle = "BTCAClient_" + this.generateUUID(); this.log = !1; this.pmSource = "btc-js-bridge"; this.parentUrl = "*"; this.requestMethod = "postMessage"; for (var b in a) switch (b) {
            case "handle": this.handle =
                a[b] + "_" + this.generateUUID(); break; default: this[b] = a[b]
        }this.init()
    } _createClass(e, [{
        key: "init", value: function () {
            var a = this; window && window.document && "complete" !== window.document.readyState ? window.addEventListener("load", function () { a.createEvents() }) : this.createEvents(); this.params = this.parseQuery(window.location.search); this.params.referrer && this.params.action && "postMessage" === this.params.action && (this.requestMethod = "postMessage", this.parentUrl = this.params.referrer, this.createMessageListener()); this.logMessage(this.logBanner +
                "requestMethod: " + this.requestMethod)
        }
    }, {
        key: "createEvents", value: function () {
            var a = this; if (!this.disableEvents) {
                var b = document.body.getElementsByTagName("a"); b.length && Array.prototype.forEach.call(b, function (b) {
                    var c = b.getAttribute("href"); if (!c || 0 === c.indexOf("#")) return !1; 0 === c.indexOf(a.btcjsapiRequestSchema) ? b.addEventListener("click", function (c) { c.preventDefault(); a.send(b.getAttribute("href")) }) : 0 === c.indexOf("mailto:") ? b.addEventListener("click", function (c) {
                        c.preventDefault(); c = b.getAttribute("href");
                        c = a.parseMailtoUrl(c); c = { action: "sendEmail", params: c, requestString: "btcjsapi://sendEmail?" + a.serialize(c.data) }; a.makeRequest(c)
                    }) : b.addEventListener("click", function (c) {
                        var d = b.getAttribute("href"), e = b.getAttribute("target"), k = b.getAttribute("title"), l = "btcjsapi://openURL?url\x3d" + d, g = b.getAttribute("rel"); g || 0 !== d.indexOf("/") ? g || 0 !== d.indexOf("http") || (g = "external") : g = "app"; ("app" === g || "external" === g || e) && c.preventDefault(); a.makeRequest({
                            action: "openURL", params: { url: d, rel: g, target: e, title: k },
                            requestString: l
                        })
                    })
                })
            }
        }
    }, { key: "btcDebugger", value: function (a) { a = this.parseJsonData(a); null !== a && a.error.message && this.logMessage(this.logBanner + "debug error message: " + a.error.message) } }, { key: "requestTriggerBeforeFunction", value: function (a) { this.logMessage(this.logBanner + "trigger before requestString: " + a) } }, { key: "defaultJSListener", value: function (a, b, c, d) { this.logMessage(this.logBanner + "response from request: " + JSON.stringify(a, null, "  ")) } }, {
        key: "createMessageListener", value: function () {
            var a = this;
            window.addEventListener("message", function (b) { a.handlePostMessage(b.data, b) })
        }
    }, { key: "logMessage", value: function (a) { !0 === this.log && console.log(a) } }, { key: "parseJsonData", value: function (a) { if (a) try { return JSON.parse(a) } catch (b) { return this.logMessage(this.logBanner + "json error on parsing data: " + a), console.log(a), null } else return null } }, {
        key: "unescapeHtml", value: function (a) {
            if ("function" !== typeof DOMParser) { var b = document.createElement("div"); b.innerHTML = a; return 0 === b.childNodes.length ? "" : b.childNodes[0].nodeValue } return (new DOMParser).parseFromString(a,
                "text/html").documentElement.textContent
        }
    }, { key: "escapeHtml", value: function (a) { var b = { "\x26": "\x26amp;", "\x3c": "\x26lt;", "\x3e": "\x26gt;", '"': "\x26quot;", "'": "\x26#039;" }; return a.replace(/[&<>"']/g, function (a) { return b[a] }) } }, { key: "parseApiUrl", value: function (a) { var b = this.unescapeHtml(a).split(this.btcjsapiRequestSchema)[1].split("?"); a = b[0]; b = this.parseQuery(b[1]); var c = null; b && b.jsListener && (c = b.jsListener, delete b.jsListener); return { action: a, params: b, jsListener: c } } }, {
        key: "parseMailtoUrl", value: function (a) {
            var b =
                {}; a = a.split("mailto:")[1]; var c = "", d = ""; 10 < a.indexOf("?") && (b = a.split("?"), recipients = b[0], b = this.parseQuery(b[1]), a = recipients.replace(/\s/g, "").split(","), c = b.cc.replace(/\s/g, "").split(","), d = b.bcc.replace(/\s/g, "").split(",")); return { to: a, cc: c, bcc: d, subject: b.subject || "", body: b.body || "" }
        }
    }, {
        key: "parseQuery", value: function (a) {
            var b = {}; if (!a) return b; a = ("?" === a[0] ? a.substr(1) : a).split("\x26"); for (var c = 0; c < a.length; c++) {
                var d = a[c].split("\x3d"); b[decodeURIComponent(d[0])] = decodeURIComponent(d[1] ||
                    "")
            } return b
        }
    }, { key: "serialize", value: function (a, b) { var c = [], d = void 0; for (d in a) if (a.hasOwnProperty(d)) { var e = b ? b + "[" + d + "]" : d, f = a[d]; c.push(null !== f && "object" === ("undefined" === typeof f ? "undefined" : _typeof(f)) ? this.serialize(f, e) : encodeURIComponent(e) + "\x3d" + encodeURIComponent(f)) } return c.join("\x26") } }, {
        key: "generateUUID", value: function () {
            for (var a = [], b = 0; 256 > b; b++)a[b] = (16 > b ? "0" : "") + b.toString(16); b = 4294967295 * Math.random() | 0; var c = 4294967295 * Math.random() | 0, d = 4294967295 * Math.random() | 0, e = 4294967295 *
                Math.random() | 0; return a[b & 255] + a[b >> 8 & 255] + a[b >> 16 & 255] + a[b >> 24 & 255] + "-" + a[c & 255] + a[c >> 8 & 255] + "-" + a[c >> 16 & 15 | 64] + a[c >> 24 & 255] + "-" + a[d & 63 | 128] + a[d >> 8 & 255] + "-" + a[d >> 16 & 255] + a[d >> 24 & 255] + a[e & 255] + a[e >> 8 & 255] + a[e >> 16 & 255] + a[e >> 24 & 255]
        }
    }, { key: "makeRequest", value: function (a) { this.requestTriggerBeforeFunction(a.requestString); a = this.finalRequestPreparation(a); "postMessage" === this.requestMethod ? this.postMessageRequest(a) : this.iframeRequestCall(a.requestString) } }, {
        key: "finalRequestPreparation", value: function (a) {
            var b =
                this.connectionQuerySymbol(a.requestString), c = this.btcjsapiOperations.length; a.requestString += b + "requestId\x3d" + c; a.requestId = c; this.btcjsapiOperations.push({ requestData: a, responseData: "" }); return a
        }
    }, { key: "connectionQuerySymbol", value: function (a) { return -1 < a.indexOf("?") ? "\x26" : "?" } }, {
        key: "iframeRequestCall", value: function (a) {
            a = a.replace("jsListener", "originalJsListener"); a = this.btcjsapiRequestSchema + (a + "\x26jsListener\x3dresponseFromRequest"); this.logMessage(this.logBanner + "request making: " + a);
            var b = document.createElement("iframe"); b.setAttribute("src", a); document.documentElement.appendChild(b); b.parentNode.removeChild(b)
        }
    }, { key: "postMessageRequest", value: function (a) { a = { action: "request", data: a, handle: this.handle, parentUrl: this.parentUrl, source: this.pmSource }; this.logMessage(this.logBanner + "postMessage: " + JSON.stringify(a, null, "  ")); try { window.parent.postMessage(a, this.parentUrl) } catch (b) { this.responseFromRequest({ result: null, error: { code: 99, message: "Not in iframe" }, originalRequest: a.data }) } } },
    { key: "handlePostMessage", value: function (a, b) { if (!a) return !1; a && "string" === typeof a && (a = this.parseJsonData(a)); if (!a.originalRequest || a.originalRequest.source !== this.pmSource) return !1; this.responseFromRequest(a) } }, {
        key: "responseFromRequest", value: function (a) {
            this.logMessage(this.logBanner + "got response: " + JSON.stringify(a, null, "  ")); var b = a.originalRequest.data.requestId, c = a.originalRequest.data.jsListener, d = a.error, e = a.result, f = this.jsListeners[c], h = this.btcjsapiOperations[b]; "undefined" !== typeof h &&
                this.cache && (h.responseData = a, this.btcjsapiOperations[b] = h); f && "function" === typeof f && f(e, b, d); c && 0 === c.indexOf(this.callbackActionPrefix) && delete this.jsListeners[c]; this.defaultJSListener(a, e, b, d)
        }
    }, {
        key: "send", value: function (a, b) {
            var c = a, d = ""; if (!a) throw Error("`data` must be passed as first parameter to send()"); if ("string" === typeof a) if (0 === a.indexOf(this.btcjsapiRequestSchema)) d = a.replace(this.btcjsapiRequestSchema, ""), c = this.parseApiUrl(c); else throw Error("Invalid request string string provided");
            if (!c.action) throw Error("`data` must have an `action`"); b ? (a = "function" !== typeof b || b.name ? "function" === typeof b ? b.name : b : this.callbackActionPrefix + this.generateUUID(), c.jsListener = a, this.jsListeners[c.jsListener] = b) : c.jsListener && window[c.jsListener] && (this.jsListeners[c.jsListener] = window[c.jsListener]); if ("function" !== typeof this.jsListeners[c.jsListener]) throw Error("Invalid callback/jsListener defined. Must be a function or function reference."); d || (b = this.serialize(c.param), d = c.action, b && (d +=
                "?" + b), c.jsListener && (d += (b ? "\x26" : "?") + "jsListener\x3d" + (c.jsListener.name || c.jsListener))); this.makeRequest({ action: c.action, params: c.params, jsListener: c.jsListener ? c.jsListener.name || c.jsListener : null, requestString: d })
        }
    }, { key: "getRequest", value: function (a) { if (void 0 === ("undefined" === typeof a ? "undefined" : _typeof(a))) return this.btcjsapiOperations; (a = this.btcjsapiOperations[a]) || this.logMessage("No history found, please make sure cache is enabled."); return a } }]); return e
}();
(function (e, a) { "function" === typeof define && define.amd ? define([], a) : "object" === ("undefined" === typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = a() : e.returnExports = a() })(this, function () { return BTCAClient });
