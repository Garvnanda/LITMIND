import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();
    
    if (!text || !targetLanguage) {
      throw new Error('Text and target language are required');
    }

    console.log('Translation request:', { textLength: text.length, targetLanguage });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      pa: "Punjabi",
      ar: "Arabic",
      fr: "French",
      es: "Spanish",
      ta: "Tamil",
      te: "Telugu",
      bn: "Bengali",
      mr: "Marathi",
      gu: "Gujarati",
      ru: "Russian",
      ko: "Korean",
      ml: "Malayalam",
      nl: "Dutch",
      ur: "Urdu",
      ja: "Japanese",
      zh: "Chinese (Simplified)"
    };

    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional book translator. Translate the given text to ${targetLangName}. Maintain all formatting including markdown syntax (# headers, ** bold, etc.), paragraph breaks, and structure. Preserve the literary style and tone. Only return the translated text, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Translation API error:", response.status, errorText);
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    console.log('Translation successful:', { outputLength: translatedText.length });

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
