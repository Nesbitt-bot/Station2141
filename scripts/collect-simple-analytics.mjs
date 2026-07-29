import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const hostname = (process.env.SA_HOSTNAME || 'blog.trance-0.com').trim();
const timeZone = (process.env.SA_TIME_ZONE || 'Asia/Shanghai').trim();
const outputPath = resolve(process.env.SA_OUTPUT_PATH || 'static/analytics/daily.json');
const apiKey = (process.env.SIMPLE_ANALYTICS_API_KEY || '').trim();
const userId = (process.env.SIMPLE_ANALYTICS_USER_ID || '').trim();
const suppliedStart = (process.env.SA_START_DATE || '').trim();
const suppliedEnd = (process.env.SA_END_DATE || '').trim();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function integer(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function dateInTimeZone(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(
        parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])
    );
    return `${values.year}-${values.month}-${values.day}`;
}

function shiftDate(isoDate, days) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function validateDate(value, label) {
    if (!datePattern.test(value) || shiftDate(value, 0) !== value) {
        throw new Error(`${label} must be a valid date in YYYY-MM-DD format`);
    }
}

function datesBetween(start, end) {
    const dates = [];
    for (let date = start; date <= end; date = shiftDate(date, 1)) {
        dates.push(date);
        if (dates.length > 400) {
            throw new Error('A single collection run is limited to 400 days');
        }
    }
    return dates;
}

async function loadArchive() {
    try {
        const parsed = JSON.parse(await readFile(outputPath, 'utf8'));
        if (parsed.schemaVersion !== 1) throw new Error('unsupported schemaVersion');
        if (parsed.hostname !== hostname) {
            throw new Error(`archive hostname ${parsed.hostname} does not match ${hostname}`);
        }
        if (parsed.timeZone !== timeZone) {
            throw new Error(`archive time zone ${parsed.timeZone} does not match ${timeZone}`);
        }
        if (!Array.isArray(parsed.days)) throw new Error('days must be an array');
        return parsed;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {
                schemaVersion: 1,
                hostname,
                timeZone,
                updatedThrough: null,
                days: []
            };
        }
        throw new Error(`Unable to read ${outputPath}: ${error.message}`);
    }
}

async function fetchDay(date) {
    const url = new URL(`https://simpleanalytics.com/${encodeURIComponent(hostname)}.json`);
    url.searchParams.set('version', '6');
    url.searchParams.set('fields', 'visitors,pageviews,pages');
    url.searchParams.set('start', date);
    url.searchParams.set('end', date);
    url.searchParams.set('timezone', timeZone);
    url.searchParams.set('limit', '1000');
    url.searchParams.set('info', 'false');

    const headers = { Accept: 'application/json' };
    if (apiKey) headers['Api-Key'] = apiKey;
    if (userId) headers['User-Id'] = userId;

    const response = await fetch(url, { headers });
    const body = await response.text();
    let data;
    try {
        data = JSON.parse(body);
    } catch {
        throw new Error(`Simple Analytics returned non-JSON data for ${date} (${response.status})`);
    }

    if (!response.ok || data.ok === false) {
        throw new Error(
            `Simple Analytics request failed for ${date} (${response.status}): ` +
            `${data.error || 'unknown API error'}`
        );
    }

    const pages = Object.fromEntries(
        (Array.isArray(data.pages) ? data.pages : [])
            .filter((page) => typeof page.value === 'string' && page.value.startsWith('/'))
            .map((page) => [
                page.value,
                {
                    visitors: integer(page.visitors),
                    pageviews: integer(page.pageviews)
                }
            ])
            .sort(([left], [right]) => left.localeCompare(right))
    );

    return {
        date,
        visitors: integer(data.visitors),
        pageviews: integer(data.pageviews),
        pages
    };
}

const archive = await loadArchive();
const today = dateInTimeZone();
const yesterday = shiftDate(today, -1);
const archivedDates = archive.days
    .map((day) => day.date)
    .filter((date) => datePattern.test(date))
    .sort();
const nextUnarchivedDate = archivedDates.length
    ? shiftDate(archivedDates.at(-1), 1)
    : shiftDate(yesterday, -29);

const startDate = suppliedStart || suppliedEnd || (
    nextUnarchivedDate <= yesterday ? nextUnarchivedDate : yesterday
);
const endDate = suppliedEnd || suppliedStart || yesterday;

validateDate(startDate, 'SA_START_DATE');
validateDate(endDate, 'SA_END_DATE');
if (startDate > endDate) throw new Error('SA_START_DATE cannot be after SA_END_DATE');
if (endDate >= today) {
    throw new Error(`Only completed days can be archived; ${timeZone} today is ${today}`);
}

const collectedDays = [];
for (const date of datesBetween(startDate, endDate)) {
    console.log(`Collecting ${hostname} aggregates for ${date}`);
    collectedDays.push(await fetchDay(date));
}

const daysByDate = new Map(
    archive.days
        .filter((day) => datePattern.test(day.date))
        .map((day) => [day.date, day])
);
for (const day of collectedDays) daysByDate.set(day.date, day);

const days = [...daysByDate.values()].sort((left, right) => left.date.localeCompare(right.date));
const updatedArchive = {
    schemaVersion: 1,
    hostname,
    timeZone,
    updatedThrough: days.length ? days.at(-1).date : null,
    days
};
const nextContent = `${JSON.stringify(updatedArchive, null, 2)}\n`;
let previousContent = '';
try {
    previousContent = await readFile(outputPath, 'utf8');
} catch (error) {
    if (error.code !== 'ENOENT') throw error;
}

if (nextContent !== previousContent) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, nextContent, 'utf8');
    console.log(`Updated ${outputPath} through ${updatedArchive.updatedThrough}`);
} else {
    console.log(`${outputPath} is already current through ${updatedArchive.updatedThrough}`);
}
