# Portfolio — Contenido reescrito (Fase 3)
### samueltabares.com · Samuel Tabares León · 2026-06-07

> **Cómo usar:** este documento es el **contenido** nuevo, sección por sección, en ES y EN. El diseño/código de tu web se mantiene — solo reemplazas los textos. Donde digo "NUEVO" es una sección a crear; donde digo "REEMPLAZAR" ya existe.
> **Regla aplicada:** este contenido NO es idéntico al README de GitHub (la web convence con prosa; GitHub prueba con proyectos). Voz: cercana-profesional, dual-layer, voseo paisa mantenido en ES.

---

## ⚠️ FIX TÉCNICO PRIORITARio (antes que el contenido)

Tu `<head>` apunta al dominio viejo de Vercel. Esto perjudica tu SEO porque Google trata la URL vieja como la oficial. Corregir en el HTML:

```html
<!-- ANTES (mal) -->
<link rel="canonical" href="https://portfolio-kappa-blue-50.vercel.app/" />
<meta property="og:url" content="https://portfolio-kappa-blue-50.vercel.app/" />
<meta property="og:image" content="https://portfolio-kappa-blue-50.vercel.app/images/og-image.jpg" />
<meta name="twitter:url" content="https://portfolio-kappa-blue-50.vercel.app/" />
<meta name="twitter:image" content="https://portfolio-kappa-blue-50.vercel.app/images/og-image.jpg" />

<!-- DESPUÉS (correcto) -->
<link rel="canonical" href="https://samueltabares.com/" />
<meta property="og:url" content="https://samueltabares.com/" />
<meta property="og:image" content="https://samueltabares.com/images/og-image.jpg" />
<meta name="twitter:url" content="https://samueltabares.com/" />
<meta name="twitter:image" content="https://samueltabares.com/images/og-image.jpg" />
```

### Meta tags SEO (REEMPLAZAR)
```html
<!-- ES -->
<title>Samuel Tabares León | Software Engineer & Builder · AI Agents</title>
<meta name="description" content="Software engineer y builder. Construyo agentes de IA y backends a medida que automatizan problemas cotidianos. Python, Rust, sistemas multi-agente y automatización." />
<meta name="keywords" content="AI agents, agentes de IA, software engineer, backend developer, automatización, custom AI, Python, Rust, LLM, RAG, multi-agent systems, Django, microservicios, Colombia, builder" />
```

---

## 1. HERO (REEMPLAZAR)

### ES
**Línea superior (rol):** Software Engineer & Builder
**Título (h1):** Hola, soy Samuel Tabares León
**Tagline (sub-hero):**
> Convierto problemas cotidianos en **agentes de IA y backends a medida** que automatizan lo que otros todavía hacen a mano.

**Descripción hero:**
> Diseño y construyo **agentes de IA, sistemas multi-agente y backends personalizados** — soluciones hechas a medida, no plantillas. Mi foco hoy es la **IA aplicada**: agentes autónomos, automatización, RAG y LLMs, con una base sólida de ingeniería backend en **Python y Rust**. Si tenés un problema real que vale la pena resolver con tecnología nueva, hablemos.

### EN
**Top line (role):** Software Engineer & Builder
**Title (h1):** Hi, I'm Samuel Tabares León
**Tagline:**
> I turn everyday problems into **custom AI agents and backends** that automate what others still do by hand.

**Hero description:**
> I design and build **AI agents, multi-agent systems and custom backends** — tailored solutions, not templates. My focus today is **applied AI**: autonomous agents, automation, RAG and LLMs, on a solid backend foundation in **Python and Rust**. If you have a real problem worth solving with new tech, let's talk.

**Links (mantener):** LinkedIn · GitHub · Platzi · ORCID · [Descargar CV]

---

## 2. SOBRE MÍ / ABOUT (REEMPLAZAR)

