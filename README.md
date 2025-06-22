# Gestor de Pagos con NestJS, Stripe y PayPal

Este proyecto es un backend desarrollado con NestJS y TypeScript para gestionar pagos integrando Stripe y PayPal.  
Incluye autenticación, manejo de usuarios, pagos, webhooks para confirmación de eventos y configuración centralizada.

---

## 📦 Estructura del Proyecto

- `config/` — Gestión de configuración y variables de entorno.
- `users/` — Módulo para gestión de usuarios (registro, login, perfil).
- `auth/` — Autenticación JWT y guards de seguridad.
- `payments/` — Lógica para creación y gestión de pagos con Stripe y PayPal, con sus servicios providers.
- `webhooks/` — Endpoints para recibir notificaciones externas de Stripe y PayPal (webhooks).

---

## 🚀 Tecnologías usadas

- [NestJS](https://nestjs.com/) (Framework backend)
- [TypeScript](https://www.typescriptlang.org/)
- [Stripe SDK](https://stripe.com/docs/api)
- [PayPal Checkout SDK](https://developer.paypal.com/docs/api/overview/)
- [JWT](https://jwt.io/) para autenticación
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) para configuración
- [Joi](https://joi.dev/) para validación de variables de entorno
- Base de datos (a elegir: PostgreSQL, MongoDB, MySQL, etc.)

---

## ⚙️ Configuración

1. Copiar el archivo `.env.example` a `.env` y completar con tus claves:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
JWT_SECRET=...
PORT=3000
