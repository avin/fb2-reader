const TAB_KEY_CODE = 9;

class FocusEngine {
  isRunning = false;

  container!: HTMLElement;

  className!: string;

  constructor(container: HTMLElement, className: string) {
    this.container = container;
    this.className = className;
  }

  isActive() {
    return this.isRunning;
  }

  start() {
    this.container.addEventListener('mousedown', this.handleMouseDown);
    this.isRunning = true;
  }

  stop() {
    this.reset();
    this.isRunning = false;
  }

  reset() {
    this.container.classList.remove(this.className);
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.which === TAB_KEY_CODE) {
      this.reset();
      this.container.addEventListener('mousedown', this.handleMouseDown);
    }
  };

  handleMouseDown = () => {
    this.reset();
    this.container.classList.add(this.className);
    this.container.addEventListener('keydown', this.handleKeyDown);
  };
}

/**
 * Хелпер который дает возможность задавать раздельные стили фокуса для клика
 * мыши и перемещения по табу
 *
 * @param element - ?
 * @param className  - ?
 * @returns FocusEngine
 */
function betterFocus(element: HTMLElement, className: string) {
  return new FocusEngine(element, className);
}

export default betterFocus;
