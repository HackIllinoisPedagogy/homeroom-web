import React, { Component } from 'react';
import ProblemInputCard from './CreateAssignment';
import { addDocument, setDocument, updateDocument } from "../../services/firebase";
import * as firebase from "firebase";
import autosize from "autosize/dist/autosize";

class CreateAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentName: "",
            description: "",
            problems: [
                {
                    question: '',
                    solution: '',
                    answer: ''
                }
            ]
        };

    }

    componentDidMount() {
        autosize(this.descriptionBox);
        autosize(this.questionBox);
        autosize(this.solutionBox);
    }

    setProblems = (problems) => this.setState({ problems: problems });

    setName = (name) => {
        this.setState({ assignmentName: name });
    }

    setDescription = (description) => this.setState({ description });

    addQuestion = () => {
        this.setState(prevState => ({
            problems: [...prevState.problems, { question: '', solution: '' }]
        }))
    }

    removeQuestion = (i) => {
        console.log(i);
        let array = [...this.state.problems];
        if (i != -1) {
            array.splice(i, 1);
            this.setState({ problems: array });
        }
    }

    onQuestionChange(i, e) {
        let array = [...this.state.problems];
        if (i != -1) {
            array[i].question = e.target.value;
            this.setState({ problems: array });
        }

    }

    onAnswerChange(i, e) {
        let array = [...this.state.problems];
        if (i != -1) {
            array[i].answer = e.target.value;
            this.setState({ problems: array });
        }
    }

    onSolutionChange(i, e) {
        let array = [...this.state.problems];
        if (i != -1) {
            array[i].solution = e.target.value;
            this.setState({ problems: array });
        }
    }

    uploadProblemSet = async () => {
        if (this.state.assignmentName === "") {
            alert("Please enter an assignment name");
            return;
        }
        const problems = this.state.problems;
        if (problems.length === 0) {
            alert("You didn't enter any problems");
            return;
        }
        problems.forEach(problem => {
            if (problem.question == '' || problem.solution == '') {
                alert("One or more problems has one or more blank fields");
                return;
            }
        });
        const docRef = await addDocument("assignments", {
            name: this.state.assignmentName,
            description: this.state.description,
            problems: problems
        })
        await updateDocument("classes", this.props.currentClass.code + "", {
            assignments: firebase.firestore.FieldValue.arrayUnion(docRef.id),
        })
        alert(`Assignment successfully uploaded`);
        this.setName("");
        this.setProblems([
            {
                question: '',
                solution: ''
            }
        ])
    }

    createQuestionCard(index, initQuesVal, initSolutionVal, initAnswerVal) {
        return (
            <div
                class="bg-white rounded-lg overflow-hidden shadow-sm transform transition-all mb-8 w-full"
                role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">

                        <div class="mt-3text-center sm:mt-0 sm:ml-4 mr-4 sm:text-left w-full">
                            <div class="flex flex-column justify-between">
                                <h3 class="text-lg leading-6  font-medium text-gray-900 inline-flex items-center" id="modal-headline">
                                    Problem #{index + 1}
                                </h3>
                                <div class="m-3 float-right">
                                    <button onClick={() => this.removeQuestion(index)}
                                        class="bg-white text-red-600 rounded border border-red-600 hover:border-red-600 hover:bg-red-500 hover:text-white py-2 px-6 inline-flex items-center">
                                        <span class="mr-2">Remove</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentcolor"
                                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>


                            <div class="mt-2 w-full">
                                <p className="text-sm leading-5 text-gray-500 py-2 h-auto">
                                    Question
                                </p>
                                <textarea
                                    onChange={(e) => this.onQuestionChange(index, e)}
                                    class="appearance-none block w-full text-p-dark-blue border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                                    id="grid-first-name" type="text" value={initQuesVal}
                                    ref={r => this.questionBox = r}
                                    placeholder="Enter question..." />
                            </div>

                            <div class="mt-2 w-full">
                                <p className="text-sm leading-5 text-gray-500 py-2 h-auto">
                                    Detailed Solution
                                </p>
                                <textarea
                                    onChange={(e) => this.onSolutionChange(index, e)}
                                    class="appearance-none block w-full text-p-dark-blue border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                                    id="grid-first-name" type="text" value={initSolutionVal}
                                    ref={r => this.solutionBox = r}
                                    placeholder="Enter solution..." />
                            </div>
                            <div className="mt-2 ">
                                <p className="text-sm leading-5 text-gray-500">
                                    Final Answer
                                </p>
                            </div>
                            <div className="mt-2 w-full">
                                <input
                                    onChange={(e) => this.onAnswerChange(index, e)}
                                    className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-8 leading-tight focus:outline-none focus:bg-white focus:border-p-purple"
                                    id="grid-first-name" type="text" value={initAnswerVal}
                                    placeholder="Enter the final answer..." />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }

    render() {
        console.log(this.state.problems);
        return (
            <div>
                <div className="mb-6 flex-col">
                    <div className="w-full pt-8 pb-4">
                        <div className="md:w-10/12">
                            <input
                                className="text-3xl font-bold  appearance-none bg-transparent w-full py-2 px-4 text-p-dark-blue leading-tight focus:outline-none"
                                type="text" value={this.state.assignmentName} placeholder="Untitled Assignment" onChange={e => this.setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="md:w-10/12">
                            <textarea
                                className="bg-transparent appearance-none w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none h-auto"
                                value={this.state.description} placeholder="Add a description..." onChange={e => this.setDescription(e.target.value)} ref={r => this.descriptionBox = r} />
                        </div>
                    </div>
                </div>
                <div className="md:w-10/12">
                    {

                        this.state.problems.map((problem, i) => {
                            console.log("hello");
                            return this.createQuestionCard(i, problem.question, problem.solution, problem.answer);
                        })


                    }
                </div>

                <div className="flex flex-col w-1/5">
                    <div style={{ bottom: '60px', right: '60px' }} class="fixed z-10">
                        <button
                            onClick={async () => {
                                await this.uploadProblemSet();
                            }}
                            class="text-white px-8 w-auto h-16 bg-p-purple rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                        
                            <span class="font-bold" >Create Assignment</span>
                        </button>
                    </div>

                    <button
                        onClick={this.addQuestion}
                        class="text-white px-5 w-auto h-16 bg-p-purple rounded-full hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                        <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
                            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z" />
                        </svg>
                    </button>

                </div>

            </div>
        );
    }
}

export default CreateAssignment;