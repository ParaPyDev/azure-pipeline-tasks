# ParaPy Azure Pipeline task for testing and releasing applications

![ParaPy Logo](https://s3-eu-west-1.amazonaws.com/parapy-cache/wp-content/uploads/2016/12/22134017/Logo_margin.png)

These Azure Pipeline tasks are provided by [ParaPy](https://parapy.nl) to aid in implementing Continuous integration and deployment.

## Usage



## Development

Prerequisites:

- Install [Developer dependencies prerequisites](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops).
- Install [tfx-cli](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#4-package-your-extension)

Install:

`cd test-task; npm install; tsc; cd .. ; cd release-task ; npm install; cd ..`

Deploy:

`tfx extension publish --manifest-globs vss-extension.json --share-with ParaPy`
