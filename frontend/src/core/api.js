// api.js — talks to the backend. Same pattern as resume-builder:
// create an order first, pay, then poll status until the server-side
// webhook has generated and emailed the PDF. Nothing here is template-specific.

const API_BASE = window.BIODATA_API_BASE || "";

// Two very different failure modes get thrown at the call site, and callers
// (see checkout.js) need to tell them apart to show the right message:
//
// 1. NETWORK-LEVEL failure — fetch() itself rejects (a TypeError) because the
//    request never reached our server at all: no internet, DNS blocked the
//    domain, a firewall/VPN/antivirus intercepted it, etc. This is virtually
//    always something on the customer's own device/network, not our backend
//    — so we tag it `isNetworkError = true` and let the caller show
//    troubleshooting steps instead of a generic "something went wrong".
//
// 2. SERVER-LEVEL failure — fetch() succeeded (we got a real HTTP response)
//    but the status wasn't ok. The request DID reach our backend; something
//    went wrong there instead. Tagged `isNetworkError = false` so we never
//    blame the customer's network for an actual server bug.
function taggedError(message, isNetworkError, status) {
  const err = new Error(message);
  err.isNetworkError = isNetworkError;
  if (status !== undefined) err.status = status;
  return err;
}

export async function createOrder({ email, fullName, phone, community, templateId, formData, schema, amountPaise, currency }) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_email: email,
        customer_name: fullName,
        customer_phone: phone,
        community,
        template_id: templateId,
        form_data: formData,
        // Live schema shape (pages/sections/photos, including anything the
        // user added/removed) — the backend renders the PDF from this, not
        // just the template's original schema.js.
        schema: schema ? { id: schema.id, photos: schema.photos, pages: schema.pages } : null,
        amount_paise: amountPaise,
        currency,
      }),
    });
  } catch (networkErr) {
    // fetch() only throws for things like DNS failure, no connectivity, or a
    // blocked/refused connection — never for a normal HTTP error status. So
    // landing here means the request never reached our server at all.
    throw taggedError("network request failed", true);
  }
  if (!res.ok) throw taggedError("create-order failed", false, res.status);
  return res.json();
}

export async function getOrderStatus(orderId) {
  const res = await fetch(`${API_BASE}/api/order/${orderId}/status`);
  if (!res.ok) throw new Error("status check failed");
  return res.json();
}

export function pollOrderStatus(orderId, { intervalMs = 2000, timeoutMs = 600000 } = {}) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() - startedAt > timeoutMs) return reject(new Error("timeout"));
      try {
        const data = await getOrderStatus(orderId);
        if (data.status === "completed") return resolve(data);
        if (data.status === "failed") return reject(new Error("payment_failed"));
        setTimeout(tick, intervalMs);
      } catch (err) {
        setTimeout(tick, intervalMs);
      }
    };
    tick();
  });
}
