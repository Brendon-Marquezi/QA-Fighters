window.jest_html_reporters_callback__({"numFailedTestSuites":1,"numFailedTests":1,"numPassedTestSuites":0,"numPassedTests":0,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":1,"numTotalTests":1,"startTime":1723732092215,"success":false,"testResults":[{"numFailingTests":1,"numPassingTests":0,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1723732093852,"runtime":1580,"slow":false,"start":1723732092272},"testFilePath":"C:\\Users\\gaaby\\Documents\\QA-Fighters\\tests\\users\\testEndToEnd\\027-GetOneEspecificUser.test.js","failureMessage":"\u001b[1m\u001b[31m  \u001b[1m● \u001b[22m\u001b[1mCreate a user if not exists and then get specific user from Jira\u001b[39m\u001b[22m\n\n    AxiosError: Request failed with status code 401\n\u001b[2m\u001b[22m\n\u001b[2m    \u001b[0m \u001b[90m 20 |\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 21 |\u001b[39m   \u001b[36masync\u001b[39m send(method\u001b[33m,\u001b[39m endpoint\u001b[33m,\u001b[39m params \u001b[33m=\u001b[39m {}\u001b[33m,\u001b[39m headers \u001b[33m=\u001b[39m {}\u001b[33m,\u001b[39m data \u001b[33m=\u001b[39m {}) {\u001b[22m\n\u001b[2m    \u001b[31m\u001b[1m>\u001b[22m\u001b[2m\u001b[39m\u001b[90m 22 |\u001b[39m     \u001b[36mreturn\u001b[39m \u001b[36mawait\u001b[39m \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39maxios\u001b[33m.\u001b[39mrequest({\u001b[22m\n\u001b[2m     \u001b[90m    |\u001b[39m            \u001b[31m\u001b[1m^\u001b[22m\u001b[2m\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 23 |\u001b[39m       method\u001b[33m:\u001b[39m method\u001b[33m,\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 24 |\u001b[39m       url\u001b[33m:\u001b[39m endpoint\u001b[33m,\u001b[39m\u001b[22m\n\u001b[2m     \u001b[90m 25 |\u001b[39m       params\u001b[33m:\u001b[39m params\u001b[33m,\u001b[39m\u001b[0m\u001b[22m\n\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat settle (\u001b[22m\u001b[2mnode_modules/axios/lib/core/settle.js\u001b[2m:19:12)\u001b[22m\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Unzip.handleStreamEnd (\u001b[22m\u001b[2mnode_modules/axios/lib/adapters/http.js\u001b[2m:599:11)\u001b[22m\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Axios.request (\u001b[22m\u001b[2mnode_modules/axios/lib/core/Axios.js\u001b[2m:45:41)\u001b[22m\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat RequestManager.send (\u001b[22m\u001b[2mcore/utils/requestManager.js\u001b[2m:22:12)\u001b[22m\u001b[2m\u001b[22m\n\u001b[2m      \u001b[2mat Object.<anonymous> (\u001b[22m\u001b[2m\u001b[0m\u001b[36mtests/users/testEndToEnd/027-GetOneEspecificUser.test.js\u001b[39m\u001b[0m\u001b[2m:135:30)\u001b[22m\u001b[2m\u001b[22m\n","testResults":[{"ancestorTitles":[],"duration":873,"failureMessages":["AxiosError: Request failed with status code 401\n    at settle (C:\\Users\\gaaby\\Documents\\QA-Fighters\\node_modules\\axios\\lib\\core\\settle.js:19:12)\n    at Unzip.handleStreamEnd (C:\\Users\\gaaby\\Documents\\QA-Fighters\\node_modules\\axios\\lib\\adapters\\http.js:599:11)\n    at Unzip.emit (node:events:531:35)\n    at endReadableNT (node:internal/streams/readable:1696:12)\n    at processTicksAndRejections (node:internal/process/task_queues:82:21)\n    at Axios.request (C:\\Users\\gaaby\\Documents\\QA-Fighters\\node_modules\\axios\\lib\\core\\Axios.js:45:41)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at RequestManager.send (C:\\Users\\gaaby\\Documents\\QA-Fighters\\core\\utils\\requestManager.js:22:12)\n    at Object.<anonymous> (C:\\Users\\gaaby\\Documents\\QA-Fighters\\tests\\users\\testEndToEnd\\027-GetOneEspecificUser.test.js:135:30)"],"fullName":"Create a user if not exists and then get specific user from Jira","status":"failed","title":"Create a user if not exists and then get specific user from Jira"}]}],"config":{"bail":0,"changedFilesWithAncestor":false,"ci":false,"collectCoverage":false,"collectCoverageFrom":[],"coverageDirectory":"C:\\Users\\gaaby\\Documents\\QA-Fighters\\coverage","coverageProvider":"v8","coverageReporters":["json","text","lcov","clover"],"detectLeaks":false,"detectOpenHandles":false,"errorOnDeprecated":false,"expand":false,"findRelatedTests":false,"forceExit":false,"json":false,"lastCommit":false,"listTests":false,"logHeapUsage":false,"maxConcurrency":5,"maxWorkers":2,"noStackTrace":false,"nonFlagArgs":["027"],"notify":false,"notifyMode":"failure-change","onlyChanged":false,"onlyFailures":false,"openHandlesTimeout":1000,"passWithNoTests":false,"projects":[],"reporters":[["default",{}],["C:\\Users\\gaaby\\Documents\\QA-Fighters\\node_modules\\jest-html-reporters\\index.js",{"publicPath":"./reports","filename":"report.html","expand":true,"pageTitle":"- Jira API Testing Framework Report - by QA Fighters Team","darkTheme":true,"openReport":true}]],"rootDir":"C:\\Users\\gaaby\\Documents\\QA-Fighters","runTestsByPath":false,"seed":1117383093,"skipFilter":false,"snapshotFormat":{"escapeString":false,"printBasicPrototype":false},"testFailureExitCode":1,"testPathPattern":"027","testSequencer":"C:\\Users\\gaaby\\Documents\\QA-Fighters\\node_modules\\@jest\\test-sequencer\\build\\index.js","updateSnapshot":"new","useStderr":false,"verbose":true,"watch":false,"watchAll":false,"watchman":true,"workerThreads":false},"endTime":1723732093862,"_reporterOptions":{"publicPath":"./reports","filename":"report.html","expand":true,"pageTitle":"- Jira API Testing Framework Report - by QA Fighters Team","hideIcon":false,"testCommand":"","openReport":true,"failureMessageOnly":0,"enableMergeData":false,"dataMergeLevel":1,"inlineSource":false,"urlForTestFiles":"","darkTheme":true,"includeConsoleLog":false,"stripSkippedTest":false},"logInfoMapping":{},"attachInfos":{}})