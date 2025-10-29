/*

Tooplate 2143 Inner Peace

https://www.tooplate.com/view/2143-inner-peace

Free HTML CSS Template

*/

// JavaScript Document

// Mobile menu toggle
        function toggleMenu() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (menuToggle && navLinks) {
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            }
        }

        // Close mobile menu when clicking a link
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const menuToggle = document.querySelector('.menu-toggle');
                    const navLinksContainer = document.querySelector('.nav-links');
                    if (menuToggle && navLinksContainer) {
                        menuToggle.classList.remove('active');
                        navLinksContainer.classList.remove('active');
                    }
                });
            });

            // Active menu highlighting
            const sections = document.querySelectorAll('section');
            const menuLinks = document.querySelectorAll('.nav-link');

            if (sections.length && menuLinks.length) {
                window.addEventListener('scroll', () => {
                    let current = '';
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.clientHeight;
                        if (window.scrollY >= (sectionTop - 200)) {
                            current = section.getAttribute('id');
                        }
                    });

                    menuLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href && href.slice(1) === current) {
                            link.classList.add('active');
                        }
                    });
                });
            }

            // Smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href && href !== '#') {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });

            // Header scroll effect
            const header = document.querySelector('header');
            if (header) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 100) {
                        header.style.background = 'rgba(255, 255, 255, 0.98)';
                        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
                    } else {
                        header.style.background = 'rgba(255, 255, 255, 0.95)';
                        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
                    }
                });
            }

            // Tab functionality
            window.showTab = function(tabName) {
                const tabs = document.querySelectorAll('.tab-content');
                const buttons = document.querySelectorAll('.tab-btn');
                
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                const targetTab = document.getElementById(tabName);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
                
                // Find and activate the clicked button
                buttons.forEach(btn => {
                    if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
                        btn.classList.add('active');
                    }
                });
            };

            // Form submission handler
            const contactForm = document.querySelector('.contact-form form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Thank you for reaching out! We will get back to you soon.');
                    e.target.reset();
                });
            }


             // Função de login para redirecionar usuários com base no email
            window.handleLogin = function(event) {
                event.preventDefault();
                const email = document.getElementById('email').value;
                const senha = document.getElementById('password').value;

                // Simulação de autenticação (substitua por sua lógica real ou API)
                if (email === "dentista@exemplo.com" && senha === "1234") {
                    window.location.href = "pagina_dentista.html";
                } else if (email === "paciente@exemplo.com" && senha === "1234") {
                    window.location.href = "pagina_paciente.html";
                } else if (email === "atendente@exemplo.com" && senha === "1234") {
        window.location.href = "pagina_atendente.html";
    }else {
                    alert("Usuário ou senha incorretos");
                }
            };
        });

        // Função para alternar entre Login e Cadastro
function toggleCadastroForm() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Alterna entre os dois formulários
    if (signupForm.style.display === "none" || signupForm.style.display === "") {
        loginForm.style.display = "none";    // Esconde o formulário de login
        signupForm.style.display = "block";  // Exibe o formulário de cadastro
    } else {
        signupForm.style.display = "none";   // Esconde o formulário de cadastro
        loginForm.style.display = "block";   // Exibe o formulário de login
    }
}

// Função de Login (simulada)
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    if (email === "dentista@exemplo.com" && senha === "1234") {
        window.location.href = "pagina_dentista.html";
    } else if (email === "paciente@exemplo.com" && senha === "1234") {
        window.location.href = "pagina_paciente.html";
    } else {
        alert("Usuário ou senha incorretos");
    }
}

// Função de Cadastro (simulada)
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email_signup').value;
    const senha = document.getElementById('password_signup').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (senha === confirmPassword) {
        alert(`Cadastro bem-sucedido! Bem-vindo, ${name}`);
        window.location.href = "pagina_paciente.html"; // Ou outro redirecionamento
    } else {
        alert("As senhas não coincidem. Tente novamente.");
    }
}

        