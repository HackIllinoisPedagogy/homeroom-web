import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { getConversations, getAssignments } from '../messagingData';

// const assignments = [
//     { name: 'Problem Set #1' },
//     { name: 'Problem Set #2' },
//     { name: 'Geometry Practice' },
//     { name: 'Recursion Practice' },
// ]

// const conversations = [
//     { name: 'All Class Conversation' },
//     { name: 'Table Group 6' }
// ]



class Sidebar extends Component {

    renderClassesSidebar() {
        return (
            <div class="absolute z-40 overflow-hidden bg-white mb-4 border-red-light w-full h-screen md:w-24 border-solid border-2 border-gray-200">
                <div class="flex w-full max-w-xs p-4 bg-white">
                    <ul class="flex flex-col w-full">
                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    renderMainSidebar() {
        return (
            <div class="absolute overflow-hidden shadow-lg bg-white mb-4 border-red-light w-full h-screen z-10 md:w-1/5 ml-24">
                <div class="flex w-full max-w-xs p-4 bg-white">
                    <ul class="flex flex-col w-full">
                        <li class="h-20 my-px">
                            <h1>APCS Period 3</h1>
                            <p>Eric Ferrante</p>
                        </li>
                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                </span>
                                <span class="ml-3">Dashboard</span>
                                <span class="flex items-center justify-center text-sm text-gray-500 font-semibold bg-gray-200 h-6 px-2 rounded-full ml-auto">3</span>
                            </a>
                        </li>
                        <li class="my-px">
                            <span class="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Assignments</span>
                        </li>

                        {getAssignments().map(assignment => {
                            const { name } = assignment;
                            return (<li class="my-px">
                                <a href="#"
                                    class="flex flex-row items-center px-2 h-12 rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span class="ml-3">{name}</span>
                                </a>
                            </li>);
                        })

                        }

                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-green-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <span class="ml-3">Add new</span>
                            </a>
                        </li>
                        <li class="my-px">
                            <span class="flex font-medium text-sm text-gray-400 px-2 my-4 uppercase">My Conversations</span>
                        </li>

                        {
                            Object.values(getConversations()).map(conversation => {
                                const { name, id } = conversation;
                                return (

                                    <li class="my-px">
                                        <a onClick={() => this.props.setChat(id)}
                                            class="flex flex-row items-center h-12 px-2 rounded-lg text-gray-600 hover:bg-gray-100">
                                            <span class="ml-3">{name}</span>
                                        </a>
                                    </li>
                                );

                            })

                        }

                        <li class="my-px">
                            <a href="#"
                                class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
                                <span class="flex items-center justify-center text-lg text-red-400">
                                    <svg fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6">
                                        <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                    </svg>
                                </span>
                                <span class="ml-3">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderClassesSidebar()}
                {this.renderMainSidebar()}
            </div>
        );
    }
}

export default Sidebar;