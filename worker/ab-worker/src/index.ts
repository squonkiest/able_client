/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  API_BASE_URL: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // Read cookies
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map(c => {
        let [k, v] = c.trim().split("=");
        return [k, v];
      }).filter(([k, v]) => k && v)
    );

    let userId = cookies["user_id"];
    let variant = cookies["button_variant"];

    // Assign cookies if not present
    let newCookies: string[] = [];
    if (!userId) {
      userId = crypto.randomUUID();
      newCookies.push(`user_id=${userId}; Path=/; HttpOnly; SameSite=Lax`);
    }

    if (!variant) {
      variant = Math.random() < 0.5 ? "A" : "B";
      newCookies.push(`button_variant=${variant}; Path=/; HttpOnly; SameSite=Lax`);

      // Call backend to register assignment
      ctx.waitUntil(fetch(`${env.API_BASE_URL}/api/shop/buy-now-assigned`, {
        method: "POST",
        headers: {
          "Cookie": `user_id=${userId}; button_variant=${variant}`
        }
      }));
    }

    // Fetch actual React app (frontend hosted on Pages or elsewhere)
    const response = await fetch(request);

    // Clone and add cookies if new
    let resHeaders = new Headers(response.headers);
    if (newCookies.length > 0) {
      newCookies.forEach(c => resHeaders.append("Set-Cookie", c));
    }

    return new Response(await response.arrayBuffer(), {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders
    });
	},
} satisfies ExportedHandler<Env>;
