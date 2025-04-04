// Inicializa AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Animação de elementos ao rolar a página
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .team-member, .hero-img, h1, .lead, .btn');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        
        if (elementPosition < viewportHeight - 100) {
            element.classList.add('animated');
        }
    });
};

// Adiciona classe na navbar ao rolar
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-sm');
        navbar.classList.add('bg-white');
    } else {
        navbar.classList.remove('shadow-sm');
        if (!navbar.classList.contains('navbar-toggler-icon')) {
            navbar.classList.remove('bg-white');
        }
    }
};

// Rolagem suave para as âncoras
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile ao clicar
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Validação do formulário de agendamento
const appointmentForm = document.getElementById('appointment-form');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de envio do formulário
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';
        
        setTimeout(() => {
            // Exibir mensagem de sucesso
            const formFields = this.querySelectorAll('input, textarea, select');
            const formContainer = this.parentElement;
            
            formFields.forEach(field => field.value = '');
            
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = '<strong>Sucesso!</strong> Sua solicitação de agendamento foi enviada. Entraremos em contato em breve!';
            
            formContainer.prepend(successMessage);
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    });
}

// Validação do formulário de avaliação virtual
const virtualAssessmentForm = document.getElementById('virtual-assessment-form');

if (virtualAssessmentForm) {
    virtualAssessmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de envio do formulário
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';
        
        setTimeout(() => {
            this.reset();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('avaliacaoModal'));
            modal.hide();
            
            // Mostrar toast ou alerta
            const toast = document.createElement('div');
            toast.className = 'position-fixed top-0 end-0 p-3';
            toast.style.zIndex = '1070';
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Avaliação Enviada</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Sua solicitação de avaliação foi recebida! Em breve, nossa equipe entrará em contato.
                    </div>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            setTimeout(() => {
                toast.remove();
            }, 5000);
        }, 1500);
    });
}

// Contador de estatísticas
const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            const value = Math.ceil(count);
            counter.innerText = value;
            
            if (count < target) {
                count += increment;
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    });
};

// Calendário de agendamento
if (document.getElementById('booking-calendar')) {
    const calendarEl = document.getElementById('booking-calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        locale: 'pt-br',
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana'
        },
        selectable: true,
        select: function(info) {
            const modal = new bootstrap.Modal(document.getElementById('booking-modal'));
            document.getElementById('modal-selected-date').value = info.startStr;
            document.getElementById('display-selected-date').value = new Date(info.startStr).toLocaleDateString('pt-BR');
            modal.show();
        }
    });
    calendar.render();
}

// Galeria de Antes e Depois
const beforeAfterContainers = document.querySelectorAll('.img-compare');

beforeAfterContainers.forEach(container => {
    const slider = container.querySelector('.slider-handle');
    const overlay = container.querySelector('.img-compare-overlay');
    const overlayImg = overlay.querySelector('img');
    
    // Posição inicial
    positionSlider(50);
    
    // Função para posicionar o slider
    function positionSlider(percent) {
        overlay.style.width = percent + '%';
        slider.style.left = percent + '%';
        overlayImg.style.transform = `translateX(${100 - percent * 2}%)`;
    }
    
    // Arrastar o slider
    let isDragging = false;
    
    slider.addEventListener('mousedown', () => {
        isDragging = true;
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, x / rect.width * 100));
        
        positionSlider(percent);
    });
    
    // Para touch devices
    slider.addEventListener('touchstart', () => {
        isDragging = true;
    });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percent = Math.max(0, Math.min(100, x / rect.width * 100));
        
        positionSlider(percent);
        e.preventDefault();
    });
});

// Controles de acessibilidade
const fontSizeControls = document.querySelectorAll('.font-size-control');
let currentSize = 100;

fontSizeControls.forEach(control => {
    control.addEventListener('click', function() {
        const action = this.getAttribute('data-size');
        
        if (action === 'increase') {
            currentSize += 10;
        } else if (action === 'decrease') {
            currentSize -= 10;
        } else {
            currentSize = 100;
        }
        
        // Limitar tamanho
        currentSize = Math.max(70, Math.min(150, currentSize));
        
        document.body.style.fontSize = `${currentSize}%`;
    });
});

// Controle de alto contraste
const contrastToggle = document.querySelector('.high-contrast-toggle');
if (contrastToggle) {
    contrastToggle.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
    });
}

// Chatbot
const chatToggle = document.getElementById('chat-widget-toggle');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle && chatWidget) {
    chatToggle.addEventListener('click', function() {
        chatWidget.style.display = 'flex';
    });
    
    chatClose.addEventListener('click', function() {
        chatWidget.style.display = 'none';
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message !== '') {
            // Adicionar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user';
            userMessage.innerHTML = `
                <div class="message-content">${message}</div>
                <small class="message-time">Agora</small>
            `;
            chatMessages.appendChild(userMessage);
            
            // Limpar input
            chatInput.value = '';
            
            // Scroll para o final
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simular resposta do bot após um pequeno delay
            setTimeout(function() {
                const botResponse = document.createElement('div');
                botResponse.className = 'chat-message bot';
                botResponse.innerHTML = `
                    <div class="message-content">Obrigado por sua mensagem! Um de nossos atendentes entrará em contato em breve. Ou se preferir, ligue para (11) 99999-9999.</div>
                    <small class="message-time">Agora</small>
                `;
                chatMessages.appendChild(botResponse);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    chatSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Lazy loading de imagens
const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                let lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.add("loaded");
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });
    
    lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
}

// Formulário de fidelidade
const fidelidadeForm = document.getElementById('fidelidade-form');

if (fidelidadeForm) {
    fidelidadeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de envio do formulário
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';
        
        setTimeout(() => {
            this.reset();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('fidelidadeModal'));
            modal.hide();
            
            // Criar mensagem de sucesso
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            successAlert.style.zIndex = '1070';
            successAlert.innerHTML = `
                <strong>Parabéns!</strong> Você foi inscrito no nosso programa de fidelidade.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            document.body.appendChild(successAlert);
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            setTimeout(() => {
                successAlert.remove();
            }, 5000);
        }, 1500);
    });
}

// Iniciar as funções ao carregar a página
handleNavbarScroll();
animateOnScroll();
startCounters();

// Adicionar event listeners
window.addEventListener('scroll', handleNavbarScroll);
window.addEventListener('scroll', animateOnScroll);

// Carrinho de compras
const addToCartButtons = document.querySelectorAll('.product-card .btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Animar botão
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        this.classList.add('btn-success');
        this.disabled = true;
        
        // Atualizar contador do carrinho (se existir)
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const currentCount = parseInt(cartCounter.textContent);
            cartCounter.textContent = currentCount + 1;
        }
        
        // Restaurar botão após um tempo
        setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.disabled = false;
        }, 2000);
    });
});
