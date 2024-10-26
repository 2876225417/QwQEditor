document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar a");
    const contentFrame = document.getElementById("contentFrame");

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = link.getAttribute("data-page");

            // 设置 iframe 的 src 属性以加载页面
            contentFrame.src = page;
        });
    });

    // 窗口控制按钮的逻辑
    const minimizeBtn = document.getElementById("minimize-btn");
    minimizeBtn.addEventListener("click", () => {
        window.electronAPI.minimizeWindow();
    });

    const maximizeBtn = document.getElementById("maximize-btn");
    maximizeBtn.addEventListener("click", () => {
        window.electronAPI.maximizeWindow();
    });

    window.electronAPI.onMaximized(() => {
        maximizeBtn.textContent = "❐";
    });

    window.electronAPI.onUnMaximized(() => {
        maximizeBtn.textContent = "□";
    });

    const closeBtn = document.getElementById("close-btn");
    closeBtn.addEventListener("click", () => {
        window.electronAPI.closeWindow();
    });
});
