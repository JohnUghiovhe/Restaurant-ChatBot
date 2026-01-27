class ChatBot {
    constructor() {
        this.deviceId = this.getOrCreateDeviceId();
        this.apiUrl = 'http://localhost:3000';
        this.currentOrder = null;
        this.menuItems = [];
        this.isSelectingMenu = false;
        
        this.initializeChat();
        this.setupEventListeners();
    }

    getOrCreateDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    async initializeChat() {
        try {
            const response = await fetch(`${this.apiUrl}/chat/init/${this.deviceId}`);
            const data = await response.json();
            this.addBotMessage(data.message);
            if (data.options) {
                this.addBotMessage(data.options);
            }
        } catch (error) {
            this.addBotMessage('Error connecting to server. Please refresh the page.');
            console.error('Error:', error);
        }
    }

    setupEventListeners() {
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        const proceedPayment = document.getElementById('proceedPayment');
        const cancelPayment = document.getElementById('cancelPayment');

        sendButton.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        proceedPayment.addEventListener('click', () => this.handlePayment());
        cancelPayment.addEventListener('click', () => this.closePaymentModal());
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        try {
            const response = await fetch(`${this.apiUrl}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: this.deviceId,
                    message: message,
                }),
            });

            const data = await response.json();
            
            if (data.menuItems) {
                this.menuItems = data.menuItems;
                this.isSelectingMenu = true;
            } else {
                this.isSelectingMenu = false;
            }

            if (data.order) {
                this.currentOrder = data.order;
            }

            if (data.paymentRequired) {
                this.showPaymentModal();
            }

            this.addBotMessage(data.message);

            if (data.options) {
                this.addBotMessage(data.options);
            }

        } catch (error) {
            this.addBotMessage('Error: Could not send message. Please try again.');
            console.error('Error:', error);
        }
    }

    async handlePayment() {
        const emailInput = document.getElementById('paymentEmail');
        const email = emailInput.value.trim();

        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!this.currentOrder || !this.currentOrder.id) {
            alert('No order found');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/chat/payment/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: this.currentOrder.id,
                    email: email,
                    amount: this.currentOrder.totalAmount,
                }),
            });

            const data = await response.json();
            
            if (data.status && data.data && data.data.authorization_url) {
                // Redirect to Paystack payment page
                window.location.href = data.data.authorization_url;
            } else {
                alert('Failed to initialize payment. Please try again.');
            }
        } catch (error) {
            alert('Error initializing payment. Please try again.');
            console.error('Error:', error);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showPaymentModal() {
        document.getElementById('paymentModal').style.display = 'flex';
    }

    closePaymentModal() {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('paymentEmail').value = '';
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Check for payment callback
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');

    // Initialize chatbot first
    const chatbot = new ChatBot();

    if (reference) {
        // Verify payment
        setTimeout(() => {
            fetch(`http://localhost:3000/payment/verify?reference=${reference}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        chatbot.addBotMessage('✅ Payment successful! Your order has been confirmed and will be processed shortly.');
                        chatbot.addBotMessage('Select 1 to Place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order');
                    } else {
                        chatbot.addBotMessage('❌ Payment verification failed. Please try again.');
                    }
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(err => {
                    console.error('Payment verification error:', err);
                    chatbot.addBotMessage('Error verifying payment. Please contact support.');
                });
        }, 1000);
    }
});
