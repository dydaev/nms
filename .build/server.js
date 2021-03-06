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
/******/ 	var hotCurrentHash = "263ee2f4490a22dd9a0f"; // eslint-disable-line no-unused-vars
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

/***/ "./src/Cards/Card.js":
/*!***************************!*\
  !*** ./src/Cards/Card.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xml-js */ \"xml-js\");\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xml_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var _nvidia_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nvidia-model */ \"./src/Cards/nvidia-model.js\");\n/* harmony import */ var _libs_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/utils */ \"./src/libs/utils.js\");\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bluebird */ \"bluebird\");\n/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_6__);\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n\n\n\n\n\n\n\n\nvar colors = __webpack_require__(/*! colors/safe */ \"colors/safe\");\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n\nvar getAsync = bluebird__WEBPACK_IMPORTED_MODULE_6___default.a.promisify(node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get, { multiArgs: true, context: node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a });\n\nvar Card = function () {\n    function Card(gpuId) {\n        var _this = this;\n\n        _classCallCheck(this, Card);\n\n        this.getHistoryPowerByTiks = function (tiks) {\n            return _this.oldierDrawPower.slice(0, tiks);\n        };\n\n        this.getHistoryGpuUtilByTiks = function (tiks) {\n            return _this.oldierGpuUtil.slice(0, tiks);\n        };\n\n        console.log('Found new card, id: ' + colors.cyan(gpuId));\n        this.gpuId = gpuId;\n        this.card = {};\n        this.tiksForHistory = 30; // 30 = 1min(if tick = 2sec)\n        this.oldierDrawPower = new Array(this.tiksForHistory);\n        this.oldierGpuUtil = new Array(this.tiksForHistory);\n        this.updaeteInfo();\n    }\n\n    _createClass(Card, [{\n        key: 'averagePowerByTicks',\n        value: function averagePowerByTicks(tiks) {\n            if (tiks < this.oldierDrawPower.length) {\n                var averagePower = ~~(this.getHistoryPowerByTiks(tiks).reduce(function (sum, power) {\n                    return sum + power * 1;\n                }, 0) / tiks);\n                //console.log('averagePower' + averagePower);\n                return averagePower;\n            } else log.error('For getting average power of history, tiks must be less ' + this.oldierDrawPower.length - 1);\n            return undefined;\n        }\n    }, {\n        key: 'averageGpuUtilByTicks',\n        value: function averageGpuUtilByTicks(tiks) {\n            if (tiks < this.oldierGpuUtil.length) {\n                var averageGpuUtil = ~~(this.getHistoryGpuUtilByTiks(tiks).reduce(function (sum, power) {\n                    return sum + power * 1;\n                }, 0) / tiks);\n                //console.log('averageGpuUtil ' + averageGpuUtil);\n                return averageGpuUtil;\n            } else log.error('For getting average gpu util of history, tiks must be less ' + this.oldierGpuUtil.length - 1);\n            return undefined;\n        }\n    }, {\n        key: 'isWorkingCard',\n        value: function isWorkingCard() {\n            var pointPower = this.card.gpu.power_limit / (100 / _libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].devices.isCardWorkIfCpuPowerMoreOfLimit);\n            var pointCpu = this.card.gpu.gpu_util / (100 / _libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].devices.isCardWorkIfCpuUsedMoreOfLimit);\n            var isPowerMorePoint = this.averagePowerByTicks(_libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].devices.limitLowLevelsInHistory) > pointPower;\n            var isGpuUtilMorePoint = this.averageGpuUtilByTicks(_libs_config__WEBPACK_IMPORTED_MODULE_5__[\"default\"].devices.limitLowLevelsInHistory) > pointCpu;\n            //console.log('power is ' + isPowerMorePoint, 'gpu is ' + isGpuUtilMorePoint);\n            return isPowerMorePoint && isGpuUtilMorePoint;\n        }\n    }, {\n        key: 'setResetHistory',\n        value: function setResetHistory() {\n            this.oldierDrawPower = new Array(this.tiksForHistory);\n            this.oldierGpuUtil = new Array(this.tiksForHistory);\n        }\n    }, {\n        key: 'get',\n        value: function get(key) {\n            return key.split('.').reduce(function (opendObject, key) {\n                return typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined' ? opendObject[key] : undefined;\n            }, this.card);\n        }\n    }, {\n        key: 'getInfo',\n        value: function getInfo() {\n            return this.card;\n        }\n    }, {\n        key: 'updaeteInfo',\n        value: function updaeteInfo() {\n            var _this2 = this;\n\n            getAsync('nvidia-smi -q -x -i ' + this.gpuId).then(function (data) {\n                // eslint-disable-line\n                if (data[0]) {\n                    var json = JSON.parse(xml_js__WEBPACK_IMPORTED_MODULE_1___default.a.xml2json(data[0], { compact: true, spaces: 2 }));\n                    if (json) {\n                        _this2.card = Object(_nvidia_model__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(json);\n\n                        // if (this.oldierDrawPower[0] !== this.card.gpu.power_draw) {\n                        _this2.oldierDrawPower.unshift(_this2.card.gpu.power_draw);\n                        _this2.oldierDrawPower.pop();\n                        // }\n                        // if (this.oldierGpuUtil[0] !== this.card.gpu.gpu_util) {\n                        _this2.oldierGpuUtil.unshift(_this2.card.gpu.gpu_util);\n                        _this2.oldierGpuUtil.pop();\n                        // }\n                        return _this2.card;\n                    } else log.error('Json from nvidia is wrong or empty: ' + json);\n                } else log.error('No data from nvidia card:' + data);\n            }).catch(function (err) {\n                log.error('Can`t get data from nvidia-smi: ' + err);\n            });\n        }\n    }]);\n\n    return Card;\n}();\n\n/*\naveragePower130\naverageGpuUtil 99\npower is true gpu is true\naveragePower202\naverageGpuUtil 98\npower is true gpu is true\n----------------2\naveragePower43\naverageGpuUtil 50\npower is true gpu is true\naveragePower78\naverageGpuUtil 50\npower is true gpu is true\n----------------4\naveragePower43\naverageGpuUtil 50\npower is true gpu is true\naveragePower78\naverageGpuUtil 50\npower is true gpu is true\n----------------2\naveragePower39\naverageGpuUtil 50\npower is false gpu is true\naveragePower68\naverageGpuUtil 50\npower is false gpu is true\n----------------4\naveragePower39\naverageGpuUtil 50\npower is false gpu is true\naveragePower68\naverageGpuUtil 50\npower is false gpu is true\n\nerror:Alarm cards is down! ,\n    00000000:01:00.0,    36W 43W 44W 131W 130,    0% 100% 99% 0% \n    00000000:02:00.0,    59W 78W 79W 225W 180,    0% 100% 96% 99% 100\n*/\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Card);\n\n//# sourceURL=webpack:///./src/Cards/Card.js?");

