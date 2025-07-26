import { prepareInstructions } from "@/constants";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdfToImg";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { fs, kv, ai, auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [auth.isAuthenticated]);

  function handleFileSelect(file: File | null) {
    setFile(file);
  }

  async function handleAnalyze({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]); // upload the file to the puter file system

    if (!uploadedFile) return setStatusText("Failed to upload the file");

    // convert the pdf file to image file & store it in the puter file system
    setStatusText("Converting to image...");
    const imgFile = await convertPdfToImage(file);

    if (!imgFile.file) return setStatusText("Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImgFile = await fs.upload([imgFile.file]);

    if (!uploadedImgFile) return setStatusText("Failed to upload the image");

    // save the user data to the database
    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImgFile.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: null,
    };
    await kv.set(`resume-${uuid}`, JSON.stringify(data)); // store key value pair in the database

    // generate the feedback from the AI
    setStatusText("Analyzing...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);

    // update the data to add feedback to the database
    await kv.set(`resume-${uuid}`, JSON.stringify(data));

    setStatusText("Analysis complete, redirecting...");

    navigate(`/resume/${uuid}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src='/images/resume-scan.gif'
                alt='resume-scan'
                className='w-full'
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id='upload-form'
              onSubmit={handleSubmit}
              className='flex flex-col gap-4'
            >
              <div className='form-div'>
                <label htmlFor='company-name'>Company Name</label>
                <input
                  type='text'
                  name='company-name'
                  placeholder='Company Name'
                  id='company-name'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='job-title'>Job Title</label>
                <input
                  type='text'
                  name='job-title'
                  placeholder='Job Title'
                  id='job-title'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='job-description'>Job Description</label>
                <textarea
                  rows={5}
                  name='job-description'
                  placeholder='Job Description'
                  id='job-description'
                />
              </div>
              <div className='form-div'>
                <label htmlFor='uploader'>Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type='submit' className='primary-button'>
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
