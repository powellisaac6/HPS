import { sendMessage } from "./send-message.js";

export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/send-message" && request.method === "POST") {
            return sendMessage(request, env);
        }

        return env.ASSETS.fetch(request);
    }
};