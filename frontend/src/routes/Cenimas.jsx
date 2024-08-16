import { Card } from "@nextui-org/card";

const Cenimas = () => {
   return (
      <div className="flex w-full flex-col gap-3">
         {Array.from({ length: 10 }).map((_, i) => (
            <Card
               key={i}
               className="bg-background p-2 w-full min-h-16 border-1"
            >
               <div className="w-full flex justify-between">
                  <div>Hall Name</div>
                  <div>LIst of movies</div>
               </div>
            </Card>
         ))}
      </div>
   );
};
export default Cenimas;
