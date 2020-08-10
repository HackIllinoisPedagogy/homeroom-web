import React, { Component } from 'react';
import _ from 'lodash';
import { addMessageToConversation, getMessagesFromConversation, getConversationsById } from '../messagingData';
import Message from './Message';
import { db, getDocument } from '../../services/firebase';
import { animateScroll } from "react-scroll";





class Chat extends Component {

    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
        this.state = {
            message: '',
            messages: null,
            chatInfo: null,
            currentUser: null,
            added: false,
        }
    }



    scrollToBottom() {
        console.log("hello");
        animateScroll.scrollToBottom({
            containerId: 'messagesDiv',
            duration: 10,
            smooth: true
        });
    }

    compare(a, b) {
        if (a.createdOn < b.createdOn) {
            return -1;
        }
        if (a.createdOn > b.createdOn) {
            return 1;
        }

        return 0;
    }

    // getNameFromMessageId = async (uid) => {
    //     const user = await getDocument('users', uid);
    //     if (user.exists) {
    //         console.log(name);
    //         setName(user.name);
    //     }
    // }

    getCurrentUser = async () => {
        if (!this.props.user) {
            return;
        }

        const { user: { uid } } = this.props;
        const userDoc = await getDocument('users', uid);
        if (userDoc.exists) {
            this.setState({ currentUser: userDoc.data() });
        }


    }

    async componentDidMount() {
        this.scrollToBottom();
        this.getCurrentUser();
        const { activeChatId } = this.props;
        const messagesSnapshot = await db.collection("chats")
            .doc(activeChatId)
            .collection("messages")
            .onSnapshot(snapshot => {
                let myDataArray = [];
                if (snapshot.size) {
                    snapshot.forEach(doc =>
                        myDataArray.push({ ...doc.data() })
                    );
                    console.log(myDataArray);
                    myDataArray.sort(this.compare);
                    this.setState({ messages: myDataArray });

                } else {
                    console.log("err")
                }
            });

        this.getConversationsById(activeChatId);
        if (this.state.chatInfo) {
            this.getMembers();
        }

    }


    componentDidUpdate() {
        console.log(this.state.messages);
        this.scrollToBottom()
        if (this.state.chatInfo && !this.state.members) {
            this.getMembers();
        }
    }

    getMembers = async () => {
        const { activeChatId } = this.props;
        let members = [];
        this.state.chatInfo.members.forEach(async memberId => {
            const member = await getDocument('users', memberId);
            if (member.exists) {
                members.push(member.data())

            }
        });
        console.log(members);
        this.setState({ members });
    }

    getConversationsById = async (activeChatId) => {
        const chat = await getDocument('chats', activeChatId);
        if (chat.exists) {
            console.log("cat", chat.data());
            this.setState({ chatInfo: chat.data() });
        }
    }




    renderChatHistory() {
        const { activeChatId, user: { uid } } = this.props;

        if (!this.state.messages) {
            return <div>No messages</div>
        }


        return this.state.messages.map(message => {
            return <Message uid={uid} message={message} />
        });



    }

    addMessage = (e) => {
        e.preventDefault();
        const { activeChatId, user } = this.props;
        const message = {
            body: this.state.message,
            sentById: user.uid,
            sentByName: this.state.currentUser.name,
            createdOn: Date.now()
        };
        db.collection('chats').doc(activeChatId).collection('messages').add(message);
        this.setState({message: ''});

    }

    render() {
        const { activeChatId, user } = this.props;
        if (!activeChatId || !user || !this.state.chatInfo) {
            return <div>No Active chat or user</div>;
        }
        if (this.state.members) {
            console.log(this.state.members, this.state.members.length);
        }
        if (!this.state.added) {
            this.setState({ added: true });
        }



        return (
            // <div>
            //     <div class="flex mb-4 h-screen w-full">
            //         <div class="mt-10  w-5/6 grid grid-rows-6 grid-flow-col gap-4">
            //             <div class="row-span-1">
            //                 <span className="text-3xl font-bold">
            //                     {this.getConversationsById(activeChatId).name}
            //                 </span>
            //             </div>
            //             <div class="row-span-4">
            //                 {this.renderChatHistory()}
            //             </div>
            //             <div class="row-span-1 ">
            //                 <form onSubmit={this.addMessage} class="absolute inset-x-10 bottom-10 w-4/12 mx-auto">
            //                     <div style={{ borderColor: '#7754F8' }} class="flex items-center border-b border-teal-500 p-8 rounded shadow bg-white py-2">
            //                         <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Send a message..." onChange={(e) => this.setState({ message: e.target.value })} />
            //                         <button style={{ borderColor: '#7754F8', backgroundColor: '#7754F8' }} class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
            //                             Send</button>
            //                     </div>

            //                 </form>
            //             </div>
            //             <div class="w-1/6 h-12"></div>
            //         </div>

            //     </div>
            // </div>
            <div class="flex items-start inline">
                <div class="w-4/6 flex flex-col h-screen ">
                    <div class="border-b flex px-6 py-2 mb-10 items-center">
                        <div class="flex flex-col">
                            <span className="text-3xl font-bold">
                                {this.state.chatInfo.name}
                            </span>
                            <div class="text-p-medium-gray font-thin text-sm">
                                Enjoy chatting!
                  	</div>
                        </div>
                    </div>

                    <div id="messagesDiv" ref={this.messagesEnd} class="w-full flex flex-col h-screen overflow-y-auto">
                        {this.renderChatHistory()}

                    </div>

                    <form onSubmit={this.addMessage} class="flex m-6 overflow-hidden">
                        <div style={{ borderColor: '#7754F8' }} class="flex w-full items-center border-b border-teal-500 p-8 mb-4 rounded shadow bg-white">
                            {/* <span class="text-3xl text-grey px-3 border-r-2 border-grey">+</span>
                    <input type="text" class="w-full px-4" placeholder="Message to #general" /> */}
                            <input class="appearance-none bg-transparent border-none w-full text-gray-700 px-4 leading-tight focus:outline-none" type="text" placeholder="Send a message..." value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} />
                            <button style={{ borderColor: '#7754F8', backgroundColor: '#7754F8' }} class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                                Send</button>
                        </div>
                    </form>
                </div>
                <div class="w-2/6 flex flex-col justify-center h-screen items-center">
                    <p class="px-2 text-p-dark-blue font-bold mb-2 text-2xl text-left font-thin px-4 pt-3">Members</p>
                    <div className="w-10/12 justify-center shadow rounded-lg h-64 flex flex-col bg-white p-3 overflow-y-auto">

                        <div class="py-5 px-3">
                            {this.state.members ? this.state.members.map(member => {
                                console.log("here");
                                return <div class="flex justify-between px-2 py-2">
                                    <p class="flex text-gray-700">
                                        <svg class="w-2 text-gray-500 mx-2" viewBox="0 0 8 8" fill="currentColor">
                                            <circle cx="4" cy="4" r="3" />
                                        </svg>
                                        {member.name}
                                    </p>
                                    <p class="text-gray-500 font-thin">{_.startCase(member.role)}</p>
                                </div>

                            }) : <div>Loading</div>}
                        </div>

                    </div>
                </div>
            </div>


        );
    }
}

export default Chat;