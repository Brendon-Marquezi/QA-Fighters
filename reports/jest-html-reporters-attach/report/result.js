window.jest_html_reporters_callback__({"numFailedTestSuites":21,"numFailedTests":3,"numPassedTestSuites":1,"numPassedTests":1,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":18,"numTodoTests":0,"numTotalTestSuites":22,"numTotalTests":4,"startTime":1723229864389,"success":false,"testResults":[{"numFailingTests":1,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1723229865594,"runtime":1110,"slow":false,"start":1723229864484},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/003-VerifyBasicAuthenticationErrorHandling.test.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mVerify basic authentication functionality\u001b[39m\u001b[22m\n\n    \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoBe\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // Object.is equality\u001b[22m\n\n    Expected: \u001b[32m400\u001b[39m\n    Received: \u001b[31m200\u001b[39m\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 21 |\u001b[39m   )\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 22 |\u001b[39m\u001b[22m\n\u001b[2m    \u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 23 |\u001b[39m   expect(response\u001b[33m.\u001b[39mstatus)\u001b[33m.\u001b[39mtoBe(\u001b[35m400\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m    |\u001b[39m                           \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 24 |\u001b[39m   expect(response\u001b[33m.\u001b[39mdata)\u001b[33m.\u001b[39mtoBe(\u001b[32m'you do not have permission'\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 25 |\u001b[39m })\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 26 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.toBe (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/authenticationAndAuthorization/003-VerifyBasicAuthenticationErrorHandling.test.js\u001b[39m\u001b[0m\u001b[2m:23:27)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":[],"duration":655,"failureMessages":["Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoBe\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m) // Object.is equality\u001b[22m\n\nExpected: \u001b[32m400\u001b[39m\nReceived: \u001b[31m200\u001b[39m\n    at Object.toBe (/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/003-VerifyBasicAuthenticationErrorHandling.test.js:23:27)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"],"fullName":"Verify basic authentication functionality","status":"failed","title":"Verify basic authentication functionality"}]},{"numFailingTests":1,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1723229865599,"runtime":1085,"slow":false,"start":1723229864514},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/001-BasicAuth.test.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mVerify basic authentication functionality\u001b[39m\u001b[22m\n\n    \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoHaveProperty\u001b[2m(\u001b[22m\u001b[32mpath\u001b[39m\u001b[2m)\u001b[22m\n\n    \u001b[1mMatcher error\u001b[22m: \u001b[31mreceived\u001b[39m value must not be null nor undefined\n\n    Received has value: \u001b[31mundefined\u001b[39m\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 19 |\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 20 |\u001b[39m   expect(response\u001b[33m.\u001b[39mstatus)\u001b[33m.\u001b[39mtoBe(\u001b[35m200\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m    \u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 21 |\u001b[39m   expect(response\u001b[33m.\u001b[39mdata[\u001b[35m0\u001b[39m])\u001b[33m.\u001b[39mtoHaveProperty(\u001b[32m'expand'\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m    |\u001b[39m                            \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 22 |\u001b[39m })\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 23 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.toHaveProperty (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/authenticationAndAuthorization/001-BasicAuth.test.js\u001b[39m\u001b[0m\u001b[2m:21:28)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":[],"duration":675,"failureMessages":["Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoHaveProperty\u001b[2m(\u001b[22m\u001b[32mpath\u001b[39m\u001b[2m)\u001b[22m\n\n\u001b[1mMatcher error\u001b[22m: \u001b[31mreceived\u001b[39m value must not be null nor undefined\n\nReceived has value: \u001b[31mundefined\u001b[39m\n    at Object.toHaveProperty (/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/001-BasicAuth.test.js:21:28)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"],"fullName":"Verify basic authentication functionality","status":"failed","title":"Verify basic authentication functionality"}]},{"numFailingTests":1,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1723229865600,"runtime":1097,"slow":false,"start":1723229864503},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/projectTesting/Integration Tests/015 Check if it is possible to list all visible projects.test.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mCheck if it is possible to list all visible projects\u001b[39m\u001b[22m\n\n    \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoBeGreaterThan\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\n    Expected: > \u001b[32m0\u001b[39m\n    Received:   \u001b[31m0\u001b[39m\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 26 |\u001b[39m   expect(response\u001b[33m.\u001b[39mstatus)\u001b[33m.\u001b[39mtoBe(\u001b[35m200\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 27 |\u001b[39m   expect(\u001b[33mArray\u001b[39m\u001b[33m.\u001b[39misArray(response\u001b[33m.\u001b[39mdata\u001b[33m.\u001b[39mvalues))\u001b[33m.\u001b[39mtoBe(\u001b[36mtrue\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m    \u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 28 |\u001b[39m   expect(response\u001b[33m.\u001b[39mdata\u001b[33m.\u001b[39mvalues\u001b[33m.\u001b[39mlength)\u001b[33m.\u001b[39mtoBeGreaterThan(\u001b[35m0\u001b[39m)\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m    |\u001b[39m                                       \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 29 |\u001b[39m })\u001b[33m;\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 30 |\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.toBeGreaterThan (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/projectTesting/Integration Tests/015 Check if it is possible to list all visible projects.test.js\u001b[39m\u001b[0m\u001b[2m:28:39)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":[],"duration":680,"failureMessages":["Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).\u001b[22mtoBeGreaterThan\u001b[2m(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nExpected: > \u001b[32m0\u001b[39m\nReceived:   \u001b[31m0\u001b[39m\n    at Object.toBeGreaterThan (/home/erik/Documents/QA-Fighters/tests/projectTesting/Integration Tests/015 Check if it is possible to list all visible projects.test.js:28:39)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"],"fullName":"Check if it is possible to list all visible projects","status":"failed","title":"Check if it is possible to list all visible projects"}]},{"numFailingTests":0,"numPassingTests":1,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1723229866485,"runtime":2002,"slow":false,"start":1723229864483},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/projectTesting/Integration Tests/018-Checkifitispossibletolisttheavailable project types.test.js","failureMessage":null,"testResults":[{"ancestorTitles":[],"duration":1678,"failureMessages":[],"fullName":"Check if it is possible to list the available project types","status":"passed","title":"Check if it is possible to list the available project types"}]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/integrationTests/024-GetUserGroups.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/integrationTests/023-BulkGetUsers.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/integrationTests/020-CreateUser.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/integrationTests/022-GetAllUsers.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/smokeTests/025-GetUserDefaultColumns.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/usersTestings/integrationTests/021-DeleteUser.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/projectTesting/Integration Tests/011-Checkwhetheranewprojectcanbecreatedsuccessfully.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/projectTesting/Integration Tests/012-Checkifyoucangetthedetailsofaproject.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/groups/smokeTests/042-VerifyDeletionOfAGroup.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/005-CheckExpirationOfAuthenticationTokens.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/groups/smokeTests/041-VerifyTheCreationOfAGroup.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/groups/integrationTests/044-Verify addingAUserToASpecificGroup.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/groups/integrationTests/043-VerifyUsersBelongingToASpecificGroup.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/authenticationAndAuthorization/004-VerifyOAuth2.0integration.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/issuesTesting/039-EditeCommentIssue.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/issuesTesting/038-IssueChangeLog.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/issuesTesting/035-DeletionAnIssue.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]},{"numFailingTests":0,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":0,"runtime":0,"slow":false,"start":0},"testFilePath":"/home/erik/Documents/QA-Fighters/tests/issuesTesting/033-EditeIssueName.test.js","failureMessage":"  \u001b[1m● \u001b[22mTest suite failed to run\n\n    Jest worker encountered 4 child process exceptions, exceeding retry limit\n\n      \u001b[2mat ChildProcessWorker.initialize (\u001b[22mnode_modules/jest-worker/build/workers/ChildProcessWorker.js\u001b[2m:181:21)\u001b[22m\n","testResults":[]}],"config":{"bail":0,"changedFilesWithAncestor":false,"ci":false,"collectCoverage":false,"collectCoverageFrom":[],"coverageDirectory":"/home/erik/Documents/QA-Fighters/coverage","coverageProvider":"v8","coverageReporters":["json","text","lcov","clover"],"detectLeaks":false,"detectOpenHandles":false,"errorOnDeprecated":false,"expand":false,"findRelatedTests":false,"forceExit":false,"json":false,"lastCommit":false,"listTests":false,"logHeapUsage":false,"maxConcurrency":5,"maxWorkers":6,"noStackTrace":false,"nonFlagArgs":[],"notify":false,"notifyMode":"failure-change","onlyChanged":false,"onlyFailures":false,"openHandlesTimeout":1000,"passWithNoTests":false,"projects":[],"reporters":[["default",{}],["/home/erik/Documents/QA-Fighters/node_modules/jest-html-reporters/index.js",{"publicPath":"./reports","filename":"report.html","expand":true,"pageTitle":"- Jira API Testing Framework Report - by QA Fighters Team","darkTheme":true,"openReport":true}]],"rootDir":"/home/erik/Documents/QA-Fighters","runTestsByPath":false,"seed":-1999963684,"skipFilter":false,"snapshotFormat":{"escapeString":false,"printBasicPrototype":false},"testFailureExitCode":1,"testPathPattern":"","testSequencer":"/home/erik/Documents/QA-Fighters/node_modules/@jest/test-sequencer/build/index.js","updateSnapshot":"new","useStderr":false,"watch":false,"watchAll":false,"watchman":true,"workerThreads":false},"endTime":1723229879586,"_reporterOptions":{"publicPath":"./reports","filename":"report.html","expand":true,"pageTitle":"- Jira API Testing Framework Report - by QA Fighters Team","hideIcon":false,"testCommand":"","openReport":true,"failureMessageOnly":0,"enableMergeData":false,"dataMergeLevel":1,"inlineSource":false,"urlForTestFiles":"","darkTheme":true,"includeConsoleLog":false,"stripSkippedTest":false},"logInfoMapping":{},"attachInfos":{}})