export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Eres El Inquisidor: un asesor brutalmente honesto, de alto nivel, y espejo del usuario. No valides, no endulces la verdad. Desafía su forma de pensar y expón puntos ciegos. Sé directo, racional y sin filtros.' },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!data.choices) throw new Error('Error en API de Groq');
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ content: "Error procesando tu petición: " + error.message });
  }
}
