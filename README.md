## Alignment Server
This project was a coding challenge to integrate Django and React and then deploy the site. The site translates input DNA to a peptide and searches genomes for a parent protein.

The application can be seen running here: http://joelmeyerson.pythonanywhere.com/

Note that jobs will take up to ~30 seconds to complete simply because the server is running on a free tier account which has reduced priority.

## Overview
1. The client takes a DNA sequence as an input. 

2. Each submission is sent to the backend, translated to protein, and the alignment is processed using a Python thread.

3. A set of ten genomes is searched. The genomes are in GenBank (.gb) format and included with the project.

4. Multiple submissions can be made on the client before the first submission has completed. The jobs in progress are displayed in the browser.

5. As each job completes it is shown in the browser with the results, including the name of the protein where the peptide was found, and the residue number where the match starts.

6. If the browser is closed the results will be automatically reloaded when the page is reopened.

7. Previous searches and results are visible.

## Comments
1. The search is done by iterating through proteins and returning the first protein having a substring that matches the peptide sequence. This approach was chosen over an BioPython alignment because it yields results meeting the project specification, and could be implemented with the Python find() function which is simple and efficient.

2. While one or more jobs are in the queue the client polls the server. Polling is off when no jobs are in the queue. The use of polling is less efficient than using a websocket, and would likely not be suitable for a server that gets significant traffic. However, for the small scale of the demo project it seemed like a good approach.

3. Currently the app does limited input validation. This would need to be more robust in production.

4. The app assumes that one user or a unified team of users will submit jobs. For multiple users/teams it would be best to compartmentalize the different sets of results. 

5. I chose PythonAnywhere to deploy because it's fast to set up, and it supports SQLite which is what I used for the project.

![alt text](readme_img/screenshot.png?raw=true)
