import Typography from "@/components/ui/typography";
import { BombIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 max-w-96 text-center m-auto">
        <Typography variant="h1">Not found</Typography>
        <BombIcon width="100" height="100" className="block m-auto" />
        <p>
          Chucks. We tried searching under every rock, but we couldn't find the
          page you are looking for...
        </p>
      </div>
    </main>
  );
}
