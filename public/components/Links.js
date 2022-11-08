import Link from "next/link";
import {myFont} from "../myFont.js";



export default function Links(props){

    let result = []
    for (let elem in props.links){
        result.push(<><Link href = {props.links[elem].href}> {props.links[elem].label} </Link> <br/></>)
    }
    return(
            <div className={myFont.className}>
            <div >
            <div class=" mt-56 text-center content-center text-5xl leading-tight ">
                {result}
            </div>
            </div>
            </div>
    )
}