import React, { Component } from 'react';

class ProblemInputCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }




    render() {
        // console.log("FDSKKS")fdfds
        return (
            <div>
                <div className="mb-10">
                    <span className=" text-3xl font-bold pt-8">
                        Create Assignment
                    </span>
                </div>

                <button type="button"
                    class="inline-flex justify-center w-auto rounded-md border border-transparent px-4 py-2 bg-p-purple text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    New Question
                 </button>
            </div>
        );
    }
}

export default ProblemInputCard;