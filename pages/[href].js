import fetch from 'node-fetch';
import {myFont} from "../public/myFont.js";
import Links from "./(components)/Links";
import { useEffect, useState} from "react"
import {db} from "../public/firestoreInit.js";
import { doc, onSnapshot } from "firebase/firestore";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./(components)/CheckoutForm";

export async function getStaticPaths(){
    const paths = await fetch("https://undefxx.com/api/staticParams", {method: "GET", headers: { propertyID: process.env.NEXT_PUBLIC_PROPERTY_ID}}).then(x => x.json())
    return {
        paths: paths,
        fallback: false, // can also be true or 'blocking'
    }
    }

export async function getStaticProps(context){
    const thisPayment = await fetch("https://undefxx.com/api/sp", {method: "GET", headers: { propertyID: process.env.NEXT_PUBLIC_PROPERTY_ID ,href: context.params.href}}).then(x => x.json())
    const unpaid = await fetch("https://undefxx.com/api/p", {method: "GET", headers: {status: "unpaid", propertyID : process.env.NEXT_PUBLIC_PROPERTY_ID}}).then(x=> x.json());

    return {
        props: { thisPayment, unpaid },
        revalidate: 1
    }
}


export default function Page(props){
    console.log(props)
    const [clientSecret, setClientSecret] = useState(props.thisPayment.clientSecret)
    const stripePromise = loadStripe("pk_live_51LlESTC3Ie0MSAM2CQtveok1BNyKHlkw8W0aVunFTMYjMAGi0y6dEaHreNGy0TC4oRkfSMwOkcXUftn0oTlwDaBg00bnHjzls6");
    let links = [{label: "<---", href: "/"}, {label: "", href: "/"}]

    for(let elem in props.unpaid){
        if (props.unpaid[elem].url === props.thisPayment.url)  {
            links.push({label: props.thisPayment.name + ": $" + numberWithCommas(props.thisPayment.amount), href:"/"});
            break;
            } else  links.push({label: "", href:"/"})
        }

        const appearance = {
            theme: 'flat',
            variables: {
              fontFamily: ' "Gill Sans", sans-serif',
              fontLineHeight: '1.5',
              borderRadius: '10px',
              colorBackground: '#F6F8FA',
              colorPrimaryText: '#262626'
            },
            rules: {
              '.Block': {
                backgroundColor: 'var(--colorBackground)',
                boxShadow: 'none',
                padding: '12px'
              },
              '.Input': {
                padding: '12px'
              },
              '.Input:disabled, .Input--invalid:disabled': {
                color: 'lightgray'
              },
              '.Tab': {
                padding: '10px 12px 8px 12px',
                border: 'none'
              },
              '.Tab:hover': {
                border: 'none',
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
              },
              '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
              },
              '.Label': {
                fontWeight: '500'
              }
            }
          };
          
          // Pass the appearance object to the Elements instance
        //   const elements = stripe.elements({clientSecret, appearance});

    const options = {
        clientSecret,
        appearance,
    };


    return (
            <div className={myFont.className}>
                <Links links={links}/>
                <div className="App">
   {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                            )}
                </div>

            </div>
            )
}

function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

