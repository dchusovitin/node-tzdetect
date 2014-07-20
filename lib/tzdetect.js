var assert = require('assert'),
    moment = require('moment-timezone'),
    timezones = require('moment-timezone/data/meta/latest.json');

var TIMEZONES_BY_COUNTRY = {},
    OFFSETS_BY_COUNTRY = {},
    now = Date.now();

timezones.forEach(function(timezone) {
    if (!TIMEZONES_BY_COUNTRY[timezone.country] || !OFFSETS_BY_COUNTRY[timezone.country]) {
        TIMEZONES_BY_COUNTRY[timezone.country] = [];
        OFFSETS_BY_COUNTRY[timezone.country] = [];
    }

    TIMEZONES_BY_COUNTRY[timezone.country].push(timezone.name);
    OFFSETS_BY_COUNTRY[timezone.country].push(moment.tz.zone(timezone.name).offset(now));
});

exports.detect = function(country, offset, onlyOne) {
    assert(typeof country === 'string', 'country must be a string');
    assert(typeof offset === 'number', 'offset must be a number');

    if (!TIMEZONES_BY_COUNTRY[country]) {
        return null;
    }

    var zoneIndex = 0,
        zones = [];

    while(-1 !== (zoneIndex = OFFSETS_BY_COUNTRY[country].indexOf(offset, zoneIndex))){
        zones.push(TIMEZONES_BY_COUNTRY[country][zoneIndex]);

        if (onlyOne) {
            break;
        }

        zoneIndex++;
    }

    if (0 === zones.length) {
        return null;
    } else if (onlyOne) {
        return zones[0];
    } else {
        return zones;
    }
};
