import React, { useState } from "react";
import ReactFitText from "react-fittext";
import Tooltip from '@material-ui/core/Tooltip';


function ClassSelector(props) {

    const getInitialsFromName = (name) => {
        const string = name.split(" ").length > 1 ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}` : name.split(" ")[0][0];
        return string;
    }

    const id = `response_${props.code}_${props.name}`;
    return (
        <Tooltip title={props.name} placement="right" arrow>
            <div
                className="h-auto w-full py-3 px-2 flex rounded bg-p-purple text-white justify-center mt-3 hover:shadow hover:border hover:border-p-purple hover:bg-white hover:text-p-purple items-center"
                onClick={() => {
                    props.setClass({
                        code: props.code,
                        name: props.name
                    });
                    props.setActive('');
                }}
            >


                <span id={id} className="w-full text-center text-xl h-full flex flex-col justify-center">
                    {getInitialsFromName(props.name)}
                </span>
            </div>
        </Tooltip>

    );
}

export default ClassSelector;