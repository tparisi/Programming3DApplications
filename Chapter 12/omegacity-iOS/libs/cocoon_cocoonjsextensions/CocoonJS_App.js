(function () {
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
     * This namespace represents all the basic functionalities available in the CocoonJS extension API.
     * @namespace
     */
    CocoonJS.App = CocoonJS.App ? CocoonJS.App : {};

    CocoonJS.App.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.IDTK_APP !== 'undefined';

    /**
     * The predefined possible layouts for the FPS overlay.
     * @namespace
     */
    CocoonJS.App.FPSLayout = {
        TOP_LEFT:'top-left',
        TOP_RIGHT:'top-right',
        BOTTOM_LEFT:'bottom-left',
        BOTTOM_RIGHT:'bottom-right'
    };

    /**
     * Contains all the possible values to specify the input keyboard type to be used when introducing text.
     * @namespace
     */
    CocoonJS.App.KeyboardType = {
        /**
         * Represents a generic text input keyboard.
         */
        TEXT:"text",

        /**
         * Represents a number like input keyboard.
         */
        NUMBER:"num",

        /**
         * Represents a phone like input keyboard.
         */
        PHONE:"phone",

        /**
         * Represents an email like input keyboard.
         */
        EMAIL:"email",

        /**
         * Represents an URL like input keyboard.
         */
        URL:"url"
    };

    /**
     * The storage types to be used with file system related operations.
     * @namespace
     */
    CocoonJS.App.StorageType = {
        /**
         * Represents the application storage. The application storage is the place where all the resources that come with the application are stored.
         */
        APP_STORAGE:"APP_STORAGE",

        /**
         * Represents the internal storage. The internal storage is a different storage space that the application storage and only the data that the application has stored
         * in it will be in this storage. It is internal to the platform/device.
         */
        INTERNAL_STORAGE:"INTERNAL_STORAGE",

        /**
         * Represents an external storage. The external storage is similar to the internal storage in the sense that it only contains information that the application has written
         * in it but it represents an external storage device like a SD-CARD. If there is no exrernal storage, it will represent the same as the internal storage.
         */
        EXTERNAL_STORAGE:"EXTERNAL_STORAGE",

        /**
         * Represents the temporal storage. Same as the internal and external storage spaces in the sense that it only contains information that the application has written
         * in it but the main difference is that the information in this storage may dissapear without notice.
         */
        TEMPORARY_STORAGE:"TEMPORARY_STORAGE"
    };

    /**
     * The capture types to capture screenshots using CocoonJS native capabilities.
     * @namespace
     */
    CocoonJS.App.CaptureType = {
        /**
         Captures everything, both the CocoonJS GL hardware accelerated surface and the system views (like the WebView).
         */
        EVERYTHING:0,

        /**
         * Captures just the CocoonJS GL hardware accelerated surface.
         */
        JUST_COCOONJS_GL_SURFACE:1,

        /**
         * Captures just the sustem views (like the webview)
         */
        JUST_SYSTEM_VIEWS:2
    };

    /**
     * Makes a forward call of some javascript code to be executed in a different environment (i.e. from CocoonJS to the WebView and viceversa).
     * It waits until the code is executed and the result of it is returned === synchronous.
     * @function
     * @param {string} javaScriptCode Some JavaScript code in a string to be forwarded and executed in a different JavaScript environment (i.e. from CocoonJS to the WebView and viceversa).
     * @return {string} The result of the execution of the passed JavaScript code in the different JavaScript environment.
     */
    CocoonJS.App.forward = function (javaScriptCode) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "forward", arguments);
        }
        else if (!navigator.isCocoonJS) {
            if (window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
                return window.parent.eval(javaScriptCode);
            }
            else {
                //return window.parent.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode);
                return window.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode);
            }
        }
    };

    /**
     * Makes a forward call of some javascript code to be executed in a different environment (i.e. from CocoonJS to the WebView and viceversa).
     * It is asyncrhonous so it does not wait until the code is executed and the result of it is returned. Instead, it calls a callback function when the execution has finished to pass the result.
     * @function
     * @param {string} javaScriptCode Some JavaScript code in a string to be forwarded and executed in a different JavaScript environment (i.e. from CocoonJS to the WebView and viceversa).
     * @param {function} [returnCallback] A function callback that will be called when the passed JavaScript code is executed in a different thread to pass the result of the execution in the different JavaScript environment.
     */
    CocoonJS.App.forwardAsync = function (javaScriptCode, returnCallback) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            if (typeof returnCallback !== 'undefined') {
                return ext.IDTK_APP.makeCallAsync("forward", javaScriptCode, returnCallback);
            }
            else {
                return ext.IDTK_APP.makeCallAsync("forward", javaScriptCode);
            }
        }
        else if (!navigator.isCocoonJS) {
            if (window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
                return window.parent.eval(javaScriptCode);
            }
            else {
                return window.parent.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode);
                // window.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.eval(javaScriptCode);
            }
        }
    };

    /**
     * Pops up a text dialog so the user can introduce some text and the application can get it back. It is the first approach CocoonJS has taken to be able to introduce
     * text input in a easy way. The dialog execution events are passed to the application through the {@link CocoonJS.App.onTextDialogFinished} and the {@link CocoonJS.App.onTextDialogCancelled} event objects.
     * @function
     * @param {string} [title] Default value is "". The title to be displayed in the dialog.
     * @param {string} [message] Default value is "". The message to be displayed in the dialog, next to the text input field.
     * @param {string} [text] Default value is "". The initial text to be introduced in the text input field.
     * @param {CocoonJS.App.KeyboardType} [keyboardType] Default value is {@link CocoonJS.App.KeyboardType.TEXT}. The keyboard type to be used when the text has to be introduced.
     * @param {string} [cancelButtonText] Default value is "". The text to be displayed in the cancel button of the dialog.
     * @param {string} [okButtonText] Default value is "". The text to be displayed in the ok button of the dialog.
     * @see CocoonJS.App.onTextDialogFinished
     * @see CocoonJS.App.onTextDialogCancelled
     */
    CocoonJS.App.showTextDialog = function (title, message, text, keyboardType, cancelButtonText, okButtonText) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "showTextDialog", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            if (!message) {
                message = "";
            }
            if (!text) {
                text = "";
            }
            var result = prompt(message, text);
            var eventObject = result ? CocoonJS.App.onTextDialogFinished : CocoonJS.App.onTextDialogCancelled;
            eventObject.notifyEventListeners(result);
        }
    };

    /**
     * Pops up a message dialog so the user can decide between a yes or no like confirmation. The message box execution events are passed to the application through the {@link CocoonJS.App.onMessageBoxConfirmed} and the {@link CocoonJS.App.onMessageBoxDenied} event objects.
     * @function
     * @param {string} [title] Default value is "". The title to be displayed in the dialog.
     * @param {string} [message] Default value is "". The message to be displayed in the dialog, next to the text input field.
     * @param {string} [confirmButtonText] Default value is "Yes". The text to be displayed for the confirm button.
     * @param {string} [denyButtonText] Default value is "No". The text to be displayed for the deny button.
     * @see CocoonJS.App.onMessageBoxConfirmed
     * @see CocoonJS.App.onMessageBoxDenied
     */
    CocoonJS.App.showMessageBox = function (title, message, confirmButtonText, denyButtonText) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "showMessageBox", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            if (!message) {
                message = "";
            }
            var result = confirm(message);
            var eventObject = result ? CocoonJS.App.onMessageBoxConfirmed : CocoonJS.App.onMessageBoxDenied;
            eventObject.notifyEventListeners();
        }
    };

    /**
     * It allows to load a new JavaScript/HTML5 resource that can be loaded either locally (inside the platform/device storage) or using a remote URL.
     * @function
     * @param {string} path A path to a resource stored in the platform or in a URL to a remote resource.
     * @param {CocoonJS.App.StorageType} [storageType] If the path argument represents a locally stored resource, the developer can specify the storage where it is stored. If no value is passes, the {@link CocoonJS.App.StorageType.APP_STORAGE} value is used by default.
     */
    CocoonJS.App.load = function (path, storageType) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "loadPath", arguments);
        }
        else if (!navigator.isCocoonJS) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (event) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // TODO: As window load event is not being called (WHY???), I have decided to call the listeners directly
                        // var callback= function(event){
                        //     window.removeEventListener("load", callback);
                        var jsCode;
                        // If there is no webview, it means we are in the webview, so notify the CocoonJS environment
                        if (!CocoonJS.App.EmulatedWebViewIFrame) {
                            jsCode = "window.CocoonJS && window.CocoonJS.App.onLoadInTheWebViewSucceed.notifyEventListeners('" + path + "');";
                        }
                        // If there is a webview, it means we are in CocoonJS, so notify the webview environment
                        else {
                            jsCode = "window.CocoonJS && window.CocoonJS.App.onLoadInCocoonJSSucceed.notifyEventListeners('" + path + "');";
                        }
                        CocoonJS.App.forwardAsync(jsCode);
                        // };
                        // window.addEventListener("load", callback);
                        window.location.href = path;
                    }
                    else if (xhr.status === 404) {
                        this.onreadystatechange = null;
                        var jsCode;
                        // If there is no webview, it means we are in the webview, so notify the CocoonJS environment
                        if (!CocoonJS.App.EmulatedWebViewIFrame) {
                            jsCode = "CocoonJS && CocoonJS.App.onLoadInTheWebViewFailed.notifyEventListeners('" + path + "');";
                        }
                        // If there is a webview, it means we are in CocoonJS, so notify the webview environment
                        else {
                            jsCode = "CocoonJS && CocoonJS.App.onLoadInCocoonJSFailed.notifyEventListeners('" + path + "');";
                        }
                        CocoonJS.App.forwardAsync(jsCode);
                    }
                }
            };
            xhr.open("GET", path, true);
            xhr.send();
        }
    };

    /**
     * Reloads the last loaded path in the current context.
     * @function
     */
    CocoonJS.App.reload = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "reload", arguments);
        }
        else if (!navigator.isCocoonJS) {
            if (window.name == 'CocoonJS_App_ForCocoonJS_WebViewIFrame') {
                return window.parent.location.reload();
            }
            else {
                return window.parent.frames['CocoonJS_App_ForCocoonJS_WebViewIFrame'].window.location.reload();
            }
        }
    };

    /**
     * Opens a given URL using a system service that is able to open it. For example, open a HTTP URL using the system WebBrowser.+
     * @function
     * @param {string} url The URL to be opened by a system service.
     */
    CocoonJS.App.openURL = function (url) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "openURL", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            window.open(url, '_blank');
        }
    }

    /**
     * Forces the app to be finished.
     * @function
     */
    CocoonJS.App.forceToFinish = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "forceToFinish", arguments);
        }
        else if (!navigator.isCocoonJS) {
            window.close();
        }
    }

    /**
     * Enables or disables the auto lock to control if the screen keeps on after an inactivity period.
     * When the auto lock is enabled and the application has no user input for a short period, the system puts the device into a "sleep” state where the screen dims or turns off.
     * When the auto lock is disabled the screen keeps on even when there is no user input for long times.
     * @param enabled A boolean value that controls whether to enable or disable the auto lock.
     */
    CocoonJS.App.setAutoLockEnabled = function (enabled) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "setAutoLockEnabled", arguments);
        }
    }

    /**
     * Creates a canvas element that is automatically resized to the screen size. When the app is being executed
     * inside CocoonJS. This canvas is optimized for rendering so it is higly recommended to use it if it fits
     * your app needs. If your app uses one canvas as the main canvas where all other canvases and images are displayed, Ludei recommends to
     * call this function in order to create this main canvas. A usual 2x performance gain is achieved by doing so
     * depending on the device and the graphics card driver.
     * @function
     * @return {object} The canvas object that should be used as the main canvas and that is resized to the screen resolution.
     */
    CocoonJS.App.createScreenCanvas = function () {
        var screenCanvas;
        if (navigator.isCocoonJS) {
            screenCanvas = document.createElement("screencanvas");
        }
        else if (!navigator.isCocoonJS) {
            screenCanvas = document.createElement("canvas");
            screenCanvas.width = window.innerWidth;
            screenCanvas.height = window.innerHeight;
        }
        return screenCanvas;
    };

    /**
     * Disables the touch events in the CocoonJS environment.
     * @function
     */
    CocoonJS.App.disableTouchInCocoonJS = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCall("disableTouchLayer", "CocoonJSView");
        }
    };

    /**
     * Enables the touch events in the CocoonJS environment.
     * @function
     */
    CocoonJS.App.enableTouchInCocoonJS = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCall("enableTouchLayer", "CocoonJSView");
        }
    };

    /**
     * Disables the touch events in the WebView environment.
     * @function
     */
    CocoonJS.App.disableTouchInTheWebView = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCall("disableTouchLayer", "WebView");
        }
    };

    /**
     * Enables the touch events in the WebView environment.
     * @function
     */
    CocoonJS.App.enableTouchInTheWebView = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCall("enableTouchLayer", "WebView");
        }
    };

    /**
     * Setups the update interval in seconds (1 second / X frames) to receive the accelerometer updates.
     * It defines the rate at which the devicemotion events are updated.
     * @function
     * @param {number} updateIntervalInSeconds The update interval in seconds to be set.
     */
    CocoonJS.App.setAccelerometerUpdateIntervalInSeconds = function (updateIntervalInSeconds) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("setAccelerometerUpdateIntervalInSeconds", updateIntervalInSeconds);
        }
    };

    /**
     * Returns the update interval in seconds that is currently set for accelerometer related events.
     * @function
     * @return {number} The update interval in seconds that is currently set for accelerometer related events.
     */
    CocoonJS.App.getAccelerometerUpdateIntervalInSeconds = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("getAccelerometerUpdateIntervalInSeconds");
        }
    };

    /**
     * Setups the update interval in seconds (1 second / X frames) to receive the gyroscope updates.
     * It defines the rate at which the devicemotion and deviceorientation events are updated.
     * @function
     * @param {number} updateIntervalInSeconds The update interval in seconds to be set.
     */
    CocoonJS.App.setGyroscopeUpdateIntervalInSeconds = function (updateIntervalInSeconds) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("setGyroscopeUpdateIntervalInSeconds", updateIntervalInSeconds);
        }
    };

    /**
     * Returns the update interval in seconds that is currently set for gyroscope related events.
     * @function
     * @return {number} The update interval in seconds that is currently set for gyroscope related events.
     */
    CocoonJS.App.getGyroscopeUpdateIntervalInSeconds = function () {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCall("getGyroscopeUpdateIntervalInSeconds");
        }
    };


    /**
     * Setups a origin proxy for a given typeName. What this means is that after calling this function the environment that makes this call will suddenly
     * have a way of creating instances of the given typeName and those instances will act as a transparent proxy to counterpart instances in the destination environment.
     * Manipulating attributes, calling funcitions or handling events will all be performed in the destination environment but the developer will think they will be
     * happening in the origin environment.
     * IMPORTANT NOTE: These proxies only work with types that use attributes and function parameters and return types that are primitive like numbers, strings or arrays.
     * @param {string} typeName The name of the type to be proxified.
     * @param {array} [attributeNames] A list of the names of the attributes to be proxified.
     * @param {array} [functionNames] A list of the names of the functions to be proxified.
     * @param {array} [eventHandlerNames] A list of the names of the event handlers to be proxified (onXXXX like attributes that represent callbacks).
     * A valid typeName and at least one valid array for attribute, function or event handler names is mandatory.
     */
    CocoonJS.App.setupOriginProxyType = function (typeName, attributeNames, functionNames, eventHandlerNames) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            // Control the parameters.
            if (!typeName) throw "The given typeName must be valid.";
            if (!attributeNames && !functionNames && !eventHandlerNames) throw "There is no point on setting up a proxy for no attributes, functions nor eventHandlers.";
            attributeNames = attributeNames ? attributeNames : [];
            functionNames = functionNames ? functionNames : [];
            eventHandlerNames = eventHandlerNames ? eventHandlerNames : [];

            // The parent object will be the window. It could be another object but careful, the destination side should know about this.
            // TODO: Specify the parentObject as a parameter, obtain it's path from the window object and pass it to the destination environment so it knows about it.
            var parentObject = window;

            // Setup the destination side too.
            var jsCode = "CocoonJS.App.setupDestinationProxyType(" + JSON.stringify(typeName) + ", " + JSON.stringify(eventHandlerNames) + ");";
            CocoonJS.App.forward(jsCode);

            var originalType = parentObject[typeName];

            // Constructor. This will be the new proxified type in the origin environment. Instances of this type will be created by the developer without knowing that they are
            // internally calling to their counterparts in the destination environment.
            parentObject[typeName] = function () {
                var _this = this;

                // Each proxy object will have a origin object inside with all the necessary information to be a proxy to the destination.
                this._cocoonjs_proxy_object_data = {};
                // The id is obtained calling to the destination side to create an instance of the type.
                var jsCode = "CocoonJS.App.newDestinationProxyObject(" + JSON.stringify(typeName) + ");";
                this._cocoonjs_proxy_object_data.id = CocoonJS.App.forward(jsCode);
                // The eventHandlers dictionary contains objects of the type { eventHandlerName : string, eventHandler : function } to be able to make the callbacks when the 
                // webview makes the corresponding calls.
                this._cocoonjs_proxy_object_data.eventHandlers = {};
                // Also store the typename inside each instance.
                this._cocoonjs_proxy_object_data.typeName = typeName;
                // A dictionary to store the event handlers
                this._cocoonjs_proxy_object_data.eventListeners = {};

                // TODO: eventHandlers and eventListeners should be in the same list ;)

                // Store all the proxy instances in a list that belongs to the type itself.
                parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[this._cocoonjs_proxy_object_data.id] = this;

                // Create a setter and a getter for all the attribute names that have been specified. When the attributes are accessed (set or get) a call to the destination counterpart will be performed.
                for (var i = 0; i < attributeNames.length; i++) {
                    (function (attributeName) {
                        _this.__defineSetter__(attributeName, function (value) {
                            var jsCode = "CocoonJS.App.setDestinationProxyObjectAttribute(" + JSON.stringify(typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(attributeName) + ", " + JSON.stringify(value) + ");";
                            return CocoonJS.App.forwardAsync(jsCode);
                        });
                        _this.__defineGetter__(attributeName, function () {
                            var jsCode = "CocoonJS.App.getDestinationProxyObjectAttribute(" + JSON.stringify(typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(attributeName) + ");";
                            return CocoonJS.App.forwardAsync(jsCode);
                        });
                    })(attributeNames[i]);
                }

                // Create a function that performs a call to the destination environment counterpart for all the function names that have been specified.
                for (var i = 0; i < functionNames.length; i++) {
                    (function (functionName) {
                        _this[functionName] = function () {
                            // Get the arguments as an array and add the typeName, the proxy id and the functionName before all the other arguments before making the call to the destination counterpart.
                            var argumentsArray = Array.prototype.slice.call(arguments);
                            argumentsArray.unshift(functionName);
                            argumentsArray.unshift(this._cocoonjs_proxy_object_data.id);
                            argumentsArray.unshift(typeName);
                            // Use the array to create the correct function call.
                            var jsCode = "CocoonJS.App.callDestinationProxyObjectFunction(";
                            for (var i = 0; i < argumentsArray.length; i++) {
                                // The second argument (the id) should not be stringified
                                jsCode += (i !== 1 ? JSON.stringify(argumentsArray[i]) : argumentsArray[i]) + (i < argumentsArray.length - 1 ? ", " : "");
                            }
                            jsCode += ");";
                            // TODO: This next call should be synchronous but it seems that some customers are experiencing some crash issues. Making it async solves these crashes.
                            // Another possible solution could be to be able to specify which calls could be async and which sync in the proxification array.
                            var ret = CocoonJS.App.forwardAsync(jsCode);
                            return ret;
                        };
                    })(functionNames[i]);
                }

                // Create a setter and getter for all the event handler names that have been specified. When the event handlers are accessed, store them inside the corresponding position on the eventHandlers
                // array so they can be called when the destination environment makes the corresponding callback call.
                for (var i = 0; i < eventHandlerNames.length; i++) {
                    (function (eventHandlerName) {
                        _this.__defineSetter__(eventHandlerName, function (value) {
                            _this._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName] = value;
                        });
                        _this.__defineGetter__(eventHandlerName, function () {
                            return _this._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName];
                        });
                    })(eventHandlerNames[i]);
                }

                // Setup the add and remove event listeners in the proxy object
                _this.addEventListener = function (eventTypeName, eventCallback) {
                    var addEventCallback = true;
                    // Check for the eventListeners
                    var eventListeners = _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName];
                    if (eventListeners) {
                        // As the eventListeners were already added, check that the same callback has not been added.
                        addEventCallback = eventListeners.indexOf(eventCallback) < 0;
                    }
                    else {
                        // There are no event listeners, so add the one and add the listeners array for the specific event type name
                        eventListeners = [];
                        _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName] = eventListeners;

                        // Forward the call so the other end registers a event listener (only one is needed).
                        var jsCode = "CocoonJS.App.addDestinationProxyObjectEventListener(" + JSON.stringify(_this._cocoonjs_proxy_object_data.typeName) + ", " + _this._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventTypeName) + ");";
                        CocoonJS.App.forwardAsync(jsCode);
                    }
                    // Only if the alforithm above specify so, add the eventcallback and notify the destination environment to do the same
                    if (addEventCallback) {
                        eventListeners.push(eventCallback);
                    }
                };

                _this.removeEventListener = function (eventTypeName, eventCallback) {
                    // Check for the eventListeners
                    var eventListeners = _this._cocoonjs_proxy_object_data.eventListeners[eventTypeName];
                    if (eventListeners) {
                        var eventCallbackIndex = eventListeners.indexOf(eventCallback);
                        if (eventCallbackIndex >= 0) {
                            eventListeners.splice(eventCallbackIndex, 1);
                        }
                    }
                };

                // Return the proxy instance.
                return this;
            };

            // The type will contain a proxy data structure to store all the instances that are created so they are available when the destination environment calls back. 
            parentObject[typeName]._cocoonjs_proxy_type_data =
            {
                originalType:originalType,
                proxyObjects:[]
            };

            /**
             * Deletes a proxy instance from both the CocoonJS environment structures and also deleting it's webview environment counterpart.
             * This function should be manually called whenever a proxy instance won't be accessed anymore.
             * @param {object} object The proxy object to be deleted.
             */
            parentObject[typeName]._cocoonjs_proxy_type_data.deleteProxyObject = function (object) {
                var proxyObjectKey = CocoonJS.getKeyForValueInDictionary(this.proxyObjects, object);
                if (proxyObjectKey) {
                    var jsCode = "CocoonJS.App.deleteDestinationProxyObject(" + JSON.stringify(typeName) + ", " + object._cocoonjs_proxy_object_data.id + ");";
                    CocoonJS.App.forwardAsync(jsCode);
                    object._cocoonjs_proxy_object_data = null;
                    delete this.proxyObjects[proxyObjectKey];
                }
            };

            /**
             * Calls a event handler for the given proxy object id and eventHandlerName.
             * @param {number} id The id to be used to look for the proxy object for which to make the call to it's event handler.
             * @param {string} eventHandlerName The name of the handler to be called.
             * NOTE: Events are a complex thing in the HTML specification. This function just performs a call but at least provides a
             * structure to the event passing the target (the proxy object).
             * TODO: The destination should serialize the event object as far as it can so many parameters can be passed to the origin
             * side. Using JSON.stringify in the destination side and parse in origin side maybe? Still must add the target to the event structure though.
             */
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventHandler = function (id, eventHandlerName) {
                var object = this.proxyObjects[id];
                var eventHandler = object._cocoonjs_proxy_object_data.eventHandlers[eventHandlerName];
                if (eventHandler) {
                    eventHandler({ target:object });
                }
            };

            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventListeners = function (id, eventTypeName) {
                var object = this.proxyObjects[id];
                var eventListeners = object._cocoonjs_proxy_object_data.eventListeners[eventTypeName].slice();
                for (var i = 0; i < eventListeners.length; i++) {
                    eventListeners[i]({ target:object });
                }
            };
        }
    };

    /**
     * Takes down the proxification of a type and restores it to it's original type. Do not worry if you pass a type name that is not proxified yet. The
     * function will handle it correctly for compativility reasons.
     * @param {string} typeName The name of the type to be deproxified (take down the proxification and restore the type to it's original state)
     */
    CocoonJS.App.takedownOriginProxyType = function (typeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            if (parentObject[typeName] && parentObject[typeName]._cocoonjs_proxy_type_data) {
                parentObject[typeName] = parentObject[typeName]._cocoonjs_proxy_type_data.originalType;
            }
        }
    };

    /**
     * Deletes everything related to a proxy object in both environments. Do not worry of you do not pass a proxified object to the
     * function. For compatibility reasons, you can still have calls to this function even when no poxification of a type has been done.
     * @param {object} object The proxified object to be deleted.
     */
    CocoonJS.App.deleteOriginProxyObject = function (object) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            if (object && object._cocoonjs_proxy_object_data) {
                parentObject[object._cocoonjs_proxy_object_data.typeName]._cocoonjs_proxy_type_data.deleteProxyObject(object);
            }
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the destination environment whenever it is needed to work with proxy objects.
     * It calls the origin proxy object when an event handler need to be updated/called from the destination environment.
     * @param {string} typeName The type name of the proxified type.
     * @param {number} id The id of the proxy object.
     * @param {string} eventHandlerName The name of the event handler to be called.
     */
    CocoonJS.App.callOriginProxyObjectEventHandler = function (typeName, id, eventHandlerName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventHandler(id, eventHandlerName);
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the destination environment whenever it is needed to work with proxy objects.
     * It calls the origin proxy object when all the event listeners related to a specific event need to be updated/called from the destination environment.
     * @param {string} typeName The type name of the proxified type.
     * @param {number} id The id of the proxy object.
     * @param {string} eventTypeName The name of the event type to call the listeners related to it.
     */
    CocoonJS.App.callOriginProxyObjectEventListeners = function (typeName, id, eventTypeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            parentObject[typeName]._cocoonjs_proxy_type_data.callProxyObjectEventListeners(id, eventTypeName);
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the origin environment whenever it is needed to work with proxy objects.
     * Setups all the structures that are needed to proxify a destination type to an origin type.
     * @param {string} typeName The name of the type to be proxified.
     * @param {array} eventHandlerNames An array with al the event handlers to be proxified. Needed in order to be able to create callbacks for all the event handlers
     * and call to the CocoonJS counterparts accordingly.
     */
    CocoonJS.App.setupDestinationProxyType = function (typeName, eventHandlerNames) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;

            // Add a cocoonjs structure to the destination proxified type to store some useful information like all the proxy instances that are created, plus the id counter 
            // and the names of all the event handlers and some utility functions.
            parentObject[typeName]._cocoonjs_proxy_type_data =
            {
                nextId:0,
                proxyObjects:{},
                eventHandlerNames:eventHandlerNames
            }
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the origin environment whenever it is needed to work with proxy objects.
     * Takes down the proxy type at the destination environment. Just removes the data structure related to proxies that was added to the type when proxification tool place.
     * @param {string} typeName The name of the type to take the proxification down.
     */
    CocoonJS.App.takedownDestinationProxyType = function (typeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            if (parent[typeName] && parentObject[typeName]._cocoonjs_proxy_type_data) {
                delete parentObject[typeName]._cocoonjs_proxy_type_data;
            }
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the original environment whenever it is needed to work with proxy objects.
     * Creates a new destination object instance and generates a id to reference it from the original environment.
     * @param {string} typeName The name of the type to be proxified and to generate an instance.
     * @return The id to be used from the original environment to identify the corresponding destination object instance.
     */
    CocoonJS.App.newDestinationProxyObject = function (typeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;

            var proxyObject = new parentObject[typeName]();
            // Also store some additional information in the proxy object
            proxyObject._cocoonjs_proxy_object_data = {};
            // Like the type name, that could be useful late ;)
            proxyObject._cocoonjs_proxy_object_data.typeName = typeName;
            // Caculate the id for the object. It will be returned to the origin environment so this object can be referenced later
            var proxyObjectId = parentObject[typeName]._cocoonjs_proxy_type_data.nextId;
            // Store the created object in the structure defined in the setup of proxification with an id associated to it
            parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[proxyObjectId] = proxyObject;
            // Also store the id inside the proxy object itself
            proxyObject._cocoonjs_proxy_object_data.id = proxyObjectId;
            // Calculate a new id for the next object.
            parentObject[typeName]._cocoonjs_proxy_type_data.nextId++;

            // Setup all the event handlers.
            for (var i = 0; i < parentObject[typeName]._cocoonjs_proxy_type_data.eventHandlerNames.length; i++) {
                (function (eventHandlerName) {
                    proxyObject[eventHandlerName] = function (event) {
                        var proxyObject = this; // event.target;
                        // var eventHandlerName = CocoonJS.getKeyForValueInDictionary(proxyObject, this); // Avoid closures ;)
                        var jsCode = "CocoonJS.App.callOriginProxyObjectEventHandler(" + JSON.stringify(proxyObject._cocoonjs_proxy_object_data.typeName) + ", " + proxyObject._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventHandlerName) + ");";
                        CocoonJS.App.forwardAsync(jsCode);
                    };
                })(parentObject[typeName]._cocoonjs_proxy_type_data.eventHandlerNames[i]);
            }

            // Add the dictionary where the event listeners (callbacks) will be added.
            proxyObject._cocoonjs_proxy_object_data.eventListeners = {};

            return proxyObjectId;
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the origin environement whenever it is needed to work with proxy objects.
     * Calls a function of a destination object idetified by it's typeName and id.
     * @param {string} typeName The name of the type of the proxy.
     * @param {number} id The id of the proxy object.
     * @param {string} functionName The name of the function to be called.
     * @return Whatever the function call returns.
     */
    CocoonJS.App.callDestinationProxyObjectFunction = function (typeName, id, functionName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            var argumentsArray = Array.prototype.slice.call(arguments);
            argumentsArray.splice(0, 3);
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            var result = proxyObject[functionName].apply(proxyObject, argumentsArray);
            return result;
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the original environment whenever it is needed to work with proxy objects.
     * Sets a value to the corresponding attributeName of a proxy object represented by it's typeName and id.
     * @param {string} typeName The name of the type of the proxy.
     * @param {number} id The id of the proxy object.
     * @param {string} attributeName The name of the attribute to be set.
     * @param {unknown} attributeValue The value to be set to the attribute.
     */
    CocoonJS.App.setDestinationProxyObjectAttribute = function (typeName, id, attributeName, attributeValue) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            proxyObject[attributeName] = attributeValue;
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the original environment whenever it is needed to work with proxy objects.
     * Retrieves the value of the corresponding attributeName of a proxy object represented by it's typeName and id.
     * @param {string} typeName The name of the type of the proxy.
     * @param {number} id The id of the proxy object.
     * @param {string} attributeName The name of the attribute to be retrieved.
     */
    CocoonJS.App.getDestinationProxyObjectAttribute = function (typeName, id, attributeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
            return proxyObject[attributeName];
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the original environment whenever it is needed to work with proxy objects.
     * Deletes a proxy object identifying it using it's typeName and id. Deleting a proxy object mainly means to remove the instance from the global structure
     * that hold all the instances.
     * @param {string} typeName The name of the type of the proxy.
     * @param {number} id The id of the proxy object.
     */
    CocoonJS.App.deleteDestinationProxyObject = function (typeName, id) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            delete parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];
        }
    };

    /**
     * NOTE: This function should never be directly called. It will be called from the original environment whenever it is needed to work with proxy objects.
     */
    CocoonJS.App.addDestinationProxyObjectEventListener = function (typeName, id, eventTypeName) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            var parentObject = window;
            // Look for the proxy object
            var proxyObject = parentObject[typeName]._cocoonjs_proxy_type_data.proxyObjects[id];

            var callback = function (event) {
                var proxyObject = this; // event.target;
                // var eventTypeName = CocoonJS.getKeyForValueInDictionary(proxyObject._cocoonjs_proxy_object_data.eventListeners, this); // Avoid closures ;)
                // TODO: Is there a way to retrieve the callbackId without a closure?
                var jsCode = "CocoonJS.App.callOriginProxyObjectEventListeners(" + JSON.stringify(proxyObject._cocoonjs_proxy_object_data.typeName) + ", " + proxyObject._cocoonjs_proxy_object_data.id + ", " + JSON.stringify(eventTypeName) + ");";
                CocoonJS.App.forwardAsync(jsCode);
            };

            proxyObject._cocoonjs_proxy_object_data.eventListeners[eventTypeName] = callback;

            // Finally add the event listener callback to the proxy object
            proxyObject.addEventListener(eventTypeName, callback);
        }
    };

    // TODO: We could add a removeDestinationProxyObjectEventListener although it seems that is not completely necessary.

    /**
     * Proxifies the XMLHttpRequest type for the environment where this call is made. After calling this function, all the new objects
     * of XMLHttpRequest that are instantiated, will be proxified objects that will make calls to the counterparts in the other environment (CocoonJS <-> WebView viceversa).
     * IMPORTANT NOTE: Remember to take down the proxification once you are done or to delete proxy objects whenever they are not needed anymore or memory leaks may occur.
     */
    CocoonJS.App.proxifyXHR = function () {
        var ATTRIBUTE_NAMES =
            [
                "timeout",
                "withCredentials",
                "upload",
                "status",
                "statusText",
                "responseType",
                "response",
                "responseText",
                "responseXML",
                "readyState"
            ];
        var FUNCTION_NAMES =
            [
                "open",
                "setRequestHeader",
                "send",
                "abort",
                "getResponseHeader",
                "getAllResponseHeaders",
                "overrideMimeType"
            ];
        var EVENT_HANDLER_NAMES =
            [
                "onloadstart",
                "onprogress",
                "onabort",
                "onerror",
                "onload",
                "ontimeout",
                "onloadend",
                "onreadystatechange"
            ];
        CocoonJS.App.setupOriginProxyType("XMLHttpRequest", ATTRIBUTE_NAMES, FUNCTION_NAMES, EVENT_HANDLER_NAMES);
    };

    /**
     * Proxifies the Audio type for the environment where this call is made. After calling this function, all the new objects
     * of Audio that are instantiated, will be proxified objects that will make calls to the counterparts in the other environment (CocoonJS <-> WebView viceversa).
     * IMPORTANT NOTE: Remember to take down the proxification once you are done or to delete proxy objects whenever they are not needed anymore or memory leaks may occur.
     */
    CocoonJS.App.proxifyAudio = function () {
        var ATTRIBUTE_NAMES =
            [
                "src",
                "loop",
                "volume",
                "preload"
            ];
        var FUNCTION_NAMES =
            [
                "play",
                "pause",
                "load",
                "canPlayType"
            ];
        var EVENT_HANDLER_NAMES =
            [
                "onended",
                "oncanplay",
                "oncanplaythrough",
                "onerror"
            ];
        CocoonJS.App.setupOriginProxyType("Audio", ATTRIBUTE_NAMES, FUNCTION_NAMES, EVENT_HANDLER_NAMES);
    };

    /**
     * Captures a image of the screen synchronously and saves it to a file. Sync mode allows to capture the screen in the middle of a frame rendering.
     * @param {string} fileName Desired file name and format (png or jpg). If no value is passed, "capture.png" value is used by default
     * @param {CocoonJS.App.StorageType} storageType The developer can specify the storage where it is stored. If no value is passed, the {@link CocoonJS.App.StorageType.TMP_STORAGE} value is used by default.
     * @param {CocoonJS.App.CaptureType} captureType. Optional value to choose capture type. [0: captures everything, 1: only captures cocoonjs surface 2: only captures system views]. @see CocoonJS.App.CaptureType
     * @return The URL of the saved file.
     * @throws exception if the image fails to be stored or there is another error.
     * @see CocoonJS.App.onCaptureScreenSucceeded
     * @see CocoonJS.App.onCaptureScreenFailed
     */
    CocoonJS.App.captureScreen = function (fileName, storageType, captureType) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("captureScreen", fileName, storageType, captureType);
        }
    };

    /**
     * Captures a image of the screen asynchronously and saves it to a file.
     * Async mode captures a final frame as soon as possible.
     * @param {string} Desired file name and format (png or jpg). If no value is passed, "capture.png" value is used by default
     * @param {CocoonJS.App.StorageType} [storageType] The developer can specify the storage where it is stored. If no value is passed, the {@link CocoonJS.App.StorageType.TMP_STORAGE} value is used by default.
     * @param {CocoonJS.App.CaptureType} captureType. Optional value to choose capture type. [0: captures everything, 1: only captures cocoonjs surface, 2: only captures system views]. @see CocoonJS.App.CaptureType
     * @param {function} callback. Response callback, check the error property to monitor errors. Check the 'url' property to get the URL of the saved Image
     */
    CocoonJS.App.captureScreenAsync = function (fileName, storageType, captureType, callback) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            window.ext.IDTK_APP.makeCallAsync("captureScreen", fileName, storageType, captureType, callback);
        }
    };

    /**
     * Returns the device UUID
     * @return {string} The device UUID
     */
    CocoonJS.App.getDeviceId = function() {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("getDeviceId");
        }
    };

    /**
     * Structure that defines the getDeviceInfo returned information
     */
    CocoonJS.App.DeviceInfo = {

        /**
        * The operating system name (ios, android,...)
        * @type string
        */
        os: null,

        /**
        * The operating system version (4.2.2, 5.0,...)
        * @type string
        */
        version: null,

        /**
        * The operating system screen density in dpi
        * @type string
        */
        dpi: null,

        /**
        * The device manufacturer (apple, samsung, lg,...)
        * @type string
        */
        brand: null,

        /**
        * The device model (iPhone 4S, SAMSUNG-SGH-I997, SAMSUNG-SGH-I997R, etc)
        * @type string
        */
        model: null,

        /**
        * The phone IMEI
        * Android: The phone IMEI is returned or null if the device has not telepohny
        * iOS: null is returned as we cannot get the IMEI in iOS, no public API available for that yet.
        * @type string
        */
        imei: null,

        /**
        * The platform Id
        * Android: The ANDROID_ID is used.
        * iOS: The OpenUDID is used as there is no Android ANDROID_ID equivalent in iOS
        * @type string
        */
        platformId: null,

        /**
        * The Odin generated id https://code.google.com/p/odinmobile/
        * @type string
        */
        odin: null,

        /**
        * The OpenUDID generated Id https://github.com/ylechelle/OpenUDID
        * @type string
        */
        openudid: null
    };

    /**
     * Returns the device Info
     * @return {CocoonJS.App.DeviceInfo} The device Info
     */
    CocoonJS.App.getDeviceInfo = function() {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return window.ext.IDTK_APP.makeCall("getDeviceInfo");
        }
    };    

    /**
     * FOR DOCUMENTATION PURPOSE ONLY! The documentation of the function callback for the {@link CocoonJS.App.onTextDialogFinished} event calls.
     * @name OnTextDialogFinishedListener
     * @function
     * @static
     * @memberOf CocoonJS.App
     * @param {string} text The text that was introduced in the text dialog when it was finished.
     */
    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the text dialog is finished by accepting it's content.
     * The callback function's documentation is represented by {@link CocoonJS.App.OnTextDialogFinishedListener}
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onTextDialogFinished = new CocoonJS.EventHandler("IDTK_APP", "App", "ontextdialogfinish");

    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the text dialog is finished by dismissing it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onTextDialogCancelled = new CocoonJS.EventHandler("IDTK_APP", "App", "ontextdialogcancel");

    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the text dialog is finished by accepting it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onMessageBoxConfirmed = new CocoonJS.EventHandler("IDTK_APP", "App", "onmessageboxconfirmed");

    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the text dialog is finished by dismissing it's content.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onMessageBoxDenied = new CocoonJS.EventHandler("IDTK_APP", "App", "onmessageboxdenied");

    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the application is suspended.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onSuspended = new CocoonJS.EventHandler("IDTK_APP", "App", "onsuspended");

    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when the application is activated.
     * The callback function does not receive any parameter.
     * @event
     * @static
     * @memberOf CocoonJS.App
     */
    CocoonJS.App.onActivated = new CocoonJS.EventHandler("IDTK_APP", "App", "onactivated");

})();
