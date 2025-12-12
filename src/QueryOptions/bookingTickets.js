import useFetchData from "../Hooks/useFetchData";

const useBookingTickets = ({ email, status } = {}) => {
  let url = "/bookedTickets";

  const params = [];
  if (email) params.push(`email=${email}`);
  if (status) params.push(`status=${status}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  return useFetchData(["booked-tickets", {email, status}], url, {
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    enabled: !!email,
  });
};

export default useBookingTickets;