/***/ }),

/***/ "./src/Cards/Cards.js":
/*!****************************!*\
  !*** ./src/Cards/Cards.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xml-js */ \"xml-js\");\n/* harmony import */ var xml_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xml_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var _nvidia_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nvidia-model */ \"./src/Cards/nvidia-model.js\");\n/* harmony import */ var _libs_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/utils */ \"./src/libs/utils.js\");\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Card */ \"./src/Cards/Card.js\");\n/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! bluebird */ \"bluebird\");\n/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_7__);\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n\n\n\n\n\n\n\n\n\n\nvar colors = __webpack_require__(/*! colors/safe */ \"colors/safe\");\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n\nvar getAsync = bluebird__WEBPACK_IMPORTED_MODULE_7___default.a.promisify(node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get, { multiArgs: true, context: node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a });\n\nvar Cards = function () {\n    function Cards() {\n        var _this = this;\n\n        _classCallCheck(this, Cards);\n\n        getAsync('nvidia-smi --query-gpu=gpu_name,gpu_bus_id --format=csv').then(function (data) {\n            var list = data[0].split('\\n');\n            list = list.slice(1, list.length - 1).map(function (value) {\n                return value.split(',')[1].trim();\n            });\n\n            if (list.length) {\n                _this.list = list.reduce(function (cardList, idCard) {\n                    return Object.assign({}, cardList, _defineProperty({}, idCard, new _Card__WEBPACK_IMPORTED_MODULE_6__[\"default\"](idCard)));\n                }, {});\n            } else {\n                log.error('No cards for initial in list');\n                //throw new Error('')\n            }\n\n            /*if (false && data[0]) {\n                const json = JSON.parse(convert.xml2json(data[0], { compact: true, spaces: 2 }));\n                if (json) {\n                    this.list = model(json);// eslint-disable-line\n                } else log.error('Json from nvidia is wrong or empty: ' + json);\n            } else log.error('No data from nvidia card:' + data)*/\n        }).catch(function (err) {\n            log.error('Can`t get data from nvidia-smi: ' + err);\n        });\n        this.list = [];\n    }\n\n    _createClass(Cards, [{\n        key: 'updateInfoCards',\n        value: function updateInfoCards() {\n            var _this2 = this;\n\n            Object.keys(this.list).forEach(function (cardId) {\n                _this2.list[cardId].updaeteInfo();\n            });\n        }\n    }, {\n        key: 'getCard',\n        value: function getCard(id) {\n            if (Object.keys(this.list).includes(id)) {\n                return this.list[id];\n            } else log.info('Can`t get card with id: ' + id + ' is not found!');\n            return undefined;\n        }\n    }, {\n        key: 'getIdFreeCards',\n        value: function getIdFreeCards() {\n            var _this3 = this;\n\n            return Object.keys(this.list).reduce(function (freeCards, idCard) {\n                return _this3.list[idCard].isWorkingCard() ? freeCards : [].concat(_toConsumableArray(freeCards), [idCard]);\n            }, []);\n        }\n    }]);\n\n    return Cards;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Cards);\n\n//# sourceURL=webpack:///./src/Cards/Cards.js?");

