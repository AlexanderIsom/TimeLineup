"use client";
import { Button } from "@/components/ui/button";

export default function Page() {
  const createEvent = async () => {
    const res = await fetch("http://localhost:3000/api/addEvent", {
      method: "POST",
    });
  };

  return (
    <>
      <h1>
        events
        <Button onClick={createEvent}>test</Button>
      </h1>
    </>
  );
}
