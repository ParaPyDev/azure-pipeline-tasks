# ParaPy Azure Pipeline task for testing and releasing applications

Prerequisites:

- Install [Developer dependencies prerequisites](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops).
- Install [tfx-cli](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#4-package-your-extension)

Deploy:

`cd test-task; npm install; tsc; cd .. ; cd release-task ; npm install; cd ..`

and then:

`tfx extension publish --manifest-globs vss-extension.json --share-with ParaPy`