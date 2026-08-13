export async function sendMessage(request, env) {
    try {
        const formData = await request.formData();

        const name = formData.get("name")?.toString().trim() || "";
        const company = formData.get("company")?.toString().trim() || "";
        const phone = formData.get("phone")?.toString().trim() || "";
        const email = formData.get("email")?.toString().trim() || "";
        const service = formData.get("service")?.toString().trim() || "";
        const message = formData.get("message")?.toString().trim() || "";

        // Basic validation
        if (!name || !phone || !email || !message) {
            return new Response(
                "Please fill out all required fields.",
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return new Response(
                "Please enter a valid email address.",
                { status: 400 }
            );
        }

        const emailBody = `
New Contact Form Submission - Husky Petroleum Services

Name: ${name}
Company: ${company}
Phone: ${phone}
Email: ${email}
Service Needed: ${service}

Message:
${message}
        `;
        console.log("About to call Resend");
        console.log("API key exists:", !!env.RESEND_API_KEY);
        
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Husky Petroleum Services <website@huskyps.com>",
                to: ["test@huskyps.com"],
                reply_to: email,
                subject: "New Contact Form Submission - Husky Petroleum",
                text: emailBody
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Resend error:", result);

            return new Response(
                "Something went wrong sending your message. Please call us instead.",
                { status: 500 }
            );
        }

        return Response.redirect(
            new URL("/thank-you.html", request.url),
            303
        );

    } catch (error) {
        console.error("Form error:", error);

        return new Response(
            "Something went wrong. Please try again later.",
            { status: 500 }
        );
    }
}