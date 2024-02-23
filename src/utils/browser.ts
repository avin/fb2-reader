export function getScrollPercentage() {
  const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight: number = document.documentElement.scrollHeight;
  const clientHeight: number = document.documentElement.clientHeight;

  const scrolled: number = scrollTop / (scrollHeight - clientHeight);
  const scrolledPercentage: number = scrolled * 100;

  return Number(scrolledPercentage.toFixed(2));
}

export function adjustScrollToElement(element: HTMLElement) {
  if (element) {
    // Получаем вертикальное смещение элемента относительно видимой части страницы
    const yOffset = element.getBoundingClientRect().top;

    // Прокручиваем страницу, сохраняя элемент на верху
    window.scrollTo({ top: window.pageYOffset + yOffset, behavior: 'instant' });
  }
}
