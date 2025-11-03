// Supabase Edge Function: verify-image

// 1. Get the API Key from Supabase Environment Secrets
// The key is accessed via Deno.env.get() - it is never exposed to the client.
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Use a standard Gemini model - change to gemini-1.5-pro if you need better accuracy
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Allowed origins - add your production domain here
const ALLOWED_ORIGINS = [
  /^http:\/\/localhost:\d+$/, // Matches http://localhost:3000, http://localhost:5173, etc.
  /^http:\/\/127\.0\.0\.1:\d+$/, // Matches http://127.0.0.1:3000, etc.
  // Add your production domain here, e.g.:
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com',
];

/**
 * Get CORS headers based on the request origin
 */
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin');
  let allowedOrigin = '*';

  // If origin is provided and matches allowed patterns, use it
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      allowedOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

Deno.serve(async req => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'Server configuration error: API Key missing',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // --- UPDATED: Now expecting issueCategory and userDescription from the client ---
    const { base64Data, mimeType, issueCategory, userDescription } =
      await req.json();

    if (!base64Data || !mimeType || !issueCategory || !userDescription) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: 'base64Data', 'mimeType', 'issueCategory', or 'userDescription'.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // --- 2. Define the Structured API Payload ---
    const systemInstruction = `You are an infrastructure data verifier. Your task is to verify an uploaded image and its text description against the specific issue category provided. Respond ONLY with a single JSON object.

1. Image Check: Verify if the image clearly matches the issue category of '${issueCategory}'. Set 'image_content_verified' to true or false. If false, set 'image_verification_message' to "Image does not match issue category: " followed by a brief, specific explanation.

2. Description Check: Check the user's description for relevant keywords related to the category '${issueCategory}'. Set 'description_keyword_verified' to true or false. If false, set 'description_verification_message' to "Please use keywords related to the issue category (e.g., 'pothole', 'submerged', 'broken pipe')."

3. Final Check: Set 'is_verified' to true only if BOTH image and description are verified.`;

    const userQuery = `Issue Category: ${issueCategory}. User Description: "${userDescription}". Analyze the image and text against this category.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userQuery,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: systemInstruction,
          },
        ],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        // --- UPDATED: New fields for specific verification messages ---
        responseSchema: {
          type: 'OBJECT',
          properties: {
            is_verified: {
              type: 'BOOLEAN',
            },
            primary_classification: {
              type: 'STRING',
            },
            confidence_score: {
              type: 'NUMBER',
            },
            image_content_verified: {
              type: 'BOOLEAN',
            },
            image_verification_message: {
              type: 'STRING',
            },
            description_keyword_verified: {
              type: 'BOOLEAN',
            },
            description_verification_message: {
              type: 'STRING',
            }, // Holds the specific message if description_keyword_verified is false
          },
          required: [
            'is_verified',
            'primary_classification',
            'confidence_score',
            'image_content_verified',
            'image_verification_message',
            'description_keyword_verified',
            'description_verification_message',
          ],
        },
      },
    };

    // --- 3. Execute Secure Call to Gemini API ---
    console.log('Calling Gemini API:', {
      url: API_URL,
      hasApiKey: !!GEMINI_API_KEY,
      payloadSize: JSON.stringify(payload).length,
    });

    const geminiResponse = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const geminiResult = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API Error Details:', {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        error: geminiResult,
        apiKeyLength: GEMINI_API_KEY?.length,
      });

      // Return detailed error message to help with debugging
      const errorCorsHeaders = getCorsHeaders(req);
      return new Response(
        JSON.stringify({
          error: 'Gemini API failed to process request.',
          details:
            geminiResult.error?.message ||
            geminiResult.message ||
            'Unknown error',
          status: geminiResponse.status,
        }),
        {
          status: 502,
          headers: { ...errorCorsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extract the generated JSON string
    const jsonText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) {
      return new Response(
        JSON.stringify({
          error: 'AI response was empty or malformed.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse and return the structured result back to the client
    // Ensure CORS headers are fresh for this response
    const responseCorsHeaders = getCorsHeaders(req);
    return new Response(jsonText, {
      status: 200,
      headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Supabase Function Error:', error);
    // Ensure CORS headers are fresh for error response
    const errorCorsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({
        error: 'An internal server error occurred.',
      }),
      {
        status: 500,
        headers: { ...errorCorsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
