import { sendMessage } from "./send-message.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        console.log("Request:", request.method, url.pathname);

        if (url.pathname === "/send-message" && request.method === "POST") {
            console.log("Calling sendMessage");
            return sendMessage(request, env);
        }

        return env.ASSETS.fetch(request);
    }
};