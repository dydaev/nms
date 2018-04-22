/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "40168fb093cc1f3254f5"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(!installedModules[request].parents.includes(moduleId))
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(!me.children.includes(request))
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.includes(parentId)) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(!a.includes(item))
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.includes(cb)) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssmbly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nmodule.exports = function(updatedModules, renewedModules) {\r\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\r\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\r\n\t});\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tif(unacceptedModules.length > 0) {\r\n\t\tlog(\"warning\", \"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\");\r\n\t\tunacceptedModules.forEach(function(moduleId) {\r\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n\r\n\tif(!renewedModules || renewedModules.length === 0) {\r\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\r\n\t} else {\r\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\r\n\t\trenewedModules.forEach(function(moduleId) {\r\n\t\t\tif(typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\r\n\t\t\t\tvar parts = moduleId.split(\"!\");\r\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t\tlog.groupEnd(\"info\");\r\n\t\t\t} else {\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t}\r\n\t\t});\r\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\r\n\t\t\treturn typeof moduleId === \"number\";\r\n\t\t});\r\n\t\tif(numberIds)\r\n\t\t\tlog(\"info\", \"[HMR] Consider using the NamedModulesPlugin for module names.\");\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\r\n\r\nfunction dummy() {}\r\n\r\nfunction shouldLog(level) {\r\n\tvar shouldLog = (logLevel === \"info\" && level === \"info\") ||\r\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\r\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\r\n\treturn shouldLog;\r\n}\r\n\r\nfunction logGroup(logFn) {\r\n\treturn function(level, msg) {\r\n\t\tif(shouldLog(level)) {\r\n\t\t\tlogFn(msg);\r\n\t\t}\r\n\t};\r\n}\r\n\r\nmodule.exports = function(level, msg) {\r\n\tif(shouldLog(level)) {\r\n\t\tif(level === \"info\") {\r\n\t\t\tconsole.log(msg);\r\n\t\t} else if(level === \"warning\") {\r\n\t\t\tconsole.warn(msg);\r\n\t\t} else if(level === \"error\") {\r\n\t\t\tconsole.error(msg);\r\n\t\t}\r\n\t}\r\n};\r\n\r\nvar group = console.group || dummy;\r\nvar groupCollapsed = console.groupCollapsed || dummy;\r\nvar groupEnd = console.groupEnd || dummy;\r\n\r\nmodule.exports.group = logGroup(group);\r\n\r\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\r\n\r\nmodule.exports.groupEnd = logGroup(groupEnd);\r\n\r\nmodule.exports.setLogLevel = function(level) {\r\n\tlogLevel = level;\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n/*globals __resourceQuery */\r\nif(true) {\r\n\tvar hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\r\n\t\tif(module.hot.status() === \"idle\") {\r\n\t\t\tmodule.hot.check(true).then(function(updatedModules) {\r\n\t\t\t\tif(!updatedModules) {\r\n\t\t\t\t\tif(fromUpdate) log(\"info\", \"[HMR] Update applied.\");\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\r\n\t\t\t\tcheckForUpdate(true);\r\n\t\t\t}).catch(function(err) {\r\n\t\t\t\tvar status = module.hot.status();\r\n\t\t\t\tif([\"abort\", \"fail\"].indexOf(status) >= 0) {\r\n\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\r\n\t\t\t\t\tlog(\"warning\", \"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\r\n\t\t\t\t} else {\r\n\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t}\r\n\t};\r\n\tsetInterval(checkForUpdate, hotPollInterval);\r\n} else {}\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/libs/accessConfig.js":
/*!**********************************!*\
  !*** ./src/libs/accessConfig.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    session: {\n        sole: 'pticaGovorun',\n        key: 'sid',\n        cookie: {\n            httpOnly: true,\n            maxAge: null\n        }\n    },\n    mongo: {\n        login: 'rigerMod',\n        pass: 'luckSkywolker_81'\n    }\n});\n\n//# sourceURL=webpack:///./src/libs/accessConfig.js?");

/***/ }),

