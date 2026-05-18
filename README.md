# Gonçalves & Loch — Site Institucional

**Advocacia Especializada em Cobrança Judicial**

Bem-vindo ao repositório do site institucional do escritório **Gonçalves & Loch**. Este é um site responsivo desenvolvido com **HTML5 vanilla, CSS3 puro e JavaScript vanilla** — sem dependências externas.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Características](#características)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Instalação e Setup](#instalação-e-setup)
- [Como Usar](#como-usar)
- [Deploy](#deploy)
- [Customização](#customização)
- [Funcionalidades JavaScript](#funcionalidades-javascript)
- [Checklist de Lançamento](#checklist-de-lançamento)
- [Suporte e Contribuições](#suporte-e-contribuições)

---

## 🎯 Sobre o Projeto

Site institucional completo para o escritório **Gonçalves & Loch**, especializado em cobrança judicial e execução de dívidas. O site apresenta:

- ✅ Header com navegação responsiva
- ✅ Seção Hero com CTAs
- ✅ 6 serviços detalhados
- ✅ 3 planos de contratação
- ✅ Carrossel de depoimentos (com autoplay)
- ✅ Timeline de 4 passos
- ✅ FAQ com accordion interativo
- ✅ Formulário de contato com validação
- ✅ Integração com Google Maps
- ✅ Footer completo com links legais

---

## ✨ Características

### Técnicas

- **100% Vanilla**: HTML5 + CSS3 + JavaScript (sem React, Vue, Tailwind, Bootstrap)
- **Responsivo**: Desktop (1024px+), Tablet (768px), Mobile (320px)
- **Acessível**: WCAG 2.1 AA (contraste, labels, keyboard navigation)
- **SEO-Ready**: Meta tags, H1 único, headings hierárquicos, structured data
- **Performance**: CSS/JS minificáveis, imagens otimizadas
- **Moderno**: CSS Variables, Flexbox/Grid, CSS Animations

### Funcionais

- 🎠 **Carrossel de Depoimentos**: autoplay, navegação, indicadores
- 📑 **FAQ Accordion**: toggle suave, apenas um item aberto
- 📝 **Formulário Inteligente**: validação em tempo real, localStorage
- 📱 **Menu Mobile**: hamburger toggle, scroll suave
- 🔍 **ScrollSpy**: destaca seção ativa no menu
- 🌙 **Pronto para Dark Mode**: variables CSS para fácil customização

---

## 📁 Estrutura de Arquivos

```
projeto-advocacia-gonçalves-loch/
├── index.html                    # Página principal (semântica HTML5)
├── css/
│   ├── styles.css               # Estilos base, layout, responsividade
│   └── components.css           # Componentes reutilizáveis (botões, forms, etc.)
├── js/
│   ├── utils.js                 # Funções auxiliares (DOM, validação, storage)
│   ├── carousel.js              # Carrossel de depoimentos
│   ├── accordion.js             # FAQ accordion
│   ├── form-handler.js          # Validação e manipulação do formulário
│   └── main.js                  # Orquestrador (menu mobile, scroll, analytics)
├── assets/
│   └── images/                  # Imagens de placeholder
├── .gitignore
├── README.md                    # Este arquivo
└── package.json                 # (Opcional) para npm scripts
```

---

## 🚀 Instalação e Setup

### Opção 1: Executar Localmente

1. **Clone o repositório** (ou faça download do ZIP):
   ```bash
   git clone https://github.com/seu-usuario/projeto-advocacia-gonçalves-loch.git
   cd projeto-advocacia-gonçalves-loch
   ```

2. **Abra em um servidor local** (necessário para testar localStorage e CORS):
   
   **Opção A: Python 3**
   ```bash
   python3 -m http.server 8000
   # Acesse: http://localhost:8000
   ```

   **Opção B: Node.js**
   ```bash
   npx http-server
   # Acesse: http://localhost:8080
   ```

   **Opção C: VS Code Live Server**
   - Instale a extensão "Live Server" no VS Code
   - Clique em "Go Live" no canto inferior direito

3. **Abra o navegador** e acesse `http://localhost:8000`

---

## 💻 Como Usar

### Estrutura HTML

O `index.html` contém todas as seções do site:

```html
<header>           <!-- Navegação fixa -->
<main>
  <section class="hero">           <!-- Hero com CTAs -->
  <section class="why-choose-us">  <!-- 3 bullets -->
  <section class="services">       <!-- 6 serviços -->
  <section class="plans">          <!-- 3 planos -->
  <section class="testimonials">   <!-- Carrossel -->
  <section class="process">        <!-- 4 passos -->
  <section class="faq">            <!-- Accordion -->
  <section class="contact">        <!-- Formulário + mapa -->
</main>
<footer>            <!-- Links legais, OAB, redes sociais -->
```

### Modificar Conteúdo

1. **Textos**: Edite diretamente em `index.html`
2. **Cores**: Altere as variables CSS em `css/styles.css`:
   ```css
   :root {
       --color-primary: #0B3D91;      /* Azul primário */
       --color-cta: #1E90FF;           /* Azul CTA */
       --color-bg-light: #F5F7FA;      /* Fundo claro */
   }
   ```
3. **Imagens**: Substitua URLs em `src=""` por caminhos locais ou URLs diferentes
4. **Telefone/Email**: Atualize em `header`, `footer` e `contact section`

---

## 🌐 Deploy

### Netlify (Recomendado)

1. **Conecte seu repositório GitHub ao Netlify**:
   - Acesse [netlify.com](https://app.netlify.com)
   - Clique em "New site from Git"
   - Selecione seu repositório

2. **Configure**:
   - Build command: (deixe em branco — é um site estático)
   - Publish directory: `.` (raiz do repositório)

3. **Deploy automático**:
   - Cada push para `main` redeploya automaticamente

### Vercel

1. **Acesse [vercel.com](https://vercel.com)** e clique "New Project"
2. **Importe o repositório GitHub**
3. **Clique Deploy** — pronto!

### GitHub Pages

1. **Configure no repositório**:
   - Settings → Pages → Source → `main` → `/root`

2. **Acesse** `https://seu-usuario.github.io/projeto-advocacia-gonçalves-loch`

### Servidor Próprio (VPS/Shared Hosting)

1. **Faça upload dos arquivos** via FTP/SFTP
2. **Não é necessário build ou server-side** — é 100% estático
3. **Acesse a URL do domínio**

---

## 🎨 Customização

### Paletas de Cores Alternativas

**Paleta 2 - Autoridade Sóbria (Grafite + Dourado)**
```css
--color-primary: #2B2F36;
--color-cta: #C59D5F;
--color-bg-light: #FBFBFA;
--color-text: #0D0D0D;
```

**Paleta 3 - Confiança Humana (Verde-azulado + Coral)**
```css
--color-primary: #1F7A6C;
--color-cta: #FF7A59;
--color-bg-light: #FAF7F3;
--color-text: #1C1C1C;
```

### Adicionar Nova Seção

1. **No HTML**, crie uma nova `<section>`:
   ```html
   <section class="nova-secao" id="nova-secao">
       <div class="container">
           <h2>Título da Seção</h2>
           <!-- Conteúdo -->
       </div>
   </section>
   ```

2. **No CSS**, adicione estilos:
   ```css
   .nova-secao {
       padding: var(--spacing-2xl) 0;
   }
   ```

3. **No menu**, adicione o link:
   ```html
   <li><a href="#nova-secao" class="nav-link">Nova Seção</a></li>
   ```

### Adicionar Novo Componente JavaScript

1. **Crie `js/novo-componente.js`**:
   ```javascript
   class NovoComponente {
       constructor(selector) {
           this.element = DOM.query(selector);
           this.init();
       }
       init() {
           // Lógica de inicialização
       }
   }

   // Inicializar no DOMContentLoaded
   document.addEventListener('DOMContentLoaded', () => {
       new NovoComponente('#novo-componente');
   });
   ```

2. **Inclua em `index.html`** antes de `main.js`:
   ```html
   <script src="js/novo-componente.js"></script>
   ```

---

## 🔧 Funcionalidades JavaScript

### 1. Carrossel de Depoimentos (`carousel.js`)

```javascript
const carousel = new Carousel('#testimonialCarousel', {
    autoPlay: true,              // Autoplay ativado
    autoPlayInterval: 8000,      // 8 segundos entre slides
    showIndicators: true,        // Mostrar dots
    indicatorsSelector: '#carouselIndicators'
});

// Métodos
carousel.next();                 // Próximo slide
carousel.prev();                 // Slide anterior
carousel.goToSlide(2);           // Ir para slide específico
```

### 2. FAQ Accordion (`accordion.js`)

```javascript
const accordion = new Accordion('#faqAccordion', {
    allowMultiple: false,        // Apenas um item aberto
    animationSpeed: 300
});

// Métodos
accordion.openItem(item);        // Abrir item
accordion.closeItem(item);       // Fechar item
accordion.openAll();             // Abrir todos
accordion.closeAll();            // Fechar todos
```

### 3. Formulário de Contato (`form-handler.js`)

```javascript
const form = new FormHandler('#contactForm');

// Métodos
form.validateForm();             // Validar todos os campos
form.collectFormData();          // Coletar dados do formulário
form.getStoredForms();           // Obter formulários armazenados (localStorage)
form.clearStoredForms();         // Limpar localStorage

// Debug: Ver formulários armazenados
window.getStoredForms();         // Exibe no console
```

### 4. Utilidades (`utils.js`)

```javascript
// DOM
DOM.query('#elemento');
DOM.queryAll('.elementos');
DOM.on('#btn', 'click', callback);
DOM.addClass('#elem', 'classe');
DOM.removeClass('#elem', 'classe');

// Validação
Validation.isEmail('email@test.com');
Validation.isPhone('(11) 99999-9999');
Validation.isCPF('123.456.789-00');
Validation.isEmpty('');

// Storage
Storage.set('chave', { dados: 'valor' });
Storage.get('chave');
Storage.remove('chave');

// Scroll
ScrollHelper.smoothScroll('#secao', 80);
ScrollHelper.scrollToTop();
ScrollHelper.isInViewport(element);

// String
StringUtils.capitalize('texto');
StringUtils.slugify('Meu Texto');
StringUtils.formatCurrency(1000);      // R$ 1.000,00
StringUtils.formatPhone('11999999999'); // (11) 99999-9999
StringUtils.formatCPF('12345678901');   // 123.456.789-01
```

### 5. Main (`main.js`)

```javascript
// Classes automaticamente inicializadas:
// - MobileMenu         (hamburger, smooth close)
// - SmoothScroller     (smooth scroll em links #)
// - ScrollSpy          (destaca menu ativo)
// - ThemeToggle        (suporte a tema escuro)
// - Analytics          (tracking de eventos)

// Usar Analytics
Analytics.trackEvent('meu_evento', { propriedade: 'valor' });
Analytics.trackPageView();
Analytics.trackFormSubmit('formulario_contato');
Analytics.trackCTA('Botão CTa');
```

---

## 📦 Dados do Formulário

### Armazenamento (localStorage)

Todos os formulários enviados são salvos em **localStorage** com a chave `contactForms`:

```javascript
// Ver dados no console (F12 → Console)
window.getStoredForms();

// Estrutura de cada envio:
{
    name: "João Silva",
    company: "Empresa XYZ",
    phone: "(61) 99999-8888",
    email: "joao@empresa.com",
    document: "123.456.789-01",
    creditValue: "R$ 50.000,00",
    message: "Descrição do caso...",
    timestamp: "2024-05-15T10:30:00.000Z",
    userAgent: "Mozilla/5.0..."
}
```

### Envio para Email (Futuro)

Para integrar com email real, conecte um serviço:

- **Netlify Forms** (automático)
- **Formspree** (adicione `action="https://formspree.io/f/SEU_ID"`)
- **Firebase** (backend serverless)
- **EmailJS** (JavaScript puro)

---

## ✅ Checklist de Lançamento

- [ ] **Conteúdo**
  - [ ] Substituir depoimentos de exemplo por reais
  - [ ] Verificar todos os textos (ortografia, gramática)
  - [ ] Atualizar número OAB/CNPJ no footer
  - [ ] Atualizar endereço (contact section e mapa)

- [ ] **Imagens**
  - [ ] Substituir placeholders por imagens reais
  - [ ] Comprimir imagens (WebP, JPG otimizado)
  - [ ] Verificar alt texts

- [ ] **Funcionalidade**
  - [ ] Testar formulário em todos os navegadores
  - [ ] Verificar localStorage (F12 → Application)
  - [ ] Testar carrossel em mobile
  - [ ] Testar FAQ accordion em touch
  - [ ] Testar menu mobile

- [ ] **Responsividade**
  - [ ] Testar em mobile (320px)
  - [ ] Testar em tablet (768px)
  - [ ] Testar em desktop (1024px+)
  - [ ] Testar em navegadores: Chrome, Firefox, Safari, Edge

- [ ] **Acessibilidade**
  - [ ] Verificar contraste (min. 4.5:1)
  - [ ] Testar keyboard navigation (Tab, Enter, Esc)
  - [ ] Verificar labels em inputs
  - [ ] Testar com screen reader (NVDA, JAWS)

- [ ] **SEO**
  - [ ] Verificar title tag
  - [ ] Verificar meta description
  - [ ] Verificar H1 único
  - [ ] Verificar headings hierárquicos
  - [ ] Submeter ao Google Search Console

- [ ] **Performance**
  - [ ] Executar Lighthouse (Google DevTools)
  - [ ] Verificar Core Web Vitals
  - [ ] Minificar CSS/JS (produção)
  - [ ] Testar em conexão lenta (throttle)

- [ ] **Segurança**
  - [ ] Verificar HTTPS
  - [ ] Revisar política de privacidade
  - [ ] Revisar termos de uso
  - [ ] Verificar RGPD compliance (se aplicável)

- [ ] **Deploy**
  - [ ] Fazer commit final
  - [ ] Push para `main`
  - [ ] Verificar deploy automático (Netlify/Vercel)
  - [ ] Testar URL pública

---

## 🐛 Troubleshooting

### Formulário não salva dados

1. Verificar se localStorage está habilitado (F12 → Application → LocalStorage)
2. Verificar console para erros (F12 → Console)
3. Testar: `Storage.set('test', 'data'); Storage.get('test');`

### Carrossel não funciona

1. Verificar se `carousel.js` está carregado (F12 → Sources)
2. Verificar console para erros
3. Verificar se `#testimonialCarousel` existe no HTML

### Menu mobile não abre

1. Verificar se `.menu-toggle` e `.nav-menu` existem
2. Verificar se `main.js` está carregado
3. Verificar console para erros

### Imagens não carregam

1. Verificar se URLs são válidas
2. Verificar console para erros CORS
3. Usar imagens do mesmo domínio ou servidor com CORS habilitado

### Estilos não aplicados

1. Verificar se `styles.css` e `components.css` estão carregados (F12 → Sources)
2. Limpar cache do navegador (Ctrl+Shift+Delete)
3. Verificar seletores CSS (f12 → Elements → Styles)

---

## 📞 Contato e Suporte

- **Site**: [gonçalveseloch.com.br](https://gonçalveseloch.com.br)
- **Telefone**: +55 61 9999-8888
- **Email**: contato@gonçalveseloch.com.br
- **OAB**: DF Nº [INSERIR]

---

## 📄 Licença

Este projeto é propriedade do escritório **Gonçalves & Loch**. Todos os direitos reservados.

---

## 🙏 Créditos

- **Design**: Baseado em best practices de UX/UI para sites institucionais
- **Tecnologia**: HTML5, CSS3, JavaScript Vanilla
- **Imagens**: Placeholders do Unsplash/Pexels

---

## 🎯 Roadmap Futuro

- [ ] Dark mode (CSS variables já preparadas)
- [ ] Multilíngue (PT/EN)
- [ ] Blog integrado
- [ ] Chat ao vivo
- [ ] Sistema de agendamento
- [ ] CMS headless (Strapi/Sanity)
- [ ] PWA (Progressive Web App)
- [ ] Integração com WhatsApp

---

**Desenvolvido com ❤️ para Gonçalves & Loch**

*Última atualização: 15 de maio de 2026*
