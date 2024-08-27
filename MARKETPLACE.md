# ParaPy Cloud Tools extension

<a href="https://parapy.nl" rel="ParaPy">![ParaPy](https://s3-eu-west-1.amazonaws.com/parapy-cache/wp-content/uploads/2016/12/22134017/Logo_margin.png)</a>

This Azure extension provides Azure Pipeline tasks, provided by [ParaPy](https://parapy.nl), to aid in implementing Continuous integration and deployment for your ParaPy applications.

## Installation

- Request the `ParaPy Cloud Tools` extension through [support@parapy.nl](support@parapy.nl) or find the ParaPy Cloud Tools extension in the Marketplace.
- Accept the `ParaPy Cloud Tools` extension in Azure Devops.
- Utilize the provided tasks in your Azure pipelines. Please run on a `ubuntu 20.4` machine.

## Example pipelines utilizing this extension

To test the application:
```yaml
trigger:
- '*'

parameters:
- name: pythonVersion
  displayName: Python version
  type: string
  default: '3.11'
  values:
  - '3.9'
  - '3.10'
  - '3.11'

jobs:
- job: Test
  pool:
    vmImage: ubuntu-20.04

  steps:
  - checkout: self

  - task: UsePythonVersion@0
    inputs:
      versionSpec: '${{ parameters.pythonVersion }}'
    displayName: 'Use Python ${{ parameters.pythonVersion }}'

  - task: ParaPy.parapy-tools.test-task.Test@1
    inputs:
      licenseKey1: '$(PARAPY_LICENSE_KEY_1)'
      licenseKey2: '$(PARAPY_LICENSE_KEY_2)'
      parapyPyPIUsername: '$(PARAPY_PYPI_USERNAME)'
      parapyPyPIPassword: '$(PARAPY_PYPI_PASSWORD)' 
```

To release the application:
```yaml
trigger: none

parameters:
- name: version
  displayName: Application version to release
  type: string
- name: deploy
  displayName: Whether to deploy the application if the release is successful
  type: boolean
  default: false

jobs:
- job: Release
  pool:
    vmImage: ubuntu-20.04

  steps:
  - checkout: self

  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.11'
    displayName: 'Use Python 3.11'

  - task: ParaPy.parapy-tools.release-task.Release@1
    inputs:
      parapyPyPIUsername: '$(PARAPY_PYPI_USERNAME)'
      parapyPyPIPassword: '$(PARAPY_PYPI_PASSWORD)'
      parapyCloudAddress: '$(PARAPY_CLOUD_URL)'
      serviceAccountIdentifier: '$(PARAPY_SERVICE_ACCOUNT_CLIENT_ID)'
      serviceAccountSecret: '$(PARAPY_SERVICE_ACCOUNT_SECRET)'
      parapyAppId: '$(PARAPY_APP_ID)'
      parapyAppVersion: '${{ parameters.version }}'
      deploy: '${{ parameters.deploy }}'
```