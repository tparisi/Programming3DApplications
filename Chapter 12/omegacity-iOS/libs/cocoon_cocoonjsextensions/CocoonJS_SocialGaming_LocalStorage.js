(function() {

    // The CocoonJS must exist before creating the extension.
    if (typeof window.CocoonJS === 'undefined' || window.CocoonJS === null) throw("The CocoonJS object must exist and be valid before creating any extension object.");
    if (typeof window.CocoonJS.SocialGaming === 'undefined' || window.CocoonJS === null) throw("The CocoonJS.SocialGaming object must exist and be valid before creating a Facebook extension object.");

	/**
	* This instance represents the extension object to access Facebook related native functionalities.
	* @see CocoonJS.Social
	*/


	CocoonJS.SocialGaming.LocalStorage = new CocoonJS.SocialGaming("IDTK_SRV_SOCIAL_LocalStorage", "SocialGaming.LocalStorage");

    CocoonJS.SocialGaming.LocalStorage.isInitialized = function() {
        return this.initialized;
    };

   CocoonJS.SocialGaming.LocalStorage.requestLogin = function () {
       var srv = CocoonJS.SocialGaming.LocalStorage;
       srv.loggedIn = true;
       srv.onRequestLoginSucceed.notifyEventListeners(userInfo);
   };

    CocoonJS.SocialGaming.LocalStorage.requestLogout = function() {
        CocoonJS.SocialGaming.LocalStorage.loggedIn = false;
        CocoonJS.SocialGaming.LocalStorage.onLogout.notifyEventListeners();
    };

    CocoonJS.SocialGaming.LocalStorage.isLoggedIn = function() {
        return this.loggedIn;
    };

    CocoonJS.SocialGaming.LocalStorage.requestUserInfo = function(userID) {
        CocoonJS.SocialGaming.LocalStorage.onRequestUserInfoSucceed.notifyEventListeners( new CocoonJS.Social.UserInfo(
                userId,
                "localStorage"
        ) );
    };

    CocoonJS.SocialGaming.LocalStorage.requestUserImageURL = function( imageSizeType, userID) {
        CocoonJS.SocialGaming.LocalStorage.onRequestUserImageSucceed.notifyEventListeners(userID, null);
    };

    CocoonJS.SocialGaming.LocalStorage.requestUserFriendsUserInfos = function(userID) {
        if (!this.initialized) {
            this.onRequestUserFriendsUserInfosFailed.notifyEventListeners(userID, "The LocalStorage social gaming service has not been initialized yet.");
            return;
        }

        CocoonJS.SocialGaming.LocalStorage.onRequestUserFriendsUserInfosSucceed.notifyEventListeners(userID, null);
    };

    CocoonJS.SocialGaming.LocalStorage.requestMessagePublicationWithDialog = function (message) {
        if (!this.initialized) {
            console.error("The LocalStorage social gaming service has not been initialized yet.");
            return;
        }

        CocoonJS.SocialGaming.LocalStorage.onRequestMessagePublicationSucceed.notifyEventListeners(message);
   };





    CocoonJS.SocialGaming.LocalStorage.requestInitialization= function(object) {
        this.keys= object;
        this.initialized= true;
        this.loggedIn= true;
    };





// CocoonJS.SocialGaming methods

    /**
  		* Request to retrieve the scores of all friends and the current user
  		* @see CocoonJS.Social.onRequestUserAndFriendsScoresSucceed
  		* @see CocoonJS.Social.onRequestUserAndFriendsScoresFailed
  		*/
    CocoonJS.SocialGaming.LocalStorage.requestUserAndFriendsScores= function(userID) {
        var score= localStorage.getItem( this.keys.score ) || 0;
        this.onRequestUserAndFriendsScoresSucceed.notifyEventListeners(
            userID,
            [
                new CocoonJS.SocialGaming.UserScoreInfo(userID, score, "localStorage", null)
            ]);
    };

    /**
    * Request to retrieve the score of a user.
    * @param {string} [userID] The id of the user to retireve the score from.
    * @param {string} [categoryID] The id of the scores category to retireve the score from.
    * @see CocoonJS.SocialGaming.onRequestUserScoreSucceed
    * @see CocoonJS.SocualGaming.onRequestUserScoreFailed
    */
    CocoonJS.SocialGaming.LocalStorage.requestUserScore = function(userID) {
        var score= localStorage.getItem( this.keys.score ) || 0;
        this.onRequestUserScoreSucceed.notifyEventListeners( userID, score);
    };

    /**
    * Request to the server the score of a user.
    * @param {number} [score] the score to submit
    * @see CocoonJS.SocialGaming.onSubmitUserScoreSucceed
    * @see CocoonJS.SocualGaming.onSubmitUserScoreFailed
    */
    CocoonJS.SocialGaming.LocalStorage.submitUserScore= function(score, userID) {
        var currentScore= localStorage.getItem( this.keys.score ) || 0;
        if ( score>currentScore ) {
            localStorage.setItem( this.keys.score, score );
        }
        this.onSubmitUserScoreSucceed.notifyEventListeners(userID, Math.max(score, currentScore) );
    };

    /**
    * Shows the leaderboard using a platform dependant view.
    * @see CocoonJS.Social.onLeaderboardViewClosed
    */
    CocoonJS.SocialGaming.LocalStorage.showLeaderboardView= function() {
        throw "LocalStorage can't show a leaderboardView.";
    };

    /**
    * Request to retrieve the user achievements. The request can be monitored using the {@link CocoonJS.SocialGaming.onRequestUserAchievementsSucceed} and {@link CocoonJS.Social.onRequestUserAchievementsFailed} event handlers.
    * @param {string} [userID] The id of the user to retireve the achievements from. if null/undefined/"" is specified, the currently logged in user is assumed.
    * @see CocoonJS.Social.onRequestUserAchievementsSucceed
    * @see CocoonJS.Social.onRequestUserAchievementsFailed
    */
    CocoonJS.SocialGaming.LocalStorage.requestUserAchievements= function(userID) {
        var achievements= localStorage.getItem( this.keys.achievements );
        this.onRequestUserAchievementsSucceed.notifyListeners(
            userID,
            JSON.parse(achievements)
        );
    };

    /**
    * Request to retrieve all the achievements. The request can be monitored using the {@link CocoonJS.SocialGaming.onRequestAllAchievementsSucceed} and {@link CocoonJS.Social.onRequestAllAchievementsFailed} event handlers.
    * @see CocoonJS.Social.onRequestAllAchievementsSucceed
    * @see CocoonJS.Social.onRequestAllAchievementsFailed
    */
    CocoonJS.SocialGaming.LocalStorage.requestAllAchievements= function() {
        this.onRequestAllAchievementsFailed.notifyEventListeners("SocialGaming_LocalStorage does not implement requestAllAchievements");
    };

  	/**
    * Request to retrieve the information about an achievement.
    * @param {string} achievementID The id of the achievement to get the information for.
    * @param {CocoonJS.Social.ImageSizeType} [imageSizeType] The size of the image. One of the possible values among the ones in the {@link CocoonJS.Social.ImageSizeType}
    */
    CocoonJS.SocialGaming.LocalStorage.requestAchievementInfo= function(achievementID) {

        this.onRequestAchievementInfoSucceed.notifyEventListeners( new CocoonJS.SocialGaming.AchievementInfo(
            achievementID,
            "achievement title",
            "achievement description",
            null,
            0
        ));
    };

    /**
    * Submits an achievement to the server. If the process fails, the achievement is stored to submit it later.
    * @param {string} [achievementID] the achievement identifier
    * @param {number} [percentComplete] an optional number between 0 and 100 that indicates a completion percentage.
    * @see CocoonJS.SocialGaming.onSubmitAchievementSucceed
    * @see CocoonJS.SocualGaming.onSubmitAchievementFailed
    */
    CocoonJS.SocialGaming.LocalStorage.submitUserAchievement= function( achievementID, userID) {
        achievementID= this.getAbstractToSocialGamingAchievementTranslation(achievementID);
        var achievements= localStorage.getItem( this.keys.achievements );
        if (achievements) {
            achievements= JSON.parse(achievements);
        } else {
            achievements = [];
        }

        if (-1===achievements.indexOf(achievementID) ) {
            achievements.push(achievementID);
        }

        localStorage.setItem( this.keys.achievements, JSON.stringify(achievements) );
        this.onSubmitUserAchievementSucceed.notifyEventListeners(userID, achievementID);
    };

    /**
    * Shows the achievements using a platform dependant view.
    * @see CocoonJS.Social.onAchievementsViewClosed
    */
    CocoonJS.SocialGaming.LocalStorage.showUserAchievementsView = function(userID) {
        throw "LocalStorage can't show an achievements View.";
    };

    /**
    * Resets all the achievements of the current user
    * @param {string} [userID] The id of the user to reset the achievements for. If null/undefined/"", the logged in user is assumed.
    * @see CocoonJS.SocialGaming.onResetAchievementsSucceed
    * @see CocoonJS.SocualGaming.onResetAchievementsFailed
    */
    CocoonJS.SocialGaming.LocalStorage.resetUserAchievements = function(userID) {
        localStorage.setItem( this.keys.achievements, null );
        this.onResetUserAchievementsSucceed.notifyEventListener(userID)
    }
})();