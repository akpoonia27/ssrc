import "./style.css";

// Initialize AOS
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 80,
});

// ===== Loading Screen =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 1200);
});

// ===== Navbar Scroll =====
const navbar = document.getElementById("navbar");
const backTop = document.getElementById("backTop");

const handleScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  if (window.scrollY > 400) {
    backTop.classList.add("show");
  } else {
    backTop.classList.remove("show");
  }
};

window.addEventListener("scroll", handleScroll, { passive: true });

// ===== Mobile Menu =====
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navMenu.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const setActiveLink = () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });

// ===== Back to Top =====
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll(".stat-number");
let countersStarted = false;

const animateCounters = () => {
  if (countersStarted) return;
  const statsSection = document.getElementById("stats");
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current) + (suffix === "x7" ? "" : suffix === "x7" ? "" : "");
          if (suffix === "x7") {
            counter.textContent = Math.floor(current) + "x7";
          } else {
            counter.textContent = Math.floor(current) + suffix;
          }
          requestAnimationFrame(update);
        } else {
          if (suffix === "x7") {
            counter.textContent = target + "x7";
          } else {
            counter.textContent = target + suffix;
          }
        }
      };
      update();
    });
  }
};

window.addEventListener("scroll", animateCounters, { passive: true });

// ===== FAQ Accordion =====
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("active"));
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// ===== Testimonial Slider =====
const track = document.getElementById("testimonialTrack");
const slides = track.children;
const prevBtn = document.getElementById("testPrev");
const nextBtn = document.getElementById("testNext");
const dotsContainer = document.getElementById("testDots");
let currentSlide = 0;
let autoSlide;

const buildDots = () => {
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("span");
    dot.classList.add("testimonial-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
};

const updateSlider = () => {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll(".testimonial-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
};

const goToSlide = (i) => {
  currentSlide = (i + slides.length) % slides.length;
  updateSlider();
  resetAuto();
};

const nextSlide = () => goToSlide(currentSlide + 1);
const prevSlide = () => goToSlide(currentSlide - 1);

const resetAuto = () => {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 5000);
};

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

buildDots();
resetAuto();

// ===== Tracking Form =====
const trackingForm = document.getElementById("trackingForm");
const trackResult = document.getElementById("trackResult");

trackingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const trackId = document.getElementById("trackInput").value.trim().toUpperCase();
  if (!trackId) return;

  let status, statusClass, origin, destination, eta, progress;

  if (trackId.startsWith("SSRC")) {
    status = "In Transit";
    statusClass = "in-transit";
    origin = "Pune, Maharashtra";
    destination = "Mumbai, Maharashtra";
    eta = "Tomorrow, 2:00 PM";
    progress = 50;
  } else {
    status = "Not Found";
    statusClass = "not-found";
  }

  if (status === "Not Found") {
    trackResult.innerHTML = `
      <div class="tracking-result-card">
        <span class="track-status ${statusClass}">${status}</span>
        <p>Tracking ID <strong>${trackId}</strong> was not found in our system.</p>
        <p>Please check your tracking ID or contact our support team.</p>
      </div>
    `;
  } else {
    trackResult.innerHTML = `
      <div class="tracking-result-card">
        <span class="track-status ${statusClass}">${status}</span>
        <p><strong>Tracking ID:</strong> ${trackId}</p>
        <p><strong>Origin:</strong> ${origin}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Estimated Delivery:</strong> ${eta}</p>
        <div class="track-progress">
          <div class="track-progress-bar" style="width: ${progress}%"></div>
          <div class="track-step active"><span><i class="fa-solid fa-check"></i></span><small>Booked</small></div>
          <div class="track-step active"><span><i class="fa-solid fa-truck"></i></span><small>In Transit</small></div>
          <div class="track-step"><span><i class="fa-solid fa-warehouse"></i></span><small>Out for Delivery</small></div>
          <div class="track-step"><span><i class="fa-solid fa-flag-checkered"></i></span><small>Delivered</small></div>
        </div>
      </div>
    `;
  }

  trackResult.classList.add("show");
});

// ===== Contact Form =====
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !phone || !email || !service || !message) {
    formStatus.className = "form-status error show";
    formStatus.textContent = "Please fill in all fields before submitting.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.className = "form-status error show";
    formStatus.textContent = "Please enter a valid email address.";
    return;
  }

  formStatus.className = "form-status success show";
  formStatus.textContent = `Thank you, ${name}! Your request has been received. Our team will contact you shortly.`;
  contactForm.reset();

  setTimeout(() => {
    formStatus.classList.remove("show");
  }, 6000);
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== Lazy load images =====
if ("loading" in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.loading = "lazy";
  });
}
