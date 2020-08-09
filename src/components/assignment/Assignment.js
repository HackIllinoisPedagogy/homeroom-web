import React from 'react';
import "../../tailwind.css";
import Tutor from './Tutor.js';
import {getProblemsById} from "../messagingData.js"

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { handleLatexRendering, generateRenderingArray} from './renderingUtils.js'
import autosize from "autosize/dist/autosize";

class ProblemSet {
	constructor() {
		this.title = "Problem Set 1";
		this.description = "Directions: Yonsils your tonsils, jingle your jangle."
		this.problems = [{
			problem: "There is a unique positive real number $x$ such that the three numbers $\\log_8{2x}$, $\\log_4{x}$, and $\\log_2{x}$, in that order, form a geometric progression with positive common ratio. The number $x$ can be written as $\\frac{m}{n}$, where $m$ and $n$ are relatively prime positive integers. Find $m + n$.",
			solution: "Since these form a geometric series, $\\frac{\\log_2{x}}{\\log_4{x}}$ is the common ratio. " +
				"Rewriting this, we get $\\frac{\\log_x{4}}{\\log_x{2}} = \\log_2{4} = 2$ by base change formula. " +
				"Therefore, the common ratio is 2. Now $\\frac{\\log_4{x}}{\\log_8{2x}} = 2 \\implies " +
				"\\log_4{x} = 2\\log_8{2} + 2\\log_8{x} \\implies \\frac{1}{2}\\log_2{x} = \\frac{2}{3} + \\frac{2}{3}\\log_2{x}$. " +
				"$\\implies -\\frac{1}{6}\\log_2{x} = \\frac{2}{3} \\implies \\log_2{x} = -4 \\implies x = \\frac{1}{16}$. Therefore, $1 + 16 = \\boxed{017}$."
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
class StudentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'Type in your answer here...'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		this.textarea.focus();
		autosize(this.textarea);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		alert('Your answer was submitted: ' + this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label className="font-bold">Answer:<br/></label>
				<textarea className="bg-transparent max-h-75 min-h-38 w-full"
						  ref={c => (this.textarea = c)} placeholder={this.state.value} rows={2} defaultValue=""
						  onChange={this.handleChange} />
				<br/><input className="bg-custom-purple text-gray-100 w-1/5 shadow-md text-center h-8 justify-end" type="submit" value="Submit" />
			</form>
		);
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

		let renderingArray = generateRenderingArray(prob.problems[this.state.curr_problem].problem);

		return (
			<div id="page">
				<div>{activeAssignmentId}</div>
				<div id="content" className="">
					<div id="pset-title" className="px-16 py-20 w-3/5 float-left">
						<h3 className="text-black font-bold text-4xl"> {prob.title} </h3>
						<p className="text-gray-700 py-6 border border-gray-400 border-t-0 border-r-0 border-l-0 border-b-1"> {prob.description} </p>
						<div id="dropdown" className="py-6 inline-block relative w-15">
							<select name="probs" id="probs"
									className="block appearance-none w-full bg-white text-custom-purple font-bold border
									border-custom-purple px-4 py-2 pr-8 rounded"
									onChange={(event) => this.changeProblem(event.target.value)}>
								<option value="0">1</option>
								<option value="1">2</option>
								<option value="2">3</option>
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
							<StudentForm/>
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
