import { getContents } from "./util.js";

export default async function createRouter() {
  const hash = window.location.hash.replace("#", "");
  // pathName 잘 출력됨

  const routes = {
    bookmark: {
      page: "/pages/bookmark.html",
    },
    interest: {
      page: "/pages/interest.html",
      eventListener: () => {
        const INTEREST_KEY = "interest";
        let interestArr = [];
        function saveInterest() {
          localStorage.setItem(INTEREST_KEY, JSON.stringify(interestArr));
        }
        const savedInt = localStorage.getItem(INTEREST_KEY);
        const parsedInt = JSON.parse(savedInt);
        if (parsedInt !== null) {
          interestArr = parsedInt;
        }

        const setIntClass = () =>
          interestArr.forEach((interest) => {
            if (interest.isSelected === true) {
              const id = interest.id;
              const selectedInt = document.querySelectorAll(`#${id}`);

              selectedInt.forEach((element) =>
                element.classList.add("selected", "chosen")
              );
            }
          });

        const interest = document.querySelectorAll(".interest_btn");

        const handleInterest = (event) => {
          const className = ["chosen", "selected"];
          const id = event.id;

          let isChosen;
          interestArr.forEach((interest) => {
            if (interest.id === id) {
              interest.isSelected === true
                ? (isChosen = true)
                : (isChosen = false);
            }
          });
          console.log("is?", isChosen);
          if (isChosen) {
            interestArr.forEach((interest) => {
              interest.id === id ? (interest.isSelected = false) : "";
              event.classList.remove(...className);
            });
          } else if (!isChosen) {
            const newInterest = { id, isSelected: true };
            interestArr.map((interest) => {
              if (interest.id === id) {
                interest.isSelected = true;
              }
            });
            interestArr.push(newInterest);
          }
          interestArr = interestArr.reduce((acc, current) => {
            if (acc.findIndex(({ id }) => id === current.id) === -1) {
              acc.push(current);
            }
            return acc;
          }, []);
          saveInterest();
          setIntClass();
        };
        interest.forEach((e) =>
          e.addEventListener("click", () => handleInterest(e))
        );
        setIntClass();
      },
    },
    feed: {
      page: "/pages/feed.html",
      eventListener: async () => {
        const cardWrapper = document.querySelector(".content_wrapper");
        getContents();
        const contentsArr = await getContents();
        console.log(contentsArr);

        //card 배치 랜덤
        const contents = await contentsArr.popularity.sort(
          () => Math.random() - 0.5
        );

        const firstCard = `<div class="wrapper_block">
    ${contents // 추후 hash 로 대체하여 코드 재활용
      .slice(0, 18)
      .map((item, i) => {
        return ` <section class="${
          i === 10 || i === 17 ? "news_single_item" : "news_single_item_small"
        }">
      <div>
      <a href=${item.link} target="_blank">
        <div class="thumb">
          <img src=${item.thumbnail} />
        </div>
        <ul class="info">
          <li>${item.origin}</li>
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
  </section>`;
      })
      .join("")}</div>`;
        cardWrapper.innerHTML = firstCard;

        let index = 0;
        let index2 = 18;
        let isLarge = true;
        // index = index2
        // isLarge 가 false 면 index2 += 8 이되고 isLarge 가 true 됨
        // index2 < contents.patName.length 까지 반복

        // scroll event
        document.addEventListener("scroll", () => {
          if (
            window.innerHeight + window.scrollY >=
            document.body.scrollHeight
          ) {
            if (index2 < contents.length) {
              index = index2;
              console.log("index", index);
              if (isLarge === true) {
                index2 += 10;
                isLarge = false;
                console.log("isLarge", index2, isLarge);
              } else if (isLarge === false) {
                index2 += 8;
                isLarge = true;
                console.log("!isLarge", index2, isLarge);
              }
              const appendCard = `<div class="wrapper_block">
          ${contents // 추후 hash 로 대체하여 코드 재활용
            .slice(index, index2)
            .map((item, i) => {
              return ` <section class="${
                (isLarge && i === 0) || (isLarge && i === 7)
                  ? "news_single_item"
                  : "news_single_item_small"
              }">
            <div>
            <a href=${item.link} target="_blank">
              <div class="thumb">
                <img src=${item.thumbnail} />
              </div>
              <ul class="info">
                <li>${item.origin}</li>
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
          </section>`;
            })
            .join("")}</div>`;
              const box = cardWrapper.appendChild(
                document.createElement("div")
              );
              box.innerHTML = appendCard;
            }
          }
        });
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
