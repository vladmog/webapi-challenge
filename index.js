const express = require('express');
const server = express();



server.use(express.json());

let people = [
    {
        id: 1,
        name: "Jim Bob"
    },
    {
        id: 2,
        name: "Bim Job"
    },
]

let chores = [
    {
        id: 1,
        description: "Clean table",
        notes: "Ensure table clean",
        assignedTo: 1,
        completed: false
    },
    {
        id: 2,
        description: "Tlean cable",
        notes: "Ensure cable tlean",
        assignedTo: 2,
        completed: false
    },
]

let nextId = 3;

server.get('/', (req, res) => {
    res.status(200).json(chores);
});

server.post('/', (req, res) => {
    let {description, notes, assignedTo} = req.body;
    let chore = {
        id: nextId,
        description: description,
        notes: notes,
        assignedTo: assignedTo,
        completed: false
    }
    chores.push(chore);
    nextId++
    res.status(200).json(chores);
})

server.put('/', (req, res) => {
    let {id, description, notes, assignedTo, completed} = req.body;
    let chore = {
        id: id,
        description: description,
        notes: notes,
        assignedTo: assignedTo,
        completed: JSON.parse(completed)
    }
    let updatedChores = chores.map(ogChore => {
        if (ogChore.id === chore.id){
            return chore
        } else {
            return ogChore
        }
    })
    chores = updatedChores;
    res.status(200).json(chores);
})

server.delete('/', (req, res) => {
    let chore_id = req.body.id;
    let updatedChores = chores.filter(chore => {
        return chore_id !== chore.id
    })
    chores = updatedChores;
    res.status(200).json(chores);
})


//QUERY STRING

server.get('/query', (req, res) => {
    if(req.query.completed){
        let choreQuery = req.query.completed;
        choreQuery = JSON.parse(choreQuery)
        let response = chores.filter(chore => {
            return JSON.parse(chore.completed) === choreQuery
        })
        res.status(200).json(response)
    } else {
        res.status(200).json(chores)
    }
})



//GET chores by person_id

server.get('/:id', (req, res) => {
    let person_id = parseFloat(req.params.id);
    let amountOfPeopleWithId = people.filter(person => {
        return person_id === parseFloat(person.id)
    }).length;
    if (amountOfPeopleWithId === 0){
        res.status(404).json({ message: "Person with ID doesn't exist"});
    } else {
        let personChores = [];
        chores.forEach(chore => {
            if(parseFloat(chore.assignedTo) === person_id){
                personChores.push(chore)
            }
        })
        res.status(200).json(personChores);
    }
})


server.listen(8000, () => console.log('API running on port 8000'));

