import React, {useState} from "react";
import * as firebase from "firebase";
import Logo from "./Logo";

import "firebase/auth";
import "firebase/firestore";
import {auth} from "../services/firebase";
import {addDocument, getDocument, setDocument, updateDocument} from "../services/firebase";


function Landing(props) {

    const [classCode, setClass] = useState("");
    const [isTeacher, setIsTeacher] = useState(false);
    const [user, setUser] = useState(null);

    auth.onAuthStateChanged(async (user) => {
        if(user) {
            const userDoc = await getDocument("users", user.uid);
            if(userDoc.data().classes.length > 0) {
                props.history.push("/dashboard");
            }
            setUser(user);
            if(userDoc.data().role === "student") {
                setIsTeacher(false);
            } else {
                setIsTeacher(true);
            }
        } else {
            props.history.push("/");
        }
    })

    const inputType = isTeacher ? "text" : "number";
    const placeHolder = isTeacher ? "Class Name" : "Class Code";
    const buttonText = isTeacher ? "Create Class" : "Join class";
    const firstWord = isTeacher ? "Create" : "Join";


    const makeClassOnFirebase = async () => {
        if(classCode === "") {
            alert("Please Enter a Class Name");
            return;
        }
        const code = Math.round(Math.random() * 1000000);
        const chatRef = await addDocument("chats", {
            name: `${classCode} Class Chat`,
            members: [user.uid]
        })
        await setDocument("classes", code + "", {
            name: classCode,
            members: [user.uid],
            allChat: chatRef.id,
            chats: [],
            assignments: []
        });
        await updateDocument("users", user.uid, {
            classes: firebase.firestore.FieldValue.arrayUnion({
                code: code,
                name: classCode
            })
        });
        props.history.push("/dashboard");
    }

    const addClassOnFirebase = async () => {
        if(classCode === "") {
            alert("Please Enter a Class Code");
            return;
        }
        const classRef = await getDocument("classes", classCode);
        if (!classRef.exists) {
            alert("Invalid Class Code");
            return;
        }
        await updateDocument("classes", classCode, {
            members: firebase.firestore.FieldValue.arrayUnion(user.uid)
        })
        await updateDocument("users", user.uid, {
            classes: firebase.firestore.FieldValue.arrayUnion({
                code: classCode,
                name: classRef.data().name
            })
        });

        await updateDocument("chats", classRef.data().allChat + "", {
            members: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
        props.history.push("/dashboard");
    }

    const onClickFunction = isTeacher ? makeClassOnFirebase : addClassOnFirebase;


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
                    {firstWord} your first class!
                </span>
                <form className="w-1/3 self-center">
                    <div className="flex items-center border-b border-p-purple py-2">
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type={inputType} placeholder={placeHolder} aria-label="text" value={classCode}
                            onChange={event => setClass(event.target.value)}/>
                    </div>
                </form>
                <button
                    className="self-center w-1/3 rounded bg-p-purple hover:bg-purple-700 border-p-purple hover:border-purple-700 mt-3 py-1 px-2 border-4 text-sm text-white hover:shadow-inner"
                    onClick={() => onClickFunction()}
                    >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default Landing;