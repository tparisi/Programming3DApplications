(function () {
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
     * This namespace represents the functionalities related to OUYA android gaming control.
     * @namespace
     */
    CocoonJS.OUYA = {};

    CocoonJS.OUYA.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.OUYA !== 'undefined';

    CocoonJS.OUYA.ControllerData = 
    {

    };

    /**
    * Returns the data related to a specific controller for the OUYA.
    * @param {number} controllerId The id of the controller to get the data for.
    * @return {CocoonJS.OUYA.ControllerData} An object that contains all the information to provide the status of the controller.
    */
    function CocoonJS.OUYA.getControllerData(controllerId)
    {
    	if (this.nativeExtensionObjectAvailable)
    	{
            return CocoonJS.makeNativeExtensionObjectFunctionCall("OUYA", "getControllerData", arguments);
    	}
    	else
    	{
    		return null;
    	}
    }

    /**
     * FOR DOCUMENTATION PURPOSE ONLY! The documentation of the function callback for the {@link CocoonJS.OUYA.onControllerHasChanged} event calls.
     * @name OnControllerHasChanged
     * @function
     * @static
     * @memberOf CocoonJS.OUYA
     * @param {CocoonJS.OUYA.ControllerData} controllerData The data that represents the status of the controller that has changed.
     */
    /**
     * This {@link CocoonJS.EventHandler} object allows listening to events called when a OUYA controller has changed (button pressed and/or axis moved).
     * The callback function's documentation is represented by {@link CocoonJS.OUYA.OnControllerHasChanged}
     * @event
     * @static
     * @memberOf CocoonJS.OUYA
     */
    CocoonJS.OUYA.onControllerHasChanged = new CocoonJS.EventHandler("OUYA", "OUYA", "controllerHasChanged");

})();



