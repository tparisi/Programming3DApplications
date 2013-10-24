(function()
{
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before adding more functionalities to an extension.");
    if (typeof window.CocoonJS.App === 'undefined' || window.CocoonJS.App === null) throw("The CocoonJS.App object must exist and be valid before adding more functionalities to it.");
    if (navigator.isCocoonJS) throw("Do not inject CocoonJS_App_ForWebView.js file in the CocoonJS environment.");

    /**
    * This namespace represents all the basic functionalities available in the CocoonJS extension API.
    * @namespace
    */
    CocoonJS.App = CocoonJS.App ? CocoonJS.App : {};

    CocoonJS.App.nativeExtensionObjectAvailable = CocoonJS.App.nativeExtensionObjectAvailable;

    /**
    * Shows a transparent WebView on top of the CocoonJS hardware accelerated environment rendering context.
    * @function
    * @param {number} [x] The horizontal position where to show the WebView.
    * @param {number} [y] The vertical position where to show the WebView.
    * @param {number} [width] The horitonzal size of the WebView.
    * @param {number} [height] the vertical size of the WebView.
    */
    CocoonJS.App.show = function(x, y, width, height)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
           return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "show", arguments);
        }
        else
        {
            var div = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv');
            div.style.left = (x ? x : div.style.left)+'px';
            div.style.top = (y ? y : div.style.top)+'px';
            div.style.width = (width ? width : window.parent.innerWidth)+'px';
            div.style.height = (height ? height : window.parent.innerHeight)+'px';
            div.style.display = "block";
            var iframe = window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewIFrame');
            iframe.style.width = (width ? width : window.parent.innerWidth)+'px';
            iframe.style.height = (height ? height : window.parent.innerHeight)+'px';
        }
    };

    /**
    * Hides the transparent WebView on top of the CocoonJS hardware acceleration environment rendering contect.
    * @function
    */
    CocoonJS.App.hide = function()
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
           return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "hide", arguments);
        }
        else
        {
            window.parent.document.getElementById('CocoonJS_App_ForCocoonJS_WebViewDiv').style.display = "none";
        }
    };

    /**
    * Loads a resource in the CocoonJS environment from the CocoonJS environment. 
    * @function
    * @param {string} path The path to the resource. It can be a remote URL or a path to a local file.
    * @param {CocoonJS.App.StorageType} [storageType] An optional parameter to specify at which storage in the device the file path is stored. By default, APP_STORAGE is used.
    * @see CocoonJS.App.load
    */
    CocoonJS.App.loadInCocoonJS = function(path, storageType)
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            var javaScriptCodeToForward = "ext.IDTK_APP.makeCall('loadPath'";
            if (typeof path !== 'undefined')
            {
                javaScriptCodeToForward += ", '" + path + "'";
                if (typeof storageType !== 'undefined')
                {
                    javaScriptCodeToForward += ", '" + storageType + "'";
                }
            }
            javaScriptCodeToForward += ");";

            return CocoonJS.App.forwardAsync(javaScriptCodeToForward);
        }
        else
        {
            CocoonJS.App.forwardAsync("CocoonJS.App.load('" + path + "');");
        }
    };

    /**
     * Reloads the last loaded path in the CocoonJS context.
     * @function
     */
    CocoonJS.App.reloadCocoonJS = function()
    {
        if (CocoonJS.App.nativeExtensionObjectAvailable)
        {
            return CocoonJS.App.forwardAsync("ext.IDTK_APP.makeCall('reload');");
        }
        else if (!navigator.isCocoonJS)
        {
            window.parent.location.reload();
        }
    };

    /**
    * This function allows to forward console messages from the WebView to the CocoonJS
    * debug console. What it does is to change the console object for a new one
    * with all it's methods (log, error, info, debug and warn) forwarding their
    * messages to the CocoonJS environment.
    * The original console object is stored in the CocoonJS.App.originalConsole property.
    * @function
    */
    CocoonJS.App.proxifyConsole = function() 
    {
        if (!CocoonJS.nativeExtensionObjectAvailable) return;

        if (typeof CocoonJS.App.originalConsole === 'undefined')
        {
            CocoonJS.App.originalConsole = window.console;
        }
        var functions = ["log", "error", "info", "debug", "warn"];

        var newConsole = {};
        for (var i = 0; i < functions.length; i++)
        {
            newConsole[functions[i]] = function(functionName)
            {
                return function(message)
                {
                    var jsCode = "console." + functionName + "(" + JSON.stringify(message) + ");";
                    CocoonJS.App.originalConsole.log(jsCode);
                    ext.IDTK_APP.makeCallAsync("forward", jsCode);
                };
            }(functions[i]);
        }
        if (!newConsole.assert) {
            newConsole.assert = function assert() {
                if (arguments.length > 0 && !arguments[0]) {
                    var str = 'Assertion failed: ' + (arguments.length > 1 ? arguments[1] : '');
                    newConsole.error(str);
                }
            }
        }        
        window.console = newConsole;
    };

    /**
    * This function restores the original console object and removes the proxified console object.
    * @function
    */
    CocoonJS.App.deproxifyConsole = function()
    {
        if (window.navigator.isCocoonJS || !CocoonJS.nativeExtensionObjectAvailable) return;
        if (typeof CocoonJS.App.originalConsole !== 'undefined')
        {
            window.console = CocoonJS.App.originalConsole;
            CocoonJS.App.originalConsole = undefined;
        }
    };

    /**
    * Everytime the page is loaded, proxify the console.
    * @ignore
    */
    window.addEventListener("load", function()
    {
        CocoonJS.App.proxifyConsole();
    });

    /**
     * FOR DOCUMENTATION PURPOSE ONLY! The documentation of the function callback for the {@link CocoonJS.App.onLoadInCocoonJSSucceed} event calls.
     * @name OnLoadInCocoonJSSucceedListener
     * @function
     * @static
     * @memberOf CocoonJS.App
     * @param {string} pageURL The URL of the page that had been loaded in CocoonJS.
     */
    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the CocoonJS load has completed successfully.
    * The callback function's documentation is represented by {@link CocoonJS.App.OnLoadInCocoonJSSucceedListener}
    * @event
    * @static
    * @memberOf CocoonJS.App
    * @param {string} pageURL A string that represents the page URL loaded.
    */
    CocoonJS.App.onLoadInCocoonJSSucceed = new CocoonJS.EventHandler("IDTK_APP", "App", "forwardpageload");

    /**
     * FOR DOCUMENTATION PURPOSE ONLY! The documentation of the function callback for the {@link CocoonJS.App.onLoadInCocoonJSFailed} event calls.
     * @name OnLoadInCocoonJSFailedListener
     * @function
     * @static
     * @memberOf CocoonJS.App
     * @param {string} pageURL The URL of the page that had been loaded in CocoonJS.
     */
    /**
    * This {@link CocoonJS.EventHandler} object allows listening to events called when the CocoonJS load fails.
    * The callback function's documentation is represented by {@link CocoonJS.App.OnLoadInCocoonJSFailedListener}
    * @event
    * @static
    * @memberOf CocoonJS.App
    */
    CocoonJS.App.onLoadInCocoonJSFailed = new CocoonJS.EventHandler("IDTK_APP", "App", "forwardpagefail");

})();