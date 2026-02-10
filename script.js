
/* =========================
   Typewriter Effect (NO FLASH, SLOW & CLEAN)
========================= */
const words = ["experiences.", "interfaces.", "products."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const span = document.querySelector(".type");
span.textContent = ""; // prevent initial flash

const TYPE_SPEED = 140;
const DELETE_SPEED = 90;
const PAUSE_AFTER_TYPE = 1400;
const PAUSE_AFTER_DELETE = 500;

function typeWriter() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    span.textContent = currentWord.substring(0, charIndex);
    charIndex++;

    if (charIndex > currentWord.length) {
      setTimeout(() => (isDeleting = true), PAUSE_AFTER_TYPE);
    }
  } else {
    span.textContent = currentWord.substring(0, charIndex);
    charIndex--;

    if (charIndex < 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(() => {}, PAUSE_AFTER_DELETE);
    }
  }

  setTimeout(typeWriter, isDeleting ? DELETE_SPEED : TYPE_SPEED);
}

/* Delay start to avoid render flash */
setTimeout(typeWriter, 300);

/* =========================
   Scroll Reveal
========================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
   Navbar Indicator (FINAL & CORRECT)
========================= */
const links = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll("section");

function moveIndicator(el) {
  indicator.style.width = el.offsetWidth + "px";
  indicator.style.left = el.offsetLeft + "px";
}

function updateActiveNav() {
  let current = "";
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (scrollPos >= sectionTop) {
      current = section.id;
    }
  });

  // Force Contact at bottom of page
  if (scrollPos + windowHeight >= docHeight - 50) {
    current = "contact";
  }

  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      moveIndicator(link);
    }
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

links.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(() => moveIndicator(link), 300);
  });
});

/* =========================
   Contact Form (MAILTO)
========================= */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = `Portfolio Contact from ${name}`;
    const body =
      `Name: ${name}%0A` +
      `Email: ${email}%0A%0A` +
      `${message}`;

    window.location.href =
      `mailto:apsingh8325@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

/* =========================
   CERTIFICATION MODAL LOGIC
========================= */

const certCards = document.querySelectorAll(".cert-card");
const certModal = document.getElementById("certModal");

const modalTitle = document.getElementById("modalTitle");
const modalOrg = document.getElementById("modalOrg");
const modalDesc = document.getElementById("modalDesc");
const modalSkills = document.getElementById("modalSkills");
const modalLink = document.getElementById("modalLink");

const closeBtn = document.querySelector(".cert-close");

certCards.forEach(card => {
  card.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalOrg.textContent = `${card.dataset.org} • ${card.dataset.year}`;
    modalDesc.textContent = card.dataset.desc;

    modalSkills.innerHTML = "";
    card.dataset.skills.split(",").forEach(skill => {
      const span = document.createElement("span");
      span.textContent = skill.trim();
      modalSkills.appendChild(span);
    });

    modalLink.href = card.dataset.link;
    certModal.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  certModal.classList.remove("active");
});

certModal.addEventListener("click", e => {
  if (e.target === certModal) {
    certModal.classList.remove("active");
  }
});


