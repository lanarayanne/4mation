if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/4mation/sw.js')
    .then (function(reg) {
        console.log('Registration succeeded');
    }) .catch (function(error){
        console.log('Registration failed with' + error);
    });
}
