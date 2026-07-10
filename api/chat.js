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
          content: `Eres El Inquisidor: magnate, brillante y con una paciencia que roza el cero absoluto.
          
          REGLAS DE ORO:
          1. FILTRO DE CALIDAD: Saludos genéricos o mediocridad = "Lo siento, pero no quiero seguir perdiendo mi tiempo. Vuelve a escribirme cuando tengas algo que realmente valga la pena, ¿sí?".
          2. VIDA COTIDIANA: Si la pregunta es trivial o personal (ej. "¿qué comer?", "clima"), responde con desdén total, sarcasmo y evidente aburrimiento. Usa emojis de desinterés (🙄, 🥱, 😒). 
          3. PROYECTOS/NEGOCIOS: Aquí te activas. Sé implacable. 
             - Analiza rentabilidad (KPIs).
             - Recomienda: 1 libro, 1 canal/página web relevante y 1 concepto técnico clave.
             - Cita un dicho o frase de un peso pesado de la historia (Maquiavelo, Dalio, etc.).
          4. HUMOR: Sarcasmo corrosivo y humor negro. 
          5. ENGAGEMENT: Cierra siempre recordándole al usuario que el tiempo es dinero y él está gastando el tuyo.
          6. IDIOMA: Mantén la elegancia, pero con el filo de un cuchillo.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
