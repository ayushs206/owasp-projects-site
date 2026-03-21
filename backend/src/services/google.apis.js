import { google } from "googleapis";
import axios from "axios";

export const generateGoogleAuthURL = async (batch, operation) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );

    const scopes = [
        "https://www.googleapis.com/auth/calendar"
    ];

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({ batch, operation })
    });
};

const dayMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0 };

const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
}

export const handleGoogleCallback = async (code, batch, operation) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const calendarParams = { version: "v3", auth: oAuth2Client };
    const calendar = google.calendar(calendarParams);

    const calendarName = process.env.CALENDAR_NAME || "Timetable";
    let calendarId = null;

    const calendarList = await calendar.calendarList.list();
    const existing = calendarList.data.items.find(c => c.summary === calendarName);

    if (existing) {
        calendarId = existing.id;
    } else {
        const newCal = await calendar.calendars.insert({
            requestBody: { summary: calendarName }
        });
        calendarId = newCal.data.id;
    }

    if (operation === "resetCalendar") {
        await resetCalendar(calendar, calendarId);
        return;
    }

    if (operation === "addToCalendar" && batch) {
        await addScheduleToCalendar(calendar, calendarId, batch);
    }
}

const resetCalendar = async (calendar, calendarId) => {
    try {
        await calendar.calendars.delete({ calendarId });
    } catch (error) {
        console.error("Error resetting calendar:", error);
    }
}

import { timetable } from "../db/timetable.js";

const addScheduleToCalendar = async (calendar, calendarId, batch) => {
    const batchTimetable = timetable[batch.toUpperCase()];
    if (!batchTimetable) throw new Error("Batch not found : " + batch);

    const startDateStr = process.env.SEMESTER_START_DATE || "2025-07-21";
    const startDate = new Date(startDateStr);

    const eventsToCreate = [];

    const getGoogleColorId = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("lecture")) return "9"; // Blueberry
        if (t.includes("practical") || t.includes("lab")) return "10"; // Basil
        if (t.includes("tutorial")) return "3"; // Grape
        return "8"; // Graphite
    };

    for (const [day, classes] of Object.entries(batchTimetable)) {
        const dayIndex = dayMap[day];

        const classDate = new Date(startDate);
        const startDayIndex = classDate.getDay();
        const daysToAdd = (dayIndex - startDayIndex + 7) % 7;

        classDate.setDate(classDate.getDate() + daysToAdd);

        for (const [timeRange, classDetails] of Object.entries(classes)) {
            // classDetails -> [CourseCode, Location, SubjectName, Type]
            const { hours, minutes } = parseTime(timeRange);

            const eventStart = new Date(classDate);
            eventStart.setHours(hours, minutes, 0, 0);

            const eventEnd = new Date(eventStart.getTime() + 50 * 60000); // assume 50 min class

            eventsToCreate.push({
                summary: `${classDetails[2]} (${classDetails[3]})`,
                location: classDetails[1],
                description: `Course Code: ${classDetails[0]}\nType: ${classDetails[3]}\nBatch: ${batch}`,
                colorId: getGoogleColorId(classDetails[3]),
                start: { dateTime: eventStart.toISOString(), timeZone: "Asia/Kolkata" },
                end: { dateTime: eventEnd.toISOString(), timeZone: "Asia/Kolkata" },
                recurrence: [
                    'RRULE:FREQ=WEEKLY;COUNT=19'
                ],
                extendedProperties: { private: { batch } }
            });
        }
    }

    // Batch process 10 at a time with 1000ms delay to respect rate limit (approx ~10 req/sec)
    for (let i = 0; i < eventsToCreate.length; i += 10) {
        const batchEvents = eventsToCreate.slice(i, i + 10);
        await Promise.all(batchEvents.map(event =>
            calendar.events.insert({
                calendarId,
                requestBody: event
            }).catch(e => console.error("Event Insert Error:", e.message))
        ));
        await new Promise(r => setTimeout(r, 1000));
    }
}