/***/ "./src/libs/config.js":
/*!****************************!*\
  !*** ./src/libs/config.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _accessConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accessConfig */ \"./src/libs/accessConfig.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object.assign({}, {\n    main: {\n        sounds: {\n            sirena: './src/public/sirena_2.mp3'\n        }\n    },\n    miner: {\n        run: 'miner',\n        homeFolder: '/home/dydaev/ewbf-0.3.4b/',\n        server: 'eu1-zcash.flypool.org',\n        port: '3333',\n        apiHost: '192.168.1.222',\n        startApiPort: 42000,\n        wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy'\n    },\n    devices: {\n        isDeviceUsedGpuUtil: 50,\n        isDeviceUsedGpuPow: 50\n    },\n    mongo: {\n        connect: {\n            host: '127.0.0.1',\n            port: '27017',\n            database: 'minerStore',\n            url: 'mongodb://localhost'\n        },\n        options: {\n            server: {\n                socketOptions: {\n                    keepAlive: 1\n                }\n            }\n        }\n    }\n}, _accessConfig__WEBPACK_IMPORTED_MODULE_0__[\"default\"]));\n\n//# sourceURL=webpack:///./src/libs/config.js?");

/***/ }),

/***/ "./src/libs/localStore.js":
/*!********************************!*\
  !*** ./src/libs/localStore.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_localstorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-localstorage */ \"node-localstorage\");\n/* harmony import */ var node_localstorage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_localstorage__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ((function () {\n    var instance;\n\n    if (instance) {\n        console.log('call to store');\n        return instance;\n    } else {\n        console.log('create stor');\n        instance = {};\n        instance.set = function (key, value) {\n            return instance.store.setItem(key, JSON.stringify(value));\n        };\n        instance.get = function (key) {\n            return JSON.parse(instance.store.getItem(key));\n        };\n        instance.store = new node_localstorage__WEBPACK_IMPORTED_MODULE_0__[\"LocalStorage\"]('./scratch');\n        return instance;\n    }\n})());\n\n//# sourceURL=webpack:///./src/libs/localStore.js?");

/***/ }),

/***/ "./src/libs/log.js":
/*!*************************!*\
  !*** ./src/libs/log.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var winston = __webpack_require__(/*! winston */ \"winston\");\n\nfunction getLogger(filePath) {\n    var path = filePath ? filePath.split('/').slice(-2).join('/') : 'path undefined';\n    return new winston.Logger({\n        transports: [new winston.transports.Console({\n            colorize: true,\n            level: 'debug',\n            label: path\n        }), new winston.transports.File({\n            filename: 'node.log',\n            label: path\n        })]\n    });\n}\n\nmodule.exports = getLogger;\n\n//# sourceURL=webpack:///./src/libs/log.js?");

/***/ }),

/***/ "./src/miner/commands.js":
/*!*******************************!*\
  !*** ./src/miner/commands.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack:///./src/miner/commands.js?");

/***/ }),

