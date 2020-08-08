import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';




class Dashboard extends Component {

    state = {
        activeChatId: ''
    }

    setChat = (id) => {
        this.setState({ activeChatId: id })
    }


    render() {
        return (
            <div>
                <Sidebar setChat={this.setChat} history={this.props.history} />
                <div id="dashboard-inner-container">
                    <Chat activeChatId={this.state.activeChatId} />
                </div>
            </div>

        );
    }
}

export default Dashboard;