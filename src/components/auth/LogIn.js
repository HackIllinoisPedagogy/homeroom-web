import React, {useState} from "react";
import * as firebase from "firebase";
import Logo from "../Logo";

import "firebase/auth";
import "firebase/firestore";

function LogIn() {

    const [errorDiv, setErrorDiv] = useState(<div/>);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (firebase.apps.length === 0) {
        const firebaseConfig = {
            apiKey: "AIzaSyBaaNEt16iY6FuP2RZHiwo5BC5sY3gYf-A",
            authDomain: "pasdkvafvwdvj-hackilli.firebaseapp.com",
            databaseURL: "https://pasdkvafvwdvj-hackilli.firebaseio.com",
            projectId: "pasdkvafvwdvj-hackilli",
            storageBucket: "pasdkvafvwdvj-hackilli.appspot.com",
            messagingSenderId: "252438045046",
            appId: "1:252438045046:web:7eacef176c207f50151a57"
        };
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();

    const img = new Image();
    img.src = "../../images/logo.svg";

    const makeErrorDiv = function (message) {
        return (
            <div className="w-1/3 self-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{message}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3"
                      onClick={() => setErrorDiv(<div/>)}
                >
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 20 20">
                        <title>Close</title>
                        <path
        d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                    </svg>
                </span>
            </div>
        );
    }

    return (
        <div style={{
            'height': window.innerHeight + "px",
        }}>
            <div className="flex w-full justify-center flex p-3"
                 style={{
                     'height': '10%'
                 }}
            >
                <Logo width={50} height={50}/>
                <span className="ml-4 text-4xl font-bold">
                    Pedagogy
                </span>
            </div>
            <div className="w-full justify-center flex flex-col  p-3" style={{'height': '90%',}}>
                <span className="w-1/3 self-center font-bold text-3xl text-center mb-10">
                    Welcome back!
                </span>
                <form className="w-1/3 self-center">
                    <div className="flex items-center border-b border-purple-500 py-2">
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type="email" placeholder="Email" aria-label="email" value={email} onChange={event => setEmail(event.target.value)}/>
                    </div>
                    <div className="flex items-center border-b border-purple-500 py-2">
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type="password" placeholder="Password" aria-label="password" value={password} onChange={event => setPassword(event.target.value)}/>
                    </div>
                </form>
                <button
                    className="self-center w-1/3 rounded bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 mt-3 py-1 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => {
                        auth.signInWithEmailAndPassword(email, password).then(() => {
                            alert("Sign in successful");
                        }).catch((error) => {
                            setErrorDiv(makeErrorDiv(error.message));
                        })
                    }}>
                    Log In
                </button>
                <button
                    className="my-3 self-center w-1/3 rounded bg-orange-500 hover:bg-orange-700 border-orange-500 hover:border-orange-700 py-1 px-2 border-4 text-sm text-white hover:shadow-inner">
                    No account? Sign up!
                </button>
                {errorDiv}
            </div>
        </div>
    );
}

export default LogIn;