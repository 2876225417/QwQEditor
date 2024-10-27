


window.electronAPI.onInitialTheme((isDarkMode) => {
    if(isDarkMode) {
        document.body.classList.add("dark-mode");
    }
})




document.getElementById("toggle-theme").addEventListener("click", () => {
    window.electronAPI.sendThemeToggle();
});

window.electronAPI.onThemeUpdate((isDarkMode) => {
    if(isDarkMode){
        document.body.classList.add("dark-mode");
    }else{
        document.body.classList.remove("dark-mode");
    }
});

