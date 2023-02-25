import { getContents } from "./util.js";
import handleFeed from "./src/js/handleFeed.js";
import handleInterest from "./src/js/handleInterest.js";
import handleMyFeed from "./src/js/handleMyFeed.js";
import handleBookmark from "./src/js/handleBookmark.js";

export default async function createRouter() {
  const cardWrapper = document.querySelector(".content_wrapper");
  const hash = window.location.hash.replace("#", "");
  const INTEREST_KEY = "interest";
  let interestArr = [];
  const saveInterest = () => {
    localStorage.setItem(INTEREST_KEY, JSON.stringify(interestArr));
  };
  const savedInt = localStorage.getItem(INTEREST_KEY);
  const parsedInt = JSON.parse(savedInt);
  if (parsedInt !== null) {
    interestArr = parsedInt;
  }

  const BOOKMARK_KEY = "bookmark";
  let bookmarkArr = [];
  const saveMark = () => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkArr));
  };
  const savedMark = localStorage.getItem(BOOKMARK_KEY);
  const parsedMark = JSON.parse(savedMark);
  if (parsedMark !== null) {
    bookmarkArr = parsedMark;
  }

  //nav
  const nav = document.querySelector(".tabs");
  const navHtml = `
  <ul>
    <li class="${hash === "myFeed" ? "selected" : ""}">
      <div>
        <a href="#myFeed">내 피드</a>
      </div>
    </li>
    <li class="${hash === "popularity" ? "selected" : ""}">
      <div>
        <a href="#popularity">인기</a>
      </div>
    </li>
    <li class="${hash === "investment" ? "selected" : ""}">
      <div>
        <a href="#investment">투자</a>
      </div>
    </li>
    <li class="${hash === "news" ? "selected" : ""}">
      <div>
        <a href="#news">뉴스</a>
      </div>
    </li>
    <li class="${hash === "tv" ? "selected" : ""}">
      <div>
        <a href="#tv">TV</a>
      </div>
    </li>
    <li class="${hash === "entertainment" ? "selected" : ""}">
      <div>
        <a href="#entertainment">연예</a>
      </div>
    </li>
    <li class="${hash === "sports" ? "selected" : ""}">
      <div>
        <a href="#sports">스포츠</a>
      </div>
    </li>
    <li class="${hash === "biz" ? "selected" : ""}">
      <div>
        <a href="#biz">비즈</a>
      </div>
    </li>
    <li class="${hash === "interest" ? "selected" : ""}">
      <div>
        <a href="#interest">관심사 선택 및 북마크</a>
      </div>
    </li>
  </ul>
  `;
  nav.innerHTML = navHtml;

  const contentsArr = await getContents();
  let feed =
    hash === "popularity" ||
    hash === "investment" ||
    hash === "news" ||
    hash === "tv" ||
    hash === "entertainment" ||
    hash === "sports" ||
    hash === "biz"
      ? hash
      : "";

  const routes = {
    bookmark: {
      page: "/src/pages/bookmark.html",
    },
    interest: {
      page: "/src/pages/interest.html",
    },
    myFeed: {
      page: "/src/pages/feed.html",
    },
    [feed]: {
      page: "/src/pages/feed.html",
    },
    "": {
      page: "/src/pages/interest.html",
    },
  };

  const render = async () => {
    try {
      const route = routes[hash];
      const html = await fetch(route.page).then((response) => response.text());
      document.getElementById("main").innerHTML = html;
      if (hash === feed) {
        handleFeed(hash, contentsArr, cardWrapper, bookmarkArr, saveMark);
      }
      if (hash === "interest" || hash === "") {
        handleInterest(interestArr, saveInterest);
      }
      if (hash === "myFeed") {
        handleMyFeed(
          cardWrapper,
          interestArr,
          contentsArr,
          bookmarkArr,
          saveMark
        );
      }
      if (hash == "bookmark") {
        handleBookmark(bookmarkArr, contentsArr, saveMark);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render();

  window.addEventListener("hashchange", createRouter);
}
