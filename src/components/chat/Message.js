import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const Message = (props) => {
    const { message: { body, createdOn, sentBy }, uid } = props;


    return (
        <div class="p-1">
            <Avatar alt="Remy Sharp"/>
            <div id={sentBy === uid ? "message-sent" : "message-recieved"} class='rounded-lg'>
                <div class="p-5 ">
                    <p class="text-base">{body}</p>
                </div>
            </div>
        </div>
    );
}

export default Message;