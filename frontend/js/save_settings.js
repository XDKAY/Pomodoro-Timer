function initSaveSettings() {
    const settingsForm = document.getElementById('settingsForm');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const mainView = document.querySelector('.card-pomodoro-timer-main-view');
    const settingsView = document.querySelector('.card-pomodoro-timer-settings');

    if (!settingsForm || !saveSettingsBtn) {
        console.error('Settings form or save button not found');
        return;
    }

        function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: 'Russo One', sans-serif;
            font-size: 16px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

        function getFormData() {
        const formData = new FormData(settingsForm);
        const data = {
            focusTime: parseInt(formData.get('focusTime')),
            breakTime: parseInt(formData.get('breakTime')),
            restTime: parseInt(formData.get('restTime')),
            sessions: parseInt(formData.get('sessions')),
            sound: formData.get('sound'),
            volume: parseInt(formData.get('volumeSlider'))
        };
        return data;
    }

        async function saveSettings(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
                const data = getFormData();
        
                saveSettingsBtn.disabled = true;
        saveSettingsBtn.textContent = 'Saving...';
        
        try {
            
            const response = await fetch('/api/change-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to save settings');
            }
            
                        localStorage.setItem('pomodoroSettings', JSON.stringify(data));
            
                        showNotification(result.message || 'Settings saved successfully!');
            
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification(error.message || 'Failed to save settings. Please try again.', 'error');
        } finally {
                        saveSettingsBtn.disabled = false;
            saveSettingsBtn.textContent = 'Save Changes';
        }
    }

        async function loadSettings() {
        try {
            const response = await fetch('/api/get-settings');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const settings = await response.json();
            
                        document.getElementById('focusTime').value = settings.focusTime || 30;
            document.getElementById('breakTime').value = settings.breakTime || 10;
            document.getElementById('restTime').value = settings.restTime || 15;
            document.getElementById('sessions').value = settings.sessions || 5;
            
                        const soundRadio = document.querySelector(`input[name="sound"][value="${settings.sound || 'none'}"]`);
            if (soundRadio) {
                soundRadio.checked = true;
            }
            
                        const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider && settings.volume) {
                volumeSlider.value = settings.volume;
                const volumeValue = document.getElementById('volumeValue');
                if (volumeValue) {
                    volumeValue.textContent = settings.volume + '%';
                }
                                if (window.updateVolumeSliderBackground) {
                    window.updateVolumeSliderBackground();
                }
            }
            
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

        saveSettingsBtn.addEventListener('click', saveSettings);
    
        settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings(e);
    });

        const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', async function(e) {
            await loadSettings();
        });
    }

        return {
        saveSettings,
        loadSettings,
        getFormData
    };
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSaveSettings };
}