### ES
> Soy software engineer y **builder**. Construyo **agentes de IA y sistemas backend a medida** que automatizan procesos manuales y resuelven problemas concretos. Mi sweet spot: soluciones 100% personalizadas — agentes autónomos self-hosted, sistemas multi-agente e integraciones complejas — no plantillas ni código que se rompe en seis meses.
>
> Voy más allá del agente "básico" de n8n: trabajo con frameworks de agentes autónomos totalmente personalizables (como OpenClaw) y orquestación multi-agente. Y todo eso lo sostengo con ingeniería backend real — he construido desde un **bot de pedidos en producción escrito en Rust** hasta **arquitecturas de microservicios** y **backends Django con 20+ endpoints**. Cada proyecto, un problema real, no una demo.
>
> Trabajo de forma **directa y enfocada**: pocas reuniones, mucho código, decisiones documentadas. Aprendo rápido y me adapto a lo que el problema necesite. Si querés algo **construido bien la primera vez**, esa es la idea.

### EN
> I'm a software engineer and **builder**. I create **custom AI agents and backend systems** that automate manual work and solve concrete problems. My sweet spot: 100% tailored solutions — self-hosted autonomous agents, multi-agent systems and complex integrations — not templates, not code that breaks in six months.
>
> I go beyond the "basic" n8n agent: I work with fully customizable autonomous agent frameworks (like OpenClaw) and multi-agent orchestration. And I back it all with real backend engineering — I've built everything from a **production WhatsApp ordering bot written in Rust** to **microservice architectures** and **Django backends with 20+ endpoints**. Every project, a real problem, not a demo.
>
> I work **directly and focused**: few meetings, lots of code, documented decisions. I learn fast and adapt to whatever the problem needs. If you want something **built right the first time**, that's the idea.

---

## 3. COMPETENCIAS PERSONALES / SOFT SKILLS (REEMPLAZAR)

> Elimina el framing viejo. Reemplaza por:

| ES | EN |
|---|---|
| Resolución de problemas | Problem-solving |
| Aprendizaje rápido | Fast learner |
| Pensamiento crítico | Critical thinking |
| Alta adaptabilidad | Highly adaptive |
| Visión de producto | Product thinking |

---

## 4. HABILIDADES TÉCNICAS / TECHNICAL SKILLS (REEMPLAZAR COMPLETO)

> Reorganizado por foco real. **Quita:** phpMyAdmin, XAMPP, "AWS/Azure" y "Servidores" como skills (eran ruido). **Añade:** Rust, AI/agentes, LLMs/RAG.

### IA & Agentes (NUEVO — categoría principal, primera)
- Agentes de IA / Autonomous agents
- Sistemas multi-agente / Multi-agent systems
- LLMs (OpenAI API, modelos locales / local LLMs)
- RAG (Retrieval-Augmented Generation)
- OpenClaw · Hermes (agentes self-hosted)
- Automatización / Automation (n8n avanzado)
- Pinecone (vector DB)

### Lenguajes / Languages
- Python
- Rust
- TypeScript
- JavaScript (ES6+)

### Backend
- Django · Django REST Framework
- FastAPI · Node.js/Express
- REST APIs · JWT · Swagger
- Arquitectura: microservicios, hexagonal, multicapa, cliente-servidor

### Frontend
- React.js
- HTML5 · CSS3
- Tailwind CSS · Bootstrap 5
- Diseño responsive · Accesibilidad

### Bases de datos / Databases
- PostgreSQL · SQL
- SQLite · MySQL

### DevOps & Herramientas / Tools
- Docker
- Railway · Vercel
- Git & GitHub · Postman · VS Code

---

## 5. MI CAMINO DE DESARROLLO / MY PATH (REEMPLAZAR)

### Habilidades Dominadas / Mastered
- Python / Django / Django REST
- Backend & arquitectura (microservicios, hexagonal, multicapa)
- Integración de APIs de IA (OpenAI) / AI API integration
- RESTful APIs · PostgreSQL · Docker
- JavaScript / React · TypeScript

### Fortaleciendo Actualmente / Currently Strengthening
- Agentes de IA autónomos & multi-agente / Autonomous & multi-agent AI
- Rust (axum, tokio) para backend & sistemas
- RAG, LLMs locales & vector databases (Pinecone)
- OpenClaw / frameworks de agentes self-hosted
- Machine Learning aplicado / Applied ML
- Ruby *(en aprendizaje / learning)*

