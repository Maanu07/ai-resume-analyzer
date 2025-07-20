import { useState, type FormEvent, type FormEventHandler } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleFileSelect(file: File | null){
    setFile(file);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form)
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // console.log(companyName, jobTitle, jobDescription, file);
  }
  

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="resume-scan"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name"  placeholder="Company Name" id="company-name"/>
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title"  placeholder="Job Title" id="job-title"/>
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description"  placeholder="Job Description" id="job-description"/>
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type="submit" className="primary-button">Analyze Resume</button>
              
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
