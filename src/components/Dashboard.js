import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';
import {auth} from "../services/firebase";




class Dashboard extends Component {

    state = {
        activeChatId: '',
        user: null,
    }

    setChat = (id) => {
        this.setState({ activeChatId: id })
    }

    setUser = user => this.setState({user: user});
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                this.setUser(user);
            } else {
                this.props.history.push('/');
            }
        })
    }

    render() {
        return (
            <div>
                <Sidebar user={this.state.user} setChat={this.setChat} history={this.props.history} />
                <div id="dashboard-inner-container">
                    <Chat activeChatId={this.state.activeChatId} />
                </div>
            </div>

        );
    }
}

export default Dashboard;