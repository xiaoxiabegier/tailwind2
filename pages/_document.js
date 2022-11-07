import { Html, Head, Main, NextScript } from 'next/document'
import {PROPERTY_ID} from "../propertyid";

export default function Document() {
    return (
            <Html>
                <Head />
                <title>{PROPERTY_ID}</title>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
            )
}