/***/ "./src/miner/index.js":
/*!****************************!*\
  !*** ./src/miner/index.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! request */ \"request\");\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./commands */ \"./src/miner/commands.js\");\n/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_commands__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\n\n\n\n\n\n\n\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\nvar runMiner = 'sh /home/dydaev/ewbf-0.3.4b/miner';\nvar ApiUrl = 'http://192.168.1.222:42000/getstat';\n\nvar miner = {\n    pid: '',\n    devices: [],\n    apiPort: '',\n    startedAte: ''\n    /* \n    config.miner \n     (server\n    port\n    apiHost\n    startApiPort\n    wallet)\n     if (Array.isArray(devices)) {\n    //     dev = '--cuda_devices ' + devices.join(' ');\n    // }\n    //'lsof | grep 42000' check api port busy at the moment\n    --server\n    --port\n    --fee 0\n    --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 64 --eexit --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev\n    */\n};/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    minerUp: function minerUp(miner) {\n        return node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get(miner).pid;\n    },\n\n    killPid: function killPid(pid) {\n        return pid ? node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.run('kill ' + pid) : false;\n    },\n\n    isWorkingPid: function isWorkingPid(pid) {\n        if (pid) {\n            node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get('ps aux | grep ' + pid + ' | grep miner', function (err, data, stderr) {\n                return data ? true : false;\n            });\n        } // else log.info('Fail check pid, no pid');\n    },\n\n    getMinerInfo: function getMinerInfo() {\n        var result = {};\n        request__WEBPACK_IMPORTED_MODULE_3___default()(ApiUrl, function (error, response, body) {\n            if (error) {\n                log.error('Error with connecting to miner api:' + error);\n            } else if (response.statusCode !== 200) {\n                log.info('Status code from miner :' + response.statusCode);\n            } else {\n                result = JSON.parse(body);\n                _libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].set('miner', JSON.parse(body));\n            }\n        });\n\n        return result;\n    },\n    addMiner: function addMiner(params) {\n        // eslint-disable-line\n        var minimalParams = ['server', 'port', 'user'];\n        var configLine = void 0;\n        var usedDevices = void 0;\n\n        if (Object.prototype.toString.call(params) === '[object Function]') {\n            if (minimalParams.every(function (value) {\n                return Object.keys(params).includes(value);\n            })) {\n\n                var isExecDevicesFree = true; //if execute devices check they using, or check free devices\n                var headwareDevices = Object(_libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"])('nvidia-devices');\n                if (typeof params.cuda_devices !== 'undefined') {\n                    headwareDevices;\n                    usedDevices = params.cuda_devices;\n                    isExecDevicesFree = isExecDevicesFree; // TODO\n                } else {\n                    isExecDevicesFree = isExecDevicesFree; // TODO\n                }\n\n                if (isExecDevicesFree) {\n                    configLine = Object.keys(params).reduce(function (line, key) {\n                        return line + ' --' + key + ' ' + params[key];\n                    }, _libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].miner.homeFolder + _libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].miner.run);\n                } else log.info('Not free devices for adding miner!');\n            } else log.info('You need set (' + minimalParams.join(', ') + ') for adding mainer!');\n        } else log.info('Did`nt add miner, need config!');\n\n        if (configLine) {\n            var _miner = {\n                id: Object(uuid__WEBPACK_IMPORTED_MODULE_1__[\"v4\"])(),\n                pid: '',\n                enabled: true,\n                commandLine: configLine,\n                devices: usedDevices\n            };\n\n            _libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].set('miners', _libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].get('miners') ? [].concat(_toConsumableArray(_libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].get('miners')), [_miner]) : []);\n        } else log.info('What went wrong with adding miner!');\n    }\n});\n\n//# sourceURL=webpack:///./src/miner/index.js?");

/***/ }),

