function initVolumeControl() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    if (!volumeSlider) {
        console.warn('Ползунок громкости не найден');
        return null;
    }
    
    function getThemeColors() {
        const isLightTheme = document.body.classList.contains('light-theme');
        console.log('Текущая тема:', isLightTheme ? 'светлая' : 'темная');         return {
            fillColor: isLightTheme ? '#e07b39' : '#cb75ea',
            emptyColor: isLightTheme ? '#d1d1d1' : '#2e3a4a'
        };
    }
    
    function updateSliderBackground() {
        const value = volumeSlider.value;
        const min = volumeSlider.min || 0;
        const max = volumeSlider.max || 100;
        const percentage = ((value - min) / (max - min)) * 100;
        
                const colors = getThemeColors();
        
        volumeSlider.style.setProperty('background', 
            `linear-gradient(to right, ${colors.fillColor} 0%, ${colors.fillColor} ${percentage}%, ${colors.emptyColor} ${percentage}%, ${colors.emptyColor} 100%)`,
            'important');
        
                if (volumeValue) {
            volumeValue.textContent = value + '%';
        }
    }
    
    function getVolume() {
        return parseInt(volumeSlider.value);
    }
    
    function setVolume(value) {
        volumeSlider.value = value;
        updateSliderBackground();
        localStorage.setItem('backgroundVolume', value);
    }
    
        volumeSlider.addEventListener('input', updateSliderBackground);
    volumeSlider.addEventListener('change', function() {
        updateSliderBackground();
        localStorage.setItem('backgroundVolume', this.value);
    });
    
        const savedVolume = localStorage.getItem('backgroundVolume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
    }
    
        setTimeout(updateSliderBackground, 100);
    setTimeout(updateSliderBackground, 500);     
        window.updateVolumeSliderBackground = updateSliderBackground;
    
    return {
        getVolume: getVolume,
        setVolume: setVolume,
        updateSliderBackground: updateSliderBackground
    };
}