import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';
import {auth, db} from "../services/firebase";
import Assignment from "./assignment/Assignment";


class Dashboard extends Component {

    state = {
        activeChatId: '',
        activeAssignemntId: '',
        user: null,
        currentClass: null,
    }

    setClass = c => this.setState({currentClass: c});

    setChat = (id) => {
        this.setState({ activeChatId: id })
    }

    setAssignment = (id) => {
        this.setState({activeAssignemntId: id})
    }

    

    setUser = user => this.setState({user: user});

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                db.collection("users").doc(user.uid).get().then(doc => {
                    if(doc.data().classes.length >= 0) {
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

        let display;
        if(this.state.activeChatId != ''){
            display = <Chat activeChatId={this.state.activeChatId} />
            
        }
        else if(this.state.activeAssignmentId != ''){
            display = <Assignment activeAssignmentId={this.state.activeAssignemntId} />
            
        }
        // add for All Class once Firebase is in

        return (
            <div>
                <Sidebar user={this.state.user} setChat={this.setChat} setAssignment={this.setAssignment} history={this.props.history} currentClass={this.state.currentClass} setClass={this.setClass}/>
                <div id="dashboard-inner-container">
                    {display}
                </div>
            </div>

        );
    }
}

export default Dashboard;