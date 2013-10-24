(function()
{
	// There should not be a CocoonJS object when this code is executed.
	// if (typeof window.CocoonJS !== 'undefined') throw("This is strange, a CocoonJS object already exists when trying to create it.");

    /**
    * The basic object for all the CocoonJS related specific APIs === extensions.
    * @namespace
    */
    CocoonJS = window.CocoonJS ? window.CocoonJS : {};

	CocoonJS.nativeExtensionObjectAvailable = typeof window.ext !== 'undefined';

	/**
	* This type represents a 2D size structure with horizontal and vertical values.
	* @namespace
	*/
	CocoonJS.Size = {
		/**
		* The horizontal size value.
		*/
		width : 0,

		/**
		* The vertical size value.
		*/
		height : 0
	};

	/**
	* This utility function allows to create an object oriented like hierarchy between two functions using their prototypes.
	* This function adds a "superclass" and a "__super" attributes to the subclass and it's functions to reference the super class.
	* @param {function} subc The subclass function.
	* @param {function} superc The superclass function.
	*/
	CocoonJS.extend = function(subc, superc) {
	    var subcp = subc.prototype;

	    // Class pattern.
	    var CocoonJSExtendHierarchyChainClass = function() {};
	    CocoonJSExtendHierarchyChainClass.prototype = superc.prototype;

	    subc.prototype = new CocoonJSExtendHierarchyChainClass();       // chain prototypes.
	    subc.superclass = superc.prototype;
	    subc.prototype.constructor = subc;

	    // Reset constructor. See Object Oriented Javascript for an in-depth explanation of this.
	    if (superc.prototype.constructor === Object.prototype.constructor) {
	        superc.prototype.constructor = superc;
	    }

	    // Check all the elements in the subclass prototype and add them to the chain object's prototype.
	    for (var method in subcp) {
	        if (subcp.hasOwnProperty(method)) {
	            subc.prototype[method] = subcp[method];

	            // // tenemos en super un metodo con igual nombre.
	            // if ( superc.prototype[method]) 
	            // {
	            //     subc.prototype[method]= (function(fn, fnsuper) 
	            //     {
	            //         return function() 
	            //         {
	            //             var prevMethod= this.__super;

	            //             this.__super= fnsuper;

	            //             var retValue= fn.apply(
	            //                     this,
	            //                     Array.prototype.slice.call(arguments) );

	            //             this.__super= prevMethod;

	            //             return retValue;
	            //         };
	            //     })(subc.prototype[method], superc.prototype[method]);
	            // }
	        }
	    }
	}

	/**
	* IMPORTANT: This function should only be used by Ludei.
	* This function allows a call to the native extension object function reusing the same arguments object.
	* Why is interesting to use this function instead of calling the native object's function directly?
	* As the CocoonJS object functions expicitly receive parameters, if they are not present and the native call is direcly mapped,
	* undefined arguments are passed to the native side. Some native functions do not check the parameters validation
	* correctly (just check the number of parameters passed).
	* Another solution instead of using this function call is to correctly check if the parameters are valid (not undefined) to make the
	* call, but it takes more work than using this approach.
	* @static
	* @param {string} nativeExtensionObjectName The name of the native extension object name. The object that is a member of the 'ext' object.
	* @param {string} nativeFunctionName The name of the function to be called inside the native extension object.
	* @param {object} arguments The arguments object of the CocoonJS extension object function. It contains all the arguments passed to the CocoonJS extension object function and these are the ones that will be passed to the native call too.
	* @param {boolean} [async] A flag to indicate if the makeCall (false or undefined) or the makeCallAsync function should be used to perform the native call.
	* @returns Whatever the native function call returns.
	*/
	CocoonJS.makeNativeExtensionObjectFunctionCall = function(nativeExtensionObjectName, nativeFunctionName, args, async) {
		if (CocoonJS.nativeExtensionObjectAvailable) {
			var argumentsArray = Array.prototype.slice.call(args);
			argumentsArray.unshift(nativeFunctionName);
			var nativeExtensionObject = ext[nativeExtensionObjectName];
			var makeCallFunction = async ? nativeExtensionObject.makeCallAsync : nativeExtensionObject.makeCall;
			var ret = makeCallFunction.apply(nativeExtensionObject, argumentsArray);
			var finalRet = ret;
			if (typeof ret === "string") {
				try	{
					finalRet = JSON.parse(ret);
				}
				catch(error) {
				}
			}
			return finalRet;
		}
	};

	/**
	* Returns an object retrieved from a path specified by a dot specified text path starting from a given base object.
	* It could be useful to find the reference of an object from a defined base object. For example the base object could be window and the
	* path could be "CocoonJS.App" or "document.body".
	* @param {Object} baseObject The object to start from to find the object using the given text path.
	* @param {string} objectPath The path in the form of a text using the dot notation. i.e. "document.body"
	* For example:
	* var body = getObjectFromPath(window, "document.body");
	*/
	CocoonJS.getObjectFromPath = function(baseObject, objectPath) {
    	var parts = objectPath.split('.');
    	var obj = baseObject;
        for (var i = 0, len = parts.length; i < len; ++i) 
        {
            obj[parts[i]] = obj[parts[i]] || undefined;
    		obj = obj[parts[i]];
    	}
    	return obj;
 	};

 	/**
 	* Returns the key for a value in a dictionary. It looks for an specific value inside a dictionary and returns the corresponding key.
 	* @param {Object} dictionary The dictionary to look for the value in and get the corresponding key.
 	* @param {Object} value The value to look for inside the dictionary and return it's corresponding key.
 	* @return The key that corresponds to the given value it is has been found or null.
 	*/
 	CocoonJS.getKeyForValueInDictionary = function(dictionary, value) {
        var finalKey = null;
        for (var key in dictionary) {
            if (dictionary[key] === value)            {
                finalKey = key;
                break;
            }
        }
        return finalKey;
 	}

 	/**
 	* Finds a string inside a given array of strings by looking for a given substring. It can also
 	* specify if the search must be performed taking care or not of the case sensitivity.
 	* @param {Array} stringArray The array of strings in which to to look for the string.
 	* @param {string} subString The substring to look for inside all the strings of the array.
 	* @param {boolean} caseSensitive A flag to indicate if the search must be performed taking case of the 
 	* case sensitiveness (true) or not (false).
 	* @return {string} The string that has been found or null if the substring is not inside any of the string of the array.
 	*/
 	CocoonJS.findStringInStringArrayThatIsIndexOf = function(stringArray, subString, caseSensitive) {
 		var foundString = null;
 		subString = caseSensitive ? subString : subString.toUpperCase();
 		for (var i = 0; foundString == null && i < stringArray.length; i++)	{
 			foundString = caseSensitive ? stringArray[i] : stringArray[i].toUpperCase();
 			foundString = foundString.indexOf(subString) >= 0 ? stringArray[i] : null; 
 		}
 		return foundString;
 	};

	/**
	* A class that represents objects to handle events. Event handlers have always the same structure:
	* Mainly they provide the addEventListener and removeEventListener functions.
	* Both functions receive a callback function that will be added or removed. All the added callback
	* functions will be called when the event takes place.
	* Additionally they also allow the addEventListenerOnce and notifyEventListeners functions.
	* @constructor
	* @param {string} nativeExtensionObjectName The name of the native extension object (inside the ext object) to be used.
	* @param {string} cocoonJSExtensionObjectName The name of the sugarized extension object.
	* @param {string} nativeEventName The name of the native event inside the ext object.
	* @param {number} [chainFunction] An optional function used to preprocess the listener callbacks. This function, if provided,
	* will be called before any of the other listeners.
	*/
	CocoonJS.EventHandler = function(nativeExtensionObjectName, cocoonJSExtensionObjectName, nativeEventName, chainFunction) {
		this.listeners = [];
		this.listenersOnce = [];
		this.chainFunction = chainFunction;

		/**
		* Adds a callback function so it can be called when the event takes place.
		* @param {function} listener The callback function to be added to the event handler object. See the referenced Listener function documentation for more detail in each event handler object's documentation.
		*/
		this.addEventListener = function(listener) {
			if (chainFunction) {
				var f = function() {
					chainFunction.call(this, arguments.callee.sourceListener, Array.prototype.slice.call(arguments)); 
				};
				listener.CocoonJSEventHandlerChainFunction = f;
				f.sourceListener = listener;
				listener = f;
			}

			var cocoonJSExtensionObject = CocoonJS.getObjectFromPath(CocoonJS, cocoonJSExtensionObjectName);
            if (cocoonJSExtensionObject && cocoonJSExtensionObject.nativeExtensionObjectAvailable) {
                ext[nativeExtensionObjectName].addEventListener(nativeEventName, listener);
            }
            else {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener < 0) {
                	this.listeners.push(listener);
                }
            }
		};

        this.addEventListenerOnce = function(listener)
		{
			if (chainFunction) {
				var f = function() { chainFunction(arguments.callee.sourceListener,Array.prototype.slice.call(arguments)); };
				f.sourceListener = listener;
				listener = f;
			}

			var cocoonJSExtensionObject = CocoonJS.getObjectFromPath(CocoonJS, cocoonJSExtensionObjectName);
            if (cocoonJSExtensionObject.nativeExtensionObjectAvailable) {
                ext[nativeExtensionObjectName].addEventListenerOnce(nativeEventName, listener);
            }
            else
            {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener < 0)
                {
                	this.listenersOnce.push(listener);
                }
            }
		};

        /**
         * Removes a callback function that was added to the event handler so it won't be called when the event takes place.
         * @param {function} listener The callback function to be removed from the event handler object. See the referenced Listener function documentation for more detail in each event handler object's documentation.
         */
        this.removeEventListener = function (listener) {

        	if (chainFunction) {
        		listener = listener.CocoonJSEventHandlerChainFunction;
        		delete listener.CocoonJSEventHandlerChainFunction;
        	}

			var cocoonJSExtensionObject = CocoonJS.getObjectFromPath(CocoonJS, cocoonJSExtensionObjectName);
            if (cocoonJSExtensionObject.nativeExtensionObjectAvailable) {
                ext[nativeExtensionObjectName].removeEventListener(nativeEventName, listener);
            }
            else {
                var indexOfListener = this.listeners.indexOf(listener);
                if (indexOfListener >= 0) {
                    this.listeners.splice(indexOfListener, 1);
                }
            }
        };

		this.notifyEventListeners = function() {
			var cocoonJSExtensionObject = CocoonJS.getObjectFromPath(CocoonJS, cocoonJSExtensionObjectName);
            if (cocoonJSExtensionObject && cocoonJSExtensionObject.nativeExtensionObjectAvailable) {
                ext[nativeExtensionObjectName].notifyEventListeners(nativeEventName);
            } else {

                var argumentsArray= Array.prototype.slice.call(arguments);
                var listeners =     Array.prototype.slice.call(this.listeners);
                var listenersOnce = Array.prototype.slice.call(this.listenersOnce);
                var _this = this;
                // Notify listeners after a while ;) === do not block this thread.
                setTimeout(function() {
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i].apply(_this, argumentsArray);
                    }
                    for (var i = 0; i < listenersOnce.length; i++) {
                        listenersOnce[i].apply(_this, argumentsArray);
                    }
                }, 0);

                _this.listenersOnce= [];
            }
		};
		return this;
	};

	/**
	* A simple timer class. Update it every loop iteration and get values from accumulated time to elapsed time in seconds or milliseconds.
	*/
	CocoonJS.Timer = function() {
		this.reset();
		return this;
	};

	CocoonJS.Timer.prototype = {
		currentTimeInMillis : 0,
		lastTimeInMillis : 0,
		elapsedTimeInMillis : 0,
		elapsedTimeInSeconds : 0,
		accumTimeInMillis : 0,

		/**
		Resets the timer to 0.
		*/
		reset : function() {
			this.currentTimeInMillis = this.lastTimeInMillis = new Date().getTime();
			this.accumTimeInMillis = this.elapsedTimeInMillis = this.elapsedTimeInSeconds = 0;
		},

		/**
		Updates the timer calculating the elapsed time between update calls.
		*/
		update : function() {
			this.currentTimeInMillis = new Date().getTime();
			this.elapsedTimeInMillis = this.currentTimeInMillis - this.lastTimeInMillis;
			this.elapsedTimeInSeconds = this.elapsedTimeInMillis / 1000.0;
			this.lastTimeInMillis = this.currentTimeInMillis;
			this.accumTimeInMillis += this.elapsedTimeInMillis;
		}
	};

	// CocoonJS.FindAllNativeBindingsInCocoonJSExtensionObject = function(cocoonJSExtensionObject, nativeFunctionBindingCallback, nativeEventBindingCallback)
	// {
	// 	for (var cocoonJSExtensionObjectAttributeName in cocoonJSExtensionObject)
	// 	{
	// 		var cocoonJSExtensionObjectAttribute = cocoonJSExtensionObject[cocoonJSExtensionObjectAttributeName];

	// 		// Function
	// 		if (typeof cocoonJSExtensionObjectAttribute === 'function' && typeof cocoonJSExtensionObjectAttribute.nativeFunctionName !== 'undefined')
	// 		{
	// 			var nativeFunctionName = cocoonJSExtensionObjectAttribute.nativeFunctionName;
	// 			nativeFunctionBindingCallback(cocoonJSExtensionObjectAttributeName, nativeFunctionName);
	// 		}
	// 		// Event object
	// 		else if (typeof cocoonJSExtensionObjectAttribute === 'object' && cocoonJSExtensionObjectAttribute !== null && typeof cocoonJSExtensionObjectAttribute.nativeEventName !== 'undefined')
	// 		{
	// 			var nativeEventName = cocoonJSExtensionObjectAttribute.nativeEventName;
	// 			nativeEventBindingCallback(cocoonJSExtensionObjectAttributeName, nativeEventName);
	// 		}
	// 	}
	// }

	/**
	This function looks for a CocoonJS extension object that is bound to the given native ext object name.
	@returns The CocoonJS extension object that corresponds to the give native extension object name or null if it cannot be found.
	*/
	// CocoonJS.GetCocoonJSExtensionObjectForNativeExtensionObjectName = function(nativeExtensionObjectName)
	// {
	// 	var cocoonJSExtensionObject = null;
	// 	// Look in the CocoonJS object and for every object that is a CocoonJS.Extension check if it's nativeExtensionObjectName matches to the one passed as argument. If so, create an object that will represent it's documentation for the native ext object.
	// 	for (var cocoonJSAttributeName in CocoonJS)
	// 	{
	// 		var cocoonJSAttribute = CocoonJS[cocoonJSAttributeName];
	// 		if (typeof cocoonJSAttribute === 'object' && cocoonJSAttribute instanceof CocoonJS.Extension && cocoonJSAttribute.nativeExtensionObjectName === nativeExtensionObjectName)
	// 		{
	// 			// We have found the CocoonJS object that represents the native ext extension object name. 
	// 			cocoonJSExtensionObject = cocoonJSAttribute;
	// 			break;
	// 		}
	// 	}
	// 	return cocoonJSExtensionObject;
	// };

	/**
	This function adds functions to a CocoonJS extension object in order to bind them to the native makeCall function calls of the ext object.

	@param extensionObject The reference to the CocoonJS extension object where to add the new functions bound to the ext object makeCall functions calls.

	@param nativeFunctionsConfiguration An array of objects with the following structure:

		{ nativeFunctionName : "" [, functionName : "", isAsync : true/false] }

		- nativeFunctionName: Specifies the name of the function inside the ext object makeCall function call that will be bound.
		- functionName: An optional attribute that allows to specify the name of the function to be added to the CocoonJS extension object. If is not present, the name of the function will be the same
		as the nativeFunctionName.
		- isAsync: An optional attribute that allows to specify if the call should be performed using makeCall (false or missing) or makeCallAsync (true).
		- alternativeFunction: An optional attribute that allows to specify an alternative function that will be called internally when this function is called. This attribute
		allows for adding new functionalities like for example adding methods 

	@returns The CocoonJS extension object.
	*/
	// CocoonJS.AddNativeFunctionBindingsToExtensionObject = function(extensionObject, nativeFunctionsConfiguration)
	// {
	// 	if (typeof extensionObject === 'undefined' || extensionObject === null) throw("The passed extension object be a valid object.");
	// 	if (typeof nativeFunctionsConfiguration === 'undefined' || nativeFunctionsConfiguration === null) throw("The passed native functions configuration array must be a valid object.");

	// 	for (var i = 0; i < nativeFunctionsConfiguration.length; i++)
	// 	{
	// 		if (typeof nativeFunctionsConfiguration[i].nativeFunctionName === 'undefined') throw("The 'nativeFunctionName' attribute in the native function configuration object at index '" + i + "' in the native function configuration array cannot be undefined.");
	// 		var nativeFunctionName = nativeFunctionsConfiguration[i].nativeFunctionName;
	// 		var functionName = typeof nativeFunctionsConfiguration[i].functionName !== 'undefined' ? nativeFunctionsConfiguration[i].functionName : nativeFunctionName;
	// 		var makeCallFunction = null;
	// 		makeCallFunction = typeof nativeFunctionsConfiguration[i].isAsync !== 'undefined' && nativeFunctionsConfiguration[i].isAsync ? extensionObject.nativeExtensionObject.makeCallAsync : extensionObject.nativeExtensionObject.makeCall;
	// 		// Add the new function to the CocoonJS extension object
	// 		extensionObject[functionName] = function()
	// 		{
	// 			// Convert the arguments object to an array
	// 			var arguments = Array.prototype.slice.call(arguments);
	// 			// Add the native function name as the first parameter
	// 			arguments.unshift(nativeFunctionName);
	// 			// Make the native ext object call
	// 			var result = makeCallFunction.apply(extensionObject.nativeExtensionObject, arguments);
	// 			return result;
	// 		}
	// 		// Add a property to the newly added function to store the name of the original function.
	// 		extensionObject[functionName].nativeFunctionName = nativeFunctionName;
	// 	}
	// 	return extensionObject;
	// };

	/**
	This function adds objects to a CocoonJS extension object to allow event listener handling (add and remove) bound to the native ext object event listener handling.

	@param extensionObject The reference to the CocoonJS extension object where to add the new objects bound to the ext object event listener handling.

	@param nativeEventsConfiguration An array of objects with the following structure:

		{ nativeEventName : "" [, eventObjectName : ""] }

		- nativeEventName: Specifies the event in the native ext object to be bound.
		- eventObjectName: An optional attribute that allows to specify the name of the object to be added to the CocoonJS extension object. If is not present, the name of the function will be the same
		as the nativeEventName.
		- alternativeAddEventListenerFunction:
		- alternativeRemoveEventListenerFunction:

	@returns The CocoonJS extension object.
	*/
	// CocoonJS.AddNativeEventBindingsToExtensionObject = function(extensionObject, nativeEventsConfiguration)
	// {
	// 	if (typeof extensionObject === 'undefined' || extensionObject === null) throw("The passed extension object be a valid object.");
	// 	if (typeof nativeEventsConfiguration === 'undefined' || nativeEventsConfiguration === null) throw("The passed native events configuration array must be a valid object.");

	// 	for (var i = 0; i < nativeEventsConfiguration.length; i++)
	// 	{
	// 		if (typeof nativeEventsConfiguration[i].nativeEventName === 'undefined') throw("The 'nativeEventName' attribute in the native event configuration object at index '" + i + "' in the native event configuration array cannot be undefined.");
	// 		var nativeEventName = nativeEventsConfiguration[i].nativeEventName;
	// 		var eventObjectName = typeof nativeEventsConfiguration[i].eventObjectName !== 'undefined' ? nativeEventsConfiguration[i].eventObjectName : nativeEventName;
	// 		// Anonymous function call so each variable in the loop is used in the event listener handling function bindings.
	// 		(function(nativeEventName, eventObjectName)
	// 		{
	//     		extensionObject[eventObjectName] =
	//     		{
	//     			// Store the native event name
	//     			nativeEventName : nativeEventName,
	//     			// Create the event listener management functions bound to the native counterparts
	//     			addEventListener : function(callback)
	// 	    		{
	// 	    			extensionObject.nativeExtensionObject.addEventListener(nativeEventName, callback);
	//     			},
	//     			removeEventListener : function(callback)
	//     			{
	// 	    			extensionObject.nativeExtensionObject.removeEventListener(nativeEventName, callback);
	//     			}
	//     			// ,
	//     			// removeAllEventListeners : function()
	//     			// {

	//     			// }
	//     		};
	// 		})(nativeEventName, eventObjectName);
	// 	}
	// 	return extensionObject;
	// };

	/**
	The function object constructor function all the CocoonJS extensions can use to instantiate the CocoonJS extension object and add all the functionality needed bound to the native ext object.

	@param nativeExtensionObject The reference to the ext object extension object.

	@param nativeFunctionsConfiguration See CocoonJS.AddNativeFunctionBindingsToExtensionObject function's documentation for more details.

	@param nativeEventsConfiguration See CocoonJS.AddNativeEventBindingsToExtensionObject function's documentation for more details.

	@returns The new CocoonJS extension object.
	*/
	// CocoonJS.Extension = function(nativeExtensionObjectName, nativeFunctionsConfiguration, nativeEventsConfiguration)
	// {
	// 	if (typeof nativeExtensionObjectName === 'undefined' || nativeExtensionObjectName === null) throw("The native extension object name cannot be null");

	// 	if (window.ext[nativeExtensionObjectName] === 'undefined') throw("The given native extension object name '" + nativeExtensionObjectName + "' is incorrect or the native extension object is undefined.");

	// 	var nativeExtensionObject = window.ext[nativeExtensionObjectName];

	// 	// Store a reference to the native extension object and to it's name
	// 	this.nativeExtensionObject = nativeExtensionObject;
	// 	this.nativeExtensionObjectName = nativeExtensionObjectName;

	// 	// If native function configuration is passed, use it to add some functions to the new extension object.
	// 	if (typeof nativeFunctionsConfiguration !== 'undefined')
	// 	{
	// 		CocoonJS.AddNativeFunctionBindingsToExtensionObject(this, nativeFunctionsConfiguration);
	// 	}

	// 	// If native event configuration is passed, use it to add some event objects to the new extension object.
	// 	if (typeof nativeEventsConfiguration !== 'undefined')
	// 	{
	// 		CocoonJS.AddNativeEventBindingsToExtensionObject(this, nativeEventsConfiguration);
	// 	}

	// 	return this;
	// };   

})();

	