/***/ "./src/nvidia/index.js":
/*!*****************************!*\
  !*** ./src/nvidia/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xml-js */ \"xml-js\");\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xml_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n\n\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\tupdateInfo: function updateInfo(device) {\n\t\tnode_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get('nvidia-smi -q -x', //commands.get(info, device),\n\t\tfunction (err, data) {\n\t\t\tif (!err) {\n\t\t\t\tvar json = JSON.parse(xml_js__WEBPACK_IMPORTED_MODULE_1___default.a.xml2json(data, { compact: true, spaces: 2 }));\n\t\t\t\tvar devices = {\n\t\t\t\t\tlastUpdates: json.nvidia_smi_log.timestamp._text,\n\t\t\t\t\tdriverVersion: json.nvidia_smi_log.driver_version._text,\n\t\t\t\t\tcountGPU: Number.parseInt(json.nvidia_smi_log.attached_gpus._text),\n\t\t\t\t\tgpu: {},\n\t\t\t\t\ttelemetry: {\n\t\t\t\t\t\tgpu_util: '%',\n\t\t\t\t\t\tmemory_util: '%',\n\t\t\t\t\t\tfan_speed: '%',\n\t\t\t\t\t\ttemperature: 'C',\n\t\t\t\t\t\tmemory_temp: 'C',\n\t\t\t\t\t\tgpu_temp_max_threshold: 'C',\n\t\t\t\t\t\tpower_draw: 'W',\n\t\t\t\t\t\tpower_limit: 'W',\n\t\t\t\t\t\tmax_power_limit: 'W',\n\t\t\t\t\t\tgraphics_clock: 'MHz',\n\t\t\t\t\t\tmem_clock: 'MHz',\n\t\t\t\t\t\tvideo_clock: 'MHz',\n\t\t\t\t\t\tmax_graphics_clock: 'MHz',\n\t\t\t\t\t\tmax_mem_clock: 'MHz',\n\t\t\t\t\t\tmax_video_clock: 'MHz'\n\t\t\t\t\t}\n\t\t\t\t};\n\t\t\t\tjson.nvidia_smi_log.gpu.forEach(function (value) {\n\t\t\t\t\tdevices.gpu[value.uuid._text] = {\n\t\t\t\t\t\tid: value._attributes.id,\n\t\t\t\t\t\tuuid: value.uuid._text,\n\t\t\t\t\t\tbrand: value.product_brand._text,\n\t\t\t\t\t\tname: value.product_name._text,\n\t\t\t\t\t\tvbios_version: value.vbios_version._text,\n\t\t\t\t\t\tprocesses: typeof value.processes.process_info !== 'undefined' ? value.processes.process_info.process_name._text : '',\n\t\t\t\t\t\tgpu_util: Number.parseInt(value.utilization.gpu_util._text),\n\t\t\t\t\t\tmemory_util: Number.parseInt(value.utilization.memory_util._text),\n\t\t\t\t\t\tfan_speed: Number.parseInt(value.fan_speed._text),\n\t\t\t\t\t\ttemperature: Number.parseInt(value.temperature.gpu_temp._text),\n\t\t\t\t\t\tmemory_temp: Number.parseInt(value.temperature.memory_temp._text),\n\t\t\t\t\t\tgpu_temp_max_threshold: Number.parseInt(value.temperature.gpu_temp_max_threshold._text),\n\t\t\t\t\t\tpower_draw: Number.parseInt(value.power_readings.power_draw._text),\n\t\t\t\t\t\tpower_limit: Number.parseInt(value.power_readings.power_limit._text),\n\t\t\t\t\t\tmax_power_limit: Number.parseInt(value.power_readings.max_power_limit._text),\n\t\t\t\t\t\tdispaly: value.display_mode._text === 'Enabled' ? true : false,\n\t\t\t\t\t\tclocks: {\n\t\t\t\t\t\t\tgraphics_clock: Number.parseInt(value.clocks.graphics_clock._text),\n\t\t\t\t\t\t\tmem_clock: Number.parseInt(value.clocks.mem_clock._text),\n\t\t\t\t\t\t\tvideo_clock: Number.parseInt(value.clocks.video_clock._text),\n\n\t\t\t\t\t\t\tmax_graphics_clock: Number.parseInt(value.max_clocks.graphics_clock._text),\n\t\t\t\t\t\t\tmax_mem_clock: Number.parseInt(value.max_clocks.mem_clock._text),\n\t\t\t\t\t\t\tmax_video_clock: Number.parseInt(value.max_clocks.video_clock._text)\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t});\n\t\t\t\t_libs_localStore__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set('nvidia-devices', devices);\n\t\t\t} else {\n\t\t\t\tlog.error('Can`t open opening cards: ' + err);\n\t\t\t}\n\t\t});\n\t}\n});\n\n//# sourceURL=webpack:///./src/nvidia/index.js?");

/***/ }),

