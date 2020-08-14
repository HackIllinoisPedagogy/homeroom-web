import React, {Component} from 'react';
import _ from 'lodash';
import {addMessageToConversation, getMessagesFromConversation, getConversationsById} from '../messagingData';
import Message from './Message';
import {db, getDocument} from '../../services/firebase';
import {animateScroll} from "react-scroll";
import * as firebase from "firebase";


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
            announcements: null,
            active_tab: 0
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

    compareReverse (a, b) {
        if (a.createdOn > b.createdOn) {
            return -1;
        }
        if (a.createdOn < b.createdOn) {
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

        const {user: {uid}} = this.props;
        const userDoc = await getDocument('users', uid);
        if (userDoc.exists) {
            this.setState({currentUser: userDoc.data()});
        }


    }

    async componentDidMount() {
        this.scrollToBottom();
        await this.getCurrentUser();
        const {activeChatId} = this.props;
        const messagesSnapshot = await db.collection("chats")
            .doc(activeChatId)
            .collection("messages")
            .onSnapshot(snapshot => {
                let myDataArray = [];
                if (snapshot.size) {
                    snapshot.forEach(doc =>
                        myDataArray.push({...doc.data()})
                    );
                    console.log(myDataArray);
                    myDataArray.sort(this.compare);
                    this.setState({messages: myDataArray});

                } else {
                    console.log("err")
                }
            });
        db.collection("chats").doc(activeChatId).collection("announcements").onSnapshot(snapshot => {
            const temp_announcements = [];
            if (snapshot.size) {
                snapshot.forEach(doc => {
                    temp_announcements.push(doc.data());
                })
                temp_announcements.sort(this.compareReverse);
                this.setState({announcements: temp_announcements});
            } else {
                const temp_announcement = {
                    placeholder: true,
                }
                temp_announcements.push(temp_announcement);
                this.setState({announcements: temp_announcements});
            }
        })

        await this.getConversationsById(activeChatId);
        if (this.state.chatInfo) {
            await this.getMembers();
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
        if(prevProps.activeChatId !== this.props.activeChatId) {
            this.setState({messages: null});
            this.setState({members: null});
            this.componentDidMount();
        }
        if (this.state.chatInfo && !this.state.members) {
            this.getMembers();
        }
    }


    getMembers = async () => {
        const {activeChatId} = this.props;
        let members = [];
        for (let i = 0; i < this.state.chatInfo.members.length; i++) {
            const userRef = (await getDocument("users", this.state.chatInfo.members[i])).data();
            members.push({
                name: userRef.name,
                role: userRef.role
            });
        }
        this.setState({members});
    }

    getConversationsById = async (activeChatId) => {
        const chat = await getDocument('chats', activeChatId);
        if (chat.exists) {
            console.log("cat", chat.data());
            this.setState({chatInfo: chat.data()});
        }
    }


    renderChatHistory() {
        const {activeChatId, user: {uid}} = this.props;

        if (!this.state.messages) {
            return <div className="pl-6">No messages</div>
        }


        return this.state.messages.map((message, index) => {
            if(index === 0) return <Message uid={uid} message={message}/>
            return <Message uid={uid} message={message} prev={this.state.messages[index - 1]}/>
        });


    }

    addMessage = (e) => {
        e.preventDefault();
        if(this.state.message === '') return;
        const {activeChatId, user} = this.props;
        const message = {
            body: this.state.message,
            sentById: user.uid,
            sentByName: this.state.currentUser.name,
            createdOn: Date.now()
        };
        db.collection('chats').doc(activeChatId).collection('messages').add(message);
        this.setState({message: ''});

    }

    sendAnnouncement = async (e) => {
        e.preventDefault();
        if(this.state.message === '') return;
        const {activeChatId, user} = this.props;
        const message = {
            body: this.state.message,
            sentById: user.uid,
            sentByName: this.state.currentUser.name,
            createdOn: firebase.firestore.Timestamp.fromDate(new Date()),
        };
        await db.collection('chats').doc(activeChatId).collection('announcements').add(message);
        this.setState({message: ''});

    }

    announcementDiv(announcement) {
        if (announcement.placeholder) {
            return (
                <div className="text-base">
                    There are no announcements for this chat.
                </div>
            )
        }

        return (
            <div class="bg-white p-3 mx-3 my-2 h-auto">
                <div class="items-center h-auto">
                    <div class="h-auto">
                        <h2 class="text-base font-semibold text-gray-800">{announcement.body}</h2>
                        <p class="text-gray-500">Sent
                            by {announcement.sentByName} on {announcement.createdOn.toDate().toDateString()}.</p>
                    </div>
                </div>
            </div>);
    }

    renderAnnouncements() {
        return (
            <div className="w-full flex flex-col justify-center items-center" style={{height: '100%'}}>
                <div
                className="w-full justify-center rounded-lg flex flex-col bg-transparent p-3 h-full overflow-y-auto">

                    <div className="my-5 px-3 flex flex-col" style={{'height': '100%'}}>
                        {this.state.announcements ? this.state.announcements.map(announcement => this.announcementDiv(announcement)) :
                            <div className="w-full h-full flex flex-col justify-center">
                                <div className="self-center lds-dual-ring"/>
                            </div>
                        }
                    </div>

                </div>
            </div>);
    }

    renderMembers() {
        return (
            <div className="w-full flex flex-col justify-center h-auto items-center" style={{height: '100%'}}>
                <div
                    className="w-full justify-center shadow rounded-lg flex flex-col bg-white p-3 h-full overflow-y-auto">

                    <div className="my-5 px-3" style={{'height': '100%'}}>
                        {this.state.members ? this.state.members.map(member => {
                            console.log(member.name);
                            return <div class="flex justify-between px-2 py-2">
                                <p class="flex text-gray-700">
                                    <svg class="w-2 text-gray-500 mx-2" viewBox="0 0 8 8" fill="currentColor">
                                        <circle cx="4" cy="4" r="3"/>
                                    </svg>
                                    {member.name}
                                </p>
                                <p class="text-gray-500 font-thin">{_.startCase(member.role)}</p>
                            </div>

                        }) : <div className="w-full h-full flex flex-col justify-center">
                            <div className="self-center lds-dual-ring"/>
                        </div>}
                    </div>

                </div>
            </div>);
    }

    switchActive(i) {
        this.setState({active_tab: i});
    }

    renderSwitchButtons() {
        if (this.state.active_tab == 0) {
            return (
                <div id="switcher" className="announcement-member-container justify-start h-auto">
                    <div className="announcement-member-container h-auto w-auto mb-5 float-left switcher-active-tab justify-center" onClick={() => this.switchActive(0)}>
                        Announcements
                        <div className="h-1 w-10 bg-custom-purple mt-1"></div>
                    </div>
                    <div className="announcement-member-container h-auto w-auto mb-5 float-left ml-8 switcher-inactive-tab" onClick={() => this.switchActive(1)}>Members</div>
                </div>);
        }
        return (
            <div id="switcher" className="announcement-member-container justify-start h-auto">
                <div className="announcement-member-container h-auto w-auto mb-5 float-left switcher-inactive-tab" onClick={() => this.switchActive(0)}>Announcements</div>
                <div className="announcement-member-container h-auto w-auto mb-5 float-left ml-8 switcher-active-tab" onClick={() => this.switchActive(1)}>
                    Members
                    <div className="h-1 w-10 bg-custom-purple mt-1"></div>
                </div>
            </div>);
    }

    render() {
        const {activeChatId, user} = this.props;
        if (!activeChatId || !user || !this.state.chatInfo) {
            return <div>No Active chat or user</div>;
        }
        if(!this.state.members) {
            return <div className="h-screen w-full flex items-center justify-center">
                <div className="lds-dual-ring"/>
            </div>
        }
        if (this.state.members) {
            console.log(this.state.members, this.state.members.length);
        }
        if (!this.state.added) {
            this.setState({added: true});
        }

        let sendAnnouncementDiv = <div/>;
        if (this.props.role === "teacher") {
            sendAnnouncementDiv =
                <button
                    className="ml-2 flex-shrink-0 bg-p-orange hover:bg-red-700 border-p-orange hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
                    onClick={this.sendAnnouncement}
                >
                    Send as Announcement
                </button>;
        }


        return (
            <div class="flex items-start inline">
                <div class="w-4/6 flex flex-col h-screen ">
                    <div class="border-b flex px-6 py-2 mb-10 items-center mt-3">
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
                        <div style={{borderColor: '#7754F8'}}
                             class="flex w-full items-center border-b border-teal-500 p-8 mb-4 rounded shadow bg-white">
                            {/* <span class="text-3xl text-grey px-3 border-r-2 border-grey">+</span>
                    <input type="text" class="w-full px-4" placeholder="Message to #general" /> */}
                            <input
                                class="appearance-none bg-transparent border-none w-full text-gray-700 px-4 leading-tight focus:outline-none"
                                type="text" placeholder="Send a message..." value={this.state.message}
                                onChange={(e) => this.setState({message: e.target.value})}/>
                            <button style={{borderColor: '#7754F8', backgroundColor: '#7754F8'}}
                                    class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                    type="submit">
                                Send
                            </button>
                            {sendAnnouncementDiv}
                        </div>
                    </form>
                </div>
                <div className="w-2/6 flex-col flex justify-center items-center h-screen rounded-lg">
                    {this.renderSwitchButtons()}
                    <div className="bg-white rounded shadow-md announcement-member-container">
                    {(this.state.active_tab == 0 ? this.renderAnnouncements() : this.renderMembers())}
                    </div>
                </div>
            </div>


        );
    }
}

export default Chat;
