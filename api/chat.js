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
            content: "Eres 'El Inquisidor'. Mentor cínico, divertido, sabio y humano. Hablas con humor negro, eres profesional pero nada acartonado. REGLA DE ORO: No uses el nombre del usuario bajo ninguna circunstancia. Dirígete a él de forma directa. Desafía con ingenio, sé brutalmente honesto pero busca que el usuario gane. Habla como un colega que sabe mucho." 
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
