/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
import moment from 'moment';

const subTime = (start, end) => {
    const ms = moment(start, 'DD/MM/YYYY HH:mm:ss').diff(moment(end, 'DD/MM/YYYY HH:mm:ss'));
    const d = moment.duration(ms);
    const hours = d.hours();
    const minutes = d.minutes();
    const seconds = d.seconds();
    const s = hours * 3600 + minutes * 60 + seconds;

    // alert(s)
    return s;
};

SunCalc = (function() {
    // shortcuts for easier to read formulas

    var PI = Math.PI;
    var sin = Math.sin;
    var cos = Math.cos;
    var tan = Math.tan;
    var asin = Math.asin;
    var atan = Math.atan2;
    var acos = Math.acos;
    var rad = PI / 180;

    // sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

    // date/time constants and conversions

    var dayMs = 1000 * 60 * 60 * 24;
    var J1970 = 2440588;
    var J2000 = 2451545;

    function toJulian(date) {
        return date.valueOf() / dayMs - 0.5 + J1970;
    }
    function fromJulian(j) {
        return new Date((j + 0.5 - J1970) * dayMs);
    }
    function toDays(date) {
        return toJulian(date) - J2000;
    }

    // general calculations for position

    var e = rad * 23.4397; // obliquity of the Earth

    function rightAscension(l, b) {
        return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
    }
    function declination(l, b) {
        return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
    }

    function azimuth(H, phi, dec) {
        return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
    }
    function altitude(H, phi, dec) {
        return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
    }

    function siderealTime(d, lw) {
        return rad * (280.16 + 360.9856235 * d) - lw;
    }

    // general sun calculations

    function solarMeanAnomaly(d) {
        return rad * (357.5291 + 0.98560028 * d);
    }

    function eclipticLongitude(M) {
        var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)); // equation of center
        var P = rad * 102.9372; // perihelion of the Earth

        return M + C + P + PI;
    }

    function sunCoords(d) {
        var M = solarMeanAnomaly(d);
        var L = eclipticLongitude(M);

        return {
            dec: declination(L, 0),
            ra: rightAscension(L, 0),
        };
    }

    var SunCalc = {};

    // calculates sun position for a given date and latitude/longitude

    SunCalc.getPosition = function(date, lat, lng) {
        var lw = rad * -lng;
        var phi = rad * lat;
        var d = toDays(date);

        var c = sunCoords(d);
        var H = siderealTime(d, lw) - c.ra;

        return {
            azimuth: azimuth(H, phi, c.dec),
            altitude: altitude(H, phi, c.dec),
        };
    };

    // sun times configuration (angle, morning name, evening name)

    var times = SunCalc.times = [
        [-0.833, 'sunrise', 'sunset'],
        [-0.3, 'sunriseEnd', 'sunsetStart'],
        [-6, 'dawn', 'dusk'],
        [-12, 'nauticalDawn', 'nauticalDusk'],
        [-18, 'nightEnd', 'night'],
        [6, 'goldenHourEnd', 'goldenHour'],
    ];

    // adds a custom time to the times config

    SunCalc.addTime = function(angle, riseName, setName) {
        times.push([angle, riseName, setName]);
    };

    // calculations for sun times

    var J0 = 0.0009;

    function julianCycle(d, lw) {
        return Math.round(d - J0 - lw / (2 * PI));
    }

    function approxTransit(Ht, lw, n) {
        return J0 + (Ht + lw) / (2 * PI) + n;
    }
    function solarTransitJ(ds, M, L) {
        return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
    }

    function hourAngle(h, phi, d) {
        return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));
    }

    // returns set time for the given sun altitude
    function getSetJ(h, lw, phi, dec, n, M, L) {
        var w = hourAngle(h, phi, dec);
        var a = approxTransit(w, lw, n);
        return solarTransitJ(a, M, L);
    }

    // calculates sun times for a given date and latitude/longitude
    function getTimes(date, lat, lng) {
        var lw = rad * -lng;
        var phi = rad * lat;

        var d = toDays(date);
        var n = julianCycle(d, lw);
        var ds = approxTransit(0, lw, n);

        var M = solarMeanAnomaly(ds);
        var L = eclipticLongitude(M);
        var dec = declination(L, 0);

        var Jnoon = solarTransitJ(ds, M, L);

        var i; var len; var time; var Jset; var Jrise;

        var result = {
            solarNoon: fromJulian(Jnoon),
            nadir: fromJulian(Jnoon - 0.5),
        };

        for (i = 0, len = times.length; i < len; i += 1) {
            time = times[i];

            Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
            Jrise = Jnoon - (Jset - Jnoon);

            result[time[1]] = fromJulian(Jrise);
            result[time[2]] = fromJulian(Jset);
        }

        return result;
    }
    return {
        getDayInfo(today, tomorrow, lat, lng) {
            const todayInfo = getTimes(today, lat, lng);
            const tomorrowInfo = getTimes(tomorrow, lat, lng);
            const s1 = subTime(todayInfo.dawn, new Date());
            const s2 = subTime(todayInfo.goldenHour, new Date());
            const s3 = subTime(tomorrowInfo.dawn, new Date());
            const s4 = subTime(tomorrowInfo.goldenHour, new Date());
            const period_sunrise = subTime(todayInfo.goldenHourEnd, todayInfo.dawn);
            const period_sunset = subTime(todayInfo.dusk, todayInfo.goldenHour);

            // const rise = s1 > 0 ? todayInfo : tomorrowInfo;
            // const set = s2 > 0 ? todayInfo : tomorrowInfo;
            const s_rise = s1 > 0 ? s1 : s3;
            const s_set = s2 > 0 ? s2 : s4;

            return {
                sunrise: {
                    start: todayInfo.dawn,
                    end: todayInfo.goldenHourEnd,
                    goldenHour: todayInfo.sunrise,
                    time: s_rise,
                    name: 'sunrise',
                    period: period_sunrise,
                },
                sunset: {
                    start: todayInfo.goldenHour,
                    end: todayInfo.dusk,
                    goldenHour: todayInfo.sunsetStart,
                    time: s_set,
                    name: 'sunset',
                    period: period_sunset,
                },

                // nextMoment: {
                //     time:  s_rise > s_set ? s_set : s_rise,
                //     sun :  s_rise > s_set ? 'sunset' : 'sunrise',
                // }

            };
        },
    };
}());
export default SunCalc;
