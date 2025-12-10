import useFetchData from "../Hooks/useFetchData";

const useAllTickets = () => {
  return useFetchData("all-tickets", "/allTickets");
};

export default useAllTickets;