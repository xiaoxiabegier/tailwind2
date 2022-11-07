import fetch from 'node-fetch';
import {myFont} from "../public/myFont.js";
import Links from "./(components)/Links.js";
import { useEffect, useState} from "react"
import {db} from "./(components)/firestoreInit.js";
import { doc, onSnapshot } from "firebase/firestore";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./(components)/CheckoutForm";
import {PROPERTY_ID} from "../propertyid";

export async function getStaticPaths(){
    const paths = await fetch("https://undefxx.com/api/staticParams", {method: "GET", headers: { propertyID: PROPERTY_ID}}).then(x => x.json())
    return {
        paths: paths,
        fallback: false, // can also be true or 'blocking'
    }
    }

export async function getStaticProps(context){
    const thisPayment = await fetch("https://undefxx.com/api/sp", {method: "GET", headers: { propertyID: PROPERTY_ID ,href: context.params.href}}).then(x => x.json())
    const unpaid = await fetch("https://undefxx.com/api/p", {method: "GET", headers: {status: "unpaid", propertyID : PROPERTY_ID}}).then(x=> x.json());

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
  theme: 'stripe',
  }

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

