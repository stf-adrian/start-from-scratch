We should use the LoginLog table to provide a chart from shadcn into dashboard

at each login we should also parse the user agent , ip address and location (country) and store it in the loginlog table

We should then use this data to provide a chart in the dashboard page that shows the number of logins per day for the last 30 days.
We should also provide a table that shows the last 10 logins with ALL LoginLog fields:

- ID
- User ID
- Date/Time
- IP Address
- User Agent
- Country
- City
- Device
- Browser
- Success (boolean)

MOCK TEST
for user with email, adiupm@gmail.com. create a script to add fake logins data in last 30 days with random ip address, location and user agent
