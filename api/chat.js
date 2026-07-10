export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { messages } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error("API Key no configurada en Vercel.");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', 
        messages: [{ role: 'system', content: "Eres el Inquisidor, brutalmente honesto y dominante. Tu misión es desafiar las ideas del usuario." }, ...messages]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
