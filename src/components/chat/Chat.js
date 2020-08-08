import React, { Component } from 'react';
import { addMessageToConversation, getMessagesFromConversation, getConversationsById } from '../messagingData';
import Message from './Message';




class Chat extends Component {

    constructor(props) {
        super(props);
        const state = {
            message: '',
        }
    }

    renderChatHistory() {
        const { activeChatId } = this.props;
        const messages = getMessagesFromConversation(activeChatId);
        return Object.values(messages).map(message => {
            return <Message message={message} />
        });


    }

    addMessage = () => {
        const { activeChatId } = this.props;
        const message = {
            body: this.state.message,
            sentByMe: true
        };
        addMessageToConversation(activeChatId, message);
    }


    render() {
        const { activeChatId } = this.props;

        if (!activeChatId) {
            return <div>Chat Page</div>;
        }


        return (
            <div>
                <div class="flex mb-4 h-screen w-full">
                    <div class="mt-10  w-5/6 grid grid-rows-6 grid-flow-col gap-4">
                        <div class="row-span-1">
                            <span className="text-3xl font-bold">
                                {getConversationsById(activeChatId).name}
                            </span>
                        </div>
                        <div class="row-span-4">
                            {this.renderChatHistory()}
                        </div>
                        <div class="row-span-1 ">
                            <form onSubmit={this.addMessage} class="absolute inset-x-10 bottom-10 w-4/12 mx-auto">
                                <div style={{ borderColor: '#7754F8' }} class="flex items-center border-b border-teal-500 p-8 rounded shadow bg-white py-2">
                                    <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Send a message..." onChange={(e) => this.setState({ message: e.target.value })} />
                                    <button style={{ borderColor: '#7754F8', backgroundColor: '#7754F8' }} class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                                        Send</button>
                                </div>

                            </form>
                        </div>
                        <div class="w-1/6 h-12"></div>
                    </div>

                </div>
            </div>


        );
    }
}

export default Chat;