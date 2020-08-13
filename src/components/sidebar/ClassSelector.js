import React, {useState} from "react";

function ClassSelector(props) {
    return (
        <div className="h-12 w-full flex rounded bg-p-purple text-white text-sm justify-center mt-3 hover:shadow hover:bg-purple-700 cursor-pointer"
             onClick={() => {
                 props.setClass({
                     code: props.code,
                     name: props.name
                 });
                 props.setActive('');
             }}
        >
            <span className="self-center text-center    ">
                {props.name}
            </span>
        </div>
    );
}

export default ClassSelector;
