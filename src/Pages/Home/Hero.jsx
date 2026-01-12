import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Pagination,
  A11y,
  Keyboard,
} from "swiper/modules";
import { useReducedMotion } from "framer-motion";
import { FaBusAlt, FaCheckCircle, FaLock, FaRegClock } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const banners = [
  { img: "https://images.pexels.com/photos/3678455/pexels-photo-3678455.jpeg" },
  {
    img: "https://images.pexels.com/photos/17274281/pexels-photo-17274281.jpeg",
  },
  { img: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg" },
  { img: "https://images.pexels.com/photos/3741058/pexels-photo-3741058.jpeg" },
  { img: "https://images.pexels.com/photos/5801657/pexels-photo-5801657.jpeg" },
  { img: "https://images.pexels.com/photos/258444/pexels-photo-258444.jpeg" },
];

const Hero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade, A11y, Keyboard]}
          loop
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          effect={reduceMotion ? "slide" : "fade"}
          speed={reduceMotion ? 300 : 700}
          autoplay={
            reduceMotion
              ? false
              : {
                  delay: 3800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          pagination={{ dynamicBullets: true, clickable: true }}
          aria-label="TicketBari hero banners"
          style={{
            "--swiper-theme-color": "var(--primary)",
            "--swiper-pagination-bullet-inactive-color":
              "rgba(255,255,255,0.55)",
            "--swiper-pagination-bullet-inactive-opacity": "1",
          }}
          className="relative overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.img ?? index}>
              <div className="relative h-[58vh] min-h-[360px] max-h-[560px] w-full">
                {/* Background image */}
                <img
                  src={banner.img}
                  alt={`Featured destination ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />

                {/* Readability overlays (intentionally black-based for image contrast) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0">
                  <div className="flex h-full items-end pb-8 sm:items-center sm:pb-0">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                      <div className="max-w-2xl">
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
                          Find routes, compare prices, and manage bookings in
                          one place. Fast checkout, clear status updates, and
                          role-based dashboards.
                        </p>

                        {/* CTAs (DaisyUI buttons) */}
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          {/* Adjust route if your app uses a different path */}
                          <Link
                            to="/all-tickets"
                            className="btn btn-primary btn-sm sm:btn-md"
                          >
                            Explore tickets
                          </Link>

                          <Link
                            to="/dashboard"
                            className="btn btn-sm sm:btn-md border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15"
                          >
                            Go to dashboard
                          </Link>
                        </div>

                        {/* Trust points */}
                        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <li className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                            <FaLock className="h-4 w-4 text-white/90" />
                            Secure checkout
                          </li>
                          <li className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                            <FaRegClock className="h-4 w-4 text-white/90" />
                            Live countdown to departure
                          </li>
                          <li className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 backdrop-blur">
                            <FaCheckCircle className="h-4 w-4 text-white/90" />
                            Clear booking statuses
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end content */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
