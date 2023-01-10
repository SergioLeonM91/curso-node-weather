import inquirer from 'inquirer';
 
import colors from 'colors';

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Search City`
            },
            {
                value: 2,
                name: `${'2.'.green} Record`
            },
            {
                value: 0,
                name: `${'0.'.green} Exit\n`
            },
        ]
    }
];

const input = [
    {
        type: 'input',
        name: 'enter',
        message: `\nPress ${'ENTER'.green} to continue\n`
    }
];

const inquirerMenu = async() => {

    console.clear();
    console.log('=============================='.blue);
    console.log('     Select an option     '.white);
    console.log('==============================\n'.blue);

    const { option } = await inquirer.prompt(questions);

    return option;
};

const pause = async() => {

    const { enter } = await inquirer.prompt(input);

    return enter;
};

const readInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0 ) {
                    return 'Please add a value';
                }

                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
}

const listPlaces = async( places = [] ) => {
    const choices = places.map( (place, index) => {

        index = `${ index + 1 }.`.green;

        return {
            value: place.id,
            name: `${ index } ${ place.name }`
        }

    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select a place:',
            choices
        }
    ];

    const { id } = await inquirer.prompt(questions);

    return id;
}

const confirm = async( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'response',
            message
        }
    ];

    const { response } = await inquirer.prompt(question);

    return response;
}

const showListChecklist = async( tasks = [] ) => {
    const choices = tasks.map( (task, index) => {

        index = `${ index + 1 }.`.green;

        return {
            value: task.id,
            name: `${ index } ${ task.desc }`,
            checked: ( task.completedIn ) ? true : false
        }

    });

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selections',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(question);

    return ids;
}

export {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showListChecklist
}