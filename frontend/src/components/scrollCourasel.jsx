import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

const CouraselBody = ({ children, amount = 400 }) => {
   const scrollRef = useRef();
   const [start, setIsAtStart] = useState(false);
   const [end, setIsAtEnd] = useState(false);

   useEffect(() => {
      const s = scrollRef.current;
      checkPosition(s);
   }, []);

   const checkPosition = (slider) => {
      setIsAtStart(() => (slider.scrollLeft <= 0 ? false : true));
      setIsAtEnd(() =>
         slider.scrollWidth - slider.scrollLeft === slider.clientWidth
            ? false
            : true,
      );
   };

   const handleScroll = (direction) => {
      if (!scrollRef.current) return;

      const s = scrollRef.current;
      if (direction === "left")
         s.scrollBy({
            top: 0,
            left: -amount,
            behavior: "smooth",
         });
      else
         s.scrollBy({
            top: 0,
            left: amount,
            behavior: "smooth",
         });
      checkPosition(s);
   };

   return (
      <>
         <div className="hidden sm:flex items-center justify-center bg-gradient-to-r from-background/40 to-background/50">
            {start && (
               <MdArrowLeft
                  className="w-3 scale-[2]"
                  cursor={"pointer"}
                  onClick={() => handleScroll("left")}
               />
            )}
         </div>
         <ScrollShadow
            ref={scrollRef}
            className="w-full flex gap-3 items-center"
            hideScrollBar
            // offset={10}
            orientation="horizontal"
         >
            {children}
         </ScrollShadow>

         <div className="hidden sm:flex items-center justify-center">
            {end && (
               <MdArrowRight
                  className="w-3 scale-[2]"
                  cursor={"pointer"}
                  onClick={() => handleScroll("right")}
               />
            )}
         </div>
      </>
   );
};

export default CouraselBody;
