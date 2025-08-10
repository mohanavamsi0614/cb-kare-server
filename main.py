import requests as rq
import pandas as pd
from typing import Dict, List

def get_data() -> List[Dict]:
    response = rq.get("https://cb-kare-server.onrender.com/event/students")
    return response.json()

def create_team_record(team: Dict) -> Dict:
    record = {
        "Team Name": team.get("teamname", ""),
        "Problem Statement": team.get("ProblemStatement", ""),
        "Domain": team.get("Domain", ""),
        "First Review Score": team.get("FirstReviewScore", 0),
        "Second Review Score": team.get("SecoundReviewScore", 0),
        "Third Review Score": team.get("ThirdReviewScore", 0),
        "Final Score": team.get("FinalScore", 0),
        "Sector": team.get("Sector", ""),
        "Room": team.get("room", ""),
        "UPI ID": team.get("upiId", ""),
        "Transaction ID": team.get("transtationId", ""),
        "Verification Status": "Verified" if team.get("verified", False) else "Pending",
        "Password": team.get("lead", {}).get("password", ""),
    }
    
    # Handle nested review data
    if "FirstReview" in team:
        first_review = team.get("FirstReview", {})
        if isinstance(first_review, dict):
            for key, value in first_review.items():
                if isinstance(value, dict) and "marks" in value:
                    record[f"First Review - {value.get('criteria', key)}"] = value.get("marks", 0)
                    record[f"First Review - {value.get('criteria', key)} (Max)"] = value.get("max", 0)
    
    if "SecoundReview" in team:
        second_review = team.get("SecoundReview", {})
        if isinstance(second_review, dict):
            for key, value in second_review.items():
                if isinstance(value, dict) and "marks" in value:
                    record[f"Second Review - {value.get('criteria', key)}"] = value.get("marks", 0)
                    record[f"Second Review - {value.get('criteria', key)} (Max)"] = value.get("max", 0)
    
    # Same for leader's review data
    lead = team.get("lead", {})
    if "FirstReviewScore" in lead and isinstance(lead["FirstReviewScore"], dict):
        for key, value in lead["FirstReviewScore"].items():
            if isinstance(value, dict) and "marks" in value:
                record[f"Lead First Review - {value.get('criteria', key)}"] = value.get("marks", 0)
    
    if "SecoundReviewScore" in lead and isinstance(lead["SecoundReviewScore"], dict):
        for key, value in lead["SecoundReviewScore"].items():
            if isinstance(value, dict) and "marks" in value:
                record[f"Lead Second Review - {value.get('criteria', key)}"] = value.get("marks", 0)
    
    return record

def generate_excel():
    data = get_data()
    records = []
    
    for team in data:
        team_record = create_team_record(team)
        
        # Add team lead info
        lead_record = team_record.copy()
        lead_info = team.get("lead", {})
        if not lead_info and "name" in team:  # If lead not in separate field
            lead_info = {
                "name": team.get("name", ""),
                "email": team.get("email", ""),
                "registrationNumber": team.get("registrationNumber", ""),
                "type": team.get("type", ""),
                "room": team.get("room", "")
            }
        
        lead_record.update({
            "Name": lead_info.get("name", ""),
            "Email": lead_info.get("email", ""),
            "Registration Number": lead_info.get("registrationNumber", ""),
            "Hostel": lead_info.get("type", ""),
            "Room": lead_info.get("room", ""),
            "Role": "Team Lead",
            
        })
        records.append(lead_record)
        
        # Add team members info
        for member in team.get("teamMembers", []):
            member_record = team_record.copy()
            email = f"{member.get('registrationNumber', '')}@klu.ac.in" if member.get('registrationNumber') else ""
            
            member_record.update({
                "Name": member.get("name", ""),
                "Email": email,
                "Registration Number": member.get("registrationNumber", ""),
                "Hostel": member.get("type", ""),
                "Room": member.get("room", ""),
                "Role": "Team Member",
                "First Attendance": member.get("FirstAttd", "Absent"),
                "Second Attendance": member.get("SecondAttd", "Absent"),
                "Third Attendance": member.get("ThirdAttd", "Absent"),
            })
            records.append(member_record)

    # Create and save Excel file
    df = pd.DataFrame(records)
    
    # Reorder columns to put personal info first
    first_cols = [
        "Name", "Email", "Registration Number", "Hostel", "Room", "Role", 
        "Team Name", "Problem Statement", "Domain", "Sector", "Password",
        "First Review Score", "Second Review Score", "Third Review Score", "Final Score",
        "First Attendance", "Second Attendance", "Third Attendance", "Fourth Attendance", 
        "FirstReview", "SecoundReview", "ThirdReview"
    ]
    
    # Filter to only include columns that exist in the DataFrame
    first_cols = [col for col in first_cols if col in df.columns]
    
    # Reorder columns
    other_cols = [col for col in df.columns if col not in first_cols]
    df = df[first_cols + other_cols]
    
    df.to_excel("innovation_teams.xlsx", index=False)
    print("Excel file generated successfully!")

if __name__ == "__main__":
    generate_excel()
