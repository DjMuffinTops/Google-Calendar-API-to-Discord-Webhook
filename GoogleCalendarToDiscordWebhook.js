// This Google Apps Script Will Send a POST to a Discord Webhook creating embed messages of any events starting within the next minute of execution.
// Any events that have already started will not appear. 
// This script should be triggered every minute using Google Triggers.
const CHANNEL_POST_URL = "DISCORD_WEBHOOK_LINK_GOES_HERE"; 
const CALENDAR_ID = "GOOGLE_CALENDAR_ID_GOES_HERE";
const NO_VALUE_FOUND = "N/A";


// Import Luxon
eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/luxon@2.0.2/build/global/luxon.min.js').getContentText());
let DateTime = luxon.DateTime;
const DTnow = DateTime.now().startOf('minute'); // Will consider 'now' as the beginning the minute to deal with second offsets issues with trigger over time.

function postCalendarToAdminChannel() {
  // .list parameters. See https://developers.google.com/calendar/api/v3/reference/events/list?hl=en
  let optionalArgs = {
    timeMin: DTnow.toISO(),
    timeMax: DTnow.plus({minutes: 1}).toISO(), // Will only show events starting in the next minute
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  };
  let response = Calendar.Events.list(CALENDAR_ID, optionalArgs);
  let events = response.items;
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      let event = events[i];
      let ISOStartDate = event.start.dateTime || event.start.date;
      let ISOEndDate = event.end.dateTime || event.end.date;

      // The Calendar API's .list function will continously return events whose endDate has not been reached yet (timeMin is based on the event's end time)
      // Since this script is meant to run every minute, we have to skip these events ourselves
      if (DateTime.fromISO(ISOStartDate) < DTnow) {
        Logger.log(`Event ${event.summary} [${event.id}] has already started. Skipping`);
        continue;
      }

      // Build the POST request
      let options = {
          "method": "post",
          "headers": {
              "Content-Type": "application/json",
          },
          "payload": JSON.stringify({
              "content": "‌",
              "embeds": [{
              "author": {
                  "name": `${event.summary}`,
                  "icon_url": "https://cdn.discordapp.com/attachments/696400605908041794/888874282950750238/1200px-Google_Calendar_icon_28202029.png"
              },
                "timestamp": DTnow.toISO(),
                "description":`[Google Event Link](${event.htmlLink})`,
                "color": 1425196,
                "fields":[
                    {
                      "name":"Start Time",
                      "value": ISOToDiscordUnix(ISOStartDate) ?? NO_VALUE_FOUND,
                      "inline":false
                    },
                    {
                      "name":"End Time",
                      "value":ISOToDiscordUnix(ISOEndDate) ?? NO_VALUE_FOUND,
                      "inline":false
                    },
                    {
                      "name":"Location",
                      "value":event.location ?? NO_VALUE_FOUND,
                      "inline":false
                    },
                    {
                      "name":"Description",
                      "value":event.description ?? NO_VALUE_FOUND,
                      "inline":false
                    }
                ]
            }]
          })
      };
      Logger.log(options, null, 2);
      UrlFetchApp.fetch(CHANNEL_POST_URL, options);
    }
  } else {
    Logger.log('No events starting within the minute found.');
  }
}

/**
 * Converts an ISO string into a discord formatted timestamp
 */
function ISOToDiscordUnix(isoString) {
  return `<t:${Math.floor(DateTime.fromISO(isoString).toSeconds())}:F>`
}
