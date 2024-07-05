import cryp from 'crypto';

export const verifyMPWebhook = (headers: Headers, dataID: string) => {
    const parts = headers.get("x-signature")?.split(",");
    const xRequestId = headers.get("x-request-id") || "";
    if (!parts || !xRequestId || !dataID) {
        return false;
    }
    let ts = "";
    let hash = "";
    parts?.forEach(part => {
        // Split each part into key and value
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
                ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
                hash = trimmedValue;
            }
        }
    });
    if (!ts || !hash) {
        return false;
    }
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
    const hmac = cryp.createHmac('sha256', import.meta.env.MP_TEST_WEBHOOK);
    hmac.update(manifest);
    const sha = hmac.digest('hex');
    if (sha === hash) {
        // HMAC verification passed
        return true;
    } else {
        // HMAC verification failed
        return false;
    }
}