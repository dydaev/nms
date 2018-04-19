!function(e){function n(e){var n=require("./"+e+"."+t+".hot-update.js");!function(e,n){if(!w[e]||!m[e])return;for(var r in m[e]=!1,n)Object.prototype.hasOwnProperty.call(n,r)&&(f[r]=n[r]);0==--v&&0===g&&x()}(n.id,n.modules)}var r,o=!0,t="8827b5ddb5052d6db58e",i={},c=[],d=[];function s(e){var n=H[e];if(!n)return D;var o=function(o){return n.hot.active?(H[o]?H[o].parents.includes(e)||H[o].parents.push(e):(c=[e],r=o),n.children.includes(o)||n.children.push(o)):(console.warn("[HMR] unexpected require("+o+") from disposed module "+e),c=[]),D(o)},t=function(e){return{configurable:!0,enumerable:!0,get:function(){return D[e]},set:function(n){D[e]=n}}};for(var i in D)Object.prototype.hasOwnProperty.call(D,i)&&"e"!==i&&Object.defineProperty(o,i,t(i));return o.e=function(e){return"ready"===l&&u("prepare"),g++,D.e(e).then(n,function(e){throw n(),e});function n(){g--,"prepare"===l&&(y[e]||j(e),0===g&&0===v&&x())}},o}var a=[],l="idle";function u(e){l=e;for(var n=0;n<a.length;n++)a[n].call(null,e)}var p,f,h,v=0,g=0,y={},m={},w={};function b(e){return+e+""===e?+e:e}function _(e){if("idle"!==l)throw new Error("check() is only allowed in idle status");return o=e,u("check"),function(){try{var e=require("./"+t+".hot-update.json")}catch(e){return Promise.resolve()}return Promise.resolve(e)}().then(function(e){if(!e)return u("idle"),null;m={},y={},w=e.c,h=e.h,u("prepare");var n=new Promise(function(e,n){p={resolve:e,reject:n}});f={};return j(0),"prepare"===l&&0===g&&0===v&&x(),n})}function j(e){w[e]?(m[e]=!0,v++,n(e)):y[e]=!0}function x(){u("ready");var e=p;if(p=null,e)if(o)Promise.resolve().then(function(){return O(o)}).then(function(n){e.resolve(n)},function(n){e.reject(n)});else{var n=[];for(var r in f)Object.prototype.hasOwnProperty.call(f,r)&&n.push(b(r));e.resolve(n)}}function O(n){if("ready"!==l)throw new Error("apply() is only allowed in ready status");var r,o,d,s,a;function p(e){for(var n=[e],r={},o=n.slice().map(function(e){return{chain:[e],id:e}});o.length>0;){var t=o.pop(),i=t.id,c=t.chain;if((s=H[i])&&!s.hot._selfAccepted){if(s.hot._selfDeclined)return{type:"self-declined",chain:c,moduleId:i};if(s.hot._main)return{type:"unaccepted",chain:c,moduleId:i};for(var d=0;d<s.parents.length;d++){var a=s.parents[d],l=H[a];if(l){if(l.hot._declinedDependencies[i])return{type:"declined",chain:c.concat([a]),moduleId:i,parentId:a};n.includes(a)||(l.hot._acceptedDependencies[i]?(r[a]||(r[a]=[]),v(r[a],[i])):(delete r[a],n.push(a),o.push({chain:c.concat([a]),id:a})))}}}}return{type:"accepted",moduleId:e,outdatedModules:n,outdatedDependencies:r}}function v(e,n){for(var r=0;r<n.length;r++){var o=n[r];e.includes(o)||e.push(o)}}n=n||{};var g={},y=[],m={},_=function(){console.warn("[HMR] unexpected require("+x.moduleId+") to disposed module")};for(var j in f)if(Object.prototype.hasOwnProperty.call(f,j)){var x;a=b(j);var O=!1,E=!1,k=!1,M="";switch((x=f[j]?p(a):{type:"disposed",moduleId:j}).chain&&(M="\nUpdate propagation: "+x.chain.join(" -> ")),x.type){case"self-declined":n.onDeclined&&n.onDeclined(x),n.ignoreDeclined||(O=new Error("Aborted because of self decline: "+x.moduleId+M));break;case"declined":n.onDeclined&&n.onDeclined(x),n.ignoreDeclined||(O=new Error("Aborted because of declined dependency: "+x.moduleId+" in "+x.parentId+M));break;case"unaccepted":n.onUnaccepted&&n.onUnaccepted(x),n.ignoreUnaccepted||(O=new Error("Aborted because "+a+" is not accepted"+M));break;case"accepted":n.onAccepted&&n.onAccepted(x),E=!0;break;case"disposed":n.onDisposed&&n.onDisposed(x),k=!0;break;default:throw new Error("Unexception type "+x.type)}if(O)return u("abort"),Promise.reject(O);if(E)for(a in m[a]=f[a],v(y,x.outdatedModules),x.outdatedDependencies)Object.prototype.hasOwnProperty.call(x.outdatedDependencies,a)&&(g[a]||(g[a]=[]),v(g[a],x.outdatedDependencies[a]));k&&(v(y,[x.moduleId]),m[a]=_)}var P,I=[];for(o=0;o<y.length;o++)a=y[o],H[a]&&H[a].hot._selfAccepted&&I.push({module:a,errorHandler:H[a].hot._selfAccepted});u("dispose"),Object.keys(w).forEach(function(e){!1===w[e]&&function(e){delete installedChunks[e]}(e)});for(var R,A,q=y.slice();q.length>0;)if(a=q.pop(),s=H[a]){var U={},C=s.hot._disposeHandlers;for(d=0;d<C.length;d++)(r=C[d])(U);for(i[a]=U,s.hot.active=!1,delete H[a],delete g[a],d=0;d<s.children.length;d++){var L=H[s.children[d]];L&&((P=L.parents.indexOf(a))>=0&&L.parents.splice(P,1))}}for(a in g)if(Object.prototype.hasOwnProperty.call(g,a)&&(s=H[a]))for(A=g[a],d=0;d<A.length;d++)R=A[d],(P=s.children.indexOf(R))>=0&&s.children.splice(P,1);for(a in u("apply"),t=h,m)Object.prototype.hasOwnProperty.call(m,a)&&(e[a]=m[a]);var S=null;for(a in g)if(Object.prototype.hasOwnProperty.call(g,a)&&(s=H[a])){A=g[a];var N=[];for(o=0;o<A.length;o++)if(R=A[o],r=s.hot._acceptedDependencies[R]){if(N.includes(r))continue;N.push(r)}for(o=0;o<N.length;o++){r=N[o];try{r(A)}catch(e){n.onErrored&&n.onErrored({type:"accept-errored",moduleId:a,dependencyId:A[o],error:e}),n.ignoreErrored||S||(S=e)}}}for(o=0;o<I.length;o++){var T=I[o];a=T.module,c=[a];try{D(a)}catch(e){if("function"==typeof T.errorHandler)try{T.errorHandler(e)}catch(r){n.onErrored&&n.onErrored({type:"self-accept-error-handler-errored",moduleId:a,error:r,originalError:e}),n.ignoreErrored||S||(S=r),S||(S=e)}else n.onErrored&&n.onErrored({type:"self-accept-errored",moduleId:a,error:e}),n.ignoreErrored||S||(S=e)}}return S?(u("fail"),Promise.reject(S)):(u("idle"),new Promise(function(e){e(y)}))}var H={};function D(n){if(H[n])return H[n].exports;var o=H[n]={i:n,l:!1,exports:{},hot:function(e){var n={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:r!==e,active:!0,accept:function(e,r){if(void 0===e)n._selfAccepted=!0;else if("function"==typeof e)n._selfAccepted=e;else if("object"==typeof e)for(var o=0;o<e.length;o++)n._acceptedDependencies[e[o]]=r||function(){};else n._acceptedDependencies[e]=r||function(){}},decline:function(e){if(void 0===e)n._selfDeclined=!0;else if("object"==typeof e)for(var r=0;r<e.length;r++)n._declinedDependencies[e[r]]=!0;else n._declinedDependencies[e]=!0},dispose:function(e){n._disposeHandlers.push(e)},addDisposeHandler:function(e){n._disposeHandlers.push(e)},removeDisposeHandler:function(e){var r=n._disposeHandlers.indexOf(e);r>=0&&n._disposeHandlers.splice(r,1)},check:_,apply:O,status:function(e){if(!e)return l;a.push(e)},addStatusHandler:function(e){a.push(e)},removeStatusHandler:function(e){var n=a.indexOf(e);n>=0&&a.splice(n,1)},data:i[e]};return r=void 0,n}(n),parents:(d=c,c=[],d),children:[]};return e[n].call(o.exports,o,o.exports,s(n)),o.l=!0,o.exports}D.m=e,D.c=H,D.d=function(e,n,r){D.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},D.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},D.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return D.d(n,"a",n),n},D.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},D.p="",D.w={},D.h=function(){return t},s(0)(D.s=0)}({"./node_modules/webpack/hot/log-apply-result.js":function(e,n,r){e.exports=function(e,n){var o=e.filter(function(e){return n&&n.indexOf(e)<0}),t=r("./node_modules/webpack/hot/log.js");(o.length>0&&(t("warning","[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"),o.forEach(function(e){t("warning","[HMR]  - "+e)})),n&&0!==n.length)?(t("info","[HMR] Updated modules:"),n.forEach(function(e){if("string"==typeof e&&-1!==e.indexOf("!")){var n=e.split("!");t.groupCollapsed("info","[HMR]  - "+n.pop()),t("info","[HMR]  - "+e),t.groupEnd("info")}else t("info","[HMR]  - "+e)}),n.every(function(e){return"number"==typeof e})&&t("info","[HMR] Consider using the NamedModulesPlugin for module names.")):t("info","[HMR] Nothing hot updated.")}},"./node_modules/webpack/hot/log.js":function(e,n){var r="info";function o(){}function t(e){return"info"===r&&"info"===e||["info","warning"].indexOf(r)>=0&&"warning"===e||["info","warning","error"].indexOf(r)>=0&&"error"===e}function i(e){return function(n,r){t(n)&&e(r)}}e.exports=function(e,n){t(e)&&("info"===e?console.log(n):"warning"===e?console.warn(n):"error"===e&&console.error(n))};var c=console.group||o,d=console.groupCollapsed||o,s=console.groupEnd||o;e.exports.group=i(c),e.exports.groupCollapsed=i(d),e.exports.groupEnd=i(s),e.exports.setLogLevel=function(e){r=e}},"./node_modules/webpack/hot/poll.js?1000":function(e,n,r){(function(n){var o=+n.substr(1)||6e5,t=r("./node_modules/webpack/hot/log.js");setInterval(function n(o){"idle"===e.hot.status()&&e.hot.check(!0).then(function(e){e?(r("./node_modules/webpack/hot/log-apply-result.js")(e,e),n(!0)):o&&t("info","[HMR] Update applied.")}).catch(function(n){var r=e.hot.status();["abort","fail"].indexOf(r)>=0?(t("warning","[HMR] Cannot apply update."),t("warning","[HMR] "+n.stack||n.message),t("warning","[HMR] You need to restart the application!")):t("warning","[HMR] Update failed: "+n.stack||n.message)})},o)}).call(this,"?1000")},"./src/server/index.js":function(e,n,r){"use strict";r.r(n);var o=r("http"),t=r.n(o),i=r("./src/server/server.js"),c=t.a.createServer(i.default),d=i.default;c.listen(3e3),e.hot.accept("./src/server/server.js",function(e){i=r("./src/server/server.js"),c.removeListener("request",d),c.on("request",i.default),d=i.default})},"./src/server/server.js":function(e,n,r){"use strict";r.r(n);var o=r("express"),t=r.n(o)()();t.get("/api_v.1",function(e,n){n.send({message:"version .11"})}),n.default=t},0:function(e,n,r){r("./node_modules/webpack/hot/poll.js?1000"),e.exports=r("./src/server/index.js")},express:function(e,n){e.exports=require("express")},http:function(e,n){e.exports=require("http")}});