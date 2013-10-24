(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.SocialGaming === 'undefined' || window.CocoonJS === null) throw("The CocoonJS.SocialGaming object must exist and be valid before creating a Game Center extension object.");

	/**
	* This instance represents the extension object to access GameCenter related native functionalities.
	* The data structure for initialization: None.
	* @see CocoonJS.Social
	*/
	CocoonJS.SocialGaming.GameCenter = new CocoonJS.SocialGaming("IDTK_SRV_SOCIAL_GAMECENTER", "SocialGaming.GameCenter");
})();