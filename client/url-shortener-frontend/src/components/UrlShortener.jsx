import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { shortenUrl } from "../api";

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: shortenUrl,
    onSuccess: (data) => setShortUrl(data.shortUrl),
    onError: () => {
      // Handle error state
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    mutation.mutate({ originalUrl: url, name: name });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h2 className="text-2xl font-bold text-white">URL Shortener</h2>
        <p className="text-blue-100 mt-2">Create short, memorable links for your URLs</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL to Shorten
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-link"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave blank for an auto-generated short link
            </p>
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading || !url}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {mutation.isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Shortening...
              </span>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-2">Your shortened URL</h3>
            <div className="flex items-center">
              <div className="flex-grow bg-white p-3 rounded-l-md border border-r-0 border-gray-300 truncate">
                <a
                  href={`/${shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {`${window.location.origin}/${shortUrl}`}
                </a>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-r-md border border-gray-300 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Created with name: {name || "(auto-generated)"}</p>
              <p className="mt-1">Share this link with your audience</p>
            </div>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;