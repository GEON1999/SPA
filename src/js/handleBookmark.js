import { handleMarkData } from "../../util.js";

export default function handleBookmark(bookmarkArr, contentsArr, saveMark) {
  const markedList = document.querySelector(".marked_time");
  let markedArr = [];
  bookmarkArr.forEach((bookmark) => {
    const id = bookmark.id;
    const category = bookmark.category;
    contentsArr[category].forEach((e) =>
      e.link == id && bookmark.isClicked === true ? markedArr.push(e) : null
    );
  });

  const markedFeed = markedArr.map((item) => {
    return `<li>
    <div class="single_item">
      <div>
        <a href=${item.link}>
          <div class="thumb">
            <img src="${item.thumbnail}"/>
          </div>
          <ul class="info">
            <li>${item.origin}</li>
          </ul>
          <div class="title">${item.title}</div>
        </a>
      </div>

      <div class="item_btns item_bottom">
        <div>
          <button type="button" class="btn_bookmark clicked" id="${item.link}"></button>
        </div>
      </div>
    </div>
  </li>`;
  });
  markedList.innerHTML = markedFeed;

  // 북마크 삭제
  const markBtn = document.querySelectorAll(".btn_bookmark");
  const handleBtn = (btn, e) => {
    const bookmarkBox =
      btn.parentElement.parentElement.parentElement.parentElement;
    let deleteIndex = 0;
    for (let i = 0; i < bookmarkArr.length; i++) {
      if (bookmarkArr[i].id === btn.id) {
        deleteIndex = i;
        break;
      }
    }
    bookmarkArr = bookmarkArr.filter(
      (bookmark) => bookmark.id !== bookmarkArr[deleteIndex].id
    );
    localStorage.setItem("bookmark", JSON.stringify(bookmarkArr));
    // 로컬 데이터 삭제 후에도 새로고침 전에는 요소 가 남아있는 것 처럼 보임
    // 북마크 버튼 클릭하자마자 컨테이너가 사라진 것 처럼 보이기 위해 요소 삭제
    bookmarkBox.remove();
  };
  markBtn.forEach((btn) =>
    btn.addEventListener("click", (e) => handleBtn(btn, e))
  );
}
