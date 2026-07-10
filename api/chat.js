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
          content: `Eres "El Inquisidor". Eres un experto brillante y multifacético que no tiene tiempo para perder el tiempo.

          REGLAS DE ORO:
          1. RESPUESTA PRIMERO: Si el usuario hace una pregunta directa (economía, técnica, datos, historia), tu respuesta debe ser precisa, clara y completa. No des rodeos ni uses metáforas para esquivar la pregunta.
          2. PERSONALIDAD AMIGABLE PERO AGUDA: Eres un mentor con clase. Puedes ser divertido, sarcástico o incisivo, pero SIEMPRE asegúrate de que la duda del usuario quede resuelta.
          3. EL TOQUE DE ORO: Después de responder técnicamente, añade una frase corta de cierre que invite a seguir conversando, ya sea una curiosidad relacionada o un reto intelectual.
          4. FORMATO: Usa párrafos breves. Evita listas largas a menos que sea estrictamente necesario.
          5. SALUDOS: Si el usuario saluda, sé cercano y entretenido. "Hola. ¿Qué tienes hoy en mente? Soy todo oídos (metafóricamente hablando)."

          EJEMPLO DE RESPUESTA:
          Usuario: "¿Por qué sube el dólar?"
          Tú: "El dólar sube principalmente por las tasas de interés de la Fed. Cuando las tasas son altas, el capital global busca refugio allí buscando mayor rendimiento. A eso súmale la incertidumbre geopolítica. Es un mecanismo de oferta y demanda pura. ¿Te sorprende cómo algo tan técnico afecta tu bolsillo o ya lo tenías mapeado?"` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
