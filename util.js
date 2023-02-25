export const getContents = async () => {
  return await (await fetch("http://localhost:8080/contents"))
    .json()
    .catch((err) => console.log(err));
};

export const handleMarkData = (saveMark, bookmarkArr) => {
  console.log("howmany");
  const setMarkClass = () => {
    bookmarkArr.forEach((bookmark) => {
      if (bookmark.isClicked === true) {
        const id = `${bookmark.id},` + bookmark.category;
        const clcikedMark = document.getElementById(`${id}`);
        if (clcikedMark !== null) {
          clcikedMark.classList.add("clicked");
        }
      }
    });
  };

  const markBtn = document.querySelectorAll(".btn_bookmark");

  const handleBtn = (btn) => {
    const idArr = btn.id.split(",");
    const id = idArr[0];
    const category = idArr[1];
    const isClicked = Array.from(btn.classList).includes("clicked");
    /** let isClicked;
    bookmarkArr.forEach((bookmark) => {
      if (bookmark.id === id) {
        bookmark.isClicked === true ? (isClicked = true) : (isClicked = false);
      }
    }); */
    console.log(isClicked);
    if (isClicked) {
      bookmarkArr.forEach((bookmark) => {
        bookmark.id === id ? (bookmark.isClicked = false) : "";
        btn.classList.remove("clicked");
      });
    } else if (!isClicked) {
      const newMark = { id, category, isClicked: true };
      let exist = false;
      btn.classList.add("clicked");
      bookmarkArr.forEach((bookmark) => {
        if (bookmark.id === id) {
          bookmark.isClicked = true;
          exist = true;
        }
      });
      if (!exist) {
        bookmarkArr.push(newMark);
      }
    }
    saveMark();
  };

  markBtn.forEach((btn) => {
    // scroll 시 addEventListener 가 중복으로 적용됨
    // 이를 방지하고자 임의의 클래스 여부를 통해 addEventListener 적용
    (() => {
      if (btn.classList.contains("isEvent")) {
        return;
      } else {
        btn.classList.add("isEvent");
        btn.addEventListener("click", () => handleBtn(btn));
      }
    })();
  });
  setMarkClass();
};
