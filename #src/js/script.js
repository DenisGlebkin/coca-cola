	@@include("_snow.js");
	
	class PageSlider {
		constructor() {
			this.slider = null;
			this.sliderContainer = document.querySelector(".page-wrapper");
			this.sliderWrapper = this.sliderContainer.querySelector(".main");
			this.sliderSlides = this.sliderWrapper.querySelectorAll(".section");

			this.isSliderActive = false;

			this.toggleSlider();
			this.createEvents();
		}

		enableSlider() {
			this.sliderContainer.classList.add("swiper-container");
			this.sliderWrapper.classList.add("swiper-wrapper");
			this.sliderSlides.forEach((slide) => {
				slide.classList.add("swiper-slide");
			});

			this.slider = new Swiper(".page-wrapper", {
				spaceBetween: 0,
				speed: 700,
				allowTouchMove: false,
				direction: "vertical",
				allowTouchMove: false,
				mousewheel: true,
			});

			this.slider.on("slideChange", this.snowflake.bind(this));
			
			this.isSliderActive = true;
		}

		disableSlider() {
			if (this.isSliderActive) this.slider.destroy(true, true);
			this.sliderContainer.classList.remove("swiper-container");
			this.sliderWrapper.classList.remove("swiper-wrapper");
			this.sliderSlides.forEach((slide) => {
				slide.classList.remove("swiper-slide");
			});

			this.isSliderActive = false;
		}

		toggleSlider(event) {
			const clientWidth = document.body.clientWidth;

			if (clientWidth >= 992 && !this.isSliderActive) {
				this.enableSlider();
			} else if (clientWidth < 992 && (this.isSliderActive || !event)) {
				this.disableSlider();
			}
		}

		toggleMousewheel(){
			if (this.isSliderActive){
				if (this.slider.mousewheel.enabled) {
					this.slider.mousewheel.disable();
				} else {
					this.slider.mousewheel.enable();
				}
			}
		}

		snowflake(){
			let snowflake = this.sliderWrapper.querySelector(".snowflake");
			if (this.slider.activeIndex === 1 && this.slider.previousIndex === 0) {
				snowflake.classList.add("snowflake--fly");
			} else if (this.slider.activeIndex === 0 && this.slider.previousIndex === 1) {
				snowflake.classList.remove("snowflake--fly");
			}
		}

		createEvents() {
			window.addEventListener("resize", this.toggleSlider.bind(this));
		}
	}

(function(){
	const santaMessage = document.querySelector(".santa-message");

	window.onload = setTimeout(()=>{
		santaMessage.classList.add("santa-message--shown")
	}, 3000);

	const sliderControls = new Swiper(".presents__contorls", {
		slidesPerView: 3,
		spaceBetween: 25,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		slideToClickedSlide: true,
		// centeredSlides: true,
		allowTouchMove: false,
		breakpoints: {
			1200:{
				spaceBetween: 35,
			},
		}
	});
	
	const slider = new Swiper(".presents__presents-descriptions", {
		spaceBetween: 0,
		speed: 700,
		thumbs: {
			swiper: sliderControls,
			slideThumbActiveClass: "contorls-presents__item--active"
		},
		allowTouchMove: false,
		effect: 'fade',
			fadeEffect: {
				crossFade: true
		},

	});

	const pageSlider = new PageSlider();
	const snow = new Snow();

	const burgerBtn = document.querySelector(".burger-btn");
	burgerBtn.addEventListener("click", () => {
		burgerBtn.classList.toggle("burger-btn--active");
		document.body.classList.toggle("overflow");

		pageSlider.toggleMousewheel();
	})

	$(".letter-form__select").niceSelect();
}())