import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../firebase";
import firebase from "firebase";

const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry: "IN",
        },
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
};
export default function () {
    return (

        <div style={{
            backgroundImage: 'url("https://cdn.pixabay.com/photo/2018/06/27/12/55/artificial-neural-network-3501528_960_720.png")',
            height: "100vh",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: "contain",
        }}>
                <center style={{backgroundColor:"rgba(255, 255, 255, 0.7)"}} >
                <br/><br/><br/>
                    <h1> Sign-In for Teach_IT</h1>
                    <StyledFirebaseAuth style={{ height: "100%" }} uiConfig={uiConfig} firebaseAuth={auth} />
                    <br/><br/><br/>

                </center>
                
        </div>
    );
}       