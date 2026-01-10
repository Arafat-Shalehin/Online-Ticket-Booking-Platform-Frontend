import React from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { FaBusAlt, FaCheckCircle, FaLock, FaRegClock } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const banners = [
  {
    img: "https://images.pexels.com/photos/3678455/pexels-photo-3678455.jpeg",
  },
  {
    img: "https://images.pexels.com/photos/17274281/pexels-photo-17274281.jpeg",
  },
  {
    img: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg",
  },
  {
    img: "https://images.pexels.com/photos/3741058/pexels-photo-3741058.jpeg",
  },
  {
    img: "https://images.pexels.com/photos/5801657/pexels-photo-5801657.jpeg",
  },
  {
    img: "https://images.pexels.com/photos/258444/pexels-photo-258444.jpeg",
  },
];

const Hero = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        loop
        effect="fade"
        speed={700}
        autoplay={{ delay: 3800, disableOnInteraction: false }}
        pagination={{ dynamicBullets: true, clickable: true }}
        // Theme the swiper bullets using your CSS tokens
        style={{
          // Swiper accepts CSS variables here
          "--swiper-theme-color": "var(--primary)",
          "--swiper-pagination-bullet-inactive-color": "rgba(255,255,255,0.55)",
          "--swiper-pagination-bullet-inactive-opacity": "1",
        }}
        className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[58vh] min-h-[360px] max-h-[560px] w-full">
              {/* Background image */}
              <img
                src={banner.img}
                alt="TicketBari featured destination"
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />

              {/* Premium overlay: improves readability + calm mood */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0">
                <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:items-center sm:px-6 sm:pb-0 lg:px-8">
                  <div className="w-full max-w-2xl">
                    {/* Badge row */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur">
                        <FaBusAlt className="h-3.5 w-3.5" />
                        Bus • Train • Launch • Plane
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur">
                        Secure Stripe Payments
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                      Book travel tickets with a calm, premium experience.
                    </h1>

                    {/* Subtext */}
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                      Find routes, compare prices, and manage bookings in one
                      place. Fast checkout, clear status updates, and role-based
                      dashboards.
                    </p>

                    {/* CTAs */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        to="/all-tickets"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                      >
                        Explore tickets
                      </Link>

                      <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                      >
                        Go to dashboard
                      </Link>
                    </div>

                    {/* Trust points */}
                    <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                        <FaLock className="h-4 w-4 text-white/90" />
                        Secure checkout
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                        <FaRegClock className="h-4 w-4 text-white/90" />
                        Live countdown to departure
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                        <FaCheckCircle className="h-4 w-4 text-white/90" />
                        Clear booking statuses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end content */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
