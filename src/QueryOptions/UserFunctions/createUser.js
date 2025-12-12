import useApiMutation from "../../Hooks/useApiMutation";

export default function useCreateUser() {
  const mutation = useApiMutation();

  const createUser = (userData) => {
    return mutation.mutateAsync({
      url: "/registerUsers",
      method: "post",
      body: userData,
    });
  };

  return createUser;
}
