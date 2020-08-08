import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';


class Sidebar extends Component {


    render() {
        return (
            <div>
                <Menu
                    id="side-bar"
                    isOpen
                    noOverlay
                    disableCloseOnEsc
                    disableAutoFocus
                    width={330}>
                    <a id="home" className="menu-item">Home</a>
                    <a id="about" className="menu-item">About</a>
                    <a id="contact" className="menu-item">Contact</a>
                    <a onClick={this.showSettings} className="menu-item--small">Settings</a>


                </Menu>
                <Menu
                    id="class-list"
                    isOpen
                    noOverlay
                    disableCloseOnEsc
                    disableAutoFocus
                    width={100}>
                    <a id="box" className="menu-item"></a>
                </Menu>
            </div>

        );
    }
}

export default Sidebar;