/***/ }),

/***/ "./src/Cards/nvidia-model.js":
/*!***********************************!*\
  !*** ./src/Cards/nvidia-model.js ***!
  \***********************************/
/*! exports provided: telemetry, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"telemetry\", function() { return telemetry; });\n/* harmony import */ var _libs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/utils */ \"./src/libs/utils.js\");\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\nvar telemetry = {\n    gpu_util: '%',\n    memory_util: '%',\n    fan_speed: '%',\n    temperature: 'C',\n    memory_temp: 'C',\n    gpu_temp_max_threshold: 'C',\n    power_draw: 'W',\n    power_limit: 'W',\n    max_power_limit: 'W',\n    graphics_clock: 'MHz',\n    mem_clock: 'MHz',\n    video_clock: 'MHz',\n    max_graphics_clock: 'MHz',\n    max_mem_clock: 'MHz',\n    max_video_clock: 'MHz'\n};\n\nvar model = {\n    lastUpdates: ['string', 'nvidia_smi_log.timestamp._text'],\n    driverVersion: ['string', 'nvidia_smi_log.driver_version._text'],\n    countGPU: ['string', 'nvidia_smi_log.attached_gpus._text'],\n    gpu: {\n        id: ['string', 'nvidia_smi_log.gpu._attributes.id'],\n        uuid: ['string', 'nvidia_smi_log.gpu.uuid._text'],\n        brand: ['string', 'nvidia_smi_log.gpu.product_brand._text'],\n        name: ['string', 'nvidia_smi_log.gpu.product_name._text'],\n        vbios_version: ['string', 'nvidia_smi_log.gpu.vbios_version._text'],\n        processes: ['string', 'nvidia_smi_log.gpu.processes.process_info.process_name._text'],\n        processes_pid: ['string', 'nvidia_smi_log.gpu.processes.process_info.pid._text'],\n        gpu_util: ['int', 'nvidia_smi_log.gpu.utilization.gpu_util._text'],\n        memory_util: ['int', 'nvidia_smi_log.gpu.utilization.memory_util._text'],\n        fan_speed: ['int', 'nvidia_smi_log.gpu.fan_speed._text'],\n        temperature: ['int', 'nvidia_smi_log.gpu.temperature.gpu_temp._text'],\n        memory_temp: ['int', 'nvidia_smi_log.gpu.temperature.memory_temp._text'],\n        gpu_temp_max_threshold: ['int', 'nvidia_smi_log.gpu.temperature.gpu_temp_max_threshold._text'],\n        power_draw: ['int', 'nvidia_smi_log.gpu.power_readings.power_draw._text'],\n        power_limit: ['int', 'nvidia_smi_log.gpu.power_readings.power_limit._text'],\n        max_power_limit: ['int', 'nvidia_smi_log.gpu.power_readings.max_power_limit._text'],\n        dispaly: ['bool', 'nvidia_smi_log.gpu.display_mode._text'],\n        dispaly_active: ['bool', 'nvidia_smi_log.gpu.display_active._text'],\n        //clocks:{\n        graphics_clock: ['int', 'nvidia_smi_log.gpu.clocks.graphics_clock._text'],\n        mem_clock: ['int', 'nvidia_smi_log.gpu.clocks.mem_clock._text'],\n        video_clock: ['int', 'nvidia_smi_log.gpu.clocks.video_clock._text'],\n        max_graphics_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.graphics_clock._text'],\n        max_mem_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.mem_clock._text'],\n        max_video_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.video_clock._text']\n        //},\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (data) {\n    if (data) {\n        return Object(_libs_utils__WEBPACK_IMPORTED_MODULE_0__[\"packModel\"])(model, data);\n    } else log.error('Data for model packing wrong or empty: ' + json);\n});\n\n//# sourceURL=webpack:///./src/Cards/nvidia-model.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _accessConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accessConfig */ \"./src/libs/accessConfig.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object.assign({}, {\n    main: {\n        sounds: {\n            sirena: './src/public/sirena_2.mp3'\n        }\n    },\n    miner: {\n        run: 'miner',\n        homeFolder: '/home/dydaev/ewbf-0.3.4b/',\n        server: 'eu1-zcash.flypool.org',\n        port: '3333',\n        apiHost: 'http://localhost',\n        startApiPort: 42000,\n        wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy'\n    },\n    devices: {\n        isCardWorkIfCpuUsedMoreOfLimit: 30,\n        isCardWorkIfCpuPowerMoreOfLimit: 30,\n        limitLowLevelsInHistory: 2 // 1 level = one check power and GpuUtil every 5 seconds\n    },\n    mongo: {\n        connect: {\n            host: '127.0.0.1',\n            port: '27017',\n            database: 'minerStore',\n            url: 'mongodb://localhost'\n        },\n        options: {\n            server: {\n                socketOptions: {\n                    keepAlive: 1\n                }\n            }\n        }\n    }\n}, _accessConfig__WEBPACK_IMPORTED_MODULE_0__[\"default\"]));\n\n//# sourceURL=webpack:///./src/libs/config.js?");

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