### Próximos Objetivos / Next Goals
- Productos de IA como servicio (Agents-as-a-Service / SaaS)
- Integración IA × Web3 / blockchain
- Profundización en ML & fine-tuning
- Cloud avanzado / Advanced cloud

### Mi Visión Profesional / Professional Vision
**ES:** Crear algo nuevo que resuelva los problemas que el avance tecnológico acelerado está trayendo. Me proyecto hacia donde la tecnología vaya marcando el rumbo — igual que me moví hacia los agentes de IA cuando emergieron. Quiero construir productos que combinen IA, automatización e ingeniería sólida para hacerle la vida más fácil a las personas y ofrecer lo que nadie más ofrece.

**EN:** To build something new that solves the problems brought by accelerating technology. I move toward wherever tech is heading — just as I moved into AI agents when they emerged. I want to build products that combine AI, automation and solid engineering to make people's lives easier and offer what nobody else does.

---

## 6. PROYECTOS Y EXPERIENCIA / PROJECTS (REORGANIZAR — orden nuevo)

> **Orden nuevo:** AI primero (héroe), luego Trabix, luego fundamentos. Los 2 AI sin demo/código (privados), con badge "En construcción / In progress".

### 🌟 Proyecto 1 — SaaS de IA Personal Multi-Modelo (NUEVO · En construcción)
**Tecnologías:** Python · LLMs · RAG · Pinecone · Integraciones API
**Badge:** En construcción / In progress · Privado
**ES — El problema:** Las personas usan varios modelos de IA dispersos, sin memoria entre ellos y sin conexión a sus propias herramientas.
**ES — La solución:** Un asistente de IA personal donde hablás con distintos modelos en un solo lugar, con memoria persistente e integración a tus apps (correo, calendario, documentos). Genera PDFs y correos, ajusta tu calendario y recopila información por vos. Un SaaS que centraliza tu IA.
**EN — Problem:** People use several scattered AI models, with no memory between them and no connection to their own tools.
**EN — Solution:** A personal AI assistant where you talk to multiple models in one place, with persistent memory and integration to your apps (email, calendar, documents). It generates PDFs and emails, adjusts your calendar and gathers information for you. A SaaS that centralizes your AI.

### 🌟 Proyecto 2 — Sistema Multi-Agente (NUEVO · En construcción)
**Tecnologías:** Python · OpenClaw · Orquestación multi-agente
**Badge:** En construcción / In progress · Privado
**ES — El problema:** Los negocios de un sector necesitan automatizar tareas distintas que un solo agente no cubre bien.
**ES — La solución:** Un sistema de agentes de IA especializados que se comunican entre sí, cada uno dedicado a una función concreta. Construido para una vertical real (oficios/tradies en Australia). Demuestra orquestación multi-agente: agentes que colaboran, se pasan tareas y resuelven en conjunto.
**EN — Problem:** Businesses in a sector need to automate different tasks that a single agent can't cover well.
**EN — Solution:** A system of specialized AI agents that communicate with each other, each dedicated to a specific function. Built for a real vertical (tradies in Australia). It demonstrates multi-agent orchestration: agents that collaborate, hand off tasks and solve together.

### ⭐ Proyecto 3 — Trabix (NUEVO en web · destacado público)
**Tecnologías:** Rust · axum · tokio · PostgreSQL · Docker · Railway · WhatsApp API
**Métricas:** 90 commits · 8 releases · En producción
**Badge:** En producción / In production
**ES:** Bot de pedidos por WhatsApp para un negocio real, escrito en **Rust**. Sistema completo, no demo: máquina de estados de conversación, persistencia en PostgreSQL, flujo de pedidos y checkout, handoff a asesor, timers con recuperación de timeouts, y un simulador local que corre el mismo runtime de producción. Dockerizado y desplegado en Railway.
**EN:** WhatsApp ordering bot for a real business, written in **Rust**. A full system, not a demo: conversation state machine, PostgreSQL persistence, order & checkout flow, advisor handoff, timers with timeout recovery, and a local simulator running the same production runtime. Dockerized and deployed on Railway.
[Código / Code → github.com/Samuel-Tabares/trabix-bot]

