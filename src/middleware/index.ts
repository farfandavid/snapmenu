
import { defineMiddleware, sequence } from "astro/middleware";
import { app } from "../firebase/server";
import { getAuth } from "firebase-admin/auth";

const maxRequestsPerIP = 20; // Set the maximum number of requests per IP
const ipRequestCounts: { [key: string]: number } = {};

export const onRequest = defineMiddleware(async (context, next) => {
    console.log("In onRequest middleware");
    if (context.url.pathname.startsWith("/dashboard")) {
        const auth = getAuth(app);
        const sessionCookie = context.cookies.get("session")?.value;
        const decodedCookie = await auth.verifySessionCookie(sessionCookie || "")
            .catch((error) => {
                return null;
            }
            );
        if (!decodedCookie) {
            context.cookies.delete("session");
            return context.redirect("/login");
        }
        const user = await auth.getUser(decodedCookie.uid).catch((error) => {
            return null;
        });
        if (!user) {
            context.cookies.delete("session");
            return context.redirect("/login");
        }
    }

    if (context.url.pathname === '/api/users' && context.request.method === 'POST' && context.request.headers.get("Content-Type") === "application/json") {
        // Add code to limit the number of requests per IP to this API
        const ip = context.clientAddress; // Get the client IP address
        if (!(ip in ipRequestCounts)) {
            ipRequestCounts[ip] = 1;
        }

        // Si la IP ha alcanzado el número máximo de solicitudes, devolver un error
        if (ip in ipRequestCounts && ipRequestCounts[ip] > maxRequestsPerIP) {
            console.log(`IP ${ip} has reached the maximum number of requests`);
            return context.redirect("/404",);
        } else {
            ipRequestCounts[ip]++;
        }
        console.log(context.clientAddress);
        console.log("In onRequest middleware for POST /api/users");
        return next();
    }
    //return sequence(auth, validate)(context, next);

    return next();
});


// Helper functions to track the number of requests per IP
function getRequestCount(ip: string): number {
    // Implement logic to retrieve the request count for the IP from a database or cache
    // Return 0 if the IP is not found
    // Example implementation using a Map:
    // const requestCounts = new Map<string, number>();
    // return requestCounts.get(ip) || 0;
    return 0;
}

function incrementRequestCount(ip: string): void {
    // Implement logic to increment the request count for the IP in a database or cache
    // Example implementation using a Map:
    // const requestCounts = new Map<string, number>();
    // const count = requestCounts.get(ip) || 0;
    // requestCounts.set(ip, count + 1);
}
