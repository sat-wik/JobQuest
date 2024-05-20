import spacy
import sys

# Load the SpaCy model
nlp = spacy.load('en_core_web_sm')

# Define rejection keywords and phrases
rejection_keywords = ["reject", "unfortunately", "regret", "move forward"]
rejection_phrases = [
    "the team has decided to move forward with applicants they feel are a closer fit for this role",
    "we are not moving forward with your application",
    "we have decided to pursue other candidates"
]

# Define interviewing keywords and phrases
interviewing_keywords = ["invite", "schedule", "interview", "next step", "coding exercise"]
interviewing_phrases = [
    "Thanks for taking the time to apply",
    "As a next step, I have sent you an invitation to complete a coding exercise",
    "Please let me know when you plan to start",
    "please confirm once you have completed"
]

# Define applied keywords and phrases
applied_keywords = ["received", "application", "recruiting"]
applied_phrases = [
    "We received your job application",
    "If your profile corresponds to our requirements",
    "a member of our Recruiting team will contact you"
]

# Function to determine job application status from email content
def determine_status(email_content):
    doc = nlp(email_content.lower())
    
    # Check for rejection phrases
    for phrase in rejection_phrases:
        if phrase in email_content.lower():
            return "Rejected"
    
    # Check for rejection keywords
    for token in doc:
        if token.lemma_ in rejection_keywords:
            return "Rejected"
    
    # Check for interviewing phrases
    for phrase in interviewing_phrases:
        if phrase in email_content.lower():
            return "Interviewing"
    
    # Check for interviewing keywords
    for token in doc:
        if token.lemma_ in interviewing_keywords:
            return "Interviewing"
    
    # Check for applied phrases
    for phrase in applied_phrases:
        if phrase in email_content.lower():
            return "Applied"
    
    # Check for applied keywords
    for token in doc:
        if token.lemma_ in applied_keywords:
            return "Applied"
    
    # Check for offer keywords
    if any([token.lemma_ in ["offer"] for token in doc]):
        return "Offered"

    return "Unknown"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email_content = sys.argv[1]
        status = determine_status(email_content)
        print(status)
    else:
        print("Unknown")