### Proyecto 4 — Backend Plataforma Veterinaria (MANTENER)
> Mantener texto actual. Métricas: 8 módulos · 20+ endpoints · 15+ modelos. Python/Django/DRF/PostgreSQL/JWT.

### Proyecto 5 — Sistema Perfumería Microservicios (MANTENER)
> Mantener. 4 microservicios · 30+ endpoints. Java/Spring + FastAPI + Node + Docker.

### Proyecto 6 — Importa Colombia (MANTENER)
> Mantener. React + Django REST + Bootstrap 5.

### Proyecto 7 — Portafolio Web (MANTENER, mover al final)
> Mantener. HTML/CSS/JS · 95+ perf · bilingüe.

---

## 7. EDUCACIÓN / EDUCATION (REEMPLAZAR — limpiar)

> **Quitar el B2 Inglés de aquí** (va solo en Idiomas). Education = solo el grado.

### ES
**INGENIERÍA DE SOFTWARE**
Corporación Universitaria Empresarial Alexander von Humboldt
Ene 2024 – Actualidad · 5º semestre
Armenia, Quindío — Colombia

### EN
**SOFTWARE ENGINEERING**
Corporación Universitaria Empresarial Alexander von Humboldt
Jan 2024 – Present · 5th semester
Armenia, Quindío — Colombia

---

## 8. IDIOMAS / LANGUAGES (MANTENER — aquí sí va el inglés)
- Español / Spanish — Nativo / Native
- Inglés / English — B2, certificado (American School Way) [Ver certificado]
- Alemán / German — En proceso / In progress (A1)

---

## 9. CONTACTO / CONTACT (REEMPLAZAR — quitar precios)

### ES
**Título:** Trabajemos juntos
**Texto:**
> Disponible para **proyectos freelance**: agentes de IA, automatización, backends a medida e integraciones. Contame tu proyecto y te respondo en menos de 24h con un primer estimado claro de alcance y tiempos. Si encaja, encaja.

**Formulario — campos:**
- Email
- Asunto
- **Tipo de proyecto:** Agente de IA / automatización · Backend / API a medida · Integración de IA · MVP desde cero · Otro
- ~~Presupuesto~~ ← **ELIMINAR este campo**
- WhatsApp
- (honeypot Website — mantener oculto)

### EN
**Title:** Let's work together
**Text:**
> Available for **freelance projects**: AI agents, automation, custom backends and integrations. Tell me about your project and I'll reply within 24h with a clear first estimate of scope and timeline. If it fits, it fits.

**Form — fields:**
- Email
- Subject
- **Project type:** AI agent / automation · Custom backend / API · AI integration · MVP from scratch · Other
- ~~Budget~~ ← **REMOVE**
- WhatsApp

---

## 10. TESTIMONIOS / REFERENCIAS / ACTIVIDAD GITHUB (MANTENER)
> Sin cambios. Funcionan bien.

---

## Resumen de cambios

| Sección | Acción |
|---|---|
| `<head>` canonical/OG | 🔴 FIX: apuntar a samueltabares.com |
| Meta title/desc/keywords | Reescritos (AI-first) |
| Hero | Reescrito: builder + AI agents + tagline |
| About | Reescrito: AI agents, OpenClaw, Trabix |
| Soft skills | Reframe (sin "perfeccionista") |
| Technical skills | Reorganizado: IA/agentes primero; fuera phpMyAdmin/XAMPP/AWS-Azure; +Rust |
| Roadmap | Actualizado: agentes/SaaS/IA×Web3 |
| Proyectos | AI primero (2 nuevos) + Trabix + fundamentos |
| Educación | Limpia: solo el grado (inglés → Idiomas) |
| Contacto | Sin precios; tipos de proyecto AI-first |
| Diseño / testimonios / activity | Sin cambios |
