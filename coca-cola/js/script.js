	class Snow {
	constructor() {
		this.snowElements = document.querySelectorAll(".snow");
		this.isSnowActive = false;

		this.responsive();
		this.createEvents();
	}

	load() {
		this.snowElements.forEach((snowElem) => {
			this.snowFly(snowElem);
		})

		this.isSnowActive = true;
	}

	snowFly(snowElem) {
		var particleCount = 300;
		var particleMax = 1000;
		// var snowElem = document.querySelectorAll('.snow');
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var width = snowElem.clientWidth;
		var height = snowElem.clientHeight;
		var i = 0;
		var active = false;
		var snowflakes = [];
		var snowflake;

		canvas.style.position = 'absolute';
		canvas.style.left = canvas.style.top = '0';

		var Snowflake = function () {
			this.x = 0;
			this.y = 0;
			this.vy = 0;
			this.vx = 0;
			this.r = 0;

			this.reset();
		};

		Snowflake.prototype.reset = function () {
			this.x = Math.random() * width;
			this.y = Math.random() * -height;
			this.vy = 1 + Math.random() * 3;
			this.vx = 0.5 - Math.random();
			this.r = 1 + Math.random() * 2;
			this.o = 0.5 + Math.random() * 0.5;
		};

		function generateSnowFlakes() {
			snowflakes = [];
			for (i = 0; i < particleMax; i++) {
				snowflake = new Snowflake();
				snowflake.reset();
				snowflakes.push(snowflake);
			}
		}

		generateSnowFlakes();

		function update() {
			ctx.clearRect(0, 0, width, height);

			if (!active) {
				return;
			}

			for (i = 0; i < particleCount; i++) {
				snowflake = snowflakes[i];
				snowflake.y += snowflake.vy;
				snowflake.x += snowflake.vx;

				ctx.globalAlpha = snowflake.o;
				ctx.beginPath();
				ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
				ctx.closePath();
				ctx.fill();

				if (snowflake.y > height) {
					snowflake.reset();
				}
			}

			requestAnimFrame(update);
		}

		function onResize() {
			width = snowElem.clientWidth;
			height = snowElem.clientHeight;
			canvas.width = width;
			canvas.height = height;
			ctx.fillStyle = '#FFF';

			var wasActive = active;
			active = width > 319;

			if (!wasActive && active) {
				requestAnimFrame(update);
			}
		}

		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		onResize();
		window.addEventListener('resize', onResize, false);

		snowElem.appendChild(canvas);

		// var gui = new dat.GUI();
		// gui.add(window, 'particleCount').min(1).max(particleMax).step(1).name('Particles count').onFinishChange(function () {
		//     requestAnimFrame(update);
		// });
	}

	responsive(event) {
		let body = document.body;
	
		if (body.clientWidth < 992 && (this.isSnowActive || !event)) {
			this.snowElements.forEach((snowElem) => {
				snowElem.remove();
			});

			this.isSnowActive = false;

			let snowElem = document.createElement("span"),
				pageWrapper = document.querySelector(".page-wrapper");

			snowElem.classList.add("snow");
			// snowElem.classList.add("snow--fixed");
			pageWrapper.prepend(snowElem);

			this.snowFly(snowElem);
		} else if (body.clientWidth >= 992 && !this.isSnowActive) {
			let snowElemGlobal = document.querySelector(".snow"),
				sections = document.querySelectorAll(".section");

			if (snowElemGlobal) snowElemGlobal.remove();

			sections.forEach((section) => {
				let snowElem = document.createElement("span");
				snowElem.classList.add("snow");

				section.prepend(snowElem);
			})

			this.snowElements = document.querySelectorAll(".snow");

			this.load();
		}
	}

	createEvents() {
		window.addEventListener("resize", this.responsive.bind(this));
	}
};
	
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