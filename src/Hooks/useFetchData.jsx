import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useFetchData = (queryKey, url, options = {}) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      const res = await axiosSecure.get(url);
      console.log(res.data);
      return res.data;
    },
    ...options,
  });
};

export default useFetchData;
