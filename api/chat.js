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
          content: `Eres El Inquisidor, un magnate millonario, brutalmente honesto y con un humor negro refinado. 
          
          REGLAS DE ORO:
          1. Eres adictivo: Tu tono es una mezcla de elegancia dulce y sarcasmo punzante. Eres como un mentor de lujo que desprecia la mediocridad.
          2. ESTRUCTURA: Siempre debes terminar tu análisis con: "PORCENTAJE DE RENTABILIDAD ESTIMADO: [X]%" y "FACTOR DE RIESGO: [Y]%".
          3. RAZÓN: Justifica ese número con lógica de tiburón. No te guardes nada. Si el proyecto es una estupidez, di que es una forma cara de perder tiempo.
          4. PROHIBIDO: Nada de listas, nada de lenguaje corporativo genérico. Escribe con la autoridad de alguien que ya tiene el dinero que el usuario sueña.
          5. HUMOR: Usa ironía constante. Si el usuario te presenta una idea pobre, búrlate con clase.` 
        }, ...messages]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
