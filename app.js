import * as dotenv from 'dotenv';
dotenv.config();

import { 
    inquirerMenu, 
    pause, 
    readInput,
    listPlaces,
    confirm,
    showListChecklist
} from './helpers/inquirer.js'; 
import { Searches } from './models/searches.js';

const main = async() => {
    
    const searches = new Searches;
    let opt = '';

    do {
        opt = await inquirerMenu();

        switch( opt ) {
            case 1:
                const search = await readInput('City: ');
                const places = await searches.city( search );
                const id = await listPlaces(places);

                if( id === '0') {
                    continue;
                }

                const placeSelected = places.find( place => place.id === id );

                searches.addRecord( placeSelected.name );

                const weather = await searches.weatherPlace( placeSelected.lat, placeSelected.lon );

                console.clear();
                console.log('\nInformation of the city\n'.green);
                console.log('City:', placeSelected.name);
                console.log('Lat:', placeSelected.lat);
                console.log('Long:', placeSelected.lon);
                console.log('Temperature:', weather.temp);
                console.log('Min:', weather.min);
                console.log('Max:', weather.max);
                console.log('Weather:', weather.desc);
            break;

            case 2:
                searches.getCapitalizedRecord().forEach( (place, index) => {
                    const idx = `${ index + 1 }.`.green;
                    console.log(`${ idx } ${ place }`);
                });
            break;
        }

        if( opt !== 0 ) await pause();

    } while ( opt !== 0 );

}

main();