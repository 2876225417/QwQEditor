

// 开启应用后自动发送
window.electronAPI.showNotification("测试标题", '测试内容');


// 根据当前用户设备自动设置主题颜色
window.electronAPI.onInitialTheme((isDarkMode) => {
    if(isDarkMode){
        document.body.classList.add("dark-mode");
        document.getElementById("toggle-theme").checked = true;
    }else{
        document.body.classList.remove("dark-mode");
        document.getElementById("toggle-theme").checked = false;
    }
});

// 监听主题切换事件
document.getElementById("toggle-theme").addEventListener("change", () => {
    window.electronAPI.sendThemeToggle();
});

// 监听主题更新事件，更新样式
window.electronAPI.onThemeUpdate((isDarkMode) => {
    if(isDarkMode){
        document.body.classList.add("dark-mode");
        document.getElementById("toggle-theme").checked = true;
    }else{
        document.body.classList.remove("dark-mode");
        document.getElementById("toggle-theme").checked = false;
    }
});


// document.getElementById("show-notification").addEventListener("click", () => {
//    window.electronAPI.showNotification("标题", "内容");
// })

document.getElementById("languageSelect").addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem("selectedLanguage", selectedLanguage);
    applyLanguage(selectedLanguage);
})

window.addEventListener("DOMContentLoaded", async () => {
    await loadLanguageData();
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    document.getElementById("languageSelect").value = savedLanguage;
    applyLanguage(savedLanguage);
})

let languageData = { }

async function loadLanguageData(){
    const response = await fetch("../assets/language.json")
    languageData = await response.json();
}

function applyLanguage(language){
    const data = languageData[language];
    if(data){
        document.getElementById("home").textContent = data.home;
        document.getElementById("about").textContent = data.about;
    }
}



// if("Notification" in window){
//     document.getElementById("show-notification").addEventListener("click", () => {
//         showNotification();
//     });
// }
//
// function showNotification(){
//     Notification.requestPermission().then(permission => {
//         if(permission === "granted"){
//             new Notification("通知标题",{
//                 body: "这是内容"
//             });
//         }
//     });
// }