document.addEventListener('DOMContentLoaded', function() {
    // GitHub GraphQL API endpoint
    const apiUrl = 'https://api.github.com/graphql';
        
    // GitHub personal access token
    const accessToken = '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';

    // GraphQL query to fetch repository information
    const query = `
    query {
        viewer {
          repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
            nodes {
              name
              url
              primaryLanguage {
                name
              }
              repositoryTopics(first: 5) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }  
    `;

    // Function to fetch repository information from GitHub GraphQL API
    async function fetchRepoInfo() {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ query })
          });
          const { data } = await response.json();
          const repositories = data.viewer.repositories.nodes;
          // Log the repositories array
          console.log('Repositories:', repositories);
          const portfolioRepositories = repositories.filter(repo => {
            return repo.repositoryTopics.nodes.some(topic => topic.topic.name === 'portfolio');
          });


          portfolioRepositories.forEach(repo => {
            const container = document.getElementById(repo.name.toLowerCase().replace(/\s+/g, '-'));
            if (container) {
              container.innerHTML = `
                <a href="${repo.url}" target="_blank">
                  <img src="PLACEHOLDER_IMAGE_URL" alt="Thumbnail" width="100">
                  <!--<img src="https://raw.githubusercontent.com/AyushGoel0/${repo.name}/master/.github/thumbnail.jpg" alt="Thumbnail" width="100">-->
                </a>
                <p>${repo.name}</p>
                <p>${repo.primaryLanguage ? repo.primaryLanguage.name : 'Language not specified'}</p>
              `;
            }
          });
        } catch (error) {
          console.error('Error fetching repository information:', error);
        }
      }
      
    // Fetch repository information
    fetchRepoInfo();
});
