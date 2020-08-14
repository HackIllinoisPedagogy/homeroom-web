import React, { useState } from "react";
import * as firebase from "firebase";
import Logo from "../Logo";

import "firebase/auth";
import "firebase/firestore";
import { auth } from "../../services/firebase";


function LogIn(props) {

    const [errorDiv, setErrorDiv] = useState(<div />);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const img = new Image();
    img.src = "../../images/logo.svg";

    const makeErrorDiv = function (message) {
        return (
            <div className="w-1/3 self-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert">
                <span className="block sm:inline">{message}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setErrorDiv(<div />)}
                >
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <title>Close</title>
                        <path
                            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white" style={{
            'height': window.innerHeight + "px",
        }}
            onKeyDown={(event) => {
                if (event.keyCode == 13) {
                    auth.signInWithEmailAndPassword(email, password).then(() => {
                        props.history.push("/dashboard");
                    }).catch((error) => {
                        setErrorDiv(makeErrorDiv(error.message));
                    })
                }
            }}
        >
            <div className="absolute flex content-center w-full justify-center z-40 p-3"
                style={{
                    'height': '10%'
                }}
            >
                <Logo width={50} height={50} />
                <span className=" ml-4 text-2xl py-4 font-bold ">
                    Homeroom
                </span>
            </div>
            <div className="w-full justify-center flex flex-col p-3" style={{ 'height': '100%', }}>
    
                <span className="w-1/3 self-center font-bold text-3xl text-center mb-8">
                    Welcome back!
                </span>
                <form className="w-1/3 self-center">
                    <div className="flex items-center py-2">
                        <input
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                            type="email" placeholder="Email" aria-label="email" value={email}
                            onChange={event => setEmail(event.target.value)} />
                    </div>
                    <div className="flex items-center py">
                        <input
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                            type="password" placeholder="Password" aria-label="password" value={password}
                            onChange={event => setPassword(event.target.value)} />
                    </div>
                </form>
                <button
                    className="self-center w-1/3 rounded bg-p-purple hover:bg-purple-700 border-p-purple hover:border-purple-700 mt-3 py-2 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => {
                        auth.signInWithEmailAndPassword(email, password).then(() => {
                            props.history.push("/dashboard");
                        }).catch((error) => {
                            setErrorDiv(makeErrorDiv(error.message));
                        })
                    }}

                >
                    Log In
                </button>
                <button
                    className="my-3 self-center w-1/3 rounded bg-p-orange hover:bg-orange-700 border-p-orange hover:border-orange-700 py-2 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => {
                        props.history.push("/signup");
                    }}
                >
                    No account? Sign up!
                </button>
                {errorDiv}
            </div>
        </div>
    );
}

export default LogIn;