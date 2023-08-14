import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51NekCfBxZmki6S6GjzByJlRglAe6uu4F370kEPLNSE7oJCZMINnKTBoXDJzJcKz0mqUrwUJG7qpqJl5S2mRxJ9Rr00O3vzXl7b")

const CheckoutForm = () => {

   const stripe = useStripe();
   const elements = useElements();

    const handleSubmit = async(e) => {
        e.preventDefault();
       const {error, paymentMethod} = await stripe.createPaymentMethod ({
            type: 'card',
            card: elements.getElement(CardElement),

        });
        if (!error) {
            const { id } = paymentMethod;
         try{
             const {data} = await axios.post('/api/payment',{
                id,
                amount: 10000
            })

            console.log(data);
            elements.getElement(CardElement).clear();
        } catch (error) {
            console.log(error)

           }
         
        }
    }
    
    
    return <form onSubmit={handleSubmit}>
        <CardElement/>
    
        <button>
            Buy
        </button>

    </form>
}

function Payment() {
    return (
        
        <Elements stripe={stripePromise}>
            <CheckoutForm/>

        </Elements>

    );
}

export default Payment;

