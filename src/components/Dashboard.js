import React, { Component } from 'react';
import {auth, db, getDocument} from "../services/firebase";
import Assignment from "./assignment/Assignment";
import CreateAssignment from './assignment/CreateAssignment';
import Chat from './chat/Chat';
import Sidebar from './sidebar/Sidebar';


class Dashboard extends Component {

    state = {
        active: '',
        activeChatId: '',
        createAssignment: false,
        activeAssigmentId: '',
        user: null,
        currentClass: null,
        numStudents: 0,
    }

    setNumStudents = n => this.setState({numStudents: n})

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
                    const temp_classRef = await getDocument("classes", userDoc.data().classes[0].code + "");
                    this.setNumStudents(temp_classRef.data().members.length - 1);
                } else {
                    this.props.history.push("/landing");
                }
                this.setUser(user);
            } else {
                this.props.history.push('/');
            }
        })
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.currentClass && prevState.currentClass.code !== this.state.currentClass.code) {
            const classRef = await getDocument("classes", this.state.currentClass.code + "");
            this.setNumStudents(classRef.data().members.length - 1);
        }
    }

    render() {

        let display;
        if(this.state.active.name === "chat"){
            display = <Chat user={this.state.user} activeChatId={this.state.active.id} />
            
        }
        else if(this.state.active.name === "assignment"){
            display = <Assignment user={this.state.user} activeAssignmentId={this.state.active.id} />   
        }
        else if(this.state.active.name === "create"){
            display = <CreateAssignment user={this.state.user} currentClass={this.state.currentClass}/>
            
        }
        // add for All Class once Firebase is in

        return (
            <div class="overflow-y-auto">
                <Sidebar user={this.state.user} numStudents={this.state.numStudents} setActive={this.setActive} history={this.props.history} currentClass={this.state.currentClass} setClass={this.setClass}/>
                <div id="dashboard-inner-container">
                    {display}
                </div>
            </div>

        );
    }
}

export default Dashboard;