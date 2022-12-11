import { getContents } from "./util.js";

export default function createRouter() {
  const routes = {
    "": {
      page: "/pages/interest.html",
      eventListener: () => {},
    },
    feed: {
      page: "/pages/feed.html",
      eventListener: async () => {
        await getContents();
        const contents = await getContents();
        console.log(contents.investment);
        const cardHtml = contents.investment
          .map((item) => {
            return `
            <section class="news_single_item_small">
            <div>
            <a href=${item.link}>
              <div class="thumb">
                <img src=${item.thumbnail} />
              </div>
              <ul class="info">
                <li>${origin}</li>
              </ul>
              <div class="title">${item.title}</div>
            </a>
          </div>
  
          <div class="item_btns item_bottom">
            <div><button type="button" class="btn_bookmark"></button></div>
            <div>
              <button type="button" class="btn_bookmark clicked"></button>
            </div>
          </div>
  
          <div class="edit_bg"></div>
          </section>
          `;
          })
          .join("");

        const card = document.querySelector(".wrapper_block");
        card.innerHTML = cardHtml;
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
