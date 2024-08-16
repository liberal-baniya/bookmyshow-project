import { Button } from "@nextui-org/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PageNotFound = () => {
   const naviagte = useNavigate()
   return <div className="bg-background flex flex-col w-screen h-screen overflow-hidden justify-center items-center">
      <div className="">
         <h1 className="text-5xl font-semibold">404</h1>
         <p className="mb-4">page Not Found</p>
         <Button onClick={() => naviagte(-1)} startContent={<ArrowLeft />} size="sm">Back</Button>
      </div>
   </div>
}

export default PageNotFound
