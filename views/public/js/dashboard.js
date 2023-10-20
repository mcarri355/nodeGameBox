const leaderboard2 = document.getElementById('leaderboard');

async function leaderboard(){
    let {data} = await axios.get('/users/getUsers');
    console.log(data);
    let sorted = data.sort(compareScores);
    sorted.forEach((element) => {
        console.log(element)
        leaderboard2.innerHTML += `<li>${sorted.indexOf(element) + 1}.${element.first_name}: ${elemaent.highest_win_streak}</li>`;
    });
} 
function compareScores(a,b){
    return b.highest_win_streak - a.highest_win_streak;
}