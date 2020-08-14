import React, {useEffect, useState} from "react";
import {db, getCollection, getDocument} from "../../services/firebase";
import "../../tailwind.css";

// Home
// {Greeting} {name}
// Recently completed
// Your stats
    // avg score or avg correct
    // avg Polya uses or total Polya uses
    // avg time per problem

function Home(props) {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        console.log("Getting analytics data");
        getAnalyticsData();
    }, [props.user]);

    const getAnalyticsData = async () => {
        const analyticsArray = [];
        if(!props.user) {
            return ("");
        }
        db.collection("analytics").where("userId", "==", props.user.uid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    const problems = [];
                    db.collection('analytics').doc(doc.id).collection('problems').get()
                        .then(problem => {
                            problem.forEach(problemDoc => {
                                problems.push(problemDoc.data())
                            });
                        });
                    db.collection('users').doc(doc.data().userId).get().then(nameDoc =>
                        analyticsArray.push({ ...doc.data(), problems, name: nameDoc.data() }))
                });
                setAnalytics(analyticsArray);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    const getAverageScore = (id, stringValue) => {
        if (! analytics) {
            return ("");
        }
        let totalPoints = 0;
        let score = 0;
        analytics.forEach(assignment => {
            totalPoints += assignment.problems.length;
            score = assignment.problems.filter(obj => (obj.isCorrect)).length;
        })

        if (stringValue) {
            return `${score}/${totalPoints}`;
        }
        return score / totalPoints * 100;
    }

    const getAveragePolyaUses = () => {
        if (! analytics) {
            return ("");
        }
        let problemsWithPolyaUse = [];
        let count = 0;
        analytics.forEach(assignment => {
            problemsWithPolyaUse = assignment.problems.filter(obj => (obj.polyaCount > 0));
            problemsWithPolyaUse.forEach(problem => {
                count += problem.polyaCount;
            });
        });
        return count;
    }

    const getTimeDiff = (date1, date2) => {
        console.log(date1, date2);
        let dif = (date2 - date1);
        console.log(dif);
        dif = Math.round(dif / 60);
        return dif;
    }

    const getTimeData = (problemIndex) => {
        if (!analytics) {
            return "";
        }

        analytics.forEach(submission => {
            const {timeStarted, timeEnded} = submission.problems[problemIndex];
            const mins = getTimeDiff(timeStarted.seconds, timeEnded.seconds);
        });
    }

    const getRecentList = (id) => {
        if (! analytics) {
            return ("");
        }

        const recents = analytics.filter(obj => (obj.userId === id))[0];
        console.log("recent assignments: ",  recents);
    }

    return (
        <div>
        <div className="px-16 py-20 float-left">
            <h1 className="text-black font-bold text-4xl">Home</h1>
            <h2 className="text-grey-700 text-xl pb-3">Welcome, props.user</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 sm:px-6 p-3">
                <div className="float-left">
                    <h3 className="text-grey-900 font-bold text-2xl">Grade</h3>
                    <div>{analytics ? getAverageScore() + "%" : "none"}</div>
                </div>
                <div className="float-left pl-10">
                    <h3 className="text-grey-900 font-bold text-2xl">Polya Used</h3>
                    <div>{analytics ? getAveragePolyaUses() + " times" : "none"}</div>
                </div>
                <div className="float-right pl-10">
                    <h3 className="text-grey-900 font-bold text-2xl">Average Time Taken</h3>
                    <div>{analytics ? getTimeDiff() + " minutes" : "none"}</div>
                </div>
            </div>
            <div>
                <h2 className="text-black font-bold text-2xl pt-5">Recently Completed</h2>

            </div>
        </div>
            <div className="py-48 pr-16">
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    {/*<img className="w-full" src="" alt="proile pic"/>*/}
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">About You</div>
                        <p className="text-gray-700 text-base">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores
                            et perferendis eaque, exercitationem praesentium nihil.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;