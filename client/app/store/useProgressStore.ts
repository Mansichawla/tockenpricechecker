import { create } from 'zustand';
import axios from 'axios';

interface ProgressStore {
  jobId: string | null;
  progress: number;
  isFetching: boolean;
  setJobId: (id: string) => void;
  fetchProgress: (jobId: string) => Promise<void>;
  clear: () => void;
}

const useProgressStore = create<ProgressStore>((set) => ({
  jobId: null,
  progress: 0,
  isFetching: false,

  setJobId: (id) => set({ jobId: id, isFetching: true }),

  fetchProgress: async (jobId) => {
    try {
    const interval = setInterval(async () => {
      const res = await axios.get(`http://localhost:5000/progress/${jobId}`);
      const currentProgress = res.data.progress;

      set({ progress: currentProgress });

      if (currentProgress >= 100) {
        clearInterval(interval);
        set({ isFetching: false });
      }
    }, 1000); // fetch every 1 second
  } catch (err) {
    console.error("Progress fetch failed", err);
    set({ isFetching: false });
  }
},
  clear: () => set({ jobId: null, progress: 0, isFetching: false }),
}));

export default useProgressStore;
