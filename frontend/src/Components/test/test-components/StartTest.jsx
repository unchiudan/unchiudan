
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link } from "react-router-dom"

export function StartTest() {
  return (
    <div className="mx-auto py-[6rem] flex justify-center items-center ">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>BSSC 2nd इन्टर लेवल test</CardTitle>
        <CardDescription >( 27 जनवरी 2024)</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="number">Phone Number</Label>
              <Input id="number" placeholder="Enter your Phone number" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="districts">Districts</Label>
              <Select>
                <SelectTrigger id="districts">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/test">
        <Button variant="outline">Cancel</Button>
        </Link>
        <Link to="/liveTest">
        <Button>Start</Button>
        </Link>
      </CardFooter>
    </Card>
    </div>
  )
}
