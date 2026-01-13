// TraveLight - AI Travel Agent Interactive Features
// 👇 PASTE YOUR N8N WEBHOOK URL BETWEEN THE QUOTES 👇
const N8N_WEBHOOK_URL = 'https://n8ngc.codeblazar.org/webhook/travelagent';

document.addEventListener('DOMContentLoaded', function() {
    init();
    setupSmoothScroll();
    setupButtonHandlers();
    setupScrollAnimations();
    setupRippleEffect();
    setupChatbot(); 
    setupNavbarColorChange();
});

function init() {
    console.log('TraveLight AI initialized. Connected to n8n.');
}

// --- STANDARD UI FUNCTIONS (These remain the same) ---

function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupButtonHandlers() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chatbotSection = document.querySelector('#chatbot');
            if (chatbotSection) {
                chatbotSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card, .step');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

function setupRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
            .cta-button { position: relative; overflow: hidden; }
            .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.6); transform: scale(0); animation: ripple-animation 0.6s ease-out; pointer-events: none; }
            @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}

// --- 🤖 THE NEW INTELLIGENT CHATBOT LOGIC ---

function setupChatbot() {
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // 1. Function to add text to the UI
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        
        const messageParagraph = document.createElement('p');
        // This line makes AI lists and paragraphs look good
        messageParagraph.innerHTML = text.replace(/\n/g, '<br>'); 
        
        messageDiv.appendChild(messageParagraph);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 2. Function to show "Thinking..." status
    function showLoading() {
        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'message bot-message loading-bubble';
        loaderDiv.id = 'ai-loader';
        loaderDiv.innerHTML = '<p>✈️ Planning...</p>'; // Simple text loader
        chatMessages.appendChild(loaderDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 3. Function to remove "Thinking..." status
    function removeLoading() {
        const loader = document.getElementById('ai-loader');
        if (loader) loader.remove();
    }

    // 4. The Main Send Function (Connects to n8n)
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Step A: Show user message immediately
        addMessage(message, true);
        chatInput.value = '';
        chatInput.disabled = true; // Lock input while waiting
        
        // Step B: Show loading indicator
        showLoading();

        try {
            // Step C: Send data to n8n
            console.log("Sending to n8n..."); 
            
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message // This sends: { "message": "I want a trip to Japan" }
                })
            });

            const data = await response.json();
            console.log("Received from n8n:", data);

            // Step D: Remove loading and show answer
            removeLoading();
            
            // Check for 'answer' or 'output' or 'text' keys
            if (data.answer) {
                addMessage(data.answer, false);
            } else if (data.output) {
                addMessage(data.output, false);
            } else {
                addMessage("I received your request, but the response was empty.", false);
            }

        } catch (error) {
            console.error('Connection Error:', error);
            removeLoading();
            addMessage("⚠️ Error: Could not connect to the Travel Agent. Is the workflow active?", false);
        } finally {
            // Step E: Unlock input
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // Event Listeners
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

// Setup Navbar Color Change
function setupNavbarColorChange() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    
    function updateNavbarColor() {
        if (!heroSection) return;
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + navbar.offsetHeight;
        
        if (scrollPosition > heroBottom) {
            navbar.classList.add('dark-mode');
        } else {
            navbar.classList.remove('dark-mode');
        }
    }
    
    window.addEventListener('scroll', updateNavbarColor);
    updateNavbarColor();
}