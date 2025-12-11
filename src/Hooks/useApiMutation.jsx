import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useApiMutation() {
  const axiosSecure = useAxiosSecure();

  const mutation = useMutation({
    mutationFn: async ({ url, method = "post", body }) => {
      const res = await axiosSecure[method](url, body);
      return res.data;
    },
  });

  return mutation;
}
