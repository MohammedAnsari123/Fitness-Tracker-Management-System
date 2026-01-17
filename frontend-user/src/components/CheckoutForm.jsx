import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

export default function CheckoutForm({ amount, planType, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        // Confirm the payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the user is redirected after the payment
                return_url: window.location.href, // You might want a dedicated success page
            },
            redirect: 'if_required' // Important to avoid full page reload if not needed
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("Payment Successful!");

            // Record the payment in our backend manually since we don't have webhooks set up locally easily
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/payment', {
                    amount: amount / 100, // Convert back to dollars
                    method: 'Card (Stripe)',
                    status: 'Completed',
                    notes: `Plan: ${planType}, Transaction: ${paymentIntent.id}`
                }, { headers: { Authorization: `Bearer ${token}` } });

                // Call success callback to update UI/Subscription
                onSuccess(paymentIntent);

            } catch (err) {
                console.error("Failed to record payment:", err);
                setMessage("Payment succeeded but failed to record in system. Contact support.");
            }
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-white">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message" className="mt-4 text-center text-red-500 font-semibold">{message}</div>}
        </form>
    );
}
