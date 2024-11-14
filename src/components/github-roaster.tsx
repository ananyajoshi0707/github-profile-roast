"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { GithubIcon, CopyIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { roastGitHubReadme } from "@/actions"; // Adjust this import based on your actual file structure

export function GithubRoaster() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setRoast("");

      try {
        const result = await roastGitHubReadme(username);
        setRoast(result);
      } catch (err) {
        console.error("Error in handleSubmit:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again."
        );
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [username, toast]
  );

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(roast);
    toast({
      title: "Copied to clipboard",
      description: "The roast has been copied to your clipboard.",
    });
  }, [roast, toast]);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="bg-[#2b3137] text-white">
          <div className="flex items-center space-x-2">
            <GithubIcon className="w-8 h-8" />
            <CardTitle className="text-2xl">GitHub Profile Roaster</CardTitle>
          </div>
          <CardDescription className="text-gray-300">
            Enter a GitHub username to roast their profile
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                required
                className="flex-grow"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#2ea44f] hover:bg-[#2c974b]"
              >
                {loading ? "Roasting..." : "Roast!"}
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {loading ? (
            <div className="mt-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            roast && (
              <Card className="mt-6 bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Roast Result:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <ReactMarkdown>{roast}</ReactMarkdown>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="mt-4"
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
