import { Cashfree, CFEnvironment } from "cashfree-pg";

const clientId = process.env.CASHFREE_CLIENT_ID;
const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Cashfree API credentials are missing.");
}

const environment =
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(
  environment,
  clientId,
  clientSecret
);

export default cashfree;
