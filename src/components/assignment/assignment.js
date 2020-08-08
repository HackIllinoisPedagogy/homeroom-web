import React from 'react';
import "../../tailwind.css";

import Tutor from './Tutor.js';

class ProblemSet {
	constructor() {
		this.title = "Problem Set 1";
		this.description = "Directions: Yonsils your tonsils, jingle your jangle."
	}
}

class Assignment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// problems = props.problems,
			curr_problem: 0,
			problemSet: props.problemSet,
		};
	}

	changeProblem(i) {
		this.setState({
			problems: this.state.problems,
			curr_problem: i,
		});
	}

	render() {
		let prob = this.state.problemSet;

		return (
			<div id="page">
				<div id="content" className="">
					<div id="pset-title" className="px-16 py-20 w-3/5 float-left">
						<h3 className="text-black font-bold text-4xl"> {prob.title} </h3>
						<p className="text-gray-700 py-6 border border-gray-400 border-t-0 border-r-0 border-l-0 border-b-1"> {prob.description} </p>
					</div>

					<div id="tutor-spacing" className="h-64 float-right w-2/5">
					</div>
					<div id="tutor-container" className="h-auto float-right w-2/5 flex justify-center">
						<Tutor></Tutor>
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
