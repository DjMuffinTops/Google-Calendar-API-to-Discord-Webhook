# Google-Calendar-API-to-Discord-Webhook
[Gist link here](https://gist.github.com/DjMuffinTops/95aecdc07c9cbf4968cfe3037c7fa22a)

Copy and paste this script into a Google Cloud Apps Script project at https://script.google.com


You will need a Discord Webhook URL and the Calendar ID for the Google Calendar to get events from

You Will then need to setup a trigger to run the `postEventsToChannel` function every minute
![image](https://user-images.githubusercontent.com/68816695/133912945-f065cbcb-5a59-46f8-a3ad-e98412ec9b82.png)

You should see any events that will start within the next minute posted into an embed into the discord channel your webhook was on
