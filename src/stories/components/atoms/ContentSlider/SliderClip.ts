class SliderClip {
  el: HTMLElement;
  Slides: HTMLElement[];
  Title: HTMLElement[];
  Nav: HTMLElement[];
  totalSlides: number;
  current: number;
  autoPlay: boolean;
  timeTrans: number;
  IndexElements: number[];

  constructor(el: HTMLElement) {
    this.el = el;
    this.Slides = Array.from(this.el.querySelectorAll("li"));
    this.Title = Array.from(this.el.querySelectorAll(".center-y h4"));
    this.Nav = Array.from(this.el.querySelectorAll("nav a"));
    this.totalSlides = this.Slides.length;
    this.current = 0;
    this.autoPlay = true;
    this.timeTrans = 4000;
    this.IndexElements = Array.from(Array(this.totalSlides).keys());

    if (this.Slides.length > 0 && this.Nav.length > 0) {
      this.setCurrent();
      this.initEvents();
    }
  }

  setCurrent() {
    if (this.Slides[this.current]) {
      this.Slides[this.current].classList.add("current");
      this.Nav[this.current].classList.add("current_dot");
      this.Title[this.current].classList.add("current");
    }
  }

  initEvents() {
    if (this.Nav.length === 0 || this.Slides.length === 0) return;

    this.Nav.forEach((dot, index) => {
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeSlide(index);
      });
    });

    this.el.addEventListener("mouseenter", () => {
      this.autoPlay = false;
    });
    this.el.addEventListener("mouseleave", () => {
      this.autoPlay = true;
    });

    setInterval(() => {
      if (this.autoPlay) {
        // Si es el último slide, reiniciamos al primero
        this.current = (this.current + 1) % this.Slides.length;
        this.changeSlide(this.current);
      }
    }, this.timeTrans);
  }

  changeSlide(index: number) {
    // Asegúrate de que el índice esté dentro del rango permitido
    if (index < 0 || index >= this.Slides.length) return;

    // Limpia todas las clases "current" y "prev"
    for (const dot of this.Nav) {
      dot.classList.remove("current_dot");
    }
    for (const title of this.Title) {
      title.classList.remove("current");
    }
    for (const slide of this.Slides) {
      slide.classList.remove("prev", "current");
    }

    // Establece los elementos anteriores como "prev"
    const prevElements = this.IndexElements.filter((i) => i < index);
    for (const i of prevElements) {
      this.Slides[i].classList.add("prev");
    }

    // Aplica las clases "current" a los elementos correspondientes
    this.Slides[index].classList.add("current");
    this.Title[index].classList.add("current");
    this.Nav[index].classList.add("current_dot");

    // Actualiza el índice actual
    this.current = index;
  }
}

export default SliderClip;
