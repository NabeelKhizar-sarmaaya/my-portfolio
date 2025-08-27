// Detect when an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add fade-in class when the section is in the viewport
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.fade-in');
  sections.forEach(section => {
    if (isInViewport(section)) {
      section.classList.add('fade-in-active');
    }
  });
});

// Handle form submission (sending to Formspree)
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting immediately

  const formData = new FormData(this);

  // Send the form data using Fetch API
  fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      document.getElementById('formResponse').textContent = 'Thank you for your message! I will get back to you soon.';
      document.getElementById('formResponse').style.color = 'green';
    } else {
      document.getElementById('formResponse').textContent = 'Oops! Something went wrong, please try again later.';
      document.getElementById('formResponse').style.color = 'red';
    }
  })
  .catch(error => {
    document.getElementById('formResponse').textContent = 'Oops! Something went wrong, please try again later.';
    document.getElementById('formResponse').style.color = 'red';
  });
});

const slider = document.querySelector('.slider');
let slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
const slideWidth = slides[0].offsetWidth + 30; // width + gap
let index = slideCount; // start from original first slide after prep

// Clone first N and last N slides for seamless loop
const visibleSlides = 5; // number of slides visible at a time
for(let i = 0; i < visibleSlides; i++){
  // clone first slides to the end
  let cloneFirst = slides[i].cloneNode(true);
  cloneFirst.classList.add('clone');
  slider.appendChild(cloneFirst);

  // clone last slides to the start
  let cloneLast = slides[slides.length - 1 - i].cloneNode(true);
  cloneLast.classList.add('clone');
  slider.insertBefore(cloneLast, slider.firstChild);
}

// Update slides NodeList after cloning
slides = document.querySelectorAll('.slide');

// Move slider to show the original slides first
slider.style.transform = `translateX(-${slideWidth * index}px)`;

// Function to move slides
function moveSlide(step = 1){
  index += step;
  slider.style.transition = 'transform 0.5s ease-in-out';
  slider.style.transform = `translateX(-${slideWidth * index}px)`;

  slider.addEventListener('transitionend', () => {
    if(index >= slideCount + visibleSlides){
      // reached cloned slides at end
      index = visibleSlides;
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${slideWidth * index}px)`;
    } else if(index < visibleSlides){
      // reached cloned slides at start
      index = slideCount + visibleSlides - 1;
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  }, { once: true });
}

// Auto-play
let autoplay = setInterval(() => moveSlide(1), 2000);

// Prev / Next buttons
document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
document.querySelector('.next').addEventListener('click', () => moveSlide(1));

// Optional: pause on hover
slider.addEventListener('mouseenter', () => clearInterval(autoplay));
slider.addEventListener('mouseleave', () => autoplay = setInterval(() => moveSlide(1), 2000));


