// timer.js
function initTimer() {
    const timerDisplay = document.querySelector('.card-pomodoro-timer-time p');
    const sessionProgress = document.getElementById('sessionProgress');
    const playPauseBtn = document.querySelector('.card-pomodoro-timer-section-buttons a:nth-child(2)');
    const resetBtn = document.querySelector('.card-pomodoro-timer-section-buttons a:nth-child(1)');
    const menuButtons = document.querySelectorAll('.card-pomodoro-timer-menu-button');
    
    // Переменные таймера
    let timerInterval = null;
    let isRunning = false;
    let currentTimeInSeconds = 0;
    let currentMode = 'focus';
    let currentSession = 1;
    let completedSessions = 0; // Количество завершенных фокус-сессий
    
    // Настройки
    let settings = {
        focusTime: 30,
        breakTime: 10,
        restTime: 15,
        sessions: 5
    };

    // Загрузка настроек с сервера
    async function loadSettingsFromServer() {
        try {
            const response = await fetch('/api/get-settings');
            
            if (response.ok) {
                const data = await response.json();
                
                settings = {
                    focusTime: data.focusTime || 30,
                    breakTime: data.breakTime || 10,
                    restTime: data.restTime || 15,
                    sessions: data.sessions || 5
                };
                
                updateTimeForCurrentMode();
                updateSessionDisplay();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Обновление отображения сессий
    function updateSessionDisplay() {
        if (sessionProgress) {
            sessionProgress.textContent = `${completedSessions}/${settings.sessions}`;
        }
    }

    // Обновление времени для текущего режима
    function updateTimeForCurrentMode() {
        if (currentMode === 'focus') {
            currentTimeInSeconds = settings.focusTime * 60;
        } else if (currentMode === 'break') {
            currentTimeInSeconds = settings.breakTime * 60;
        } else if (currentMode === 'rest') {
            currentTimeInSeconds = settings.restTime * 60;
        }
        updateDisplay();
    }

    // Форматирование времени
    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Обновление отображения
    function updateDisplay() {
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(currentTimeInSeconds);
        }
    }

    // Обновление кнопки Play/Pause
    function updatePlayPauseButton() {
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('i');
            icon.className = isRunning ? 'bi bi-pause-fill' : 'bi bi-play-fill';
        }
    }

    // Установка активного таба
    function setActiveTab(mode) {
        menuButtons.forEach(btn => btn.classList.remove('active-button'));
        
        if (mode === 'focus') menuButtons[0].classList.add('active-button');
        else if (mode === 'break') menuButtons[1].classList.add('active-button');
        else if (mode === 'rest') menuButtons[2].classList.add('active-button');
    }

    // Переключение режима
    function switchMode(mode) {
        currentMode = mode;
        setActiveTab(mode);
        
        if (!isRunning) {
            updateTimeForCurrentMode();
        }
        
        updatePlayPauseButton();
    }

    // Запуск таймера
    function startTimer() {
        if (timerInterval) return;
        
        isRunning = true;
        updatePlayPauseButton();
        
        timerInterval = setInterval(() => {
            if (currentTimeInSeconds > 0) {
                currentTimeInSeconds--;
                updateDisplay();
            } else {
                handleTimerComplete();
            }
        }, 1000);
    }

    // Остановка таймера
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isRunning = false;
        updatePlayPauseButton();
    }

    // Переключение Play/Pause
    function togglePlayPause() {
        if (isRunning) {
            stopTimer();
        } else {
            if (currentTimeInSeconds <= 0) {
                updateTimeForCurrentMode();
            }
            startTimer();
        }
    }

    // Сброс таймера
    async function resetTimer() {
        stopTimer();
        completedSessions = 0;
        currentSession = 1;
        await loadSettingsFromServer();
        switchMode('focus');
        updateSessionDisplay();
    }

    // Звук уведомления
    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Sound error:', error);
        }
    }

    // Уведомление
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
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
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'}"></i>
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

    // Завершение таймера
    function handleTimerComplete() {
        stopTimer();
        playNotificationSound();
        
        // Останавливаем фоновый звук при завершении сессии
        if (window.stopBackgroundSound) {
            window.stopBackgroundSound();
        }
        
        if (currentMode === 'focus') {
            completedSessions++;
            updateSessionDisplay();
            
            if (completedSessions >= settings.sessions) {
                showNotification(`All ${settings.sessions} sessions complete! Time for a long rest.`, 'info');
                currentMode = 'rest';
                currentTimeInSeconds = settings.restTime * 60;
                setActiveTab('rest');
                updateDisplay();
                completedSessions = 0;
                
                setTimeout(() => {
                    startTimer();
                }, 2000);
            } else {
                showNotification(`Focus complete! Break time. (${completedSessions}/${settings.sessions})`, 'success');
                currentMode = 'break';
                currentTimeInSeconds = settings.breakTime * 60;
                setActiveTab('break');
                updateDisplay();
                
                setTimeout(() => {
                    startTimer();
                }, 2000);
            }
        } else if (currentMode === 'break') {
            showNotification(`Break is over! Time to focus. (${completedSessions}/${settings.sessions})`, 'info');
            currentMode = 'focus';
            currentTimeInSeconds = settings.focusTime * 60;
            setActiveTab('focus');
            updateDisplay();
        } else if (currentMode === 'rest') {
            showNotification('Rest is over! Starting new cycle.', 'info');
            currentMode = 'focus';
            currentTimeInSeconds = settings.focusTime * 60;
            completedSessions = 0;
            currentSession = 1;
            setActiveTab('focus');
            updateDisplay();
            updateSessionDisplay();
        }
    }

    // Обработчики событий
    menuButtons[0].addEventListener('click', function(e) {
        e.preventDefault();
        switchMode('focus');
    });

    menuButtons[1].addEventListener('click', function(e) {
        e.preventDefault();
        switchMode('break');
    });

    menuButtons[2].addEventListener('click', function(e) {
        e.preventDefault();
        switchMode('rest');
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePlayPause();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetTimer();
        });
    }

    // Инициализация
    async function initialize() {
        await loadSettingsFromServer();
        switchMode('focus');
        updateSessionDisplay();
    }

    initialize();

    return {
        switchMode,
        togglePlayPause,
        resetTimer,
        loadSettingsFromServer,
        getCurrentMode: () => currentMode,
        getSettings: () => settings
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initTimer };
}