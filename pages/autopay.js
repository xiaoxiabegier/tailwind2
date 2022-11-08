
import fetch from 'node-fetch';
import {myFont} from "../public/myFont.js";
import Links from "../public/components/Links";
import { useEffect, useState} from "react"
import {db} from "../public/firestoreInit.js";
import { doc, onSnapshot } from "firebase/firestore";

export async function getStaticProps(){

    const info = await fetch("https://undefxx.com/api", {method: "GET", headers: {propertyID: process.env.NEXT_PUBLIC_PROPERTY_ID, includeFields: "autopay,emailAddresses,phoneNumbers"}}).then(x => x.json());
    return {
        props: { info },
        revalidate: 1
    }
}

export default function Autopay(props){

    const emailAddresses = props.info[process.env.NEXT_PUBLIC_PROPERTY_ID].emailAddresses
    const phoneNumbers = props.info[process.env.NEXT_PUBLIC_PROPERTY_ID].phoneNumbers
    const initialAutopayActive =  props.info[process.env.NEXT_PUBLIC_PROPERTY_ID].autopay

    const [autopayActive, setAutopayActive] = useState(initialAutopayActive)
    const [authContacts, setAuthContacts] = useState({emailAddresses: emailAddresses, phoneNumbers: phoneNumbers})

    let buttons = []
    for(let key in authContacts["emailAddresses"]) {
        buttons.push(<div class="  flex items-center my-1 "><button class = " outline outline-blue-4 p-2 rounded-lg mx-auto bg-red-400  " className={"card"} onClick={(x) => alert(5)}> <p>{authContacts["emailAddresses"][key]}</p></button></div>)
    }
    for(let key in authContacts["phoneNumbers"]) {
        buttons.push(<button className={"card"} onClick={(x) => alert(5)}> <p>{authContacts["phoneNumbers"][key]}</p></button>)
    }


    useEffect(() => {
        const unsub = onSnapshot(doc(db, "units/"+process.env.NEXT_PUBLIC_PROPERTY_ID), (doc) => {
            setAutopayActive(doc.data().autopay);
            console.log("Current data: ", doc.data());
        });
        return () => unsub()
    },[])

    let links = [{label: "<---", href: "/"}, {label:  autopayActive ? ("autopay: active") : ("autopay: inactive"), href: "/"}]

    return(
            <div className={myFont.className}>
            <Links links = {links} />
            <div  className={"grid"}>
            {buttons}
            </div>
            </div>
            )
}

