const Stripe = require('stripe');
const Payment = require('../models/Payment');
const User = require('../models/User');
const sendEmail = require('../utils/emailUtils');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing. Payment features will be disabled.");
}

const createPaymentIntent = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured on the server." });
        }
        const { amount, currency = 'usd', planType } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: req.user._id.toString(),
                planType
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const { user: userId, amount, method, status, notes } = req.body;

        const payment = await Payment.create({
            user: userId || req.user._id,
            amount,
            method,
            status: status || 'Completed',
            notes
        });

        const payer = await User.findById(payment.user);
        if (payer && payment.status === 'Completed') {
            try {
                await sendEmail({
                    email: payer.email,
                    subject: 'Payment Receipt - Fitness Tracker',
                    message: `<h1>Payment Received</h1><p>Hi ${payer.name},</p><p>We received your payment of <b>$${payment.amount}</b> via ${payment.method}.</p><p>Transaction ID: ${payment._id}</p><p>Thank you!</p>`
                });
            } catch (error) {
                console.error('Receipt email failed:', error);
            }
        }

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getAllPayments,
    getUserPayments,
    createPayment,
    createPaymentIntent
};
