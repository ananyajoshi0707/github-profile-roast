"use server";

import axios from "axios";

async function fetchGitHubReadme(username: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = response.data;
    const readmeRepo = repos.find(
      (repo: { name: string }) =>
        repo.name.toLowerCase() === `${username.toLowerCase()}`
    );

    if (readmeRepo) {
      const readmeResponse = await axios.get(
        `https://raw.githubusercontent.com/${username}/${username}/main/README.md`
      );
      return readmeResponse.data;
    } else {
      return "No README found for this user.";
    }
  } catch (error) {
    console.error("Error fetching GitHub README:", error);
    return "Error fetching GitHub README.";
  }
}

async function generateRoast(readme: string): Promise<string> {
  const prompt = `Roast this GitHub README in a brutal, savage, and impersonal way:\n\n${readme}. Don't write anything nice! Be ruthless!. Keep it impersonal and dark. Don't write too big of a roast, just 3-4 paragrahps.


  Give your response in plain text and remove any markdown, HTML, or links.
  
  `;

  try {
    const response = await axios.post(
      "https://phi.us.gaianet.network/v1/chat/completions",
      {
        model: "llama",
        messages: [
          {
            role: "system",
            content:
              "You are a ruthless, merciless critic that generates savage, dark, and impersonal roasts of GitHub READMEs. Your goal is to make the reader feel like they are being torn apart by a stranger.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating roast:", error);
    return "Error generating roast.";
  }
}

// async function cleanUpRoast(roast: string): Promise<string> {
//   const prompt = `Clean up this roast to remove any markdown, HTML, or links, and format it as plain text:\n\n${roast}`;

//   try {
//     const response = await axios.post(
//       "https://phi.us.gaianet.network/v1/chat/completions",
//       {
//         model: "llama",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an assistant that cleans up text by removing markdown, HTML, and links, and formats it as plain text.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//       }
//     );
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error("Error cleaning up roast:", error);
//     return "Error cleaning up roast.";
//   }
// }

export async function roastGitHubReadme(username: string): Promise<string> {
  const readme = await fetchGitHubReadme(username);
  if (readme === "Error fetching GitHub README.") {
    return "Couldn't fetch the README. Is the username correct?";
  }

  const roast = await generateRoast(readme);

  if (roast === "Error generating roast.") {
    return "Sorry, I couldn't come up with a good roast this time. Maybe your README is too awesome to roast!";
  }

  // const cleanedRoast = await cleanUpRoast(roast);

  // if (roast === "Error cleaning up roast.") {
  //   return "Sorry, I couldn't clean up the roast. Maybe your README is too awesome to roast!";
  // }

  return roast;
}
