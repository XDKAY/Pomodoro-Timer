function initSettingsToggle() {
    const settingsBtn = document.getElementById('settingsBtn');
    const backBtn = document.getElementById('backBtn');
    const mainView = document.querySelector('.card-pomodoro-timer-main-view');
    const settingsView = document.querySelector('.card-pomodoro-timer-settings');
    const container = document.querySelector('.card-pomodoro-timer-container');

    if (!settingsBtn || !backBtn || !mainView || !settingsView) {
        console.error('Settings toggle elements not found');
        return;
    }

    settingsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mainView.style.display = 'none';
        settingsView.style.display = 'flex';
        
                if (container) {
            container.style.justifyContent = 'flex';
        }
    });

    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
                settingsView.style.display = 'none';
        mainView.style.display = 'flex';
        
                if (container) {
            container.style.justifyContent = 'center';
        }
        
                if (window.refreshTimer) {
            window.refreshTimer();
        }
    });
}