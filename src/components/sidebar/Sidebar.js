import React, {Component} from 'react';
import {slide as Menu} from 'react-burger-menu';
import {getConversations, getAssignments} from '../messagingData';
import {
    addDocument,
    auth,
    db,
    deleteCollection,
    getDocument,
    setDocument,
    updateDocument
} from '../../services/firebase';
import * as firebase from "firebase";
import ClassSelector from "./ClassSelector";
import {findAllInRenderedTree} from "react-dom/test-utils";
import _ from "lodash";

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
        assignments: null,
        chats: null

    };

    setAssignments(assignments) {
        this.setState({assignments});
    }

    setChats(chats) {
        this.setState({chats});
    }

    setClassName(name) {
        this.setState({className: name});
    }

    async componentDidMount() {

        const setUser = (user) => {
            this.setState({user});
        }

        auth.onAuthStateChanged(function (user) {
            if (user) {
                setUser(user);
            } else {
                console.log("no user");
            }
        });

        let assignmentVariable = await this.getAssignments();
        let chatVariable = await this.getChats();

        this.setAssignments(assignmentVariable);
        this.setChats(chatVariable);
    }


    componentDidUpdate = async (prevState) => {
        if (this.state.user && !this.state.doc) {
            const userRef = db.collection('users').doc(this.state.user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                console.log("no doc");
            }

            this.setState({doc: doc.data()})

        }

        let assignmentVariable = await this.getAssignments();
        let chatVariable = await this.getChats();

        if (!_.isEqual(assignmentVariable, this.state.assignments)) {
            this.setAssignments(assignmentVariable);
        }

        if (!_.isEqual(chatVariable, this.state.chats)) {
            this.setChats(chatVariable);
        }


    }

    createClass = () => {
        this.setState({createClassModal: true})
    }

    addClass = () => {
        this.setState({addClassModal: true})
    }

    map_func = async (id) => {
        let assignmentRef = await db.collection("assignments").doc(id).get();
        return assignmentRef.data();
    }

    getAssignments = async () => {
        let toReturn = [];

        if (!this.props.currentClass) {
            return;
        }

        let classRef = await getDocument("classes", this.props.currentClass.code + "");

        for (let assignmentId of classRef.data().assignments) {
            let assignmentRef = await db.collection("assignments").doc(assignmentId).get();
            toReturn.push({...assignmentRef.data(), id: assignmentId});
        }


        return toReturn;
    }

    getChats = async () => {
        let toReturn = [];

        if (!this.props.currentClass) {
            return;
        }

        let classRef = await getDocument("classes", this.props.currentClass.code + "");
        let allChatRef = await getDocument("chats", classRef.data().allChat + "");
        toReturn.push({
            ...allChatRef.data(),
            id: classRef.data().allChat
        })
        for (let chatId of classRef.data().chats) {
            let chatRef = await db.collection("chats").doc(chatId).get();
            toReturn.push({...chatRef.data(), id: chatId});
        }

        return toReturn;
    }

    makeClassOnFirebase = async () => {
        if (this.state.className === "") {
            alert("Please Enter a Class Code");
            return;
        }
        const code = Math.round(Math.random() * 1000000);
        const chatRef = await addDocument("chats", {
            name: `${this.state.className} Class Chat`,
            members: [this.props.user.uid]
        })
        await setDocument("classes", code + "", {
            name: this.state.className,
            members: [this.props.user.uid],
            allChat: chatRef.id,
            chats: [],
            assignments: []
        });
        await updateDocument("users", this.props.user.uid, {
            classes: firebase.firestore.FieldValue.arrayUnion({
                code: code,
                name: this.state.className
            })
        })
        const docRef = await getDocument("users", this.props.user.uid);
        this.setState({
            doc: docRef.data(),
            createClassModal: false,
            className: ""
        })
    }

    addClassOnFirebase = async () => {
        if (this.state.className === "") {
            alert("Please Enter a Class Code");
            return;
        }
        const classRef = await getDocument("classes", this.state.className);
        if (!classRef.exists) {
            alert("Invalid Class Code");
            return;
        }
        if (classRef.data().members.includes(this.props.user.uid)) {
            alert("You are already in this class");
            return;
        }
        await updateDocument("classes", this.state.className, {
            members: firebase.firestore.FieldValue.arrayUnion(this.props.user.uid)
        })
        await updateDocument("users", this.props.user.uid, {
            classes: firebase.firestore.FieldValue.arrayUnion({
                code: this.state.className,
                name: classRef.data().name
            })
        });

        await updateDocument("chats", classRef.data().allChat + "", {
            members: firebase.firestore.FieldValue.arrayUnion(this.props.user.uid),
        })

        const userRef = await getDocument("user", this.props.user.uid + "");
        this.setState({
            doc: userRef.data(),
            addClassModal: false,
            className: ""
        })
    }



    async createGroupChats() {
        const classDoc = await getDocument("classes", this.props.currentClass.code + "");
        const studentCount = classDoc.data().members.length - 1;
        let numGroups;
        let groupSize = window.prompt("How many students per group? (minimum)");
        if(groupSize) {
            if(isNaN(groupSize)) {
                alert("The input was not a number");
                return;
            } else {
                if(groupSize > studentCount) {
                    alert("Group size too large");
                    return;
                } else {
                    numGroups = Math.floor(studentCount / groupSize);
                }
            }
        } else {
            return;
        }
        // Delete Existing Group Chats
        for (let i = 0; i < classDoc.data().chats.length; i++) {
            const chat = classDoc.data().chats[i];
            await db.collection("chats").doc(chat).delete();
            await deleteCollection(`chats/${chat}/messages`);
            await deleteCollection(`chats/${chat}/announcements`);
        }

        //Randomize the student array
        let randomizedStudents = classDoc.data().members;
        randomizedStudents.shift();
        this.shuffle(randomizedStudents);

        //Make Groups
        let groups = [];
        for(let i = 0; i < numGroups; i++) {
            const ref = await addDocument("chats", {
                name: `Table Group ${i + 1}`,
                members: [this.props.user.uid]
            });
            groups.push(ref.id);
        }
        await updateDocument("classes", this.props.currentClass.code + "", {
            chats: groups
        });

        //Start grouping Students
        for(let i = 0; i < studentCount; i++) {
            const student = randomizedStudents[i];
            const groupIndex = i % numGroups;
            await  updateDocument("chats", groups[groupIndex], {
                members: firebase.firestore.FieldValue.arrayUnion(student)
            });
        }



        alert("New table groups have been made.")

    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
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
                                        value={this.state.className} onChange={e => this.setClassName(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <button type="button"
                                    class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                    onClick={() => this.makeClassOnFirebase()}
                            >
                                Get Class Code
                            </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                            <button type="button" onClick={() => this.setState({createClassModal: false})}
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
                                        value={this.state.className} onChange={e => this.setClassName(e.target.value)}/>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <button type="button"
                                    class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                    onClick={() => this.addClassOnFirebase()}
                            >
                                Join Class
                            </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                            <button type="button" onClick={() => this.setState({addClassModal: false})}
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
            return (<div/>)
        }

        const {role} = this.state.doc;
        let classes;
        if (this.state.doc) {
            classes = this.state.doc.classes.map(c => {
                return (
                    <li>
                        <ClassSelector name={c.name} code={c.code} setClass={this.props.setClass}
                                       currentClass={this.props.currentClass} setActive={this.props.setActive}/>
                    </li>
                )
            });
        } else {
            classes = <div/>;
        }

        return (
            <div
                class="fixed z-20 overflow-hidden bg-white mb-4 border-red-light w-full h-screen md:w-24 border-solid border-2 border-gray-200">
                <div class="flex w-full max-w-xs p-4 bg-white">
                    <ul class="flex flex-col w-full">
                        <li class="my-px">
                            <a onClick={role === "teacher" ? this.createClass : this.addClass} id="plus-icon-container"
                               class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100 border-2 border-gray-300 cursor-pointer">
                                <span class="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                         stroke-linecap="round"
                                         stroke-linejoin="round"
                                         stroke-width="2"
                                         viewBox="0 0 24 24"
                                         stroke="currentColor"
                                         class="h-6 w-6">
                                        <path
                                            d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
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
        if (!this.state.doc) {
            return (
                <div className="flex justify-center w-full"
                     style={{
                         'height': `${window.innerHeight}px`
                     }}
                >
                    <div className="self-center lds-dual-ring"/>
                </div>)
        }

        const {role} = this.state.doc;

        const {currentClass} = this.props;

        if (!currentClass) {
            return <div>Loading...</div>
        }

        let assignmentList = <div></div>;
        let chatList = <div></div>;

        if (this.state.assignments && this.state.assignments.length) {
            assignmentList = this.state.assignments.map(assignment => {
                const {id, name} = assignment;
                return (
                    <li class="my-px" key={id}>
                        <a onClick={() => {
                            this.props.setActive({name: 'assignment', id});
                        }}
                           className="flex flex-row items-center px-2 h-12 rounded-lg text-gray-600 hover:bg-p-light-purple hover:text-p-purple cursor-pointer">
                            <span className="ml-3">{name}</span>
                        </a>
                    </li>);
            })
        }

        if (this.state.chats && this.state.chats.length) {
            chatList = this.state.chats.map(chat => {
                const {id, name} = chat;
                return (
                    <li class="my-px" key={id}>
                        <a onClick={() => this.props.setActive({name: 'chat', id})}
                           className="flex flex-row items-center px-2 h-12 rounded-lg text-gray-600 hover:bg-p-light-purple hover:text-p-purple cursor-pointer">
                            <span className="ml-3">{name}</span>
                        </a>
                    </li>);
            })
        }


        return (
            <div style={{width: '300px'}}
                 class="fixed  overflow-hidden shadow-lg bg-white mb-4 border-red-light w-64 h-screen z-10 ml-24">
                <div class="flex max-w-xs p-4 bg-white">
                    <ul class="flex flex-col">
                        <div class="mb-6">
                            <li class="h-10 my-px">
                                <span
                                    className="ml-4 text-2xl text-p-dark-blue font-bold"> {this.props.currentClass.name}</span>
                            </li>
                            <li class="h-5 my-px">
                                <span className="ml-4 text-p-medium-gray">{this.state.doc.name}</span>
                            </li>
                            {role === 'teacher' ? <li class="h-5  my-px">
                                <span
                                    className="ml-4 text-p-medium-gray">Class Code: {this.props.currentClass.code}</span>
                            </li> : ''}
                        </div>
                        <li class="my-px">
                            <div
                                class="flex flex-row items-center h-12 px-4 w-auto rounded-lg text-gray-600 bg-p-light-purple">
                                <span class="ml-3 text-p-purple">{this.props.numStudents} Students</span>

                            </div>
                        </li>

                        <li className="my-px">
                            <span
                                className="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Assignments</span>
                        </li>

                        {assignmentList}

                        {role === "teacher" ? <li class="my-px">
                            <a onClick={() => this.props.setActive({name: 'create'})}
                               class="flex flex-row items-center h-12 px-4 rounded-lg text-p-purple hover:bg-p-light-purple cursor-pointer">
                                <span class="flex items-center justify-center text-lg text-p-purple">
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
                        </li> : <div></div>}
                        <li class="my-px">
                            <span
                                class="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Conversations</span>
                        </li>

                        {chatList}

                        {role === "teacher" ? <li class="my-px">
                            <a onClick={() => this.createGroupChats()}
                               class="flex flex-row items-center h-12 px-4 rounded-lg text-p-purple hover:bg-p-light-purple cursor-pointer">
                                <span class="flex items-center justify-center text-lg text-p-purple">
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
                                <span class="ml-3 ">Create Table Groups</span>
                            </a>
                        </li> : <div></div>}

                        <li class="my-px">
                            <a onClick={() => {
                                auth.signOut().then(() => {
                                    this.props.history.push("/");
                                })
                            }}
                               class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-red-200 cursor-pointer">
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
                                <span class="ml-3">Logout</span>
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
