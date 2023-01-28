export default async function handleInterest(interestArr, saveInterest) {
  const setIntClass = () =>
    interestArr.forEach((interest) => {
      if (interest.isSelected === true) {
        const id = interest.id;
        const selectedInt = document.querySelectorAll(`#${id}`);

        selectedInt.forEach((element) => element.classList.add("selected"));
      }
    });

  const interest = document.querySelectorAll(".interest_btn");

  const handleInterest = (event) => {
    const id = event.id;

    let isChosen;
    interestArr.forEach((interest) => {
      if (interest.id === id) {
        interest.isSelected === true ? (isChosen = true) : (isChosen = false);
      }
    });
    console.log("is?", isChosen);
    if (isChosen) {
      interestArr.forEach((interest) => {
        interest.id === id ? (interest.isSelected = false) : "";
        event.classList.remove("selected");
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
  interest.forEach((e) => e.addEventListener("click", () => handleInterest(e)));
  setIntClass();
}
