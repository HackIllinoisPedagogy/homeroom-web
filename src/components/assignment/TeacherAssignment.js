import React, { useEffect, useState } from "react";
import SubmissionCard from "./SubmissionCard";
import { db, getCollection, getDocument } from "../../services/firebase";
import Dropdown from "../custom/Dropdown";
import { Chart } from "react-charts";
import moment from 'moment';
import { ResponsiveBar } from '@nivo/bar'
import { assign } from "lodash";
import { getAssignments } from "../messagingData";


function TeacherAssignment(props) {
    const [height, setHeight] = useState(0);
    const [completed, setCompleted] = useState(true);
    const [assignment, setAssignment] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [problemList, setProblemList] = useState(null);
    const [currentGraphProblem, setCurrentGraphProblem] = useState(null);

    useEffect(() => {
        console.log(props.activeAssignmentId);
        updateAssignment();
    }, [props.activeAssignmentId]);

    useEffect(() => {
        generateProblemList();
        getAnalyticsData();
    }, [assignment])

    const generateProblemList = () => {
        if (!assignment) {
            console.log("JFNDKJSFJKSDKF")
            return [];
        }

        const list = []


        assignment.problems.forEach((problem, i) => {
            list.push({ label: `Problem ${i + 1}`, value: i });
        })

        setProblemList(list);
        // alert("helo");
        setCurrentGraphProblem(list[0]);
    }

    const updateAssignment = async () => {
        const aRef = (await getDocument("assignments", props.activeAssignmentId)).data();
        setAssignment(aRef);
    }

    const getAnalyticsData = async () => {
        const analyticsArray = [];
        // db.collection("analytics").where("assignmentId", "==", props.activeAssignmentId)
        //     .get()
        //     .then(function (querySnapshot) {
        //         querySnapshot.forEach(function (doc) {
        //             // console.log(doc.id, " => ", doc.data());
        //             const problems = [];
        //             db.collection('analytics').doc(doc.id).collection('problems').get().then(problem => {
        //                 problem.forEach(problemDoc => {
        //                     problems.push(problemDoc.data())
        //                 });
        //
        //             });
        //
        //             db.collection('users').doc(doc.data().userId).get().then(nameDoc => analyticsArray.push({ ...doc.data(), problems, name: nameDoc.data() }))
        //
        //         });
        //         setAnalytics(analyticsArray);
        //     })
        //     .catch(function (error) {
        //         console.log("Error getting documents: ", error);
        //     });
        const collection = await db.collection("analytics").where("assignmentId", "==", props.activeAssignmentId).get();
        for (let i = 0; i < collection.docs.length; i++) {
            const doc = collection.docs[i];
            const problems = [];
            const problem = await db.collection("analytics").doc(doc.id).collection('problems').get();
            problem.docs.forEach(problemDoc => {
                problems.push(problemDoc.data());
            });
            const nameDoc = await getDocument('users', doc.data().userId);
            analyticsArray.push({ ...doc.data(), problems, name: nameDoc.data() });
        }
        setAnalytics(analyticsArray);
    }

    const updateGraphProblem = (item) => {
        setCurrentGraphProblem(item);
    }

    const getIndividualScore = (id, stringValue) => {
        const submission = analytics.filter(obj => (obj.userId === id))[0];
        const totalPoints = submission.problems.length;
        const score = submission.problems.filter(obj => (obj.isCorrect)).length;
        if (stringValue) {
            return `${score}/${totalPoints}`;
        }

        return score / totalPoints;

    }

    const getIndividualPolyaUses = (id) => {
        const submission = analytics.filter(obj => (obj.userId === id))[0];
        const problemsWithPolyaUse = submission.problems.filter(obj => (obj.polyaCount > 0));
        let count = 0;
        problemsWithPolyaUse.forEach(problem => {
            count += problem.polyaCount;
        });

        return count;
    }



    const getAverageScore = () => {
        if (!analytics.length) {
            return "";
        }
        const scoreArr = [];
        analytics.forEach(submission => {
            scoreArr.push(getIndividualScore(submission.userId));
        })


        // console.log(scoreArr);
        return (Math.round(100 * (scoreArr.reduce((p, c) => p + c, 0) / scoreArr.length)));
    }

    const getPolyaUse = () => {
        if (!analytics.length) {
            return "";
        }
        const polyaCount = analytics.filter(submission => (getIndividualPolyaUses(submission.userId) > 0)).length;
        // console.log(scoreArr);
        return (Math.round(100 * (polyaCount / analytics.length)));
    }

    const getTimeDiff = (date1, date2) => {
        let dif = (date2 - date1);
        dif = dif / 60;
        return Math.ceil(dif);
    }

    const getAverageAssignmentTime = () => {
        if (!analytics.length) {
            return "";
        }

        let totalTime = 0;
        analytics.forEach(submission => {
            const mins = getTimeDiff(submission.timeStarted.seconds, submission.timeSubmitted.seconds);
            totalTime += mins;
        })

        return (Math.ceil(totalTime / analytics.length));
    }


    const getTimeData = (problemIndex) => {
        if (!analytics) {
            return "";
        }

        const graphData = [];

        analytics.forEach(submission => {
            const { timeStarted, timeEnded } = submission.problems.filter(obj => obj.index == problemIndex)[0];
            const mins = getTimeDiff(timeStarted.seconds, timeEnded.seconds);
            graphData.push({ 'Student': submission.name.name, 'Time': mins });
        });


        if (graphData.length < 1) {
            console.log("gere");
            // return ([{
            //     label: 'Series 1',
            //     data: [
            //         { x: 1, y: 10 },
            //         { x: 2, y: 10 },
            //         { x: 3, y: 10 },
            //     ],
            // }]);
            return ([
                { 'Student': 'bob', 'Time': 10 },
                { 'Student': 'bob', 'Time': 4 },
                { 'Student': 'bob', 'Time': 16 },
            ]);
        }
        console.log(graphData);
        return (graphData);


    }

    // const data = [{
    //     label: 'Series 1',
    //     data: [
    //         { x: 1, y: 10 },
    //         { x: 2, y: 10 },
    //         { x: 3, y: 10 },
    //     ],
    // }];




    let completedDiv =
        <span className="text-gray-400 py-2" onClick={() => setCompleted(true)}>
            Completed
        </span>;
    let notCompletedDiv =
        <span className="text-gray-400 py-2" onClick={() => setCompleted(false)}>
            Not Completed
        </span>;
    if (completed) {
        completedDiv =
            <span className="border-b-2 rounded-md text-p-dark-blue border-p-purple py-2" onClick={() => setCompleted(true)}>
                Completed
            </span>;
    } else {
        notCompletedDiv =
            <span className="border-b-2 rounded-md text-p-dark-blue border-p-purple py-2" onClick={() => setCompleted(false)}>
                Not Completed
            </span>;
    }


    // useEffect(() => {
    //     if (document.getElementById("assignmentInfo")) setHeight(window.innerHeight - document.getElementById("assignmentInfo").clientHeight);
    // }, [window.innerHeight, document.getElementById("assignmentInfo")]);

    if (!assignment) {
        return (
            <div id="assignmentInfo" className="flex justify-center w-full"
                style={{ 'height': `${window.innerHeight}px` }}>
                <div className="self-center lds-dual-ring" />
            </div>
        )
    }

    const MyResponsiveBar = (data) => (
        <ResponsiveBar
            data={data}
            keys={['Time']}
            indexBy="Student"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            // colors={{ scheme: "nivo" }}
            // borderColor="#000000"
            borderRadius={6}
            defs={[

                {
                    id: 'gradient',
                    type: 'linearGradient',
                    colors: [
                        { offset: 0, color: '#7754F8' },
                        { offset: 100, color: '#4E24E8' },
                    ],
                },
            ]}
            fill={[
                // match using object query
                { match: '*', id: 'gradient' }

            ]}
            // borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Student',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )

    const timeConvert = (num) => {
        var hours = Math.floor(num / 60);
        var mins = num % 60;
        if(hours > 0){
            if(mins > 0){
                return hours + " hrs" + mins + " mins";
            }
            return hours + " hrs";
        }

        return mins + " mins";
        
    }


    console.log(currentGraphProblem);
    return (
        <div className="flex flex-col">
            <div id="assignmentInfo" className="flex flex-col pt-16">
                <span className="text-3xl font-bold">
                    {assignment.name}
                </span>
                <div className="h-1 w-3/5 bg-gray-300" />
                <div className="flex w-10/12 mt-8 mb-10">
                    <div className="flex flex-col mr-16">

                        <span className="text-6xl text-p-dark-blue self-center   ">
                            {analytics ? getAverageScore() + "%" : "none"}
                        </span>
                        <span className="self-center text-gray-600">
                            Average Score
                    </span>
                    </div>
                    <div className="flex flex-col mr-16">
                        <span className="text-6xl self-center  text-p-dark-blue ">
                            {analytics ? getPolyaUse() + "%" : ""}
                        </span>
                        <span className="self-center text-gray-600">
                            Students Who Used Polya
                    </span>
                    </div>
                    <div className="flex flex-col mr-16">
                        <span className="text-6xl self-center w-full text-p-dark-blue ">
                            {analytics ? timeConvert(getAverageAssignmentTime()) : ""}
                        </span>
                        <span className="self-center text-gray-600">
                            Average Time
                    </span>

                    </div>
                </div>

                <div className="flex">
                    <span className="text-p-dark-blue mr-4 text-2xl">
                        Time Taken on
                    </span>
                    <Dropdown list={problemList} action={updateGraphProblem} value={currentGraphProblem} />

                </div>
                <div style={{ height: '300px' }} className="flex flex-column justify-between w-4/5 bg-white shadow-sm mt-8 rounded-lg pb-4 mb-8 pt-4 px-3">
                    {/* <Chart style={{ height: '300px', margin: '20px' }} data={getTimeData(0)} series={series} axes={axes} tooltip /> */}
                    {currentGraphProblem && getTimeData(currentGraphProblem.value) ? MyResponsiveBar(getTimeData(currentGraphProblem.value)) : <div></div>}
                </div>

                <div className="flex justify-between w-1/4">
                    {completedDiv}
                    {notCompletedDiv}
                </div>
                <div className="flex justify-between w-10/12 mt-8 pb-5 px-4">
                    <span className="text-gray-400 w-1/5">
                        Name
                    </span>
                    <span className="text-gray-400 w-1/5">
                        Submitted On
                    </span>
                    <span className="text-gray-400 w-1/5">
                        Polya Uses
                    </span>
                    <span className="text-gray-400 w-1/5">
                        Score
                    </span>

                    <span className="text-gray-400 w-1/5">
                        Percentage
                    </span>

                </div>
                <div className="flex flex-col w-10/12 mb-16 text-p-dark-blue" style={{ 'height': `auto` }}>

                    {
                        analytics ? analytics.map(student => {
                            console.log(student);

                            if (completed && student.hasSubmitted) {
                                return <SubmissionCard name={student.name.name} date={moment(Date(student.timeSubmitted)).format('MM/DD/YYYY')} score={getIndividualScore(student.userId, true)} percent={Math.ceil(getIndividualScore(student.userId) * 100)} polya={getIndividualPolyaUses(student.userId)} />
                            }

                            if (!completed && !student.hasSubmitted) {
                                return <SubmissionCard name={student.name.name} score={getIndividualScore(student.userId, true)} percent={Math.ceil(getIndividualScore(student.userId) * 100)} polya={getIndividualPolyaUses(student.userId)} />
                            }

                        }) : <div></div>}

                </div>
            </div>
        </div>
    );
}

export default TeacherAssignment;