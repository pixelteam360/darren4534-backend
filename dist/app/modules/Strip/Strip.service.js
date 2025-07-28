"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripService = exports.stripeCallback = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripeAuth = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accountLink = stripe.oauth.authorizeUrl({
        response_type: "code",
        scope: "read_write",
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: "https://darren4534-server.vercel.app/api/v1/stripe/callback",
        state: userId,
    });
    return accountLink;
});
const stripeCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield stripe.oauth.token({
            grant_type: "authorization_code",
            code: code,
        });
        const stripeAccountId = response.stripe_user_id;
        // state contains your userId
        const userId = state;
        // Update user with connected Stripe account ID
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { stripeAccountId },
        });
        // Redirect to success page or send JSON
        res.redirect("/success"); // Or send JSON: res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Stripe OAuth token exchange failed");
    }
});
exports.stripeCallback = stripeCallback;
exports.StripService = {
    stripeAuth,
    stripeCallback: exports.stripeCallback,
};
