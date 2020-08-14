import React from "react";

function SubmissionCard(props) {
    let name = "w-1/5 "
    if(props.percent > 80){
        name+="text-green-500";
    }else if(props.percent > 70){
        name+="text-yellow-600" 
    }else{
        name+="text-red-400"
    }
    return (
        <div className="py-4 mb-2 px-4 mt-1 w-full rounded bg-white shadow-sm flex justify-between">
            <span className="w-1/5 truncate">
                {props.name}
            </span>
            <span className="w-1/5 text-gray-600">
                {props.date}
            </span>
            <span className="w-1/5">
                {props.polya}
            </span>
            <span className="w-1/5">
                {props.score}
            </span>
            <span className={name}>
                {props.percent}%
            </span>
        </div>
    );
}

export default SubmissionCard;
