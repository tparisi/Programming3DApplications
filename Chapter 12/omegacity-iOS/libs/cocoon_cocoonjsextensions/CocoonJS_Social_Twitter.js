(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.Social === 'undefined' || window.CocoonJS.Social === null) throw("The CocoonJS.Social object must exist and be valid before creating a Twitter extension.");

	/**
	* This instance represents the extension object to access Twitter related native functionalities.
	* @see CocoonJS.Social
	*/
	CocoonJS.Social.Twitter = new CocoonJS.Social("IDTK_SRV_SOCIAL_TWITTER", "Social.Twitter");

	CocoonJS.Social.Twitter.requestInitialization = function(paramsObject)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestInitialization(paramsObject);
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	CocoonJS.Social.Twitter.isInitialized = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.isInitialized();
		}
		else
		{
			return false;
		}
	},

	/**
	* Request to login on Twitter.
	* @see CocoonJS.Social.onRequestLoginSucceed
	* @see CocoonJS.Socual.onRequestLoginFailed
	*/
	CocoonJS.Social.Twitter.requestLogin = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestLogin();
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Request to logout of Twitter.
	* @see CocoonJS.Social.onRequestLoginSucceed
	* @see CocoonJS.Social.onRequestLoginFailed
	* @see CocoonJS.Social.onLogout
	*/
	CocoonJS.Social.Twitter.requestLogout = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestLogout();
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Check if the user is logged in.
	* @return true if the user is still logged in, false otherwise.
	*/
	CocoonJS.Social.Twitter.isLoggedIn = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.isLoggedIn();
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Request to retrieve the current or a specific user's id. The request can be monitored using the {@link CocoonJS.Social.onUserInfoRequestSucceed} and {@link CocoonJS.Social.onUserInfoRequestFailed} event handlers.
	* @param {string} [userId] The id of the user to retireve the information from. If no userID is specified, the currently logged in user is assumed.
	* @see CocoonJS.Social.onRequestUserInfoSucceed
	* @see CocoonJS.Social.onRequestUserInfoFailed
	*/
	CocoonJS.Social.Twitter.requestUserInfo = function(userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserInfo(userID);
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Request to retrieve the Image of a user
	* @param {string} [userID] The id of the user to get the image for. If no userID is specified, the currently logged user is used.
	* @param {CocoonJS.Social.ImageSizeType} [imageSizeType] The size of the image. One of the possible values among the ones in the {@link CocoonJS.Social.ImageSizeType}. If no value is specified, SMALL is used.
	* @see CocoonJS.Social.onRequestUserImageURLSucceed;
	* @see CocoonJS.Social.onRequestUserImageURLFailed;
	*/
	CocoonJS.Social.Twitter.requestUserImageURL = function( imageSizeType, userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserImageURL(imageSizeType, userID);
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Request for the information of all the friends of the currently logged user.
	* @param {string} [userID] The id of the user to get the friends infos for. If no userID is specified, the currently logged user is used.
	* @see CocoonJS.Social.onRequestUserFriendsUserInfosSucceed;
	* @see CocoonJS.Social.onRequestUserFriendsUserInfosFailed;
	*/
	CocoonJS.Social.Twitter.requestUserFriendsUserInfos = function(userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserFriendsUserInfos(userID);
		}
		else if (!navigator.isCocoonJS)
		{

		}
	},

	/**
	* Request the publication of a message using a dialog.
	* @param {CocoonJS.Social.Message} message A object representing the information to be published.
	* @see CocoonJS.Social.onRequestMessagePublicationSucceed
	* @see CocoonJS.Social.onRequestMessagePublicationFailed
	*/
	CocoonJS.Social.Twitter.requestMessagePublicationWithDialog = function(message)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestMessagePublicationWithDialog(message);
		}
		else if (!navigator.isCocoonJS)
		{

		}
	}	
})();