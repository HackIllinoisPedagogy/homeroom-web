import React, {useEffect, useState} from "react";
import SubmissionCard from "./SubmissionCard";
import {db, getCollection, getDocument} from "../../services/firebase";

function TeacherAssignment() {
    const [height, setHeight] = useState(0);
    const [completed, setCompleted] = useState(true);
    let completedDiv =
        <span className="text-gray-400" onClick={() => setCompleted(true)}>
            Completed
        </span>;
    let notCompletedDiv =
        <span className="text-gray-400" onClick={() => setCompleted(false)}>
            Not Completed
        </span>;
    if (completed) {
        completedDiv =
            <span className="border-b border-p-purple" onClick={() => setCompleted(true)}>
                Completed
            </span>;
    } else {
        notCompletedDiv =
            <span className="border-b border-p-purple" onClick={() => setCompleted(false)}>
                Not Completed
            </span>;
    }


    useEffect(() => {
        console.log("hook");
        setHeight(window.innerHeight - document.getElementById("assignmentInfo").clientHeight);
    });

    return (
        <div className="flex flex-col">
            <div id="assignmentInfo" className="flex flex-col px-32 pt-16">
            <span className="text-3xl font-bold">
                Assignment name
            </span>
                <span className="text-gray-500 w-3/5">
                Assignment description
            </span>
                <div className="h-1 w-3/5 bg-gray-300 mt-3"/>
                <div className="flex w-3/4 justify-between my-16">
                    <div className="flex flex-col">
                    <span className="self-center">
                        Average Score
                    </span>
                        <span className="text-6xl self-center   ">
                        82%
                    </span>
                    </div>
                    <div className="flex flex-col">
                    <span className="self-center">
                        Average Score
                    </span>
                        <span className="text-6xl self-center   ">
                        82%
                    </span>
                    </div>
                    <div className="flex flex-col">
                    <span className="self-center">
                        Average Score
                    </span>
                        <span className="text-6xl self-center   ">
                        82%
                    </span>
                    </div>
                </div>
                <div className="flex justify-between w-1/4">
                    {completedDiv}
                    {notCompletedDiv}
                </div>

                <div className="flex justify-between w-full mt-8 pb-5 px-3">
                    <span className="text-gray-400 w-1/4">
                        Name
                    </span>
                    <span className="text-gray-400 w-1/4">
                        Submitted On
                    </span>
                    <span className="text-gray-400 w-1/4">
                        Score
                    </span>
                    <span className="text-gray-400 w-1/4">
                        Percent
                    </span>
                </div>
            </div>
            <div className="flex flex-col mx-32" style={{'height': `${height}px`}}>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
                <SubmissionCard name={"Ashish Rao"} date={"4/20/69"} score={'5/43'} percent={"11%"}/>
            </div>
        </div>
    );
}

export default TeacherAssignment;