import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';




class Dashboard extends Component {


    render() {
        return (
            <div>
                <Sidebar />
                <div id="dashboard-inner-container">
                    <Chat />
                </div>
            </div>

        );
    }
}

export default Dashboard;