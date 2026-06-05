// Vercel serverless function — POST /api/contact
// Forwards form submissions to samitabaleon@gmail.com via Resend.
// Anti-spam: honeypot field + time-trap + origin check + size caps.

const TO_EMAIL = "samitabaleon@gmail.com";
const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";

const ALLOWED_ORIGINS = [
    "https://portfolio-kappa-blue-50.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
];

function isAllowedOrigin(origin) {
    if (!origin) return false;
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    // Allow Vercel preview deployments for this project
    return /^https:\/\/portfolio-[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
}

function buildEmailHTML({ name, email, whatsapp, subject, message }) {
    return `<!doctype html>
<html><body style="font-family:ui-sans-serif,system-ui,sans-serif;background:#f6f6f6;padding:24px;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
    <div style="background:#0d1117;padding:18px 24px;color:#fff;">
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.08em;color:#4aa3e5;text-transform:uppercase;">New contact</div>
      <div style="font-size:18px;font-weight:600;margin-top:4px;">${esc(subject)}</div>
    </div>
    <div style="padding:20px 24px;">
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;width:90px;">From</td><td style="padding:6px 0;">${esc(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#4aa3e5;text-decoration:none;">${esc(email)}</a></td></tr>
        ${whatsapp ? `<tr><td style="padding:6px 0;color:#666;">WhatsApp</td><td style="padding:6px 0;"><a href="https://wa.me/${esc(whatsapp.replace(/[^0-9]/g, ""))}" style="color:#2ecc71;text-decoration:none;">${esc(whatsapp)}</a></td></tr>` : ""}
      </table>
      <hr style="border:0;border-top:1px solid #eee;margin:18px 0;" />
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.55;color:#1a1a1a;">${esc(message)}</div>
    </div>
    <div style="background:#fafafa;padding:12px 24px;font-size:11px;color:#999;">Sent from portfolio contact form · Reply directly to reach ${esc(name)}.</div>
  </div>
</body></html>`;
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Origin check
    const origin = req.headers.origin || req.headers.referer || "";
    if (!isAllowedOrigin(origin.replace(/\/$/, "").replace(/(https?:\/\/[^/]+).*$/, "$1"))) {
        return res.status(403).json({ error: "Forbidden origin" });
    }

    let body = req.body;
    if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Bad JSON" }); }
    }
    if (!body || typeof body !== "object") return res.status(400).json({ error: "No body" });

    const { name, email, whatsapp, subject, message, website, startedAt } = body;

    // Honeypot — bots fill hidden fields
    if (website && String(website).trim().length > 0) {
        return res.status(200).json({ ok: true }); // silent accept
    }

    // Time-trap — humans take more than 3s to fill a form
    const elapsed = Date.now() - Number(startedAt || 0);
    if (!Number.isFinite(elapsed) || elapsed < 3000 || elapsed > 1000 * 60 * 60) {
        return res.status(200).json({ ok: true }); // silent accept
    }

    // Validation
    const errors = [];
    if (!name || String(name).trim().length < 2) errors.push("name");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
    if (!subject || String(subject).trim().length < 2) errors.push("subject");
    if (!message || String(message).trim().length < 10) errors.push("message");
    if (String(message || "").length > 5000) errors.push("message_too_long");
    if (errors.length) return res.status(400).json({ error: "Validation failed", fields: errors });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY env var not set");
        return res.status(500).json({ error: "Server not configured" });
    }

    const payload = {
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${String(subject).slice(0, 120)}`,
        html: buildEmailHTML({ name, email, whatsapp, subject, message }),
        text: `From: ${name} <${email}>\n${whatsapp ? `WhatsApp: ${whatsapp}\n` : ""}\n${message}`,
    };

    try {
        const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
            console.error("Resend API error", r.status, data);
            return res.status(502).json({ error: "Mail relay failed", detail: data?.message || r.statusText });
        }
        return res.status(200).json({ ok: true, id: data.id });
    } catch (err) {
        console.error("Resend fetch error", err);
        return res.status(502).json({ error: "Network error contacting Resend" });
    }
};
