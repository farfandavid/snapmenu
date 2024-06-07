interface RecaptchaResponse {
    "success": true | false,      // whether this request was a valid reCAPTCHA token for your site
    "score": number             // the score for this request (0.0 - 1.0)
    "action": string            // the action name for this request (important to verify)
    "challenge_ts": string,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
    "error-codes": []        // optional
}

export const verifyRecaptcha = async (recaptchaResponse: string) => {
    const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
    const requestHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const requestBody = new URLSearchParams({
        secret: import.meta.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse
    });
    const response = await fetch(recaptchaURL, {
        method: "POST",
        headers: requestHeaders,
        body: requestBody.toString()
    });
    const responseData = await response.json() as RecaptchaResponse;

    return responseData.success;
}