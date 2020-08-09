import React, { Component } from 'react';
import ProblemInputCard from './CreateAssignment';

class CreateAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problems: [
                {
                    question: '',
                    solution: ''
                }
            ]
        };
    }



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

    onSolutionChange(i, e) {
        let array = [...this.state.problems];
        if (i != -1) {
            array[i].solution = e.target.value;
            this.setState({ problems: array });
        }
    }

    createQuestionCard(index, initQuesVal, initAnswerVal) {
        return (
            <div
                class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all mb-8 sm:max-w-lg sm:w-full"
                role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">

                        <div class="mt-3text-center sm:mt-0 sm:ml-4 mr-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 mb-6 font-medium text-gray-900" id="modal-headline">
                                Problem #{index + 1}
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm leading-5 text-gray-500">
                                    Enter your question
                                    </p>
                            </div>
                            <div class="mt-2 w-full">
                                <input
                                    onChange={(e) => this.onQuestionChange(index, e)}
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name" type="text" value={initQuesVal} placeholder="Enter question..." />
                            </div>
                            <div class="mt-2">
                                <p class="text-sm leading-5 text-gray-500">
                                    Enter the solution
                                    </p>
                            </div>
                            <div class="mt-2 w-full">
                                <input
                                    onChange={(e) => this.onSolutionChange(index, e)}
                                    class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-8 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name" type="text" value={initAnswerVal}  placeholder="Enter solution..." />
                            </div>
                            <div class="m-3">
                                <button onClick={() => this.removeQuestion(index)} class="bg-white text-red-600 rounded border border-red-600 hover:border-red-600 hover:bg-red-500 hover:text-white py-2 px-6 inline-flex items-center">
                                    <span class="mr-2">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentcolor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                    </svg>
                                </button>
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
                <div className="mb-10">
                    <span className=" text-3xl font-bold pt-8">
                        Create Assignment
                    </span>
                </div>

                {

                    this.state.problems.map((problem, i) => {
                        console.log("hello");
                        return this.createQuestionCard(i, problem.question, problem.solution);
                    })


                }

                <button type="button"
                    onClick={this.addQuestion}
                    class="inline-flex justify-center w-auto rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    New Question
                 </button>
            </div>
        );
    }
}

export default CreateAssignment;