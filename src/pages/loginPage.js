import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//Components
import PageTitle from '../components/PageTitle';
import Description from '../components/Description';
import Footer from '../components/Footer';

const LoginPage = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth();

    function prepareSignIn() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Auth success");
                window.location = "/";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Authentication Error: " + errorCode + " - " + errorMessage);
            });
    }

    return (
        <div className="main-content">
            <PageTitle title="Login" />
            <div className="text-center div-card">
                <input id="em" type="email" value={email} onChange={field => setEmail(field.target.value)}></input>
                <input id="pass" type="password" value={password} onChange={field => setPassword(field.target.value)}></input>
                <button onClick={prepareSignIn}>Login</button>
            </div>
            <Description />
            <Footer />
        </div>
    );
};

export default LoginPage;