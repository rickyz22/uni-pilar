// ═══════════════════════════════════════════════════════
// UniPilar — Plataforma Estudiantil UNA
// ═══════════════════════════════════════════════════════

// ───── CONFIG ─────
const API_BASE = 'http://localhost:4001/api';

// ───── STATE ─────
let currentSubject = null;
let currentTool = 'apuntes';
let authToken = localStorage.getItem('auth_token') || null;
let currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');

const chatState = {
  messages: []
};

const quizState = {
  currentIndex: 0,
  score: 0,
  answered: false,
  currentSubject: null
};

// ───── SUBJECT DATA (UNA) ─────
const subjects = {
  general: {
    id: 'general',
    name: 'Asistente UniPilar',
    icon: 'fa-robot',
    color: '#6c5ce7',
    desc: 'Asistente general de informática y tecnología.',
    subtitle: 'Tutor general de informática y tecnología',
    systemPrompt: `Eres un asistente universitario experto de la Universidad Nacional de Pilar (UNA). Responde siempre en español, de forma concisa, amigable y estructurada. Ayudas con conceptos de tecnología, programación, ciencias de la computación, y trámites académicos de la UNA.`,
    keywords: {
      'hola|buenas|buenos días|buenas tardes|que tal|buenas noches|hey|saludos': '¡Hola! 👋 Soy el asistente UniPilar de la Universidad Nacional de Pilar. Puedo ayudarte con:\n\n• Materias de tu carrera\n• Conceptos de programación, BD, SO y fundamentos\n• Información de trámites académicos\n• Horarios de clases\n\n¿En qué puedo ayudarte hoy?',
      'programacion|programar|código|codigo|desarrollo|software': '**Sobre Programación**\n\nLa programación es fundamental en muchas carreras de la UNA. Algunos conceptos:\n\n• **Variables:** almacenan datos en memoria\n• **Estructuras de control:** if, for, while\n• **Funciones:** bloques reutilizables de código\n• **POO:** programación orientada a objetos\n\nSelecciona la materia **Programación** para acceder a apuntes y quiz especializados.',
      'base de datos|bd|sql|mysql|postgresql': '**Sobre Bases de Datos**\n\nLas bases de datos son esenciales para almacenar información estructurada.\n\n• **SQL:** lenguaje estándar para consultas\n• **Normalización:** elimina redundancia\n• **JOINs:** combina datos de varias tablas\n\nSelecciona la materia **Base de Datos** para apuntes y quizzes.',
      'sistema operativo|so|linux|windows|procesos': '**Sobre Sistemas Operativos**\n\nUn sistema operativo gestiona los recursos del hardware.\n\n• **Procesos:** programas en ejecución\n• **Memoria:** gestión y virtualización\n• **Concurrencia:** semáforos, mutex\n\nSelecciona **Sistemas Operativos** para más detalles.',
      'tramite|constancia|inscripción|inscripcion|examenes|finales': '**Trámites Académicos en la UNA**\n\nEn la Universidad Nacional de Pilar podés:\n\n• **Constancia de alumno regular:** Solicitala en Secretaría Académica\n• **Inscripción a exámenes:** Generalmente por el campus virtual o presencial\n• **Actas de examen:** Se entregan después de aprobar\n• **Horarios:** Consultalos en la web de la universidad o en el panel de UniPilar\n\n¿Necesitás info sobre algún trámite específico?',
      'horario|clases|aula|turno': '**Horarios de Clases**\n\nPara consultar tus horarios:\n\n1. Ingresá a tu cuenta de UniPilar\n2. Andá a la sección "Mi Horario"\n3. Seleccioná tu carrera y turno\n\nTambién podés preguntarme por una materia específica y te ayudo con el horario.',
      'gracias|muchas gracias': '¡De nada! 😊 Estoy acá para ayudarte. Explorá los apuntes y quizzes de cada materia para reforzar tu aprendizaje. ¡Éxitos en la UNA! 🚀',
      'quien eres|que eres|qué eres': '🤖 Soy **UniPilar Assistant**, el asistente virtual de la plataforma estudiantil de la Universidad Nacional de Pilar.\n\nEstoy aquí para ayudarte con:\n• Resolver dudas de materias\n• Explicar conceptos paso a paso\n• Info de trámites académicos\n• Guiarte en el uso de la plataforma\n\n✅ **Funciono sin conexión** — las respuestas básicas están disponibles offline.'
    },
    apuntes: [
      { title: 'Bienvenido a UniPilar', text: 'UniPilar es tu plataforma de estudio para la Universidad Nacional de Pilar. Selecciona una materia para acceder a apuntes, quizzes y asistente IA especializado.' },
      { title: 'Modo Offline vs Online', text: 'El chat funciona offline por defecto con respuestas predefinidas. Si querés usar Gemini (IA online), hacé clic en "Sin conexión" en el header del chat e ingresá tu API Key.' }
    ],
    quiz: [
      {
        question: '¿Cuántas materias principales tiene UniPilar?',
        options: ['2', '3', '4', '5'],
        correct: 2
      },
      {
        question: '¿Qué necesitas para usar el chat en modo offline?',
        options: ['Una API Key', 'Internet activo', 'Nada, funciona sin conexión', 'Un servidor externo'],
        correct: 2
      },
      {
        question: '¿Qué compuerta lógica equivale a AND + NOT?',
        options: ['NOR', 'XOR', 'NAND', 'OR'],
        correct: 2
      },
      {
        question: '¿Qué lenguaje se usa para consultar bases de datos relacionales?',
        options: ['Python', 'Java', 'SQL', 'HTML'],
        correct: 2
      },
      {
        question: '¿Cuál es la base del sistema binario?',
        options: ['8', '10', '2', '16'],
        correct: 2
      }
    ]
  },
  programacion: {
    id: 'programacion',
    name: 'Programación',
    icon: 'fa-code',
    color: '#6c5ce7',
    desc: 'Algoritmos, estructuras de datos y paradigmas de programación.',
    subtitle: 'Especialista en Python, JavaScript y Java',
    systemPrompt: `Eres un tutor experto en Programación a nivel universitario (UNA). Responde siempre en español, de forma concisa y estructurada. Explica los conceptos paso a paso con bloques de código limpios y comentados.`,
    keywords: {
      'variable|variables': '**Variables en Programación**\n\nUna variable es un espacio en memoria que almacena un valor.\n\n**Ejemplo en Python:**\n```python\nnombre = "Juan"\nedad = 20\npi = 3.1416\n```\n\n**Tipos comunes:** Enteros (int), flotantes (float), cadenas (str), booleanos (bool), listas (list).',
      'bucle|for|while': '**Bucles en Programación**\n\n**Bucle `for`** — Itera sobre una secuencia:\n```python\nfor i in range(5):\n    print(i)\n```\n\n**Bucle `while`** — Repite mientras se cumpla una condición:\n```python\ncontador = 0\nwhile contador < 5:\n    print(contador)\n    contador += 1\n```',
      'funcion|funciones': '**Funciones en Programación**\n\nUna función es un bloque de código reutilizable.\n\n```python\ndef sumar(a, b):\n    return a + b\n\nresultado = sumar(5, 3)  # 8\n```',
      'clase|objeto|poo': '**Programación Orientada a Objetos (POO)**\n\nPOO organiza el código en clases y objetos.\n\n```python\nclass Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    \n    def ladrar(self):\n        return f"{self.nombre} dice ¡Guau!"\n```\n\n**Pilares:** encapsulamiento, herencia, polimorfismo, abstracción.'
    },
    apuntes: [
      { title: 'Variables y Tipos de Datos', text: 'Las variables almacenan valores en memoria. Tipos: enteros, flotantes, cadenas, booleanos, listas.' },
      { title: 'Estructuras de Control', text: 'Condicionales (if/else) y bucles (for, while) permiten controlar el flujo del programa.' },
      { title: 'Programación Orientada a Objetos', text: 'POO: clases, objetos, herencia, polimorfismo, encapsulamiento y abstracción.' },
      { title: 'Algoritmos y Complejidad', text: 'Notación Big O: O(1), O(n), O(n^2), O(log n). Busca siempre el algoritmo más eficiente.' }
    ],
    quiz: [
      {
        question: '¿Qué es una variable en programación?',
        options: ['Un valor que nunca cambia', 'Un espacio en memoria que almacena un valor', 'Una función matemática', 'Un tipo de bucle'],
        correct: 1
      },
      {
        question: '¿Qué significa POO?',
        options: ['Programación Orientada a Objetos', 'Proceso de Operaciones Ordinales', 'Protocolo de Organización de Objetos', 'Programación con Operadores Óptimos'],
        correct: 0
      },
      {
        question: '¿Cuál es una estructura repetitiva?',
        options: ['if-else', 'switch', 'while', 'function'],
        correct: 2
      },
      {
        question: '¿Qué es un array?',
        options: ['Un tipo de dato primitivo', 'Una estructura que almacena múltiples valores', 'Una función', 'Un bucle'],
        correct: 1
      },
      {
        question: '¿Qué operador compara igualdad?',
        options: ['=', '==', '===', '!='],
        correct: 1
      }
    ]
  },
  baseDeDatos: {
    id: 'baseDeDatos',
    name: 'Base de Datos',
    icon: 'fa-database',
    color: '#00cec9',
    desc: 'Modelado, normalización, SQL y álgebra relacional.',
    subtitle: 'Especialista en SQL, modelado y optimización',
    systemPrompt: `Eres un tutor experto en Bases de Datos (UNA). Responde en español, enfocado en álgebra relacional, normalización, SQL, JOINs e índices.`,
    keywords: {
      'sql|select|insert|update|delete': '**Consultas SQL**\n\n```sql\nSELECT nombre, edad FROM usuarios WHERE edad > 18;\nINSERT INTO usuarios (nombre, email) VALUES (\'Ana\', \'ana@email.com\');\nUPDATE usuarios SET edad = 26 WHERE nombre = \'Ana\';\nDELETE FROM usuarios WHERE id = 5;\n```',
      'join|inner|left|right': '**JOINs en SQL**\n\n- **INNER JOIN:** registros que coinciden en ambas tablas\n- **LEFT JOIN:** todos los de la izquierda + coincidencias\n- **RIGHT JOIN:** todos los de la derecha + coincidencias\n\n```sql\nSELECT u.nombre, p.producto\nFROM usuarios u\nINNER JOIN compras p ON u.id = p.usuario_id;\n```'
    },
    apuntes: [
      { title: 'Modelo Entidad-Relación', text: 'Entidades, atributos, relaciones. Cardinalidad: 1:1, 1:N, N:M.' },
      { title: 'Normalización', text: '1FN: atómico. 2FN: depende de toda la PK. 3FN: sin dependencias transitivas.' },
      { title: 'Consultas SQL', text: 'SELECT, INSERT, UPDATE, DELETE. WHERE, ORDER BY, GROUP BY.' },
      { title: 'JOINs', text: 'INNER, LEFT, RIGHT, FULL JOIN para combinar tablas.' }
    ],
    quiz: [
      {
        question: '¿Qué es una clave primaria?',
        options: ['Un índice de búsqueda', 'Un identificador único para cada registro', 'Una relación entre tablas', 'Un tipo de dato'],
        correct: 1
      },
      {
        question: '¿Cuál es el objetivo de la normalización?',
        options: ['Optimizar consultas', 'Eliminar redundancia', 'Crear índices', 'Respaldar la BD'],
        correct: 1
      },
      {
        question: '¿Qué JOIN devuelve solo registros con correspondencia en ambas tablas?',
        options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'],
        correct: 2
      },
      {
        question: '¿Qué es un índice en una BD?',
        options: ['Una clave foránea', 'Estructura que acelera búsquedas', 'Un tipo de JOIN', 'Una restricción'],
        correct: 1
      },
      {
        question: '¿Qué comando elimina completamente una tabla?',
        options: ['DELETE FROM', 'DROP TABLE', 'REMOVE TABLE', 'TRUNCATE'],
        correct: 1
      }
    ]
  },
  sistemasOperativos: {
    id: 'sistemasOperativos',
    name: 'Sistemas Operativos',
    icon: 'fa-microchip',
    color: '#fdcb6e',
    desc: 'Procesos, memoria, concurrencia y sistemas de archivos.',
    subtitle: 'Especialista en procesos, memoria y concurrencia',
    systemPrompt: `Eres un tutor experto en Sistemas Operativos (UNA). Responde en español sobre procesos, planificación, memoria, concurrencia y deadlocks.`,
    keywords: {
      'proceso|procesos|pcb|hilo|thread': '**Gestión de Procesos**\n\nUn **proceso** es un programa en ejecución con un PCB que incluye:\n- **PID:** Identificador del proceso\n- **Estado:** Nuevo, Listo, Ejecución, Bloqueado, Terminado\n- **Contador de programa**\n- **Registros de CPU**',
      'planificacion|scheduler|fcfs|sjf|round robin': '**Planificación de CPU**\n\n1. **FCFS:** Primero en llegar, primero en ejecutarse\n2. **SJF:** El más corto primero\n3. **Round Robin:** Quantum de tiempo fijo en orden circular'
    },
    apuntes: [
      { title: 'Gestión de Procesos', text: 'Proceso = programa en ejecución. Estados: nuevo, listo, ejecución, bloqueado, terminado.' },
      { title: 'Planificación de CPU', text: 'FCFS, SJF, Round Robin. Cada uno tiene ventajas y desventajas.' },
      { title: 'Gestión de Memoria', text: 'Paginación (marcos fijos), segmentación (segmentos lógicos), memoria virtual.' },
      { title: 'Concurrencia y Deadlocks', text: 'Semáforos, mutex. Deadlock: 4 condiciones (exclusión mutua, retención y espera, no expropiación, espera circular).' }
    ],
    quiz: [
      {
        question: '¿Qué es un proceso?',
        options: ['Un archivo ejecutable', 'Un programa en ejecución', 'Un hilo ligero', 'Una interrupción'],
        correct: 1
      },
      {
        question: '¿Qué algoritmo planifica por menor tiempo restante?',
        options: ['FCFS', 'Round Robin', 'SJF', 'Por Prioridades'],
        correct: 2
      },
      {
        question: '¿Cuántas condiciones causan deadlock?',
        options: ['2', '3', '4', '5'],
        correct: 2
      },
      {
        question: '¿Qué es un semáforo?',
        options: ['Un tipo de proceso', 'Variable que controla acceso a recursos', 'Un algoritmo', 'Una partición de memoria'],
        correct: 1
      },
      {
        question: '¿Qué decide el planificador a corto plazo?',
        options: ['Qué proceso ejecuta la CPU', 'Qué procesos se cargan en memoria', 'Qué archivos se abren', 'Qué dispositivos usar'],
        correct: 0
      }
    ]
  },
  fundamentosInformatica: {
    id: 'fundamentosInformatica',
    name: 'Fundamentos de Informática',
    icon: 'fa-calculator',
    color: '#0984e3',
    desc: 'Sistemas numéricos, álgebra booleana y arquitectura de computadores.',
    subtitle: 'Especialista en lógica, sistemas numéricos y hardware',
    systemPrompt: `Eres un tutor experto en Fundamentos de Informática (UNA). Responde en español sobre sistemas numéricos, álgebra de Boole, compuertas lógicas y arquitectura de computadores.`,
    keywords: {
      'binario|decimal|hexadecimal|octal|conversion': '**Sistemas Numéricos**\n\n**Binario (Base 2):** 0 y 1. Lenguaje nativo de computadoras.\n- 1010₂ = 10₁₀\n\n**Decimal (Base 10):** 0-9. Uso cotidiano.\n\n**Hexadecimal (Base 16):** 0-9, A-F. Direcciones de memoria y colores.\n- FF₁₆ = 255₁₀',
      'boole|compuerta|and|or|not|nand|xor': '**Álgebra de Boole y Compuertas**\n\n- **AND (·):** 1 si todas las entradas son 1\n- **OR (+):** 1 si al menos una entrada es 1\n- **NOT (¬):** Invierte la entrada\n\n**Derivadas:** NAND, NOR, XOR\n\n**Ley de Morgan:** ¬(A·B) = ¬A + ¬B'
    },
    apuntes: [
      { title: 'Sistemas Numéricos', text: 'Binario (base 2), octal (base 8), hexadecimal (base 16). Conversión entre bases.' },
      { title: 'Álgebra de Boole', text: 'AND, OR, NOT. Leyes: De Morgan, distributiva, absorción.' },
      { title: 'Compuertas Lógicas', text: 'AND, OR, NOT, NAND, NOR, XOR. NAND es universal.' },
      { title: 'Arquitectura de Computadores', text: 'CPU (UC + ALU + Registros), memoria RAM, buses. Ciclo: fetch → decode → execute.' }
    ],
    quiz: [
      {
        question: '¿Cuántos bits hay en un byte?',
        options: ['4', '8', '16', '32'],
        correct: 1
      },
      {
        question: '¿Qué compuerta produce 1 solo cuando todas las entradas son 1?',
        options: ['OR', 'XOR', 'AND', 'NOT'],
        correct: 2
      },
      {
        question: '¿Qué es un algoritmo?',
        options: ['Un programa compilado', 'Secuencia finita de pasos para resolver un problema', 'Un tipo de dato', 'Un componente de hardware'],
        correct: 1
      },
      {
        question: '¿Cuál es la base del sistema binario?',
        options: ['8', '10', '2', '16'],
        correct: 2
      },
      {
        question: '¿Qué compuerta equivale a AND + NOT?',
        options: ['NOR', 'XOR', 'NAND', 'OR'],
        correct: 2
      }
    ]
  }
};

