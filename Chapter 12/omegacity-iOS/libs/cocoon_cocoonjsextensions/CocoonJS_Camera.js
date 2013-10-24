(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");

    /**
    * This namespace represents the CocoonJS camera extension API.
    * @namespace
    */
    CocoonJS.Camera = {};

    CocoonJS.Camera.nativeExtensionObjectAvailable = CocoonJS.nativeExtensionObjectAvailable && typeof window.ext.IDTK_SRV_CAMERA !== 'undefined';

    /**
    * The predefined possible camera types.
    * @namespace 
    */
	CocoonJS.Camera.CameraType = {
		/**
		* Represents the front camera on the device.
		*/
	    FRONT : "FRONT",

	    /**
	    * Represents the back camera on the device.
	    */
	    BACK : "BACK"
	};

    /**
    * The predefined possible camera video capturing image format types.
    * @namespace 
    */
	CocoonJS.Camera.CaptureFormatType = {
		/**
		*/
	    JPEG : "JPEG",

		/**
		*/
	    RGB_565 : "RGB_565",

		/**
		*/
	    NV21 : "NV21", 

		/**
		*/
	    NV16 : "NV16",

		/**
		*/
	    YUY2 : "YUY2",

		/**
		*/
	    YV12 : "YV12",

		/**
		*/
	    BGRA32 : "32BGRA"
	};

	/**
	* The data structure that represents the information of a camera. It includes all the information to be able to setup a camera to capture video or to take pictures.
	* @namespace
	*/
	CocoonJS.Camera.CameraInfo =  {
		/**
		* The index of the camera.
		*/
		cameraIndex : 0,

		/**
		* The type of the camera among the possible values in {@link CocoonJS.Camera.CameraType}.
		*/
		cameraType : CocoonJS.Camera.CameraType.BACK,

		/**
		* An array of {@link CocoonJS.Size} values that represent the supported video sizes for the camera.
		*/
		supportedVideoSizes : [],

		/**
		* An array of numbers that represent the supported video frame rates for the camera.
		*/
		supportedVideoFrameRates : [],

		/**
		* An array of {@link CocoonJS.Camera.CaptureFormatType} values that represent the supported video format types for the camera.
		*/
		supportedVideoCaptureImageFormats : []
	};

	/**
	* Returns the number of available camera in the platform/device.
	* @returns {number} The number of cameras available in the platform/device.
	*/
	CocoonJS.Camera.getNumberOfCameras = function()
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "getNumberOfCameras", arguments);
		}
	};

	/**
	* Returns an array of {@link CocoonJS.Camera.CameraInfo} objects representing all the information of all the cameras available in the platform/device.
	* @returns {Array} An array of {@link CocoonJS.Camera.CameraInfo} objects.
	*/
	CocoonJS.Camera.getAllCamerasInfo = function()
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "getAllCamerasInfo", arguments);
		}
	};

	/**
	* Returns the {@link CocoonJS.Camera.CameraInfo} object that represents all the information of the specified camera index in the platform/device.
	* @param {number} cameraIndex The index of the camera to get the info from. The index should be inside 0 and N (N being the value returned by {@link CocoonJS.Camera.getNumberOfCameras}).
	* @returns {CocoonJS.Camera.CameraInfo} The {@link CocoonJS.Camera.CameraInfo} of the given camera index.
	*/
	CocoonJS.Camera.getCameraInfoByIndex = function(cameraIndex)
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "getCameraInfoByIndex", arguments);
		}
	};

	/**
	* Returns the {@link CocoonJS.Camera.CameraInfo} object that represents all the information of the first camera of the specified type found in the platform/device.
	* @param {CocoonJS.Camera.CameraType} cameraType The type of the camera to get the info from. 
	* @returns {CocoonJS.Camera.CameraInfo} The {@link CocoonJS.Camera.CameraInfo} of the first camera of the given camera type that has been found in the platform/device.
	*/
	CocoonJS.Camera.getCameraInfoByType = function(cameraType)
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "getCameraInfoByType", arguments);
		}
	};

	/**
	* Starts a camera to capture video. The developer must specify at least the index of the camera to be used. Some other setup parameters can also be passed to control the video capture. A image object
	* that will be automatically updated with the captured frames is returned so the developer just need to draw the image in every frame. A null image object is returned if the setup did not work or there is
	* no available camera.
	* @param {number} cameraIndex The index of the camera to start video capture with.
	* @param captureWidth The hozirontal size of the video capture resolution. If the value does not correspond to any of the sizes supported by the camera, the closest one is used. See {@link CocoonJS.Camera.CameraInfo}.
	* If no value is given, the maximum size available is used.
	* @param captureHeight The vertical size of the video capture resolution. If value does not correspond to any of the sizes supported by the camera, the closest one is used. See {@link CocoonJS.Camera.CameraInfo}.
	* If no value is given, the maximum size available is used.
	* @param captureFrameRate The frame rate to capture the video at. If the value does not correspond to any of the frame rates supported by the camera, the closest one is used. See {@link CocoonJS.Camera.CameraInfo}.
	* If no value is given, the maximum frame rate available is used.
	* @param captureImageFormat A value from the available {@link CocoonJS.Camera.CaptureFormatType} formats to specify the format of the images that will be captured. See {@link CocoonJS.Camera.CameraInfo}.
	* If no value is given, the first available capture image format is used.
	* @returns {image} A image object that will automatically update itself with the captured frames or null if the camera capture could not start.
	*/
	CocoonJS.Camera.startCapturing = function(cameraIndex, captureWidth, captureHeight, captureFrameRate, captureImageFormat)
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "startCapturing", arguments);
		}
	};

	/**
	* Stops a camera that is already started capturing video.
	* @param cameraIndex The index of the camera to stop capturing video.
	*/
	CocoonJS.Camera.stopCapturing = function(cameraIndex)
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "stopCapturing", arguments);
		}
	};

	/**
	* Indicates if a camera is capturing video or not.
	* @param cameraIndex The index of the camera to check if is capturing video or not.
	* @returns {boolean} A flag indicating if the given camera (by index) is capturing video (true) or not (false).
	*/
	CocoonJS.Camera.isCapturing = function(cameraIndex)
	{
		if (CocoonJS.Camera.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_SRV_CAMERA", "isCapturing", arguments);
		}
	};

})();