import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import ImageSkeleton from "./ImageSkeleton";

type ResumeCardProps = {
  resume: Resume;
};

const ResumeCard = ({ resume }: ResumeCardProps) => {
  const { companyName, jobTitle, imagePath, id, feedback } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadImg = async () => {
      const blob = await fs.read(imagePath); // read file from cloud storage
      if (!blob) return;
      let url = URL.createObjectURL(blob); // create object url from blob
      setResumeUrl(url);
    };

    loadImg();
  }, [imagePath]);

  return (
    <Link
      to={`resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h2 className="!text-black font-bold break-words">{jobTitle}</h2>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold break-words">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0 ">
          <ScoreCircle score={feedback?.overallScore} />
        </div>
      </div>
      {resumeUrl ? (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      ) : (
        <ImageSkeleton/>
      )}
    </Link>
  );
};

export default ResumeCard;
