import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import CreateAssignment from './assignment/CreateAssignment'
import Chat from './chat/Chat';
import { auth, db } from "../services/firebase";




class Dashboard extends Component {

    state = {
        activeChatId: null,
        createChat: false,
        user: null,
        currentClass: 0
    }

    setClass = c => this.setState({ currentClass: c });

    setChat = (id) => {
        this.setState({ activeChatId: id, createChat: null })
    }

    setCreate = () => {
        this.setState({ activeChatId: null, createChat: true })
    }



    setUser = user => this.setState({ user: user });
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection("users").doc(user.uid).get().then(doc => {
                    if (doc.data().classes.length >= 0) {
                        this.setState({
                            user: user,
                            currentClass: doc.data().classes[0],
                        })
                    } else {
                        this.setUser(user);
                    }
                })
                this.setUser(user);
            } else {
                this.props.history.push('/');
            }
        })
    }

    render() {
        return (
            <div>
                <Sidebar user={this.state.user} setCreate={this.setCreate} setChat={this.setChat} history={this.props.history} currentClass={this.state.currentClass} setClass={this.setClass} />
                <div id="dashboard-inner-container" className="pt-10">
                    {this.state.activeChatId ? <Chat activeChatId={this.state.activeChatId} /> : ''}
                    {this.state.createChat ? <CreateAssignment  user={this.state.user} /> : ''}
                </div>
            </div>

        );
    }
}

export default Dashboard;