from requests import post, get
from random import choice
from time import sleep
from typing import List, TypedDict, Dict, Union, Iterable

WORKER_ID = "worker123"
URL = "http://localhost:8080/engine-rest/external-task/"
fetch_and_lock_url = URL + "fetchAndLock"
complete_url = lambda id: URL + id + "/complete"
unlock_url = lambda id: URL + id + "/unlock"


class TopicBase(TypedDict):
    topicName: str
    lockDuration: int


class Topic(TopicBase, total=False):
    variables: List[str]


class FetchAndLockBase(TypedDict):
    workerId: str
    maxTasks: int


class FetchAndLock(FetchAndLockBase, total=False):
    usePriority: bool
    topics: List[Topic]


class VariableBase(TypedDict):
    value: Union[str, int, bool, Dict]


class Variable(VariableBase, total=False):
    type: str
    valueInfo: Dict


class FetchAndLockResponse(TypedDict):
    activityId: str
    activityInstanceId: str
    errorMessage: str
    executionId: str
    id: str
    lockExpirationTime: str
    processDefinitionId: str
    processDefinitionKey: str
    processInstanceId: str
    tenantId: str
    retries: int
    workerId: str
    priority: int
    topicName: str
    variables: Dict[str, Variable]


class Complete(TypedDict):
    workerId: str
    variables: Dict[str, Variable]


def receive_tasks(interval: int = 1) -> Iterable[FetchAndLockResponse]:
    while True:
        response = post(
            fetch_and_lock_url,
            json=FetchAndLock(
                workerId=WORKER_ID,
                maxTasks=1,
                usePriority=True,
                topics=[
                    Topic(
                        topicName="analyze-bitcoin",
                        lockDuration=10_000,
                        variables=[],
                    )
                ],
            ),
        )
        if response.status_code == 200:
            yield from response.json()
        sleep(interval)


for task in receive_tasks(interval=1):
    response = get("https://api.coindesk.com/v1/bpi/currentprice.json")
    if response.status_code == 200:
        price = response.json()["bpi"]["EUR"]["rate_float"]
        buy = choice((True, False))
        print(f"Analyzing bitcoin at price {price}: {'BUY' if buy else 'HODL'}...")
        response = post(
            complete_url(task["id"]),
            json=Complete(
                workerId=WORKER_ID,
                variables={
                    "price": Variable(value=420),
                    "buy": Variable(value=True),
                },
            ),
        )
    else:
        print(f"Analysis failed, trying again later...")
        post(unlock_url(task["id"]))
