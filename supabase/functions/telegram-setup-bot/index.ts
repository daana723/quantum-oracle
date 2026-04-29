// Configures the connected Telegram bot for Mini App launch.
// - Sets the chat menu button to open the Mini App URL
// - Registers /start command so users see a launch entry point
// Call once after deploy (or any time the app URL changes).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

    let body: { app_url?: string; button_text?: string } = {};
    try {
      body = await req.json();
    } catch {
      // empty body is fine
    }

    const appUrl = body.app_url;
    if (!appUrl || !/^https:\/\//.test(appUrl)) {
      return new Response(
        JSON.stringify({
          error:
            "Provide an HTTPS app_url in the request body (your published Lovable URL).",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const buttonText = body.button_text ?? "🔮 Launch Oracle";

    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": TELEGRAM_API_KEY,
      "Content-Type": "application/json",
    };

    // 1. Set the persistent chat menu button to launch the Mini App
    const menuRes = await fetch(`${GATEWAY_URL}/setChatMenuButton`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: buttonText,
          web_app: { url: appUrl },
        },
      }),
    });
    const menuData = await menuRes.json();
    if (!menuRes.ok) {
      throw new Error(
        `setChatMenuButton failed [${menuRes.status}]: ${JSON.stringify(menuData)}`,
      );
    }

    // 2. Register basic bot commands
    const cmdRes = await fetch(`${GATEWAY_URL}/setMyCommands`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        commands: [
          { command: "start", description: "Open the Quantum Veil Oracle" },
          { command: "help", description: "About this Mini App" },
        ],
      }),
    });
    const cmdData = await cmdRes.json();
    if (!cmdRes.ok) {
      throw new Error(
        `setMyCommands failed [${cmdRes.status}]: ${JSON.stringify(cmdData)}`,
      );
    }

    // 3. Set the long description (shown on the bot's profile page)
    await fetch(`${GATEWAY_URL}/setMyDescription`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        description:
          "✨ Welcome to the Quantum Veil Oracle ✨\n\nA meditative tarot experience blending quantum metaphor with cosmic astrology. Draw cards, explore spreads, and reflect on the cosmic weather.\n\nTap the 🔮 menu button below to launch the app inside Telegram.",
      }),
    });

    // 4. Set the short description (shown in the chat list & link previews)
    await fetch(`${GATEWAY_URL}/setMyShortDescription`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        short_description:
          "Tap the menu button to open the Quantum Veil Oracle Mini App. 🔮",
      }),
    });

    // 4. Get bot info to confirm
    const meRes = await fetch(`${GATEWAY_URL}/getMe`, {
      method: "POST",
      headers,
    });
    const meData = await meRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        bot: meData.result,
        menu_button: { text: buttonText, url: appUrl },
        message:
          "Bot configured. Open your bot in Telegram and tap the menu button to launch the Mini App.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("telegram-setup-bot error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
