import React, { Component } from 'react';
import {auth, db, getDocument} from "../services/firebase";
import Assignment from "./assignment/Assignment";
import CreateAssignment from './assignment/CreateAssignment';
import Chat from './chat/Chat';
import Sidebar from './sidebar/Sidebar';


class Dashboard extends Component {

    state = {
        active: {name: 'chat', id: 'conv1'},
        activeChatId: '',
        createAssignment: false,
        activeAssigmentId: '',
        user: null,
        currentClass: null,
    }

    setClass = c => this.setState({ currentClass: c });

    setActive = (active) => {
        console.log(active);
        this.setState({ active })
    }

    setUser = user => this.setState({user: user});

    componentDidMount() {
        auth.onAuthStateChanged(async user => {
            if (user) {
                const userDoc = await getDocument("users", user.uid + "");
                if(userDoc.data().classes.length > 0) {
                    this.setClass({
                        code: userDoc.data().classes[0].code,
                        name: userDoc.data().classes[0].name,
                    })
                } else {
                    this.props.history.push("/landing");
                }
                this.setUser(user);
            } else {
                this.props.history.push('/');
            }
        })
    }

    render() {

        let display;
        if(this.state.active.name === "chat"){
            display = <Chat activeChatId={this.state.active.id} />
            
        }
        else if(this.state.active.name === "assignment"){
            display = <Assignment activeAssignmentId={this.state.active.id} />   
        }
        else if(this.state.active.name === "create"){
            display = <CreateAssignment currentClass={this.state.currentClass}/>
            
        }
        // add for All Class once Firebase is in

        return (
            <div class="overflow-y-auto">
                <Sidebar user={this.state.user} setActive={this.setActive} history={this.props.history} currentClass={this.state.currentClass} setClass={this.setClass}/>
                <div id="dashboard-inner-container" className="pt-10">
                    {display}
                </div>
            </div>

        );
    }
}

export default Dashboard;