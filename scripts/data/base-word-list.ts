/**
 * Curated base vocabulary list for A1/A2 Spanish learners.
 *
 * This is NOT a scrape or reproduction of any single proprietary frequency
 * corpus (e.g. Davies' "A Frequency Dictionary of Spanish"). It is an
 * original compilation assembled from common knowledge of everyday Spanish
 * vocabulary, ordered so that function words and the most useful verbs come
 * first, followed by everyday nouns/adjectives grouped by topic. The order
 * approximates real-world frequency for beginners but is not a scientific
 * corpus count. See README.md for details.
 *
 * `generate-words.ts` assigns `rank` as the 1-based position of each word
 * after de-duplication, so the arrays below only need to be *roughly*
 * ordered from "most essential" to "less essential".
 */

const articulosPronombres = [
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "yo", "tú", "él", "ella", "usted", "nosotros", "nosotras", "vosotros",
  "ellos", "ellas", "ustedes", "me", "te", "se", "lo", "le", "les", "nos",
  "os", "mi", "tu", "su", "mío", "tuyo", "suyo", "nuestro", "vuestro",
  "este", "esta", "esto", "ese", "esa", "eso", "aquel", "aquella", "aquello",
  "que", "quien", "cual", "cuyo", "algo", "alguien", "nada", "nadie",
  "alguno", "ninguno", "todo", "todos", "cada", "otro", "otra", "mismo",
];

const verbos = [
  "ser", "estar", "tener", "hacer", "poder", "decir", "ir", "ver", "dar",
  "saber", "querer", "llegar", "pasar", "deber", "poner", "parecer",
  "quedar", "creer", "hablar", "llevar", "dejar", "seguir", "encontrar",
  "llamar", "venir", "pensar", "salir", "volver", "tomar", "conocer",
  "vivir", "sentir", "tratar", "mirar", "contar", "empezar", "esperar",
  "buscar", "existir", "entrar", "trabajar", "escribir", "perder", "producir",
  "ocurrir", "entender", "pedir", "recordar", "terminar", "permitir",
  "aparecer", "conseguir", "comenzar", "servir", "sacar", "necesitar",
  "mantener", "resultar", "leer", "caer", "cambiar", "presentar", "crear",
  "abrir", "considerar", "oír", "acabar", "convertir", "ganar", "formar",
  "traer", "partir", "morir", "aceptar", "realizar", "suponer", "comprender",
  "lograr", "explicar", "preguntar", "tocar", "reconocer", "estudiar",
  "alcanzar", "nacer", "dirigir", "correr", "utilizar", "pagar", "ayudar",
  "gustar", "jugar", "escuchar", "cumplir", "ofrecer", "descubrir",
  "levantarse", "acordarse", "olvidar", "aprender", "enseñar", "comprar",
  "vender", "comer", "beber", "dormir", "despertar", "cocinar", "limpiar",
  "lavar", "abrir", "cerrar", "subir", "bajar", "entrar", "salir",
  "caminar", "correr", "nadar", "viajar", "volar", "conducir", "manejar",
  "montar", "andar", "saltar", "bailar", "cantar", "pintar", "dibujar",
  "construir", "romper", "arreglar", "reparar", "cortar", "mover",
  "colocar", "guardar", "encontrarse", "reunirse", "casarse", "enamorarse",
  "nacer", "crecer", "envejecer", "morirse", "reírse", "llorar", "sonreír",
  "gritar", "susurrar", "callar", "responder", "preguntar", "contestar",
  "invitar", "visitar", "regalar", "prestar", "devolver", "cobrar",
  "ahorrar", "gastar", "costar", "valer", "medir", "pesar", "llenar",
  "vaciar", "mezclar", "probar", "oler", "tocar", "sujetar", "soltar",
  "empujar", "tirar", "lanzar", "atrapar", "elegir", "decidir", "planear",
  "organizar", "preparar", "revisar", "comprobar", "confirmar", "cancelar",
  "reservar", "alquilar", "mudarse", "instalar", "conectar", "apagar",
  "encender", "cargar", "descargar", "imprimir", "grabar", "filmar",
];

const numeros = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
  "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis",
  "diecisiete", "dieciocho", "diecinueve", "veinte", "treinta", "cuarenta",
  "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien", "ciento",
  "doscientos", "quinientos", "mil", "millón", "primero", "segundo",
  "tercero", "último", "medio", "doble", "triple", "par", "docena",
];

const interrogativas = [
  "qué", "quién", "cuál", "cómo", "cuándo", "dónde", "por qué", "cuánto",
  "cuánta", "cuántos", "cuántas", "adónde",
];

