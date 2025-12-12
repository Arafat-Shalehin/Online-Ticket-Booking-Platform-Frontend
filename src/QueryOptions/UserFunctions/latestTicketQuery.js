import useFetchData from "../../Hooks/useFetchData";

const useLatestTickets = () => {
  return useFetchData("latest-tickets", "/latestTickets");
};

export default useLatestTickets;