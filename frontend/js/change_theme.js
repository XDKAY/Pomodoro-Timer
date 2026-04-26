function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (!themeToggleBtn) {
        console.error('Theme toggle button not found');
        return;
    }

    const savedTheme = localStorage.getItem('pomodoroTheme') || 'dark';
    applyTheme(savedTheme, false);
    updateThemeButton(savedTheme);

    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        
        themeToggleBtn.disabled = true;
        
        applyTheme(currentTheme, true);
        updateThemeButton(currentTheme);
        localStorage.setItem('pomodoroTheme', currentTheme);
        
        setTimeout(() => {
            themeToggleBtn.disabled = false;
        }, 600);
        
        setTimeout(function() {
            if (window.updateVolumeSliderBackground) {
                window.updateVolumeSliderBackground();
            }
        }, 100);
    });
}

function applyTheme(theme, animate) {
    const body = document.body;
    const card = document.querySelector('.card-pomodoro-timer');
    
    if (animate) {
        body.style.transition = 'background 0.5s ease, color 0.5s ease';
        
        if (card) {
            card.style.transition = 'background 0.5s ease, box-shadow 0.5s ease';
        }
        
        const allElements = document.querySelectorAll('.card-pomodoro-timer *, .fullscreen-btn');
        allElements.forEach(el => {
            el.style.transition = 'background 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease';
        });
        

        body.style.opacity = '0.8';
        
        setTimeout(() => {
            if (theme === 'light') {
                document.body.classList.add('light-theme');
                document.body.style.background = '#fff0d9';
            } else {
                document.body.classList.remove('light-theme');
                document.body.style.background = '#1a1e24';
            }
            
            body.style.opacity = '1';
            
            setTimeout(() => {
                body.style.transition = '';
                if (card) {
                    card.style.transition = '';
                }
                allElements.forEach(el => {
                    el.style.transition = '';
                });
            }, 500);
        }, 100);
    } else {

        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.style.background = '#fff0d9';
        } else {
            document.body.classList.remove('light-theme');
            document.body.style.background = '#1a1e24';
        }
    }
    
    setTimeout(function() {
        if (window.updateVolumeSliderBackground) {
            window.updateVolumeSliderBackground();
        }
    }, 150);
}

function updateThemeButton(theme) {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (!themeToggleBtn) return;
    
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeText = themeToggleBtn.querySelector('.theme-text');

    if (!themeIcon || !themeText) return;

    themeIcon.style.transition = 'transform 0.3s ease';
    themeIcon.style.transform = 'rotate(180deg) scale(0.5)';
    
    setTimeout(() => {
        if (theme === 'light') {
            themeIcon.className = 'bi bi-sun-fill theme-icon';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.className = 'bi bi-moon-fill theme-icon';
            themeText.textContent = 'Dark Mode';
        }
        
        themeIcon.style.transform = 'rotate(0deg) scale(1)';
        
        setTimeout(() => {
            themeIcon.style.transition = '';
            themeIcon.style.transform = '';
        }, 300);
    }, 150);
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initThemeToggle };
}