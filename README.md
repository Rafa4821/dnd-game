# 🎲 Sangrebruma - Campaña D&D Multiplayer sin DM

Sistema de campaña narrativa D&D 5E sin Dungeon Master, optimizado para 2-6 jugadores simultáneos con autenticación persistente y progreso guardado.

## 🎯 Características Implementadas

- ✅ **Sin DM**: Sistema de 16 nodos narrativos predefinidos con IA de monstruos
- ✅ **2-6 jugadores**: Salas multiplayer con códigos únicos
- ✅ **Progreso guardado**: Autenticación Email/Password con Firebase
- ✅ **Presencia en tiempo real**: Indicadores online/offline con Realtime Database
- ✅ **6 personajes pregenerados**: Nivel 3, balanceados para novatos
- ✅ **Motor de dados real**: Basado en `crypto.getRandomValues()` con ventaja/desventaja
- ✅ **Combate táctico**: Sistema por turnos con iniciativa, acciones SRD 5.1 y IA
- ✅ **Basado en SRD 5.1**: Reglas oficiales de D&D (CC BY 4.0)
- ✅ **Tema gótico oscuro**: UI responsive con TailwindCSS

## 🏗️ Stack Técnico

- **Frontend**: React 18 + Vite 5 + TypeScript
- **Estilos**: TailwindCSS + Lucide Icons
- **Backend**: Firebase (Auth, Firestore, Realtime DB, Storage)
- **Hosting**: Vercel
- **State**: Zustand (5 stores)
- **Validación**: Zod

## 📋 Estado del Proyecto

**Versión:** 1.0.0 (Release)  
**Estado:** ✅ 7/7 paquetes completados - **PROYECTO COMPLETO**

### ✅ Completado
- Paquete 0: Setup base (React + Vite + TypeScript + TailwindCSS)
- Paquete 1: Firebase + Autenticación Email/Password
- Paquete 2: Salas multiplayer con códigos
- Paquete 3: Sistema de presencia online/offline
- Paquete 4: Creador de personajes (6 pregens)
- Paquete 5: Motor de dados + Reglas SRD 5.1
- Paquete 6: Runtime de campaña (16 nodos Sangrebruma)
- **Paquete 7: Sistema de combate táctico por turnos** ⭐ NEW

## 🚀 Quick Start

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase
1. Crea proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Email/Password** en Authentication
3. Activa **Firestore**, **Realtime Database** y **Storage**
4. Copia credenciales al archivo `.env`:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
VITE_APP_ENV=development
VITE_USE_EMULATORS=false
```

### 3. Desplegar reglas de seguridad
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Editar .firebaserc con tu Project ID

# Desplegar reglas
firebase deploy --only firestore:rules
firebase deploy --only database
firebase deploy --only storage
```

### 4. Ejecutar
```bash
npm run dev
```

Abre http://localhost:5173

## 📖 Documentación

- **[Campaña Sangrebruma](CAMPAÑA.md)** - Diseño completo de la campaña, nodos, encuentros
- **[Plan de Trabajo](PLAN_DE_TRABAJO.md)** - Roadmap original del proyecto
- **[Paquetes de Trabajo](PAQUETES_DE_TRABAJO.md)** - Desglose detallado por paquete
- **[Estado del Proyecto](PROJECT_STATUS.md)** - Resumen técnico completo
- **[Paquete 7: Combate](PACKAGE_7_COMBAT.md)** - Sistema de combate táctico ⭐
- **[Guía de Testing](TESTING_GUIDE.md)** - Testing completo paso a paso
- **[Setup Firebase](FIREBASE_SETUP_GUIDE.md)** - Configuración de Firebase
- **[Habilitar Email Auth](ENABLE_EMAIL_AUTH.md)** - Configurar autenticación
- **[Deployment](DEPLOYMENT_STEPS.md)** - Desplegar a producción

## 🎮 Flujo de Juego

### Para el Owner (Anfitrión):
1. **Registro** → Crea cuenta con email y password
2. **Crear Sala** → Selecciona 2-6 jugadores, obtén código único
3. **Crear Personaje** → Elige entre 6 pregens nivel 3
4. **Esperar Jugadores** → Comparte código con amigos
5. **Iniciar Campaña** → Cuando todos estén listos

### Para Jugadores:
1. **Registro** → Crea tu cuenta
2. **Unirse a Sala** → Ingresa código de 6 caracteres
3. **Crear Personaje** → Elige pregen y personaliza nombre
4. **Marcar Listo** → Espera a que owner inicie

### Durante la Campaña:
- **Nodos Narrativos** → Lee la historia, continúa
- **Decisiones** → Vota o elige opciones que afectan la trama
- **Skill Checks** → Tira dados reales con tu personaje
- **Combates** → Sistema táctico por turnos con iniciativa y acciones SRD 5.1
- **Progreso** → Variables globales, flags, log de eventos

## 📊 Personajes Pregenerados

1. **Cazador de Látigo** (Fighter) - Tank defensivo con látigo alcance
2. **Alquimista** (Rogue) - DPS furtivo con pociones
3. **Dhampir Duelista** (Ranger) - Especialista anti-no muertos
4. **Exorcista** (Cleric) - Soporte y curación
5. **Explorador** (Ranger) - Rastreador y arquero
6. **Maldito** (Barbarian) - Tanque con regeneración

Todos nivel 3, balanceados para la campaña Sangrebruma.

## 📜 Licencia

Contenido del **Systems Reference Document 5.1** © Wizards of the Coast, publicado bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Código de la aplicación: Uso privado.

---

**Desarrollado para grupos de amigos que quieren experimentar D&D sin barreras de entrada.** 🎲✨
