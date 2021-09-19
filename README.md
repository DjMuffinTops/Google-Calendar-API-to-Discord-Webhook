# Google-Calendar-API-to-Discord-Webhook
[Gist link here](https://gist.github.com/DjMuffinTops/95aecdc07c9cbf4968cfe3037c7fa22a)

Copy and paste this script into a Google Cloud Apps Script project at https://script.google.com


You will need a Discord Webhook URL and the Calendar ID for the Google Calendar to get events from

You Will then need to setup a trigger to run the `postEventsToChannel` function every minute
![image](https://user-images.githubusercontent.com/68816695/133913045-da937bd5-c53f-4028-af5b-22874df2e798.png)

You should see any events that will start within the next minute posted into an embed into the discord channel your webhook was on
![image](https://user-images.githubusercontent.com/68816695/133913037-00a74fa2-0bf7-4652-9b83-cd9a4efa4b15.png)
