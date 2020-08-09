import React from 'react';
import "../../tailwind.css";
import Tutor from './Tutor.js';

class ProblemSet {
	constructor() {
		this.title = "Problem Set 1";
		this.description = "Directions: Yonsils your tonsils, jingle your jangle."
		this.problems = [{
			problem: "This is the problem",
			solution: "Since these form a geometric series, $\frac{\log_2{x}}{\log_4{x}}$ is the common ratio. " +
				"Rewriting this, we get $\frac{\log_x{4}}{\log_x{2}} = \log_2{4} = 2$ by base change formula. " +
				"Therefore, the common ratio is 2. Now $\frac{\log_4{x}}{\log_8{2x}} = 2 \implies " +
				"\log_4{x} = 2\log_8{2} + 2\log_8{x} \implies \frac{1}{2}\log_2{x} = \frac{2}{3} + \frac{2}{3}\log_2{x}$. " +
				"$\implies -\frac{1}{6}\log_2{x} = \frac{2}{3} \implies \log_2{x} = -4 \implies x = \frac{1}{16}$. Therefore, $1 + 16 = \boxed{017}$."
		},{
			problem: "Second problem",
			solution: "eee"
		},{
			problem: "third",
			solution: "yeet"
		}
		];
	}

}
// individual component.js

class Assignment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// problems = props.problems,
			curr_problem: 0,
			problemSet: props.problemSet,
			listOpen: false,
			headerTitle: this.props.title,
		};
	}

	changeProblem(i) {
		this.setState({
			//problems: this.state.problems,
			curr_problem: i,
		});
	}
// on the click, few things need to happen
	//1 set currProblem to that index
	//1.5 save that index so that you can refer to it later
	//2 this should in turn display that problem
	render() {
		let prob = this.state.problemSet;
		return (
			<div id="page">
				<div id="content" className="">
					<div id="pset-title" className="px-16 py-20 w-3/5 float-left">
						<h3 className="text-black font-bold text-4xl"> {prob.title} </h3>
						<p className="text-gray-700 py-6 border border-gray-400 border-t-0 border-r-0 border-l-0 border-b-1"> {prob.description} </p>
						<div id="dropdown" className="py-6">
							<select name="probs" id="probs" onChange={(event) => this.changeProblem(event.target.value)}>
								<option value="0">1.</option>
								<option value="1">2.</option>
								<option value="2">3.</option>
							</select>
						</div>
						<div id="problem" className="px-20 py-6 font-mono">
							{prob.problems[this.state.curr_problem].problem}
						</div>
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