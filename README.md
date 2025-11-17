<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Cómo iniciar el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Asegúrate de tener configuradas las variables necesarias en tu entorno o en un archivo `.env` si lo usas.
Variables requeridas:
- CONTENTFUL_SPACE_ID
- CONTENTFUL_ACCESS_TOKEN
- CONTENTFUL_ENVIRONMENT
- CONTENTFUL_CONTENT_TYPE
- DATABASE_URL
- PORT
- NODE_ENV
- JWT_SECRET
- JWT_EXPIRATION

### 3. Levantar los servicios con Docker

Este proyecto incluye un archivo `docker-compose.yml` que permite levantar todos los servicios necesarios:
- MongoDB
- Mongo Express (UI para visualizar la base de datos)
- La aplicación NestJS

Asegúrate de tener Docker y Docker Compose instalados. Ejecuta:
```bash
docker-compose up -d
```

Esto levantará:
- MongoDB en el puerto 27017
- Mongo Express en el puerto 8081 (acceso vía navegador)
- La API NestJS en el puerto configurado (por defecto 3001)

Accede a Mongo Express en:
```
http://localhost:8081
```

Accede a la API en:
```
http://localhost:3001
```

Para detener los servicios:
```bash
docker-compose down
```

### 4. Compilar y ejecutar el proyecto

Modo desarrollo:
```bash
npm run start:dev
```

Modo producción:
```bash
npm run start:prod
```

### 5. Ejecutar pruebas

Pruebas unitarias:
```bash
npm run test
```

Cobertura de tests:
```bash
npm run test:cov
```

### 6. Verificar cobertura en CI
El workflow de GitHub Actions valida automáticamente el porcentaje de cobertura y sube el reporte como artefacto.

### 7. Sincronización automática y cron (mock)

La aplicación incluye un proceso de sincronización automática que se ejecuta al iniciar el proyecto. Apenas la API se levanta, los registros de productos se almacenan en la base de datos MongoDB.

El cron de sincronización está implementado mediante un mock para simular la actualización periódica de los productos desde Contentful. No requiere configuración adicional y funciona automáticamente en el entorno de desarrollo y producción.

Esto permite probar la lógica de sincronización y ver los datos reflejados en la base de datos y en la API desde el primer arranque.

### 8. Configuración del cron para pruebas

En el archivo [`src/infrastructure/schedulers/product-sync.scheduler.ts`](./src/infrastructure/schedulers/product-sync.scheduler.ts) puedes modificar la frecuencia del cron para validar el funcionamiento del schedule.

Por defecto, la sincronización está programada para ejecutarse cada hora:

```typescript
@Cron(CronExpression.EVERY_HOUR)
```

Si necesitas probar el cron con mayor frecuencia, puedes cambiarlo por:

```typescript
@Cron(CronExpression.EVERY_MINUTE)
```

O cualquier otro valor de `CronExpression` que se adapte a tus pruebas. Solo modifica la línea 32 del archivo mencionado.

> Por defecto se dejó la frecuencia de una hora, como solicita el challenge.

