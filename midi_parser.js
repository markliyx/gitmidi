let MidiParser = require('midi-parser-js');
let fs = require('fs');
const { start } = require('repl');

/*-----------------------------           Main           -------------------------------*/ 
// reading midi files
// original file
var data1 = fs.readFileSync('Adventure_of_Lifetime-Trombone.mid', 'base64');
var midi1 = MidiParser.parse(data1);
fs.writeFileSync('data.json', JSON.stringify(midi1));

// modified file
var data2 = fs.readFileSync('Adventure_of_Lifetime-Trombone_modified.mid', 'base64');
var midi2 = MidiParser.parse(data2)
fs.writeFileSync('data2.json', JSON.stringify(midi2));

// call notes mapping 
var notesMap1 = new Map();
var notesMap2 = new Map();
notesMapping(notesMap1, midi1);
notesMapping(notesMap2, midi2);
//print out maps
//console.log(JSON.stringify(Object.fromEntries(notesMap1)));
//console.log(JSON.stringify(Object.fromEntries(notesMap2)));

// produce result map 
merging(notesMap1, notesMap2);
console.log(JSON.stringify(Object.fromEntries(notesMap1)));
console.log(JSON.stringify(Object.fromEntries(notesMap2)));

/* log out first map 
var count = 0;
notesMap1.forEach((value, key) => {
    value.forEach(note => {
        console.log(note);
        count++;
    })
});
console.log("map 1 count is " + count);

// log out second map 
var count = 0;
notesMap2.forEach((value, key) => {
    value.forEach(note => {
        console.log(note);
        count++;
    })
});
console.log("map 2 count is " + count);
*/ 


/*--------------------------           Functions           ----------------------------*/ 
/* this function stores the note events in a map with the following attributes:
 * 1. key = start time
 * 2. value = list of events 
 * 3. an event will be an object containing the note, length, and color 
*/
function notesMapping(notesMap, midi1) {
    midi1.track.forEach(track => {
        var events = track.event;
        var startingTime = 0;
        for (var i = 0; i < events.length; i++) {
            if (events[i].type == 9 && events[i].data[1] > 0) {
                var note = events[i].data[0];
                var toAdd = {
                    "note": note, 
                    "startTime": startingTime, 
                    "duration": undefined, 
                    "color": "blue"
                }
                if (notesMap.has(startingTime)) {
                    notesMap.set(startingTime, notesMap.get(startingTime).push(toAdd))
                } else {
                    notesMap.set(startingTime, [toAdd]);
                }
                var endingTime = startingTime;
                for (var j = i + 1; j < events.length; j++) {
                    endingTime += events[j].deltaTime; 
                    if ((events[j].type == 8 || events[j].type == 9) && events[j].data[0] == note 
                    && events[i].channel == events[j].channel) {
                        notesMap.get(startingTime).forEach(event => {
                            if (event.note == note) {
                                event.duration = endingTime - startingTime;
                            }
                        })
                        break;
                    }
                }
            } 
            startingTime = startingTime + events[i].deltaTime;
        }
    });
}

/* this function finds the differences between the two notesMaps:
 *  - find new values and unchanged values, assigning different colors to each 
 *  Unchanged = blue
 *  New added = red
 *  Deleted = black
 *  output a modified map2 that will be visualized 
 * edges cases: 1. if a bar is added, then the entire file will be different dispite 
 * if only that bar is added 2. (resolved) if a note only changed length, then in visualization 
 * a portion of the longer red plotting will cover the old blue plotting
*/
function merging (notesMap1, notesMap2) {
    // iterate through the second map
    notesMap2.forEach((value, key) => {
        // check if value exist in notesMap1 or not 
        if (notesMap1.has(key)) {
            var notesMap1Value = notesMap1.get(key);
            for (var i = 0; i < value.length; i++) {
                // add the rest of the notes if in Map2[key], if values of map1[key] has all been matched 
                if (notesMap1Value.length == 0) {
                    value[i].color = "red";
                }
                for (var j = notesMap1Value.length - 1; j >= 0; j--) {
                    if (value[i].note == notesMap1Value[j].note 
                        && value[i].duration == notesMap1Value[j].duration) {
                            notesMap1Value.splice(j, 1);
                            // delete the matched entry
                            notesMap1Value.splice(j, 1);
                        } else {
                            value[i].color = "red";
                        }
                }
            }
        } else {
            value.forEach(function(noteEvent, index, arr) {
                arr[index].color = "red"
            })
        }
    })
    // find deleted notes and color them black
    notesMap1.forEach((value, key) => {
        if (value.length > 0) {
            var blackNotesToAdd = []
            value.forEach((note) => {
                blackNotesToAdd.push({
                    "note": note.note, 
                    "startTime": key, 
                    "duration": note.duration, 
                    "color": "black"
                })
            });
            if (notesMap2.has(key)) {
                notesMap2.set(key, notesMap2.get(key).concat(blackNotesToAdd));
            } else {
                notesMap2.set(key, [blackNotesToAdd]);
            }
        }
    })
}
