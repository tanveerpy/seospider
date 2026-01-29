import { PageData } from './store';

const GITHUB_OWNER = 'tanveerpy'; // Replace with dynamic config if needed
const GITHUB_REPO = 'seospider';
const BRANCH = 'main';

// You would ideally get this from a user input or environment variable in a real verified app
// For this "Zero Cost" version, we might ask the user for a PAT in the settings.
let GITHUB_TOKEN = '';

export const setGithubToken = (token: string) => {
    GITHUB_TOKEN = token;
};

export const getGithubToken = () => GITHUB_TOKEN;

/**
 * Triggers the GitHub Action workflow
 */
export async function dispatchCrawlJob(url: string): Promise<string> {
    const jobId = crypto.randomUUID();

    if (!GITHUB_TOKEN) {
        throw new Error('GitHub PAT is missing. Please configure it in settings.');
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_type: 'start-crawl',
            client_payload: {
                url,
                job_id: jobId
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to dispatch job: ${response.statusText}`);
    }

    return jobId;
}

/**
 * Polls for the result in data/crawls/{jobId}.json
 */
export async function checkCrawlResult(jobId: string): Promise<PageData | null> {
    try {
        // We use the raw content API to avoid caching issues with GitHub Pages
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/data/crawls/${jobId}.json`, {
            headers: {
                // Optional: Token might improve rate limits, but raw user content is usually public if repo is public
                // 'Authorization': `Bearer ${GITHUB_TOKEN}` 
            },
            cache: 'no-store'
        });

        if (response.status === 404) {
            return null; // Not ready yet
        }

        if (response.ok) {
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data as PageData;
        }

    } catch (error) {
        console.warn('Polling error:', error);
    }

    return null;
}
