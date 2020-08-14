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
                    console.log(doc.id, " => ", doc.data());
                    const problems = [];
                    db.collection('analytics').doc(doc.id).collection('problems').get()
                        .then(problem => {
                            problem.forEach(problemDoc => {
                                problems.push(problemDoc.data())
                            });
                        });
                    console.log("problems: ", problems)
                    db.collection('users').doc(doc.data().userId).get().then(nameDoc =>
                        analyticsArray.push({ ...doc.data(), problems, name: nameDoc.data() }))
                    console.log("Analytics array: " + analyticsArray);
                });
                setAnalytics(analyticsArray);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    const getAverageScore = (id, stringValue) => {
        console.log("analytics: ", analytics)
        //const submission = analytics.filter(obj => (obj.userId === id))[0];
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
        console.log("avg score: ", score/totalPoints);
        return score / totalPoints * 100;

    }

    const getAveragePolyaUses = (id) => {
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
        console.log("polya uses: " + count)
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

    // const style = {
    //     /* Rectangle 18 */
    //
    //     position: absolute,
    //     width: 286,
    //     height: 513,
    //     left: 1104,
    //     top: 218,
    //
    //     background: bg-custom-purple,
    //     box-shadow: 0px 4px 5px rgba(168, 168, 168, 0.12);
    //     border-radius: 7px;
    //
    // }
    return (
        <div className="py-8 w-3/5 float-left">
            <h1 className="text-black font-bold text-4xl">Home</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 sm:px-6 p-3">
                <div className="float-left">
                    <h3 className="text-grey-900 font-bold text-2xl">Grade</h3>
                    <div>{analytics ? getAverageScore() + "%" : "none"}</div>
                </div>
                <div className="float-left pl-10">
                    <h3 className="text-grey-900 font-bold text-2xl">Polya Used</h3>
                    <div>{analytics ? getAveragePolyaUses() + " times" : "none"}</div>
                </div>
                <div className="float-right">
                    <h3 className="text-grey-900 font-bold text-2xl">Average Time Taken</h3>
                    <div>{analytics ? getTimeDiff() + " minutes" : "none"}</div>
                </div>
            </div>

        </div>
    );
}

export default Home;