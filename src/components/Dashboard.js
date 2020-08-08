import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';
import {auth} from "../services/firebase";
import Assignment from "./assignment/Assignment";


class Dashboard extends Component {

    state = {
        activeChatId: '',
        activeAssignemntId: '',
        user: null,
    }

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
                <Sidebar user={this.state.user} setChat={this.setChat} setAssignment = {this.setAssignment} history={this.props.history} />
                <div id="dashboard-inner-container">
                    {display}
                </div>
            </div>

        );
    }
}

export default Dashboard;