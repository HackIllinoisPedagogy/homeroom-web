import React from 'react';
import "../../tailwind.css";
import Tutor from './Tutor.js';
import {addAssignment, getProblemsById} from "../messagingData.js"

import 'katex/dist/katex.min.css';
import {InlineMath, BlockMath} from 'react-katex';
import {handleLatexRendering, generateRenderingArray} from './renderingUtils.js'
import {addStyles, EditableMathField} from 'react-mathquill'
import autosize from "autosize/dist/autosize";
import {addDocument, db, getDocument, setDocument, updateDocument} from "../../services/firebase";

import * as firebase from "firebase";

import _ from "lodash";
import Timer from "../../Timer";


addStyles()

class ProblemSet {
    constructor(name, problems) {
        this.name = name;
        this.problems = problems;
    }

}

class LatexField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            latex: '',
            input: 'Text here',
        }
    }

    setInput = (input) => {
        console.log(input);
        this.setState({input: input});
    }

    componentDidMount() {
        autosize(this.box);
    }

    handleSubmit(event) {
        alert('Your answer was submitted: ' + this.state.value);
        event.preventDefault();
    }


    render() {
        return (
            <div className="w-64 h-32">
                <EditableMathField
                    className="bg-transparent max-h-75 min-h-32 w-32"
                    latex={this.state.input} // latex value for the input field
                    onChange={(mathField) => {
                        // called everytime the input changes
                        this.setState({input: mathField.latex()})
                    }}
                />
            </div>
            // <form onSubmit={this.handleSubmit}>
            //     <label className="font-bold">Answer:<br/></label>
            //
            //
            //
            //
            //     <br/>
            //     <div id="button-container" className="w-full h-auto flex pt-1 justify-end">
            //         <input className="bg-custom-purple text-gray-100 w-1/5 shadow-md text-center h-8"
            //                type="submit" value="Submit"/>
            //     </div>
            //
            // </form>
        )
    }
}

class StudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Type in your answer here...'
        };
    }

    componentDidMount() {
        this.textarea.focus();
        autosize(this.textarea);
    }


    render() {
        return (
            <div>
                <label className="font-bold">Answer:<br/></label>
                <textarea className="bg-transparent max-h-75 min-h-38 w-full"
                          ref={c => (this.textarea = c)} placeholder={this.state.value} rows={2} defaultValue=""
                          onChange={(e) => this.props.onChange(e.target.value)}/>
                <br/>
                <button className="bg-custom-purple text-gray-100 w-1/5 shadow-md text-center h-8 justify-end"
                        onClick={this.props.onSubmit}>Submit
                </button>
            </div>
        );
    }
}

class Assignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // problems = props.problems,
            curr_problem: 0,
            problemSet: null,
            listOpen: false,
            answerSet: null,
            submitted: false,
            submitModal: false,
        };

    }

    wrong = [];

    timers = [];
    polyaCounts = [];

    changeProblem(i) {
        this.timers[this.state.curr_problem].end();
        if (!this.timers[i].getStart()) {
            this.timers[i].start();
        }
        this.setState({
            //problems: this.state.problems,
            curr_problem: i,
        });
    }

    setAnswerSet(answerSet) {
        this.setState({answerSet})
    }

    setAnswer(i, answer) {
        let temp_answers = this.state.answerSet;
        temp_answers[i] = answer;
        this.setAnswerSet(temp_answers);
    }

    submitPressed = async () => {
        this.wrong = [];
        const attemptRef = await db.collection(`assignments/${this.props.activeAssignmentId}/attempts`).doc(this.props.user.uid).get();

        await updateDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
            attempts: attemptRef.data().attempts + 1,
        })


        for (let i = 0; i < this.state.problemSet.problems.length; i++) {
            const correct = this.state.problemSet.problems[i].answer;
            if (correct !== this.state.answerSet[i]) {
                this.wrong.push(i + 1);
            }
        }

        this.setState({submitModal: true});
        // if (wrong.length === 0) {
        //     if (window.confirm("You are correct! Would you like to submit?")) {
        //         this.timers[this.state.curr_problem].end();
        //         const subRef = await addDocument("analytics", {
        //             assignmentId: this.props.activeAssignmentId,
        //             hasSubmitted: true,
        //             timeStarted: this.timers[0].getStart(),
        //             timeSubmitted: this.timers[this.state.curr_problem].getEnd(),
        //             userId: this.props.user.uid,
        //             attempts: attemptRef.data().attempts + 1,
        //         });
        //         for(let i = this.state.problemSet.problems.length - 1; i >= 0; i--) {
        //             await addDocument(`analytics/${subRef.id}/problems`, {
        //                 answer: this.state.answerSet[i],
        //                 isCorrect: true,
        //                 timeStarted: this.timers[i].getStart(),
        //                 timeEnded: this.timers[i].getEnd(),
        //                 polyaCount: this.polyaCounts[i],
        //                 index: i
        //             })
        //         }
        //         this.setState({submitted: true});
        //         await updateDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
        //             submitted: true,
        //         })
        //     }
        // } else if(window.confirm(`You got the following problem(s) wrong: ${wrong}. Would you still like to submit?`)) {
        //     this.timers[this.state.curr_problem].end();
        //     const subRef = await addDocument("analytics", {
        //         assignmentId: this.props.activeAssignmentId,
        //         hasSubmitted: true,
        //         timeStarted: this.timers[0].getStart(),
        //         timeSubmitted: this.timers[this.state.curr_problem].getEnd(),
        //         userId: this.props.user.uid,
        //         attempts: attemptRef.data().attempts + 1
        //     });
        //     for(let i = this.state.problemSet.problems.length - 1; i >= 0; i--) {
        //         await addDocument(`analytics/${subRef.id}/problems`, {
        //             answer: this.state.answerSet[i],
        //             isCorrect: !wrong.includes(i + 1),
        //             timeStarted: this.timers[i].getStart(),
        //             timeEnded: this.timers[i].getEnd(),
        //             polyaCount: this.polyaCounts[i],
        //             index: i
        //         })
        //     }
        //     this.setState({submitted: true});
        //     await updateDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
        //         submitted: true,
        //     })
        // }
    }

    async onSubmitModalPressed() {
        const attemptRef = await db.collection(`assignments/${this.props.activeAssignmentId}/attempts`).doc(this.props.user.uid).get();
        this.timers[this.state.curr_problem].end();
        const subRef = await addDocument("analytics", {
            assignmentId: this.props.activeAssignmentId,
            hasSubmitted: true,
            timeStarted: this.timers[0].getStart(),
            timeSubmitted: this.timers[this.state.curr_problem].getEnd(),
            userId: this.props.user.uid,
            attempts: attemptRef.data().attempts
        });
        for (let i = this.state.problemSet.problems.length - 1; i >= 0; i--) {
            await addDocument(`analytics/${subRef.id}/problems`, {
                answer: this.state.answerSet[i],
                isCorrect: !this.wrong.includes(i + 1),
                timeStarted: this.timers[i].getStart(),
                timeEnded: this.timers[i].getEnd(),
                polyaCount: this.polyaCounts[i],
                index: i
            })
        }
        this.setState({submitted: true});
        await updateDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
            submitted: true,
        })
        this.setState({submitModal: false});
    }

    renderSubmitModal() {
        if (this.state.submitModal) {
            const modalTopText = this.wrong.length > 0 ? "Hold on!" : "Congratulations!";
            let modalBottomText = "You got all of the problems correct! Would you like to submit?"
            if (this.wrong.length > 0) {
                modalBottomText = `You got the following problems wrong: ${this.wrong}. Would you still like to submit?`
            }
            return (
                <div
                    className="absolute left-0 top-0 bg-black-t-50 w-full h-screen flex justify-center items-center z-50">
                    <div
                        className="w-auto h-auto border-p-purple bg-white rounded flex p-5 flex-col justify-center justify-center items-center">
                        <span className="text-3xl">
                            {modalTopText}
                        </span>
                        <span className="text-xl mt-5">
                            {modalBottomText}
                        </span>
                        <div className="w-full p-5 flex justify-around items-center">
                            <button className="transition duration-300 bg-white transition-all border-green-400 text-green-400 rounded
                            hover:shadow hover:border-white hover:bg-green-400 hover:text-white px-2 py-1 text-2xl"
                                    onClick={async () => {
                                        await this.onSubmitModalPressed()
                                    }}>
                                Submit
                            </button>
                            <button className="transition duration-300 bg-white transition-all border-red-400 text-red-400 rounded
                            hover:shadow hover:border-white hover:bg-red-400 hover:text-white px-2 py-1 text-2xl"
                                    onClick={() => this.setState({submitModal: false})}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    async componentDidMount() {
        if (this.props.activeAssignmentId) {
            const aRef = (await getDocument("assignments", this.props.activeAssignmentId + "")).data();
            this.setProblemSet(new ProblemSet(aRef.name, aRef.problems));
            this.setAnswerSet(new Array(aRef.problems.length));
            let attemptRef = await db.collection(`assignments/${this.props.activeAssignmentId}/attempts`).doc(this.props.user.uid).get();
            for (let i = 0; i < aRef.problems.length; i++) {
                this.polyaCounts.push(0);
                this.timers.push(new Timer());
            }
            this.timers[0].start();
            if (!attemptRef.exists) {
                this.setState({submitted: false});
                await setDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
                    attempts: 0,
                    submitted: false
                });
            } else if (attemptRef.data().submitted) {
                this.setState({submitted: true});
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Update");
        let {activeAssignmentId} = prevProps;
        if (this.props.activeAssignmentId !== activeAssignmentId) {
            const aRef = (await getDocument("assignments", this.props.activeAssignmentId + "")).data();
            this.changeProblem(0);
            this.setProblemSet(aRef);
            this.setAnswerSet(new Array(aRef.problems.length));
            let attemptRef = await db.collection(`assignments/${this.props.activeAssignmentId}/attempts`).doc(this.props.user.uid).get();
            this.polyaCounts = [];
            this.timers = [];
            for (let i = 0; i < aRef.problems.length; i++) {
                this.polyaCounts.push(0);
                this.timers.push(new Timer());
            }
            this.timers[0].start();
            if (!attemptRef.exists) {
                this.setState({submitted: false});
                await setDocument(`assignments/${this.props.activeAssignmentId}/attempts`, this.props.user.uid, {
                    attempts: 0,
                    usedPolya: 0,
                    timeStarted: firebase.firestore.Timestamp.fromDate(new Date()),
                    submitted: false
                });
            } else {
                this.setState({submitted: attemptRef.data().submitted});
            }
        }
    }


    getProblems(id) {
        const problemSet = getProblemsById(id);
        return <div>{problemSet.name}</div>
    }

    setProblemSet(p) {
        this.setState({problemSet: p});
    }

    onTutorClick() {
        this.polyaCounts[this.state.curr_problem] += 1;
    }

    render() {
        if (this.state.submitted) {
            return (
                <div className="flex flex-col w-full justify-center" style={{height: `${window.innerHeight}px`}}>
                    <span className="self-center text-6xl">
                        You've already <span className="font-bold text-p-purple">submitted!</span>
                    </span>
                    <span className="self-center text-3xl">
                        Select a different assignment
                    </span>
                </div>
            )
        }

        console.log("here");
        let prob = this.state.problemSet;
        if (!prob) return <div/>;

        const options = this.state.problemSet.problems.map((val, key) => {
            return <option value={`${key}`}>{key + 1}</option>;
        })

        let renderingArray = generateRenderingArray(prob.problems[this.state.curr_problem].question);

        return (
            <div id="page">
                {this.renderSubmitModal()}
                <div id="content" className="">
                    <div id="pset-title" className="px-16 py-20 w-3/5 float-left">
                        <h3 className="text-black font-bold text-4xl"> {prob.name} </h3>
                        <div id="dropdown" className="py-6 inline-block relative w-15">
                            <select name="probs" id="probs"
                                    className="block appearance-none w-full bg-white text-custom-purple font-bold border
									border-custom-purple px-4 py-2 pr-8 rounded"
                                    onChange={(event) =>
                                        this.changeProblem(event.target.value)}>
                                {options}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2
							text-custom-purple">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20">
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                        <div id="problem" className="px-16">
                            {renderingArray.map((el) => handleLatexRendering(el))}
                        </div>
                        <div id="response" className="px-16 py-10">
                            <StudentForm onChange={(str) => this.setAnswer(this.state.curr_problem, str)}
                                         onSubmit={this.submitPressed}/>
                            {/*<LatexField/>*/}
                        </div>
                    </div>
                    <div id="tutor-spacing" className="h-64 float-right w-2/5">
                    </div>
                    <div id="tutor-container" className="h-auto float-right w-2/5 flex justify-center">
                        <Tutor onTutorClick={() => this.onTutorClick()} assignmentID={this.props.activeAssignmentId}
                               user={this.props.user} problem={prob.problems[this.state.curr_problem]}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Assignment;
export {
    ProblemSet
};