/***/ "./src/robot/index.js":
/*!****************************!*\
  !*** ./src/robot/index.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var beepbeep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! beepbeep */ \"beepbeep\");\n/* harmony import */ var beepbeep__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(beepbeep__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\n\n\n\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function () {\n    // eslint-disable-line\n    var miner = _libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('miner');\n    var nvidia = _libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('nvidia-devices');\n\n    if (miner && Array.isArray(miner.result)) {\n        var cardsIsStay = miner.result.find(function (value) {\n            return value.speed_sps < _libs_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].devices.isDeviceUsedGpuUtil;\n        });\n        var isPowerLessHalf = false;\n        var isGpuUtilLessHalf = false;\n\n        var cardsParams = [];\n        if (nvidia && Array.isArray(Object.keys(nvidia.gpu)) && Object.keys(nvidia.gpu).length > 0) {\n            cardsParams = Object.keys(nvidia.gpu).reduceRight(function (params, value) {\n                isPowerLessHalf = nvidia.gpu[value].power_draw < _libs_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].devices.isDeviceUsedGpuPow ? nvidia.gpu[value].power_draw : isPowerLessHalf;\n                isGpuUtilLessHalf = nvidia.gpu[value].gpu_util < _libs_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].devices.isDeviceUsedGpuUtil ? nvidia.gpu[value].gpu_util : isGpuUtilLessHalf;\n\n                var lengthLine = 21;\n                var line = ' ' + nvidia.gpu[value].gpu_util + '%(' + nvidia.gpu[value].power_draw + 'W) ' + nvidia.gpu[value].temperature + 'C(' + nvidia.gpu[value].fan_speed + '%)';\n                line = line.length > lengthLine ? line : line + new Array(lengthLine - line.length).fill(' ').join('');\n                return [].concat(_toConsumableArray(params), [line]);\n            }, []);\n        }\n\n        if (cardsIsStay) {\n            var speeds = miner.result.map(function (value) {\n                return value.speed_sps;\n            });\n            log.error('Miner is wrong (' + speeds.join(' & ') + ')Sol/sec');\n            node_cmd__WEBPACK_IMPORTED_MODULE_1___default.a.run('aplay ' + _libs_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].main.sounds.sirena);\n            beepbeep__WEBPACK_IMPORTED_MODULE_2___default()([1000, 500, 2000]); // eslint-disable-line\n            //restart mainer;\n        } else if (!(isPowerLessHalf === false) || !(isGpuUtilLessHalf === false)) {\n            node_cmd__WEBPACK_IMPORTED_MODULE_1___default.a.run('aplay ' + _libs_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].main.sounds.sirena);\n            beepbeep__WEBPACK_IMPORTED_MODULE_2___default()([1000, 500, 2000]); // eslint-disable-line\n            log.error('Devices is down');\n            //restart mainer;\n        } else {\n            var _speeds = miner.result.map(function (value) {\n                return value.speed_sps;\n            });\n            log.info('Cards speed: ' + _speeds.join('+') + ' ' + _speeds.reduce(function (sum, value) {\n                return sum + value;\n            }, 0) + 'Sol/sec |' + cardsParams.join(' | ') + '|');\n        }\n    }\n});\n\n//# sourceURL=webpack:///./src/robot/index.js?");

/***/ }),

/***/ "./src/server/html/loginForm.js":
/*!**************************************!*\
  !*** ./src/server/html/loginForm.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"\\n<div style=\\\" width: 164px; margin: 200px auto; \\\">\\n    <h3 style=\\\"text-align: center; margin-bottom: 10px;\\\">Login</h3>\\n    <form method=\\\"POST\\\" action=\\\"/login\\\">\\n        <input style=\\\"margin-bottom: 4px; padding: 5px;\\\" type=\\\"text\\\" name=\\\"login\\\" placeholder=\\\"login\\\"/><br>\\n        <input style=\\\"padding: 5px;\\\" type=\\\"password\\\" name=\\\"password\\\" placeholder=\\\"password\\\"/><br>\\n        <button\\n            style=\\\"float: right;margin-top: 4px;background-color: dodgerblue;border: none;padding: 7px;border-radius: 3px;\\\"\\n            type=\\\"submit\\\"\\n        >\\n            Submit\\n        </button>\\n    </form>\\n</div>\");\n\n//# sourceURL=webpack:///./src/server/html/loginForm.js?");

/***/ }),

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server */ \"./src/server/server.js\");\n\n\nvar server = http__WEBPACK_IMPORTED_MODULE_0___default.a.createServer(_server__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\nvar currentApp = _server__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\nserver.listen(3000);\nif (true) {\n  module.hot.accept(/*! ./server */ \"./src/server/server.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server */ \"./src/server/server.js\");\n(function () {\n    server.removeListener('request', currentApp);\n    server.on('request', _server__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n    currentApp = _server__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n}\n\n//# sourceURL=webpack:///./src/server/index.js?");

/***/ }),

/***/ "./src/server/routes/cards/info.js":
/*!*****************************************!*\
  !*** ./src/server/routes/cards/info.js ***!
  \*****************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    res.send(_libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('nvidia-devices')); //nvidia-devices\n};\n\n//# sourceURL=webpack:///./src/server/routes/cards/info.js?");

/***/ }),

