

document.addEventListener("DOMContentLoaded", () =>{
    const links = document.querySelectorAll(".sidebar a");
    const mainContent = document.getElementById("main-content");

    console.log("页面已加载");

    links.forEach(link =>{
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = link.getAttribute("data-page");

            fetch(page)
                .then(response => {
                  if(!response.ok){
                      throw new Error("response Error!");
                  }
                  return response.text();
                })
                .then(html => {
                    mainContent.innerHTML = html;
                })
                .catch(error => {
                    console.error("Error loading the page: ", error);
                    mainContent.innerHTML = "<p>Error loading content.</p>";
                });
        });
    });

    const minimizeBtn = document.getElementById("minimize-btn");
    minimizeBtn.addEventListener("click", () => {
        window.electronAPI.minimizeWindow();
    });

    const maximizeBtn = document.getElementById("maximize-btn");
    maximizeBtn.addEventListener("click", () => {
        window.electronAPI.maximizeWindow();
        console.log("maximized");
    });

    const closeBnt = document.getElementById("close-btn");
    closeBnt.addEventListener("click",  ()=> {
        window.electronAPI.closeWindow();
    });

});








