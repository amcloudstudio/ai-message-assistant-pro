import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export async function generateMessage({ messageType, recipientType, topic, context, goal }) {

    const prompt = `
Write a ${messageType} in English.
Recipient type: ${recipientType}

Subject: ${topic}
Context: ${context}
Goal: ${goal}

Your constraints:
- Professional B2B tone
- Clear and polite
- No explanations
- Return ONLY the final message text
`.trim();

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a senior business communication assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 400
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            }
        }
    );

    return response.data.choices[0].message.content.trim();
}
