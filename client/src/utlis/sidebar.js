export function handlerCanvas(navLinkRefs, btnCloseRef, element) {
  const navLinkEls = navLinkRefs.current.querySelectorAll(element);

  navLinkEls.forEach((el) => {
    el.addEventListener("click", () => {
      btnCloseRef.current.click();
    });
  });
}
