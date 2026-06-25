// ============================================================
// DATOS MOCK para desarrollo local sin Supabase
// Activar con NEXT_PUBLIC_USE_MOCK_DATA=true en .env.local
// ============================================================

// Usuarios autenticables (email + contraseña)
export const MOCK_AUTH_USERS = [
  {
    id: 'consultor-001',
    email: 'consultor@test.cl',
    password: 'test123',
    name: 'Ana Martínez García',
    tipo_usuario: 'consultor',
  },
  {
    id: 'usuario-001',
    email: 'usuario@test.cl',
    password: 'test123',
    name: 'Carlos Rodríguez Peña',
    tipo_usuario: 'usuario_regular',
  },
]

// Tabla: usuarios
// consultor-001 tiene membresía activa → puede ver contactos
// usuario-001   NO tiene membresía    → ve el gate de membresía
export const MOCK_USUARIOS = [
  {
    id: 'consultor-001',
    name: 'Ana Martínez García',
    tipo_usuario: 'consultor',
    imagen_perfil: null,
    especialidad: 'Evaluación de Impacto Ambiental',
    avatar: null,
    membresia_activa: true,
    plan: 'brote',
    linkedin_url: 'https://linkedin.com/in/ana-martinez',
    instagram_url: null,
    facebook_url: null,
    tiktok_url: null,
  },
  {
    id: 'consultor-002',
    name: 'Diego Fuentes Castillo',
    tipo_usuario: 'consultor',
    imagen_perfil: null,
    especialidad: 'Biodiversidad y Ecosistemas',
    avatar: null,
    membresia_activa: true,
    plan: 'brote',
    linkedin_url: null,
    instagram_url: null,
    facebook_url: null,
    tiktok_url: null,
  },
  {
    id: 'consultor-003',
    name: 'Valentina Riquelme Lagos',
    tipo_usuario: 'consultor',
    imagen_perfil: null,
    especialidad: 'Restauración de Humedales',
    avatar: null,
    membresia_activa: true,
    plan: 'brote',
    linkedin_url: null,
    instagram_url: null,
    facebook_url: null,
    tiktok_url: null,
  },
  {
    id: 'usuario-001',
    name: 'Carlos Rodríguez Peña',
    tipo_usuario: 'usuario_regular',
    imagen_perfil: null,
    especialidad: null,
    avatar: null,
    membresia_activa: false,
    plan: null,
    linkedin_url: null,
    instagram_url: null,
    facebook_url: null,
    tiktok_url: null,
  },
]

// Tabla: consultores (con join a usuarios simulado)
export const MOCK_CONSULTORES = [
  {
    id: '1',
    usuario_id: 'consultor-001',
    especialidad: 'Evaluación de Impacto Ambiental',
    experiencia:
      'Más de 10 años realizando EIA para proyectos mineros e inmobiliarios en Chile central. Especialista en flora y fauna nativa del mediterráneo chileno.',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    verificado: true,
    created_at: '2024-03-15T10:00:00',
    usuarios: { name: 'Ana Martínez García', imagen_perfil: null },
  },
  {
    id: '2',
    usuario_id: 'consultor-002',
    especialidad: 'Biodiversidad y Ecosistemas',
    experiencia:
      'Investigador en conservación de ecosistemas boscosos. Doctorado en Ciencias Ambientales, UACH. Trabajo en la Patagonia y zona austral.',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    verificado: true,
    created_at: '2024-02-10T09:00:00',
    usuarios: { name: 'Diego Fuentes Castillo', imagen_perfil: null },
  },
  {
    id: '3',
    usuario_id: 'consultor-003',
    especialidad: 'Restauración de Humedales',
    experiencia:
      'Especialista en restauración ecológica con énfasis en humedales urbanos. Proyectos en Valdivia, Chiloé y Concepción. Más de 8 años de experiencia.',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    verificado: false,
    created_at: '2024-01-20T14:00:00',
    usuarios: { name: 'Valentina Riquelme Lagos', imagen_perfil: null },
  },
  {
    id: '4',
    usuario_id: 'consultor-004',
    especialidad: 'Gestión de Residuos Industriales',
    experiencia:
      'Ingeniero ambiental con experiencia en PGRLA y planes de manejo de residuos para industrias de la Región del Biobío.',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    verificado: true,
    created_at: '2024-01-05T11:00:00',
    usuarios: { name: 'Rodrigo Peñailillo Soto', imagen_perfil: null },
  },
  {
    id: '5',
    usuario_id: 'consultor-005',
    especialidad: 'Monitoreo de Flora Nativa',
    experiencia:
      'Botánica con 7 años de experiencia en levantamientos florísticos para proyectos de construcción e infraestructura vial.',
    cv_url: '',
    portfolio_url: '',
    certificaciones: '',
    verificado: true,
    created_at: '2023-12-01T08:00:00',
    usuarios: { name: 'Camila Torres Herrera', imagen_perfil: null },
  },
]

