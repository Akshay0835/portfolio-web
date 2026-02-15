
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
      setTimeout(() => { }, PAUSE_AFTER_DELETE);
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

  /* =========================
     MOBILE AUTO-SCROLL NAVBAR
  ========================= */
  if (window.innerWidth <= 768) {
    const navbarInner = document.querySelector(".navbar-inner");

    const linkCenter =
      el.offsetLeft + el.offsetWidth / 2;

    const containerCenter =
      navbarInner.offsetWidth / 2;

    navbarInner.scrollTo({
      left: linkCenter - containerCenter,
      behavior: "smooth"
    });
  }
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

// Holographic Effect
const contactCard = document.querySelector(".contact-card");

if (contactCard) {
  contactCard.addEventListener("mousemove", (e) => {
    const rect = contactCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contactCard.style.setProperty("--x", `${x}px`);
    contactCard.style.setProperty("--y", `${y}px`);
  });
}

const submitBtn = contactForm ? contactForm.querySelector(".btn") : null;

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Start Animation
    submitBtn.classList.add("sending");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;

    // Simulate delay for animation
    setTimeout(() => {
      window.location.href = `mailto:apsingh8325@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      // Reset button state (optional, or keep as success)
      submitBtn.classList.remove("sending");
      submitBtn.classList.add("success");

      // Reset after a few seconds
      setTimeout(() => {
        submitBtn.classList.remove("success");
        contactForm.reset();
      }, 4000);

    }, 1500); // 1.5s delay for animation
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



/* =========================
   CUSTOM CURSOR LOGIC
========================= */
const cursor = document.querySelector(".custom-cursor");

if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button, .project-clean-card, .cert-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

/* =========================
   MAGNETIC BUTTON EFFECT
========================= */
const magneticButtons = document.querySelectorAll(".magnetic");

magneticButtons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    btn.classList.add("magnetic-hover");
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
    btn.classList.remove("magnetic-hover");
  });
});

/* =========================
   3D TILT EFFECT
========================= */
const tiltCards = document.querySelectorAll(".project-clean-card, .cert-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});
