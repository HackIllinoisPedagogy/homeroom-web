import React, { Component } from 'react';



class LogIn extends Component {


    render() {
        return (
            <div>
                <div>Log In Page</div>
                <button onClick={() => this.props.history.push('/dashboard')}> Next Page</button>
            </div>

        );
    }
}

export default LogIn;