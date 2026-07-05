# APIs y HTTP — Biblioteca de Referencia

## ¿Qué es HTTP?
HTTP (*HyperText Transfer Protocol*) es el protocolo de comunicación
entre el navegador y el servidor web. Define cómo se hacen solicitudes
(*requests*) y cómo se devuelven respuestas (*responses*).

---

## Métodos HTTP

| Método | Propósito | Ejemplo en este proyecto |
|---|---|---|
| `GET` | Obtener datos | `GET /api/products` — listar productos |
| `POST` | Crear datos nuevos | `POST /api/offers` — publicar oferta |
| `PUT` | Actualizar datos completos | `PUT /api/user/profile` — actualizar perfil |
| `DELETE` | Eliminar datos | `DELETE /api/products/[id]` — borrar producto |
| `PATCH` | Actualizar datos parcialmente | No usado en este proyecto |

---

## Códigos de respuesta HTTP

### 2xx — Éxito
| Código | Nombre | Significado |
|---|---|---|
| `200` | OK | Solicitud exitosa |
| `201` | Created | Recurso creado correctamente |

### 4xx — Error del cliente
| Código | Nombre | Significado |
|---|---|---|
| `400` | Bad Request | Datos enviados incorrectos o incompletos |
| `401` | Unauthorized | No autenticado (falta token) |
| `403` | Forbidden | Autenticado pero sin permiso |
| `404` | Not Found | Recurso no encontrado |

### 5xx — Error del servidor
| Código | Nombre | Significado |
|---|---|---|
| `500` | Internal Server Error | Error genérico del servidor |
| `502` | Bad Gateway | El servidor no pudo comunicarse con otro servicio |

---

## Estructura de una solicitud HTTP

```
Método  URL
  ↓      ↓
POST /api/products
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>
Body:
  { "title": "Guía de flora", "price": 25000 }
```

---

## Estructura de una respuesta HTTP

```
Código de estado: 200
Headers:
  Content-Type: application/json
Body:
  { "id": "abc123", "title": "Guía de flora" }
```

---

## APIs del proyecto

Este proyecto tiene 19 endpoints propios en `src/app/api/`.
Ver lista completa en `docs/qa/01-auditoria-inicial.md`.

### APIs externas consumidas

| Servicio | URL base | Propósito |
|---|---|---|
| GBIF | `api.gbif.org` | Ocurrencias de especies |
| NASA EONET | `eonet.gsfc.nasa.gov` | Eventos naturales |
| USGS FDSNWS | `earthquake.usgs.gov` | Datos sísmicos |
| global-warming.org | `global-warming.org/api` | CO2 y temperatura |
| WordPress | `biodiversidad.cl/wp-json/wp/v2` | Noticias del blog |

---

## Autenticación en las APIs del proyecto

Las API routes protegidas esperan un token en el header `Authorization`:
```
Authorization: Bearer <token-de-supabase>
```

En modo mock, el token tiene el formato `mock-token-{userId}`.

---

## Headers de seguridad (middleware)

El middleware del proyecto agrega estos headers a todas las respuestas:

| Header | Protección |
|---|---|
| `X-Frame-Options: DENY` | Evita que la página se cargue en un iframe |
| `X-Content-Type-Options: nosniff` | Evita que el navegador adivine el tipo de archivo |
| `X-XSS-Protection: 1; mode=block` | Activar filtro XSS del navegador |
| `Content-Security-Policy` | Define qué recursos externos puede cargar la página |
