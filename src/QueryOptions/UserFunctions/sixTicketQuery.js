import useFetchData from "../../Hooks/useFetchData";

const useSixTickets = () => {
  return useFetchData("six-tickets", "/sixTickets");
};

export default useSixTickets;