/***/ "./src/libs/utils.js":
/*!***************************!*\
  !*** ./src/libs/utils.js ***!
  \***************************/
/*! exports provided: packModel, isJsonString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"packModel\", function() { return packModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isJsonString\", function() { return isJsonString; });\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar log = __webpack_require__(/*! ./log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n//====================================packModel\nvar getVariableFromDataObject = function getVariableFromDataObject(model, dataObject, typeAndPath) {\n    var type = typeAndPath[0];\n    var pathToVariable = typeAndPath[1].split('.');\n    var variable = pathToVariable.reduce(function (opendObject, key) {\n        return typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined' ? opendObject[key] : undefined;\n    }, dataObject);\n    if (typeof variable !== 'undefined') {\n        //console.log(pathToVariable, variable);\n        switch (type) {\n            case 'int':\n                return Number.parseInt(variable);\n                break;\n            case 'bool':\n                return variable == 'true';\n                break;\n            case 'string':\n                return variable;\n            default:\n                return variable;\n        }\n    } else return ''; //undefined;\n};\n\nvar packModel = function packModel(model, dataObject) {\n    if ((typeof dataObject === 'undefined' ? 'undefined' : _typeof(dataObject)) === 'object') {\n        return Object.keys(model).reduce(function (pack, key) {\n            //console.log(key, '=', model[key], Array.isArray(model[key]));\n            return Object.assign({}, pack, _defineProperty({}, key, Array.isArray(model[key]) ? getVariableFromDataObject(model, dataObject, model[key]) : packModel(model[key], dataObject)));\n        }, {});\n    } else log.error('Unexpected object for packing model nvidia: ' + model);\n};\n//====================================END packModel\n\nvar isJsonString = function isJsonString(str) {\n    try {\n        JSON.parse(str);\n    } catch (e) {\n        return false;\n    }\n    return true;\n};\n\n//# sourceURL=webpack:///./src/libs/utils.js?");

/***/ }),

