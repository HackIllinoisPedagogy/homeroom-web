import React from 'react';

const Message = (props) => {
    const { body, sentByMe } = props.message;


    return (
        <div class="p-8">
            <div id={sentByMe ? "message-sent" : "message-recieved"} class='rounded-lg'>
                <div class="p-5 ">
                    <p class="text-base">{body}</p>
                </div>
            </div>
        </div>
    );
}

export default Message;