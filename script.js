// TraveLight - AI Travel Agent Interactive Features
const N8N_WEBHOOK_URL = "https://n8ngc.codeblazar.org/webhook/travelight/chat";

document.addEventListener("DOMContentLoaded", function () {
  init();
  setupSmoothScroll();
  setupButtonHandlers();
  setupScrollAnimations();
  setupRippleEffect();
  setupChatbot();
  setupNavbarColorChange();
});

function init() {
  console.log("TraveLight AI initialized. Connected to n8n.");
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// CTA buttons scroll to chatbot
function setupButtonHandlers() {
  const ctaButtons = document.querySelectorAll(".cta-button");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const chatbotSection = document.querySelector("#chatbot");
      if (chatbotSection) {
        chatbotSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Fade-in animations on scroll
function setupScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const cards = document.querySelectorAll(".feature-card, .step, .chat-interface");
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
}

// Ripple effect for CTA buttons
function setupRippleEffect() {
  const buttons = document.querySelectorAll(".cta-button");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement("style");
    style.setAttribute("data-ripple", "true");
    style.textContent = `
      .cta-button { position: relative; overflow: hidden; }
      .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.6); transform: scale(0); animation: ripple-animation 0.6s ease-out; pointer-events: none; }
      @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
    `;
    document.head.appendChild(style);
  }
}

// Chatbot logic (uses your n8n endpoint + expects { reply: "..." })
function setupChatbot() {
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "message user-message" : "message bot-message";

    const messageParagraph = document.createElement("div");
    messageParagraph.innerHTML = renderMarkdownTables(text);

    messageDiv.appendChild(messageParagraph);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showLoading() {
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "message bot-message";
    loaderDiv.id = "ai-loader";
    loaderDiv.innerHTML = "<p>✈️ Planning your trip...</p>";
    chatMessages.appendChild(loaderDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeLoading() {
    const loader = document.getElementById("ai-loader");
    if (loader) loader.remove();
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatInput.value = "";
    chatInput.disabled = true;

    showLoading();

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: message }),
      });

      const data = await response.json();
      removeLoading();

      if (data && typeof data.reply === "string" && data.reply.trim() !== "") {
        const cleanText = data.reply.replace(/【.*?】/g, ""); // remove citation markers
        addMessage(cleanText, false);
      } else {
        addMessage("I received your message, but the reply was empty.", false);
      }

    } catch (error) {
      console.error("Connection Error:", error);
      removeLoading();
      addMessage("⚠️ Could not connect to TraveLight AI. Is the workflow active?", false);
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
}

// Navbar turns light when scrolled past hero
function setupNavbarColorChange() {
  const navbar = document.querySelector(".navbar");
  const heroSection = document.querySelector(".hero");

  function updateNavbarColor() {
    if (!heroSection) return;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollPosition = window.scrollY + navbar.offsetHeight;

    if (scrollPosition > heroBottom) {
      navbar.classList.add("dark-mode");
    } else {
      navbar.classList.remove("dark-mode");
    }
  }

  window.addEventListener("scroll", updateNavbarColor);
  updateNavbarColor();
}

// Safety: basic HTML escape (prevents injection)
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function renderMarkdownTables(text) {
  // Remove citation markers like 
  let clean = text.replace(/【.*?】/g, "");

  // Convert **bold** to <strong>
  clean = clean.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Remove markdown table separator rows like | ---- | ---- |
  clean = clean.replace(/^\s*\|?\s*-+\s*(\|\s*-+\s*)+\|?\s*$/gm, "");

  if (!clean.includes("|")) {
    return clean.replace(/\n/g, "<br>");
  }

  const lines = clean.split("\n");
  let html = "";
  let table = [];
  let inTable = false;

  for (let line of lines) {
    if (line.trim().startsWith("|")) {
      inTable = true;
      const cells = line.split("|").map(c => c.trim()).filter(c => c);
      table.push(cells);
    } else {
      if (inTable) {
        if (table.length > 1) html += buildTable(table); // avoid empty/header-only tables
        table = [];
        inTable = false;
      }
      html += line + "<br>";
    }
  }

  if (table.length > 1) html += buildTable(table);

  return html;
}

function buildTable(rows) {
  let tableHtml = `<table class="chat-table"><thead><tr>`;
  rows[0].forEach(h => tableHtml += `<th>${h}</th>`);
  tableHtml += `</tr></thead><tbody>`;

  for (let i = 1; i < rows.length; i++) {
    tableHtml += "<tr>";
    rows[i].forEach(cell => tableHtml += `<td>${cell}</td>`);
    tableHtml += "</tr>";
  }

  tableHtml += "</tbody></table>";
  return tableHtml;
}
