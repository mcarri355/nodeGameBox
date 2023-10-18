document.addEventListener('DOMContentLoaded', () => {
  // Replace this with the actual API endpoint to fetch top users
  fetch('/api/top-users')
    .then((response) => response.json())
    .then((data) => {
      const topUsersList = document.getElementById('top-users');

      data.topUsers.forEach((user) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.first_name} ${user.last_name}: ${user.points} points`;
        topUsersList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error('Error fetching top users: ', error);
    });
});

