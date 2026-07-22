"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatternExplorer } from "@/components/PatternExplorer";
import { PatternDrill } from "@/components/PatternDrill";

export default function BuildPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/"
          className="flex size-11 items-center justify-center rounded-full active:bg-muted"
          aria-label="Zurück"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <span className="text-sm font-medium text-muted-foreground">Sätze</span>
      </div>

      <Tabs defaultValue="erkunden" className="flex flex-1 flex-col">
        <TabsList className="h-12 w-full">
          <TabsTrigger value="erkunden" className="flex-1 text-base">
            Erkunden
          </TabsTrigger>
          <TabsTrigger value="drill" className="flex-1 text-base">
            Drill
          </TabsTrigger>
        </TabsList>

        <TabsContent value="erkunden" className="mt-5">
          <PatternExplorer />
        </TabsContent>
        <TabsContent value="drill" className="mt-5">
          <PatternDrill />
        </TabsContent>
      </Tabs>
    </main>
  );
}
