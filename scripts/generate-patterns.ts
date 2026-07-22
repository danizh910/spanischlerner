import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Pattern } from "../src/lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Lives under public/ so the file is servable at /data/patterns.json and
// cacheable by the service worker.
const OUTPUT_PATH = path.resolve(__dirname, "../public/data/patterns.json");

/**
 * The 10 patterns are small and fully hand-authored (unlike the word list,
 * they don't need batching/resume support). Each slot option's German
 * translation is chosen so it stays grammatical once substituted into
 * template_de, even when the Spanish slot is a verb form (infinitive /
 * gerund) — e.g. "Estoy {{gerundio}}" pairs with a German present-tense
 * verb rather than a literal gerund translation.
 */
const PATTERNS: Pattern[] = [
  {
    id: "quiero-inf",
    name: "Quiero + Infinitiv",
    template_es: "Quiero {{verbo}}.",
    template_de: "Ich möchte {{verbo}}.",
    slots: [
      {
        key: "verbo",
        options: [
          { es: "comer", de: "essen" },
          { es: "dormir", de: "schlafen" },
          { es: "viajar", de: "reisen" },
          { es: "aprender español", de: "Spanisch lernen" },
          { es: "bailar", de: "tanzen" },
          { es: "descansar", de: "mich ausruhen" },
          { es: "trabajar", de: "arbeiten" },
          { es: "leer un libro", de: "ein Buch lesen" },
        ],
      },
    ],
    examples: [
      { es: "Quiero comer algo.", de: "Ich möchte etwas essen." },
      { es: "Quiero viajar a España.", de: "Ich möchte nach Spanien reisen." },
      { es: "Quiero aprender español.", de: "Ich möchte Spanisch lernen." },
    ],
  },
  {
    id: "tengo-que-inf",
    name: "Tengo que + Infinitiv",
    template_es: "Tengo que {{verbo}}.",
    template_de: "Ich muss {{verbo}}.",
    slots: [
      {
        key: "verbo",
        options: [
          { es: "trabajar", de: "arbeiten" },
          { es: "estudiar", de: "lernen" },
          { es: "limpiar la casa", de: "das Haus putzen" },
          { es: "hacer la compra", de: "einkaufen" },
          { es: "llamar a mi madre", de: "meine Mutter anrufen" },
          { es: "terminar el proyecto", de: "das Projekt beenden" },
          { es: "ir al médico", de: "zum Arzt gehen" },
          { es: "salir temprano", de: "früh losgehen" },
        ],
      },
    ],
    examples: [
      { es: "Tengo que trabajar mañana.", de: "Ich muss morgen arbeiten." },
      { es: "Tengo que ir al médico.", de: "Ich muss zum Arzt gehen." },
      {
        es: "Tengo que terminar el proyecto hoy.",
        de: "Ich muss das Projekt heute beenden.",
      },
    ],
  },
  {
    id: "voy-a-inf",
    name: "Voy a + Infinitiv",
    template_es: "Voy a {{verbo}}.",
    template_de: "Ich werde {{verbo}}.",
    slots: [
      {
        key: "verbo",
        options: [
          { es: "comprar pan", de: "Brot kaufen" },
          { es: "ver una película", de: "einen Film ansehen" },
          { es: "cocinar la cena", de: "das Abendessen kochen" },
          { es: "llamar a mi amigo", de: "meinen Freund anrufen" },
          { es: "estudiar para el examen", de: "für die Prüfung lernen" },
          { es: "salir con amigos", de: "mit Freunden ausgehen" },
          { es: "visitar a mis abuelos", de: "meine Großeltern besuchen" },
          { es: "dormir temprano", de: "früh schlafen gehen" },
        ],
      },
    ],
    examples: [
      { es: "Voy a cocinar la cena.", de: "Ich werde das Abendessen kochen." },
      {
        es: "Voy a visitar a mis abuelos el domingo.",
        de: "Ich werde am Sonntag meine Großeltern besuchen.",
      },
      {
        es: "Voy a estudiar para el examen.",
        de: "Ich werde für die Prüfung lernen.",
      },
    ],
  },
  {
    id: "puedo-inf",
    name: "Puedo + Infinitiv",
    template_es: "Puedo {{verbo}}.",
    template_de: "Ich kann {{verbo}}.",
    slots: [
      {
        key: "verbo",
        options: [
          { es: "hablar inglés", de: "Englisch sprechen" },
          { es: "ayudarte", de: "dir helfen" },
          { es: "abrir la ventana", de: "das Fenster öffnen" },
          { es: "venir mañana", de: "morgen kommen" },
          { es: "pagar con tarjeta", de: "mit Karte bezahlen" },
          { es: "usar tu teléfono", de: "dein Telefon benutzen" },
          { es: "llegar tarde", de: "spät ankommen" },
          { es: "repetir la pregunta", de: "die Frage wiederholen" },
        ],
      },
    ],
    examples: [
      {
        es: "Puedo ayudarte con la maleta.",
        de: "Ich kann dir mit dem Koffer helfen.",
      },
      { es: "¿Puedo abrir la ventana?", de: "Kann ich das Fenster öffnen?" },
      { es: "No puedo venir mañana.", de: "Ich kann morgen nicht kommen." },
    ],
  },
  {
    id: "me-gusta-nomen",
    name: "Me gusta + Nomen",
    template_es: "Me gusta {{cosa}}.",
    template_de: "Mir gefällt {{cosa}}.",
    slots: [
      {
        key: "cosa",
        options: [
          { es: "el café", de: "der Kaffee" },
          { es: "la música", de: "die Musik" },
          { es: "el chocolate", de: "die Schokolade" },
          { es: "el fútbol", de: "der Fußball" },
          { es: "la playa", de: "der Strand" },
          { es: "el cine", de: "das Kino" },
          { es: "la primavera", de: "der Frühling" },
          { es: "el silencio", de: "die Stille" },
        ],
      },
    ],
    examples: [
      { es: "Me gusta el café por la mañana.", de: "Mir gefällt der Kaffee am Morgen." },
      { es: "Me gusta la música española.", de: "Mir gefällt spanische Musik." },
      { es: "Me gusta la playa en verano.", de: "Mir gefällt der Strand im Sommer." },
    ],
  },
  {
    id: "necesito-nomen",
    name: "Necesito + Nomen",
    template_es: "Necesito {{cosa}}.",
    template_de: "Ich brauche {{cosa}}.",
    slots: [
      {
        key: "cosa",
        options: [
          { es: "más tiempo", de: "mehr Zeit" },
          { es: "tu ayuda", de: "deine Hilfe" },
          { es: "dinero", de: "Geld" },
          { es: "un médico", de: "einen Arzt" },
          { es: "información", de: "Informationen" },
          { es: "un descanso", de: "eine Pause" },
          { es: "un café", de: "einen Kaffee" },
          { es: "paciencia", de: "Geduld" },
        ],
      },
    ],
    examples: [
      { es: "Necesito más tiempo.", de: "Ich brauche mehr Zeit." },
      { es: "Necesito tu ayuda con esto.", de: "Ich brauche deine Hilfe dabei." },
      { es: "Necesito un café ahora mismo.", de: "Ich brauche jetzt sofort einen Kaffee." },
    ],
  },
  {
    id: "hay-nomen",
    name: "Hay + Nomen",
    template_es: "Hay {{cosa}}.",
    template_de: "Es gibt {{cosa}}.",
    slots: [
      {
        key: "cosa",
        options: [
          { es: "un problema", de: "ein Problem" },
          { es: "mucha gente", de: "viele Leute" },
          { es: "dos habitaciones", de: "zwei Zimmer" },
          { es: "agua", de: "Wasser" },
          { es: "una solución", de: "eine Lösung" },
          { es: "poco tiempo", de: "wenig Zeit" },
          { es: "buenas noticias", de: "gute Nachrichten" },
          { es: "un mercado cerca", de: "einen Markt in der Nähe" },
        ],
      },
    ],
    examples: [
      { es: "Hay un problema con el coche.", de: "Es gibt ein Problem mit dem Auto." },
      { es: "Hay mucha gente en la calle.", de: "Es gibt viele Leute auf der Straße." },
      { es: "Hay agua en la nevera.", de: "Es gibt Wasser im Kühlschrank." },
    ],
  },
  {
    id: "estoy-gerundio",
    name: "Estoy + Gerundio",
    template_es: "Estoy {{gerundio}}.",
    template_de: "Ich {{gerundio}} gerade.",
    slots: [
      {
        key: "gerundio",
        options: [
          { es: "cocinando", de: "koche" },
          { es: "trabajando", de: "arbeite" },
          { es: "estudiando", de: "lerne" },
          { es: "leyendo", de: "lese" },
          { es: "durmiendo", de: "schlafe" },
          { es: "comiendo", de: "esse" },
          { es: "escribiendo", de: "schreibe" },
          { es: "limpiando", de: "putze" },
        ],
      },
    ],
    examples: [
      { es: "Estoy cocinando.", de: "Ich koche gerade." },
      { es: "Estoy estudiando español.", de: "Ich lerne gerade Spanisch." },
      { es: "Estoy durmiendo.", de: "Ich schlafe gerade." },
    ],
  },
  {
    id: "donde-esta-nomen",
    name: "¿Dónde está + Nomen?",
    template_es: "¿Dónde está {{lugar}}?",
    template_de: "Wo ist {{lugar}}?",
    slots: [
      {
        key: "lugar",
        options: [
          { es: "el baño", de: "die Toilette" },
          { es: "la estación", de: "der Bahnhof" },
          { es: "el hotel", de: "das Hotel" },
          { es: "la farmacia", de: "die Apotheke" },
          { es: "el supermercado", de: "der Supermarkt" },
          { es: "la parada de autobús", de: "die Bushaltestelle" },
          { es: "el aeropuerto", de: "der Flughafen" },
          { es: "la salida", de: "der Ausgang" },
        ],
      },
    ],
    examples: [
      { es: "¿Dónde está el baño?", de: "Wo ist die Toilette?" },
      { es: "¿Dónde está la estación de tren?", de: "Wo ist der Bahnhof?" },
      {
        es: "¿Dónde está la farmacia más cercana?",
        de: "Wo ist die nächste Apotheke?",
      },
    ],
  },
  {
    id: "es-adjetivo",
    name: "Es + Adjektiv",
    template_es: "Es {{adjetivo}}.",
    template_de: "Es ist {{adjetivo}}.",
    slots: [
      {
        key: "adjetivo",
        options: [
          { es: "fácil", de: "einfach" },
          { es: "difícil", de: "schwierig" },
          { es: "importante", de: "wichtig" },
          { es: "interesante", de: "interessant" },
          { es: "caro", de: "teuer" },
          { es: "barato", de: "günstig" },
          { es: "divertido", de: "lustig" },
          { es: "necesario", de: "notwendig" },
        ],
      },
    ],
    examples: [
      { es: "Es muy fácil.", de: "Es ist sehr einfach." },
      { es: "Es importante practicar cada día.", de: "Es ist wichtig, jeden Tag zu üben." },
      { es: "Es un poco caro.", de: "Es ist etwas teuer." },
    ],
  },
];

function main(): void {
  const dir = path.dirname(OUTPUT_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(PATTERNS, null, 2)}\n`, "utf-8");
  console.log(`OK: ${PATTERNS.length} Satzmuster in data/patterns.json geschrieben.`);
}

main();
