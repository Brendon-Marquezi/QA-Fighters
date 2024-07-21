const newman = require('newman');

newman.run({
    collection: require('./QA Fighters.postman_collection.json'),
    reporters: ['cli', 'html'],
    reporter: {
        html: {
            export: './newman/reports/htmlResults.html',
        }
    }
}, function (err) {
    if (err) { throw err;}
    console.log('collection run complete!');
});