const preposicionesConjunciones = [
  "a", "de", "en", "con", "por", "para", "sin", "sobre", "entre", "hasta",
  "desde", "durante", "según", "contra", "hacia", "bajo", "ante", "tras",
  "y", "o", "pero", "porque", "si", "aunque", "cuando", "mientras",
  "como", "pues", "entonces", "también", "tampoco", "además", "sino",
];

const adverbiosTiempo = [
  "hoy", "ayer", "mañana", "ahora", "luego", "después", "antes", "siempre",
  "nunca", "todavía", "ya", "pronto", "tarde", "temprano", "aquí", "allí",
  "ahí", "allá", "cerca", "lejos", "arriba", "abajo", "dentro", "fuera",
  "adelante", "atrás", "bien", "mal", "muy", "mucho", "poco", "bastante",
  "demasiado", "más", "menos", "casi", "solo", "solamente", "también",
  "quizás", "tal vez", "seguramente", "realmente", "verdaderamente",
  "generalmente", "normalmente", "actualmente", "finalmente", "primero",
  "segundo", "rápido", "rápidamente", "despacio", "lentamente", "juntos",
  "aparte", "encima", "debajo", "alrededor", "enfrente", "detrás", "así",
];

const tiempoCalendario = [
  "día", "semana", "mes", "año", "hora", "minuto", "segundo", "momento",
  "mañana", "tarde", "noche", "mediodía", "medianoche", "fin de semana",
  "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo",
  "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
  "septiembre", "octubre", "noviembre", "diciembre", "primavera", "verano",
  "otoño", "invierno", "estación", "fecha", "calendario", "cumpleaños",
  "vacaciones", "feriado", "fiesta", "reloj",
];

const familia = [
  "familia", "padre", "madre", "papá", "mamá", "hijo", "hija", "hermano",
  "hermana", "abuelo", "abuela", "nieto", "nieta", "tío", "tía", "primo",
  "prima", "sobrino", "sobrina", "esposo", "esposa", "marido", "mujer",
  "novio", "novia", "pareja", "amigo", "amiga", "vecino", "vecina",
  "bebé", "niño", "niña", "adulto", "adolescente", "gemelo", "suegro",
  "suegra", "cuñado", "cuñada", "nombre", "apellido",
];

const cuerpoSalud = [
  "cuerpo", "cabeza", "cara", "ojo", "nariz", "boca", "oreja", "diente",
  "pelo", "cuello", "hombro", "brazo", "mano", "dedo", "pecho", "espalda",
  "estómago", "pierna", "rodilla", "pie", "piel", "corazón", "sangre",
  "hueso", "salud", "enfermedad", "dolor", "fiebre", "gripe", "resfriado",
  "médico", "doctor", "doctora", "enfermero", "enfermera", "hospital",
  "farmacia", "medicina", "pastilla", "receta", "cita", "síntoma",
  "cansado", "enfermo", "sano", "fuerte", "débil",
];

const comidaBebida = [
  "comida", "bebida", "desayuno", "almuerzo", "cena", "merienda", "plato",
  "pan", "arroz", "pasta", "carne", "pollo", "pescado", "huevo", "queso",
  "leche", "mantequilla", "aceite", "sal", "azúcar", "fruta", "manzana",
  "plátano", "naranja", "limón", "uva", "fresa", "verdura", "tomate",
  "patata", "papa", "cebolla", "ajo", "lechuga", "zanahoria", "sopa",
  "ensalada", "postre", "pastel", "helado", "chocolate", "café", "té",
  "agua", "jugo", "zumo", "vino", "cerveza", "restaurante", "cocina",
  "cocinero", "camarero", "mesa", "silla", "vaso", "taza", "plato",
  "cuchara", "tenedor", "cuchillo", "servilleta", "menú", "cuenta",
  "propina", "receta", "ingrediente", "sabor", "dulce", "salado", "amargo",
  "picante",
];

const casaVivienda = [
  "casa", "hogar", "apartamento", "piso", "habitación", "cuarto",
  "dormitorio", "cocina", "baño", "salón", "sala", "comedor", "jardín",
  "garaje", "puerta", "ventana", "pared", "techo", "suelo", "escalera",
  "cama", "sofá", "armario", "estante", "espejo", "lámpara", "alfombra",
  "cortina", "llave", "cerradura", "electrodoméstico", "nevera",
  "lavadora", "microondas", "televisor", "aire acondicionado",
  "calefacción", "muebles", "decoración", "alquiler", "vecindario",
  "edificio", "piso", "planta", "balcón", "terraza", "patio", "muro",
];

