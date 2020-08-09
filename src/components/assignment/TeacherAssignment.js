import React, {useEffect, useState} from "react";

function TeacherAssignment() {
    const [height, setHeight] = useState(0);
    useEffect(() => {
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
                <span className="un">
                    Completed
                </span>
                    <span>
                    Not Completed
                </span>
                </div>

                <div className="flex justify-between w-full mt-8">
                    <span className="text-gray-400">
                        Name
                    </span>
                    <span className="text-gray-400">
                        Submitted On
                    </span>
                    <span className="text-gray-400">
                        Score
                    </span>
                    <span className="text-gray-400">
                        Percent
                    </span>
                </div>
            </div>
            <div className="bg-p-orange" style={{'height': `${height}px`}}/>
        </div>
    );
}

export default TeacherAssignment;