
/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
const googleAPI = 'AIzaSyDh8TZyBPaCxhMqcthBlQ1MuJGf0lnMFi8';

export const getPlaceDetails = async (placeID, name) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${googleAPI}`;

        const response = await fetch(url);
        const responseJson = await response.json();
        name = responseJson.result.name || name;
        let address = extractGoogleCityAndCountry(responseJson.result, name);
        if (address === '') {
            address = responseJson.result.formatted_address;
        }

        const lat = responseJson.result.geometry.location.lat;
        const lng = responseJson.result.geometry.location.lng;
        const location = {
            id: placeID,
            name,
            address,
            lat,
            lng,
        };
        return location;
    } catch (error) {
        console.error(error);
    }
};

const extractGoogleCityAndCountry = (googlePlace, name) => {
    if (!googlePlace || !googlePlace.address_components || googlePlace.address_components.length === 0) {
        return '';
    }

    let address = '';
    let hadLocality = false;
    googlePlace.address_components.forEach((item) => {
        if (item.types.includes('locality') && item.long_name !== name) {
            hadLocality = true;
            address += item.long_name + ', ';
        }

        if (item.types.includes('administrative_area_level_2') && !hadLocality && item.long_name !== name) {
            address += item.short_name + ', ';
        }

        if (item.types.includes('administrative_area_level_1') && (item.long_name !== name || address.length > 0)) {
            address += item.long_name + ', ';
        }

        if (item.types.includes('country')) {
            address += item.long_name;
        }
    });

    return address;
};

export const autocompleteSearch = async (input, sessionToken) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${googleAPI}&sessiontoken=${sessionToken}`;

    const response = await fetch(encodeURI(url));
    const responseJson = await response.json();

    const predictions = responseJson.predictions;

    if (predictions.length === 0) {
        return [];
    } else if (predictions.length > 0) {
        const results = [];
        let primaryText = '';
        let secondaryText = '';

        predictions.forEach((item) => {
            primaryText =
                item.structured_formatting.main_text ||
                item.structured_formatting.secondary_text ||
                item.description;

            secondaryText =
                item.structured_formatting.secondary_text ||
                item.structured_formatting.main_text ||
                item.description;

            results.push({
                id: item.place_id,
                primaryText,
                secondaryText,
            });
        });

        // console.warn(results);

        return results;
    }
};

export const getPlaceByCoordinate = async (lat, lng) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleAPI}`;
        const response = await fetch(url);
        const responseJson = await response.json();

        if (responseJson.results.length > 0) {
            const googleLocations = responseJson.results[0].address_components;
            const address = responseJson.results[0].formatted_address;
            const name = googleLocations[0].long_name + ', ' + googleLocations[1].long_name || address;
            const id = responseJson.results[0].place_id;

            const location = await getPlaceDetails(id, name);
            return location;
        }
    } catch (error) {
        console.log(error);
    }
};