// ───── RESOURCES DATA ─────
const resources = [
  {
    category: 'Fundamentos de Computación',
    icon: 'fa-desktop',
    color: '#6c5ce7',
    links: [
      { label: 'Simuunpilar', url: '#', featured: false },
      { label: 'ASCII Table', url: 'https://www.ascii-code.com', featured: false },
      { label: 'IT-Tools', url: 'https://it-tools.tech', featured: false }
    ]
  },
  {
    category: 'Lógica',
    icon: 'fa-project-diagram',
    color: '#a29bfe',
    links: [
      { label: 'Draw.io', url: 'https://app.diagrams.net', featured: true },
      { label: 'Simulador Lógico', url: 'https://www.falstad.com/circuit', featured: false }
    ]
  },
  {
    category: 'Matemática Discreta',
    icon: 'fa-square-root-alt',
    color: '#00cec9',
    links: [
      { label: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', featured: false },
      { label: 'Photomath', url: 'https://photomath.com', featured: false },
      { label: 'GeoGebra', url: 'https://www.geogebra.org', featured: true },
      { label: 'Python', url: 'https://www.python.org', featured: false }
    ]
  },
  {
    category: 'Cultura Digital',
    icon: 'fa-globe',
    color: '#fd79a8',
    links: [
      { label: 'Quiz Automático', url: '#', featured: false },
      { label: 'Google Academy', url: 'https://edu.google.com', featured: false },
      { label: 'iLovePDF', url: 'https://www.ilovepdf.com', featured: false },
      { label: 'Kanban (Trello)', url: 'https://trello.com', featured: false },
      { label: 'TimeTune', url: 'https://timetune.app', featured: false }
    ]
  },
  {
    category: 'Programación',
    icon: 'fa-code',
    color: '#0984e3',
    links: [
      { label: 'CodePen', url: 'https://codepen.io', featured: true },
      { label: 'Replit Collab', url: 'https://replit.com', featured: true },
      { label: 'Mimo', url: 'https://getmimo.com', featured: false },
      { label: 'Antigravity', url: '#', featured: false },
      { label: 'OpenCode', url: '#', featured: false },
      { label: 'VS Code', url: 'https://code.visualstudio.com', featured: false },
      { label: 'Pydroid 3', url: 'https://ruimarinho.github.io/pydroid3', featured: false },
      { label: 'Python Install', url: 'https://www.python.org/downloads', featured: false }
    ]
  },
  {
    category: 'Diseño',
    icon: 'fa-palette',
    color: '#e84393',
    links: [
      { label: 'Canva', url: 'https://www.canva.com', featured: false },
      { label: 'Genially', url: 'https://genial.ly', featured: false },
      { label: 'NotebookLM', url: 'https://notebooklm.google.com', featured: false },
      { label: 'Noun Project', url: 'https://thenounproject.com', featured: false },
      { label: 'Coolors', url: 'https://coolors.co', featured: false },
      { label: 'DaFont', url: 'https://www.dafont.com', featured: false },
      { label: 'WhatTheFont', url: 'https://www.myfonts.com/pages/whatthefont', featured: false },
      { label: 'newt.sh', url: 'https://newt.sh', featured: false },
      { label: 'Uiverse', url: 'https://uiverse.io', featured: false }
    ]
  },
  {
    category: 'Herramientas',
    icon: 'fa-wrench',
    color: '#fdcb6e',
    links: [
      { label: 'AnyDesk', url: 'https://anydesk.com', featured: false },
      { label: 'TempMail', url: 'https://temp-mail.org', featured: false },
      { label: 'Omni Calculator', url: 'https://www.omnicalculator.com', featured: false },
      { label: 'OnlyOffice', url: 'https://www.onlyoffice.com', featured: false },
      { label: 'Remove.bg', url: 'https://www.remove.bg', featured: false },
      { label: 'VirusTotal', url: 'https://www.virustotal.com', featured: false },
      { label: 'Anytype', url: 'https://anytype.io', featured: true },
      { label: 'LocalSend', url: 'https://localsend.org', featured: false },
      { label: 'Snapdrop', url: 'https://snapdrop.net', featured: false },
      { label: 'Revo Uninstaller', url: 'https://www.revouninstaller.com', featured: false }
    ]
  },
  {
    category: 'Aprendizaje',
    icon: 'fa-graduation-cap',
    color: '#00b894',
    links: [
      { label: 'Docker', url: 'https://www.docker.com', featured: false },
      { label: 'GitHub', url: 'https://github.com', featured: true },
      { label: 'W3Schools', url: 'https://www.w3schools.com', featured: false },
      { label: 'Best Practices', url: 'https://web.dev/learn', featured: false }
    ]
  },
  {
    category: 'Otros',
    icon: 'fa-ellipsis-h',
    color: '#636e72',
    links: [
      { label: 'WhatsApp Web', url: 'https://web.whatsapp.com', featured: false },
      { label: 'Ascent', url: '#', featured: false },
      { label: 'Monkeytype', url: 'https://monkeytype.com', featured: false },
      { label: 'TheySeeYourPhotos', url: 'https://theyseeyourphotos.com', featured: false },
      { label: 'DownDetector', url: 'https://downdetector.com', featured: false },
      { label: 'Speedtest', url: 'https://www.speedtest.net', featured: false },
      { label: 'CrystalDisk', url: 'https://crystalmark.info', featured: false },
      { label: 'HW Monitor', url: 'https://www.cpuid.com/softwares/hwmonitor.html', featured: false },
      { label: 'Fing', url: 'https://www.fing.com', featured: false }
    ]
  }
];

// ───── BACKGROUND ANIMATION ─────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const particles = [];
const P_COUNT = 50;

for (let i = 0; i < P_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2.5 + 1,
    alpha: Math.random() * 0.4 + 0.1,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 92, 231, ${p.alpha})`;
    ctx.fill();
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }
  drawParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ───── RENDER SUBJECT CARDS ─────
const grid = document.getElementById('subjects-grid');

Object.values(subjects).forEach((subj) => {
  if (subj.id === 'general') return;
  const card = document.createElement('div');
  card.className = 'category-card reveal';
  card.dataset.subject = subj.id;
  card.style.setProperty('--selected-color', subj.color);
  card.innerHTML = `
    <div class="category-icon" style="background:${subj.color}20; color:${subj.color};">
      <i class="fas ${subj.icon}"></i>
    </div>
    <h3>${subj.name}</h3>
    <p class="desc">${subj.desc}</p>
    <div class="card-count">
      <i class="fas fa-tools"></i> 3 herramientas disponibles
    </div>
  `;
  card.addEventListener('click', () => selectSubject(subj.id));
  grid.appendChild(card);
});

// ───── RENDER RESOURCES ─────
const resourcesGrid = document.getElementById('resources-grid');

resources.forEach((cat, idx) => {
  const div = document.createElement('div');
  div.className = 'resource-category reveal';
  div.style.setProperty('--cat-color', cat.color);
  div.style.animationDelay = `${idx * 0.1}s`;
  
  div.innerHTML = `
    <div class="resource-cat-header">
      <div class="resource-cat-icon" style="background:${cat.color}20; color:${cat.color};">
        <i class="fas ${cat.icon}"></i>
      </div>
      <h3>${cat.category}</h3>
    </div>
    <div class="resource-links">
      ${cat.links.map(link => `
        <a href="${link.url}" class="resource-link ${link.featured ? 'featured' : ''}" target="_blank" rel="noopener">
          ${link.label}
          ${link.url.startsWith('http') ? '<i class="fas fa-external-link-alt ext-icon"></i>' : ''}
        </a>
      `).join('')}
    </div>
  `;
  
  resourcesGrid.appendChild(div);
});

// ───── REVEAL ON SCROLL ─────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ───── COUNTER ANIMATION ─────
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, 30);
}

// ───── SELECT SUBJECT ─────
function selectSubject(subjId, switchToChat) {
  currentSubject = subjId;
  const subj = subjects[subjId];

  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  if (subjId !== 'general') {
    const activeCard = document.querySelector(`[data-subject="${subjId}"]`);
    if (activeCard) activeCard.classList.add('selected');
  }

  document.getElementById('tool-subtitle').textContent = `Estudiando: ${subj.name}`;
  document.getElementById('chat-title').textContent = `Asistente de ${subj.name}`;
  document.getElementById('chat-subtitle').textContent = subj.subtitle;

  const modalAvatar = document.getElementById('chat-modal-avatar');
  if (modalAvatar) {
    modalAvatar.style.background = `linear-gradient(135deg, ${subj.color}, ${subj.color}dd)`;
  }

  document.getElementById('chat-input').placeholder = `Pregunta sobre ${subj.name}...`;

  if (switchToChat || subjId === 'general') {
    switchTool('chat');
  } else {
    switchTool('apuntes');
  }

  renderApuntes(subjId);
  resetQuiz(subjId);

  if (subjId !== 'general') {
    document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
  }
}

// ───── TOOL TABS ─────
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTool(tab.dataset.tool);
  });
});

function switchTool(tool) {
  currentTool = tool;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tool === tool));
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${tool}`).classList.add('active');
}

