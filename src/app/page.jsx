"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useRef, useCallback } from "react";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'


export default function Home() {
  const { data: trending, isLoading } = useQuery({
    queryKey: ["Trending"],
    queryFn: Trending,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay({delay: 10000})], [WheelGesturesPlugin()]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
  const slideRef = useRef(null);

  if (isLoading) return <div>Loading...</div>; // Add a loading state

  return (
    <main className="bg-black">
      <section className="relative lg:h-[800px] h-[400px] ">
        <div className="w-screen absolute lg:h-[800px] h-[400px]">
          <div className="embla overflow-hidden h-full" ref={emblaRef}>
            <div
              className="flex flex-row items-center justify-start"
              style={{ height: "100%" }}
            >
              {trending.results.slice(0, 11).map((item) => (
                <div
                  key={item.id}
                  className="embla__slide h-full relative" // Ensure this has a position other than 'static'
                  ref={slideRef}
                >
                  <Image
                    key={item.id}
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt={item.title}
                    width={slideRef.current?.offsetWidth || 0}
                    height={slideRef.current?.offsetHeight || 0}
                    quality={100}
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-[999px]" />
                  <div className="absolute z-50 flex-col flex bottom-[100px] left-0 gap-3 transform  right-0 p-4 max-w-6xl px-4  ml-7    text-white">
                    
                        <h1 className="font-heading lg:text-5xl text-xl text-left mb-5">
                      {item.original_title || item.title || item.original_name || item.name}
                    </h1>
                    <p className="font-heading truncate ...  text-xl text-left mb-4">
                      {item.overview}...
                    </p>
                    <div className="flex flex-row gap-3 font-heading font-medium ">
                      <button className="bg-white text-black hover:bg-white/80 transition-all duration-300 py-2 px-5 rounded-full font-medium focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4">
                        More Info
                      </button>
                      <button className="border-white border-2 py-2 px-5 rounded-full transition-all hover:bg-white/20 duration-300">
                        Watch Trailer
                      </button>
                    </div>
                    
                 
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 items-center  absolute bottom-0 right-[100px]">
                    <button onClick={scrollPrev} className="p-4 w-auto bg-white rounded-full text-black">❮</button>
                    <button onClick={scrollNext} className="p-4 rounded-full bg-white text-black">❯</button>
                  </div>
      </section>
    </main>
  );
}

async function Trending() {
  const res = await fetch(
    "https://api.themoviedb.org/3/trending/all/day?language=en-US",
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    }
  );
  return res.json();
}
