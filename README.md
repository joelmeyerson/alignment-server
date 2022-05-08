## Alignment Server
A server to translate input DNA to a peptide and search genomes for a parent protein. The project uses Django for the backend and React for the frontend.

## Overview
1. The web application takes DNA sequence as an input. 

2. Each submission is sent to the backend, translated to protein, and the alignment is processed asynchronously using a Python thread.

3. A set of ten genomes are searched. The genomes are in GenBank (.gb) format and included with the project.

4. Multiple submission can be made on the client before the first submission has completed. The jobs in progress are displayed in the browser.

5. As each job completes it is shown in the browser the results are shown, including the name of the protein where the peptide was found, and the residue number where the match starts.

6. If the browser is closed the results will be automatically reloaded when the page is reopened.

7. Previous searches and results are visible.

## Limitations
1. While one or more jobs are in the queue the client polls the server. Polling is off when no jobs are in the queue. This is less efficient than using a websocket.

2. Currently limited input validation is used and could be made more robust.

3. There is no support for multiple users.