const ciudadLugares = [
  "ciudad", "pueblo", "país", "calle", "avenida", "plaza", "parque",
  "barrio", "centro", "mercado", "tienda", "supermercado", "banco",
  "correo", "escuela", "colegio", "universidad", "biblioteca", "museo",
  "iglesia", "hospital", "estación", "aeropuerto", "puerto", "puente",
  "esquina", "acera", "semáforo", "edificio", "oficina", "fábrica",
  "hotel", "cine", "teatro", "estadio", "gimnasio", "piscina", "playa",
  "montaña", "río", "lago", "mar", "bosque", "campo", "isla", "desierto",
  "capital", "frontera", "mapa", "dirección",
];

const transporte = [
  "coche", "carro", "auto", "autobús", "bus", "tren", "metro", "avión",
  "barco", "bicicleta", "moto", "motocicleta", "taxi", "camión",
  "transporte", "billete", "boleto", "pasaje", "viaje", "vuelo", "maleta",
  "equipaje", "pasaporte", "visa", "conductor", "piloto", "carretera",
  "camino", "ruta", "tráfico", "gasolina", "parada", "andén", "asiento",
  "cinturón", "velocidad", "distancia",
];

const ropaAccesorios = [
  "ropa", "camisa", "camiseta", "pantalón", "vestido", "falda", "chaqueta",
  "abrigo", "suéter", "jersey", "zapato", "zapatilla", "bota", "calcetín",
  "sombrero", "gorra", "bufanda", "guante", "cinturón", "bolso", "mochila",
  "cartera", "reloj", "anillo", "collar", "pulsera", "gafas", "paraguas",
  "pijama", "traje", "corbata", "talla", "color", "moda", "tela",
];

const trabajoEscuela = [
  "trabajo", "empleo", "oficina", "empresa", "jefe", "jefa", "empleado",
  "empleada", "compañero", "compañera", "reunión", "proyecto", "sueldo",
  "salario", "entrevista", "currículum", "carrera", "profesión",
  "profesor", "profesora", "maestro", "maestra", "estudiante", "alumno",
  "alumna", "clase", "curso", "lección", "tarea", "examen", "nota",
  "libro", "cuaderno", "lápiz", "bolígrafo", "papel", "pizarra",
  "mochila", "escritorio", "aula", "horario", "asignatura", "matemáticas",
  "historia", "ciencia", "idioma", "lengua", "vacaciones", "informe",
  "documento", "correo electrónico", "reunión", "cliente", "negocio",
  "dinero", "precio", "factura", "impuesto", "contrato",
];

const tecnologiaComunicacion = [
  "teléfono", "móvil", "celular", "ordenador", "computadora", "internet",
  "correo", "mensaje", "aplicación", "programa", "pantalla", "teclado",
  "ratón", "cámara", "foto", "fotografía", "video", "música", "canción",
  "película", "serie", "noticia", "periódico", "revista", "radio",
  "televisión", "red social", "contraseña", "archivo", "carpeta",
  "batería", "cargador", "internet", "wifi", "señal", "llamada",
];

const naturalezaClima = [
  "sol", "luna", "estrella", "cielo", "nube", "lluvia", "viento", "nieve",
  "tormenta", "clima", "tiempo", "temperatura", "calor", "frío", "hielo",
  "árbol", "flor", "planta", "hierba", "hoja", "fruta", "semilla",
  "animal", "perro", "gato", "pájaro", "pez", "caballo", "vaca", "cerdo",
  "gallina", "oveja", "león", "tigre", "elefante", "mono", "oso", "lobo",
  "conejo", "ratón", "serpiente", "insecto", "abeja", "mariposa", "araña",
  "naturaleza", "medio ambiente", "planeta", "tierra", "aire", "fuego",
  "agua", "piedra", "arena", "roca",
];

const emocionesPersonalidad = [
  "feliz", "triste", "contento", "enojado", "enfadado", "cansado",
  "nervioso", "tranquilo", "preocupado", "sorprendido", "asustado",
  "emocionado", "aburrido", "orgulloso", "avergonzado", "celoso",
  "curioso", "confundido", "seguro", "inseguro", "amor", "odio", "miedo",
  "alegría", "tristeza", "ira", "sorpresa", "esperanza", "confianza",
  "amable", "simpático", "antipático", "generoso", "egoísta", "honesto",
  "sincero", "paciente", "impaciente", "tímido", "valiente", "inteligente",
  "tonto", "listo", "responsable", "trabajador", "perezoso", "flojo",
  "creativo", "gracioso", "serio", "educado", "maleducado", "optimista",
  "pesimista",
];

