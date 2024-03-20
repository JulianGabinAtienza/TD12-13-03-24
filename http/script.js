fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})
.then(res => res.json())
.then(res => console.log(res[0]))
.catch(err => console.log(err));