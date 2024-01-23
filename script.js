document.addEventListener('DOMContentLoaded', function () {

  
  const username = 'bedimcode';
  let itemsPerPage = 10;
  let currentPage = 1;
  let repositoriesData = [];
  let OriginalRepositoriesData = [];
  let searchTerm = null;
  let currentPageData = []; 
  let filteredRepo=[];
  let inputResults = ''
  const loader = document.getElementById('loader');

//  fetching Repositories
  function fetchRepositories() {
    showLoader(); 
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(repositories => {
        OriginalRepositoriesData = repositories;
        displayPage(currentPage);
        updatePagination();
      })
      .catch((error) => console.log('Error fetching repositories:', error))
  }

  
//  Display No. of  Repo on page 
  function displayPage(pageNumber) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    console.log('Hi' , inputResults)

    if ( inputResults.length > 0) {
           
          filteredRepo = repositoriesData.filter((repo) => repo.name.toLowerCase().startsWith(inputResults));
          repositoriesData = filteredRepo;
          repositoriesContainer.innerHTML = 'Please Wait';
          //  console.log('Hi' , inputResults)
          if(filteredRepo.length === 0 ){
            repositoriesContainer.innerHTML = '<p>No repositories Found with this Name</p>'
            return
          }
      }else{
        repositoriesData = OriginalRepositoriesData;
      }

    hideLoader()
  currentPageData = repositoriesData.slice(startIndex, endIndex);
    
 
    repositoriesContainer.innerHTML = '';
     
    currentPageData.forEach(repo => {
      const repoElement = document.createElement('div');

      repo.topics.forEach((topic) => {
        const button = document.createElement('button');
        button.textContent = topic;
        button.classList.add('topics');
        repoElement.appendChild(button);
      });

      repoElement.className = 'repository';

      repoElement.innerHTML = `
        <div class='grid-container'>
          <h2>${repo.name}</h2>
          <p>${repo.description || 'No description available'}</p>
          <div>
            ${repoElement.innerHTML || 'No Topics'}
          </div>
        </div>
      `;
      repositoriesContainer.appendChild(repoElement);
    });
  }

  // update pages 
  function updatePagination() {
    const totalPages = Math.ceil(repositoriesData.length / itemsPerPage);
    const paginationList = document.getElementById('pagination');
    paginationList.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('button');
      pageItem.textContent = i;
      pageItem.addEventListener('click', function () {
        currentPage = i;
        displayPage(currentPage);
        
        updatePagination();
      });

      paginationList.appendChild(pageItem);
    }
  }

  
  function updatePerPage() {
    itemsPerPage = parseInt(perPageSelect.value, 10);
    currentPage = 1;
    console.log(itemsPerPage);
    displayPage(currentPage);
    fetchRepositories();
    updatePagination();
  }

 
  function showLoader() {
    loader.style.display = 'block';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }

  // update Repositories as input value changes
  function inputValue(e) {
     inputResults = e.target.value;
     currentPage = 1;
    displayPage(currentPage);
    updatePagination();
}

//  search functionality implemented
  function searchRepositories() {
    searchTerm = searchInput.value.toLowerCase();

    currentPage = 1;
    displayPage(currentPage);
    updatePagination();
}

  fetchRepositories();


  const perPageSelect = document.getElementById('repoPerPage');
  const repositoriesContainer = document.getElementById('container');
  repoPerPage.addEventListener('click', updatePerPage())
  perPageSelect.addEventListener('change', updatePerPage);
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  searchButton.addEventListener('click', searchRepositories);
  searchInput.addEventListener('input', inputValue);
   
});
