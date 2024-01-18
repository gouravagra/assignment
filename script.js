let currentPage = 1;
const reposPerPage = 6;

async function fetchRepositories() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const repositoriesContainer = document.getElementById('repositories');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userLink = document.getElementById('user-link');
    const paginationContainer = document.getElementById('pagination');

    repositoriesContainer.innerHTML = '';

    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    try {
        // Fetch user information
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        // Display user information
        userAvatar.src = userData.avatar_url;
        userName.textContent = userData.name || username;
        userLink.innerHTML = `<a href="${userData.html_url}" target="_blank">GitHub Profile</a>`;

        // Fetch repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repositories = await response.json();

        const startIndex = (currentPage - 1) * reposPerPage;
        const endIndex = startIndex + reposPerPage;
        const displayedRepos = repositories.slice(startIndex, endIndex);

        displayedRepos.forEach(repo => {
            const card = document.createElement('div');
            card.classList.add('repository-card');

            const name = document.createElement('p');
            const link = document.createElement('a');

            link.href = repo.html_url;
            link.target = '_blank';
            link.textContent = repo.name;

            name.appendChild(link);
            card.appendChild(name);

            if (repo.description) {
                const description = document.createElement('p');
                description.textContent = repo.description;
                card.appendChild(description);
            }

            if (repo.language) {
                const techStack = document.createElement('p');
                techStack.textContent = `Tech Stack: ${repo.language}`;
                card.appendChild(techStack);
            }

            repositoriesContainer.appendChild(card);
        });

        addPagination(repositories.length, username);
    } catch (error) {
        console.error('Error fetching data:', error);
        repositoriesContainer.innerHTML = '<p>Error fetching data. Please check the username and try again.</p>';
        userAvatar.src = '';
        userName.textContent = '';
        userLink.innerHTML = '';
        paginationContainer.innerHTML = '';
    }
}

function addPagination(totalRepos, username) {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    const paginationContainer = document.getElementById('pagination');

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            fetchRepositories();
        };

        paginationContainer.appendChild(pageButton);
    }
}