/***/ "./src/miner/InterfaceMinerModel.js":
/*!******************************************!*\
  !*** ./src/miner/InterfaceMinerModel.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/utils */ \"./src/libs/utils.js\");\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n\n\nvar InterfaceMinerModel = function () {\n    function InterfaceMinerModel() {\n        _classCallCheck(this, InterfaceMinerModel);\n\n        this.id = '';\n        this.name = '';\n        this.minerFolder = '';\n        this.minParams = ['server', 'port', 'user'];\n        this.params = {\n            server: '',\n            port: '',\n            user: '',\n            pass: '',\n            cuda_devices: '',\n            solver: '',\n            intensity: '',\n            tempunits: '',\n            templimit: '',\n            api: '',\n            fee: ''\n        };\n\n        this.model = {\n            gpuid: '',\n            cudaid: '',\n            busid: '',\n            gpu_status: '',\n            solver: '',\n            temperature: '',\n            gpu_power_usage: '',\n            speed_sps: '',\n            accepted_shares: '',\n            rejected_shares: ''\n        };\n        if (typeof apiModel !== 'undefimed') console.log(apiModel);\n    }\n\n    _createClass(InterfaceMinerModel, [{\n        key: 'getApi',\n        value: function getApi() {\n            return apiModel;\n        }\n    }, {\n        key: 'getDevice',\n        value: function getDevice() {\n            //update params\n            return this.params;\n        }\n    }, {\n        key: 'getServer',\n        value: function getServer() {\n            return this.server;\n        }\n    }, {\n        key: 'getPort',\n        value: function getPort() {\n            return this.port;\n        }\n    }, {\n        key: 'getUser',\n        value: function getUser() {\n            return this.user;\n        }\n    }]);\n\n    return InterfaceMinerModel;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (InterfaceMinerModel);\n\n//# sourceURL=webpack:///./src/miner/InterfaceMinerModel.js?");

/***/ }),

/***/ "./src/miner/Miner.js":
/*!****************************!*\
  !*** ./src/miner/Miner.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cmd */ \"node-cmd\");\n/* harmony import */ var node_cmd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cmd__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _driver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./driver */ \"./src/miner/driver.js\");\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var _InterfaceMinerModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./InterfaceMinerModel */ \"./src/miner/InterfaceMinerModel.js\");\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n\n\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n\n\n\nvar Miner = function () {\n    function Miner(minerModel, params) {\n        var _this = this;\n\n        _classCallCheck(this, Miner);\n\n        this.getCommandLine = function () {\n            return _this.miner.cmdLine;\n        };\n\n        //if (!minerModel instanceof InterfaceMinerModel) {\n        this.miner = {\n            enable: true,\n            id: Object(uuid__WEBPACK_IMPORTED_MODULE_1__[\"v4\"])(),\n            pid: '',\n            startedAte: '',\n            devices: params ? params.cuda_devices : [],\n            apiPort: '',\n            state: '',\n            params: params,\n            cmdLine: '~/ewbf-0.3.4b/miner --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 60 --eexit 3 --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev'\n        };\n        log.info('Created new miner, id:' + this.miner.id);\n        //} else log.error('Didn`t add MinerModel in constructor!');\n\n        //this.getCommandLine = this.getCommandLine.bind(this);\n    }\n\n    _createClass(Miner, [{\n        key: 'run',\n        value: function run() {\n            if (true) {\n                var processId = node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get(this.miner.cmdLine).pid * 1 + 1;\n                log.info(new Date() + ' Miner runed with pid: ' + processId);\n                this.miner.pid = processId;\n                //console.log(this.getCommandLine());\n            }\n        }\n    }, {\n        key: 'stop',\n        value: function stop() {\n            log.info(new Date() + ' Stoping miner with pid ' + this.miner.pid);\n            return node_cmd__WEBPACK_IMPORTED_MODULE_0___default.a.get('kill -9 ' + this.miner.pid);\n        }\n    }, {\n        key: 'restart',\n        value: function restart() {\n            var _this2 = this;\n\n            this.stop();\n            setTimeout(function () {\n                _this2.run();\n            }, 200);\n        }\n    }]);\n\n    return Miner;\n}();\n\n/*\n    setParams (params) {\n        const minimalParams = ['server', 'port', 'user'];\n        if (!params || minimalParams.every(value =>\n                Object.keys(params).includes(value))) throw new Error('No config for miner: ' + params);\n        \n    }\n\n    run() {\n        if (true) {\n            //var process = cmd.get(localConfig.miner.homeFolder + 'miner' + getCmdLine());\n            //console.log('/' + 'miner' + this.getCmdLine());\n            //log.info('Miner runed with id: ' + process.pid);\n            //this.miner.pid = process.pid;\n            console.log(this.getCommandLine());\n        }\n    }\n\n    stop() {\n        try {\n            var result = cmd.get('kill ' + this.miner.pid);\n            console.log('Stoping with result: ' + Object.keys(result));\n        } catch (err) {\n            consolole.log('What want wrong with stoping miner')\n        }\n    }\n\n    getCommandLine () {\n        const params = minerModel.getParams();\n        Object.keys(params).reduce((line, key)=> `${line} --${key} ${params[key]}`, '');\n    }\n\n    getMinerById(id){\n        return id\n        ? (\n            localStor.get('miners')\n            ? localStor.get('miners').find(miner => miner.id === this.miner.id)\n            : log.info('Not found list miners, for geting miner!)')\n        )\n        : log.info('For get miner by id need id!)');\n    }\n\n    updateInfo() {\n        if(this.miner.id) {\n            const miner = localStor.get('miners').find(miner => miner.id === this.miner.id);\n            if (miner) {\n                this.miner = Object.assign({}, this.miner, miner);\n            } else log.info('Miner with id ' + this.miner.id + ' is not found in list miners');\n        } else log.info('Update miner information impossible, isn`t initialized!');\n    }*/\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Miner);\n\n//# sourceURL=webpack:///./src/miner/Miner.js?");

