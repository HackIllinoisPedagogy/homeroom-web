import React, {Component} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from "react-bootstrap/Dropdown";

class Assignment extends Component {
    render() {
        return (
            <div>
                <div><h1>Recursion Assignment</h1></div>
                <div><h2>Description</h2></div>
                <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                    <Dropdown.Item href="#/action-1">1.</Dropdown.Item><br/>
                    <Dropdown.Item href="#/action-2">2.</Dropdown.Item><br/>
                    <Dropdown.Item href="#/action-3">3.</Dropdown.Item><br/>
                </DropdownButton>
            </div>

        );
    }
}

export default Assignment;





