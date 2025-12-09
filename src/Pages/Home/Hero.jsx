import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

const banners = [
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/banner/IMG_2525.JPG",
  },
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/banner/1200_x_630_1.png",
  },
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/banner/Make-A-Putli_Worksho__CTC_1200_x_630_px_-_Ishrat_Mahnur_Orpita.png",
  },
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/thumbnails/Frame_46_1.jpg",
  },
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/thumbnails/IMG-20251206-WA0016_-_Ahnaf_Adib.jpg",
  },
  {
    img: "https://floral-mountain-2867.fly.storage.tigris.dev/media/events/thumbnails/1000x1000_-_Imtiaz_Ahmed_1.png",
  }
];

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto py-10">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        loop={true}
        effect="fade"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[300px] sm:h-[420px] md:h-[520px]">
              {/* Background Image */}
              <img
                src={banner.img}
                alt="Banner"
                className="w-full h-full object-fill"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
