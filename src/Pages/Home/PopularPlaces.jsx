import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Keyboard,
} from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PlaceCard from "../../Components/Cards/PlaceCard";
import PopularPlacesSkeleton from "../../Components/skeletons/PopularPlacesSkeleton";

const fetchPlaces = async () => {
  const res = await fetch("/places.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load places");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const PopularPlaces = () => {
  const reduceMotion = useReducedMotion();

  const {
    data: places = [],
    isError,
    error,
    refetch,
    isFetching,
    isPending, // TanStack v5
    isLoading, // TanStack v4
  } = useQuery({
    queryKey: ["popular-places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 60, // 1 hour (local JSON rarely changes)
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const initialLoading = isPending ?? isLoading;

  if (initialLoading) return <PopularPlacesSkeleton count={3} />;

  if (isError) {
    return (
      <section className="w-full bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-destructive">
                Failed to load popular places
                {error?.message ? (
                  <span className="font-normal text-destructive/80">
                    : {error.message}
                  </span>
                ) : null}
                .
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-sm btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!places.length) {
    return (
      <section className="w-full bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              No popular places available yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We’ll add more destinations soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Avoid loop when not enough slides (prevents weird duplication)
  const canLoop = places.length > 3;

  return (
    <section className="w-full bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Discover
            </p>

            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Popular Places in Bangladesh
              </h2>
              {isFetching && (
                <span
                  className="loading loading-spinner loading-sm text-primary"
                  aria-label="Refreshing popular places"
                />
              )}
            </div>
          </div>

          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Explore the most loved beaches, hills, and cultural destinations
            across Bangladesh.
          </p>
        </div>

        {/* Swiper carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
          a11y={{ enabled: true }}
          keyboard={{ enabled: true }}
          spaceBetween={24}
          slidesPerView={1.1}
          centeredSlides={false}
          loop={canLoop}
          watchOverflow
          autoplay={
            reduceMotion
              ? false
              : {
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1.3 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{
            "--swiper-theme-color": "var(--primary)",
            "--swiper-navigation-color": "var(--primary)",
          }}
          className="pb-10"
        >
          {places.map((place) => (
            <SwiperSlide key={place.id ?? place.name}>
              <PlaceCard place={place} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularPlaces;