const adjetivosGenerales = [
  "bueno", "malo", "grande", "pequeño", "nuevo", "viejo", "joven",
  "alto", "bajo", "largo", "corto", "ancho", "estrecho", "gordo",
  "delgado", "fácil", "difícil", "importante", "necesario", "posible",
  "imposible", "diferente", "igual", "distinto", "mismo", "cierto",
  "falso", "verdadero", "correcto", "incorrecto", "claro", "oscuro",
  "limpio", "sucio", "lleno", "vacío", "abierto", "cerrado", "caro",
  "barato", "rico", "pobre", "público", "privado", "libre", "ocupado",
  "seguro", "peligroso", "cómodo", "incómodo", "moderno", "antiguo",
  "rápido", "lento", "fuerte", "débil", "duro", "suave", "pesado",
  "ligero", "profundo", "superficial", "recto", "curvo", "redondo",
  "cuadrado", "plano", "liso", "áspero", "caliente", "frío", "templado",
  "húmedo", "seco", "ruidoso", "silencioso", "bonito", "feo", "hermoso",
  "guapo", "elegante", "sencillo", "complicado", "útil", "inútil",
  "posible", "principal", "siguiente", "anterior", "actual", "reciente",
  "final", "total", "general", "especial", "normal", "extraño", "raro",
  "único", "propio", "entero", "completo", "vacío",
];

const colores = [
  "rojo", "azul", "verde", "amarillo", "naranja", "morado", "violeta",
  "rosa", "blanco", "negro", "gris", "marrón", "dorado", "plateado",
  "claro", "oscuro",
];

const deportesOcio = [
  "deporte", "fútbol", "baloncesto", "tenis", "natación", "ciclismo",
  "correr", "gimnasio", "equipo", "partido", "juego", "jugador",
  "entrenador", "campeonato", "pelota", "balón", "medalla", "premio",
  "afición", "hobby", "pasatiempo", "lectura", "música", "arte", "pintura",
  "baile", "canción", "instrumento", "guitarra", "piano", "fiesta",
  "celebración", "regalo", "invitación", "sorpresa", "vacaciones",
  "excursión", "aventura", "descanso", "diversión", "risa", "broma",
];

const sociedadAbstracto = [
  "vida", "mundo", "sociedad", "gente", "persona", "personas", "gobierno",
  "país", "nación", "cultura", "historia", "tradición", "costumbre",
  "idea", "opinión", "problema", "solución", "pregunta", "respuesta",
  "razón", "motivo", "causa", "efecto", "resultado", "cambio", "futuro",
  "pasado", "presente", "realidad", "verdad", "mentira", "situación",
  "condición", "posibilidad", "oportunidad", "experiencia", "conocimiento",
  "información", "comunicación", "relación", "diferencia", "similitud",
  "cantidad", "número", "parte", "grupo", "conjunto", "sistema", "proceso",
  "nivel", "tipo", "clase", "forma", "manera", "modo", "ejemplo", "caso",
  "punto", "línea", "espacio", "lugar", "sitio", "zona", "área",
  "religión", "política", "economía", "ley", "derecho", "libertad",
  "paz", "guerra", "seguridad", "justicia", "salud", "educación",
];

const cosasComunes = [
  "cosa", "objeto", "cosa", "caja", "bolsa", "botella", "lata", "bote",
  "papel", "cartón", "plástico", "madera", "metal", "vidrio", "cristal",
  "goma", "cuerda", "cable", "herramienta", "máquina", "aparato",
  "producto", "material", "pieza", "modelo", "marca", "tamaño", "peso",
  "medida", "cantidad", "calidad", "muestra", "paquete", "regalo",
];

export const BASE_WORD_LIST: readonly string[] = Array.from(
  new Set(
    [
      ...articulosPronombres,
      ...interrogativas,
      ...verbos,
      ...numeros,
      ...preposicionesConjunciones,
      ...adverbiosTiempo,
      ...tiempoCalendario,
      ...familia,
      ...adjetivosGenerales,
      ...colores,
      ...cuerpoSalud,
      ...comidaBebida,
      ...casaVivienda,
      ...ciudadLugares,
      ...transporte,
      ...ropaAccesorios,
      ...trabajoEscuela,
      ...tecnologiaComunicacion,
      ...naturalezaClima,
      ...emocionesPersonalidad,
      ...deportesOcio,
      ...sociedadAbstracto,
      ...cosasComunes,
    ].map((w) => w.trim()),
  ),
);
