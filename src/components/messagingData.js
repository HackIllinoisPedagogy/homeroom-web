const data = {
    assignments: {
        assignment1:{
            id: 'assignment1',
            name: 'Problem Set #1',

        },
        assignment2:{
            id: 'assignment2',
            name: 'Problem Set #2'
        },
        geoSet:{
            id: 'geoSet',
            name: 'Geometry Problems'
        },
        algebraset:{
            id: 'algebraSet',
            name: 'Algebra Problems'
        }
        
    },
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

export const getProblemsById = (id) => {
    console.log(id); 
    console.log(data.assignments);
    return data.assignments[id].name;
    
}


export const getAssignments = () => {
    return data.assignments;
}

export const addAssignment = (assignment) => {
    return data.assignments.push(assignment);
}