/***/ "./src/server/routes/cards/list.js":
/*!*****************************************!*\
  !*** ./src/server/routes/cards/list.js ***!
  \*****************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    var cardsInfo = _libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('nvidia-devices');\n    if (cardsInfo && Number.isInteger(cardsInfo.countGPU)) {\n        if (cardsInfo.countGPU > 0 && cardsInfo.gpu) {\n            var list = Object.keys(cardsInfo.gpu).map(function (key) {\n                return {\n                    uuid: cardsInfo.gpu[key].uuid,\n                    cudaId: cardsInfo.gpu[key].id,\n                    name: cardsInfo.gpu[key].name\n                };\n            });\n            res.send(list);\n        } else res.status(500).send('no initial cards');\n    } else res.status(500).send('no initial cards');\n};\n/*\n{\n    \"lastUpdates\": \"Sat Apr 21 10:25:27 2018\",\n    \"driverVersion\": \"390.48\",\n    \"countGPU\": 2, \n    \"gpu\": {\n        \"GPU-72fe5f90-49b6-7c3a-af77-08964ef4c7e6\": { \n            \"id\": \"00000000:01:00.0\", \n            \"uuid\": \"GPU-72fe5f90-49b6-7c3a-af77-08964ef4c7e6\", \n            \"brand\": \"GeForce\", \n            \"name\": \"GeForce GTX 1070 Ti\", \n            \"vbios_version\": \"86.04.85.00.63\", \n            \"processes\": \"/home/dydaev/ewbf-0.3.4b/miner\", \n            \"gpu_util\": 99, \n            \"memory_util\": 89, \n            \"fan_speed\": 39, \n            \"temperature\": 64, \n            \"memory_temp\": null, \n            \"gpu_temp_max_threshold\": 99, \n            \"power_draw\": 129, \n            \"power_limit\": 130, \n            \"max_power_limit\": 217, \n            \"dispaly\": false, \n            \"clocks\": { \"graphics_clock\": 1784, \"mem_clock\": 4404, \"video_clock\": 1594, \"max_graphics_clock\": 1923, \"max_mem_clock\": 4004, \"max_video_clock\": 1708 }\n        }, \n        \"GPU-2d1cbe78-7e78-65a5-672a-65fff5f4060c\":  { \n            --//--\n        }*/\n\n//# sourceURL=webpack:///./src/server/routes/cards/list.js?");

/***/ }),

/***/ "./src/server/routes/control/setPower.js":
/*!***********************************************!*\
  !*** ./src/server/routes/control/setPower.js ***!
  \***********************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    res.send(_libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('a1'));\n};\n\n//# sourceURL=webpack:///./src/server/routes/control/setPower.js?");

/***/ }),

/***/ "./src/server/routes/index.js":
/*!************************************!*\
  !*** ./src/server/routes/index.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\nvar controllers = {\n    'api_v.1': {\n        'control': {\n            'set_power': __webpack_require__(/*! ./control/setPower */ \"./src/server/routes/control/setPower.js\")\n        },\n        'miner': {\n            'info': __webpack_require__(/*! ./miner/info */ \"./src/server/routes/miner/info.js\"),\n            'stop': __webpack_require__(/*! ./miner/stop */ \"./src/server/routes/miner/stop.js\"),\n            'start': __webpack_require__(/*! ./miner/start */ \"./src/server/routes/miner/start.js\")\n        },\n        'cards': {\n            'info': __webpack_require__(/*! ./cards/info */ \"./src/server/routes/cards/info.js\"),\n            'list': __webpack_require__(/*! ./cards/list */ \"./src/server/routes/cards/list.js\")\n        }\n    }\n};\n\nvar checkAccess = function checkAccess(app) {\n    return true;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (app) {\n    return app.route('/api_v.1/*').all(function (req, res, next) {\n        if (true) {\n            var method = req.method;\n            var path = req.path.split('/').slice(1);\n            var value = path.reduce(function (acc, val) {\n                return Object.prototype.toString.call(acc) === '[object Object]' ? acc[val] : acc[val] === undefined ? false : val;\n            }, controllers);\n\n            if (value && Object.prototype.toString.call(value[method]) === '[object Function]') {\n                value[method](req, res);\n            } else res.status(501).send('api not found');\n        } else {}\n    });\n});\n\n//# sourceURL=webpack:///./src/server/routes/index.js?");

/***/ }),

/***/ "./src/server/routes/miner/info.js":
/*!*****************************************!*\
  !*** ./src/server/routes/miner/info.js ***!
  \*****************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    res.send(_libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('miner'));\n};\n\n//# sourceURL=webpack:///./src/server/routes/miner/info.js?");

/***/ }),

