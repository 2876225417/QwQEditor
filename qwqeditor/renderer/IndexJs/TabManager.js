document.addEventListener("DOMContentLoaded", () => {
    const tabsContainer = document.querySelector(".tabs");
    const iframeContainer = document.querySelector(".iframe-container");
    const newTabButton = document.getElementById("new-tab");

    let tabCount = 0;
    const tabData = {};

    // 创建新标签页
    function createNewTab(url = "subIndex/home.html") {
        tabCount += 1;
        const tabId = `tab-${tabCount}`;

        // 创建标签元素
        const tab = document.createElement("div");
        tab.classList.add("tab");
        tab.dataset.tabId = tabId;
        tab.innerHTML = `Tab ${tabCount} <button class="close-tab">x</button>`;
        tabsContainer.appendChild(tab);

        // 创建 iframe 元素
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.classList.add("tab-iframe");
        iframe.dataset.tabId = tabId;
        iframe.style.display = "none";
        iframeContainer.appendChild(iframe);

        tabData[tabId] = { tab, iframe };

        // 激活新标签
        switchTab(tabId);

        // 绑定切换和关闭事件
        tab.addEventListener("click", () => switchTab(tabId));
        tab.querySelector(".close-tab").addEventListener("click", (event) => {
            event.stopPropagation();
            closeTab(tabId);
        });
    }

    // 切换标签
    function switchTab(tabId) {
        Object.values(tabData).forEach(({ tab, iframe }) => {
            tab.classList.remove("active");
            iframe.style.display = "none";
        });

        const { tab, iframe } = tabData[tabId];
        tab.classList.add("active");
        iframe.style.display = "block";
    }

    // 关闭标签
    function closeTab(tabId) {
        const { tab, iframe } = tabData[tabId];
        tabsContainer.removeChild(tab);
        iframeContainer.removeChild(iframe);
        delete tabData[tabId];

        if (tab.classList.contains("active") && Object.keys(tabData).length > 0) {
            const remainingTabId = Object.keys(tabData)[0];
            switchTab(remainingTabId);
        }
    }

    // 新建标签按钮事件
    newTabButton.addEventListener("click", () => {
        createNewTab();
    });

    // 默认打开一个标签
    createNewTab();
});
