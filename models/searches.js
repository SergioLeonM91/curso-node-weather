import * as fs from 'node:fs';

import axios from "axios";


class Searches {

    record = [];
    jsonPath = './files/data.json';

    constructor() {
        this.readJson();
    }

    getCapitalizedRecord() {
        return this.record.map( place => {
            let words = place.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1));

            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'en'
        };
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'en'
        };
    }

    async city( place = '' ) {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lat: place.center[0],
                lon: place.center[1],
            }));

        } catch (error) {
            return [];
        }
    }

    async weatherPlace( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
            };

        } catch (error) {
            console.log(error);
        }

    }

    addRecord( place = '' ) {

        if( this.record.includes( place.toLocaleLowerCase() ) ) {
            return;
        }

        this.record = this.record.splice(0, 5);

        this.record.unshift( place.toLocaleLowerCase() );

        this.saveJson();

    }

    saveJson() {

        const payload = {
            record: this.record
        };

        fs.writeFileSync( this.jsonPath, JSON.stringify( payload ) );
    }

    readJson() {
        if( !fs.existsSync( this.jsonPath ) ) {
            return;
        }

        const info = fs.readFileSync(this.jsonPath, {encoding: 'utf-8'});
        const data = JSON.parse( info );

        this.record = data.record;
    }
}

export {
    Searches
}