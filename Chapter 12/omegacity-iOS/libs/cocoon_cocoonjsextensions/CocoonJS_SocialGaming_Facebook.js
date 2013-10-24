(function()
{
    /**
     * ReplaceAll by Fagner Brack (MIT Licensed)
     * Replaces all occurrences of a substring in a string
     */
    /*
    String.prototype.replaceAll = function(token, newToken, ignoreCase) {
        var str, i = -1, _token;
        if ((str = this.toString()) && typeof token === "string") {
            _token = ignoreCase === true ? token.toLowerCase() : undefined;
            while ((i = (
                _token !== undefined ?
                    str.toLowerCase().indexOf(
                        _token,
                        i >= 0 ? i + newToken.length : 0
                    ) : str.indexOf(
                    token,
                    i >= 0 ? i + newToken.length : 0
                )
                )) !== -1) {
                str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
            }
        }
    	return str;
    };
    */

    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.SocialGaming === 'undefined' || window.CocoonJS.SocialGaming === null) throw("The CocoonJS.SocialGaming object must exist and be valid before creating a Facebook extension object.");

	/**
	* This instance represents the extension object to access Facebook related native functionalities.
	* @see CocoonJS.Social
	*/
	CocoonJS.SocialGaming.Facebook = new CocoonJS.SocialGaming("IDTK_SRV_SOCIAL_FACEBOOK", "SocialGaming.Facebook");

// Some Facebook specific functions. DO NOT CALL THEM DIRECTLY!!!

    CocoonJS.SocialGaming.Facebook.initializeFacebookApplication = function(applicationID, channelURL)	{

            var srv= CocoonJS.SocialGaming.Facebook;

            function onLogin() {
                srv.initialized = true;
         	    		srv.applicationID = applicationID;

                         /**
                          * Capture once all in-app achievements.
                          */
                         FB.api(srv.applicationID + '/achievements', function(achievementsInfo) {
                             if (!achievementsInfo.error) {
                                 srv.allAchievementInfo = {};
                                 for (var i = 0; i < achievementsInfo.data.length; i++) {
                                     var achievementInfo = achievementsInfo.data[i];
                                     srv.allAchievementInfo[ achievementsInfo.data[i].id ]= achievementsInfo.data[i];
                                 }

                                 if ( srv.abstractToSocialGamingAchievementMap ) {
                                     for( var i=0; i<achievementsInfo.data.length; i+=1 ) {
                                         var serviceAchievementId= achievementsInfo.data[i].id;
                                         if ( !srv.abstractToSocialGamingAchievementMapInverse[ serviceAchievementId ] ) {
                                             console.log("  service achievement '"+serviceAchievementId+"' has no abstract couterpart.");
                                         }
                                     }
                                 }

                                 srv.onRequestInitializationSucceed.notifyEventListeners(applicationID);

                             }
                         });
            }


        	FB.init({
          		appId      : applicationID, // App ID
          		channelUrl : channelURL, // Channel File
          		status     : true, // check login status
          		cookie     : true, // enable cookies to allow the server to access the session
          		xfbml      : true  // parse XFBML
        	});

        	// Additional init code here
        	FB.getLoginStatus(function(response) {
    	  		if (response.status === 'connected') {
                      onLogin();
    	  		}
                else if ( response.status==="not_authorized") {
                    srv.initialized= false;
                      srv.onRequestInitializationFailed.notifyEventListeners(applicationID, "Facebook application is not authorized.");
                }
    	  		else {

                      FB.login(function (response) {
                          if (response.authResponse) {
                              onLogin();
                          } else {
                              console.log('User cancelled login or did not fully authorize.');
                          }
                      });
                  }
    		});
    	};

	CocoonJS.SocialGaming.Facebook.requestMeUserInfo = function(successCallback, failCallback)
	{
		FB.api('/me?fields=username', function(response) {
			if (!response.error)
			{
				var userInfo = CocoonJS.SocialGaming.Facebook.fromFacebookUserInfoToCocoonJSUserInfo(response);
				successCallback(userInfo);
	        }
	        else
	        {
	        	failCallback(response.error.message);
	        }
	    });
	};

	CocoonJS.SocialGaming.Facebook.fromFacebookUserInfoToCocoonJSUserInfo = function(facebookUserInfo)
	{
		return new CocoonJS.Social.UserInfo
		(
			facebookUserInfo.id, 
			facebookUserInfo.username
		);
	};

	CocoonJS.SocialGaming.Facebook.fromCocoonJSMessageToFacebookMessage = function(cocoonJSMessage)
	{
		var facebookMessage = { method : "feed" };
		if (cocoonJSMessage)
		{
			if (cocoonJSMessage.message)
			{
				facebookMessage.description = cocoonJSMessage.message;
			}
			if (cocoonJSMessage.linkURL)
			{
				facebookMessage.link = cocoonJSMessage.linkURL;
			}
			if (cocoonJSMessage.mediaURL)
			{
				facebookMessage.picture = cocoonJSMessage.mediaURL;
			}
			if (cocoonJSMessage.linkCaption)
			{
				facebookMessage.caption = cocoonJSMessage.linkCaption;
			}
		}
		return facebookMessage;
	};

	CocoonJS.SocialGaming.Facebook.fromFacebookUserScoreInfoToCocoonJSUserScoreInfo = function(facebookUserScoreInfo, leaderboardID)
	{
		return new CocoonJS.SocialGaming.UserScoreInfo
		(
			facebookUserScoreInfo.user.id, 
			facebookUserScoreInfo.score,
            facebookUserScoreInfo.user.name,
            'http://graph.facebook.com/' + facebookUserScoreInfo.user.id + '/picture',
            leaderboardID
		);
	};

	CocoonJS.SocialGaming.Facebook.fromFacebookAchievementInfoToCocoonJSAchievementInfo = function(facebookAchievementInfo)
	{
		return new CocoonJS.SocialGaming.AchievementInfo
		(
			facebookAchievementInfo.id,
			facebookAchievementInfo.title,
			facebookAchievementInfo.description,
			facebookAchievementInfo.image[0].url,
			facebookAchievementInfo.data.points
		);
	};

	CocoonJS.SocialGaming.Facebook.fromCocoonJSImageSizeTypeToFacebookImageSizeType = function(cocoonJSImageSizeType)
	{
		var facebookImageSizeType = "small";
		if (cocoonJSImageSizeType === CocoonJS.Social.ImageSizeType.THUMB)
		{
			facebookImageSizeType = "square";
		}
		else if (cocoonJSImageSizeType === CocoonJS.Social.ImageSizeType.MEDIUM)
		{
			facebookImageSizeType = "normal";
		}
		else if (cocoonJSImageSizeType === CocoonJS.Social.ImageSizeType.LARGE)
		{
			facebookImageSizeType = "large";
		}
		return facebookImageSizeType;
	};

// CocoonJS.Social methods

	/**
	* This implementation of the function needs a initialization data with the following content:
	{
		
	}
	* @see CocoonJS.Social.requestInitialization
	*/
	CocoonJS.SocialGaming.Facebook.requestInitialization = function(paramsObject)
	{
        if (typeof paramsObject==="undefined") {
            console.error("SocialGamingFacebook requires an initialization object.");
            return;
        }
        if ( typeof paramsObject.applicationID==="undefined" || typeof paramsObject.channelURL==="undefined") {
            console.error("SocialGamingFacebook requires an initialization object with 'applicationID' and 'channelURL' attributes.");
            return;
        }

        var applicationID= paramsObject.applicationID;
        var channelURL= paramsObject.channelURL;

        this.leaderboardsViewURL= paramsObject.leaderboardsViewURL;
        this.achievementsViewURL= paramsObject.achievementsViewURL;

		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestInitialization.call(this, paramsObject);
		}
		else if (!navigator.isCocoonJS)
		{

			if (this.initialized)
			{
				if (applicationID === this.applicationID) 
				{
					console.log("The Facebook application connection has already been initialized.");
		    		CocoonJS.SocialGaming.Facebook.onRequestInitializationSucceed.notifyEventListeners(applicationID);
					return;
				}
				else
				{
					// The application was initialized but a new application id has been provided. Force the initialization
					this.initialized = false;
					this.loggedIn = false;
					this.applicationID = null;
					this.initializeFacebookApplication(applicationID, channelURL);
				}
			}
			else
			{
				// Nothing has been initialized, so load the Facebook SDK and then initialize the application
				this.initialized = false;
				this.loggedIn = false;
				this.applicationID = null;

				// Wait for the Facebook SDK to be initialized
			  	window.fbAsyncInit = function() 
			  	{
			  		CocoonJS.SocialGaming.Facebook.initializeFacebookApplication(applicationID, channelURL);
			  	};

			  	// Load the Facebook SDK
			  	var parent = document.getElementsByTagName('script')[0];
				var script = document.createElement('script'); 
		     	script.async = true;
                var prot= location.protocol ? location.protocol : "http:"
		     	script.src = prot + "//connect.facebook.net/en_US/all.js";
		     	parent.parentNode.insertBefore(script, parent);
			}

		}
	};

	CocoonJS.SocialGaming.Facebook.isInitialized = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.isInitialized.call(this);
		}
		else if (!navigator.isCocoonJS)
		{
			return this.initialized;
		}
	};

    CocoonJS.SocialGaming.Facebook.requestLogin = function () {
        var srv = CocoonJS.SocialGaming.Facebook;

        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.Social.prototype.requestLogin.call(this);
        }
        else if (!navigator.isCocoonJS) {
            if (this.initialized) {
                FB.login(function (response) {
                    if (response.authResponse) {
                        CocoonJS.SocialGaming.Facebook.requestMeUserInfo(
                            function (userInfo) {
                                srv.loggedIn = true;
                                srv.onRequestLoginSucceed.notifyEventListeners(userInfo);
                                srv.setUserInfoCocoonJS(userInfo);
                            },
                            function (errorMessage) {
                                srv.loggedIn = false;
                                srv.onRequestLoginFailed.notifyEventListeners(errorMessage);
                            }
                        );
                    }
                    else {
                        CocoonJS.SocialGaming.Facebook.onRequestLoginFailed.notifyEventListeners("Login failed.");
                    }
                }, {scope:'publish_stream'});
            }
            else {
                this.loggedIn = false;
                this.onRequestLoginFailed.notifyEventListeners("The Facebook social gaming service has not been initialized yet.");
            }
        }
    };

	CocoonJS.SocialGaming.Facebook.requestLogout = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestLogout.call(this);
		}
		else if (!navigator.isCocoonJS)
		{
			if (!this.initialized)
			{
				console.error("The Facebook social gaming service has not been initialized yet.");
				return;
			}
			FB.logout(function(response) 
			{
				CocoonJS.SocialGaming.Facebook.loggedIn = false;
				CocoonJS.SocialGaming.Facebook.onLogout.notifyEventListeners();
		    });
		}
	};

    CocoonJS.SocialGaming.Facebook.isLoggedIn = function () {
        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.Social.prototype.isLoggedIn.call(this);
        }
        else if (!navigator.isCocoonJS) {
            return this.loggedIn;
        }
    };

	CocoonJS.SocialGaming.Facebook.requestUserInfo = function(userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserInfo.call(this, userID);
		}
		else if (!navigator.isCocoonJS)
		{
			userID = !userID ? "me" : userID;
			if (!this.initialized)
			{
				this.onRequestUserInfoFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}
			FB.api('/' + userID + '?fields=username', function(response) {
				if (!response.error)
				{
					var userInfo = CocoonJS.SocialGaming.Facebook.fromFacebookUserInfoToCocoonJSUserInfo(response);
		        	CocoonJS.SocialGaming.Facebook.onRequestUserInfoSucceed.notifyEventListeners(userInfo);
		        }
		        else
		        {
		        	CocoonJS.SocialGaming.Facebook.onRequestUserInfoFailed.notifyEventListeners(userID, response.error.message);
		        }
		    });
		}
	};

	CocoonJS.SocialGaming.Facebook.requestUserImageURL = function( imageSizeType, userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserImageURL.call(this, imageSizeType, userID);
		}
		else if (!navigator.isCocoonJS)
		{
			if (!this.initialized)
			{
				this.onRequestUserImageFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}
			userID = userID ? userID : "me";
			imageSizeType = imageSizeType ? this.fromCocoonJSImageSizeTypeToFacebookImageSizeType(imageSizeType) : CocoonJS.Social.ImageSizeType.SMALL;
			CocoonJS.SocialGaming.Facebook.onRequestUserImageSucceed.notifyEventListeners(userID, 'http://graph.facebook.com/' + userID + '/picture?type=' + imageSizeType);
		}
	};

	CocoonJS.SocialGaming.Facebook.requestUserFriendsUserInfos = function(userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestUserFriendsUserInfos.call(this, userID);
		}
		else if (!navigator.isCocoonJS)
		{
			userID = userID ? userID : "me";
			if (!this.initialized)
			{
				this.onRequestUserFriendsUserInfosFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}
			FB.api('/' + userID + '/friends?fields=username', function(response) {
				if (!response.error && response.data)
				{
					var friendsUserInfos = [];
					for (var i=0; i<response.data.length; i++)
					{
						friendsUserInfos.push(CocoonJS.SocialGaming.Facebook.fromFacebookUserInfoToCocoonJSUserInfo(response.data[i]));
					}
					CocoonJS.SocialGaming.Facebook.onRequestUserFriendsUserInfosSucceed.notifyEventListeners(userID, friendsUserInfos);
				}
				else
				{
					CocoonJS.SocialGaming.Facebook.onRequestUserFriendsUserInfosFailed.notifyEventListeners(userID, response.error.message);
				}
			});
		}
	};

	CocoonJS.SocialGaming.Facebook.requestMessagePublicationWithDialog = function(message)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.Social.prototype.requestMessagePublicationWithDialog.call(this, message);
		}
		else if (!navigator.isCocoonJS)
		{
			if (!this.initialized)
			{
				console.error("The Facebook social gaming service has not been initialized yet.");
				return;
			}

			var facebookMessage = this.fromCocoonJSMessageToFacebookMessage(message);

			FB.ui(
				facebookMessage,
				function(response) {
					if (response && response.post_id) 
					{
			      		CocoonJS.SocialGaming.Facebook.onRequestMessagePublicationSucceed.notifyEventListeners(message);
			    	} 
			    	else 
			    	{
			      		CocoonJS.SocialGaming.Facebook.onRequestMessagePublicationFailed.notifyEventListeners(message, "Message publication cancelled by the user.");
			    	}
			  	}
			);
		}
	};

