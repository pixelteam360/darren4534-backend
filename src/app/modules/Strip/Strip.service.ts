import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Request, Response } from "express";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripeAuth = async (userId: string) => {
  const accountLink = stripe.oauth.authorizeUrl({
    response_type: "code",
    scope: "read_write",
    client_id: process.env.STRIPE_CLIENT_ID,
    redirect_uri: "https://darren4534-server.vercel.app/api/v1/stripe/callback",
    state: userId,
  });

  return accountLink;
};

const stripeCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  console.log({ code }, { state }, error);
  if (error) {
    return res.status(400).send(`Error: ${error}`);
  }

  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  try {
    // Exchange code for tokens & connected account ID

    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code as string,
    });

    const stripeAccountId = response.stripe_user_id;

    // state contains your userId
    const userId = state as string;

    // Update user with connected Stripe account ID
    await prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId },
    });

    // Redirect to success page or send JSON
    res.redirect("/success"); // Or send JSON: res.json({ success: true });
  } catch (err) {
    res.status(500).send("Stripe OAuth token exchange failed");
  }
};

const successStatus = async () => {
  return {
    status: "success",
    message: "You account have successfully connected",
  };
};

const paymentByStripe = async (payload: any, userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },

    select: { id: true, stripeAccountId: true },
  });

  if (!user?.stripeAccountId) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User did not connected her stripe account"
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 10000,
          product_data: {
            name: "Consultation Service",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://yourapp.com/success",
    cancel_url: "https://yourapp.com/cancel",
    payment_intent_data: {
      // application_fee_amount: 1000, // Optional: take platform fee ($10)
      transfer_data: {
        destination: user.stripeAccountId, // Payment goes here
      },
    },
  });
};

export const StripService = {
  stripeAuth,
  stripeCallback,
  successStatus,
};
