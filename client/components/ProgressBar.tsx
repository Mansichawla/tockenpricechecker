import { useEffect } from 'react';
import useProgressStore from '../app/store/useProgressStore';

const ProgressBar = () => {
  const { jobId, progress, fetchProgress, isFetching, clear } = useProgressStore();

     useEffect(() => {
    if (jobId) {
      fetchProgress(jobId);
    }
  }, [jobId]);

  if (!isFetching) return null;

  return (
    <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <p className="text-sm text-white mt-1 text-center">{progress}%</p>
    </div>
  );
};

export default ProgressBar;
