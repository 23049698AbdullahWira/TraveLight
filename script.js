// TraveLight - AI Travel Agent Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    init();
    setupSmoothScroll();
    setupButtonHandlers();
    setupScrollAnimations();
    setupRippleEffect();
    setupChatbot();
});

// Initialize function
function init() {
    console.log('TraveLight AI Travel Agent initialized!');
}

// Smooth scrolling for navigation links
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA Button click handlers
function setupButtonHandlers() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Navigate to chatbot section
            const chatbotSection = document.querySelector('#chatbot');
            if (chatbotSection) {
                chatbotSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animation for feature cards
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

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

// Ripple effect for buttons
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

    // Add ripple style if not already present
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
            .cta-button {
                position: relative;
                overflow: hidden;
            }

            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }

            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Setup Chatbot
function setupChatbot() {
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Sample travel-related responses for demo
    const botResponses = [
        "That sounds amazing! Where would you like to explore?",
        "I can help you with that! What's your travel budget?",
        "Great choice! Would you prefer beaches, mountains, or cities?",
        "How many days are you planning to travel?",
        "Let me find the best deals for you!",
        "I can suggest some amazing hidden gems in that region!",
        "Would you like me to help with flight bookings or accommodations?",
        "What's the best time for you to travel?",
        "I'll check the weather and travel season for you!",
        "Perfect! I'm creating your personalized itinerary now!"
    ];

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        
        messageDiv.appendChild(messageParagraph);
        chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            // Simulate bot response delay
            setTimeout(() => {
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage(randomResponse, false);
            }, 500);
        }
    }

    // Send message on button click
    chatSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    console.log('Chatbot initialized! Ready for N8N integration.');
    console.log('To add your N8N chatbot:');
    console.log('1. Replace the chat interface with an N8N embed/iframe');
    console.log('2. Add your N8N webhook URL to the n8nContainer div');
    console.log('3. Or embed the N8N chat widget directly in the chatbot section');
}