// CocoonJS.SocialGaming methods

    CocoonJS.SocialGaming.Facebook.requestUserAndFriendsScores = function (leaderboardID, userID) {
        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.SocialGaming.prototype.requestUserAndFriendsScores.call(this, leaderboardID, userID);
        }
        else if (!navigator.isCocoonJS) {
            if (!this.initialized) {
                this.onRequestUserAndFriendsUserScoreInfosFailed.notifyEventListeners(
                    userID,
                    "The Facebook social gaming service has not been initialized yet.");
                return;
            }

            userID = userID ? userID : this.userInfoCocoonJS.userID;

            FB.api( "/" + this.applicationID + "/scores", function (response) {

                if (!response.error && response.data) {

                    if (!response.data.length) {
                        CocoonJS.SocialGaming.Facebook.onRequestUserAndFriendsScoresFailed.notifyEventListeners(
                            userID,
                            leaderboardID, 
                            "No score has been submitted yet for the user or his/her friends.");
                    }
                    else {

                        var userAndFriendsScoreInfos = [];
                        for (var i = 0; i < response.data.length; i++) {
                            var tempUserScoreInfo = CocoonJS.SocialGaming.Facebook.fromFacebookUserScoreInfoToCocoonJSUserScoreInfo(response.data[i], leaderboardID);

                            userAndFriendsScoreInfos.push(tempUserScoreInfo);
                        }
                        CocoonJS.SocialGaming.Facebook.onRequestUserAndFriendsScoresSucceed.notifyEventListeners(userAndFriendsScoreInfos);
                    }
                }
                else {
                    CocoonJS.SocialGaming.Facebook.onRequestUserAndFriendsScoresFailed.notifyEventListeners(userID, leaderboardID, response.error.messsage);
                }
            });
		}
	};

    CocoonJS.SocialGaming.Facebook.requestUserScore = function (leaderboardID, userID) {
        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.SocialGaming.prototype.requestUserScore.call(this, leaderboardID, userID);
        }
        else if (!navigator.isCocoonJS) {

            if (!this.initialized) {
                this.onRequestUserAndFriendsUserScoreInfosFailed.notifyEventListeners(userID, leaderboardID, "The Facebook social gaming service has not been initialized yet.");
                return;
            }

            if (!userID || userID === "me") {
                userID = this.getLoggedInUserInfo().userID;
            }

            FB.api(userID + "/scores", function (response) {
                if (!response.error && response.data) {
                    if (response.data.length === 0) {
                        CocoonJS.SocialGaming.Facebook.onRequestUserScoreFailed.notifyEventListeners(userID, leaderboardID, "No score has been submitted yet for the user.");
                    }
                    else {
                        var userScoreInfo = null;
                        for (var i = 0; !userScoreInfo && i < response.data.length; i++) {
                            var tempUserScoreInfo = CocoonJS.SocialGaming.Facebook.fromFacebookUserScoreInfoToCocoonJSUserScoreInfo(response.data[i], leaderboardID);
                            userScoreInfo = tempUserScoreInfo.userID === userID ? tempUserScoreInfo : null;
                        }
                        CocoonJS.SocialGaming.Facebook.onRequestUserScoreSucceed.notifyEventListeners(userScoreInfo);
                    }
                }
                else {
                    CocoonJS.SocialGaming.Facebook.onRequestUserScoreFailed.notifyEventListeners(userID, leaderboardID, response.error.messsage);
                }
            });

        }
    };

    CocoonJS.SocialGaming.Facebook.submitUserScore = function (score, leaderboardID, userID) {
        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.SocialGaming.prototype.submitUserScore.call(this, score, leaderboardID, userID);
        }
        else if (!navigator.isCocoonJS) {
            if (!userID || userID === "me") {
                userID = this.getLoggedInUserInfo().userID;
            }

            if (!this.initialized) {
                this.onSubmitUserScoreFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
                return;
            }

            FB.api(userID + "/scores", function (response) {
                if (!response.error && response.data) {
                    if (response.data.length === 0) {
                        CocoonJS.SocialGaming.Facebook.onSubmitUserScoreFailed.notifyEventListeners(userID, leaderboardID, "No score has been submitted yet for the user.");
                    }
                    else {
                    	var previousScore = 0;
                        var userScoreInfo = null;
                        for (var i = 0; !userScoreInfo && i < response.data.length; i++) {
                            var tempUserScoreInfo = CocoonJS.SocialGaming.Facebook.fromFacebookUserScoreInfoToCocoonJSUserScoreInfo(response.data[i], leaderboardID);
                            userScoreInfo = tempUserScoreInfo.userID === userID ? tempUserScoreInfo : null;
                        }
                        previousScore = userScoreInfo.score;
                        if (previousScore > score)
                        {
                        	CocoonJS.SocialGaming.Facebook.onSubmitUserScoreSucceed.notifyEventListeners(userID, leaderboardID, previousScore);
                        }
                        else
                        {
			                var params = { score:score    };
			                FB.api(userID + '/scores', 'POST', params, function (response) {
			                    if (response) {
			                        if (!response.error) {
			                            CocoonJS.SocialGaming.Facebook.onSubmitUserScoreSucceed.notifyEventListeners(userID, leaderboardID, score);
			                        }
			                        else {
			                            CocoonJS.SocialGaming.Facebook.onSubmitUserScoreFailed.notifyEventListeners(userID, leaderboardID, score, response.error.message);
			                        }
			                    }
			                    else {
			                        CocoonJS.SocialGaming.Facebook.onSubmitUserScoreFailed.notifyEventListeners(userID, leaderboardID, score, "Error sending user score");
			                    }
			                });
                        }
                    }
                }
                else {
                    CocoonJS.SocialGaming.Facebook.onSubmitUserScoreFailed.notifyEventListeners(userID, leaderboardID, score, response.error.messsage);
                }
            });
        }
    };

    CocoonJS.SocialGaming.Facebook.requestUserAchievements = function (userID) {
        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.SocialGaming.prototype.requestUserAchievements.call(this, userID);
        }
        else if (!navigator.isCocoonJS) {
            var srv = CocoonJS.SocialGaming.Facebook;

            userID = userID ? userID : this.userInfoCocoonJS.userID;
            if (!this.initialized) {
                this.onRequestUserAchievementsFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
                return;
            }

            // Get the achievements of the user.
            FB.api(userID + "/achievements", function (response) {
                if (!response.error && response.data) {
                    var userAchievements = [];
                    var numberOfUserAchievements = response.data.length;
                    if (numberOfUserAchievements === 0) {
                        CocoonJS.SocialGaming.Facebook.onRequestUserAchievementsSucceed.notifyEventListeners(userID, userAchievements);
                        return;
                    }

                    for (var i = 0; i < response.data.length; i++) {
                        var id= response.data[i].achievement.id;
                        if ( srv.allAchievementInfo[id] ) {
                            userAchievements.push( CocoonJS.SocialGaming.Facebook.fromFacebookAchievementInfoToCocoonJSAchievementInfo(
                                srv.allAchievementInfo[id] ) );
                        }
                    }

                    CocoonJS.SocialGaming.Facebook.onRequestUserAchievementsSucceed.notifyEventListeners(userID, userAchievements);
                }
                else {
                    CocoonJS.SocialGaming.Facebook.onRequestUserAchievementsFailed.notifyEventListeners(userID, response.error.message);
                }
            });


        }
    };

    CocoonJS.SocialGaming.Facebook.requestAllAchievements = function()
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.SocialGaming.prototype.requestAllAchievements.call(this);
		}
		else if (!navigator.isCocoonJS)
		{
            var me= this;

            if (this.__cachedAchievements) {
                this.onRequestAllAchievementsSucceed.notifyEventListeners(this.__cachedAchievements);
                return;
            }

			if (!this.initialized)
			{
				this.onRequestAllAchievementsFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}

			// Get all the achievements and look for each inside the user's achievement ids in order to get the full information of the achievement.
			FB.api(this.applicationID + '/achievements', function(response) {
				if (!response.error)
				{
					var allAchievementInfos = [];
					var achievementInfo = null;
					for (var i = 0; i < response.data.length; i++)
					{
						var achievementInfo = CocoonJS.SocialGaming.Facebook.fromFacebookAchievementInfoToCocoonJSAchievementInfo(response.data[i]);
						allAchievementInfos.push(achievementInfo);
					}
					CocoonJS.SocialGaming.Facebook.onRequestAllAchievementsSucceed.notifyEventListeners(allAchievementInfos);

                    me.__cachedAchievements = allAchievementInfos;
				}
				else
				{
					CocoonJS.SocialGaming.Facebook.onRequestAllAchievementsFailed.notifyEventListeners(response.error.message);
				}
			});
		}
	};

	CocoonJS.SocialGaming.Facebook.requestAchievementInfo = function(achievementID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.SocialGaming.prototype.requestAchievementInfo.call(this, achievementID);
		}
		else if (!navigator.isCocoonJS)
		{
			if (!achievementID)
			{
				this.onRequestAchievementInfoFailed.notifyEventListeners(achievementID, "A valid achievementID is required.");
				return;
			}
			if (!this.initialized)
			{
				this.onRequestAchievementInfoFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}

			FB.api(this.applicationID + '/achievements', function(response) {
				if (!response.error)
				{
					var achievementInfo = null;
					for (var i = 0; !achievementInfo && i < response.data.length; i++)
					{
						achievementInfo = response.data[i].id === achievementID ? CocoonJS.SocialGaming.Facebook.fromFacebookAchievementInfoToCocoonJSAchievementInfo(response.data[i]) : null;
					}
					if (achievementInfo)
					{
						CocoonJS.SocialGaming.Facebook.onRequestAchievementInfoSucceed.notifyEventListeners(achievementInfo);
					}
					else
					{
						CocoonJS.SocialGaming.Facebook.onRequestAchievementInfoFailed.notifyEventListeners(achievementID, "Could not find the achievement info for the given achievement id.");
					}
				}
				else
				{
					CocoonJS.SocialGaming.Facebook.onRequestAchievementInfoFailed.notifyEventListeners(achievementID, response.error.message);
				}
			});				
		}
	};
    /**
     * FIX: se puede enviar un achievement de un usuario que no soy yo ???
     * @param userID
     * @param achievementID
     * @return {*}
     */
    CocoonJS.SocialGaming.Facebook.submitUserAchievement = function (achievementID, userID) {

        achievementID= this.getAbstractToSocialGamingAchievementTranslation(achievementID);

        if (this.nativeExtensionObjectAvailable) {
            return CocoonJS.SocialGaming.prototype.submitUserAchievement.call(this, achievementID, userID);
        }
        else if (!navigator.isCocoonJS) {

            if ( !this.loggedIn ) {
                return;
            }

            if (!userID || userID==="me") {
                userID= this.userInfoCocoonJS.userID;
            }

            if (!achievementID) {
                this.onSubmitUserAchievementFailed.notifyEventListeners(userID, achievementID, "A valid achievementID is required.");
                return;
            }
            if (!this.initialized) {
                this.onSubmitUserAchievementFailed.notifyEventListeners(userID, achievementID, "The Facebook social gaming service has not been initialized yet.");
                return;
            }
            if (!this.allAchievementInfo[achievementID])
            {
                this.onSubmitUserAchievementFailed.notifyEventListeners(userID, achievementID, "The given achievement id is not among the application achievements.");
                return;
            }

            FB.api(userID + '/achievements', 'POST', {achievement:this.allAchievementInfo[achievementID].url}, function (response) {
                if (!response || response.error) {
                    CocoonJS.SocialGaming.Facebook.onSubmitUserAchievementFailed.notifyEventListeners(userID, achievementID, response.error.message);
                }
                else {
                    CocoonJS.SocialGaming.Facebook.onSubmitUserAchievementSucceed.notifyEventListeners(userID, achievementID);
                }
            });
        }
	};

	CocoonJS.SocialGaming.Facebook.resetUserAchievements = function(userID)
	{
		if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.SocialGaming.prototype.resetUserAchievements.call(this, userID);
		}
		else if (!navigator.isCocoonJS)
		{
			userID = userID ? userID : "me";
			if (!this.initialized)
			{
				this.onResetUserAchievementsFailed.notifyEventListeners(userID, "The Facebook social gaming service has not been initialized yet.");
				return;
			}

			var requestFunction = function(userID)
			{
				FB.api(userID + '/achievements', function(response) {
					if (!response.error && response.data)
					{
						if (response.data.length === 0)
						{
							CocoonJS.SocialGaming.Facebook.onResetUserAchievementsSucceed.notifyEventListeners(userID);
							return;
						}
						var numberOfAchievementsToBeDeleted = response.data.length;
						var processedAchievementIndex = 0;
						var failedAchievements = new Array();
						for (var i=0; i<response.data.length; i++) 
						{
							var params = { achievement: response.data[i].achievement.url };
							FB.api(userID + '/achievements', 'DELETE', params, function(response) {
								processedAchievementIndex++;
								if (!response)
								{
									failedAchievements.push(response.data[i].achievement.id);
								}
								if (processedAchievementIndex >= numberOfAchievementsToBeDeleted)
								{
									if (failedAchievements.length == 0)
									{
										CocoonJS.SocialGaming.Facebook.onResetUserAchievementsSucceed.notifyEventListeners(userID);
									}
									else
									{
										CocoonJS.SocialGaming.Facebook.onResetUserAchievementsFailed.notifyEventListeners(userID, "Error deleting the following achievement ids: " + JSON.stringify(failedAchievements));
									}
								}
							});	
						}
					}
					else
					{
						CocoonJS.SocialGaming.Facebook.onResetUserAchievementsFailed.notifyEventListeners(userID, response.error.message);
					}
				});			
			};

			// If the userID is me, then try to get the real final ID.
			if (userID === "me")
			{
				this.requestMeUserInfo
				(
					function(userInfo)
					{
						requestFunction(userInfo.userID);
					},
					function(errorMessage)
					{
						CocoonJS.SocialGaming.Facebook.onResetUserAchievementsFailed.notifyEventListeners(userID, errorMessage);
					}
				);
			}
			else
			{
				requestFunction(userID);
			}
		}
	};

