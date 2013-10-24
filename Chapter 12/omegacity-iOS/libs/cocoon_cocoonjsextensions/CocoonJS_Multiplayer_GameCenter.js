(function()
{
    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.Multiplayer === 'undefined' || window.CocoonJS === null) throw("The CocoonJS.Multiplayer object must exist and be valid before creating a Game Center extension object.");

	/**
	* This instance represents the extension object to access GameCenter related native functionalities.
	* @see CocoonJS.Multiplayer
	*/
	CocoonJS.Multiplayer.GameCenter = new CocoonJS.Multiplayer("IDTK_SRV_MULTIPLAYER_GAMECENTER", "Multiplayer.GameCenter");
})();