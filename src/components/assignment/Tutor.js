import React from 'react';
import "../../tailwind.css"


class Tutor extends React.Component {
	render() {
		return (
			<div id="tutor" className="w-3/5">
				<h3 id="tutor-name" className="text-xl font-semibold"> Ask Polya </h3>
				<div id="accent" className="h-1 w-1/4 bg-purple-700 mt-1"></div>
				<form id="user-input" className="mt-5">
					<textarea id="user-state" class="text-gray-700 focus:outline-none w-full h-full pl-2 pt-2 bg-white shadow-md rounded"
					 	id="user_state" type="text" rows="10" placeholder="What have you tried so far to solve the problem?"/>
				</form>
			</div>
		);
	}
}

export default Tutor;
