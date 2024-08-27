# ParaPy Cloud Tools extension

<a href="https://parapy.nl" rel="ParaPy">![ParaPy](https://s3-eu-west-1.amazonaws.com/parapy-cache/wp-content/uploads/2016/12/22134017/Logo_margin.png)</a>

This Azure extension provides Azure Pipeline tasks, provided by [ParaPy](https://parapy.nl), to aid in implementing Continuous integration and deployment for your ParaPy applications.

## Usage

- Request the `ParaPy Cloud Tools` extension through [support@parapy.nl](support@parapy.nl) or find the ParaPy Cloud Tools extension in the Marketplace.
- Accept the `ParaPy Cloud Tools` extension in Azure Devops.
- Utilize the provided tasks in your Azure pipelines. Please run on a `ubuntu 20.4` machine.

## Development of the extension

Prerequisites:

- Install [Developer dependencies prerequisites](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops).
- Install [tfx-cli](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#4-package-your-extension)

Install:

`cd test-task; npm install; tsc; cd .. ; cd release-task ; npm install; cd ..`

Deploy:

`tfx extension publish --manifest-globs vss-extension.json --share-with ParaPy`