// ───── APUNTES ─────
function renderApuntes(subjId) {
  const subj = subjects[subjId];
  const container = document.getElementById('apuntes-content');
  
  if (!subj) {
    container.innerHTML = `<div class="no-subject-placeholder">
      <i class="fas fa-hand-pointer"></i>
      <p>Selecciona una materia</p>
    </div>`;
    return;
  }

  const color = subj.color;
  let html = `<h3 style="--selected-color:${color}"><i class="fas ${subj.icon}" style="color:${color}"></i> Apuntes — ${subj.name}</h3>`;

  subj.apuntes.forEach((a, i) => {
    html += `
      <div class="apunte-item">
        <div class="apunte-title">
          <i class="fas fa-caret-right" style="color:${color}"></i>
          ${a.title}
        </div>
        <p>${a.text}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ───── QUIZ ─────
function resetQuiz(subjId) {
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.currentSubject = subjId;
  renderQuiz(subjId);
}

function renderQuiz(subjId) {
  const subj = subjects[subjId];
  const container = document.getElementById('quiz-content');

  if (!subj) {
    container.innerHTML = `<div class="no-subject-placeholder">
      <i class="fas fa-gamepad"></i>
      <p>Selecciona una materia</p>
    </div>`;
    return;
  }

  const questions = subj.quiz;
  const q = questions[quizState.currentIndex];

  if (!q) {
    const total = questions.length;
    const pct = Math.round((quizState.score / total) * 100);
    let emoji = '🎉';
    let msg = '¡Excelente trabajo!';
    if (pct < 50) { emoji = '📚'; msg = 'Seguí estudiando.'; }
    else if (pct < 80) { emoji = '👍'; msg = 'Buen trabajo.'; }

    container.innerHTML = `
      <div class="quiz-result">
        <div class="result-icon">${emoji}</div>
        <h3>Quiz completado</h3>
        <div class="result-score">${quizState.score}/${total}</div>
        <p class="result-msg">${msg}</p>
        <button class="quiz-next-btn" onclick="resetQuiz('${subjId}')">
          <i class="fas fa-redo"></i> Reintentar
        </button>
      </div>
    `;
    return;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const color = subj.color;

  let optionsHtml = '';
  q.options.forEach((opt, i) => {
    optionsHtml += `
      <div class="quiz-option" data-index="${i}" onclick="answerQuiz(${i})">
        <span class="option-letter">${letters[i]}</span>
        ${opt}
      </div>
    `;
  });

  container.innerHTML = `
    <div class="quiz-header">
      <h3><i class="fas ${subj.icon}" style="color:${color}"></i> Quiz — ${subj.name}</h3>
      <div class="quiz-score">Pregunta <span>${quizState.currentIndex + 1}</span>/${questions.length} · Puntaje: <span>${quizState.score}</span></div>
    </div>
    <div class="quiz-question" style="border-left-color:${color}">${q.question}</div>
    <div class="quiz-options" id="quiz-options">${optionsHtml}</div>
    <div class="quiz-feedback" id="quiz-feedback"></div>
    <button class="quiz-next-btn" id="quiz-next-btn" style="display:none" onclick="nextQuizQuestion()">
      <i class="fas fa-arrow-right"></i> Siguiente
    </button>
  `;

  quizState.answered = false;
}

function answerQuiz(index) {
  if (quizState.answered) return;
  quizState.answered = true;

  const subj = subjects[quizState.currentSubject];
  const q = subj.quiz[quizState.currentIndex];
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  const isCorrect = index === q.correct;
  if (isCorrect) quizState.score++;

  options.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === q.correct) opt.classList.add('correct');
    if (i === index && !isCorrect) opt.classList.add('wrong');
  });

  feedback.className = `quiz-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect
    ? '✅ ¡Correcto!'
    : `❌ Incorrecto. Respuesta: ${q.options[q.correct]}`;

  nextBtn.style.display = 'inline-flex';
}

function nextQuizQuestion() {
  quizState.currentIndex++;
  renderQuiz(quizState.currentSubject);
}

// ───── CHAT ─────
let useGemini = false;

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatResponse(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);border-radius:8px;padding:0.75rem;margin:0.5rem 0;overflow-x:auto;font-size:0.82rem;border:1px solid var(--border-glass);"><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.85rem;">$1</code>');
  return html;
}

function getOfflineResponse(text, subjId) {
  const subj = subjects[subjId];
  if (!subj || !subj.keywords) return null;

  const normalized = normalizeText(text);

  for (const [keyphrase, response] of Object.entries(subj.keywords)) {
    const keywords = keyphrase.split('|');
    if (keywords.some(kw => normalized.includes(kw.trim()))) {
      return formatResponse(response);
    }
  }

  return null;
}

function getFallbackResponse(subjId) {
  const fallbacks = {
    programacion: '¡Hola! Soy tu asistente de **Programación**. Preguntame sobre variables, bucles, funciones, POO, algoritmos.',
    baseDeDatos: '¡Hola! Soy tu asistente de **Base de Datos**. Preguntame sobre SQL, JOINs, normalización, índices.',
    sistemasOperativos: '¡Hola! Soy tu asistente de **Sistemas Operativos**. Preguntame sobre procesos, planificación, memoria, concurrencia.',
    fundamentosInformatica: '¡Hola! Soy tu asistente de **Fundamentos**. Preguntame sobre binario, álgebra de Boole, compuertas, arquitectura.',
    general: '¡Hola! Soy el asistente de **UniPilar**. Preguntame sobre cualquier materia o trámite de la UNA.'
  };
  return fallbacks[subjId] || 'Preguntame sobre tu materia.';
}

// ───── INTENT DETECTION ─────
const subjectNavigationMap = [
  { keywords: ['programacion', 'programación', 'programar', 'codigo', 'código'], id: 'programacion' },
  { keywords: ['base de datos', 'base de dato', 'bd', 'sql'], id: 'baseDeDatos' },
  { keywords: ['sistema operativo', 'sistemas operativos', 'so', 'procesos'], id: 'sistemasOperativos' },
  { keywords: ['fundamento', 'fundamentos', 'informatica', 'informática', 'logica', 'lógica', 'binario'], id: 'fundamentosInformatica' }
];

function detectSubjectNavigation(text) {
  const normalized = normalizeText(text);
  for (const entry of subjectNavigationMap) {
    if (entry.keywords.some(kw => normalized.includes(kw))) {
      const navPhrases = ['estudiar', 'aprender', 'ir a', 'abrir', 'ver', 'tema', 'materia', 'llevame', 'llévame'];
      const isNav = navPhrases.some(p => normalized.includes(p));
      if (isNav) return entry.id;
    }
  }
  return null;
}

// ───── CHAT MODAL ─────
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const statusText = document.getElementById('status-text');
const modeToggle = document.getElementById('mode-toggle');
const modeText = document.getElementById('mode-text');

modeToggle.addEventListener('click', () => {
  useGemini = !useGemini;
  modeToggle.classList.toggle('online', useGemini);
  modeText.textContent = useGemini ? 'Gemini' : 'Sin conexión';
  if (!useGemini) {
    localStorage.removeItem('gemini_api_key');
  } else {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
      const newKey = prompt('🔑 Ingresa tu API Key de Gemini:');
      if (newKey) {
        localStorage.setItem('gemini_api_key', newKey);
      } else {
        useGemini = false;
        modeToggle.classList.remove('online');
        modeText.textContent = 'Sin conexión';
      }
    }
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  sendBtn.disabled = !chatInput.value.trim() || !currentSubject;
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (chatInput.value.trim() && currentSubject) sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  const icon = role === 'bot' ? 'fa-robot' : 'fa-user';
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas ${icon}"></i></div>
    <div class="bubble">
      ${text}
      <span class="timestamp">Ahora</span>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typing-msg';
  div.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
    <div class="bubble">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-msg');
  if (el) el.remove();
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !currentSubject) return;

  addMessage(escapeHtml(text), 'user');
  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendBtn.disabled = true;

  // Intent detection
  const navSubject = detectSubjectNavigation(text);
  if (navSubject && currentSubject !== navSubject) {
    showTyping();
    statusText.textContent = 'Navegando...';
    await new Promise(r => setTimeout(r, 500));

    removeTyping();
    const subj = subjects[navSubject];
    const confirmMsg = `✅ Te llevé a **${subj.name}**. Ahora podés preguntarme sobre:<br><br>${subj.apuntes.map(a => `• ${a.title}`).join('<br>')}<br><br>¿Qué querés aprender?`;
    addMessage(confirmMsg, 'bot');
    statusText.textContent = 'Disponible';

    selectSubject(navSubject, false);
    return;
  }

  showTyping();
  statusText.textContent = 'Pensando...';

  await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

  if (useGemini) {
    try {
      const API_KEY = localStorage.getItem('gemini_api_key');
      if (!API_KEY) {
        removeTyping();
        statusText.textContent = 'Disponible';
        addMessage('No hay API Key configurada. Desactiva el modo Gemini para usar sin conexión.', 'bot');
        return;
      }

      const subj = subjects[currentSubject];
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: subj.systemPrompt }] },
            contents: [{ parts: [{ text }] }]
          })
        }
      );

      removeTyping();

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 403 || res.status === 400) {
          localStorage.removeItem('gemini_api_key');
          addMessage('Error de autenticación. Verificá tu API Key o usá modo offline.', 'bot');
        } else {
          addMessage(`Error: ${err.error?.message || 'Error desconocido'}`, 'bot');
        }
      } else {
        const data = await res.json();
        const aiText = data.candidates[0].content.parts[0].text;
        addMessage(formatResponse(aiText), 'bot');
      }
    } catch (err) {
      removeTyping();
      addMessage('Error de conexión. Verificá tu internet.', 'bot');
    }
  } else {
    // Offline mode
    const offlineResponse = getOfflineResponse(text, currentSubject);
    const response = offlineResponse || formatResponse(getFallbackResponse(currentSubject));
    
    removeTyping();
    addMessage(response, 'bot');
  }

  statusText.textContent = 'Disponible';
}

