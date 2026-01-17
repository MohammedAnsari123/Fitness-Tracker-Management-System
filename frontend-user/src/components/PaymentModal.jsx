import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const PaymentModal = ({ isOpen, onClose, planType = 'Premium', amount = 999, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');
            axios.post("https://fitness-tracker-management-system-xi0y.onrender.com/api/payment/create-payment-intent", {
                amount: amount,
                planType: planType
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => setClientSecret(res.data.clientSecret))
                .catch((err) => console.error("Error creating payment intent:", err));
        }
    }, [isOpen, amount, planType]);

    if (!isOpen) return null;

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Upgrade to {planType}</h2>
                <p className="mb-4 text-gray-600">Total: ${(amount / 100).toFixed(2)}</p>

                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm amount={amount} planType={planType} onSuccess={onSuccess} />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
