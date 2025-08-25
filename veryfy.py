import requests

url = "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/master/README.md"
response = requests.get(url)

print(response.status_code)  # should print 200
print(response.text[:500])   # preview first 500 characters
