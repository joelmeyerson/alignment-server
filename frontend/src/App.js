import { useEffect, useState, useRef } from "react";

export default function AlignmentApp() {
  const [jobsProcessing, setJobsProcessing] = useState([]);
  const [jobsComplete, setJobsComplete] = useState([]);
  const [dna, setDna] = useState("");
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState(false);

  // fetch data on mount
  useEffect(() => {
    setPolling(true);
    fetchAlignments();
  }, []);

  // trigger polling
  useEffect(() => {
    if (polling === true) {
      const timer = setInterval(fetchAlignments, 2000);
      return () => clearInterval(timer);
    }
  }, [polling]);

  // fetch alignments
  async function fetchAlignments() {
    await fetch(
      "http://127.0.0.1:8000/api/alignment",
      // "https://0.0.0.0:5000/api/alignment",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      }
    )
      .then((response) => response.json())
      .then((alignments) => {
        // store list of incomplete jobs
        let notComplete = alignments.filter((ali) => ali.job_complete === false);
        setJobsProcessing(notComplete);

        if (notComplete.length === 0) {
          setPolling(false);
        }

        // store list of completed jobs
        let complete = alignments.filter((ali) => ali.job_complete === true);
        setJobsComplete(complete);
      });
  }

  // handle input for DNA sequence
  async function handleChange(e) {
    setDna(e.target.value);
  }

  // handle submitting DNA sequence
  async function handleSubmit(e) {
    e.preventDefault();

    setError(false);

    // validation to make sure submission not empty string
    // more validation needed
    if (dna === "") {
      setError(true);
    } else {
      // POST to server
      const response = await fetch("http://127.0.0.1:8000/addAlignment/", {
        // const response = await fetch("https://0.0.0.0:5000/addAlignment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dna,
      });

      // start polling the server to monitor jobs
      if (polling === false) {
        setPolling(true);
      }

      // clear state holding DNA sequence
      setDna("");
    }
  }

  return (
    <div className="mx-8 my-5">
      <p className="text-xl font-bold mb-5">Alignment Server</p>

      {/* form to submit DNA sequence */}
      <form onSubmit={handleSubmit} className="justify-center">
        <input
          type="text"
          value={dna}
          onChange={handleChange}
          placeholder="  Enter DNA sequence..."
          className="border-2 border-black rounded-md text-sm h-8"
        ></input>
        <button type="submit" className="bg-blue-100 hover:bg-blue-200 shadow-lg border-2 border-black rounded-md text-sm ml-3 px-2 h-8">
          Submit DNA sequence
        </button>
      </form>

      {/* display error message if submission not valid*/}
      {error ? (
        <span className="text-xs text-red-400">Invalid submission. Please check input sequence.</span>
      ) : (
        <span className="invisible text-xs text-red-400">Placeholder</span>
      )}

      {/* processing jobs */}
      <p className="text-lg font-medium mb-1">Jobs Processing ({jobsProcessing.length})</p>
      <div className="px-4 border-2 border-gray-800 rounded-md text-xs divide-y divide-gray-800">
        {jobsProcessing.length > 0 ? (
          jobsProcessing.map((alignment) => (
            <div key={alignment.id} className="py-2 my-2">
              <p>
                <span className="font-semibold">Job ID:</span> {alignment.id}
              </p>
              <p>
                <span className="font-semibold">Input DNA:</span> {alignment.input}
              </p>
            </div>
          ))
        ) : (
          <div className="flex align-center">
            <span className="font-semibold my-2">None</span>
          </div>
        )}
      </div>

      {/* completed jobs */}
      <p className="text-lg font-medium my-1">Jobs Completed ({jobsComplete.length})</p>
      <div className="px-4 border-2 border-gray-800 rounded-md text-xs divide-y divide-gray-800">
        {jobsComplete.length > 0 ? (
          jobsComplete.map((alignment) => {
            // job is complete and match found
            if (alignment.position > 0) {
              return (
                <div key={alignment.id} className="py-2 my-1 overflow-auto">
                  <p>
                    <span className="font-semibold">Job ID:</span> {alignment.id}
                  </p>
                  <p>
                    <span className="font-semibold">Input DNA:</span> {alignment.input}
                  </p>
                  <p>
                    <span className="font-semibold">Input translation:</span> {alignment.input_translation}
                  </p>
                  <p>
                    <span className="font-semibold">Protein sequence:</span> {alignment.protein_sequence}
                  </p>
                  <p>
                    <span className="font-semibold">Protein product:</span> {alignment.protein_product}
                  </p>
                  <p>
                    <span className="font-semibold">Protein ID:</span> {alignment.protein_id}
                  </p>
                  <p>
                    <span className="font-semibold">Position:</span> {alignment.position}
                  </p>
                </div>
              );
              // job is complete but no match found
            } else {
              return (
                <div key={alignment.id} className="py-2 my-1 overflow-auto">
                  <p>
                    <span className="font-semibold">Job ID:</span> {alignment.id}
                  </p>
                  <p>
                    <span className="font-semibold">Input DNA:</span> {alignment.input}
                  </p>
                  <p>
                    <span className="font-semibold">Input translation:</span> {alignment.input_translation}
                  </p>
                  <p>
                    <span className="font-semibold">Protein sequence:</span>{" "}
                    <span className="text-red-400">{alignment.protein_sequence}</span>
                  </p>
                </div>
              );
            }
          })
        ) : (
          <div className="flex align-center">
            <span className="font-semibold my-2">None</span>
          </div>
        )}
      </div>
    </div>
  );
}
