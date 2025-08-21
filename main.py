import requests
import pandas
import json

teams=requests.get("https://cb-kare-server.onrender.com/event/teams").json()
all_members=[]
for team in teams:
    all_members.append({"team":team["teamName"],"name":team["lead"]["name"],"email":team["lead"]["email"],"type":team["lead"]["accommodationType"],"hostel":team["lead"].get("hostelName","-"),"room":team["lead"].get("roomNumber","-")})
    for member in team['members']:
        all_members.append({"team":team["teamName"],"name":member['name'],"email":member['email'],"type":member["accommodationType"],"hostel":member.get("hostelName","-"),"room":member.get("roomNumber","-")})
    print(team["teamName"])

df=pandas.DataFrame(all_members)
df.to_excel("./genisis.xlsx")