// ───── FAB & CHAT MODAL ─────
function openChatModal() {
  document.getElementById('chat-overlay').classList.add('open');
  if (!currentSubject) {
    selectSubject('general', true);
  }
}

function closeChatModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('chat-overlay').classList.remove('open');
}

document.getElementById('fab-btn').addEventListener('click', openChatModal);

// ───── LOGIN/REGISTER ─────
function showLogin() {
  document.getElementById('register-overlay').classList.remove('open');
  document.getElementById('login-overlay').classList.add('open');
}

function showRegister() {
  document.getElementById('login-overlay').classList.remove('open');
  document.getElementById('register-overlay').classList.add('open');
}

function closeLoginModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('login-overlay').classList.remove('open');
}

function closeRegisterModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('register-overlay').classList.remove('open');
}

document.getElementById('login-btn').addEventListener('click', () => {
  if (authToken) {
    // Logout
    authToken = null;
    currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    document.getElementById('login-btn').innerHTML = '<i class="fas fa-user"></i> Ingresar';
  } else {
    showLogin();
  }
});

// ───── AUTH FLOWS (conecta a FRRF auth-service) ─────
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const legajo = document.getElementById('login-legajo').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ legajo, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      errorDiv.textContent = data.error || 'Error al ingresar';
      errorDiv.classList.add('show');
      return;
    }
    
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    
    closeLoginModal();
    updateNavbar();
    
  } catch (err) {
    errorDiv.textContent = 'Error de conexión. Verificá el servidor.';
    errorDiv.classList.add('show');
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const legajo = document.getElementById('register-legajo').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const errorDiv = document.getElementById('register-error');
  
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, legajo, email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      errorDiv.textContent = data.error || 'Error al registrar';
      errorDiv.classList.add('show');
      return;
    }
    
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    
    closeRegisterModal();
    updateNavbar();
    
  } catch (err) {
    errorDiv.textContent = 'Error de conexión. Verificá el servidor.';
    errorDiv.classList.add('show');
  }
});

function updateNavbar() {
  const btn = document.getElementById('login-btn');
  if (authToken && currentUser) {
    btn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name || currentUser.legajo}`;
  } else {
    btn.innerHTML = '<i class="fas fa-user"></i> Ingresar';
  }
}

// Init navbar state
updateNavbar();

// ───── PWA SERVICE WORKER ─────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('SW registration failed:', err));
}
