document.addEventListener('DOMContentLoaded', function() {
    const timer = initTimer();
    
    window.timerInstance = timer;
    

    initSaveSettings();

    initVolumeControl();
    
    initThemeToggle();
    
    initFullscreen();
    

    initSettingsToggle();

    setTimeout(function() {
        if (window.updateVolumeSliderBackground) {
            window.updateVolumeSliderBackground();
        }
    }, 200);
    
    window.refreshTimer = async function() {
        if (window.timerInstance && window.timerInstance.loadSettingsFromServer) {
            await window.timerInstance.loadSettingsFromServer();
            if (window.timerInstance.switchMode) {
                window.timerInstance.switchMode('focus');
            }
        }
    };
    
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || performance.navigation.type === 1) {
            window.refreshTimer();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            window.refreshTimer();
        }
    });
});