import { handleMarkData } from "../../util.js";

export default async function handleMyFeed(
  cardWrapper,
  interestArr,
  contentsArr,
  bookmarkArr,
  saveMark
) {
  let myFeedArr = [];
  // 관심사 설정 전엔 popularity 노출되도록
  const basicFeed = contentsArr.popularity;
  if (interestArr.length === 0) {
    myFeedArr.push(...basicFeed);
  }
  interestArr.forEach((interest) => {
    const id = interest.id;
    const content = contentsArr[id];
    interest.isSelected === true ? myFeedArr.push(...content) : null;
  });
  // 관심사 설정 했다가 모두 취소 한 경우
  if (myFeedArr.length === 0) {
    myFeedArr.push(...basicFeed);
  }
  const mixedContents = await myFeedArr.sort(() => Math.random() - 0.5);
  const myFeed = `<div class="wrapper_block">
${mixedContents
  .slice(0, 18)
  .map((item, i) => {
    return ` <section class="${
      i === 10 || i === 17 ? "news_single_item" : "news_single_item_small"
    }">
  <div>
  <a href=${item.link} target="_blank">
    <div class="thumb">
      <img src="${item.thumbnail}" />
    </div>
    <ul class="info">
      <li>${item.origin}</li>
    </ul>
    <div class="title">${item.title}</div>
  </a>
</div>
<div class="item_btns item_bottom">
  <div><button type="button" class="btn_bookmark" id="${item.link},${
      item.category
    }"></button></div>
</div>
<div class="edit_bg"></div>
</section>`;
  })
  .join("")}</div>`;
  cardWrapper.innerHTML = myFeed;

  let index = 0;
  let index2 = 18;
  let isLarge = true;

  document.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      if (index2 < mixedContents.length) {
        index = index2;
        if (isLarge === true) {
          index2 += 10;
          isLarge = false;
        } else if (isLarge === false) {
          index2 += 8;
          isLarge = true;
        }
        const appendCard = `<div class="wrapper_block">
    ${mixedContents
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
          <img src="${item.thumbnail}" />
        </div>
        <ul class="info">
          <li>${item.origin}</li>
        </ul>
        <div class="title">${item.title}</div>
      </a>
      </div>
      <div class="item_btns item_bottom">
        <div><button type="button" onclick="${handleMarkData(
          saveMark,
          bookmarkArr
        )}" class="btn_bookmark" id="${item.link},${
          item.category
        }"></button></div>
      </div>
      <div class="edit_bg"></div>
    </section>`;
      })
      .join("")}</div>`;
        const box = cardWrapper.appendChild(document.createElement("div"));
        box.innerHTML = appendCard;
      }
    }
  });
  handleMarkData(saveMark, bookmarkArr);
}
