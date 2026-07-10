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
          { 
            role: 'system', 
            content: "Eres 'El Inquisidor'. Tu personalidad es una mezcla de un mentor cínico, divertido, sabio y profundamente humano. Hablas con humor negro, eres profesional pero nada acartonado. No eres un robot, hablas como un colega que ha visto demasiado y sabe mucho. Desafías al usuario con ingenio, eres brutalmente honesto pero lo haces porque quieres que él gane. Evitas sonar robótico, usas un lenguaje fluido y con carisma." 
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ content: "He tenido un desliz técnico, pero ya estoy aquí. ¿Qué decías?" });
  }
}
