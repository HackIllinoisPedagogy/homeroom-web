import React, { Component } from 'react';
import { auth, db } from "../services/firebase";
import Assignment from "./assignment/Assignment";
import CreateAssignment from './assignment/CreateAssignment';
import Chat from './chat/Chat';
import Sidebar from './sidebar/Sidebar';


class Dashboard extends Component {

    state = {
        active: {name: 'chat', id: 'conv1'},
        activeChatId: '',
        createAssignment: false,
        activeAssignemntId: '',
        user: null,
        currentClass: null,
    }

    setClass = c => this.setState({ currentClass: c });

    setChat = (id) => {
        this.setState({ activeChatId: id})
    }

    setCreate = () => {
        this.setState({ createAssignment: true })
    }


    setUser = user => this.setState({ user: user });

    setAssignment = (id) => {
        this.setState({activeAssignemntId: id})
    }

    setActive = (active) => {
        this.setState({ active })
    }


    setUser = user => this.setState({user: user});

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

        let display;
        if(this.state.active.name === "chat"){
            display = <Chat activeChatId={this.state.active.id} />
            
        }
        else if(this.state.active.name === "assignment"){
            display = <Assignment activeAssignmentId={this.state.active.id} />   
        }
        else if(this.state.active.name === "create"){
            display = <CreateAssignment />
            
        }
        // add for All Class once Firebase is in

        return (
            <div>
                <Sidebar user={this.state.user} setActive={this.setActive} history={this.props.history} currentClass={this.state.currentClass} setClass={this.setClass}/>
                <div id="dashboard-inner-container" className="pt-10">
                    {display}
                </div>
            </div>

        );
    }
}

export default Dashboard;