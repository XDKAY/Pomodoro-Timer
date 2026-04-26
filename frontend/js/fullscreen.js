function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!fullscreenBtn) {
        return;
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Ошибка полноэкранного режима:', err);
            });
            fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen"></i>';
        }
    }
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen"></i>';
        } else {
            fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
        }
    });
}

function enterFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Ошибка полноэкранного режима:', err);
        });
    }
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function toggleFullscreenMode() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}