import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = (process.env.GITHUB_REPO ?? "hetpatel-11/Fluid").split("/");

export async function createUIPullRequest(
  jsCode: string,
  userRequest: string
) {
  try {
    const { data: ref } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
    const sha = ref.object.sha;

    const branchName = `fluid-ui-${Date.now()}`;
    await octokit.git.createRef({
      owner, repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });

    const filePath = `fluid-patches/${branchName}.js`;
    await octokit.repos.createOrUpdateFileContents({
      owner, repo,
      path: filePath,
      message: `UI change: ${userRequest.slice(0, 60)}`,
      content: Buffer.from(jsCode).toString("base64"),
      branch: branchName,
    });

    const { data: pr } = await octokit.pulls.create({
      owner, repo,
      title: `Fluid: ${userRequest.slice(0, 60)}`,
      body: `## User Request\n> "${userRequest}"\n\n## Generated Patch\n\`\`\`js\n${jsCode}\n\`\`\`\n\n*Created automatically by Fluid — software that changes when you speak.*`,
      head: branchName,
      base: "main",
    });

    return pr.html_url;
  } catch (e) {
    console.error("PR creation failed:", e);
    return null;
  }
}
