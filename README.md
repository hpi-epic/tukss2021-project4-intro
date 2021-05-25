# Building an ERP with BPMN &amp; Workflow Engines
## Demos using the Camunda Platform

### Bitcoin Analysis

In the fast-pacesd world of cryptocurrency, this demo by Fabian checks the Bitcoin price every minute using an external API. We then execute a bold investment strategy with the following:

```Python
from random import choice
buy = choice((True, False))
```

The check whether we spend more than we can is implemented in a DMN.

![BPMN diagram](bitcoin-analysis/analyze.png)

### Closing Time

After a long day in the home office, it's time to unwind in Caterina's demo. If it's been a tough day and you need a glass of wine, you can enter the required amount into a form with a generous default value. And the activity `drink wine` is also modeled. Cheers!

```HTML
<camunda:formField id="wine_need" label="Wine Need" type="long" defaultValue="5" />
```

![BPMN diagram](closing-time/ClosingTimeDiagramm.png)

## Exercise
Get to know the technologies used in this project:

* Install the Camunda Platform (the open-source workflow engine, we recommend using Docker) & the Camunda modeler: https://camunda.com/download/
* Follow the Camunda Quick Start guide: https://docs.camunda.org/get-started/quick-start/
* We recommend you follow the examples using JavaScript and NodeJS in the Quick Start Guide
* Note any observations you make along the way (feedback for the Camunda folks)
* Join the [Camunda University Slack](https://camunda-university.slack.com), search the [Camunda Forum](https://forum.camunda.org) or ask the teaching team in case of questions.
* Adapt the example to a small custom workflow that is relevant for you (and adapt the worker script). Maybe some data can be fetched from a [remote API](https://apilist.fun)?
* Publish the BPMN diagram and the worker code together with your notes in a separate folder in a forked repository and open a Pull Request to this repository with your changes

## Tips:
* Should you a direct URL of the deployed Camunda Engine not work, visit the root page, i.e. `localhost:8080` and navigate from there
* If prompted for a login, use `demo/demo`
* I've run into an issue with `external forms` and opened an issue on the Camunda Forum: https://forum.camunda.org/t/quick-start-guide-out-of-date-404-on-external-form/27314
