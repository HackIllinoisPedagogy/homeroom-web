import React, {useEffect, useState} from "react";
import {db, getCollection} from "../services/firebase";

function ProfileDropDown(props) {
    const [grade, setGrade] = useState(-1);
    const [usedPolya, setUsedPolya] = useState(-1);
    const [averageTime, setAverageTime] = useState(-1);
    const [loaded, setLoaded] = useState(false);

    const getAnalytics = async () => {
        const docRefs = (await db.collection("analytics").where("userId", "==", props.user.uid).get()).docs;
        if(docRefs.length === 0) {
            return;
        }

        let totalTime = 0;
        let totalScore = 0;
        let totalPossible = 0;
        let totalPolya = 0;

        for (let i = 0; i < docRefs.length; i++) {
            let docRef = docRefs[i];
            totalTime += docRef.data().timeSubmitted.toDate().getMinutes() - docRef.data().timeStarted.toDate().getMinutes();
            const problemsRefs = (await getCollection(`analytics/${docRef.id}/problems`)).docs;
            totalPossible += problemsRefs.length;
            for(let j = 0; j < problemsRefs.length; j++) {
                let problem = problemsRefs[j].data();
                if(problem.isCorrect) {
                    totalScore++;
                }
                totalPolya += problem.polyaCount;
            }
        }
        setGrade(Math.round(totalScore / totalPossible * 100));
        setUsedPolya(totalPolya);
        setAverageTime(Math.round(totalTime / docRefs.length));
    }

    useEffect( () => {
        const func = async () => {
            await getAnalytics();
            setLoaded(true);
        }
        func();
    }, [props.user.uid]);

    if(!loaded) {
        return (
            <div className="absolute top-0 mt-40 bg-white left-0 ml-32 w-1/5 px-3 py-2 flex flex-col rounded shadow-xl justify-center items-center">
                <div className="lds-dual-ring"/>
            </div>
        )
    }

    if(grade === -1) {
        return (
            <div className="absolute top-0 mt-40 bg-white left-0 ml-32 w-1/5 px-3 py-2 flex flex-col rounded shadow-xl">
                <span>
                    No data yet. Do some assignments!
                </span>
            </div>
        )
    }

    return (
        <div className="absolute top-0 mt-40 bg-white left-0 ml-32 w-1/5 px-3 py-2 flex flex-col rounded shadow-xl">
            <span>
                <span className="font-bold">All Classes Grade: </span>{grade}%
            </span>
            <span>
                <span className="font-bold">Times used Polya: </span>{usedPolya} times
            </span>
            <span>
                <span className="font-bold">Average Time per Assignment: </span>{averageTime} minutes
            </span>
        </div>
    );



}

export default ProfileDropDown;