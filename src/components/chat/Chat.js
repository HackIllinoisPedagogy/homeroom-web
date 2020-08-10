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
            currentUser: null
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
    }


    componentDidUpdate() {
        console.log(this.state.messages);
        this.scrollToBottom()
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


    }

    render() {
        const { activeChatId, user } = this.props;
        if (!activeChatId || !user || !this.state.chatInfo) {
            return <div>No Active chat or user</div>;
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

            <div class="w-4/6 flex flex-col h-screen ">
                <div class="border-b flex px-6 py-2 items-center">
                    <div class="flex flex-col">
                        <span className="text-3xl font-bold">
                            {this.state.chatInfo.name}
                        </span>
                        <div class="text-grey font-thin text-sm">
                            Chit-chattin' about ugly HTML and mixing of concerns.
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
                        <input class="appearance-none bg-transparent border-none w-full text-gray-700 px-4 leading-tight focus:outline-none" type="text" placeholder="Send a message..." onChange={(e) => this.setState({ message: e.target.value })} />
                        <button style={{ borderColor: '#7754F8', backgroundColor: '#7754F8' }} class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                            Send</button>
                    </div>
                </form>
            </div>


        );
    }
}

export default Chat;