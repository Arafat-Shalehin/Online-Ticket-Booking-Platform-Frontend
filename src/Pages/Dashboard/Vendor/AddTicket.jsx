import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useApiMutation from "../../../Hooks/useApiMutation";
import useAuthProfile from "../../../Hooks/useAuthProfile";
import Loader from "../../../Components/Common/Loader";

const perksOptions = [
  "AC",
  "Non-AC",
  "Breakfast",
  "Wi-Fi",
  "Sleeper",
  "Snacks",
];

const transportTypes = ["Bus", "Train", "Launch", "Plane"];

const imageHostingKey = import.meta.env.VITE_IMGBB_KEY;
const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddTicket = () => {
  const { mutateAsync: addTicket } = useApiMutation();
  const { user } = useAuth();
  const { userDetails } = useAuthProfile();
  // console.log(userDetails);
  const [serverError, setServerError] = useState("");
  const [progress, setProgress] = useState(0);
  const [vendorFraud, setVendorFraud] = useState(false);
  const [addLoad, setAddLoad] = useState(false);
  // const axiosSecure = useAxiosSecure();

  // console.log(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Loader Logic
  useEffect(() => {
    if (!addLoad) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [addLoad]);

  // Handle POST to DB
  const onSubmit = async (data) => {
    try {
      setAddLoad(true);
      setServerError("");

      if (userDetails?.isFraud === true) {
        toast.error("A fraud can not add tickets");
        setVendorFraud(true);
        return;
      }

      // 1. Upload image to imgbb
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgRes = await fetch(imageHostingUrl, {
        method: "POST",
        body: formData,
      });

      // console.log(imgRes);

      const imgData = await imgRes.json();
      if (!imgData.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imgData.data.url;

      // 2. Prepare ticket payload
      const ticketPayload = {
        image: imageUrl,
        title: data.title,
        price: Number(data.price),
        ticketQuantity: Number(data.ticketQuantity),
        transportType: data.transportType,
        perks: data.perks || [],
        from: data.from,
        to: data.to,
        departureDateTime: new Date(data.departureDateTime),
        vendorName:
          user?.displayName || userDetails?.displayName || "Unknown Vendor",
        vendorEmail: user?.email || userDetails?.email,
        verificationStatus: "pending",
      };

      // console.log(ticketPayload);

      // 3. Send to backend
      await addTicket({ url: "/ticket", method: "post", body: ticketPayload });
      // const res = await axiosSecure.post("/ticket", ticketPayload);
      // console.log(res);

      toast.success("Ticket added successfully!");
      reset();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err.message || "Something went wrong";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setAddLoad(false);
    }
  };

  if (addLoad) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Adding Tickets to DataBase..."
          subMessage="It may take a while..."
          progress={progress}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8 mt-10 shadow-2xl shadow-sky-200/60 ring-sky-200/80">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800 dark:text-slate-100">
        Add New Ticket
      </h2>

      {serverError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {serverError}
        </p>
      )}

      {vendorFraud && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This account cannot add tickets right now. If you think this is a
          mistake, please contact support or the administrator.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title, From, To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ticket Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Ticket Title
            </label>
            <input
              type="text"
              placeholder="e.g. Dhaka to Chittagong AC Bus"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Transport Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Transport Type
            </label>
            <select
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              {...register("transportType", {
                required: "Transport type is required",
              })}
            >
              <option value="" disabled>
                Select transport type
              </option>
              {transportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.transportType && (
              <p className="text-xs text-red-500 mt-1">
                {errors.transportType.message}
              </p>
            )}
          </div>

          {/* From */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              From (Location)
            </label>
            <input
              type="text"
              placeholder="e.g. Dhaka"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("from", { required: "From location is required" })}
            />
            {errors.from && (
              <p className="text-xs text-red-500 mt-1">{errors.from.message}</p>
            )}
          </div>

          {/* To */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              To (Location)
            </label>
            <input
              type="text"
              placeholder="e.g. Chittagong"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("to", { required: "To location is required" })}
            />
            {errors.to && (
              <p className="text-xs text-red-500 mt-1">{errors.to.message}</p>
            )}
          </div>
        </div>

        {/* Price, Quantity, Departure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Price (per unit)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 1200"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Ticket Quantity */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Ticket Quantity
            </label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 40"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("ticketQuantity", {
                required: "Ticket quantity is required",
                min: { value: 1, message: "At least 1 ticket is required" },
              })}
            />
            {errors.ticketQuantity && (
              <p className="text-xs text-red-500 mt-1">
                {errors.ticketQuantity.message}
              </p>
            )}
          </div>

          {/* Departure Date & Time */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Departure Date &amp; Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("departureDateTime", {
                required: "Departure date & time is required",
              })}
            />
            {errors.departureDateTime && (
              <p className="text-xs text-red-500 mt-1">
                {errors.departureDateTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Perks
          </label>
          <div className="flex flex-wrap gap-3">
            {perksOptions.map((perk) => (
              <label
                key={perk}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={perk}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  {...register("perks")}
                />
                <span>{perk}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Ticket Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Vendor Info (readonly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Vendor Name
            </label>
            <input
              type="text"
              readOnly
              value={user?.displayName || userDetails?.displayName || ""}
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-not-allowed"
            />
          </div>

          {/* Vendor Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              Vendor Email
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || ""}
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={addLoad || vendorFraud}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {addLoad ? "Adding..." : "Add Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
