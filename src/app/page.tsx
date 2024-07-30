import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Contact information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Arnstein Gneis (CEO)
                </p>
                <a
                  href="mailto:arnstein.gneis@rigidbauta.no"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  arnstein.gneis@rigidbauta.no
                </a>
              </div>
              <a href="tel:+4797981877" className="ml-auto font-medium">
                +47 979 81 877
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>GØ</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Geir B. Ørresen (VP Digital)
                </p>
                <a
                  href="mailto:geir.bauxite.oerresen@rigidbauta.no"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  geir.bauxite.oerresen@rigidbauta.no
                </a>
              </div>
              <a href="tel:+4792807375" className="ml-auto font-medium">
                +47 928 07 375
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