/*
	CocoonJS.SocialGaming.Facebook.showLeaderboardView = function()
	{
	};


	CocoonJS.SocialGaming.Facebook.showUserAchievementsView = function(userID)
	{
	};
*/

    CocoonJS.SocialGaming.Facebook.showUserAchievementsView= function() {

        var socialGaming= CocoonJS.SocialGaming.Facebook;

        if (!socialGaming || !(socialGaming instanceof CocoonJS.SocialGaming) || !socialGaming.isInitialized() || !socialGaming.isLoggedIn()) {
            socialGaming.onAchievementsViewFailed.notifyEventListeners("Achievements are only available if logged in Facebook and/or Game Center");
            return;
        }

        var webViewLoaded = false;
        var allAchievements;
        var userAchievements;
        var i;

        function showAchievements () {
            if (allAchievements && userAchievements) {
            	// NOTE: Only load the webview if the achievements are retrieved successfully. The webview disables
            	// CocoonJS touch events.
            	if (!webViewLoaded)
            	{
			        CocoonJS.App.loadInTheWebView(socialGaming.achievementsViewURL);
            	}
            	else
            	{
	                var jsCode = "";
	                for (i=0; i<allAchievements.length; i++) {

	                    var achieved = false;
	                    for (var j = 0; !achieved && j < userAchievements.length; j++) {
	                        if ( userAchievements[j].achievementID===allAchievements[i].achievementID ) {
	                            achieved= true;
	                            break;
	                        }
	                    }
	                    var stringifiedAchievementInfo = JSON.stringify( allAchievements[i] );

	                    stringifiedAchievementInfo = stringifiedAchievementInfo.replace(/'/g, "&apos;");

	                    jsCode += "addNewAchievementToTheAchievementsList(" + achieved + ", '" + stringifiedAchievementInfo + "');";
	                }
	                if (jsCode !== "")
	                {
	                    CocoonJS.App.forward(jsCode);
	                }
	                CocoonJS.App.showTheWebView();
					socialGaming.onAchievementsViewSucceed.notifyEventListeners();
	            }
            }
        };

        CocoonJS.App.onLoadInTheWebViewSucceed.addEventListenerOnce(function (pageURL) {
            console.log("onLoadInTheWebViewSucceed");
            webViewLoaded = true;
            showAchievements();
        });

        CocoonJS.App.onLoadInTheWebViewFailed.addEventListenerOnce( function(pageURL) {
            console.log("onLoadInTheWebViewFailed");
            socialGaming.onAchievementsViewFailed.notifyEventListeners("Can't load in the webview.");
            webViewLoaded = false;
        });

        socialGaming.onRequestUserAchievementsSucceed.addEventListenerOnce( function( userID, _userAchievements) {
            console.log("onRequestUserAchievementsSucceed");
            userAchievements= _userAchievements;
            showAchievements();
        });

        socialGaming.onRequestUserAchievementsFailed.addEventListenerOnce( function() {
            console.log("onRequestUserAchievementsFailed");
            webViewLoaded = false;
            socialGaming.onAchievementsViewFailed.notifyEventListeners("Can't get userAchievements.");
        });

        socialGaming.onRequestAllAchievementsSucceed.addEventListenerOnce( function(_allAchievements) {
            console.log("onRequestAllAchievementsSucceed");
            allAchievements= _allAchievements;
            showAchievements();
        });

        socialGaming.onRequestAllAchievementsFailed.addEventListener(function() {
            console.log("onRequestAllAchievementsFailed");
            webViewLoaded = false;
            socialGaming.onAchievementsViewFailed.notifyEventListeners("Can't get AllAchievements.");
        });

        socialGaming.requestUserAchievements();
        socialGaming.requestAllAchievements();
    },

    CocoonJS.SocialGaming.Facebook.showLeaderboardView= function(leaderboardID) {

        var socialGaming= CocoonJS.SocialGaming.Facebook;

        if (!socialGaming || !(socialGaming instanceof CocoonJS.SocialGaming) || !socialGaming.isInitialized() || !socialGaming.isLoggedIn()) {
            this.onLeaderboardViewFailed.notifyEventListeners("Leaderboards are only available if logged in Facebook and/or Game Center");
            return;
        }

        var me = this;
        var webViewLoaded = false;
        var userAndFriendsScoreInfos;

        function showLeaderboards () {
            if (webViewLoaded && userAndFriendsScoreInfos) {
                var jsCode = "";
                for (var i=0; i<userAndFriendsScoreInfos.length; i++) {
                	var isMe = userAndFriendsScoreInfos[i].userID===me.getLoggedInUserInfo().userID;
                	// Only show my score and my friends scores that are not 0
                	if (isMe || userAndFriendsScoreInfos[i].score > 0)
                	{
	                    var stringifiedLeaderboardInfo= JSON.stringify( userAndFriendsScoreInfos[i] );
	                    stringifiedLeaderboardInfo = stringifiedLeaderboardInfo.replace(/'/g, "&apos;");
	                    jsCode += "addNewScore(" +
	                        "'" + stringifiedLeaderboardInfo + "'," +
	                        (isMe)  + ","+
	                        (i+1) +
	                        ");";
	                }
                }
                if (jsCode !== "")
                {
                    CocoonJS.App.forward(jsCode);
                }
                CocoonJS.App.showTheWebView();

                socialGaming.onLeaderboardViewSucceed.notifyEventListeners(leaderboardID);
            }
        };

        CocoonJS.App.onLoadInTheWebViewSucceed.addEventListenerOnce(function () {
            console.log("onLoadInTheWebViewSucceed");
            webViewLoaded = true;
            CocoonJS.App.forward("initializeView();");
            showLeaderboards();
        });

        CocoonJS.App.onLoadInTheWebViewFailed.addEventListenerOnce( function() {
            console.log("onLoadInTheWebViewFailed");
            socialGaming.onLeaderboardViewFailed.notifyEventListeners(leaderboardID, "Can't load in the webView.");
            webViewLoaded = false;
        });

        socialGaming.onRequestUserAndFriendsScoresSucceed.addEventListenerOnce(function(_userAndFriendsScoreInfos) {
            console.log("onRequestUserAchievementsSucceed");
            userAndFriendsScoreInfos= _userAndFriendsScoreInfos;
            // NOTE: Only show the webview if the request for scores succeeds. The webview disables the CocoonJS touch.
	        CocoonJS.App.loadInTheWebView(socialGaming.leaderboardsViewURL);
            // showLeaderboards();
        });

        socialGaming.onRequestUserAndFriendsScoresFailed.addEventListenerOnce(function(_userAndFriendsScoreInfos) {
            console.log("onRequestUserAchievementsFailed");
            socialGaming.onLeaderboardViewFailed.notifyEventListeners(leaderboardID, "Can't get UserAndFriendScores.");
            webViewLoaded= false;
        });

        socialGaming.requestUserAndFriendsScores();

    },

    //Facebook JavaScript SDK Graph API equivalent
    CocoonJS.SocialGaming.Facebook.login = function() {
    	if (this.nativeExtensionObjectAvailable)
		{
			var callback = arguments.length > 0 ? arguments[0] : function(){};
            callback.CocoonJSDontDelete = true;
			var opts  = arguments.length > 1 ? arguments[1] : {};
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "login", [opts, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			FB.login.apply(arguments);
		}
    },

    CocoonJS.SocialGaming.Facebook.logout = function() {
    	if (this.nativeExtensionObjectAvailable)
		{
			var callback = arguments.length > 0 ? arguments[0] : function(){};
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "logout", [callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			FB.logout.apply(arguments);
		}
    },

    CocoonJS.SocialGaming.Facebook.getLoginStatus = function() {
    	if (this.nativeExtensionObjectAvailable)
		{
			var callback = arguments.length > 0 ? arguments[0] : function(){};
			var force  = arguments.length > 1 ? arguments[1] : false;
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getLoginStatus", [force, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			FB.getLoginStatus.apply(arguments);
		}
    },

    CocoonJS.SocialGaming.Facebook.api= function() {

    	if (this.nativeExtensionObjectAvailable)
		{
			var openGraph = arguments[0];
			var httpMethod = arguments.length > 3 ? arguments[1] : "GET";
			var params = null;
			if (arguments.length == 3) params = arguments[1];
			if (arguments.length == 4) params = arguments[2];
			// alert(JSON.stringify(params));
			var callback = arguments.length > 1 ? arguments[arguments.length -1 ] : function(){};

			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "api", [openGraph, httpMethod, params, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			FB.api.apply(arguments);
		}

    },

    CocoonJS.SocialGaming.Facebook.ui= function() {

    	if (this.nativeExtensionObjectAvailable)
		{
			var params = arguments[0];
			var callback = arguments.length > 1 ? arguments[1]: function(){};

			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "ui", [params, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			FB.ui.apply(arguments);
		}

    },

    CocoonJS.SocialGaming.Facebook.requestAdditionalPermissions = function(permissionsType, permissions , callback ) {
       	if (this.nativeExtensionObjectAvailable)
		{
            callback = callback || function(){};

			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "requestAdditionalPermissions", [permissionsType, permissions, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			console.error("TODO: uploadPhoto Facebook JS SDK ");
		}
    },
	CocoonJS.SocialGaming.Facebook.uploadPhoto= function(file, callback) {

    	if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "uploadPhoto", [file, callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			console.error("TODO: uploadPhoto Facebook JS SDK ");
		}

    }

  	CocoonJS.SocialGaming.Facebook.showFriendPicker= function() {

    	if (this.nativeExtensionObjectAvailable)
		{
			var callback = arguments.length > 0 ? arguments[arguments.length - 1 ] : function(){};
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "showFriendPicker", [callback], true);
		}
		else if (!navigator.isCocoonJS)
		{
			console.error("TODO: showFriendPicker Facebook JS SDK ");
		}

    }

    CocoonJS.SocialGaming.Facebook.getMobileCookie= function() {

    	if (this.nativeExtensionObjectAvailable)
		{
			return CocoonJS.makeNativeExtensionObjectFunctionCall(this.nativeExtensionName, "getMobileCookie", arguments);
		}
		else if (!navigator.isCocoonJS)
		{
			console.error("TODO: getMobileCookie Facebook JS SDK ");
		}

    }



})();
