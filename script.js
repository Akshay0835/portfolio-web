/* =========================
   THREE.JS BACKGROUND
========================= */

(function initThreeJS() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // --- PARTICLE FIELD ---
  const particleCount = 1400;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const color1 = new THREE.Color("#ff0080");
  const color2 = new THREE.Color("#6a00ff");
  const colorMid = new THREE.Color("#ffffff");

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

    const t = Math.random();
    let c;
    if (t < 0.4)       c = color1.clone().lerp(colorMid, t * 2);
    else if (t < 0.7)  c = colorMid.clone().lerp(color2, (t - 0.4) * 3.33);
    else               c = color2;

    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = Math.random() * 1.8 + 0.3;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + pos.x * 0.05) * 1.5;
        pos.x += cos(uTime * 0.2 + pos.z * 0.04) * 1.2;
        vec4 mvp = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (280.0 / -mvp.z);
        gl_Position = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, d);
        gl_FragColor = vec4(vColor, alpha * 0.7);
      }
    `
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // --- FLOATING GEOMETRIC SHAPES ---
  function createFloater(geometry, color, x, y, z) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.01,
      floatSpeed: Math.random() * 0.4 + 0.2,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: y
    };
    scene.add(mesh);
    return mesh;
  }

  const floaters = [
    createFloater(new THREE.IcosahedronGeometry(6, 1), "#ff0080", -30, 10, -20),
    createFloater(new THREE.OctahedronGeometry(4, 0), "#6a00ff", 28, -8, -15),
    createFloater(new THREE.TetrahedronGeometry(5, 0), "#ff4ecd", -8, -20, -30),
    createFloater(new THREE.IcosahedronGeometry(3.5, 0), "#ffffff", 40, 18, -25),
    createFloater(new THREE.OctahedronGeometry(7, 1), "#6a00ff", -42, -12, -35),
  ];

  // --- MOUSE PARALLAX ---
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- SCROLL ---
  let scrollY = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; });

  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Rotate particle field
    particles.rotation.y = elapsed * 0.02 + targetX * 0.15;
    particles.rotation.x = targetY * 0.08 + scrollY * 0.0003;
    mat.uniforms.uTime.value = elapsed;

    // Animate floaters
    floaters.forEach((mesh) => {
      const { rotX, rotY, floatSpeed, floatOffset, baseY } = mesh.userData;
      mesh.rotation.x += rotX;
      mesh.rotation.y += rotY;
      mesh.position.y = baseY + Math.sin(elapsed * floatSpeed + floatOffset) * 3;
      mesh.position.x += Math.cos(elapsed * 0.1 + floatOffset) * 0.01;
    });

    // Camera subtle drift
    camera.position.x += (targetX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();


/* =========================
   TYPEWRITER EFFECT
========================= */
const words = ["experiences.", "interfaces.", "products."];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const span = document.querySelector(".type");
if (span) span.textContent = "";

const TYPE_SPEED = 140, DELETE_SPEED = 80;
const PAUSE_AFTER_TYPE = 1600, PAUSE_AFTER_DELETE = 500;

function typeWriter() {
  const currentWord = words[wordIndex];
  if (!isDeleting) {
    span.textContent = currentWord.substring(0, charIndex);
    charIndex++;
    if (charIndex > currentWord.length) {
      setTimeout(() => { isDeleting = true; }, PAUSE_AFTER_TYPE);
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
setTimeout(typeWriter, 500);


/* =========================
   SCROLL REVEAL
========================= */
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("active");
      animateSkillBars(el);
      animateCounters(el);
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


/* =========================
   SKILL BAR ANIMATION
========================= */
function animateSkillBars(container) {
  container.querySelectorAll(".skill-fill").forEach(bar => {
    if (!bar.classList.contains("animate")) {
      setTimeout(() => bar.classList.add("animate"), 200);
    }
  });
}


/* =========================
   COUNTER ANIMATION
========================= */
function animateCounters(container) {
  container.querySelectorAll(".stat-number[data-count]").forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = "true";
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 25));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 60);
  });
}


/* =========================
   NAVBAR INDICATOR
========================= */
const links = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");
const sections = document.querySelectorAll("section");

function moveIndicator(el) {
  indicator.style.width = el.offsetWidth + "px";
  indicator.style.left = el.offsetLeft + "px";
  if (window.innerWidth <= 768) {
    const navbarInner = document.querySelector(".navbar-inner");
    const linkCenter = el.offsetLeft + el.offsetWidth / 2;
    const containerCenter = navbarInner.offsetWidth / 2;
    navbarInner.scrollTo({ left: linkCenter - containerCenter, behavior: "smooth" });
  }
}

function updateActiveNav() {
  let current = "";
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop - 200) current = section.id;
  });
  if (scrollPos + windowHeight >= docHeight - 50) current = "contact";
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
  link.addEventListener("click", () => setTimeout(() => moveIndicator(link), 300));
});


/* =========================
   CONTACT FORM
========================= */
const contactForm = document.getElementById("contactForm");
const contactCard = document.querySelector(".contact-card");

if (contactCard) {
  contactCard.addEventListener("mousemove", (e) => {
    const rect = contactCard.getBoundingClientRect();
    contactCard.style.setProperty("--x", `${e.clientX - rect.left}px`);
    contactCard.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
}

const submitBtn = contactForm ? contactForm.querySelector(".btn") : null;
if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.classList.add("sending");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    setTimeout(() => {
      window.location.href = `mailto:apsingh8325@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      submitBtn.classList.remove("sending");
      submitBtn.classList.add("success");
      setTimeout(() => { submitBtn.classList.remove("success"); contactForm.reset(); }, 4000);
    }, 1500);
  });
}


/* =========================
   CERTIFICATION MODAL
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
      const s = document.createElement("span");
      s.textContent = skill.trim();
      modalSkills.appendChild(s);
    });
    modalLink.href = card.dataset.link;
    certModal.classList.add("active");
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  });
});

if (closeBtn) closeBtn.addEventListener("click", () => certModal.classList.remove("active"));
if (certModal) certModal.addEventListener("click", e => { if (e.target === certModal) certModal.classList.remove("active"); });


/* =========================
   CUSTOM CURSOR
========================= */
const cursor = document.querySelector(".custom-cursor");
const dot = document.querySelector(".cursor-dot");

let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  dotX += (cursorX - dotX) * 0.18;
  dotY += (cursorY - dotY) * 0.18;

  if (cursor) {
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
  }
  if (dot) {
    dot.style.left = dotX + "px";
    dot.style.top = dotY + "px";
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .project-clean-card, .cert-card").forEach(el => {
  el.addEventListener("mouseenter", () => cursor && cursor.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("hovered"));
});


/* =========================
   MAGNETIC BUTTON
========================= */
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  });
  btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0, 0)"; });
});


/* =========================
   PROJECT CARD GLOW
========================= */
document.querySelectorAll(".project-clean-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--px", `${e.clientX - rect.left}px`);
    card.style.setProperty("--py", `${e.clientY - rect.top}px`);
  });
});


/* =========================
   3D TILT ON CARDS
========================= */
document.querySelectorAll(".project-clean-card, .cert-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});