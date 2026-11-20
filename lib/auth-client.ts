import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

/** Browser auth client. Same origin as the app, so no baseURL needed. */
export const authClient = createAuthClient({
  plugins: [magicLinkClient(), stripeClient({ subscription: true })],
});
