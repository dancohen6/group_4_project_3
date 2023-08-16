import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const stripePromise = loadStripe("pk_test_51NekCfBxZmki6S6GjzByJlRglAe6uu4F370kEPLNSE7oJCZMINnKTBoXDJzJcKz0mqUrwUJG7qpqJl5S2mRxJ9Rr00O3vzXl7b")

const CheckoutForm = ({ setPurchaseSuccess, logout}) => {

   const stripe = useStripe();
   const elements = useElements();
   const navigate = useNavigate();

   const handleNameChange = (e) => {
    setCustomerName(e.target.value);
};

   const [customerName, setCustomerName] = useState('');

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
                amount: 10000,
                customerName: customerName,
            })

            console.log(data);
            elements.getElement(CardElement).clear();
            setPurchaseSuccess(true); 
        } catch (error) {
            console.log(error)

           }
         
        }
    }
    
    
    return <form className='payment-container'  onSubmit={handleSubmit}>
      
      {/* <h1 className="text-center" >Sugarland Shuffle! level 2</h1> */}
      <h2>$10</h2>
      <input className='nameContainer'
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={handleNameChange}
                
            />
        
        <CardElement className='card-container'/>
        
    
        <button className= "bottonPay">
            Buy
        </button>

        <Link to="/dashboard">
              <button className='botton-leve2'>Level 1</button>
            </Link>
            
            <Link onClick={logout} to="/">
              <button className="logout-button">Log Out</button>
            </Link>

        

    </form>
}

function Payment({user, setState}) {

    const logout = async e => {
        e.preventDefault();
      
        try {
          await axios.get('/api/logout');
          
          setState(oldState => ({
            ...oldState,
            user: null
          }));
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };
    
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const navigate = useNavigate();
    
    setTimeout(() => {
        setPurchaseSuccess(false);
     }, 3500);
      
     if (purchaseSuccess) {
        navigate('/dashboard2');
    }
    
 
    return (
        <Elements stripe={stripePromise}>
            {purchaseSuccess ? ( 
                <div>
                    <p>Succesfull payment</p>
                    

                </div>
            ) : (
                <CheckoutForm setPurchaseSuccess={setPurchaseSuccess} /> 
            )}
        </Elements>
    );
 }

export default Payment;

