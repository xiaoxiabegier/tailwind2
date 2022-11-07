
import fetch from 'node-fetch';
import {myFont} from "../public/myFont.js";
import Links from "./(components)/Links.js";
import { useEffect, useState} from "react"
import {db} from "./(components)/firestoreInit.js";
import { doc, onSnapshot } from "firebase/firestore";
import {PROPERTY_ID} from "../propertyid";

export async function getStaticProps(){

    const info = await fetch("https://undefxx.com/api", {method: "GET", headers: {propertyID: PROPERTY_ID, includeFields: "autopay,emailAddresses,phoneNumbers"}}).then(x => x.json());
    return {
        props: { info },
        revalidate: 1
    }
}
//
export default function Autopay(props){

    const emailAddresses = props.info[PROPERTY_ID].emailAddresses
    const phoneNumbers = props.info[PROPERTY_ID].phoneNumbers
    const initialAutopayActive =  props.info[PROPERTY_ID].autopay



    const [autopayActive, setAutopayActive] = useState(initialAutopayActive)
    const [authContacts, setAuthContacts] = useState({emailAddresses: emailAddresses, phoneNumbers: phoneNumbers})

    let buttons = []
    for(let key in authContacts["emailAddresses"]) {
        buttons.push(<button className={"card"} onClick={(x) => alert(5)}> <p>{authContacts["emailAddresses"][key]}</p></button>)
    }
    for(let key in authContacts["phoneNumbers"]) {
        buttons.push(<button className={"card"} onClick={(x) => alert(5)}> <p>{authContacts["phoneNumbers"][key]}</p></button>)
    }

    console.log(buttons)
//     buttons.push(<button className={"card"} onClick = {() => alert("()")}><p>{authContacts[elem]}</p></button>)
//    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "units/"+PROPERTY_ID), (doc) => {
            setAutopayActive(doc.data().autopay);
            console.log("Current data: ", doc.data());
        });
        return () => unsub()
    },[])



    let links = [{label: "<---", href: "/"}, {label:  autopayActive ? ("autopay: active") : ("autopay: inactive"), href: "/"}]

    return(
            <div className={myFont.className}>
            <Links links = {links}/>
            <div className={"grid"}>
            {buttons}
            </div>
            </div>
            )
}

