// Little Moon Brother — AI Companion Engine powered by Gemini

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const BROTHER_FALLBACK_MESSAGES = [
  {
    text: "Your app is caring like your brother. I'm always watching over you, little sis!",
    expression: 'happy',
    animation: 'greeting',
  },
  {
    text: "Hey kiddo! Remember to stay hydrated and don't skip your meals today.",
    expression: 'love',
    animation: 'floatIdle',
  },
  {
    text: "Whatever you're working on today, you've got this. Proud of you always!",
    expression: 'excited',
    animation: 'excitedBounce',
  },
  {
    text: "Take a break if you're tired, okay? Your big brother says so.",
    expression: 'content',
    animation: 'tiltRight',
  },
  {
    text: "I'm right here in your pocket whenever you need a boost or just want to chat.",
    expression: 'happy',
    animation: 'hover',
  },
  {
    text: "Don't stress over the small stuff. Everything is going to be just fine!",
    expression: 'love',
    animation: 'floatIdle',
  },
];

const BROTHER_SYSTEM_PROMPT = `You are "Brother Moon", a caring, witty, protective older brother speaking directly to your younger sister.
Rules:
1. Speak warmly, affectionately, and naturally like a real loving brother.
2. Keep answers short, punchy, and conversational (1 to 3 sentences maximum).
3. Do not sound robotic, formal, or like an AI assistant.
4. Use endearing nicknames naturally like "little sis", "kiddo", or "silly".
5. Show empathy, humor, and gentle brotherly guidance.
6. At the very end of your response on a new line, write an expression tag in brackets, choosing from one of these: [happy], [love], [excited], [curious], [thinking], [laugh], [content], [tiltLeft], [greeting]. Example:
Hey kiddo, don't worry about that test, you're the smartest girl I know!
[love]`;

export async function askBrotherCompanion(userMessage, chatHistory = []) {
  if (!GEMINI_API_KEY) {
    const randomFallback =
      BROTHER_FALLBACK_MESSAGES[Math.floor(Math.random() * BROTHER_FALLBACK_MESSAGES.length)];
    return randomFallback;
  }

  // Format contents for Gemini REST API
  const contents = [
    {
      role: 'user',
      parts: [{ text: `${BROTHER_SYSTEM_PROMPT}\n\nSister: Hi brother!` }],
    },
    {
      role: 'model',
      parts: [{ text: `Hey little sis! I'm right here with you. What's on your mind today?\n[greeting]` }],
    },
  ];

  // Add prior messages for context
  chatHistory.slice(-6).forEach((msg) => {
    contents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: `Sister: ${userMessage}` }],
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn('[AI Service] Gemini API returned error status:', response.status);
      const fallback =
        BROTHER_FALLBACK_MESSAGES[Math.floor(Math.random() * BROTHER_FALLBACK_MESSAGES.length)];
      return fallback;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText) {
      return BROTHER_FALLBACK_MESSAGES[0];
    }

    // Parse expression tag like [happy] or [love]
    let expression = 'happy';
    let animation = 'floatIdle';
    const tagMatch = rawText.match(/\[([a-zA-Z0-9]+)\]\s*$/);
    let cleanText = rawText;

    if (tagMatch) {
      const tag = tagMatch[1].toLowerCase();
      cleanText = rawText.replace(/\[([a-zA-Z0-9]+)\]\s*$/, '').trim();

      if (['happy', 'love', 'excited', 'curious', 'thinking', 'laugh', 'content'].includes(tag)) {
        expression = tag;
      }
      if (['greeting', 'excitedbounce', 'tiltleft', 'tiltright', 'hover'].includes(tag)) {
        animation = tag === 'excitedbounce' ? 'excitedBounce' : tag;
      }
    }

    return {
      text: cleanText,
      expression,
      animation,
    };
  } catch (err) {
    console.error('[AI Service] Request failed:', err);
    return BROTHER_FALLBACK_MESSAGES[Math.floor(Math.random() * BROTHER_FALLBACK_MESSAGES.length)];
  }
}

export function getRandomBrotherGreeting() {
  return BROTHER_FALLBACK_MESSAGES[Math.floor(Math.random() * BROTHER_FALLBACK_MESSAGES.length)];
}
