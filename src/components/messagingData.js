const data = {
    assignments: [
        { name: 'Problem Set #1' },
        { name: 'Problem Set #2' },
        { name: 'Geometry Practice' },
        { name: 'Recursion Practice' },
    ],
    conversations: {
        conv1: {
            id: 'conv1',
            name: 'All Class Conversation',
            messages: [{ body: 'Whats up dawg!!', sentByMe: false }, { body: 'Whats up dawg!!', sentByMe: true }]
        },
        conv2: {
            id: 'conv2',
            name: 'Table Group #4',
            messages: [{ body: 'Hello', sentByMe: false }]
        },
    }
}

export const getConversations = () => {
    return data.conversations;
}

export const getConversationsById = (id) => {
    const conversation = {
        id: data.conversations[id].id,
        name: data.conversations[id].name
    }
    return conversation;
}

export const addMessageToConversation = (id, message) => {
    return data.conversations[id].messages.push(message);
}

export const getMessagesFromConversation = (id) => {
    return data.conversations[id].messages;
}

export const getAssignments = () => {
    return data.assignments;
}

export const addAssignment = (assignment) => {
    return data.assignments.push(assignment);
}

