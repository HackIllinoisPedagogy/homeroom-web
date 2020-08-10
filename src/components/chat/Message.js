import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { db, getDocument } from '../../services/firebase';


const useStyles = makeStyles((theme) => ({

    purple: {
        backgroundColor: 'rgb(119,84,248)',
    },
}));

const Message = (props) => {
    // const [name, setName] = useState('');
    const { message: { body, createdOn, sentById, sentByName }, uid } = props;

    const getInitialsFromName = (name) => {
        const string = name.split(" ").length > 1 ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}` : name.split(" ")[0][0];
        return string;
    }

    if (sentById === uid) {
        return (
            <div id="message-sent" class="relative text-right flex items-end mb-4 text-sm">
                <div class="absolute top-0 right-0 w-10 bg-p-light-purple text-p-purple mx-auto flex-shrink-0 flex items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10">
                    {getInitialsFromName(sentByName)}
                </div>
                {/* <Avatar class="" className={classes.purple}>AW</Avatar> */}
                <div class="flex-1 overflow-hidden" >
                    <div>
                        <span class="mr-12 text-p-dark-blue">{sentByName}</span>
                    </div>
                    <p style={{ maxWidth: '75%', float: 'right' }} class="p-5 mr-12 rounded-lg text-white bg-p-purple leading-normal">{body}</p>
                </div>

            </div>

        );
    } else {
        return (
            <div id="message-recieved" class="relative flex items-start mb-4 text-sm">
                <div class="absolute top-0 left-5 w-10 bg-p-light-purple text-p-purple mx-auto flex-shrink-0 flex items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10">
                {getInitialsFromName(sentByName)}
                </div>
                <div class="flex-1 overflow-hidden ">
                    <div>
                        <span class="text-p-dark-blue ml-12">{sentByName}</span>
                    </div>
                    <p style={{ maxWidth: '75%', float: 'left' }} class="p-5 ml-12 rounded-lg text-p-dark-blue bg-p-light-blue leading-normal">{body}</p>
                </div>
            </div>

        );
    }

    /* // <div id="message-sent" class="inline p-1">
            //     <Avatar alt="Remy Sharp" />
            //     <div id="message-sent" style={{maxWidth: '75%'}} class='rounded-lg text-white bg-p-purple' >
            //         <div class="p-5 ">
            //             <p class="text-base">{body}</p>
            //         </div>
            //     </div>
            // </div> */

    // <div id="message-recieved" class="inline p-1">
    //     <Avatar alt="Remy Sharp" />
    //     <div id="message-recieved" style={{ maxWidth: '75%' }} class='rounded-lg text-p-dark-blue bg-p-light-blue' >
    //         <div class="p-5 ">
    //             <p class="text-base">{body}</p>
    //         </div>
    //     </div>
    // </div>

}

export default Message;