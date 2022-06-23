import {
  Component,
  Element,
  Prop,
  State,
  Event,
  EventEmitter,
  h,
} from "@stencil/core";

@Component({
  tag: "stencil-carousel",
  styleUrl: "slider.scss",
  shadow: true,
})
export class Slider {
  @Element() el: HTMLElement;
  @Event({ bubbles: true, composed: true })
  clickEvent: EventEmitter<MouseEvent>;

  @Prop() showStatus: boolean = false;
  @Prop() pause: boolean = false;
  @Prop() timeout: number = 1000;
  @State() currentSlideNumber: number = 0;
  private slidesCount: number = 0;
  private slides: NodeList;
  private sliderList: HTMLElement;
  private slideWidth: number = 0;
  private controls: object = {
    prev: null,
    next: null,
  };

  componentWillLoad() {
    this.slides = this.el.querySelectorAll("li");
    this.slidesCount = this.slides.length;

    this.slides.forEach((slide: HTMLDListElement, key) => {
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
    this.slideWidth = (this.slides[0] as HTMLElement).offsetWidth;
    for (let type in this.controls)
      this.controls[type] = this.el.shadowRoot.querySelector(".btn_" + type);
    this.updateControls();
  }

  componentDidUpdate() {
    this.sliderList.style.transform = `translateX(${
      this.currentSlideNumber * this.slideWidth * -1
    }px)`;
    this.updateControls();
  }

  slide(amount: number = 1) {
    let slideTo = this.currentSlideNumber + amount;
    if (slideTo < 0 || slideTo >= this.slidesCount) return;
    this.currentSlideNumber = slideTo;
  }

  updateControls() {
    this.switchControl("prev", !this.currentSlideNumber);
    this.switchControl(
      "next",
      this.currentSlideNumber === this.slidesCount - 1 ? false : true
    );
  }

  switchControl(type: string, enabled: boolean) {
    if (this.controls[type]) this.controls[type].disabled = !enabled;
  }

  onClickHandler(e: any) {
    this.clickEvent.emit(e);
  }

  render() {
    return (
      <div>
        <figure role="figure" aria-label="carousel">
          <button
            aria-hidden="true"
            type="button"
            class="btn__next btn__control"
            onClick={this.slide.bind(this, 1)}
          >
            <img
              src="https://img.icons8.com/ios/2x/circled-chevron-right.png"
              alt="next control"
            />
          </button>
          <button
            aria-hidden="true"
            type="button"
            class="btn__prev btn__control"
            onClick={this.slide.bind(this, -1)}
          >
            <img
              src="https://img.icons8.com/ios/2x/circled-chevron-left.png"
              alt="previous control"
            />
          </button>
          <ul role="group">
            <slot />
          </ul>
        </figure>
        <br />
        <div class="caption">
          {this.showStatus && (
            <figcaption>
              Slide {this.currentSlideNumber + 1} of {this.slidesCount}
              <br />
              <button
                class="shadow-click"
                onClick={(e: MouseEvent) => {
                  this.onClickHandler(e);
                }}
              >
                Click me
              </button>
            </figcaption>
          )}
        </div>
      </div>
    );
  }
}
