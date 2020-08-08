import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { getConversations, getAssignments } from '../messagingData';
import { auth, db } from '../../services/firebase';
import * as firebase from "firebase";
import ClassSelector from "../ClassSelector";

// const assignments = [
//     { name: 'Problem Set #1' },
//     { name: 'Problem Set #2' },
//     { name: 'Geometry Practice' },
//     { name: 'Recursion Practice' },
// ]

// const conversations = [
//     { name: 'All Class Conversation' },
//     { name: 'Table Group 6' }
// ]


class Sidebar extends Component {

    state = {
        user: null,
        doc: null,
        createClassModal: false,
        addClassModal: false,
        className: "",
    };

    setClassName(name) {
        this.setState({ className: name });
    }

    componentDidMount() {

        const setUser = (user) => {
            console.log(user);
            this.setState({ user });
        }

        auth.onAuthStateChanged(function (user) {
            if (user) {
                setUser(user);
            } else {
                console.log("no user");
            }
        });
    }

    componentDidUpdate = async () => {
        if (this.state.user && !this.state.doc) {
            console.log(this.state.user.uid);
            const userRef = db.collection('users').doc(this.state.user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                console.log("no doc");
            }

            this.setState({ doc: doc.data() })

        }

    }

    createClass = () => {
        this.setState({ createClassModal: true })
    }

    addClass = () => {
        this.setState({ addClassModal: true })
    }