/***/ }),

/***/ "./src/miner/driver.js":
/*!*****************************!*\
  !*** ./src/miner/driver.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! request */ \"request\");\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    getState: function getState() {\n        var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _libs_config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].miner.apiHost;\n        var port = arguments[1];\n\n        if (host && port) {\n            request__WEBPACK_IMPORTED_MODULE_0___default()(host + ':' + port + '/getstat', function (error, response, body) {\n                if (error) {\n                    log.error('Error with connecting to miner api: ' + error);\n                } else if (response.statusCode !== 200) {\n                    log.info('Status code from miner: ' + response.statusCode);\n                } else {\n                    return JSON.parse(body);\n                }\n            });\n        } else log.error('Check host or port for geting miner state(' + host + ', ' + port + ')');\n        return null;\n    }\n});\n\n//# sourceURL=webpack:///./src/miner/driver.js?");

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

/***/ "./src/server/middlewares.js":
/*!***********************************!*\
  !*** ./src/server/middlewares.js ***!
  \***********************************/
/*! exports provided: showCookies, setCookies */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showCookies\", function() { return showCookies; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setCookies\", function() { return setCookies; });\nvar showCookies = function showCookies(req, res, next) {\n    console.log(req.signedCookies);\n    next();\n};\nvar setCookies = function setCookies(req, res, next) {\n    res.setHeader('Cache-Control', 'public, max-age=0');\n    next();\n};\n\n//# sourceURL=webpack:///./src/server/middlewares.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _middlewares__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middlewares */ \"./src/server/middlewares.js\");\n/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routes */ \"./src/server/routes/index.js\");\n/* harmony import */ var _Cards_Card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Cards/Card */ \"./src/Cards/Card.js\");\n/* harmony import */ var _Cards_Cards__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Cards/Cards */ \"./src/Cards/Cards.js\");\n/* harmony import */ var _miner_Miner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../miner/Miner */ \"./src/miner/Miner.js\");\n/* harmony import */ var _libs_localStore__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../libs/localStore */ \"./src/libs/localStore.js\");\n/* harmony import */ var _libs_config__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../libs/config */ \"./src/libs/config.js\");\n/* harmony import */ var _html_loginForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./html/loginForm */ \"./src/server/html/loginForm.js\");\n\n\n\n\n\n\n\n\n//import nvidia from '../nvidia';\n//import miner from '../miner';\n//import robot from '../robot'\n\n\nvar log = __webpack_require__(/*! ../libs/log */ \"./src/libs/log.js\")(process.mainModule.filename); // eslint-disable-line\n\n\n\n// =========================initial\nvar versionApi = '.1';\n\n_libs_localStore__WEBPACK_IMPORTED_MODULE_7__[\"default\"].set('a1', 'Initial local store');\nconsole.log(_libs_localStore__WEBPACK_IMPORTED_MODULE_7__[\"default\"].get('a1'));\n\nvar app = express__WEBPACK_IMPORTED_MODULE_0___default()();\nvar port = 8080;\nvar clientIp = '';\nvar serverTimer = 0;\n\nvar minerConfig = {\n    api: '192.168.1.222:42000',\n    server: 'eu1-zcash.flypool.org',\n    port: 3333,\n    intensity: 60,\n    eexit: 3,\n    solver: 0,\n    fee: 0,\n    user: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy.slon'\n};\n\nvar CardsList = new _Cards_Cards__WEBPACK_IMPORTED_MODULE_5__[\"default\"]();\nvar ewbf1 = new _miner_Miner__WEBPACK_IMPORTED_MODULE_6__[\"default\"](minerConfig);\n// ============================end initial\n\napp.use('/', function (req, res, next) {\n    clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':');\n    clientIp = clientIp[clientIp.length - 1];\n    console.log(new Date() + ' ' + clientIp + ':' + req.method + '(' + req.originalUrl + ')');\n    next();\n});\n\napp.use('/login', function (req, res, next) {\n    if (clientIp !== 7798) {\n        //req.signedCookies.user  !== undefined &&\n        next();\n    } else {\n        res.status(500).send('Something broke!');\n    }\n});\n\napp.use('/login/form', function (req, res) {\n    return res.send(_html_loginForm__WEBPACK_IMPORTED_MODULE_9__[\"default\"]);\n});\napp.use(_middlewares__WEBPACK_IMPORTED_MODULE_2__[\"showCookies\"]);\nObject(_routes__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(app);\n\nvar limitSkipTickOfCardsDown = 5;\nvar skipedTicksOfCardsDown = 0;\n\n//ewbf1.run();\n\nsetInterval(function () {\n    // eslint-disable-line\n    serverTimer++;\n\n    if (!(serverTimer % 2)) {\n        CardsList.updateInfoCards();\n    }\n\n    if (!(serverTimer % 4)) {\n        //ewbf1.stop();\n        if (CardsList.getIdFreeCards().length) {\n            if (skipedTicksOfCardsDown === 0) {\n                skipedTicksOfCardsDown = limitSkipTickOfCardsDown + 1;\n                var listIdFreeCards = CardsList.getIdFreeCards();\n                var listFreeCards = listIdFreeCards.map(function (idCard) {\n                    var card = CardsList.getCard(idCard);\n                    return [card.gpuId, card.getHistoryPowerByTiks(5).join('W '), card.getHistoryGpuUtilByTiks(5).join('% ')];\n                });\n                log.error(new Date() + ' Alarm cards is down! ,' + listFreeCards);\n\n                ewbf1.restart();\n\n                skipedTicksOfCardsDown--;\n            }\n        } else skipedTicksOfCardsDown = 0;\n\n        //console.log(GTX1070.get('lastUpdates'), '->' , GTX1070.get('gpu.power_draw') + 'W', GTX1080.get('gpu.power_draw') + 'W');\n        //if (serverTimer > 3) ewbf1.stop();\n\n\n        //nvidia.updateInfo();\n        //miner.getMinerInfo();\n        /*miner.addMiner({\n            api: '192.168.1.222:42000',\n            server: 'eu1-zcash.flypool.org',\n            port: '3333',\n            intensity: '60',\n            eexit: '3',\n            solver: '0',\n            fee: '0',\n            user: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',\n        });*/\n        //robot();\n        //log.info('info')\n    }\n}, 1000);\n\nif (false) {}\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./src/server/server.js?");

/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/server/index ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! ./src/server/index */\"./src/server/index.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "bluebird":
/*!***************************!*\
  !*** external "bluebird" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bluebird\");\n\n//# sourceURL=webpack:///external_%22bluebird%22?");

/***/ }),

/***/ "colors/safe":
/*!******************************!*\
  !*** external "colors/safe" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"colors/safe\");\n\n//# sourceURL=webpack:///external_%22colors/safe%22?");

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