/***/ "./src/server/routes/miner/start.js":
/*!******************************************!*\
  !*** ./src/server/routes/miner/start.js ***!
  \******************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    res.send(_libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('a1'));\n};\n\n//# sourceURL=webpack:///./src/server/routes/miner/start.js?");

/***/ }),

/***/ "./src/server/routes/miner/stop.js":
/*!*****************************************!*\
  !*** ./src/server/routes/miner/stop.js ***!
  \*****************************************/
/*! exports provided: GET */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GET\", function() { return GET; });\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/localStore */ \"./src/libs/localStore.js\");\n\n\nvar GET = function GET(req, res) {\n    res.send(_libs_localStore__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('a1'));\n};\n\n//# sourceURL=webpack:///./src/server/routes/miner/stop.js?");

/***/ }),

/***/ "./src/server/server.js":
/*!******************************!*\
  !*** ./src/server/server.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes */ \"./src/server/routes/index.js\");\n/* harmony import */ var _nvidia__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../nvidia */ \"./src/nvidia/index.js\");\n/* harmony import */ var _miner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../miner */ \"./src/miner/index.js\");\n/* harmony import */ var _robot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../robot */ \"./src/robot/index.js\");\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var _html_loginForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./html/loginForm */ \"./src/server/html/loginForm.js\");\n\n\n\n\n\n\n\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n\nvar versionApi = '.1';\n\n_libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].set('a1', 'Initial local store');\nconsole.log(_libs_localStore__WEBPACK_IMPORTED_MODULE_6__[\"default\"].get('a1'));\n\nvar app = express__WEBPACK_IMPORTED_MODULE_0___default()();\nvar port = 8080;\nvar clientIp = '';\nvar serverTimer = 0;\n\napp.use('/', function (req, res, next) {\n    clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':');\n    clientIp = clientIp[clientIp.length - 1];\n    console.log(new Date() + ' ' + clientIp + ':' + req.method + '(' + req.originalUrl + ')');\n    next();\n});\n\napp.use('/login', function (req, res, next) {\n    if (clientIp !== 7798) {\n        //req.signedCookies.user  !== undefined &&\n        next();\n    } else {\n        res.status(500).send('Something broke!');\n    }\n});\n//res.setHeader('Cache-Control', 'public, max-age=0')\n\napp.use('/login/form', function (req, res) {\n    return res.send(_html_loginForm__WEBPACK_IMPORTED_MODULE_8__[\"default\"]);\n});\n//app.use(middlewares);\nObject(_routes__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(app);\n\nsetInterval(function () {\n    serverTimer++;\n    if (!(serverTimer % 5)) {\n        _nvidia__WEBPACK_IMPORTED_MODULE_3__[\"default\"].updateInfo();\n        _miner__WEBPACK_IMPORTED_MODULE_4__[\"default\"].getMinerInfo();\n        /*miner.addMiner({\n            api: '192.168.1.222:42000',\n            server: 'eu1-zcash.flypool.org',\n            port: '3333',\n            intensity: '60',\n            eexit: '3',\n            solver: '0',\n            fee: '0',\n            user: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',\n        });*/\n        Object(_robot__WEBPACK_IMPORTED_MODULE_5__[\"default\"])();\n        //log.info('info')\n    }\n}, 1000);\n\nif (false) {}\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./src/server/server.js?");

/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/server/index ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! ./src/server/index */\"./src/server/index.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "beepbeep":
/*!***************************!*\
  !*** external "beepbeep" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"beepbeep\");\n\n//# sourceURL=webpack:///external_%22beepbeep%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "node-cmd":
/*!***************************!*\
  !*** external "node-cmd" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-cmd\");\n\n//# sourceURL=webpack:///external_%22node-cmd%22?");

/***/ }),

/***/ "node-localstorage":
/*!************************************!*\
  !*** external "node-localstorage" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-localstorage\");\n\n//# sourceURL=webpack:///external_%22node-localstorage%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"request\");\n\n//# sourceURL=webpack:///external_%22request%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"winston\");\n\n//# sourceURL=webpack:///external_%22winston%22?");

/***/ }),

/***/ "xml-js":
/*!*************************!*\
  !*** external "xml-js" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"xml-js\");\n\n//# sourceURL=webpack:///external_%22xml-js%22?");

/***/ })

/******/ });