    renderCreateClassModal() {
        return (
            <div class="z-40 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div class="fixed inset-0 transition-opacity">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">

                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Create a class
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm leading-5 text-gray-500">
                                        Create a class and share the code we generate with your students!
                                    </p>
                                </div>
                                <div class="mt-2">
                                    <input
                                        class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        id="grid-first-name" type="text" placeholder="Enter class name..."
                                        value={this.state.className} onChange={e => this.setClassName(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <button type="button"
                                class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                onClick={() => {
                                    const code = Math.round(Math.random() * 1000000);
                                    db.collection("classes").doc(code + "").set({
                                        name: this.state.className,
                                        members: [this.props.user.uid]
                                    }).then(() => {
                                        db.collection("users").doc(this.props.user.uid).update({
                                            classes: firebase.firestore.FieldValue.arrayUnion({
                                                code: code,
                                                name: this.state.className,
                                            }),
                                        }).then(() => {
                                            db.collection("users").doc(this.props.user.uid).get().then(doc => {
                                                this.setState({
                                                    doc: doc.data(),
                                                    createClassModal: false,
                                                    className: ""
                                                })
                                            })
                                        })
                                    })
                                }}
                            >
                                Get Class Code
                            </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                            <button type="button" onClick={() => this.setState({ createClassModal: false })}
                                class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                Cancel
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    renderAddClassModal() {
        return (
            <div class="z-40 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div class="fixed inset-0 transition-opacity">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">

                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 mr-4 sm:text-left sm:w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Join a class
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm leading-5 text-gray-500">
                                        Enter your class code to join your classmates!
                                    </p>
                                </div>
                                <div class="mt-2">
                                    <input
                                        class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        id="grid-first-name" type="number" placeholder="Enter class code..."
                                        value={this.state.className} onChange={e => this.setClassName(e.target.value)} />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <button type="button"
                                class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                onClick={() => {
                                    db.collection("classes").doc(this.state.className).get().then(doc => {
                                        if (doc.exists) {
                                            if (!doc.data().members.includes(this.props.user.uid)) {
                                                db.collection("classes").doc(this.state.className).update({
                                                    members: firebase.firestore.FieldValue.arrayUnion(this.props.user.uid),
                                                }).then(() => {
                                                    db.collection("users").doc(this.props.user.uid).update({
                                                        classes: firebase.firestore.FieldValue.arrayUnion({
                                                            code: this.state.className,
                                                            name: doc.data().name
                                                        }),
                                                    }).then(() => {
                                                        db.collection("users").doc(this.props.user.uid).get().then(doc2 => {
                                                            this.setState({
                                                                doc: doc2.data(),
                                                                addClassModal: false,
                                                                className: ""
                                                            })
                                                        })
                                                    })
                                                });
                                            } else {
                                                alert("You are already in this class");
                                            }

                                        } else {
                                            alert("Invalid Class Code");
                                        }
                                    })
                                }}
                            >
                                Join Class
                            </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                            <button type="button" onClick={() => this.setState({ addClassModal: false })}
                                class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                Cancel
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    renderClassesSidebar = () => {

        if (!this.state.doc) {
            return (<div>No Docs</div>)
        }

        const { role } = this.state.doc;
        let classes;
        if (this.state.doc) {
            classes = this.state.doc.classes.map(c => {
                return (
                    <li>
                        <ClassSelector name={c.name} code={c.code} setClass={this.props.setClass} currentClass={this.props.currentClass} />
                    </li>
                )
            });
        } else {
            classes = <div />;
        }

        return (
            <div
                class="absolute z-20 overflow-hidden bg-white mb-4 border-red-light w-full h-screen md:w-24 border-solid border-2 border-gray-200">
                <div class="flex w-full max-w-xs p-4 bg-white">
                    <ul class="flex flex-col w-full">
                        <li class="my-px">
                            <a onClick={role === "teacher" ? this.createClass : this.addClass}
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path
                                            d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
                                        <path d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z" />
                                    </svg>
                                </span>
                            </a>
                        </li>
                        {classes}
                    </ul>
                </div>
            </div>
        );
    }

    renderMainSidebar() {
        const name = this.state.doc ? this.state.doc.name : "";

        return (
            <div style={{ width: '300px' }}
                class="absolute overflow-hidden shadow-lg bg-white mb-4 border-red-light w-64 h-screen z-10 ml-24">
                <div class="flex max-w-xs p-4 bg-white">
                    <ul class="flex flex-col">
                        <li class="h-20 my-px">
                            <p>{name}</p>
                            <p>Currently looking at {this.props.currentClass.name}</p>
                            <p>Class Code: {this.props.currentClass.code}</p>
                        </li>
                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                </span>
                                <span class="ml-3">Dashboard</span>
                                <span
                                    class="flex items-center justify-center text-sm text-gray-500 font-semibold bg-gray-200 h-6 px-2 rounded-full ml-auto">3</span>
                            </a>
                        </li>

                        <li className="my-px">
                            <span
                                className="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Assignments</span>
                        </li>

                        {getAssignments().map(assignment => {
                            const { name } = assignment;
                            return (<li class="my-px" key={name}>
                                <a href="#"
                                    class="flex flex-row items-center px-2 h-12 rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span class="ml-3">{name}</span>
                                </a>
                            </li>);
                        })}

                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-green-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <span class="ml-3">Add new</span>
                            </a>
                        </li>
                        <li class="my-px">
                            <span
                                class="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Conversations</span>
                        </li>

                        {
                            Object.values(getConversations()).map(conversation => {
                                const { name, id } = conversation;
                                return (

                                    <li class="my-px" key={id}>
                                        <a onClick={() => this.props.setChat(id)}
                                            class="flex flex-row items-center h-12 px-2 rounded-lg text-gray-600 hover:bg-gray-100">
                                            <span class="ml-3">{name}</span>
                                        </a>
                                    </li>
                                );

                            })

                        }

                        <li class="my-px">
                            <a onClick={() => {
                                console.log("hell1");
                                auth.signOut().then(() => {
                                    console.log("hello");
                                    this.props.history.push("/");
                                })
                            }}
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-red-400"
                                >
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                    </svg>
                                </span>
                                <span class="ml-3" >Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderClassesSidebar()}
                {this.renderMainSidebar()}
                {this.state.createClassModal ? this.renderCreateClassModal() : <div></div>}
                {this.state.addClassModal ? this.renderAddClassModal() : <div></div>}
            </div>
        );
    }
}

export default Sidebar;