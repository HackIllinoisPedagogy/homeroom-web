import React from 'react';
import "../../tailwind.css";
import Tutor from './Tutor.js';
import {getProblemsById} from "../messagingData.js"
class ProblemSet {
	constructor() {
		this.title = "Problem Set 1";
		this.description = "Directions: Yonsils your tonsils, jingle your jangle."
		this.problems = [{
			problem: "",
			solution: "Since these form a geometric series, $\frac{\log_2{x}}{\log_4{x}}$ is the common ratio. " +
				"Rewriting this, we get $\frac{\log_x{4}}{\log_x{2}} = \log_2{4} = 2$ by base change formula. " +
				"Therefore, the common ratio is 2. Now $\frac{\log_4{x}}{\log_8{2x}} = 2 \implies " +
				"\log_4{x} = 2\log_8{2} + 2\log_8{x} \implies \frac{1}{2}\log_2{x} = \frac{2}{3} + \frac{2}{3}\log_2{x}$. " +
				"$\implies -\frac{1}{6}\log_2{x} = \frac{2}{3} \implies \log_2{x} = -4 \implies x = \frac{1}{16}$. Therefore, $1 + 16 = \boxed{017}$."
		}];
	}
}

class Assignment extends React.Component {
	constructor(props) {
		super(props);
		let p = new ProblemSet();

		this.state = {
			// problems = props.problems,
			curr_problem: 0,
			problemSet: p,
		};

	}

	changeProblem(i) {
		this.setState({
			problems: this.state.problems,
			curr_problem: i,
		});
	}

	getProblems(id){
		const problemSet = getProblemsById(id);
		return <div>{problemSet.name}</div>
	}

	render() {
		let prob = this.state.problemSet;
		const {activeAssignmentId} = this.props;

		if(!activeAssignmentId){
			return (<div></div>);
		}

		return (
			<div id="page">
				<div>{activeAssignmentId}</div>
				<div id="content" className="">
					<div id="pset-title" className="px-16 py-20 w-3/5 float-left">
						<h3 className="text-black font-bold text-4xl"> {prob.title} </h3>
						<p className="text-gray-700 py-6 border border-gray-400 border-t-0 border-r-0 border-l-0 border-b-1"> {prob.description} </p>
					</div>

					<div id="tutor-spacing" className="h-64 float-right w-2/5">
					</div>
					<div id="tutor-container" className="h-auto float-right w-2/5 flex justify-center">
						<Tutor problem={prob.problems[this.state.curr_problem]}></Tutor>
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