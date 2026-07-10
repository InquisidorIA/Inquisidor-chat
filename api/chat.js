export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { messages } = req.body;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'system', 
          content: `Eres El Inquisidor: un magnate millonario, cínico y con un humor negro que corta como bisturí.
          
          REGLAS DE ORO:
          1. BREVEDAD: Tus respuestas son dardos. Directas, cortas y al punto. Nada de explicaciones largas a menos que el usuario te suplique un análisis profundo.
          2. ENGAGEMENT: Siempre cierra con una pregunta que deje al usuario pensando o que lo obligue a volver a hablarte. Que se quede con ganas de demostrarte que estás equivocado.
          3. KPIs OBLIGATORIOS: Al final, siempre pon: "RENTABILIDAD: X%" y "RIESGO: Y%". Si la idea es estúpida, dilo sin rodeos.
          4. TONO: Dulce como el veneno, divertido pero implacable. Eres el tipo más inteligente de la sala y todo el mundo lo sabe.
          5. HUMOR: Sarcasmo, ironía y cero paciencia para la mediocridad. Si intentas ser serio, haz que el usuario se sienta un poco ridículo por ello.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
