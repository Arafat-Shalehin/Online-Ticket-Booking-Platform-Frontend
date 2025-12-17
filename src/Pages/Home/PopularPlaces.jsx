import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PlaceCard from "../../Components/Cards/PlaceCard";

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/places.json");
        if (!res.ok) throw new Error("Failed to load places");
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
            Popular Places in Bangladesh
          </h2>
          <p className="text-slate-500">Loading places...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
            Popular Places in Bangladesh
          </h2>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="dark:*:text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">
              Discover
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              PoPular Places in Bangladesh
            </h2>
          </div>
          <p className="text-slate-500 max-w-md text-sm md:text-base">
            Explore the most loved beaches, hills, and cultural destinations
            across Bangladesh.
          </p>
        </div>

        {/* Swiper carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1.1}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1.3 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {places.map((place) => (
            <SwiperSlide key={place.id}>
              <PlaceCard place={place} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularPlaces;
