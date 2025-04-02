import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { redirectUrl } from "../api";
import { useMutation } from "@tanstack/react-query";

export default function Redirect() {
  const { url } = useParams();
  console.log("Short URL:", url);

  const mutation = useMutation({
    mutationFn: (shortUrl) => redirectUrl(shortUrl), // Pass URL to API
    onSuccess: (data) => {
      console.log("Redirect Response:", data);
     
        window.location.href = data; // Redirect to actual URL
     
    },
    onError: (error) => {
      console.error("Redirection failed:", error);
    },
  });

  useEffect(() => {
    if (url) {
      mutation.mutate(url);
    }
  }, [url]); // Trigger mutation when `url` param changes

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Redirecting...</p>
    </div>
  );
}
