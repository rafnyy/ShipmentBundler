const fs = require('fs');

// Glorious type safety

/**
 * @typedef {'M' | 'T' | 'W' | 'R' | 'F'} DayOfWeek
 */

/**
 * @typedef {string[]} Bundle
 */

/**
 * @typedef {Object} Shipment
 * @property {string} id
 * @property {string} start
 * @property {string} finish
 * @property {DayOfWeek} day
 */

// Actual script beginneth

if (process.argv.length < 3) {
    console.error(`Usage: node bundler.js shipmentsFile`);
    process.exit(1);
}
buildBundles(process.argv[2]);

/**
 * @param {string[]} shipmentsFile
 */
function buildBundles(shipmentsFile) {
    let input;
    try {
        input = fs.readFileSync(shipmentsFile).toString();
    } catch (error) {
        console.error(`${shipmentsFile} does not appear to be a shipments file`);
        return false;
    }

    let inputShipments = parseInputShipments(input);
    let bundlesOfShipments = [];

    for (const shipmentsByDay of inputShipments) {
        for(const shipment of shipmentsByDay) {
            let added = false;
            for(let i = 0; i < bundlesOfShipments.length; i++) {
                if(isValidNextShipment(bundlesOfShipments[i][bundlesOfShipments[i].length - 1], shipment)) {
                    bundlesOfShipments[i].push(shipment);
                    added = true;
                    break;
                }
            }

            if(!added) {
                bundlesOfShipments.push([shipment]);
            } 
        }
    }
    
    for(const bundle of bundlesOfShipments) {
        bundleStr = "";
        for(const shipment of bundle) {
            bundleStr += shipment.id + " ";
        }
        console.log(bundleStr)
    }
}

/**
 * @param {DayOfWeek} dayOfWeek
 */
function getNextDay(dayOfWeek) {
    let nextDay = "M";
    switch (dayOfWeek) {
        case "M":
            nextDay = "T";
            break;
        case "T":
            nextDay = "W";
            break;
        case "W":
            nextDay = "R";
            break;
        case "R":
            nextDay = "F";
            break;
    }
    return nextDay;
}

/**
 * @param {Shipment} shipment1
 * @param {Shipment} shipment2
 */
function isValidNextShipment(shipment1, shipment2) {
    let a =  typeof shipment1 != 'undefined'; let b = getNextDay(shipment1.day) == shipment2.day; let c = shipment1.finish == shipment2.start;

    return typeof shipment1 != 'undefined' && getNextDay(shipment1.day) == shipment2.day && shipment1.finish == shipment2.start;
}

/**
 * Parses a test input file, where each line is of the format:
 *
 *   <id> <start> <finish> <day>
 *
 * @param {string} contents
 */
function parseInputShipments(contents) {
    const shipmentsByDay = [[], [], [], [], []];
    for (const line of parseWords(contents)) {
        switch (line[3]) {
            case "M":
                shipmentsByDay[0].push({
                    id: line[0],
                    start: line[1],
                    finish: line[2],
                    day: line[3],
                });
                break;
            case "T":
                shipmentsByDay[1].push({
                    id: line[0],
                    start: line[1],
                    finish: line[2],
                    day: line[3],
                });
                break;
            case "W":
                shipmentsByDay[2].push({
                    id: line[0],
                    start: line[1],
                    finish: line[2],
                    day: line[3],
                });
                break;
            case "R":
                shipmentsByDay[3].push({
                    id: line[0],
                    start: line[1],
                    finish: line[2],
                    day: line[3],
                });
                break;
            case "F":
                shipmentsByDay[4].push({
                    id: line[0],
                    start: line[1],
                    finish: line[2],
                    day: line[3],
                });
            default:
                ;
        }

    }

    return shipmentsByDay;
}

/**
 * @param {string} contents
 */
function parseWords(contents) {
    return contents
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => line.split(' '));
}