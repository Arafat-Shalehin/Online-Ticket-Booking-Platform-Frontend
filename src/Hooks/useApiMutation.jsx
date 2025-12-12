import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useApiMutation() {
  const axiosSecure = useAxiosSecure();

  const mutation = useMutation({
    mutationFn: async ({ url, method = "post", body }) => {
      // console.log("MUTATION START");
      const res = await axiosSecure[method](url, body);
      // console.log("MUTATION END");
      return res.data;
    },
  });

  return mutation;
}
