import React from 'react';
import "../../tailwind.css"
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import { handleLatexRendering, generateRenderingArray} from './renderingUtils.js'


class Tutor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			solution: props.problem.solution,
			hint: <div></div>,
		};
		this.serverUrl = "http://127.0.0.1:5000/";
	}

	handleClick() {
		let data = {"state": document.getElementById("user-state").value};

		let query = Object.keys(data)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
			.join('&');

		fetch(this.serverUrl + "get_hint?" + query)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result.hint);

					let renderingArray = generateRenderingArray(result.hint);

					let h = (
						<div id="hint-box" className="w-full bg-white h-auto shadow-md rounded mt-5 p-5 w-1/5 overflow-x-auto">
							{renderingArray.map((el) => handleLatexRendering(el))}
						</div>
					);

					this.setState({
						solution: this.state.solution,
						hint: h,
					});
				},

				(error) => {
					console.log(error);
				}
			);
	}

	render() {
		return (
			<div id="tutor" className="w-3/5">
				<h3 id="tutor-name" className="text-xl font-semibold"> Ask Polya </h3>
				<div id="accent" className="h-1 w-1/4 bg-custom-purple mt-1"></div>
				<form id="user-input" className="mt-5">
					<textarea id="user-state" className="text-gray-700 focus:outline-none w-full h-full p-3 bg-white shadow-md rounded"
							  type="text" rows="7" placeholder="What have you tried so far to solve the problem?"/>
				</form>
				<div id="button-container" className="w-full h-auto flex pt-5 justify-end">
					<button id="submit-hint-request" className="bg-custom-purple text-gray-100 w-1/5 shadow-md text-center h-8"
							onClick={() => this.handleClick()}> Ask </button>
				</div>
				{this.state.hint}
			</div>
		);
	}
}

export default Tutor;
