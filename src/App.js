import React, { useState } from "react";
import { atom, selector, useRecoilState, useRecoilValue, atomFamily, useRecoilCallback } from 'recoil';
import { v4 as uuid } from 'uuid';

const todosFamily = atomFamily({
  key: "todosFamily",
  default: {
    title: '',
    isDone: false,
  }
})

const todosIdsState = atom({
  key: "todosIds",
  default: [],
});

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


const App = () => {

  const [filter, setFilter] = useState("all")

  const [todosIds, setTodosIds] = useRecoilState(todosIdsState)
  const tasksComplete = useRecoilValue(tasksCompleteState)
  const tasksRemaining = useRecoilValue(tasksRemainingState)

  const insertTask = useRecoilCallback(({ set }) => {
    return (title: string) => {
      const newTodoId = uuid()
      set(todosIdsState, [...todosIds, newTodoId])
      set(todosFamily(newTodoId), { title: title, complete: false })
    }
  })

  const addTodo = (title?: string | null) => {
    title = prompt("What to do?");
    insertTask(title)
  };

  const onFilterButtonClick = () => {
    setFilter(filter === "all" ? "undone" : "all");
  };

  function ExpensiveTree() {
    let now = performance.now();

    while (performance.now() - now < 1000) {
      // Artificial delay -- do nothing for 1000ms
    }

    return null;
  }

  const deleteTodo = React.useCallback(function (id) {
    return function (e) {
      setTodosIds(prevIds => {
        const index = prevIds.findIndex((currentId) => currentId === id);

        let newIds = [...prevIds];
        if (index >= 0) {
          newIds.splice(index, 1);
        }
        console.log(' deleteTodo - newIds: ', newIds);
        return newIds
      })
    }
  }, [setTodosIds])

  const TodoListItem = React.memo(function (props) {

    const { id, deleteTodo } = props
    const [{ title, isDone }, setTask] = useRecoilState(todosFamily(id))

    return (
      <>
        {console.log(
          `Rendering todo with id = ${id}`
        )}
        <p>{`${isDone ? "✅ " : "🔥 "}${title}`}</p>
        <button onClick={() => {
          setTask({
            title,
            isDone: !isDone,
          })
        }}>
          {isDone ? "Undone" : "Done"}
        </button>
        <button onClick={deleteTodo(id)}>
          {"Delete"}
        </button>
      </>
    )
  })


  return (
    <>
      <p>
        {todosIds?.length
          ? `UnDone/Total todos ratio: ${tasksRemaining}/${tasksComplete + tasksRemaining}`
          : "Add your  first task "}
      </p>
      <ul>
        {todosIds
          .map((todoId) => (
            <TodoListItem
              id={todoId}
              key={todoId}
              deleteTodo={deleteTodo}
            />
          ))
        }
      </ul>
      <button onClick={(e) => addTodo()}>Add</button>
      {todosIds?.length ? (
        <button onClick={(e) => onFilterButtonClick()}>
          {`Show ${filter === "all" ? "undone" : "all"} todos`}
        </button>
      ) : (
        ""
      )}
      <ExpensiveTree />
    </>
  );
};

export default App;
