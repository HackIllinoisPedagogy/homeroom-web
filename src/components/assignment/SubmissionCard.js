import React from "react";

function SubmissionCard(props) {
    return (
        <div className="py-2 px-3 mt-1 w-full rounded bg-white shadow flex justify-between">
            <span className="w-1/4">
                {props.name}
            </span>
            <span className="w-1/4">
                {props.date}
            </span>
            <span className="w-1/4">
                {props.score}
            </span>
            <span className="w-1/4">
                {props.percent}
            </span>
        </div>
    );
}

export default SubmissionCard;