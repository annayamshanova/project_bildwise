document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('portfolioTrack');
  const prevBtn = document.querySelector('.portfolio__arrow_prev');
  const nextBtn = document.querySelector('.portfolio__arrow_next');

  const progressText = document.getElementById('portfolioProgressText');
  const progressBar = document.getElementById('portfolioProgressBar');

  const SLIDES_TO_SHOW = 3;
  const SLIDES_TO_SCROLL = 1;
  const TRANSITION_DURATION = 500;

  const originalSlides = Array.from(track.querySelectorAll('.portfolio__slide'));
  const totalOriginalSlides = originalSlides.length;

  // Клонируем хвост в начало и голову в конец
  for (let i = 0; i < SLIDES_TO_SHOW; i++) {
    const clone = originalSlides[totalOriginalSlides - SLIDES_TO_SHOW + i].cloneNode(true);
    track.prepend(clone);
  }
  for (let i = 0; i < SLIDES_TO_SHOW; i++) {
    const clone = originalSlides[i].cloneNode(true);
    track.appendChild(clone);
  }

  let currentIndex = SLIDES_TO_SHOW;
  let isAnimating = false;

  function getSlideWidth() {
    const slide = track.querySelector('.portfolio__slide');
    if (!slide) return 0;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    return slide.offsetWidth + gap;
  }

  function setInitialPosition() {
    const slideWidth = getSlideWidth();
    const offset = -currentIndex * slideWidth;
    track.style.transition = 'none';
    track.style.transform = `translateX(${offset}px)`;
    updateProgress();
  }

  function updateProgress() {
    let realIndex = currentIndex - SLIDES_TO_SHOW;

    if (realIndex < 0) realIndex = totalOriginalSlides - 1;
    if (realIndex >= totalOriginalSlides) realIndex = 0;

    // Страницы: 1–3 = 01, 4–6 = 02
    const page = realIndex < 3 ? 1 : 2;
   if (progressText) {
  progressText.innerHTML = `
    <span class="portfolio__progress-current">0${page}</span>
    /
    <span class="portfolio__progress-total">02</span>
  `;
}


    const maxSteps = totalOriginalSlides - 1;
    let percentage = 0;

    if (maxSteps > 0) {
      percentage = (realIndex / maxSteps) * 100;
    } else {
      percentage = 100;
    }

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  }

  function moveSlider() {
    if (isAnimating) return;
    isAnimating = true;

    const slideWidth = getSlideWidth();
    const offset = -currentIndex * slideWidth;

    track.style.transition = `transform ${TRANSITION_DURATION}ms ease-in-out`;
    track.style.transform = `translateX(${offset}px)`;

    updateProgress();

    setTimeout(() => {
      checkForLoop();
      isAnimating = false;
    }, TRANSITION_DURATION);
  }

  function checkForLoop() {
    const slideWidth = getSlideWidth();
    let needJump = false;

    if (currentIndex >= totalOriginalSlides + SLIDES_TO_SHOW) {
      currentIndex = SLIDES_TO_SHOW;
      needJump = true;
    } else if (currentIndex < SLIDES_TO_SHOW) {
      currentIndex = totalOriginalSlides + SLIDES_TO_SHOW - 1;
      needJump = true;
    }

    if (needJump) {
      track.style.transition = 'none';
      const offset = -currentIndex * slideWidth;
      track.style.transform = `translateX(${offset}px)`;
      updateProgress();
    }
  }

  nextBtn.addEventListener('click', () => {
    if (isAnimating) return;
    currentIndex += SLIDES_TO_SCROLL;
    moveSlider();
  });

  prevBtn.addEventListener('click', () => {
    if (isAnimating) return;
    currentIndex -= SLIDES_TO_SCROLL;
    moveSlider();
  });

  setInitialPosition();
  window.addEventListener('resize', () => {
    setTimeout(setInitialPosition, 100);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const partnersTrack = document.getElementById('partnersSliderTrack');
  if (!partnersTrack) return; // если блока нет на странице – тихо выходим

  const partnersWrapper = partnersTrack.parentElement;
  const partnersSlides = Array.from(partnersTrack.querySelectorAll('.partners__slide'));

  const prevPartnersBtn = document.querySelector('.partners__arrow_prev');
  const nextPartnersBtn = document.querySelector('.partners__arrow_next');

  const partnersCurrent = document.querySelector('.partners__progress-current');
  const partnersTotal = document.querySelector('.partners__progress-total');
  const partnersBar = document.getElementById('partnersProgressBar');

  const totalSlides = partnersSlides.length;
  let partnersIndex = 0;

  // ставим общее количество слайдов (03)
  if (partnersTotal) {
    partnersTotal.textContent = String(totalSlides).padStart(2, '0');
  }

  function updatePartnersSlider() {
    const slideWidth = partnersWrapper.offsetWidth;
    const offset = -partnersIndex * slideWidth;

    partnersTrack.style.transform = `translateX(${offset * -1}px)`;
    // я туплю, нам сразу минус нужен:
    partnersTrack.style.transform = `translateX(-${partnersIndex * slideWidth}px)`;

    if (partnersCurrent) {
      partnersCurrent.textContent = String(partnersIndex + 1).padStart(2, '0');
    }

    if (partnersBar) {
      const progress =
        totalSlides > 1 ? (partnersIndex / (totalSlides - 1)) * 100 : 100;
      partnersBar.style.width = `${progress}%`;
    }
  }

  function goToNextPartners() {
    partnersIndex = partnersIndex + 1;
    if (partnersIndex >= totalSlides) {
      partnersIndex = 0;
    }
    updatePartnersSlider();
  }

  function goToPrevPartners() {
    partnersIndex = partnersIndex - 1;
    if (partnersIndex < 0) {
      partnersIndex = totalSlides - 1;
    }
    updatePartnersSlider();
  }

  nextPartnersBtn?.addEventListener('click', goToNextPartners);
  prevPartnersBtn?.addEventListener('click', goToPrevPartners);

  window.addEventListener('resize', updatePartnersSlider);

  // init
  updatePartnersSlider();
});

