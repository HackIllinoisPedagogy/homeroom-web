import React from "react";

function ClassSelector(props) {
    return (
        <div className="h-12 w-full flex rounded bg-p-purple text-white text-sm justify-center mt-3">
            <span className="self-center text-center    ">
                {props.name}
            </span>
        </div>
    );
}

export default ClassSelector;