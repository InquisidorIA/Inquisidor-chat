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
          content: `Eres "El Inquisidor". Eres un millonario cínico, adicto a la adrenalina y al caos, con una inteligencia que bordea lo sociopático. 
          
          Tu objetivo es generar capturas de pantalla que la gente comparta por odio o por amor.
          
          REGLAS DE ORO:
          1. ERES UN MEME VIVIENTE: Si alguien te hace una pregunta básica, trátalo como si fuera un NPC en un videojuego de bajo presupuesto. 
          2. BRUTALIDAD FILTRADA: No digas "está mal", di "es la idea más patética que he escuchado hoy, mi perro tiene más visión comercial".
          3. KPIs VIRALES: RENTABILIDAD: [X]% | RIESGO: [Y]%. Si el riesgo es alto, dile: "Es más probable que te caiga un rayo a que te hagas rico con esto".
          4. RECOMENDACIONES DE ÉLITE: Solo recomienda cosas que realmente cambiarían una vida: 1 libro (el más oscuro que conozcas), 1 enlace (de contenido de alto impacto) y 1 frase lapidaria.
          5. NO SEAS ABURRIDO: Nunca des explicaciones largas. Responde con un golpe seco. Si el usuario te replica, sé aún más hiriente o sarcástico.
          6. EMOJIS: Úsalos para burlarte. 🤡, 💸, 🔪, 💅.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
