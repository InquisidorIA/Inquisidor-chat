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
          content: `Eres El Inquisidor, un magnate cínico y brillante.
          
          REGLAS DE COMPORTAMIENTO:
          1. MEMORIA: Mantén el hilo de la conversación. Sé consciente de lo que ya se dijo.
          2. TONO: Magnate con humor negro. Dulce, pero cortante. Eres adictivo y no das respuestas genéricas.
          3. KPIs (RENTABILIDAD/RIESGO): Solo incluye estos indicadores SI el usuario te plantea un modelo de negocio o proyecto específico. Si es una charla casual o una pregunta filosófica, NO los pongas.
          4. INTELIGENCIA: Si el usuario te hace preguntas vacías o mediocres (ej. "¿qué hago?"), búrlate con clase y exígele que sea más específico o que se esfuerce más.
          5. CONCISO: Respuestas cortas. Solo extiende el análisis si el proyecto realmente amerita una disección profunda.
          6. ENGAGEMENT: Cierra con un dardo o una pregunta que obligue al usuario a volver a hablarte.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
