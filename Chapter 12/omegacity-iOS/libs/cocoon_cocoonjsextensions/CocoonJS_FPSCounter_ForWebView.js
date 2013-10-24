(function()
{
    if (navigator.isCocoonJS) return false;

    /**
    * A class that represents a Frames Per Second counter. It relies in Timer() to do the time calculation. We will use this fallback if CocoonJS.Timer is not available.
    */
    Timer = function() {
        this.reset();
        return this;
    };

    Timer.prototype = {
        currentTimeInMillis : 0,
        lastTimeInMillis : 0,
        elapsedTimeInMillis : 0,
        elapsedTimeInSeconds : 0,
        accumTimeInMillis : 0,

        reset : function() {
            this.currentTimeInMillis = this.lastTimeInMillis = new Date().getTime();
            this.accumTimeInMillis = this.elapsedTimeInMillis = this.elapsedTimeInSeconds = 0;
        },

        update : function() {
            this.currentTimeInMillis = new Date().getTime();
            this.elapsedTimeInMillis = this.currentTimeInMillis - this.lastTimeInMillis;
            this.elapsedTimeInSeconds = this.elapsedTimeInMillis / 1000.0;
            this.lastTimeInMillis = this.currentTimeInMillis;
            this.accumTimeInMillis += this.elapsedTimeInMillis;
        }
    };
    /**
    * Use this function to show the FPS Counter on the screen when using a web view.
    * You should call Object.enable(); in order to show the FPS Counter and Object.disable() to remove it from the screen.
    * @function 
    */
    var FPSCounter = function() {
        this.timer = (typeof(window.CocoonJS) !== "undefined" && typeof(window.CocoonJS.Timer) !== "undefined") ? new CocoonJS.Timer() : new Timer();
        this.reset();
        return this;
    };

    FPSCounter.prototype = {
        timer : 0,
        fps : 0,
        averageFPS : 0,
        fpsIntervalId : null,
        fpsDiv : null,
        fpsDivParentDiv : null,

        reset : function()
        {
            this.timer.reset();
            this.fps = 0;
            this.averageFPS = 0;
        },

        update : function()
        {
            this.timer.update();
            this.fps++;
            if (this.timer.accumTimeInMillis >= 1000) {
                this.averageFPS = ((1000 * this.fps / this.timer.accumTimeInMillis * 100) | 0) / 100;
                this.fps = 0;
                this.timer.reset();
            }
        },
        /**
        * Enable CocoonJS FPS overlay.
        * @function 
        */
        enable : function(color){
            var textColor = "white";
            var fpsCounter = new FPSCounter();
            var topOrBottom = true;
            var leftOrRight = false;

            this.fpsDivParentDiv = document.createElement("div");
            this.fpsDivParentDiv.style.cssText = "position:absolute; " + (topOrBottom ? "top" : "bottom") + ":0%; width:100%; height:10%;z-index:99999;";
            this.fpsDivParentDiv.innerHTML = "<div id='cocoonjs_fpsDiv' style='background:black; float:" + (leftOrRight ? "left" : "right") + "; color:" + textColor + "; margin-" +(leftOrRight ? "left" : "right")+ ":8px;'></div>";
            
            document.body.appendChild(this.fpsDivParentDiv);
            this.fpsDiv = document.getElementById("cocoonjs_fpsDiv");
            this.fpsIntervalId = setInterval(function()
            {
                fpsCounter.update();
                this.fpsDiv.innerHTML = "< WV FPS: " + (fpsCounter.averageFPS) + "  >";
            }.bind(this), 1000 / 60);
            // If we are inside CocoonJS webview, pause the CocoonJS loop
            if (typeof(window.ext) !== "undefined" && typeof(window.ext.IDTK_APP) !== "undefined") {
                window.ext.IDTK_APP.makeCallAsync("forward", "window.ext.IDTK_APP.makeCall('pause');");
            }
        },
        /**
        * Disable the CocoonJS FPS overlay.
        * @function 
        */
        disable : function()
        {
            if (this.fpsIntervalId)
            {
                clearInterval(this.fpsIntervalId);
                this.fpsIntervalId = undefined;
            }

            if (this.fpsDivParentDiv)
            {
                document.body.removeChild(this.fpsDivParentDiv);
                thisfpsDivParentDiv = undefined;
            }
            this.fpsDiv = undefined;
        }
    };

    /**
    * When the page is loaded, add the FPS Counter to the web view.
    * @ignore
    */
    window.addEventListener("load", function() {
        // If CocoonJS Extensions are available, then add the FPS Counter to the CocoonJS.App namespace.
        if (typeof(window.CocoonJS) !== "undefined" && typeof(window.CocoonJS.App) !== "undefined") {
            window.CocoonJS.App.FPSCounter = new FPSCounter();
            window.CocoonJS.App.FPSCounter.enable();
        }else{
        // We can use the FPS Counter without the CocoonJS Extensions:
        var counter = new FPSCounter();
        counter.enable();
    }
});

})();