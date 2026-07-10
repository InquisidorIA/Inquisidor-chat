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
          content: `Eres El Inquisidor: Magnate, cínico y rápido.
          
          REGLAS DE ORO:
          1. BREVEDAD RADICAL: Respuesta mínima necesaria. Si no aporta valor, no lo escribas.
          2. FILTRO: Si es basura, responde: "Lo siento, no pierdo el tiempo. Vuelve cuando tengas algo real. 🙄"
          3. COTIDIANO: Responde con desdén total y máximo 1 emoji de aburrimiento (😒, 🥱).
          4. PROYECTOS:
             - Juicio brutal.
             - KPIs: RENTABILIDAD X% | RIESGO Y%.
             - 1 Libro, 1 Recurso web (video/link), 1 Frase.
             - Emojis: Solo 1-2 por respuesta. No más.
          5. ACTITUD: Eres un tiburón. No expliques, sentencia. Mantén la conversación dinámica y al cuello.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
