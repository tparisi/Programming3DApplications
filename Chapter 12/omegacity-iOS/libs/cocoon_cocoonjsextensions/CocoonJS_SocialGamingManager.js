(function() {

    var registeredSocialGamingServices= {};

    CocoonJS.SocialGaming.SocialGamingManager= {

        /**
         *
         * @param key {string} an internal service name.
         * @param serviceParams object{
         *      service : <CocoonJS.SocialGaming>,
         *      userData: <object>
         * }
         *
         */
        registerSocialGamingService : function(key, serviceParams) {
            registeredSocialGamingServices[key]= serviceParams;
            return serviceParams.service;
        },

        on : function( serviceName, event, callback ) {
            var srv= registeredSocialGamingServices[serviceName];
            if (srv ) {
                return srv.on(event,callback);
            } else {
                console.error("SocialGaming service: '"+serviceName+"' not registered.");
            }

            return this;
        },

        submitUserAchievement : function(achievementID, percent) {
            for( var socialGamingService in registeredSocialGamingServices ) {
                if ( registeredSocialGamingServices.hasOwnProperty(socialGamingService) ) {

                    var srv= registeredSocialGamingServices[socialGamingService].service;
                    if ( srv.isInitialized() && srv.isLoggedIn() && srv.hasPublishPermission()) {
                        srv.submitUserAchievement(achievementID);
                    }
                }
            }
        },

        submitUserScore : function(score, categoryId, tag) {
            for( var socialGamingService in registeredSocialGamingServices ) {
                if ( registeredSocialGamingServices.hasOwnProperty(socialGamingService) ) {
                    var srv= registeredSocialGamingServices[socialGamingService].service;
                    if ( srv.isInitialized() && srv.isLoggedIn()  && srv.hasPublishPermission()) {
                        srv.submitUserScore(score);
                    }
                }
            }
        },

        getRegisteredSocialServicesWithView : function() {
            var services= [];

            for( var socialGamingService in registeredSocialGamingServices ) {
                if ( registeredSocialGamingServices.hasOwnProperty(socialGamingService) ) {
                    var srv= registeredSocialGamingServices[socialGamingService].service;
                    if ( srv!==CocoonJS.SocialGaming.LocalStorage && srv.isInitialized() && srv.isLoggedIn() ) {
                        services.push( srv );
                    }
                }
            }

            return services;
        },

        getSocialServiceUserData : function( _srv ) {
            for( var socialGamingService in registeredSocialGamingServices ) {
                if ( registeredSocialGamingServices.hasOwnProperty(socialGamingService) ) {
                    var srv= registeredSocialGamingServices[socialGamingService].service;
                    if (srv===_srv) {
                        return registeredSocialGamingServices[socialGamingService].userData;
                    }
                }
            }

            return null;
        },

        isLoggedInAnySocialGamingService : function() {
            for( var socialGamingService in registeredSocialGamingServices ) {
                if ( registeredSocialGamingServices.hasOwnProperty(socialGamingService) ) {
                    var srv= registeredSocialGamingServices[socialGamingService].service;
                    if ( srv!==CocoonJS.SocialGaming.LocalStorage && srv.isInitialized() && srv.isLoggedIn() ) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

})();