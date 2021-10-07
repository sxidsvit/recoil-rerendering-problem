## Problem

#### Why, after creating a new task, adding an element's id to an array with already existing id's, all elements are re-rendered?

#### This does not happen when we change the status of a task, but it happens when it is deleted.

---

![](./demo.gif)

### The source of the problem is changing the composition of array elements with ids

```js
const todosIdsState = atom({
  key: 'todosIds',
  default: [],
})

const tasksCompleteState = selector({
  key: 'tasksComplete',
  get: ({ get }) => {
    const taskIds = get(todosIdsState)
    const tasks = taskIds.map((id) => {
      return get(todosFamily(id))
    })
    return tasks.filter((task) => task.isDone).length
  },
})

const tasksRemainingState = selector({
  key: 'tasksRemaining',
  get: ({ get }) => {
    const taskIds = get(todosIdsState)
    const tasks = taskIds.map((id) => {
      return get(todosFamily(id))
    })
    return tasks.filter((task) => !task.isDone).length
  },
})

...

const tasksComplete = useRecoilValue(tasksCompleteState)
const tasksRemaining = useRecoilValue(tasksRemainingState)
```
