import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const sliderCss = "figure{position:relative;width:400px;margin:0 auto;overflow:hidden;padding-bottom:30px;border-radius:2em}.slide{border:1px solid red}ul{display:flex;margin:0;padding:0;list-style:none;transition:transform 0.5s ease-in-out}li img{width:100%;height:100%;object-fit:contain;overflow:hidden}.caption{width:100%;text-align:center}::slotted(li){flex:1 0 auto;width:100%;height:400px;background-color:#000}::slotted(li) img{height:100%}::slotted(li:nth-child(even)){background-color:#000011;height:400px}button.btn__control{position:absolute;z-index:1;top:calc(50% - 20px);font-size:20px;line-height:20px;opacity:0.5;border:0}button.btn__control img{height:40px}button.btn__control:hover{opacity:1;transition:opacity 0.5s ease-in-out}button.btn__control[disabled],button.btn__control[disabled]:hover{opacity:0.25}button.btn__control.btn__next{right:0;border-radius:1em 0 0 1em}button.btn__control.btn__prev{left:0;border-radius:0 1em 1em 0}";

const Slider = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.clickEvent = createEvent(this, "clickEvent", 7);
    this.showStatus = false;
    this.pause = false;
    this.timeout = 1000;
    this.currentSlideNumber = 0;
    this.slidesCount = 0;
    this.slideWidth = 0;
    this.controls = {
      prev: null,
      next: null,
    };
  }
  componentWillLoad() {
    this.slides = this.el.querySelectorAll("li");
    this.slidesCount = this.slides.length;
    this.slides.forEach((slide, key) => {
      // accesability attributes
      slide.setAttribute("aria-label", "slide " + (key + 1));
      slide.tabIndex = key;
    });
    setInterval(() => {
      if (this.currentSlideNumber === this.slidesCount - 1) {
        return (this.currentSlideNumber = 0);
      }
      return this.slide(1);
    }, this.timeout);
  }
  componentDidLoad() {
    this.sliderList = this.el.shadowRoot.querySelector("ul");
    this.slideWidth = this.slides[0].offsetWidth;
    for (let type in this.controls)
      this.controls[type] = this.el.shadowRoot.querySelector(".btn_" + type);
    this.updateControls();
  }
  componentDidUpdate() {
    this.sliderList.style.transform = `translateX(${this.currentSlideNumber * this.slideWidth * -1}px)`;
    this.updateControls();
  }
  slide(amount = 1) {
    let slideTo = this.currentSlideNumber + amount;
    if (slideTo < 0 || slideTo >= this.slidesCount)
      return;
    this.currentSlideNumber = slideTo;
  }
  updateControls() {
    this.switchControl("prev", !this.currentSlideNumber);
    this.switchControl("next", this.currentSlideNumber === this.slidesCount - 1 ? false : true);
  }
  switchControl(type, enabled) {
    if (this.controls[type])
      this.controls[type].disabled = !enabled;
  }
  onClickHandler(e) {
    this.clickEvent.emit(e);
  }
  render() {
    return (h("div", null, h("figure", { role: "figure", "aria-label": "carousel" }, h("button", { "aria-hidden": "true", type: "button", class: "btn__next btn__control", onClick: this.slide.bind(this, 1) }, h("img", { src: "https://img.icons8.com/ios/2x/circled-chevron-right.png", alt: "next control" })), h("button", { "aria-hidden": "true", type: "button", class: "btn__prev btn__control", onClick: this.slide.bind(this, -1) }, h("img", { src: "https://img.icons8.com/ios/2x/circled-chevron-left.png", alt: "previous control" })), h("ul", { role: "group" }, h("slot", null))), h("br", null), h("div", { class: "caption" }, this.showStatus && (h("figcaption", null, "Slide ", this.currentSlideNumber + 1, " of ", this.slidesCount, h("br", null), h("button", { class: "shadow-click", onClick: (e) => {
        this.onClickHandler(e);
      } }, "Click me"))))));
  }
  get el() { return this; }
  static get style() { return sliderCss; }
}, [1, "simple-slider", {
    "showStatus": [4, "show-status"],
    "pause": [4],
    "timeout": [2],
    "currentSlideNumber": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["simple-slider"];
  components.forEach(tagName => { switch (tagName) {
    case "simple-slider":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Slider);
      }
      break;
  } });
}

const SimpleSlider = Slider;
const defineCustomElement = defineCustomElement$1;

export { SimpleSlider, defineCustomElement };
