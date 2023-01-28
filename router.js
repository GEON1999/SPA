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
  function saveInterest() {
    localStorage.setItem(INTEREST_KEY, JSON.stringify(interestArr));
  }
  const savedInt = localStorage.getItem(INTEREST_KEY);
  const parsedInt = JSON.parse(savedInt);
  if (parsedInt !== null) {
    interestArr = parsedInt;
  }

  const BOOKMARK_KEY = "bookmark";
  let bookmarkArr = [];
  function saveMark() {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkArr));
  }
  const savedMark = localStorage.getItem(BOOKMARK_KEY);
  const parsedMark = JSON.parse(savedMark);
  if (parsedMark !== null) {
    bookmarkArr = parsedMark;
  }

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
