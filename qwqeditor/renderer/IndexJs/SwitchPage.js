



document.addEventListener("DOMContentLoaded", () =>{
    const links = document.querySelectorAll(".sidebar a");
    const mainContent = document.getElementById("main-content");

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
});

