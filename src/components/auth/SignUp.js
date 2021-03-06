import React, { useState } from "react";
import * as firebase from "firebase";
import Logo from "../Logo";

import "firebase/auth";
import "firebase/firestore";
import { auth, db } from "../../services/firebase";

function SignUp(props) {

    const [errorDiv, setErrorDiv] = useState(<div />);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isStudent, setIsStudent] = useState(true);

    const img = new Image();
    img.src = "../../images/logo.svg";

    const signUp = () => {
        auth.createUserWithEmailAndPassword(email, password).then(() => {
            const role = isStudent ? "student" : "teacher";
            db.collection("users").doc(auth.currentUser.uid).set(
                {
                    role: role,
                    classes: [],
                    name: name
                }
            ).then(() => {
                auth.signInWithEmailAndPassword(email, password).then(() => {
                    props.history.push("/dashboard");
                });
            })
        }).catch(error => {
            setErrorDiv(makeErrorDiv(error.message));
        })
    };

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
        <div style={{
            'height': window.innerHeight + "px",
        }} onKeyDown={(e) => {
            if (e.keyCode === 13) signUp();
        }}>
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
            <div className="w-full bg-white justify-center flex flex-col p-3" style={{ 'height': '100%', }}>
                <span className="w-1/3 self-center font-bold text-3xl text-center mb-8">
                    <span className="font-regular">New? </span>Sign Up Here!
                </span>
                <form className="w-1/3 self-center">
                    <div className="flex items-center py">
                        <input
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                            type="text" placeholder="Name" aria-label="name" value={name}
                            onChange={event => setName(event.target.value)} />
                    </div>
                    <div className="flex items-center py">
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
                    <div className="flex justify-center items-center py-2">
                        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                onChange={() => setIsStudent(!isStudent)} />
                            <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                        <label className="text-p-orange text-xl"> I am a <strong>teacher</strong></label>
                    </div>
                </form>
                <button
                    className="self-center w-1/3 rounded bg-p-orange hover:bg-orange-700 border-p-orange hover:border-orange-700 mt-3 py-2 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => {
                        signUp();
                    }}
                >
                    Sign Up!
                </button>
                <button
                    className="my-3 self-center w-1/3 rounded bg-p-purple hover:bg-purple-700 border-p-purple hover:border-purple-  700 py-2 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => {
                        props.history.push("/");
                    }}
                >
                    Have an Account? Log In!
                </button>
                {errorDiv}
            </div>
        </div>
    );
}

export default SignUp;
