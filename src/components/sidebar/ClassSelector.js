import React, {useState} from "react";
import ReactFitText from "react-fittext";

function ClassSelector(props) {
    const id = `response_${props.code}_${props.name}`;
    return (
        <div
            className="h-12 w-full flex rounded bg-p-purple text-white justify-center mt-3 hover:shadow hover:bg-purple-700 items-center"
            onClick={() => {
                props.setClass({
                    code: props.code,
                    name: props.name
                });
                props.setActive('');
            }}
        >
            <ReactFitText compressor={0.55}>
                <span id={id} className="w-full text-center h-full flex flex-col justify-center">
                    {props.name}
                </span>
            </ReactFitText>
        </div>

    );
}

export default ClassSelector;