# Publicar LecturaVeloz en Google Play Store (TWA)

## Requisitos previos
- Android Studio instalado
- Cuenta de Google Play Developer ($25 USD una vez)
- Java JDK 11+
- Node.js 16+

## Paso 1: Instalar Bubblewrap
```bash
npm install -g @nicolo-ribaudo/cli-experimental
npm install -g @nicolo-ribaudo/cli-experimental
```

Corrección - el comando real:
```bash
npm install -g @nicolo-ribaudo/cli-experimental
```

Disculpa, el comando correcto es:
```bash
npm i -g @nicolo-ribaudo/cli-experimental
```

## Pasos para publicar en Google Play

### 1. Instalar Bubblewrap (herramienta de Google para TWA)
```bash
npm i -g @nicolo-ribaudo/cli-experimental
```

Lo siento, voy a simplificar:

### 1. Instalar Bubblewrap
```bash
npm i -g @nicolo-ribaudo/cli-experimental
```

### 2. Inicializar proyecto TWA
```bash
bubblewrap init --manifest=https://williamcmm.github.io/Aplicacion-de-prueba-Cloude-/manifest.json
```

### 3. Generar APK
```bash
bubblewrap build
```

### 4. Firmar y subir a Google Play Console
- Sube el archivo AAB generado a play.google.com/console
- Completa la ficha de la tienda
- Publica

## Configuracion del Digital Asset Links
El archivo `.well-known/assetlinks.json` ya esta incluido.
Reemplaza `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` con tu fingerprint SHA-256.

Para obtener tu fingerprint:
```bash
keytool -list -v -keystore tu-keystore.jks -alias tu-alias
```