// Tabla: offers (ofertas laborales)
export const MOCK_OFFERS = [
  {
    id: '1',
    title: 'Consultor/a EIA – Proyecto Solar Atacama',
    description:
      'Buscamos consultor ambiental con experiencia en evaluación de impacto para proyecto fotovoltaico en Antofagasta. Incluye visitas a terreno y elaboración de informes técnicos.',
    location: { country: 'Chile', city: 'Antofagasta' },
    salaryMin: 2000000,
    salaryMax: 3500000,
    modality: 'Mixto',
    employmentType: 'Proyecto',
    contact: 'rrhh@solaresatacama.cl',
    tags: ['EIA', 'Solar', 'Desierto', 'Fauna'],
    isApproved: true,
    userId: 'usuario-001',
    created_at: '2024-06-01T10:00:00',
  },
  {
    id: '2',
    title: 'Especialista en Humedales – Municipalidad de Valdivia',
    description:
      'Municipalidad de Valdivia requiere profesional ambiental para elaborar plan de restauración de humedal urbano costero. Contrato a plazo fijo 6 meses.',
    location: { country: 'Chile', city: 'Valdivia' },
    salaryMin: 1500000,
    salaryMax: 2200000,
    modality: 'Presencial',
    employmentType: 'Contrato',
    contact: 'medioambiente@muniovaldivia.cl',
    tags: ['Humedales', 'Restauración', 'Municipio'],
    isApproved: true,
    userId: 'usuario-001',
    created_at: '2024-05-20T09:00:00',
  },
  {
    id: '3',
    title: 'Monitor/a Flora Nativa – Proyecto Vial Ruta 5',
    description:
      'Empresa consultora busca botánico/a para monitoreo de flora nativa en área de influencia de ampliación de Ruta 5, tramo Santiago–Chillán.',
    location: { country: 'Chile', city: 'Santiago' },
    salaryMin: 1200000,
    salaryMax: 1800000,
    modality: 'Remoto',
    employmentType: 'Freelance',
    contact: 'proyectos@consultoraambiental.cl',
    tags: ['Flora', 'Monitoreo', 'Vial', 'Terreno'],
    isApproved: true,
    userId: 'usuario-001',
    created_at: '2024-05-10T14:00:00',
  },
]

// Tabla: products (marketplace)
export const MOCK_PRODUCTS = [
  {
    id: '1',
    seller_id: 'consultor-001',
    title: 'Guía de Plantas Nativas de Chile Central',
    description:
      'Guía ilustrada con más de 200 especies de flora nativa. Incluye fotos en terreno, nombres científicos y distribución regional. Ideal para EIA y monitoreos.',
    price: 25000,
    category: 'Libros',
    images: [],
    country: 'Chile',
    city: 'Santiago',
    created_at: '2024-05-01T10:00:00',
  },
  {
    id: '2',
    seller_id: 'consultor-002',
    title: 'Kit de Muestreo de Suelos (10 muestras)',
    description:
      'Kit profesional para muestreo de suelos en campo. Incluye bolsas herméticas, etiquetas, espátula inoxidable y formulario digital de registro GPS.',
    price: 45000,
    category: 'Equipamiento',
    images: [],
    country: 'Chile',
    city: 'Valdivia',
    created_at: '2024-04-15T12:00:00',
  },
  {
    id: '3',
    seller_id: 'consultor-003',
    title: 'Plantillas EIA Word + Excel (Pack Completo)',
    description:
      'Pack de documentos técnicos en formato editable: plantillas de Declaración de Impacto Ambiental, Plan de Manejo y tablas de inventario biótico.',
    price: 35000,
    category: 'Documentos',
    images: [],
    country: 'Chile',
    city: 'Concepción',
    created_at: '2024-04-01T09:00:00',
  },
  {
    id: '4',
    seller_id: 'consultor-001',
    title: 'Curso online: EIA para no expertos',
    description:
      'Capacitación de 8 horas en video sobre los fundamentos de la Evaluación de Impacto Ambiental en Chile. Con certificado de asistencia.',
    price: 60000,
    category: 'Cursos',
    images: [],
    country: 'Chile',
    city: 'Santiago',
    created_at: '2024-03-20T08:00:00',
  },
]

// Tabla: resources (educación)
export const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'Manual de Evaluación de Impacto Ambiental en Chile',
    description:
      'Guía práctica basada en el SEIA chileno. Explica el proceso de ingreso, evaluación y calificación de proyectos.',
    image: '/assets/featured/chakana.jpg',
    link: 'https://biodiversidad.cl',
    isActive: true,
    author_id: 'consultor-001',
    created_at: '2024-04-01T10:00:00',
  },
  {
    id: '2',
    title: 'Catálogo de Especies Amenazadas en Chile',
    description:
      'Listado de flora y fauna con categoría de conservación según el Reglamento de Clasificación de Especies (RCE) del MMA.',
    image: '/assets/featured/chakana.jpg',
    link: 'https://biodiversidad.cl',
    isActive: true,
    author_id: 'consultor-002',
    created_at: '2024-03-15T12:00:00',
  },
  {
    id: '3',
    title: 'Protocolo de Muestreo de Humedales Urbanos',
    description:
      'Documento técnico con metodología estandarizada para levantamiento de fauna y flora en humedales urbanos costeros.',
    image: '/assets/featured/chakana.jpg',
    link: 'https://biodiversidad.cl',
    isActive: true,
    author_id: 'consultor-003',
    created_at: '2024-02-20T09:00:00',
  },
]
