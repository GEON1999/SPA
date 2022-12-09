export default function createRouter() {
  const routes = {
    "": {
      page: "/pages/interest.html",
    },
    feed: {
      page: "/pages/feed.html",
      eventListener: () => {
        const title = document.getElementById("card_title");
        title.addEventListener("click", () => console.log("clicked"));
      },
    },
  };

  const render = async () => {
    try {
      const hash = window.location.hash.replace("#", "");
      const route = routes[hash];
      const html = await fetch(route.page).then((response) => response.text());
      document.getElementById("main").innerHTML = html;
      routes[hash].eventListener();
    } catch (err) {
      console.error(err);
    }
  };
  console.log("rendered");
  render();

  window.addEventListener("hashchange", render);
  // window.addEventListener("hashchange", console.log("hashChanged"));
}
