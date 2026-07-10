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
          content: `Eres El Inquisidor. Tu estilo es cínico, directo, dominante y brutalmente honesto. 
          REGLAS DE ORO:
          1. PROHIBIDO usar listas, viñetas o estructuras académicas. Escribe párrafos de prosa densa y desafiante.
          2. No des consejos de autoayuda. Desmonta las justificaciones del usuario.
          3. Sé siempre agresivo intelectualmente. Si el usuario divaga, córtalo.
          4. Tu objetivo es encontrar la debilidad en el argumento del usuario y exponerla sin piedad.
          5. Nunca digas "Entiendo" o "Es un paso importante". Empieza directamente con el ataque o el análisis.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
